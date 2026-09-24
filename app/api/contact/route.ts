import { NextResponse } from "next/server";
import { site } from "@/content/profile";

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes.
// Per-instance on serverless; swap for Upstash/Vercel KV if abuse appears.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const isForm = !(req.headers.get("content-type") ?? "").includes("application/json");
  const done = (json: Record<string, unknown>, status = 200) =>
    isForm ? NextResponse.redirect(new URL(status === 200 ? "/?sent=1#contact" : "/?error=1#contact", req.url), 303) : NextResponse.json(json, { status });

  if (limited(ip)) return done({ error: "Too many messages — please try again in a few minutes." }, 429);

  let body: Record<string, unknown>;
  try {
    body = isForm ? Object.fromEntries((await req.formData()).entries()) : await req.json();
  } catch {
    return done({ error: "Invalid request." }, 400);
  }

  // Honeypot filled → pretend success, drop silently.
  if (str(body.website, 200)) return done({ ok: true });

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const topic = str(body.topic, 40);
  const message = str(body.message, 4000);

  if (!name || !EMAIL.test(email) || message.length < 10 || !(site.contact.topics as readonly string[]).includes(topic)) {
    return done({ error: "Please fill in every field with a valid email and a short message." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.info("[contact] (no RESEND_API_KEY/CONTACT_TO_EMAIL set — logging only)", { name, email, topic, message });
    return done({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Johnbosco <noreply@rivendevs.in>",
      to: [to],
      reply_to: email,
      subject: `[Portfolio · ${topic}] ${name}`,
      html: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt; — ${esc(topic)}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return done({ error: "I couldn't send that just now. Please email hello@rivendevs.in instead." }, 502);
  }
  return done({ ok: true });
}
