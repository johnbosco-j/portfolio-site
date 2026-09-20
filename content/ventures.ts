import { LINKS } from "./profile";

export type Measurement = { value: string; label: string; source: string };

export type Venture = {
  id: "jovora" | "clareo";
  name: string;
  tagline: string;
  body: string;
  role: string;
  since?: string;
  status: "Live" | "Shipping" | "Building";
  href: string;
  cta: string;
  measurements?: Measurement[];
  smallPrint?: string;
};

export const ventures: Venture[] = [
  {
    id: "jovora",
    name: "Jovora",
    tagline: "Clear technology for the real world.",
    body: "A multi-domain technology company I founded in 2026. We take one hard problem at a time and ship it properly, and we build websites and AI systems for people who need them, at a minimal cost.",
    role: "Founder & Owner",
    since: "2026",
    status: "Building",
    href: LINKS.jovora,
    cta: "Visit Jovora",
  },
  {
    id: "clareo",
    name: "Clareo",
    tagline: "Screen all day. Keep your eyes.",
    body: "Private, on-device fatigue, eye-strain and posture coaching. Video never leaves the computer.",
    role: "Founder, lead engineer",
    status: "Shipping",
    href: LINKS.clareo,
    cta: "Visit Clareo",
    // Re-sync from clareo/README.md and clareo/docs/DETECTION_ENGINE.md when benchmarks change.
    measurements: [
      { value: "12/12", label: "real closed-eye photos detected · 0/46 false positives (detection v5)", source: "Clareo engine test suite / DETECTION_ENGINE.md" },
      { value: "443", label: "face real-world benchmark in the test suite", source: "Clareo engine test suite / DETECTION_ENGINE.md" },
      { value: "1.2 s", label: "of closed eyes before the wake-up alarm", source: "Clareo engine test suite / DETECTION_ENGINE.md" },
      { value: "115", label: "automated tests · 61 backend · 54 engine", source: "Clareo engine test suite / README.md" },
      { value: "0 frames", label: "of video uploaded — analysis stays on the device", source: "Clareo architecture / DETECTION_ENGINE.md" },
    ],
    smallPrint: "Clareo is a wellness tool, not a medical device.",
  },
];

/** Jovora's planned domains (copy mirrors jovora.ai) — faint, dashed planets in the Ventures orbit. */
export type PlannedDomain = { name: string; short: string; status: "In research" | "Coming"; body: string };

export const plannedDomains: PlannedDomain[] = [
  { name: "Robotics & Embedded", short: "Robotics", status: "In research", body: "Perception and control for machines in the physical world, built for small edge devices." },
  { name: "Developer Tools", short: "Dev tools", status: "In research", body: "Software that makes building software faster, calmer and more reliable." },
  { name: "Education", short: "Education", status: "Coming", body: "Learning platforms and tools for students and the institutions that teach them." },
  { name: "Institutional Platforms", short: "Institutions", status: "Coming", body: "ERP, workflow and data systems for colleges and organisations that have outgrown spreadsheets." },
];

/** All six Jovora domains with honest status (mirrors jovora.ai). */
export const jovoraDomains: { name: string; status: "Shipping" | "In research" | "Coming" }[] = [
  { name: "AI & Machine Perception", status: "Shipping" },
  { name: "Health & Human Wellbeing", status: "Shipping" },
  ...plannedDomains.map((d) => ({ name: d.name, status: d.status })),
];
