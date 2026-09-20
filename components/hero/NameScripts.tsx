import { profile } from "@/content/profile";

/**
 * His name across 30-odd writing systems, as a strip you can scroll sideways.
 * The three webfonts we load (Malayalam, Urdu, Japanese) cover their scripts; the rest fall
 * back to the system's fonts. It is a real list of his name, so it stays readable text
 * rather than decoration — the region is keyboard-scrollable and labelled.
 */
export function NameScripts({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        role="region"
        aria-label={`${profile.name} written in ${profile.nameIn.length} languages`}
        tabIndex={0}
        className="scroll-strip flex gap-6 overflow-x-auto overscroll-x-contain pb-2 md:gap-8"
      >
        {profile.nameIn.map((n, i) => (
          <p key={n.lang} className="flex flex-none snap-start flex-col gap-1">
            <span className={`script-strip whitespace-nowrap text-[17px] leading-[1.9] md:text-[19px] ${i === 0 ? "text-ember" : "text-ink-2"}`}>
              {n.text}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{n.lang}</span>
          </p>
        ))}
      </div>
      {/* edge fades, so the strip reads as continuing off-screen */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
