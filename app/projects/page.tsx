import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AccentText } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { profile, site } from "@/content/profile";
import { caseStudies, projects } from "@/content/projects";

const s = site.projects;

export const metadata: Metadata = {
  title: "Projects",
  description: `Every project ${profile.name} has shipped — status, role, stack and links for each.`,
  alternates: { canonical: "/projects" },
  openGraph: { title: `Projects — ${profile.name}`, description: s.intro, url: "/projects" },
};

/** Counts read off the content, so this strip can never drift from the list below it. */
const stats = [
  { value: String(projects.length).padStart(2, "0"), label: "Projects" },
  { value: String(projects.filter((p) => p.status === "Shipped").length).padStart(2, "0"), label: "Shipped" },
  { value: String(caseStudies.length).padStart(2, "0"), label: "Case studies" },
];

export default function ProjectsPage() {
  return (
    <article className="pb-20 pt-[128px] md:pt-[148px]">
      <div className="container-x">
        <Link href="/#work" className="inline-flex min-h-11 items-center gap-2 font-mono text-micro uppercase text-muted transition-colors hover:text-ink">
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" /> {s.back}
        </Link>

        {/* Page header: the giant outlined word sits behind the title, as on the sections */}
        <header className="relative mt-8">
          <span aria-hidden="true" className="display outline-word pointer-events-none absolute -top-[0.38em] left-0 select-none whitespace-nowrap text-[clamp(56px,13vw,150px)]">
            {s.word}
          </span>
          <h1 className="display relative text-[clamp(34px,5.4vw,66px)]">
            <AccentText heading={s.heading} />
          </h1>
          <p className="relative mt-5 max-w-[52ch] font-modern text-[17px] font-light leading-[1.6] text-muted md:text-[19px]">{s.intro}</p>
        </header>
      </div>

      {/* Ruled stat strip */}
      <dl className="rule-y mt-12 grid grid-cols-3">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`px-4 py-5 md:px-8 ${i > 0 ? "border-l-2 border-line-strong" : ""}`}>
            <dt className="micro">{stat.label}</dt>
            <dd className="display mt-2 text-[clamp(28px,5vw,52px)] text-ember">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {/* The list */}
      <ol className="border-b-2 border-line-strong">
        {projects.map((p, i) => {
          const href = p.links?.caseStudy ? `/work/${p.slug}` : `/#work-${p.slug}`;
          return (
            <li key={p.slug} className="group relative border-t-2 border-line-strong first:border-t-0">
              {/* red wash on hover, so a whole row reads as one target */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ember/[0.07] transition-transform duration-2 ease-out group-hover:scale-x-100" />
              <div className="container-x relative grid gap-x-8 gap-y-4 py-7 md:grid-cols-12 md:items-baseline md:py-8">
                <div className="md:col-span-6">
                  <p className="micro flex items-center gap-3">
                    <span className="text-ember">{String(i + 1).padStart(2, "0")}</span>
                    {p.kind}
                  </p>
                  <h2 className="mt-3 font-serif text-[34px] font-normal italic leading-none tracking-[-0.01em] md:text-[42px]">
                    <Link href={href} className="transition-colors hover:text-ember">
                      {p.name}
                      <span className="sr-only"> — {p.links?.caseStudy ? "read the case study" : "see it on the home page"}</span>
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">{p.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:col-span-3">
                  <Chip tone="role" dot={false}>
                    {p.role}
                  </Chip>
                  {p.achievement && <Chip tone="achievement">{p.achievement}</Chip>}
                </div>

                <div className="flex flex-col items-start gap-3 md:col-span-3 md:items-end">
                  <StatusChip status={p.status} note={p.statusNote} />
                  <ul className="flex flex-wrap gap-1.5 md:justify-end" aria-label={`${p.name} stack`}>
                    {p.stack.slice(0, 4).map((tech) => (
                      <li key={tech} className="border border-line-strong px-2 py-1 font-mono text-[11px] text-muted">
                        {tech}
                      </li>
                    ))}
                    {p.stack.length > 4 && <li className="px-1 py-1 font-mono text-[11px] text-faint">+{p.stack.length - 4}</li>}
                  </ul>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]">
                    {p.links?.caseStudy && (
                      <Link href={`/work/${p.slug}`} className="inline-flex min-h-11 items-center gap-1.5 text-ink transition-colors hover:text-ember">
                        Case study <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                      </Link>
                    )}
                    {p.links?.live && (
                      <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-ember">
                        Live ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                    {p.links?.repo && (
                      <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-ember">
                        Code ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="container-x mt-14 flex flex-wrap items-center gap-4">
        <Button href="/#contact">{site.navCta.label}</Button>
        <Link href="/" className="inline-flex min-h-11 items-center font-mono text-[12px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink">
          {s.back}
        </Link>
      </div>
    </article>
  );
}
