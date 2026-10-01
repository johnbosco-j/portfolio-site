/**
 * Theme switches for "Iga Night". Flags only — no copy lives here.
 *
 * The character throughout the site is an original mascot (an indigo-hooded chibi ninja,
 * built procedurally in components/scene/mascot.ts). It is drawn by us, so there is no
 * third-party artwork anywhere in the site and nothing that can be taken down.
 */
export const theme = {
  /** Lazy-load the three.js night scene at all. Off = the SVG poster only, everywhere. */
  scene: true,
  /** Sakura petals: counts are per device, and the scene halves them on phones. */
  petals: { desktop: 160, phone: 50, cssFallback: 12 },
  /** Mascot poses the hero cycles through when you move the pointer or tilt the phone. */
  poses: ["idle", "look", "leap"] as const,
  /** Milliseconds between shuriken throws, at most. */
  shurikenCooldown: 6000,
} as const;

export type Pose = (typeof theme.poses)[number];
