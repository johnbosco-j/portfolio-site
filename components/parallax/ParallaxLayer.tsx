"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useMotionScale } from "@/lib/hooks";

/**
 * The only way sections move with scroll (skills.md: never hand-roll listeners).
 *
 * speed = how far the layer travels relative to scroll:
 *   L0 horizon 0.15 · L1 atmosphere 0.35 · L2 content 1.0 · L3 foreground 1.2–1.4
 *
 * Offset = (1 - speed) × distance across the element's time in the viewport.
 * Reduced motion → 0; < 768px → half distance. Only `transform` is animated.
 */
export function ParallaxLayer({
  speed,
  distance = 480,
  className = "",
  style,
  children,
  "aria-hidden": ariaHidden,
  desktopOnly = false,
}: {
  speed: number;
  /** Scroll distance in px over which the speed difference is applied. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-hidden"?: boolean;
  /** Skip the effect below 768px (for many small layers, e.g. tile previews). */
  desktopOnly?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionScale = useMotionScale();
  const scale = desktopOnly && motionScale < 1 ? 0 : motionScale;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = (1 - speed) * distance * scale;
  const y = useTransform(scrollYProgress, [0, 1], [-shift / 2, shift / 2]);

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }} aria-hidden={ariaHidden}>
      {children}
    </motion.div>
  );
}
