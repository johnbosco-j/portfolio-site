import type { Visual } from "@/content/projects";

/**
 * Coded previews for each project tile, used until real screenshots are added
 * (`cover` in content/projects.ts). Decorative: aria-hidden. Numbers shown inside these
 * mocks are illustrative UI, not claims — every real metric lives in content/.
 */

function Frame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-panel border border-b-0 border-line bg-bg shadow-[0_20px_60px_-30px_rgb(0_0_0/0.6)]">
      <div className="flex items-center gap-2 border-b border-line bg-panel-2 px-3 py-2">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="ml-2 truncate rounded-full bg-bg px-3 py-0.5 font-mono text-[10px] text-faint">{url}</span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

function ClareoVisual() {
  // A live-looking eye-closure trace (duplicated for a seamless scroll).
  const trace = "M0 40 L20 40 L26 38 L32 40 L60 40 L64 12 L70 12 L74 40 L110 40 L116 36 L122 40 L150 40 L154 10 L160 10 L164 40 L200 40";
  return (
    <Frame url="clareo.rivendevs.in/monitor">
      <div className="grid h-full grid-cols-[1fr_1.4fr] gap-2 p-3 text-[10px] text-muted">
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-line bg-panel p-2">
          <svg viewBox="0 0 36 36" className="size-20 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" className="stroke-line-strong" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" className="stroke-signal" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="66" strokeLinecap="round" />
          </svg>
          <span className="flex items-center gap-1 font-mono uppercase text-signal">
            <span className="pulse-dot size-1.5 rounded-full bg-signal" /> On-device
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 flex-col rounded-lg border border-line bg-panel p-2">
            <span className="font-mono uppercase">Eye closure · live</span>
            <div className="relative mt-1 flex-1 overflow-hidden">
              <svg viewBox="0 0 400 50" preserveAspectRatio="none" className="trace-scroll absolute inset-y-0 left-0 h-full w-[200%]">
                <path d={trace} fill="none" className="stroke-signal" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d={trace} transform="translate(200 0)" fill="none" className="stroke-signal" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-7 items-end gap-1 rounded-lg border border-line bg-panel p-2" style={{ height: 64 }}>
            {[40, 62, 55, 70, 48, 80, 66].map((h, i) => (
              <span key={i} className={`rounded-sm ${i === 5 ? "bg-ink/70" : "bg-line-strong"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function ErpVisual() {
  const tiers = ["Tier 1", "Tier 2", "Tier 3"];
  return (
    <Frame url="excelsior · role-based ERP">
      <div className="grid h-full grid-cols-[76px_1fr] text-[10px] text-muted">
        <div className="flex flex-col gap-1.5 border-r border-line bg-panel p-2">
          {tiers.map((t, i) => (
            <span key={t} className={`whitespace-nowrap rounded px-1.5 py-1 font-mono ${i === 0 ? "bg-ember/15 text-ember" : ""}`}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between rounded-md border border-line bg-panel px-2 py-1.5">
            <span className="text-ink-2">Records</span>
            <span className="font-mono text-faint">RLS · on</span>
          </div>
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="grid grid-cols-[1fr_2fr_1fr] gap-2">
              <span className="h-2 rounded bg-line-strong" />
              <span className="h-2 rounded bg-line" />
              <span className={`h-2 rounded ${r === 1 ? "bg-ember/50" : "bg-line"}`} />
            </div>
          ))}
          <div className="mt-auto flex gap-1.5">
            {tiers.map((t) => (
              <span key={t} className="flex-1 rounded border border-dashed border-line-strong py-1 text-center font-mono text-[9px] text-faint">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function EyeGuardVisual() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-panel border border-b-0 border-line bg-panel-2 p-3 font-mono text-[10px] leading-[1.7] text-muted">
      <p>
        <span className="text-signal">›</span> POST /frame <span className="text-faint"># illustrative</span>
      </p>
      <p className="text-faint">{"{"}</p>
      <p className="pl-3">
        &quot;ear&quot;: <span className="text-signal">0.21</span>, &quot;mar&quot;: <span className="text-signal">0.34</span>,
      </p>
      <p className="pl-3">
        &quot;perclos&quot;: <span className="text-signal">0.18</span>,
      </p>
      <p className="pl-3">
        &quot;state&quot;: <span className="text-ember">&quot;ALERT_WARNING&quot;</span>
      </p>
      <p className="text-faint">{"}"}</p>
      <p>
        <span className="text-signal">›</span> websocket · live <span className="caret inline-block h-3 w-1.5 translate-y-0.5 bg-signal" />
      </p>
    </div>
  );
}

function OLearnVisual() {
  const stages = ["S1", "S2", "S3", "S4", "S5", "S6"];
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-t-panel border border-b-0 border-line bg-panel-2 p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">Enrolment · 6-stage state machine</p>
      <ol className="flex flex-wrap items-center gap-1.5">
        {stages.map((s, i) => (
          <li key={s} className="flex items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${i === 4 ? "border-ember/60 text-ember" : "border-line-strong text-muted"}`}>{s}</span>
            {i < stages.length - 1 && <span className="text-faint">→</span>}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[10px] text-faint">Planned with SRS docs and UML diagrams.</p>
    </div>
  );
}

function ChessVisual() {
  // A small board: pieces as glyphs; the eval bar is illustrative.
  const pieces: Record<string, string> = { "0-4": "♚", "1-3": "♟", "2-5": "♞", "4-2": "♗", "5-4": "♙", "6-1": "♖", "7-4": "♔", "3-6": "♛" };
  return (
    <div className="chess-pattern flex h-full items-center justify-center gap-3 overflow-hidden rounded-t-panel border border-b-0 border-line bg-panel-2 p-4">
      <div className="grid aspect-square h-full max-h-[150px] grid-cols-8 overflow-hidden rounded-md border border-line-strong">
        {Array.from({ length: 64 }, (_, k) => {
          const r = Math.floor(k / 8);
          const c = k % 8;
          const dark = (r + c) % 2 === 1;
          const p = pieces[`${r}-${c}`];
          return (
            <span key={k} className={`grid place-items-center text-[11px] leading-none ${dark ? "bg-line-strong/70" : "bg-panel"} ${p && r > 3 ? "text-ink" : "text-muted"}`}>
              {p}
            </span>
          );
        })}
      </div>
      <div className="flex h-full max-h-[150px] w-2 flex-col overflow-hidden rounded-full border border-line">
        <span className="h-[38%] bg-line-strong" />
        <span className="flex-1 bg-ink/70" />
      </div>
      <div className="font-mono text-[10px] text-faint">
        <p>stockfish.wasm</p>
        <p>
          worker <span className="text-signal">● ready</span>
        </p>
      </div>
    </div>
  );
}

function RivenVisual() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-t-panel border border-b-0 border-line bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgb(229_56_59/0.2),transparent)]" />
      {[90, 70, 50].map((s, i) => (
        <span
          key={s}
          className={`absolute rounded-full border border-ember/50 ${["spin-40", "spin-90", "spin-60"][i]}`}
          style={{ width: `${s}%`, aspectRatio: "1", transform: `rotateX(${60 + i * 8}deg)`, borderTopColor: "rgb(229 56 59)" }}
        />
      ))}
      <span className="relative font-serif text-[44px] leading-none text-ink">RivenDevs</span>
    </div>
  );
}

export function ProjectVisual({ visual }: { visual: Visual }) {
  const map = { clareo: ClareoVisual, erp: ErpVisual, eyeguard: EyeGuardVisual, olearn: OLearnVisual, chess: ChessVisual, rivendevs: RivenVisual } as const;
  const V = map[visual];
  return <V />;
}
