"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveal (laptop/desktop only), fail-safe: content is visible by default. Only once this observer is
 * running does it add `reveal-on` to <html> (which lets CSS hide [data-reveal] items), and it
 * marks everything already on screen as revealed in the same frame. New elements (client
 * navigation, streaming, hot reload) are picked up by a MutationObserver. If JS never runs or
 * fails, nothing is ever hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    // Laptops/desktops only: on phones and tablets content is always shown instantly, so a
    // fast flick never lands on an empty screen.
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover)").matches;
    if (!desktop || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    const watch = (el: Element) => {
      if (el.classList.contains("is-in")) return;
      const r = el.getBoundingClientRect();
      // Already on screen or scrolled past → show immediately (no flash of hidden content).
      if (r.top < window.innerHeight) el.classList.add("is-in");
      else io.observe(el);
    };
    document.querySelectorAll("[data-reveal]").forEach(watch);
    root.classList.add("reveal-on");

    const mo = new MutationObserver((muts) => {
      for (const m of muts)
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-reveal]")) watch(n);
          n.querySelectorAll?.("[data-reveal]").forEach(watch);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: never leave anything hidden for long.
    const safety = window.setTimeout(() => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.5) el.classList.add("is-in");
    }), 2500);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(safety);
    };
  }, [pathname]);
  return null;
}
