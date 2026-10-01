/**
 * Theme switches for "Iga Night". Flags only — no copy lives here.
 *
 * Everyone who appears on this site is an original character, modelled procedurally in
 * lib/scene/cast.ts. There is no third-party artwork anywhere in the build: nothing is
 * downloaded, nothing is self-hosted, and nothing can be taken down.
 */
export const theme = {
  /** Lazy-load the three.js stages at all. Off = the SVG poster only, everywhere. */
  scene: true,
  /** Sakura petals: counts are per device, and a stage drops to the phone count under 768px. */
  petals: { desktop: 160, phone: 50, cssFallback: 12 },
  /** Milliseconds between shuriken throws, at most. */
  shurikenCooldown: 6000,
} as const;
