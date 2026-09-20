import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { Stat } from "@/components/ui/Stat";
import { PipelineDiagram } from "@/components/work/PipelineDiagram";
import { ProjectVisual } from "@/components/work/Visuals";
import { caseStudies, projectBySlug } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} — case study`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.name} — case study`, description: p.summary, url: `/work/${p.slug}` },
  };
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="fade-divider grid gap-6 py-14 md:grid-cols-12 md:gap-10 md:py-20" aria-labelledby={`cs-${n}`}>
      <div className="md:col-span-4">
        <p className="micro flex items-center gap-3">
          <span className="text-ember">{n}</span>
          <span aria-hidden="true" className="h-px w-8 bg-ember" />
        </p>
        <h2 id={`cs-${n}`} className="mt-4 font-serif text-[40px] font-normal italic leading-none tracking-[-0.01em] md:text-[48px]">
          {title}
        </h2>
      </div>
      <div className="md:col-span-8" data-reveal>
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((t) => (
        <li key={t} className="flex gap-4 text-[17px] leading-relaxed text-ink-2">
          <span aria-hidden="true" className="mt-[13px] h-px w-4 flex-none bg-ember" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p || !p.caseStudy) notFound();
  const cs = p.caseStudy;
  const idx = caseStudies.findIndex((c) => c.slug === p.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <article className="pb-16 pt-32 md:pt-40">
      <div className="container-x">
        <Link href="/#work" className="inline-flex min-h-11 items-center gap-2 font-mono text-micro uppercase text-muted transition-colors hover:text-ink">
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" /> All work
        </Link>

        <header className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="micro">{p.kind} · case study</span>
              <StatusChip status={p.status} note={p.statusNote} />
            </div>
            <h1 className="mt-6 font-serif text-[clamp(64px,10vw,128px)] font-normal italic leading-[0.9] tracking-[-0.02em]">{p.name}</h1>
            <p className="mt-6 max-w-[40ch] font-modern text-[20px] font-light leading-[1.5] text-ink/80 md:text-[22px]">{p.summary}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Chip tone="role" dot={false}>
                {p.role}
                {p.team && <span className="text-faint">· {p.team}</span>}
              </Chip>
              {p.achievement && <Chip tone="achievement">{p.achievement}</Chip>}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.links?.live && (
                <Button href={p.links.live} external variant={p.slug === "clareo" ? "signal" : "secondary"}>
                  {p.slug === "clareo" ? "View live" : "Visit"}
                </Button>
              )}
              {p.links?.repo && (
                <Button href={p.links.repo} external variant="secondary">
                  Code
                </Button>
              )}
            </div>
          </div>
          <div className="h-[280px] overflow-hidden rounded-bento border border-line bg-panel px-5 pt-5 lg:col-span-5" aria-hidden="true">
            {p.cover ? null : <ProjectVisual visual={p.visual} />}
          </div>
        </header>

        <dl className="mt-14 grid gap-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="micro">Role</dt>
            <dd className="mt-2 text-ink-2">{p.role}</dd>
          </div>
          <div>
            <dt className="micro">Status</dt>
            <dd className="mt-2 text-ink-2">
              {p.status}
              {p.statusNote ? ` · ${p.statusNote}` : ""}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="micro">Stack</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className="rounded-md bg-panel-2 px-2 py-1 font-mono text-[12px] text-muted">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <Section n="01" title="Problem">
          <p className="text-[19px] leading-relaxed text-ink-2">{cs.problem}</p>
        </Section>
        <Section n="02" title="Constraints">
          <List items={cs.constraints} />
        </Section>
        <Section n="03" title="What I built">
          <List items={cs.built} />
          <div className="mt-10">
            <PipelineDiagram diagram={cs.diagram} />
          </div>
        </Section>
        <Section n="04" title="Results">
          {p.metrics && p.metrics.length > 0 && (
            <div className="mb-10 grid gap-8 sm:grid-cols-2">
              {p.metrics.map((m) => (
                <Stat key={m.value} value={m.value} label={m.label} source={m.source} kind={m.kind} size="lg" />
              ))}
            </div>
          )}
          <List items={cs.results} />
        </Section>
        <Section n="05" title="What I’d do next">
          <List items={cs.next} />
          {cs.todo && cs.todo.length > 0 && (
            <div className="mt-10 rounded-panel border border-dashed border-line-strong p-5">
              <p className="font-mono text-micro uppercase text-faint">To confirm before this page is final</p>
              <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-muted">
                {cs.todo.map((t) => (
                  <li key={t}>— {t}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {next && next.slug !== p.slug && (
          <Link href={`/work/${next.slug}`} className="tile tile-hover group mt-10 flex items-center justify-between gap-6 p-7 md:p-10">
            <span>
              <span className="micro">Next case study</span>
              <span className="mt-3 block font-serif text-[44px] italic leading-none md:text-[64px]">{next.name}</span>
            </span>
            <ArrowRight size={32} strokeWidth={1.25} aria-hidden="true" className="flex-none text-ember transition-transform duration-2 group-hover:translate-x-2" />
          </Link>
        )}
      </div>
    </article>
  );
}
