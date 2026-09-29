"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { RobotHandle } from "@/lib/robot/scene";
import { site } from "@/content/profile";
import { Corners } from "@/components/ui/InstrumentPanel";

/**
 * Riv, Riven's robot, as a small cameo beside the contact form. three.js and the
 * model load lazily (dynamic import) only when the section nears the viewport, render only
 * while visible, and Riv waves each time `waves` increases (a message was sent).
 */
export function RivCameo({ waves }: { waves: number }) {
  const j = site.riv;
  const stage = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const robot = useRef<RobotHandle | null>(null);
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let cancelled = false;
    const near = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        setStatus("loading");
        try {
          const { createRobot } = await import("@/lib/robot/scene");
          const handle = await createRobot(el, { still: !!reduce, onState: (s) => setWaving(s === "Wave") });
          if (cancelled) return handle.dispose();
          robot.current = handle;
          setStatus("ready");
        } catch {
          if (!cancelled) setStatus("error");
        }
      },
      { rootMargin: "600px 0px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      robot.current?.dispose();
      robot.current = null;
    };
  }, [reduce]);

  // Render only while visible (paused off-screen).
  useEffect(() => {
    const el = stage.current;
    if (!el || status !== "ready") return;
    let visible = false;
    const sync = () => robot.current?.setActive(visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }, { threshold: 0.2 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [status]);

  // Gaze follows the pointer.
  useEffect(() => {
    if (status !== "ready" || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.current?.getBoundingClientRect();
      if (!r) return;
      robot.current?.lookAt((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.8), (e.clientY - (r.top + r.height * 0.35)) / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [status, reduce]);

  // Wave when a message is sent.
  useEffect(() => {
    if (waves > 0) robot.current?.emote("Wave");
  }, [waves, status]);

  const live = status === "ready";
  const label = !live ? (status === "error" ? j.status.offline : j.status.loading) : waving ? j.status.waving : j.status.idle;

  return (
    <div ref={stage} className="spotlight relative overflow-hidden rounded-bento border border-line bg-panel/60 shadow-hairline">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_60%,black_20%,transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgb(229_56_59/0.16),transparent_65%)]" />
      <Corners />
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-4 font-mono text-micro uppercase">
        <span className="text-ink-2">
          {j.name} <span className="text-faint">· {j.role}</span>
        </span>
        <span className="flex items-center gap-2 text-faint" aria-live="polite">
          <span className={`size-1.5 rounded-full ${live ? "pulse-dot bg-signal" : "bg-faint"}`} aria-hidden="true" />
          {label}
        </span>
      </div>
      <p key={waves} className="bubble-in relative z-10 mx-auto mt-4 w-fit max-w-[28ch] rounded-2xl border border-line bg-panel-2/90 px-4 py-2 text-center text-[14px] text-ink" role="status">
        {waves > 0 ? j.sent : j.idle}
      </p>
      <button
        type="button"
        onClick={() => robot.current?.emote("Wave")}
        aria-label={`${j.name}, ${j.role} — press to make it wave`}
        className="relative block h-[240px] w-full cursor-pointer touch-manipulation md:h-[280px]"
      >
        <div ref={mount} aria-hidden="true" className="absolute inset-0" />
        {!live && (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <span className="relative size-20">
              <span className="spin-12 absolute inset-0 rounded-full border border-ember/30 border-t-ember" />
              <span className="absolute inset-[38%] rounded-full bg-ember/15" />
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
