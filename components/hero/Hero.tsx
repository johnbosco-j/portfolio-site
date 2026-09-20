"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AccentText } from "@/components/ui/AccentHeading";
import { Button, TextLink } from "@/components/ui/Button";
import { Ribbon } from "@/components/ui/Ribbon";
import { FitText } from "./FitText";
import { LINKS, profile, site } from "@/content/profile";
import { useMediaQuery, useMotionScale } from "@/lib/hooks";
import { gyroNeedsPermission, motionGranted, requestGyro, startTilt, tiltX, tiltY } from "@/lib/tilt";

/**
 * Hero — a type poster: the name set huge in heavy italic display type, the headline and
 * intro beneath it, framed by ruled strips with two tilted ribbons underneath.
 *
 * Motion: each line rises into place on load (short, so it never holds up the first paint),
 * the whole block sinks and dims as the next section rises over it, and the type leans
 * slightly toward the cursor or the phone's tilt. All of it stops under reduced motion.
 */

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] } }),
};

export function Hero({ hasResume }: { hasResume: boolean }) {
  const { hero } = site;
  const ref = useRef<HTMLElement>(null);
  const scale = useMotionScale();
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The hero sinks and dims as you scroll past it, so the next section reads as rising over it.
  const sink = wide && scale > 0;
  const sinkY = useTransform(scrollYProgress, [0, 1], [0, sink ? -70 : 0]);
  const sinkOpacity = useTransform(scrollYProgress, [0, 0.85], [1, sink ? 0.25 : 1]);

  useEffect(() => startTilt(), []);

  // iOS asks before sharing motion; offer a tap (touch devices only).
  const [askMotion, setAskMotion] = useState(false);
  useEffect(() => {
    const touch = !window.matchMedia("(pointer: fine)").matches;
    const id = requestAnimationFrame(() => setAskMotion(touch && !!scale && gyroNeedsPermission() && !motionGranted()));
    return () => cancelAnimationFrame(id);
  }, [scale]);

  // The type leans a little against the cursor / tilt — depth without moving anything off screen.
  const sx = useSpring(tiltX, { stiffness: 90, damping: 18 });
  const sy = useSpring(tiltY, { stiffness: 90, damping: 18 });
  const nameX = useTransform(sx, (v) => v * -16);
  const nameY = useTransform(sy, (v) => v * -9);
  const bodyX = useTransform(sx, (v) => v * -7);

  const anim = reduce ? {} : { initial: "hidden" as const, animate: "shown" as const, variants: rise };

  return (
    <section id="top" ref={ref} aria-labelledby="hero-name" className="relative isolate overflow-hidden pt-[104px] md:pt-[124px]">
      <motion.div style={{ y: sinkY, opacity: sinkOpacity }}>
        <div className="container-x pb-10 pt-8 md:pt-10">
          {/* script line */}
          <motion.div {...anim} custom={0} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-5">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-ml text-[15px] font-medium text-ember md:text-[17px]">{profile.scripts.ml.name}</span>
              <span className="font-ur text-[15px] font-medium leading-[2] text-ink-2 md:text-[17px]" dir="rtl">
                {profile.scripts.ur.name}
              </span>
              <span className="font-jp text-[14px] font-medium text-muted md:text-[15px]">{profile.scripts.jp.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Chennai · India</span>
            </p>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-faint sm:block">Portfolio ’26</p>
          </motion.div>

          {/* The name */}
          <motion.h1 id="hero-name" style={{ x: nameX, y: nameY }} className="select-none">
            <motion.span {...anim} custom={1} className="block">
              <FitText
                max={200}
                fallback="clamp(40px,12.6vw,180px)"
                className="display text-ink [text-shadow:4px_4px_0_rgb(var(--ember)/0.9)] md:[text-shadow:8px_8px_0_rgb(var(--ember)/0.9)]"
              >
                {profile.firstName}
              </FitText>
            </motion.span>
            <motion.span {...anim} custom={2} className="-mt-[0.04em] block">
              <FitText max={124} fallback="clamp(26px,7.6vw,110px)" className="display outline-word">
                {profile.lastName}
              </FitText>
            </motion.span>
          </motion.h1>

          {/* Headline left, intro + actions right */}
          <motion.div style={{ x: bodyX }} className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              {hero.status.open && (
                <motion.p
                  {...anim}
                  custom={3}
                  className="mb-6 inline-flex items-center gap-2 border-2 border-line-strong bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2"
                >
                  <span className="relative flex size-2" aria-hidden="true">
                    <span className="ping absolute inset-0 rounded-full bg-signal" />
                    <span className="relative size-2 rounded-full bg-signal" />
                  </span>
                  {hero.status.label}
                </motion.p>
              )}
              <motion.p {...anim} custom={4} className="max-w-[18ch] text-[clamp(28px,3.8vw,48px)] font-semibold leading-[1.04] tracking-[-0.03em]">
                <AccentText heading={hero.headline} flow />
              </motion.p>
            </div>

            <div className="lg:col-span-6 lg:pt-2">
              <motion.p {...anim} custom={5} className="max-w-[48ch] font-modern text-[17px] font-light leading-[1.6] tracking-[-0.01em] text-ink/80 md:text-[19px]">
                {hero.intro}
              </motion.p>
              <motion.div {...anim} custom={6} className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={hero.primary.href}>{hero.primary.label}</Button>
                <Button href={hasResume ? LINKS.resume : undefined} variant="secondary" download comingSoonLabel={hero.resume.soon}>
                  {hero.resume.label}
                </Button>
                <TextLink href={LINKS.jovora} external className="text-[15px]">
                  {hero.jovora}
                </TextLink>
              </motion.div>
              {askMotion && (
                <button
                  type="button"
                  onClick={async () => {
                    if (await requestGyro()) setAskMotion(false);
                  }}
                  className="mt-6 inline-flex h-11 items-center gap-2 border-2 border-line-strong px-4 font-mono text-micro uppercase text-muted"
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                  {hero.motionPrompt}
                </button>
              )}
            </div>
          </motion.div>

          <p aria-hidden="true" className="mt-10 text-right font-serif text-[16px] italic text-muted md:text-[20px]">
            {profile.signature}
          </p>
        </div>
      </motion.div>

      {/* Ruled strip: scroll cue · résumé · github */}
      <div className="rule-y">
        <div className="container-x flex flex-wrap items-center justify-between gap-y-2 px-0 md:px-0">
          <p className="flex items-center gap-2 border-r-2 border-line-strong px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:px-6">
            {hero.scrollCue} <span aria-hidden="true">↓</span>
          </p>
          <div className="flex items-center">
            {hasResume && (
              <a href={LINKS.resume} className="cell font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:bg-panel hover:text-ink">
                Résumé
              </a>
            )}
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cell font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:bg-panel hover:text-ink"
            >
              GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Crossing ribbons */}
      <div className="relative my-8 md:my-10">
        <Ribbon items={hero.ribbons.motto} tone="red" />
        <Ribbon items={hero.ribbons.stack} tone="ink" reverse fast className="-mt-3 md:-mt-4" />
      </div>
    </section>
  );
}
