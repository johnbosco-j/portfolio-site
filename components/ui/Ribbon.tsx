/**
 * A tilted marquee band, as on a printed sports poster. Two of these cross under the
 * hero: a red one with the motto, a dark one with the stack. Still under reduced motion.
 */
export function Ribbon({
  items,
  tone = "red",
  reverse = false,
  fast = false,
  className = "",
}: {
  items: readonly string[];
  tone?: "red" | "ink";
  reverse?: boolean;
  fast?: boolean;
  className?: string;
}) {
  const row = [...items, ...items];
  const tones =
    tone === "red"
      ? "border-y-2 border-[#8d1418] bg-ember-fill text-white"
      : "border-y-2 border-line-strong bg-panel-2 text-ink";
  return (
    <div className={`${reverse ? "ribbon--rev" : "ribbon"} relative overflow-hidden ${tones} ${className}`} aria-hidden="true">
      <ul className={`marquee-track ${fast ? "marquee-track--fast" : ""} ${reverse ? "marquee-track--rev" : ""} flex w-max items-center py-2.5 md:py-3`}>
        {[0, 1].map((half) =>
          row.map((item, i) => (
            <li key={`${half}-${i}`} className="display flex items-center gap-5 whitespace-nowrap px-5 text-[18px] md:text-[22px]">
              {item}
              <span className={`inline-block size-2 rotate-45 ${tone === "red" ? "bg-white/80" : "bg-ember"}`} />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
