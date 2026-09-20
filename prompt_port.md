# Prompt — Build the portfolio of Johnbosco J Elanjikal

> Paste everything below the line into your AI builder (Claude Code, Cursor, v0, Lovable, Bolt). Keep `design_port.md` and `skills_port.md` in the project root; key values are repeated here so this prompt also works on its own. The Jovora site (`../jovora-site`) is the reference implementation for shared components.

---

## Role

You are a senior product designer and front-end engineer. Build the personal portfolio of **Johnbosco J Elanjikal**: third-year Computer Science student, full-stack developer, and founder of **Jovora**. Deliver production-quality code: responsive, accessible, fast, easy to update every month. It must feel like it was made by the same hands as the Jovora site and the Clareo app, because it was.

## Who he is

- **Johnbosco J Elanjikal**, Chennai, India.
- **Current third-year student**, B.E. Computer Science & Engineering, Loyola-ICAM College of Engineering and Technology (LICET), Chennai. **Not yet graduated**: every mention of the degree must read as in progress. CGPA **8.09** so far (through the 4th semester). Expected graduation: `TODO: confirm year` (do not guess).
- School: St. Joseph Matriculation Higher Secondary School, Ambattur. Class 12: **89%**.
- **Founder & owner of Jovora**, a multi-domain technology company: AI & machine perception, health & human wellbeing, robotics & embedded systems, developer tools, education technology, institutional & enterprise platforms. Jovora also builds full-stack websites and AI systems for clients at a minimal, honest cost.
- **Clareo** is Jovora's first product: private, on-device eye-fatigue, eye-strain and posture coaching for people who work at screens all day. It began as his hackathon project **EyeGuard**.
- Full-stack developer across web platforms, real-time APIs, computer vision and systems programming.
- Languages: English (fluent), Tamil (native), Malayalam (basic).
- Interests: developer tools, competitive hackathons, chess, systems programming.
- Personality for the copy: builder-first, honest about what's shipped and what's planned, ambitious but grounded, short sentences, first person.

## Audience and goal

Recruiters and internship leads, hackathon teammates, potential clients for Jovora's services, college and incubator mentors, and early investors. In under a minute they should know:

1. who he is,
2. what he has **shipped**,
3. what he is **building now** (Jovora, Clareo),
4. what comes **next**,
5. how to reach him.

## Tech requirements

- **Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 3**, Framer Motion, `next/font` (Instrument Sans, Instrument Serif, DM Mono, Geist), lucide-react. Deploy to Vercel with static generation.
- All copy, links and data in typed files under `content/` (`profile.ts`, `ventures.ts`, `projects.ts`, `journey.ts`, `skills.ts`, `achievements.ts`, `roadmap.ts`, `now.ts`). No hard-coded copy in components.
- Env vars: `NEXT_PUBLIC_SITE_URL` (default `https://johnbosco.jovora.ai`), `NEXT_PUBLIC_JOVORA_URL` (default `https://jovora.ai`), `NEXT_PUBLIC_CLAREO_URL` (default `https://clareo.jovora.ai`), `NEXT_PUBLIC_LINKEDIN_URL` (optional; hide the link while unset), `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (optional; log only when unset).
- GitHub: `https://github.com/johnbosco-j`.
- External links open in a new tab (`rel="noopener noreferrer"`) with a visible ↗.
- Light and dark themes (dark default, follows the system, toggle in the nav, no flash on load).

## Visual design (summary of design_port.md)

- **Blend:** Jovora's atmosphere (near-black, orbit rings, parallax, glass capsule nav, serif-italic accents, film grain) with Clareo's "Optic" instruments (bento panels, iris mark, lime live-signal, mono readouts, warm-paper light theme).
- **Colours (dark):** bg `#0A0B0D`, bg-2 `#0E1013`, panel `#121418`, panel-2 `#181B20`, line `#22262D`, ink `#EEF0EA`, muted `#8D9189`. **Ember** `#FF6A1A` is the founder accent (CTAs, accent words, orbit). **Signal lime** `#C8FF3D` is for live status, measurements and code. Follow the two-accent rule: never both fills in one component; max one of each fill per viewport.
- **Light "paper":** bg `#F3F2EC`, panel `#FBFAF6`, ink `#121212`; ember text `#C2410C`, lime text `#4F7300`.
- **Type:** Instrument Sans headings, Instrument Serif italic accents and venture names, Geist for lead paragraphs, DM Mono for numbers and labels. Hero name `clamp(52px, 8.5vw, 124px)`.
- **Layout:** 12-col, max 1240px, bento grids with radius 22/16, pills 999, fading hairline dividers.

