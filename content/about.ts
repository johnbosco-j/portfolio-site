// The human part: a short About, photos, and event / achievement moments.
// Photos are optional — drop files in /public and list them here. Anything whose file
// is missing is simply not shown (the monogram stands in for the portrait).

export type Photo = { src: string; alt: string };
export type Moment = Photo & { caption: string; date?: string; tag?: "Hackathon" | "Event" | "Award" | "Team" | "Talk" | "Drive" };

export const about = {
  label: "About",
  heading: { before: "Hi, I’m", accent: "Johnbosco", after: "." },
  paragraphs: [
    "I’m a third-year Computer Science student at LICET in Chennai, and I run Jovora, the company I founded in 2026.",
    "I like problems where software meets the real world — a webcam that notices you’re tired, an institution’s workflows in one system. I build them end to end: database, API, interface, and the part that runs on your device.",
    "Away from the keyboard I play chess, and I’m usually getting ready for the next hackathon.",
  ],
  /** Portrait for the About card. */
  portrait: { src: "/me/portrait.jpg", alt: "Johnbosco J Elanjikal" } satisfies Photo,
  /**
   * The cut-out that stands in front of the name on the poster: background removed and
   * cropped to head-and-shoulders. Replace with a transparent PNG/WebP at this path.
   */
  heroCut: { src: "/me/hero-bust.webp", alt: "Johnbosco J Elanjikal" } satisfies Photo,
  /** Player-card header (like a squad number): his current year of study. */
  card: { number: "№03", note: "Profile ’26", position: "Full-stack · AI & vision", hometown: "Chennai, IN", status: "Active" },
  /** Short "tools I reach for" row on the player card. */
  tools: ["TypeScript", "React", "Next.js", "Python", "FastAPI", "MediaPipe", "Supabase", "Postgres", "WebAssembly", "Electron"],
  facts: [
    { label: "Based in", value: "Chennai, India" },
    { label: "Studying", value: "3rd year · B.E. CSE, LICET" },
    { label: "Building", value: "Jovora · Clareo" },
    { label: "Speaks", value: "English · Tamil · Malayalam" },
  ],
};

/**
 * Event and achievement photos for the "Moments" section (hidden while empty).
 * Example:
 *   { src: "/moments/ctrl-alt-hack.jpg", alt: "Team EyeGuard on stage at Ctrl Alt Hack 2.0",
 *     caption: "EyeGuard — 7th at Ctrl Alt Hack 2.0", tag: "Hackathon" },
 */
export const moments: Moment[] = [
  {
    src: "/moments/ctrl-alt-hack-stage.jpg",
    alt: "Johnbosco on stage with the jury and other winners at the Ctrl Alt Hack 2.0 valedictory ceremony",
    caption: "Ctrl Alt Hack 2.0 — valedictory ceremony at LICET",
    tag: "Hackathon",
  },
  {
    src: "/moments/ctrl-alt-hack-award.jpg",
    alt: "Johnbosco receiving the prize from a juror at Ctrl Alt Hack 2.0",
    caption: "Collecting the prize for EyeGuard — 7th place",
    tag: "Award",
  },
  {
    src: "/moments/ctrl-alt-hack-team.jpg",
    alt: "The winners lined up on stage at Ctrl Alt Hack 2.0",
    caption: "On stage with the other winners",
    tag: "Award",
  },
  {
    src: "/moments/ctrl-alt-hack-hall.jpg",
    alt: "The audience in the hall during the Ctrl Alt Hack 2.0 ceremony",
    caption: "The hall, before the results",
    tag: "Event",
  },
  {
    src: "/moments/drive-coorg.jpg",
    alt: "Johnbosco leaning out of a car window next to an I love Coorg sign",
    caption: "Off the keyboard — on the road in Coorg",
    tag: "Drive",
  },
  {
    src: "/moments/drive-wheel.jpg",
    alt: "Johnbosco at the wheel of a car",
    caption: "Behind the wheel",
    tag: "Drive",
  },
];

export const momentsSection = {
  label: "Moments",
  word: "Moments",
  heading: { before: "Off the", accent: "screen", after: "." },
  intro: "Hackathons, award nights, and the road when I need a break from the screen.",
};
