"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Parallax multiplier for the current device:
 * 0 with reduced motion, 0.75 on screens < 768px (phones get depth too), 1 otherwise.
 */
export function useMotionScale() {
  const reduce = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px)");
  if (reduce) return 0;
  return mobile ? 0.75 : 1;
}

