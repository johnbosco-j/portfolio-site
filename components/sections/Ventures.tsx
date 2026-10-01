"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { InstrumentPanel } from "@/components/ui/InstrumentPanel";
import { Stat } from "@/components/ui/Stat";
import { site } from "@/content/profile";
import { rivendevsDomains, plannedDomains, ventures } from "@/content/ventures";

type Body = { id: string; name: string; status: string; body: string; kind: "home" | "live" | "planned" };

const rivendevs = ventures.find((v) => v.id === "rivendevs")!;
const clareo = ventures.find((v) => v.id === "clareo")!;

const bodies: Body[] = [
  { id: "rivendevs", name: rivendevs.name, status: rivendevs.status, body: rivendevs.tagline, kind: "home" },
  { id: "clareo", name: clareo.name, status: clareo.status, body: clareo.body, kind: "live" },
  ...plannedDomains.map((d) => ({ id: d.short, name: d.name, status: d.status, body: d.body, kind: "planned" as const })),
];

/**
 * Where each lantern hangs: x as a percentage across the cord, and how far down its own
 * cord it drops. Deliberately uneven — a festival string is hung by hand, and a row of
 * evenly spaced lanterns at one height reads as a chart.
 */
const HANGS = [
  { x: 7, drop: 10, w: "w-[40px] sm:w-[70px]" },
  { x: 29, drop: 58, w: "w-[30px] sm:w-[52px]" },
  { x: 45, drop: 20, w: "w-[26px] sm:w-[42px]" },
  { x: 60, drop: 72, w: "w-[26px] sm:w-[42px]" },
  { x: 76, drop: 34, w: "w-[26px] sm:w-[42px]" },
  { x: 91, drop: 62, w: "w-[26px] sm:w-[42px]" },
];

/** A paper lantern: cap, ribbed body, base and a tassel. Lit ones carry the gold. */
function Lantern({ className, lit, dim, selected }: { className: string; lit: boolean; dim: boolean; selected: boolean }) {
  const body = lit ? "rgb(255 200 87)" : "rgb(22 30 74)";
  const edge = lit ? "rgb(214 40 57)" : selected ? "rgb(255 92 102)" : "rgb(52 64 122)";
  return (
    <svg viewBox="0 0 30 42" aria-hidden="true" className={`h-auto overflow-visible ${className}`}>
      {lit && <ellipse cx="15" cy="19" rx="26" ry="24" fill="rgb(255 200 87)" opacity="0.16" />}
      <rect x="10" y="3" width="10" height="3.4" rx="1.2" fill="rgb(52 64 122)" />
      <rect x="3" y="6" width="24" height="27" rx="10" fill={body} stroke={edge} strokeWidth={selected ? 2.2 : 1.4} strokeDasharray={dim ? "3 3" : undefined} />
      <g stroke={lit ? "rgb(26 18 6)" : "rgb(52 64 122)"} strokeOpacity={lit ? 0.3 : 0.8} strokeWidth="1.1">
        <line x1="4.5" y1="14" x2="25.5" y2="14" />
        <line x1="4.5" y1="22" x2="25.5" y2="22" />
      </g>
      <rect x="10" y="32.6" width="10" height="3.4" rx="1.2" fill="rgb(52 64 122)" />
      <line x1="15" y1="36" x2="15" y2="41" stroke="rgb(214 40 57)" strokeWidth="1.6" />
    </svg>
  );
}

export function Ventures() {
  const s = site.ventures;
  const [selected, setSelected] = useState("clareo");
  const current = bodies.find((b) => b.id === selected) ?? bodies[1];

  return (
    <section id="ventures" aria-labelledby="ventures-title" className="fade-divider section-y relative overflow-hidden">
      <div className="container-x">
        <SectionHeader heading={s.heading} intro={s.intro} id="ventures-title" word={s.word} />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12">
          {/* A string of lanterns, one per venture. Replaces the orbit diagram this
              section used to carry: concentric rings around a glowing centre read as a
              solar system — or worse, as an atom — and neither belongs here. */}
          <div className="lg:col-span-7" data-reveal>
            <div className="relative mx-auto h-[250px] w-full max-w-[640px] sm:h-[300px]">
              {/* the cord, sagging between two posts */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-0 h-[34%] w-full"
              >
                <path
                  d="M0 14 Q 50 46 100 14"
                  fill="none"
                  stroke="rgb(52 64 122)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {bodies.map((b, i) => {
                const h = HANGS[i] ?? HANGS[HANGS.length - 1];
                const lit = b.kind !== "planned";
                const isSel = selected === b.id;
                // follow the cord's sag so each lantern hangs from the rope, not from air
                const t = h.x / 100;
                const cordY = 14 + (46 - 14) * 2 * (2 * t * (1 - t));
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelected(b.id)}
                    aria-pressed={isSel}
                    aria-label={`${b.name} — ${b.status}`}
                    className="group absolute flex -translate-x-1/2 flex-col items-center px-1 pb-1"
                    style={{ left: `${h.x}%`, top: `${cordY * 0.34}%` }}
                  >
                    <span aria-hidden="true" className="block w-px bg-line-strong" style={{ height: `${18 + h.drop}px` }} />
                    <span className={`block transition-transform duration-2 group-hover:-translate-y-0.5 ${lit ? "lantern-flicker" : ""}`}>
                      <Lantern className={h.w} lit={lit} dim={b.kind === "planned"} selected={isSel} />
                    </span>
                    {/* Absolutely placed so a long name cannot widen the button. Left in the
                        flow, "Institutions" stretched its hit area into "Education"'s, and
                        the two were overlapping by about 20px on a 1024px screen. */}
                    <span
                      className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] sm:text-[11px] ${
                        isSel ? "text-ink" : lit ? "text-signal" : "hidden text-faint group-hover:block group-focus-visible:block"
                      }`}
                    >
                      {b.kind === "planned" ? b.id : b.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected body */}
          <div className="lg:col-span-5">
            <InstrumentPanel title="Lantern · selected" status={current.status} live={current.kind !== "planned"} bodyClassName="p-6 md:p-8">
              <div key={current.id} className="bubble-in" aria-live="polite">
                <p className="micro">{current.kind === "home" ? "The company" : current.kind === "live" ? "Live product" : "Planned domain"}</p>
                <h3 className="mt-3 font-serif text-[40px] font-normal italic leading-none tracking-[-0.01em]">{current.name}</h3>
                <div className="mt-4">
                  <StatusChip status={current.status as "Shipping"} />
                </div>
                <p className="mt-5 text-muted">{current.body}</p>
                {current.kind === "planned" && <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.06em] text-faint">A plan, not a product — see the roadmap.</p>}
              </div>
              <ul className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6" aria-label="Choose a lantern">
                {bodies.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(b.id)}
                      aria-pressed={selected === b.id}
                      className={`min-h-11 rounded-full border px-3 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-1 ${
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
              {rivendevs.team && (
                <Chip tone="role" dot={false}>
                  Team <span className="text-ember">{rivendevs.team}</span>
                </Chip>
              )}
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
