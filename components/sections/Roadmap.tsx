import { SectionHeader } from "@/components/ui/AccentHeading";
import { Chip } from "@/components/ui/Chip";
import { site } from "@/content/profile";
import { roadmap } from "@/content/roadmap";

export function Roadmap() {
  const s = site.roadmap;
  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="fade-divider section-y relative">
      <div className="container-x">
        <SectionHeader heading={s.heading} intro={s.intro} id="roadmap-title" word={s.word} />
        <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
          {roadmap.map((col, ci) => (
            <section
              key={col.id}
              aria-labelledby={`road-${col.id}`}
              data-reveal="tile"
              style={{ ["--i" as string]: ci }}
              className="relative rounded-bento border border-dashed border-line-strong bg-panel/40 p-6 md:p-7"
            >
              <div className="flex items-baseline justify-between">
                <h3 id={`road-${col.id}`} className="font-serif text-[34px] font-normal italic leading-none">
                  {col.title}
                </h3>
                <span className="font-mono text-[12px] text-faint">{String(col.items.length).padStart(2, "0")} plans</span>
              </div>
              <ol className="mt-7 flex flex-col gap-3">
                {col.items.map((item, i) => (
                  <li key={item.text} className="group flex flex-col gap-3 rounded-panel border border-line bg-panel/70 p-4 transition-colors duration-2 hover:border-line-strong">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <Chip tone={item.status === "In progress" ? "progress" : "planned"}>{item.status}</Chip>
                    </div>
                    <p className="text-[15px] leading-snug text-ink-2">{item.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
