import type { CaseStudy } from "@/content/projects";
import { Corners } from "@/components/ui/InstrumentPanel";

/** "What I built" diagram: a left-to-right pipeline (top-to-bottom on phones). */
export function PipelineDiagram({ diagram }: { diagram: CaseStudy["diagram"] }) {
  const hasDevice = diagram.nodes.some((n) => n.onDevice);
  return (
    <figure className="relative overflow-hidden rounded-bento border border-line bg-panel p-6 md:p-8">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_50%,black_30%,transparent_85%)]" />
      <Corners />
      <ol className="relative flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-0">
        {diagram.nodes.map((n, i) => (
          <li key={n.label} className="flex flex-col items-center md:flex-1 md:flex-row" data-reveal style={{ ["--i" as string]: i }}>
            <div
              className={`flex w-full flex-col items-center justify-center rounded-panel border px-3 py-4 text-center md:min-h-[96px] ${
                n.onDevice ? "border-signal/50 bg-signal-soft/60" : "border-line-strong bg-panel-2"
              }`}
            >
              <span className="text-[15px] font-medium leading-tight text-ink">{n.label}</span>
              {n.note && <span className={`mt-1 font-mono text-[11px] uppercase tracking-[0.04em] ${n.onDevice ? "text-signal" : "text-faint"}`}>{n.note}</span>}
            </div>
            {i < diagram.nodes.length - 1 && (
              <span aria-hidden="true" className="flex h-6 items-center justify-center text-ember md:h-auto md:w-8">
                <svg width="16" height="16" viewBox="0 0 16 16" className="rotate-90 md:rotate-0">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="relative mt-6 flex flex-wrap items-center justify-between gap-3 text-[14px] text-muted">
        <span>{diagram.title}</span>
        {hasDevice && (
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-faint">
            <span className="size-2.5 rounded-sm border border-signal/50 bg-signal-soft" aria-hidden="true" /> On the user’s device
          </span>
        )}
      </figcaption>
    </figure>
  );
}
