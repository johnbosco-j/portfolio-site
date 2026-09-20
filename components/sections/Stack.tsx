import { SectionHeader } from "@/components/ui/AccentHeading";
import { Chip } from "@/components/ui/Chip";
import { site } from "@/content/profile";
import { projectBySlug } from "@/content/projects";
import { skillGroups, type SkillGroup } from "@/content/skills";

const span: Record<SkillGroup["span"], string> = { 4: "lg:col-span-4", 6: "lg:col-span-6", 8: "lg:col-span-8", 12: "lg:col-span-12" };

/** Where a project lives on the site: its case study if it has one, else its tile. */
const projectHref = (slug: string) => {
  const p = projectBySlug(slug);
  return p?.links?.caseStudy ? `/work/${slug}` : `#work-${slug}`;
};

export function Stack() {
  const s = site.stack;
  return (
    <section id="stack" aria-labelledby="stack-title" className="fade-divider section-y relative">
      <div className="container-x">
        <SectionHeader heading={s.heading} intro={s.intro} id="stack-title" word={s.word} />
        <div className="mt-14 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {skillGroups.map((g, gi) => (
            <section
              key={g.id}
              aria-labelledby={`skills-${g.id}`}
              data-reveal="tile"
              style={{ ["--i" as string]: gi % 3 }}
              className={`tile tile-hover p-6 md:p-7 ${span[g.span]} ${g.id === "learning" ? "border-dashed" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id={`skills-${g.id}`} className="micro text-ink-2">
                  {g.title}
                </h3>
                {g.note ? <Chip tone="progress">{g.note}</Chip> : <span className="font-mono text-[12px] text-faint">{String(g.skills.length).padStart(2, "0")}</span>}
              </div>
              <ul className="mt-6 flex flex-col divide-y divide-line">
                {g.skills.map((sk) => (
                  <li key={sk.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                    <span className="text-[16px] text-ink">{sk.name}</span>
                    {sk.usedIn && sk.usedIn.length > 0 && (
                      <span className="flex flex-wrap gap-x-3 font-mono text-[11px] uppercase tracking-[0.04em] text-faint">
                        <span className="sr-only">Used in:</span>
                        {sk.usedIn.map((slug) => (
                          <a key={slug} href={projectHref(slug)} className="py-1 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ember hover:decoration-ember">
                            {projectBySlug(slug)?.name ?? slug}
                          </a>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
