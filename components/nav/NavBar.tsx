"use client";

import { Menu, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Mark } from "@/components/brand/Mark";
import { LINKS, profile, site } from "@/content/profile";
import { homeHref } from "@/lib/links";

const SECTION_IDS = ["top", "about", "now", "ventures", "work", "journey", "moments", "stack", "recognition", "roadmap", "support", "contact"];

/**
 * Ruled poster header: a logo cell, a live "open to work" cell, and a row of equal
 * nav cells divided by hard rules. A red reading-progress line sits on the bottom rule.
 */
export function NavBar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const update = useCallback(() => {
    const mid = window.innerHeight * 0.5;
    let current: string | null = null;
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = id;
    }
    setActive(current);
  }, []);
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [update, pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-line-strong bg-bg/95 backdrop-blur">
      {/* Row 1 — mark · status · CTA */}
      <div className="flex h-14 items-stretch justify-between">
        <a href={onHome ? "#top" : "/"} className="flex items-center gap-2.5 border-r-2 border-line-strong px-4 md:px-5" aria-label={`${profile.firstName} — ${onHome ? "back to top" : "home"}`}>
          <Mark size={30} />
          <span className="display text-[17px] text-ink">{profile.firstName}</span>
        </a>

        <div className="flex items-stretch">
          {site.hero.status.open && (
            <p className="hidden items-center gap-2 border-l-2 border-line-strong px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 sm:flex">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="ping absolute inset-0 rounded-full bg-signal" />
                <span className="relative size-2 rounded-full bg-signal" />
              </span>
              Open to work
            </p>
          )}
          <a
            href={homeHref(site.navCta.href, onHome)}
            className="hidden items-center border-l-2 border-line-strong bg-ember-fill px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#E5383B] md:flex"
          >
            {site.navCta.label}
          </a>
          <button
            type="button"
            className="flex size-14 items-center justify-center border-l-2 border-line-strong text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Row 2 (phones) — four compact cells, like the ruled desktop row */}
      <nav aria-label="Primary" className="grid grid-cols-4 border-t-2 border-line-strong md:hidden">
        {site.nav.slice(0, 4).map((item, i) => {
          const isActive = onHome && active === item.href.slice(1);
          return (
            <a
              key={item.href}
              href={homeHref(item.href, onHome)}
              aria-current={isActive ? "true" : undefined}
              className={`py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.12em] ${i < 3 ? "border-r-2 border-line-strong" : ""} ${
                isActive ? "bg-ember/10 text-ember" : "text-muted active:bg-panel"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Row 2 — ruled nav cells (desktop) */}
      <nav aria-label="Primary" className="hidden border-t-2 border-line-strong md:block">
        <ul className="grid grid-cols-5">
          {site.nav.map((item, i) => {
            const isActive = onHome && active === item.href.slice(1);
            return (
              <li key={item.href} className={i > 0 ? "border-l-2 border-line-strong" : ""}>
                <a
                  href={homeHref(item.href, onHome)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex h-11 items-center justify-center font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    isActive ? "bg-ember/10 text-ember" : "text-muted hover:bg-panel hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Reading progress on the bottom rule */}
      <motion.span aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-[2px] h-[2px] origin-left bg-ember-fill" />

      {/* Mobile: full-screen numbered menu */}
      {open && (
        <div id="mobile-menu" className="menu-sheet fixed inset-0 top-[90px] -z-10 flex flex-col overflow-y-auto border-t-2 border-line-strong bg-bg px-5 pb-8 pt-6 md:hidden">
          <ul className="flex flex-col">
            {site.nav.map((item, i) => (
              <li key={item.href} className="menu-item border-b-2 border-line-strong" style={{ ["--i" as string]: i }}>
                <a href={homeHref(item.href, onHome)} onClick={() => setOpen(false)} className="display flex items-baseline gap-4 py-4 text-[34px] text-ink active:text-ember">
                  <span className="font-mono text-[12px] not-italic text-ember">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-item mt-auto flex flex-col gap-4 pt-8" style={{ ["--i" as string]: site.nav.length }}>
            <a
              href={homeHref(site.navCta.href, onHome)}
              onClick={() => setOpen(false)}
              className="flex h-14 items-center justify-center border-2 border-ember bg-ember-fill font-mono text-[13px] uppercase tracking-[0.14em] text-white"
            >
              {site.navCta.label}
            </a>
            <div className="flex items-center justify-between font-mono text-[12px] text-faint">
              <a href={`mailto:${LINKS.email}`} className="py-2">{LINKS.email}</a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="py-2">
                GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
