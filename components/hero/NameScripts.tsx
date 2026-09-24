import { profile } from "@/content/profile";

/**
 * His name across 32 writing systems, running continuously as a loop.
 * The language names are not printed — each entry carries a `lang` attribute so browsers
 * and screen readers still know what they are reading. The row pauses when you hover it and
 * holds still under reduced motion (globals.css).
 */
export function NameScripts({ className = "" }: { className?: string }) {
  const row = profile.nameIn;
  return (
    <div
      className={`marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)] ${className}`}
    >
      <p className="sr-only">{`${profile.name} — his name written in ${row.length} languages.`}</p>
      <ul aria-hidden="true" className="marquee-track marquee-track--slow flex w-max items-center py-1">
        {[0, 1].map((half) =>
          row.map((n, i) => (
            <li key={`${half}-${i}`} lang={n.code} className="flex items-center gap-6 px-3 md:gap-8 md:px-4">
              <span className={`script-strip whitespace-nowrap text-[17px] leading-[1.9] md:text-[19px] ${i === 0 ? "text-ember" : "text-ink-2"}`}>
                {n.text}
              </span>
              <span aria-hidden="true" className="size-1.5 flex-none rotate-45 bg-ember/70" />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
