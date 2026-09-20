"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * Sets a line of display type to exactly fill its container's width — no guessing with
 * viewport units, so the name never spills off the edge or leaves a gap on any device.
 *
 * The line is measured at a reference size and the font size is then written straight to the
 * element (not through React state, which a re-render could wipe mid-measurement). It
 * re-measures when the container resizes and once the webfont has loaded. Before JS runs —
 * and with no JS at all — the `fallback` clamp keeps it readable.
 */
const REFERENCE = 100;

export function FitText({
  children,
  className = "",
  fallback = "clamp(40px, 12vw, 160px)",
  max = 260,
}: {
  children: ReactNode;
  className?: string;
  /** CSS font-size used until the measurement runs (and with no JS). */
  fallback?: string;
  /** Never grow past this many pixels. */
  max?: number;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const available = box.clientWidth;
    // Ignore measurements taken before the layout has settled.
    if (available < 200) return;
    // The line is inline-block, so its box shrinks to the text: that width is the real one.
    text.style.fontSize = `${REFERENCE}px`;
    const natural = text.getBoundingClientRect().width;
    if (natural < 1) {
      text.style.fontSize = fallback;
      return;
    }
    text.style.fontSize = `${Math.min(max, (available / natural) * REFERENCE)}px`;
  }, [max, fallback]);

  useEffect(() => {
    // Measure after layout, then again when the webfont lands.
    const raf = requestAnimationFrame(() => requestAnimationFrame(fit));
    const box = boxRef.current;
    const ro = box ? new ResizeObserver(fit) : null;
    if (box && ro) ro.observe(box);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [fit]);

  return (
    <span ref={boxRef} className="block w-full">
      <span ref={textRef} className={`inline-block whitespace-nowrap ${className}`} style={{ fontSize: fallback }}>
        {children}
      </span>
    </span>
  );
}
