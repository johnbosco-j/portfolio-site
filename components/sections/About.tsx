import Image from "next/image";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { publicFileExists } from "@/lib/assets";
import { GitHubActivity } from "./GitHubActivity";

/**
 * About, built as a player card: portrait (or the "JE" monogram) over a squad number,
 * a ruled data strip, the bio, the tools row and a signature — with the live GitHub feed
 * beside it.
 */
export function About() {
  const hasPortrait = publicFileExists(about.portrait.src);
  const c = about.card;
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative border-t-2 border-line-strong">
      <div className="container-x grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Player card */}
        <article className="brut relative overflow-hidden lg:col-span-5" data-reveal="tile">
          <p aria-hidden="true" className="absolute left-0 top-0 z-10 bg-ember-fill px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
            {c.note}
          </p>
          <div className="relative aspect-[5/4] overflow-hidden border-b-2 border-line-strong bg-bg-2 sm:aspect-[4/3]">
            {hasPortrait ? (
              // Overscanned and parallaxed, so the photo drifts inside its frame as you scroll.
              <ParallaxLayer speed={1.14} distance={120} desktopOnly className="absolute inset-x-0 -top-[8%] h-[116%]">
                <Image
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-[50%_34%]"
                />
              </ParallaxLayer>
            ) : (
              <span className="display absolute inset-0 grid place-items-center text-[110px] text-ink sm:text-[130px]" aria-hidden="true">
                J<span className="text-ember">E</span>
              </span>
            )}
            {/* scrim + squad number, printed over the photo */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-2 to-transparent" />
            <span
              aria-hidden="true"
              className="display outline-word pointer-events-none absolute -bottom-2 left-3 select-none text-[86px] sm:text-[104px]"
              style={{ WebkitTextStroke: "2px #D92D32" }}
            >
              {c.number}
            </span>
          </div>

          <p className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-line-strong bg-panel-2 px-4 py-3">
            <span className="display text-[20px] text-ember">{c.number}</span>
            <span className="display text-[20px] text-ink">{profile.name}</span>
          </p>

          <dl className="grid grid-cols-2 border-b-2 border-line-strong sm:grid-cols-3">
            {[
              { k: "Position", v: c.position },
              { k: "Hometown", v: c.hometown },
              { k: "Status", v: c.status, live: true },
            ].map((row, i) => (
              <div key={row.k} className={`px-4 py-3 ${i > 0 ? "border-l-2 border-line-strong" : ""}`}>
                <dt className="micro">{row.k}</dt>
                <dd className="mt-1 flex items-center gap-2 text-[14px] text-ink-2">
                  {row.live && <span aria-hidden="true" className="pulse-dot size-1.5 rounded-full bg-signal" />}
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-b-2 border-line-strong px-4 py-4">
            <p className="micro flex items-center gap-2">
              <span aria-hidden="true" className="h-[2px] w-6 bg-ember" /> Bio
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{about.paragraphs[1]}</p>
          </div>

          <div className="border-b-2 border-line-strong px-4 py-4">
            <p className="micro">Tools I reach for</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {about.tools.map((t) => (
                <li key={t} className="border-2 border-line-strong px-2 py-1 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <span className="font-serif text-[17px] italic text-muted">{profile.signature}</span>
            <Button href="#contact" variant="secondary">
              Connect
            </Button>
          </div>
        </article>

        {/* Story + live GitHub */}
        <div className="flex flex-col gap-10 lg:col-span-7">
          <SectionHeader heading={about.heading} id="about-title" word="About" />
          <div className="flex flex-col gap-5 font-modern text-[18px] font-light leading-[1.6] text-ink/85 md:text-[20px]">
            {about.paragraphs.map((p, i) => (
              <p key={i} data-reveal style={{ ["--i" as string]: i }}>
                {p}
              </p>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-px bg-line-strong" data-reveal>
            {about.facts.map((f) => (
              <div key={f.label} className="bg-panel p-4">
                <dt className="micro">{f.label}</dt>
                <dd className="mt-1.5 text-[15px] text-ink-2">{f.value}</dd>
              </div>
            ))}
          </dl>
          <GitHubActivity />
        </div>
      </div>
    </section>
  );
}
