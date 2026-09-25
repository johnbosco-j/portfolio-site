import type { ReactNode } from "react";

/**
 * Clareo × RivenDevs HUD: a panel with ember corner brackets, a mono top bar
 * (`LABEL · status ●`) and a dot-grid backdrop.
 */
export function InstrumentPanel({
  title,
  status,
  live = true,
  className = "",
  bodyClassName = "",
  children,
}: {
  title: string;
  status?: string;
  live?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`spotlight relative overflow-hidden rounded-bento border border-line bg-panel shadow-hairline ${className}`}>
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,black_30%,transparent_80%)]" />
      <Corners />
      <div className="relative flex items-center justify-between gap-3 border-b border-line/70 px-5 py-3 font-mono text-micro uppercase md:px-6">
        <span className="truncate text-ink-2">{title}</span>
        {status && (
          <span className="flex items-center gap-2 whitespace-nowrap text-faint">
            <span className={`size-1.5 rounded-full ${live ? "pulse-dot bg-signal" : "bg-faint"}`} aria-hidden="true" />
            {status}
          </span>
        )}
      </div>
      <div className={`relative ${bodyClassName}`}>{children}</div>
    </div>
  );
}

export function Corners({ inset = "3", className = "" }: { inset?: "2" | "3"; className?: string }) {
  const pos = inset === "2"
    ? ["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-b border-l", "right-2 bottom-2 border-b border-r"]
    : ["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-b border-l", "right-3 bottom-3 border-b border-r"];
  return (
    <>
      {pos.map((c) => (
        <span key={c} aria-hidden="true" className={`pointer-events-none absolute z-10 size-3.5 border-ember/60 ${c} ${className}`} />
      ))}
    </>
  );
}
