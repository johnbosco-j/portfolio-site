"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { AccentText } from "@/components/ui/AccentHeading";
import { Button, TextLink } from "@/components/ui/Button";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { Ribbon } from "@/components/ui/Ribbon";
import { FarRidge, NearRooftops, NightSky } from "@/components/poster/Village";
import { Stage } from "@/components/scene/Stage";
import { FitText } from "./FitText";
import { NameScripts } from "./NameScripts";
import { LINKS, profile, site } from "@/content/profile";
import { useMediaQuery, useMotionScale } from "@/lib/hooks";
import { gyroNeedsPermission, motionGranted, requestGyro, startTilt, tiltX, tiltY } from "@/lib/tilt";

/**
 * Hero — a type poster: the name set huge in heavy italic display type, the headline and
 * intro beneath it, framed by ruled strips with two tilted ribbons underneath.
 *
 * Motion: each line rises into place through the shared reveal mechanism, which is
 * fail-safe — markup leaves the page visible and only the observer, once running, is
 * allowed to hide anything. That matters most here: an entrance animated from opacity 0 in
 * the markup itself would leave the first screen blank until hydration finished, which is
 * exactly the "nothing but background" this hero used to show on a slow connection.
 *
 * The rest of the motion only ever moves things that are already drawn: the block sinks and
 * dims as the next section rises over it, and the type leans slightly toward the cursor or
 * the phone's tilt. All of it stops under reduced motion.
 */

/** The entrance props for one line of the poster, in sequence. */
const rise = (i: number) => ({
  "data-reveal": "",
  style: { ["--i" as string]: i },
});

export function Hero({ hasResume }: { hasResume: boolean }) {
  const { hero } = site;
  const ref = useRef<HTMLElement>(null);
  const scale = useMotionScale();
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

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

  return (
    <section id="top" ref={ref} aria-labelledby="hero-name" className="relative">
      {/* The poster frame. The scenery is anchored to the bottom of *this*, not of the whole
          section — the ruled strip and the ribbons below are page furniture, and rooftops
          sliding in behind them read as a mistake rather than as depth. */}
      <div className="relative isolate overflow-hidden pt-[104px] md:pt-[124px]">
        {/* The Iga Night poster: static SVG, so this is also the no-JS and reduced-motion view.

            The sky does not parallax. A layer that moves has to be bigger than the hole it
            moves across, and the sky's hole is the whole frame — every version that drifted
            left a band of bare page along one edge. At 0.15× it was barely moving anyway,
            so it is pinned full-bleed and the depth comes from the two layers in front,
            which are anchored to the bottom and can only ever uncover more sky. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <NightSky className="absolute inset-0" />
          <ParallaxLayer speed={0.35} distance={200} className="absolute inset-x-0 bottom-[14%] h-[clamp(170px,26vw,330px)]">
            <FarRidge />
          </ParallaxLayer>
          <ParallaxLayer speed={1.2} distance={200} desktopOnly className="absolute inset-x-0 bottom-0 h-[clamp(150px,22vw,290px)]">
            <NearRooftops />
          </ParallaxLayer>
          {/* keeps the headline readable where the moon is brightest */}
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_45%,rgb(var(--bg)/0.86),rgb(var(--bg)/0.3)_60%,transparent)]" />
        </div>

        {/* Kuro on the rooftops with Shiro sitting beside him: over the poster, behind the text.
          Tap him to leap, or shake the phone to throw. */}
        <Stage
          prime
          cast={[
            { name: "kuro", x: 0.6, onTap: "leap" },
            // Shiro is modelled nose-along-+x, so -1.1rad puts him in three-quarter view
            { name: "shiro", x: -0.78, z: 0.3, turn: -1.1, scale: 0.9, hold: "sit", onTap: "leap" },
          ]}
          shuriken
          action="Throw a shuriken"
          camera={{ y: 1.2, z: 5.8, look: 0.9 }}
          // Kept to the lower-right corner: the stage used to span most of the hero, which
          // put a bright cream dog directly behind the buttons.
          className="pointer-events-auto absolute bottom-0 right-0 -z-[5] h-[min(300px,36%)] w-[min(440px,66vw)] md:right-[4%]"
        />

        <motion.div style={{ y: sinkY, opacity: sinkOpacity }}>
          <div className="container-x pb-10 pt-8 md:pt-10">
            {/* His name across writing systems, scrollable sideways */}
            <div {...rise(0)} className="hero-line pb-6">
              <NameScripts />
            </div>

            {/* The name */}
            <motion.h1 id="hero-name" style={reduce ? undefined : { x: nameX, y: nameY }} className="select-none">
              <span {...rise(1)} className="hero-line block">
                <FitText
                  max={200}
                  fallback="clamp(40px,12.6vw,180px)"
                  className="display text-ink [text-shadow:4px_4px_0_rgb(var(--ember)/0.9)] md:[text-shadow:8px_8px_0_rgb(var(--ember)/0.9)]"
                >
                  {profile.firstName}
                </FitText>
              </span>
              <span {...rise(2)} className="hero-line -mt-[0.04em] block">
                <FitText max={124} fallback="clamp(26px,7.6vw,110px)" className="display outline-word">
                  {profile.lastName}
                </FitText>
              </span>
            </motion.h1>

            {/* Headline left, intro + actions right */}
            <motion.div style={reduce ? undefined : { x: bodyX }} className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                {hero.status.open && (
                  <p
                    {...rise(3)}
                    className="hero-line mb-6 inline-flex items-center gap-2 border-2 border-line-strong bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2"
                  >
                    <span className="relative flex size-2" aria-hidden="true">
                      <span className="ping absolute inset-0 rounded-full bg-signal" />
                      <span className="relative size-2 rounded-full bg-signal" />
                    </span>
                    {hero.status.label}
                  </p>
                )}
                <p
                  {...rise(4)}
                  className="hero-line max-w-[18ch] text-[clamp(28px,3.8vw,48px)] font-semibold leading-[1.04] tracking-[-0.03em]"
                >
                  <AccentText heading={hero.headline} flow />
                </p>
              </div>

              <div className="lg:col-span-6 lg:pt-2">
                <p
                  {...rise(5)}
                  className="hero-line max-w-[48ch] font-modern text-[17px] font-light leading-[1.6] tracking-[-0.01em] text-ink/80 md:text-[19px]"
                >
                  {hero.intro}
                </p>
                <div {...rise(6)} className="hero-line mt-8 flex flex-wrap items-center gap-3">
                  <Button href={hero.primary.href}>{hero.primary.label}</Button>
                  <Button href={hasResume ? LINKS.resume : undefined} variant="secondary" download comingSoonLabel={hero.resume.soon}>
                    {hero.resume.label}
                  </Button>
                  <TextLink href={LINKS.rivendevs} external className="text-[15px]">
                    {hero.rivendevs}
                  </TextLink>
                </div>
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
      </div>

      {/* Ruled strip: scroll cue · résumé · github */}
      <div className="rule-y">
        <div className="container-x flex flex-wrap items-center justify-between gap-y-2 px-0 md:px-0">
          <p className="flex items-center gap-2 border-r-2 border-line-strong px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:px-6">
            {hero.scrollCue} <span aria-hidden="true">↓</span>
          </p>
          <div className="flex items-center">
            {hasResume && (
              <a
                href={LINKS.resume}
                className="cell font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:bg-panel hover:text-ink"
              >
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