## Depth, 3D and interaction

- Layers: L0 0.15× (glow + drifting star field), L1 0.35× (orbit), L2 content, L3 1.2–1.4× (device mocks). Animate transform/opacity only.
- **Laptop:** mouse drives the orbit's 3D tilt, the iris gaze, the star field, and a warm cursor light in the hero; card spotlights follow the pointer.
- **Phone / tablet:** gyroscope drives the same (iOS: ask on a tap: "Tap · move it with your phone"); a **shake** makes the orbit wobble on a spring. Parallax at 0.75×. A full-screen numbered menu.
- `prefers-reduced-motion`: everything still, nothing hidden.

## Page structure and copy

Write polished final copy from the drafts below. Keep sentences short and specific.

### 1. Capsule nav

Personal mark (a "J" inside a lime iris ring) + "Johnbosco" · `Work · Ventures · Journey · Stack · Contact` · theme toggle · ember **Hire me** (goes to Contact; the label is a content value and can become "Work with me").

### 2. Hero — "Orbit + Iris"

- Micro-label (mono): `FOUNDER · JOVORA — 3RD-YEAR CSE · LICET — CHENNAI`
- Status chip (lime dot, content-driven): `● Open to internships & client projects`
- Name (h1): **Johnbosco** / *J Elanjikal*
- Headline: **I build *clear* software — and a company to ship it.**
  (Alternatives: "Student by day. Founder by night. *Builder* always." · "From hackathon prototype to *product*.")
- Intro (Geist): "I'm a third-year Computer Science student in Chennai and the founder of Jovora. I build full-stack platforms, real-time APIs and on-device computer vision, and I take them from a hackathon weekend to a product people use."
- Buttons: **See my work** (ember) · **Download résumé** (secondary; the public PDF without a phone number) · text link **Visit Jovora ↗**.
- Visual: the CSS-3D ember gyroscope (as on jovora.ai) with a **lime iris** at its centre that follows the cursor, or the phone's tilt, and blinks every 4–7s. The name sits on the nearest depth plane.

### 3. Now (instrument panel, 4 small bento tiles, "Updated <month year>")

- **Building** — Clareo: detection engine v5, desktop app, launch prep. `● Shipping`
- **Running** — Jovora: the company site, client websites and AI work, registration and domain.
- **Studying** — 3rd year, B.E. CSE at LICET (in progress): current semester, CGPA 8.09 so far.
- **Playing** — chess, and the next hackathon.

### 4. Ventures — "What I'm *building*"

An orbit diagram: **Jovora** is the sun; **Clareo** is the live planet (lime); planned domains are dashed orbits: Robotics & Embedded (*In research*), Developer Tools (*In research*), Education (*Coming*), Institutional Platforms (*Coming*). Cards:

- **Jovora** — *Clear technology for the real world.* "A multi-domain technology company I founded in 2026. We take one hard problem at a time and ship it properly, and we build websites and AI systems for people who need them, at a minimal cost." Role: **Founder & Owner**. Button: **Visit Jovora ↗**.
- **Clareo** — *Screen all day. Keep your eyes.* "Private, on-device fatigue, eye-strain and posture coaching. Video never leaves the computer." Role: **Founder, lead engineer**. Measurements (lime, each with a source line: "Clareo engine test suite / DETECTION_ENGINE.md"):
  - `12/12` real closed-eye photos detected, `0/46` false positives (detection v5)
  - `443`-face real-world benchmark in the test suite
  - `1.2 s` of closed eyes before the wake-up alarm
  - `115` automated tests (61 backend · 54 engine)
  - `0 frames` of video uploaded
  Small print: "Clareo is a wellness tool, not a medical device." Button: **Visit Clareo ↗** (signal button).

