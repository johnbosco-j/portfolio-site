import { Hammer, Building2, GraduationCap, Crown } from "lucide-react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { Chip } from "@/components/ui/Chip";
import { InstrumentPanel } from "@/components/ui/InstrumentPanel";
import { now } from "@/content/now";
import { site } from "@/content/profile";

const icons = { Building: Hammer, Running: Building2, Studying: GraduationCap, Playing: Crown } as const;

export function Now() {
  const s = site.now;
  return (
    <section id="now" aria-labelledby="now-title" className="relative py-22 md:py-28">
      <div className="container-x">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader heading={s.heading} id="now-title" word={s.word} />
          <p className="micro" data-reveal>
            Updated <time className="text-ink-2">{now.updated}</time>
          </p>
        </div>
        <InstrumentPanel title={s.panelTitle} status="Live" bodyClassName="grid gap-px bg-line/60 sm:grid-cols-2 lg:grid-cols-4">
          {now.items.map((item, i) => {
            const Icon = icons[item.label];
            return (
              <article key={item.label} data-reveal="tile" style={{ ["--i" as string]: i }} className="group relative flex min-h-[220px] flex-col gap-4 bg-panel p-6">
                <div className="flex items-center justify-between">
                  <span className="micro flex items-center gap-2">
                    <Icon size={16} strokeWidth={1.5} className="text-ember" aria-hidden="true" />
                    {item.label}
                  </span>
                  {item.status && <Chip tone={item.status.live ? "shipped" : "progress"}>{item.status.text}</Chip>}
                </div>
                <h3 className="font-serif text-[30px] font-normal italic leading-none tracking-[-0.01em]">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{item.body}</p>
                <span aria-hidden="true" className="mt-auto h-px w-full origin-left scale-x-[0.15] bg-ember/60 transition-transform duration-3 ease-out group-hover:scale-x-100" />
              </article>
            );
          })}
        </InstrumentPanel>
      </div>
    </section>
  );
}
