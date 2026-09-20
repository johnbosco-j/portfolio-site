import type { Heading } from "@/content/profile";

/** Renders a heading with exactly one Instrument Serif italic accent word (ember). */
export function AccentText({ heading, flow = false }: { heading: Heading; flow?: boolean }) {
  const after = heading.after;
  const joiner = after && !/^[.,!?]/.test(after) && !after.startsWith(" ") ? " " : "";
  return (
    <>
      {heading.before}{" "}
      <em className={`accent ${flow ? "accent-flow pr-[0.06em]" : "text-ember"}`}>{heading.accent}</em>
      {joiner}
      {after}
    </>
  );
}

export function SectionHeader({
  heading,
  intro,
  id,
  word,
  align = "left",
  children,
}: {
  heading: Heading;
  intro?: string;
  id: string;
  /** Giant outlined word set behind the title, poster style. */
  word?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  const center = align === "center" ? "mx-auto text-center items-center" : "";
  return (
    <header className={`relative flex max-w-3xl flex-col gap-5 ${center}`}>
      {word && (
        <span
          aria-hidden="true"
          className="display outline-word pointer-events-none absolute -top-[0.42em] left-0 select-none whitespace-nowrap text-[clamp(56px,13vw,150px)]"
        >
          {word}
        </span>
      )}
      <h2 id={id} className="display relative text-[clamp(34px,5.4vw,66px)]" data-reveal>
        <AccentText heading={heading} />
      </h2>
      {intro && (
        <p className="max-w-xl font-modern text-[18px] font-light leading-[1.55] text-muted md:text-[19px]" data-reveal style={{ ["--i" as string]: 1 }}>
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
