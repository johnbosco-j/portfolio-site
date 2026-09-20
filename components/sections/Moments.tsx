import Image from "next/image";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { moments, momentsSection } from "@/content/about";
import { publicFileExists } from "@/lib/assets";

/** Event and achievement photos. Hidden entirely until photos are added to content/about.ts. */
export function Moments() {
  const items = moments.filter((m) => publicFileExists(m.src));
  if (items.length === 0) return null;
  return (
    <section id="moments" aria-labelledby="moments-title" className="fade-divider section-y relative">
      <div className="container-x">
        <SectionHeader heading={momentsSection.heading} intro={momentsSection.intro} id="moments-title" word={momentsSection.word} />
        <ul className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {items.map((m, i) => (
            <li key={m.src} className="break-inside-avoid" data-reveal="tile" style={{ ["--i" as string]: i % 3 }}>
              <figure className="tile tile-hover group overflow-hidden">
                <div className="relative overflow-hidden">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    width={800}
                    height={600}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full grayscale-[0.35] transition-[transform,filter] duration-3 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <figcaption className="flex items-start justify-between gap-3 p-4">
                  <span className="text-[15px] text-ink-2">{m.caption}</span>
                  {(m.tag || m.date) && <span className="flex-none font-mono text-[11px] uppercase tracking-[0.06em] text-ember">{m.tag ?? m.date}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
