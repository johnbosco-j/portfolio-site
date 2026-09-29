import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { Stat } from "@/components/ui/Stat";
import { ProjectVisual } from "@/components/work/Visuals";
import { site } from "@/content/profile";
import { projects, type Project } from "@/content/projects";

const spanClass: Record<Project["span"], string> = {
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  12: "lg:col-span-12",
};

function ProjectTile({ p, index }: { p: Project; index: number }) {
  const wide = p.span === 12;
  const big = p.featured;
  const highlights = big || wide ? p.highlights : p.highlights.slice(0, 2);
  return (
    <article
      id={`work-${p.slug}`}
      aria-labelledby={`title-${p.slug}`}
      data-reveal="tile"
      style={{ ["--i" as string]: index % 3 }}
      className={`tile tile-hover group flex flex-col overflow-hidden md:col-span-6 ${spanClass[p.span]} ${wide ? "lg:grid lg:grid-cols-12" : ""}`}
    >
      {/* Preview (L3 foreground: parallaxes up to 32px) */}
      <div className={`relative overflow-hidden px-5 pt-5 ${big ? "h-[260px] md:h-[300px]" : "h-[210px]"} ${wide ? "lg:order-2 lg:col-span-5 lg:h-auto lg:min-h-[320px] lg:pb-0" : ""}`}>
        <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <ParallaxLayer speed={1.2} distance={160} desktopOnly className="relative h-[calc(100%+32px)]" aria-hidden>
          {p.cover ? (
            <Image src={p.cover.src} alt={p.cover.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="rounded-t-panel border border-b-0 border-line object-cover object-top" />
          ) : (
            <ProjectVisual visual={p.visual} />
          )}
        </ParallaxLayer>
      </div>

      <div className={`relative flex flex-1 flex-col border-t border-line p-6 md:p-7 ${wide ? "lg:order-1 lg:col-span-7 lg:border-r lg:border-t-0" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="micro">{p.kind}</span>
          <StatusChip status={p.status} note={p.statusNote} />
        </div>
        <h3 id={`title-${p.slug}`} className={`mt-5 font-serif font-normal italic leading-none tracking-[-0.01em] ${big || wide ? "text-[44px] md:text-[52px]" : "text-[36px]"}`}>
          {p.name}
        </h3>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>

        <ul className="mt-5 flex flex-col gap-2">
          {highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[14px] leading-relaxed text-muted">
              <span aria-hidden="true" className="mt-[10px] h-px w-3 flex-none bg-ember" />
              {h}
            </li>
          ))}
        </ul>

        {big && p.metrics && (
          <div className="mt-7 grid grid-cols-2 gap-6 border-t border-line pt-6">
            {p.metrics.map((m) => (
              <Stat key={m.value} value={m.value} label={m.label} source={m.source} kind={m.kind} size="sm" />
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip tone="role" dot={false}>
            {p.role}
            {p.team && <span className="text-faint">· {p.team}</span>}
          </Chip>
          {p.achievement && <Chip tone="achievement">{p.achievement}</Chip>}
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
          {p.stack.map((s) => (
            <li key={s} className="rounded-md bg-panel-2 px-2 py-1 font-mono text-[11px] text-muted">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
          {p.links?.caseStudy && (
            <a href={`/work/${p.slug}`} className="group/cs inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[15px] font-medium transition-colors duration-1 hover:border-ember">
              Case study
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-1 group-hover/cs:translate-x-0.5" />
              <span className="sr-only">: {p.name}</span>
            </a>
          )}
          {p.links?.live && (
            <Button href={p.links.live} external variant="ghost">
              {p.slug === "clareo" ? "View live" : "Visit site"}
            </Button>
          )}
          {p.links?.venture && (
            <a href="#venture-clareo" className="inline-flex h-11 items-center px-2 text-[15px] text-muted transition-colors hover:text-ink">
              In Ventures
            </a>
          )}
          {!p.links?.live && !p.links?.caseStudy && (
            <Button variant="secondary" comingSoonLabel={p.links?.repo ? undefined : "Repo · link coming"} href={p.links?.repo} external>
              Code
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const s = site.work;
  return (
    <section id="work" aria-labelledby="work-title" className="fade-divider section-y relative">
      <div className="container-x">
        <SectionHeader heading={s.heading} intro={s.intro} id="work-title" word={s.word}>
          <Link
            href="/projects"
            className="group inline-flex min-h-11 w-fit items-center gap-2 border-2 border-line-strong px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ember hover:text-ember"
            data-reveal
            style={{ ["--i" as string]: 2 }}
          >
            {site.projects.seeAll}
            <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-1 group-hover:translate-x-0.5" />
          </Link>
        </SectionHeader>
        <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-6">
          {projects.map((p, i) => (
            <ProjectTile key={p.slug} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
