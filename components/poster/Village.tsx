import { r3 } from "@/lib/geometry";

/**
 * The Iga Night poster: original flat-illustration scenery, drawn as inline SVG.
 *
 * These are server components with no JS behind them, so they are the first paint, the
 * no-JS view and the reduced-motion fallback all at once. They sit in <ParallaxLayer> at
 * the depths from design_port.md: sky 0.15×, ridge 0.35×, rooftops 1.2×.
 *
 * Each layer anchors on its subject (moon right, pagoda right, torii left) so a phone
 * crops the empty sky rather than the thing worth seeing.
 * Flat fills, two shade steps, 2px ink strokes — one illustration language throughout.
 * Decorative: every layer is aria-hidden, and the text above carries the meaning.
 */

/** Deterministic star field — fixed so the server and client markup match exactly. */
const STARS = Array.from({ length: 46 }, (_, i) => {
  // A cheap hash gives a scattered but stable layout.
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  return {
    x: r3(((a - Math.floor(a)) * 1440)),
    y: r3(((b - Math.floor(b)) * 380)),
    r: i % 7 === 0 ? 1.8 : i % 3 === 0 ? 1.2 : 0.8,
    dim: i % 4 === 0,
  };
});

/** L0 — the night sky: gradient, stars, the moon and its halo, slow clouds. */
export function NightSky({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 600" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" className={`size-full ${className}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(11 16 48)" />
          <stop offset="0.55" stopColor="rgb(9 13 38)" />
          <stop offset="1" stopColor="rgb(7 10 31)" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgb(255 231 168)" stopOpacity="0.3" />
          <stop offset="0.45" stopColor="rgb(255 217 138)" stopOpacity="0.12" />
          <stop offset="1" stopColor="rgb(255 217 138)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="600" fill="url(#sky)" />

      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="rgb(244 239 228)" opacity={s.dim ? 0.35 : 0.7} />
      ))}

      {/* the moon, with a halo that breathes */}
      <g className="moon-breathe" style={{ transformOrigin: "1150px 160px" }}>
        <circle cx="1150" cy="160" r="190" fill="url(#halo)" />
      </g>
      <circle cx="1150" cy="160" r="66" fill="rgb(255 231 168)" />
      {/* craters: two shade steps, no gradients */}
      <circle cx="1128" cy="140" r="13" fill="rgb(238 212 150)" opacity="0.55" />
      <circle cx="1168" cy="178" r="9" fill="rgb(238 212 150)" opacity="0.45" />
      <circle cx="1158" cy="128" r="6" fill="rgb(238 212 150)" opacity="0.4" />

      {/* clouds drifting across the moon */}
      <g className="cloud-drift" fill="rgb(30 63 168)" opacity="0.5">
        <path d="M980 196c22-10 52-8 68 4 10-16 44-20 62-8 14-9 40-6 48 7 10-3 24 1 26 9H966c0-6 6-11 14-12Z" />
      </g>
      <g className="cloud-drift cloud-drift--slow" fill="rgb(22 30 74)" opacity="0.6">
        <path d="M1180 108c18-8 42-6 55 3 8-13 35-16 50-6 11-7 32-5 38 6 8-2 19 1 21 7h-179c0-5 6-9 15-10Z" />
      </g>
    </svg>
  );
}

/** L1 — the far horizon: Iga mountains, a pagoda silhouette, mist. */
export function FarRidge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" className={`size-full ${className}`}>
      {/* back range — the deeper indigo */}
      <path
        d="M0 320V214l96-52 74 40 86-66 92 58 70-36 104 70 88-54 96 62 78-44 110 72 84-50 92 58 78-38 92 56v130Z"
        fill="rgb(30 63 168)"
        opacity="0.3"
      />
      {/* front range */}
      <path
        d="M0 320V258l120-62 96 50 78-40 120 74 92-48 86 56 104-66 92 60 86-42 118 70 98-54 110 66v98Z"
        fill="rgb(22 30 74)"
      />

      {/* pagoda on the right ridge: three roofs, a mast and a lit window */}
      <g transform="translate(1058 128)" fill="rgb(16 22 58)">
        <rect x="26" y="-22" width="3" height="22" />
        <path d="M-6 0h66l-10 11H4Z" />
        <path d="M-16 12h86l-12 13H-4Z" />
        <rect x="8" y="25" width="38" height="24" />
        <path d="M-10 49h74l-11 12H1Z" />
        <rect x="12" y="61" width="30" height="26" />
        <path d="M-4 87h62l-9 11H5Z" />
        <rect x="16" y="98" width="22" height="26" />
      </g>
      <rect x="1082" y="150" width="7" height="9" fill="rgb(255 200 87)" opacity="0.8" />

      {/* mist bands */}
      <rect y="238" width="1440" height="26" fill="rgb(156 162 194)" opacity="0.06" />
      <rect y="276" width="1440" height="18" fill="rgb(156 162 194)" opacity="0.05" />
    </svg>
  );
}

/** One tiled roof ridge: the eave line plus its row of tile ends. */
function Roof({ x, y, w, h, shade = false }: { x: number; y: number; w: number; h: number; shade?: boolean }) {
  const tiles = Math.max(3, Math.round(w / 26));
  const fill = shade ? "rgb(11 16 48)" : "rgb(16 22 58)";
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* the slope, with a slight upward flick at each end */}
      <path d={`M0 ${h}L${w * 0.08} 6Q${w / 2} -10 ${w * 0.92} 6L${w} ${h}Z`} fill={fill} stroke="rgb(35 43 92)" strokeWidth="2" />
      {/* tile ends along the eave */}
      {Array.from({ length: tiles }, (_, i) => (
        <circle key={i} cx={r3(6 + (i * (w - 12)) / (tiles - 1))} cy={h} r="3.4" fill="rgb(35 43 92)" />
      ))}
    </g>
  );
}

/** A paper lantern: body, ribs, cap and a warm flicker. */
function Lantern({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="0" y1="-26" x2="0" y2="-10" stroke="rgb(35 43 92)" strokeWidth="2" />
      <g className="lantern-flicker" style={{ animationDelay: `${delay}ms` }}>
        <ellipse cx="0" cy="0" rx="30" ry="30" fill="rgb(255 200 87)" opacity="0.1" />
        <rect x="-11" y="-10" width="22" height="26" rx="9" fill="rgb(255 200 87)" />
        <rect x="-11" y="-10" width="22" height="26" rx="9" fill="none" stroke="rgb(26 18 6)" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="-10" y1="-2" x2="10" y2="-2" stroke="rgb(26 18 6)" strokeOpacity="0.3" strokeWidth="1.2" />
        <line x1="-10" y1="6" x2="10" y2="6" stroke="rgb(26 18 6)" strokeOpacity="0.3" strokeWidth="1.2" />
      </g>
      <rect x="-6" y="-13" width="12" height="4" rx="1" fill="rgb(35 43 92)" />
      <rect x="-6" y="15" width="12" height="4" rx="1" fill="rgb(35 43 92)" />
    </g>
  );
}

/** L3 — the near foreground: rooftops, a torii gate and hanging lanterns. */
export function NearRooftops({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="xMinYMax slice" aria-hidden="true" className={`size-full ${className}`}>
      {/* torii, left of frame */}
      <g transform="translate(150 54)">
        <rect x="-4" y="40" width="15" height="166" fill="rgb(214 40 57)" />
        <rect x="131" y="40" width="15" height="166" fill="rgb(214 40 57)" />
        <rect x="-16" y="30" width="174" height="12" rx="2" fill="rgb(214 40 57)" />
        <path d="M-30 14h202l-10 16H-20Z" fill="rgb(214 40 57)" />
        <rect x="26" y="62" width="92" height="9" rx="2" fill="rgb(214 40 57)" />
      </g>

      {/* rooftops across the bottom */}
      <Roof x={-40} y={150} w={330} h={110} />
      <Roof x={250} y={186} w={300} h={74} shade />
      <Roof x={520} y={132} w={360} h={128} />
      <Roof x={840} y={178} w={300} h={82} shade />
      <Roof x={1110} y={146} w={370} h={114} />

      {/* lanterns hung along the eaves */}
      <Lantern x={360} y={206} s={0.9} />
      <Lantern x={690} y={158} delay={700} />
      <Lantern x={980} y={198} s={0.85} delay={1400} />
      <Lantern x={1260} y={168} s={0.95} delay={2100} />
    </svg>
  );
}
