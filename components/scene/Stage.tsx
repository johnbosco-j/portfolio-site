"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { theme } from "@/content/theme";
import type { CastSceneProps } from "./CastScene";

/** three.js never renders on the server, and never ships until a stage is actually near. */
const CastScene = dynamic(() => import("./CastScene"), { ssr: false });

/**
 * Gate around a <CastScene>.
 *
 * The troupe appears in several places down the page, and a WebGL context per stage would
 * be wasteful at best — browsers cap how many a document may hold, and the oldest get
 * dropped on the floor when you pass the cap. So a stage mounts only when it comes within
 * a screen of the viewport and unmounts once it is well past, which both releases the
 * context and stops the scene's own bundle from loading for a section nobody scrolled to.
 *
 * `prime` keeps the hero's stage from waiting on an observer that has not run yet; it is
 * already on screen, so it loads as soon as the browser goes idle.
 */
export function Stage({ prime = false, className = "", ...props }: CastSceneProps & { prime?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!theme.scene) return;
    const el = ref.current;
    if (!el) return;

    // The hero's stage is on screen at load: wait for idle rather than for a scroll.
    if (prime) {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      const id = w.requestIdleCallback
        ? w.requestIdleCallback(() => setLive(true), { timeout: 2500 })
        : window.setTimeout(() => setLive(true), 1400);
      return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
    }

    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [prime]);

  return <div ref={ref} className={className}>{live && <CastScene {...props} className="size-full" />}</div>;
}
