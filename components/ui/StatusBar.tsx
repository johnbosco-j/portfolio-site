"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/content/profile";

/**
 * Cockpit status bar — a fixed instrument strip along the bottom of the page (tablet and
 * up; phones keep their screen for the content).
 * Everything in it is live and real: the section you are reading, how far down the page you
 * are, the current time in Chennai, and the latest public push on GitHub. It is the
 * portfolio's own "readout", the same idea as Clareo's live panels.
 */

const SECTIONS: { id: string; label: string }[] = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "now", label: "Now" },
  { id: "ventures", label: "Ventures" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "moments", label: "Moments" },
  { id: "stack", label: "Stack" },
  { id: "recognition", label: "Recognition" },
  { id: "roadmap", label: "Next" },
  { id: "support", label: "Support" },
  { id: "contact", label: "Contact" },
];

export function StatusBar({ push }: { push: { name: string; url: string; pushedAt: string } | null }) {
  const [section, setSection] = useState("Intro");
  const [clock, setClock] = useState<string | null>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll();

  // Progress is written straight to the DOM — no re-render on every scroll frame.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${v})`;
    if (pctRef.current) pctRef.current.textContent = `${String(Math.round(v * 100)).padStart(3, "0")}%`;
  });

  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.5;
      let current = SECTIONS[0].label;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = s.label;
      }
      setSection(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Chennai time (IST), so a visitor anywhere knows what hour it is where he is.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const pushed = push
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(push.pushedAt))
    : null;

  return (
    <aside
      aria-label="Page status"
      className="fixed inset-x-0 bottom-0 z-40 hidden border-t-2 md:block border-line-strong bg-bg/95 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur md:text-[11px]"
    >
      {/* progress hairline sits on the top rule */}
      <span ref={barRef} aria-hidden="true" className="absolute inset-x-0 -top-[2px] h-[2px] origin-left scale-x-0 bg-ember-fill" />
      <div className="flex h-9 items-stretch justify-between md:h-10">
        <p className="flex items-center gap-2 border-r-2 border-line-strong px-3 md:px-4">
          <span className="pulse-dot size-1.5 rounded-full bg-signal" aria-hidden="true" />
          <span className="text-ink-2">{section}</span>
        </p>
        <p className="flex items-center gap-2 border-r-2 border-line-strong px-3 md:px-4">
          <span className="hidden sm:inline">Scroll</span>
          <span ref={pctRef} className="tabular-nums text-ink-2">
            000%
          </span>
        </p>
        <div className="flex flex-1 items-center justify-end">
          {push && (
            <a
              href={push.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 border-l-2 border-line-strong px-4 transition-colors hover:bg-panel hover:text-ink lg:flex"
            >
              Last push · <span className="text-ink-2">{push.name}</span> · {pushed}
            </a>
          )}
          <p className="hidden items-center gap-2 border-l-2 border-line-strong px-4 sm:flex">
            Chennai <span className="tabular-nums text-ink-2">{clock ?? "--:--"}</span> IST
          </p>
          <a
            href="#contact"
            className="flex items-center gap-2 border-l-2 border-ember bg-ember-fill px-4 text-white transition-colors hover:bg-[#E5383B]"
          >
            {site.navCta.label}
          </a>
        </div>
      </div>
    </aside>
  );
}