### 5. Work — "Things I've *shipped*" (bento + case-study pages)

Each tile: mono kind label, status chip, name (serif italic), one-line summary, 2–4 highlights, stack tags, role chip, links. Featured tiles are larger.

1. **Clareo** *(featured, links to Ventures)* — Shipped · Web + Desktop · Founder & lead engineer. Stack: React, TypeScript, Vite, MediaPipe, Web Workers, FastAPI, SQLAlchemy/Alembic, Postgres, Electron, Razorpay, Claude (AI coach). Highlights: detection engine v5 with per-person calibration, head-pose gating and low-light enhancement; always-on monitoring in a Web Worker plus an Electron tray app; analytics (heatmaps, trends, streaks) and a weekly AI coach built from aggregated numbers only; SSO (Google, GitHub, Microsoft, OIDC).
2. **Excelsior ERP** *(featured)* — Institutional management platform · Full-stack developer & architect · Shipped. "A role-based web ERP that runs institutional workflows and student data across three access tiers." Highlights: normalised Supabase schemas with Row-Level Security; full Vercel CI/CD. Stack: Supabase (Postgres + RLS), Vercel CI/CD, React front end (`TODO:` confirm framework).
3. **EyeGuard** — Real-time fatigue-detection API · Lead developer · Shipped (hackathon) → became Clareo. "A research-grade REST API for real-time fatigue detection from computer-vision signals, deployed live." Achievement chip: **7th — Ctrl Alt Hack 2.0**. Stack: computer vision, REST API (`TODO:` confirm language/framework).
4. **oLearn** — Unified e-learning ecosystem · Project lead, 4-member team · Shipped. "Led a 14-day agile sprint to deliver an e-learning platform with a 6-stage enrolment state machine." Highlights: SRS documentation and UML diagrams to split the work across the team. Stack: web full-stack, UML/SRS, Agile/Scrum.
5. **Stockfish Chess** — Browser-based engine client · Developer · Shipped. "Runs the Stockfish engine in WebAssembly workers behind a React UI for low-latency play." Stack: React, WebAssembly, Web Workers. (Ties to the chess interest; tile uses a chess-board micro-pattern.)
6. **Jovora website** — Company site · Designer & developer · Shipped. "The site you'll find at jovora.ai: a 3D gyroscope hero that follows your mouse or your phone's tilt, parallax depth, and Jovo, an interactive three.js mascot." Stack: Next.js 16, TypeScript, Tailwind, Framer Motion, three.js.

Case-study pages (`/work/<slug>`) for Clareo, Excelsior ERP and EyeGuard: problem → constraints → what I built (with a diagram) → results → what I'd do next. Use only facts from this brief and the repos; leave `TODO:` markers where a detail is missing instead of inventing it.

### 6. Journey — "How I *got* here" (timeline on a lime trace)

Dated items (fill exact months from `content/journey.ts`; do not invent dates):

- School: St. Joseph Matriculation HSS — Class 12, 89%.
- Joined LICET — B.E. CSE (now in 3rd year).
- *Planned:* graduation, B.E. CSE — `TODO: expected year` (shown dashed, as a future milestone).
- Built **oLearn** (project lead, 4-member team).
- Built **Excelsior ERP**.
- **EyeGuard** at Ctrl Alt Hack 2.0 — **7th place**.
- **Buildathon 3.0** — **5th place**.
- Founded **Jovora** (2026).
- EyeGuard grows into **Clareo**.
- *Next:* see Roadmap (dashed, faded).

### 7. Stack — "Tools I *reach* for"

Grouped bento, each skill links to "used in" projects (no percentages, no bars):

- **Languages:** Python, C, Java, JavaScript, TypeScript, SQL, 8086 Assembly
- **Web & cloud:** React, Next.js, Tailwind CSS, Supabase, Firebase, Vercel, REST APIs, WebAssembly, FastAPI
- **AI & vision:** MediaPipe, on-device computer vision, LLM features (Claude)
- **Core:** Data structures & algorithms, DBMS, Git & GitHub, Linux/Ubuntu, Agile/Scrum
- **Currently learning:** systems programming (content-driven; edit freely)

