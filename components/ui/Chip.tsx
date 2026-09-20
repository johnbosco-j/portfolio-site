import type { ReactNode } from "react";

export type ChipTone = "shipped" | "progress" | "planned" | "role" | "achievement";

const tones: Record<ChipTone, string> = {
  shipped: "border-2 border-signal/40 bg-signal-soft text-signal",
  progress: "border-2 border-ember/50 bg-ember/10 text-ember",
  planned: "border-2 border-dashed border-line-strong text-muted",
  role: "border-2 border-line-strong text-ink-2",
  achievement: "border-2 border-ember/60 bg-ember/5 text-ember",
};

export function Chip({ children, tone = "role", dot, className = "" }: { children: ReactNode; tone?: ChipTone; dot?: boolean; className?: string }) {
  const showDot = dot ?? (tone === "shipped" || tone === "progress");
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 py-1 font-mono text-micro uppercase tracking-[0.1em] ${tones[tone]} ${className}`}>
      {showDot && <span aria-hidden="true" className={`size-1.5 ${tone === "shipped" ? "bg-signal" : "bg-ember"}`} />}
      {children}
    </span>
  );
}

/** Maps a content status to its chip. */
export function StatusChip({ status, note }: { status: "Shipped" | "In progress" | "Planned" | "Live" | "Shipping" | "Building" | "In research" | "Coming"; note?: string }) {
  const tone: ChipTone =
    status === "Shipped" || status === "Live" || status === "Shipping" ? "shipped" : status === "In progress" || status === "Building" ? "progress" : "planned";
  return (
    <Chip tone={tone}>
      {status}
      {note && <span className="opacity-70">· {note}</span>}
    </Chip>
  );
}
