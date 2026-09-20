"use client";

import { useEffect, useRef } from "react";
import { startTilt, tiltX, tiltY } from "@/lib/tilt";

/**
 * Site-wide L0 layer: a slow, drifting star field in three depth layers that shifts with
 * scroll (0.06–0.3×) and with the mouse / phone tilt. A few stars carry the red accent.
 * Two glow orbs drift behind it (CSS). One <canvas>, no libraries. Pauses
 * when the tab is hidden; reduced motion draws a single still frame.
 */

const EMBER = "229, 56, 59";

const LAYERS = [
  { depth: 0.06, size: 0.7, alpha: 0.34, drift: 0.012, link: 0 },
  { depth: 0.15, size: 1.0, alpha: 0.5, drift: 0.02, link: 110 },
  { depth: 0.3, size: 1.4, alpha: 0.7, drift: 0.03, link: 140 },
] as const;

type Star = { x: number; y: number; vx: number; vy: number; layer: number; ember: boolean; phase: number };

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let raf = 0;
    let last = performance.now();
    const eased = { x: 0, y: 0 };
    let ink = "238, 240, 234";
    const strength = 1;

    const readTheme = () => {
      const s = getComputedStyle(document.documentElement);
      ink = s.getPropertyValue("--ink").trim().split(/\s+/).join(", ") || ink;
      if (reduce) draw(0, 0);
    };

    const seed = () => {
      const mobile = w < 768;
      const count = Math.round(Math.min(mobile ? 45 : 90, (w * h) / (mobile ? 9000 : 15000)));
      stars = Array.from({ length: count }, (_, i) => {
        const layer = i % 3;
        const angle = Math.random() * Math.PI * 2;
        const speed = LAYERS[layer].drift * (0.5 + Math.random());
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          layer,
          ember: Math.random() < 0.07,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const widthChanged = window.innerWidth !== w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || stars.length === 0) seed();
    };

    const wrap = (v: number, max: number) => ((v % max) + max) % max;

    function draw(t: number, dt: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const scroll = reduce ? 0 : window.scrollY;
      const scale = w < 768 ? 0.75 : 1;
      const reach = w < 768 ? 150 : 110;
      eased.x += (tiltX.get() * reach - eased.x) * 0.05;
      eased.y += (tiltY.get() * reach - eased.y) * 0.05;

      const pos: { x: number; y: number; s: Star }[][] = [[], [], []];
      for (const s of stars) {
        const L = LAYERS[s.layer];
        if (!reduce) {
          s.x = wrap(s.x + s.vx * dt, w);
          s.y = wrap(s.y + s.vy * dt, h);
        }
        const x = wrap(s.x + eased.x * L.depth * 1.6, w);
        const y = wrap(s.y - scroll * L.depth * scale + eased.y * L.depth * 1.6, h);
        pos[s.layer].push({ x, y, s });
      }

      ctx.lineWidth = 0.6;
      for (let li = 1; li < 3; li++) {
        const pts = pos[li];
        const max = LAYERS[li].link;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 > max * max) continue;
            const a = (1 - Math.sqrt(d2) / max) * 0.12 * (li === 2 ? 1 : 0.7) * strength;
            const warm = pts[i].s.ember || pts[j].s.ember;
            ctx.strokeStyle = `rgba(${warm ? EMBER : ink}, ${warm ? a * 2.2 : a})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const layer of pos) {
        for (const { x, y, s } of layer) {
          const L = LAYERS[s.layer];
          const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.0009 + s.phase);
          ctx.fillStyle = `rgba(${s.ember ? EMBER : ink}, ${L.alpha * twinkle * (s.ember ? 1.3 : 1) * strength})`;
          ctx.beginPath();
          ctx.arc(x, y, L.size * (s.ember ? 1.3 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const onResize = () => {
      resize();
      if (reduce) draw(0, 0);
    };

    resize();
    readTheme();
    window.addEventListener("resize", onResize);
    if (reduce) {
      draw(0, 0);
    } else {
      start();
      document.addEventListener("visibilitychange", onVisibility);
      startTilt();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="ambient-orb ambient-orb--a" />
      <div className="ambient-orb ambient-orb--b" />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
