"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { InstrumentPanel } from "@/components/ui/InstrumentPanel";
import { Stat } from "@/components/ui/Stat";
import { site } from "@/content/profile";
import { rivendevsDomains, plannedDomains, ventures } from "@/content/ventures";

type Body = { id: string; name: string; status: string; body: string; kind: "sun" | "live" | "planned" };

const rivendevs = ventures.find((v) => v.id === "rivendevs")!;
const clareo = ventures.find((v) => v.id === "clareo")!;

const bodies: Body[] = [
  { id: "rivendevs", name: rivendevs.name, status: rivendevs.status, body: rivendevs.tagline, kind: "sun" },
  { id: "clareo", name: clareo.name, status: clareo.status, body: clareo.body, kind: "live" },
  ...plannedDomains.map((d) => ({ id: d.short, name: d.name, status: d.status, body: d.body, kind: "planned" as const })),
];

// Orbit radius (% of the system's width), period (s) and starting angle (deg).
const ORBITS = [
  { r: 20, period: 60, angle: 300 },
  { r: 28.5, period: 90, angle: 40 },
  { r: 35.5, period: 120, angle: 160 },
  { r: 42, period: 150, angle: 250 },
  { r: 48, period: 190, angle: 100 },
];

export function Ventures() {
  const s = site.ventures;
  const [selected, setSelected] = useState("clareo");
  const current = bodies.find((b) => b.id === selected) ?? bodies[1];
  const planets = bodies.slice(1);

  return (
    <section id="ventures" aria-labelledby="ventures-title" className="fade-divider section-y relative overflow-hidden">
      <div className="container-x">
        <SectionHeader heading={s.heading} intro={s.intro} id="ventures-title" word={s.word} />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12">
          {/* Orbit diagram */}
          <div className="lg:col-span-7" data-reveal>
            <div className="orbit-system relative mx-auto aspect-square w-full max-w-[640px]">
              {/* Sun: Riven */}
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_56_59/0.28),rgb(229_56_59/0.06)_55%,transparent)]" />
              <button
                type="button"
                onClick={() => setSelected("rivendevs")}
                aria-pressed={selected === "rivendevs"}
                className="absolute left-1/2 top-1/2 z-10 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ember/50 bg-bg/80 shadow-[0_0_60px_-10px_rgb(229_56_59/0.6)] backdrop-blur transition-transform duration-2 hover:scale-105"
              >
                <span className="font-serif text-[clamp(18px,3vw,30px)] leading-none">{rivendevs.name}</span>
                <span aria-hidden="true" className="spin-40 absolute inset-[-6%] rounded-full border border-dashed border-ember/40" />
              </button>

              {planets.map((p, i) => {
                const o = ORBITS[i];
                const live = p.kind === "live";
                const isSel = selected === p.id;
                return (
                  <div
                    key={p.id}
                    className="pointer-events-none absolute left-1/2 top-1/2"
                    style={{ width: `${o.r * 2}%`, height: `${o.r * 2}%`, transform: `translate(-50%, -50%) rotate(${o.angle}deg)` }}
                  >
                    <div
                      className={`orbit-turn absolute inset-0 rounded-full border ${live ? "border-signal/40" : "border-dashed border-line-strong"}`}
                      style={{ ["--period" as string]: `${o.period}s` }}
                    >
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, -50%) rotate(${-o.angle}deg)` }}>
                        <div className="orbit-counter" style={{ ["--period" as string]: `${o.period}s` }}>
                          <button
                            type="button"
                            onClick={() => setSelected(p.id)}
                            aria-pressed={isSel}
                            aria-label={`${p.name} — ${p.status}`}
                            className="pointer-events-auto group flex min-h-11 items-center gap-2 rounded-full px-1.5"
                          >
                            <span className="relative grid place-items-center">
                              {live && <span aria-hidden="true" className="ping absolute size-3.5 rounded-full bg-signal" />}
                              <span
                                aria-hidden="true"
                                className={`relative block rounded-full transition-transform duration-2 group-hover:scale-125 ${
                                  live ? "size-3.5 bg-signal shadow-[0_0_16px_rgb(255_107_107/0.7)]" : "size-3 border border-dashed border-muted bg-bg"
                                } ${isSel ? "scale-125 ring-2 ring-ember/60 ring-offset-2 ring-offset-bg" : ""}`}
                              />
                            </span>
                            <span className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] sm:text-[11px] ${live ? "text-signal" : "hidden text-faint group-hover:text-ink-2 sm:inline"} ${isSel ? "!inline !text-ink" : ""}`}>
                              {live ? p.name : plannedDomains[i - 1].short}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected body */}
          <div className="lg:col-span-5">
            <InstrumentPanel title="Orbit · selected" status={current.status} live={current.kind !== "planned"} bodyClassName="p-6 md:p-8">
              <div key={current.id} className="bubble-in" aria-live="polite">
                <p className="micro">{current.kind === "sun" ? "The company" : current.kind === "live" ? "Live product" : "Planned domain"}</p>
                <h3 className="mt-3 font-serif text-[40px] font-normal italic leading-none tracking-[-0.01em]">{current.name}</h3>
                <div className="mt-4">
                  <StatusChip status={current.status as "Shipping"} />
                </div>
                <p className="mt-5 text-muted">{current.body}</p>
                {current.kind === "planned" && <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.06em] text-faint">A plan, not a product — see the roadmap.</p>}
              </div>
              <ul className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6" aria-label="Choose a body in the orbit">
                {bodies.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(b.id)}
                      aria-pressed={selected === b.id}
                      className={`min-h-9 rounded-full border px-3 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-1 ${
                        selected === b.id ? "border-ember/60 text-ink" : "border-line text-faint hover:text-ink-2"
                      }`}
                    >
                      {b.kind === "planned" ? b.id : b.name}
                    </button>
                  </li>
                ))}
              </ul>
            </InstrumentPanel>
          </div>
        </div>

        {/* Venture cards */}
        <div className="mt-16 grid gap-4 md:gap-6 lg:grid-cols-12">
          <article id="venture-rivendevs" aria-labelledby="rivendevs-card" data-reveal="tile" className="tile tile-hover flex flex-col overflow-hidden p-7 md:p-9 lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <span className="micro">Company · since {rivendevs.since}</span>
              <StatusChip status={rivendevs.status} />
            </div>
            <h3 id="rivendevs-card" className="mt-8 font-serif text-[56px] font-normal leading-none tracking-[-0.02em]">
              {rivendevs.name}
            </h3>
            <p className="mt-3 font-serif text-[22px] italic text-ember">{rivendevs.tagline}</p>
            <p className="mt-6 text-muted">{rivendevs.body}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip tone="role">{rivendevs.role}</Chip>
            </div>
            <ul className="mt-8 divide-y divide-line border-t border-line" aria-label="Riven's domains">
              {rivendevsDomains.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-3 py-2.5 text-[14px]">
                  <span className="text-ink-2">{d.name}</span>
                  <StatusChip status={d.status} />
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <Button href={rivendevs.href} external variant="secondary">
                {rivendevs.cta}
              </Button>
            </div>
            <span aria-hidden="true" className="spin-120 pointer-events-none absolute -bottom-40 -right-40 size-80 rounded-full border border-dashed border-ember/25" />
          </article>

          <article id="venture-clareo" aria-labelledby="clareo-card" data-reveal="tile" style={{ ["--i" as string]: 1 }} className="tile tile-hover flex flex-col p-7 md:p-9 lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <span className="micro">Product · by Riven</span>
              <StatusChip status={clareo.status} />
            </div>
            <h3 id="clareo-card" className="mt-8 font-serif text-[56px] font-normal leading-none tracking-[-0.02em]">
              {clareo.name}
            </h3>
            <p className="mt-3 font-serif text-[22px] italic text-ink-2">{clareo.tagline}</p>
            <p className="mt-6 text-muted">{clareo.body}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip tone="role">{clareo.role}</Chip>
            </div>
            <dl className="mt-10 grid gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-2">
              {clareo.measurements?.map((m, i) => (
                <div key={m.value} data-reveal style={{ ["--i" as string]: i }} className={i === 0 ? "sm:col-span-2" : ""}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd>
                    <Stat value={m.value} label={m.label} source={m.source} kind="measurement" size={i === 0 ? "lg" : "md"} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <Button href={clareo.href} external variant="signal">
                {clareo.cta}
              </Button>
              <p className="text-[13px] text-faint">{clareo.smallPrint}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
