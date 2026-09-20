/**
 * DM Mono number + label + source line.
 * Measurements are lime (signal), achievements are ember (design_port.md §2.3).
 */
export function Stat({
  value,
  label,
  source,
  kind,
  size = "md",
}: {
  value: string;
  label: string;
  source?: string;
  kind: "measurement" | "achievement";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "text-[28px]", md: "text-[40px] md:text-[48px]", lg: "text-[48px] md:text-[56px]" };
  return (
    <div className="flex flex-col gap-1.5">
      <span className={`font-mono font-medium leading-none tracking-[-0.03em] tabular-nums ${sizes[size]} ${kind === "measurement" ? "text-signal" : "text-ember"}`}>
        {value}
      </span>
      <span className="text-[14px] leading-snug text-ink-2">{label}</span>
      {source && <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">Source · {source}</span>}
    </div>
  );
}
