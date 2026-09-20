/** Infinite ticker of shipped work. Pauses on hover; still under reduced motion. */
export function Marquee({ items, className = "" }: { items: readonly string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] ${className}`}>
      <p className="sr-only">Shipped: {items.join(", ")}.</p>
      <ul aria-hidden="true" className="marquee-track flex w-max items-center">
        {[0, 1].map((half) =>
          row.map((item, i) => (
            <li key={`${half}-${i}`} className="display flex items-center gap-6 px-6 text-[clamp(28px,4vw,48px)] leading-none text-ink/80">
              {item}
              <span className="size-2 rotate-45 bg-ember" />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
