import { LINKS } from "./profile";

export type ProjectStatus = "Shipped" | "In progress" | "Planned";

export type Metric = { value: string; label: string; source?: string; kind: "measurement" | "achievement" };

export type CaseStudy = {
  problem: string;
  constraints: string[];
  built: string[];
  /** Left-to-right pipeline drawn as the "what I built" diagram. */
  diagram: { title: string; nodes: { label: string; note?: string; onDevice?: boolean }[] };
  results: string[];
  next: string[];
  /** Details still to confirm — rendered as visible TODO notes, never invented. */
  todo?: string[];
};

/** The coded preview shown in the tile until a real screenshot is added via `cover`. */
export type Visual = "clareo" | "erp" | "eyeguard" | "olearn" | "chess" | "rivendevs";

export type Project = {
  slug: string;
  name: string;
  kind: string;
  status: ProjectStatus;
  statusNote?: string;
  role: string;
  team?: string;
  period?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  metrics?: Metric[];
  achievement?: string;
  links?: { live?: string; repo?: string; caseStudy?: boolean; venture?: boolean };
  venture?: "rivendevs" | "clareo";
  featured?: boolean;
  /** Bento width on desktop (12-column grid). */
  span: 4 | 5 | 7 | 8 | 12;
  visual: Visual;
  cover?: { src: string; alt: string };
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "clareo",
    name: "Clareo",
    kind: "Web + Desktop",
    status: "Shipped",
    role: "Founder & lead engineer",
    summary: "Private, on-device fatigue, eye-strain and posture coaching for people who work at a screen all day.",
    highlights: [
      "Built detection engine v5 with per-person calibration, head-pose gating and low-light enhancement.",
      "Kept monitoring always-on in a Web Worker, plus an Electron tray app.",
      "Shipped analytics — heatmaps, trends, streaks — and a weekly AI coach built from aggregated numbers only.",
      "Added SSO with Google, GitHub, Microsoft and enterprise OIDC.",
    ],
    stack: ["React", "TypeScript", "Vite", "MediaPipe", "Web Workers", "FastAPI", "SQLAlchemy/Alembic", "Postgres", "Electron", "Razorpay", "Claude (AI coach)"],
    metrics: [
      { value: "12/12", label: "closed eyes caught · 0/46 false positives", source: "DETECTION_ENGINE.md", kind: "measurement" },
      { value: "115", label: "automated tests", source: "Clareo README", kind: "measurement" },
    ],
    links: { live: LINKS.clareo, caseStudy: true, venture: true },
    venture: "clareo",
    featured: true,
    span: 7,
    visual: "clareo",
    caseStudy: {
      problem:
        "People who work at a screen all day get tired eyes, blink less and slump forward — and most tools that could warn them want to stream their webcam to a server. I wanted coaching that is useful all day and private by construction.",
      constraints: [
        "Video must never leave the device: the analysis runs in the browser, and the server schema has nowhere to store images or landmarks.",
        "It has to work on ordinary laptops and webcams, in low light, with glasses, smiles and second monitors.",
        "Monitoring must keep running in background tabs and all day, without draining the machine.",
        "Honest accuracy: benchmark on real photographs before claiming anything.",
      ],
      built: [
        "Detection engine v5 in pure TypeScript: a fused, per-person eye-closure signal (EAR + MediaPipe blink scores), guided calibration, drift adaptation and head-pose gating so keyboard glances don’t trigger alerts.",
        "An alarm that fires while the eyes are still closed (1.2 s), plus incomplete and slow blinks, iris-based screen distance and slouch / tech-neck / tilt detection.",
        "Always-on monitoring in a Web Worker, an Electron desktop app with tray and native alerts, and a Picture-in-Picture mini monitor.",
        "A FastAPI + SQLAlchemy + Postgres backend with Alembic migrations, retention jobs, analytics (heatmaps, trends, streaks) and a weekly AI coach written from aggregated numbers only.",
        "Auth with email, Google, GitHub, Microsoft and enterprise OIDC SSO, and Razorpay subscriptions.",
      ],
      diagram: {
        title: "Frames stay on the device; only per-minute numbers travel.",
        nodes: [
          { label: "Webcam", onDevice: true },
          { label: "MediaPipe", note: "Web Worker", onDevice: true },
          { label: "Engine v5", note: "frames discarded", onDevice: true },
          { label: "1 row / minute", note: "numbers only" },
          { label: "FastAPI · Postgres" },
          { label: "Analytics & AI coach" },
        ],
      },
      results: [
        "12/12 real closed-eye photos detected with 0/46 false positives — the old v4 gate caught 3/12.",
        "A 443-face real-world benchmark lives in the test suite.",
        "115 automated tests: 61 backend and 54 engine.",
        "0 frames of video uploaded, by design.",
      ],
      next: [
        "Public launch at clareo.rivendevs.in and the first 200 weekly active users.",
        "Desktop app and the Pro plan, then Teams for companies.",
        "A published accuracy study, and a mobile companion.",
      ],
    },
  },
  {
    slug: "excelsior-erp",
    name: "Excelsior ERP",
    kind: "Institutional management platform",
    status: "Shipped",
    role: "Full-stack developer & architect",
    summary: "A role-based web ERP that runs institutional workflows and student data across three access tiers.",
    highlights: [
      "Designed normalised Supabase schemas protected by Row-Level Security.",
      "Set up full Vercel CI/CD so every change deploys cleanly.",
      "Split access across three role tiers so each user sees only their data.",
    ],
    // TODO: confirm the front-end framework.
    stack: ["Supabase", "Postgres + RLS", "React", "Vercel CI/CD"],
    links: { caseStudy: true },
    featured: true,
    span: 5,
    visual: "erp",
    caseStudy: {
      problem:
        "Institutions run on workflows and student records that are often scattered across spreadsheets and paper. Excelsior brings them into one web platform where each person sees exactly what their role allows.",
      constraints: [
        "Three access tiers with different views of the same data.",
        "Student data has to be protected at the database level, not only in the UI.",
        "Changes must ship safely and often.",
      ],
      built: [
        "Normalised Supabase (Postgres) schemas for institutional workflows and student data.",
        "Row-Level Security policies that enforce the three access tiers inside the database.",
        "A role-based web front end.",
        "Full CI/CD on Vercel.",
      ],
      diagram: {
        title: "Access is enforced in the database, not just the screen.",
        nodes: [
          { label: "Three role tiers" },
          { label: "Web front end", note: "role-based views" },
          { label: "Supabase", note: "API + auth policies" },
          { label: "Postgres + RLS", note: "normalised schemas" },
          { label: "Vercel CI/CD" },
        ],
      },
      results: ["A shipped, role-based ERP running institutional workflows across three access tiers."],
      next: ["Screenshots and a short demo for this page."],
      todo: ["Confirm the front-end framework.", "Add the names of the three access tiers.", "Add usage details the institution is happy to share."],
    },
  },
  {
    slug: "eyeguard",
    name: "EyeGuard",
    kind: "Real-time fatigue-detection API",
    status: "Shipped",
    statusNote: "Hackathon",
    role: "Lead developer",
    summary: "A research-grade REST API for real-time fatigue detection from computer-vision signals, deployed live.",
    highlights: [
      "Tracked 468-point face meshes to compute eye and mouth aspect ratios, PERCLOS and head pose.",
      "Served results through FastAPI REST endpoints and WebSocket streams.",
      "Placed 7th at Ctrl Alt Hack 2.0 — and grew into Clareo.",
    ],
    stack: ["Python", "FastAPI", "MediaPipe", "OpenCV", "NumPy", "REST + WebSocket"],
    achievement: "7th — Ctrl Alt Hack 2.0",
    metrics: [{ value: "7th", label: "Ctrl Alt Hack 2.0", kind: "achievement" }],
    links: { caseStudy: true },
    span: 4,
    visual: "eyeguard",
    caseStudy: {
      problem:
        "Fatigue and microsleeps cause accidents at the wheel and mistakes at long-shift workstations. In one hackathon I set out to detect them in real time from a normal camera and expose the result as an API any dashboard could use.",
      constraints: [
        "Hackathon time limit — a working, deployed demo or nothing.",
        "Real-time: frames have to be processed fast enough to catch a microsleep.",
        "Tell a yawn from speech, and a glance from a nod.",
      ],
      built: [
        "Facial landmark tracking with MediaPipe FaceMesh and OpenCV.",
        "Eye Aspect Ratio and PERCLOS for drowsiness, Mouth Aspect Ratio for yawns, and a Perspective-n-Point solver for head pose.",
        "A finite-state machine with hysteresis: Normal → Warning → Critical drowsiness → Distracted.",
        "FastAPI REST endpoints, WebSocket streams and webhook alerts.",
      ],
      diagram: {
        title: "From a camera frame to an alert in one pipeline.",
        nodes: [
          { label: "Video capture" },
          { label: "MediaPipe · OpenCV", note: "468 landmarks" },
          { label: "EAR · MAR · PnP" },
          { label: "Alert state machine" },
          { label: "FastAPI", note: "REST + WebSocket" },
        ],
      },
      results: ["7th place at Ctrl Alt Hack 2.0.", "Deployed live as an API.", "Became the starting point for Clareo."],
      next: ["The next step already happened: EyeGuard grew into Clareo, rebuilt to run fully on-device."],
    },
  },
  {
    slug: "olearn",
    name: "oLearn",
    kind: "Unified e-learning ecosystem",
    status: "Shipped",
    role: "Project lead",
    team: "4-member team",
    summary: "Led a 14-day agile sprint to deliver an e-learning platform with a 6-stage enrolment state machine.",
    highlights: [
      "Wrote the SRS and UML diagrams to split the work across the team.",
      "Modelled enrolment as a 6-stage state machine.",
      "Delivered in a 14-day sprint.",
    ],
    stack: ["JavaScript", "Full-stack web", "UML / SRS", "Agile / Scrum"],
    links: { repo: "https://github.com/johnbosco-j/oLearn" },
    span: 4,
    visual: "olearn",
  },
  {
    slug: "stockfish-chess",
    name: "Stockfish Chess",
    kind: "Browser-based engine client",
    status: "Shipped",
    role: "Developer",
    summary: "Runs the Stockfish engine in WebAssembly workers behind a React UI for low-latency play.",
    highlights: ["Moved the engine off the main thread into Web Workers.", "Kept the board responsive while the engine thinks."],
    stack: ["React", "WebAssembly", "Web Workers"],
    span: 4,
    visual: "chess",
  },
  {
    slug: "rivendevs-website",
    name: "Riven website",
    kind: "Company site",
    status: "Shipped",
    role: "Designer & developer",
    summary:
      "The site you’ll find at rivendevs.in: a 3D gyroscope hero that follows your mouse or your phone’s tilt, parallax depth, and Riv, an interactive three.js mascot.",
    highlights: [
      "Designed the Riven system — orbit rings, ember light, glass capsule nav.",
      "Built gyroscope and shake input so phones get the same depth as laptops.",
      "Lazy-loaded the three.js mascot so the landing page stays fast.",
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind", "Framer Motion", "three.js"],
    // The GitHub repo is still named rivendevs-site: renaming the company doesn't rename the repo.
    links: { live: LINKS.rivendevs, repo: "https://github.com/johnbosco-j/rivendevs-site" },
    venture: "rivendevs",
    span: 12,
    visual: "rivendevs",
  },
];

export const caseStudies = projects.filter((p) => p.links?.caseStudy && p.caseStudy);
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