### 8. Recognition

Achievement stats (ember mono): **7th** — Ctrl Alt Hack 2.0 · **5th** — Buildathon 3.0. Certifications: Oracle Database Management Systems (DBMS); German Language I (NPTEL). Education cards: LICET — **In progress · 3rd year** · CGPA 8.09 so far; St. Joseph — Class 12, 89%. Never label LICET as completed.

### 9. What's next — "The *roadmap*" (clearly labelled plans)

Three columns with `Planned` / `In progress` chips:

- **Jovora:** secure the domain (jovora.ai) and company email; register the company; take on the first client website and AI projects; grow the domains from research to products.
- **Clareo:** public launch at clareo.jovora.ai; reach the first 200 weekly active users; desktop app and Pro plan; Teams for companies; a published accuracy study; a mobile companion.
- **Me:** internships in full-stack, AI or systems roles; more hackathons; deeper systems programming.

Copy under the heading: "Plans, not promises. When something ships, it moves up to Work."

### 10. Contact — "Let's build something *clear*"

- Form: name, email, reason (Internship / Client project / Collaboration / Hackathon team / Just saying hi), message. Honeypot, rate limit, inline success.
- Also: GitHub ↗, LinkedIn ↗ (when set), Jovora ↗, and the company email `hello@jovora.ai`.
- Optional cameo: **Jovo** (Jovora's robot mascot, lazy three.js) waves when the message is sent.
- **Never** show the phone number or the personal Gmail address.

### 11. Footer

Personal mark, "Built by Johnbosco J Elanjikal · Chennai", links (Work, Ventures, Résumé, Jovora ↗, Clareo ↗, GitHub ↗), "© 2026". A large outlined gradient name watermark (as on Jovora).

## SEO & metadata

- Title: "Johnbosco J Elanjikal — Founder of Jovora · Full-stack developer"
- Description: "Third-year Computer Science student in Chennai and founder of Jovora. I build full-stack platforms, real-time APIs and on-device computer vision, from hackathon prototypes to products like Clareo."
- OG image 1200×630: dark, ember orbit with a lime iris, the name in Instrument Sans + Serif italic.
- JSON-LD `Person`: name, jobTitle "Founder", worksFor Organization Jovora (url), **affiliation** EducationalOrganization LICET (not `alumniOf` — he hasn't graduated), knowsAbout [...], sameAs [GitHub, LinkedIn, Jovora].
- `robots.txt`, `sitemap.xml` (including `/work/*`), favicon from the personal mark.

## Acceptance criteria

1. Looks like `design_port.md`: Jovora atmosphere + Clareo instruments, the two-accent rule respected, light and dark both polished.
2. Hero: the orbit bends in 3D with the mouse and with phone tilt; a shake makes it wobble; the iris follows the cursor and blinks; reduced motion makes it all still.
3. Every project has status, role, stack and at least one link or screenshot; metrics have sources; nothing planned is labelled shipped.
4. 60fps on a mid-range laptop and phone; LCP < 2.0s; CLS < 0.05; Lighthouse mobile ≥ 95 in all four categories.
5. Works at 375, 768, 1280 and 1920px with no horizontal scroll.
6. Keyboard and screen-reader friendly (skip link, landmarks, focus rings, alt text).
7. Adding a project, milestone or skill only touches `content/`.
8. No phone number or personal email anywhere, including the PDF.
9. No invented facts: no fake clients, awards, dates, users or numbers beyond this brief and the Clareo/Jovora repos.

## Deliverables

The complete project, a README (setup, env vars, deploy, how to update the Now section monthly), and a list of assets he must supply:

- Founder photo (optional) and a public résumé PDF **without the phone number**, using the name "Johnbosco J Elanjikal".
- Screenshots: Clareo (dashboard, calibration, analytics), Excelsior ERP, EyeGuard, oLearn, Stockfish client, Jovora site.
- LinkedIn URL; repo links for each project (or mark them private).
- Exact dates for the Journey timeline.
- Final domain (default `johnbosco.jovora.ai`) and the contact inbox.
