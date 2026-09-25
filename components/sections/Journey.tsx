"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { journey } from "@/content/journey";
import { site } from "@/content/profile";

/**
 * Timeline on a Clareo-style live trace: a lime line draws itself as you scroll,
 * with a glowing head; ember dots mark milestones (hackathons, RivenDevs, Clareo).
 */
export function Journey() {
  const s = site.journey;
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const drawn = useTransform(progress, (v) => (reduce ? 1 : v));
  // The glowing head rides the line (transform only): progress × rail height.
  const railH = useMotionValue(0);
  const headY = useTransform([drawn, railH], ([v, h]: number[]) => v * h);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => railH.set(Math.max(0, el.offsetHeight - 8)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [railH]);

  return (
    <section id="journey" aria-labelledby="journey-title" className="fade-divider section-y relative">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeader heading={s.heading} intro={s.intro} id="journey-title" word={s.word} />
            <p className="micro mt-8 flex items-center gap-3" data-reveal>
              <span className="h-px w-6 bg-signal" aria-hidden="true" /> trace
              <span className="ml-3 size-2 rounded-full bg-ember" aria-hidden="true" /> milestone
            </p>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-8">
          {/* Trace rail + drawn lime line */}
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-line md:left-[139px]" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: drawn }}
            className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-signal shadow-[0_0_12px_rgb(255_107_107/0.6)] md:left-[139px]"
          />
          <motion.span
            aria-hidden="true"
            style={{ y: headY }}
            className="absolute left-[4px] top-2 -mt-1 size-[7px] rounded-full bg-signal shadow-[0_0_14px_3px_rgb(255_107_107/0.55)] md:left-[136px]"
          />

          {journey.map((m, i) => {
            const plan = m.type === "plan";
            const Title = (
              <span className="font-serif text-[28px] font-normal italic leading-[1.1] tracking-[-0.01em] md:text-[32px]">
                {m.title}
                {m.accent && <span className="ml-3 align-middle font-mono text-[14px] not-italic tracking-normal text-ember">{m.accent}</span>}
              </span>
            );
            return (
              <li key={m.title} data-reveal style={{ ["--i" as string]: 0 }} className={`relative grid pb-12 pl-8 last:pb-0 md:grid-cols-[120px_1fr] md:gap-10 md:pl-0 ${plan ? "opacity-60" : ""}`}>
                <p className="pt-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-faint md:text-right">
                  {m.date ?? m.phase}
                  {m.date && <span className="block text-[11px] text-faint/70">{m.phase}</span>}
                </p>
                {/* dot */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-2 grid size-[15px] place-items-center rounded-full md:left-[132px] ${
                    m.milestone ? "bg-ember/20" : plan ? "border border-dashed border-muted bg-bg" : "border border-line-strong bg-bg"
                  }`}
                >
                  {m.milestone && <span className="size-[7px] rounded-full bg-ember shadow-[0_0_10px_rgb(229_56_59/0.8)]" />}
                </span>
                <div className="mt-2 md:mt-0 md:pl-8">
                  <h3 className="font-normal">
                    {m.href ? (
                      <a href={m.href} className="group inline-flex items-baseline gap-2 transition-colors hover:text-ember">
                        {Title}
                        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="translate-y-0.5 opacity-0 transition-all duration-1 group-hover:translate-x-1 group-hover:opacity-100" />
                      </a>
                    ) : (
                      Title
                    )}
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted">{m.body}</p>
                </div>
                {i === 0 && <span className="sr-only">Timeline, oldest first.</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
