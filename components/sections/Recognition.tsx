import { Award, GraduationCap, Trophy } from "lucide-react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { Stat } from "@/components/ui/Stat";
import { certifications, education, placements } from "@/content/achievements";
import { profile, site } from "@/content/profile";

export function Recognition() {
  const s = site.recognition;
  return (
    <section id="recognition" aria-labelledby="recognition-title" className="fade-divider section-y relative">
      <div className="container-x">
        <SectionHeader heading={s.heading} id="recognition-title" word={s.word} />
        <div className="mt-14 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {/* Placements */}
          {placements.map((p, i) => (
            <article key={p.event} data-reveal="tile" style={{ ["--i" as string]: i }} className="tile tile-hover relative overflow-hidden p-7 lg:col-span-3">
              <Trophy size={20} strokeWidth={1.5} className="text-ember" aria-hidden="true" />
              <div className="mt-10">
                <Stat value={p.value} label={p.event} kind="achievement" size="lg" />
              </div>
              {p.project && (
                <p className="mt-3 text-[14px] text-muted">
                  with{" "}
                  {p.href ? (
                    <a href={p.href} className="font-serif text-[17px] italic text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ember">
                      {p.project}
                    </a>
                  ) : (
                    p.project
                  )}
                </p>
              )}
              <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-10 font-mono text-[140px] font-medium leading-none text-ember/[0.06]">
                {p.value.replace(/\D/g, "")}
              </span>
            </article>
          ))}

          {/* Certifications */}
          <article data-reveal="tile" style={{ ["--i" as string]: 2 }} className="tile tile-hover p-7 md:col-span-2 lg:col-span-6">
            <div className="flex items-center gap-2">
              <Award size={18} strokeWidth={1.5} className="text-ember" aria-hidden="true" />
              <h3 className="micro text-ink-2">Certifications</h3>
            </div>
            <ul className="mt-6 divide-y divide-line">
              {certifications.map((c) => (
                <li key={c.name} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                  <span className="text-[17px]">{c.name}</span>
                  <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-faint">{c.issuer}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-[14px] text-muted">
              <span className="micro">Languages</span>
              {profile.languages.map((l) => (
                <span key={l.name}>
                  {l.name} <span className="text-faint">· {l.level}</span>
                </span>
              ))}
            </div>
          </article>

          {/* Education */}
          {education.map((e, i) => (
            <article key={e.institution} data-reveal="tile" style={{ ["--i" as string]: i }} className="tile tile-hover flex flex-col gap-6 p-7 sm:flex-row sm:items-end sm:justify-between md:col-span-2 lg:col-span-6">
              <div>
                <GraduationCap size={20} strokeWidth={1.5} className="text-ember" aria-hidden="true" />
                <h3 className="mt-6 font-serif text-[28px] font-normal italic leading-tight">{e.institution}</h3>
                <p className="mt-2 text-[14px] text-muted">{e.detail}</p>
              </div>
              <div className="flex-none sm:text-right">
                <Stat value={e.value} label={e.valueLabel} kind="achievement" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
