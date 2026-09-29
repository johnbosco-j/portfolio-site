---
name: johnbosco-portfolio
description: Build and maintain the personal portfolio of Johnbosco J Elanjikal, founder of Riven — a blend of Riven's orbit/parallax design and Clareo's instrument "Optic" design. Use when creating the site, adding a project, venture, milestone or skill, editing the founder's details, or changing the site's design, content or deployment.
---

# Portfolio — build & maintenance skill

Read `design_port.md` (visual system) and `prompt_port.md` (full brief) before changing anything. This file is the working rulebook: stack, structure, conventions and the checklist every change must pass.

## Who and what

- **Johnbosco J Elanjikal** — **current third-year** B.E. Computer Science & Engineering student at Loyola-ICAM College of Engineering and Technology (LICET), Chennai (**not a graduate**); full-stack developer; **founder and owner of Riven**.
- **Riven** — his multi-domain technology company (AI & machine perception, health & wellbeing, robotics & embedded, developer tools, education, institutional platforms), which also builds websites and AI systems for clients at minimal cost. Site: `rivendevs.in` (planned domain).
- **Clareo** — Riven's first product: private, on-device eye-fatigue, eye-strain and posture coaching (`clareo.rivendevs.in`).
- The portfolio's job: in under a minute, show **who he is, what he has shipped, what he is building now, and what comes next** — for recruiters, collaborators, clients, hackathon teams, incubators and early investors. It links out to Riven and Clareo; it does not duplicate them.

## Stack (same as Riven, so code and components can be shared)

| Concern | Choice |
|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript strict**, static generation; one route handler for the contact form |
| Styling | **Tailwind CSS 3** with the tokens from `design_port.md` mapped in `tailwind.config.ts` (`bg`, `panel`, `line`, `ink`, `muted`, `ember`, `signal` …) as CSS variables so light/dark swap without re-rendering |
| Motion | CSS scroll-driven animations first; **Framer Motion** (`useScroll`, `useTransform`, `useSpring`) for parallax, orbit and iris |
| 3D | CSS 3D transforms for the orbit; SVG for the iris; **three.js only for the optional Riv cameo**, lazy-loaded |
| Fonts | `next/font/google`: Instrument Sans, Instrument Serif, DM Mono, Geist |
| Icons | lucide-react (1.5px) |
| Content | Typed TS files in `content/` (optionally MDX for case studies) |
| Forms | Route handler → Resend, honeypot + rate limit |
| Hosting | Vercel, domain `johnbosco.rivendevs.in` (or a personal domain later) |

Reuse from `../rivendevs-site` where it fits (copy, don't import across repos): `ParallaxLayer`, `AmbientBackground`, `lib/tilt.ts`, `Orbit3D`, `NavCapsule`, `Button`, `Chip`, contact route. Recolour to the portfolio tokens.

Do not add a CMS, a UI kit (MUI/Chakra/shadcn themes that fight the tokens), jQuery, GSAP (Framer covers it), analytics that track individuals, or chat widgets.

## Project structure

```
portfolio-site/
  app/
    layout.tsx               fonts, theme script (no flash), metadata, JSON-LD Person, skip link, grain
    page.tsx                 composes sections in order
    work/[slug]/page.tsx     case-study pages (one per project)
    resume/route.ts          serves the public resume PDF (no phone number)
    api/contact/route.ts     contact form
    opengraph-image.tsx      1200×630: name + iris-in-orbit
    icon.svg · robots.ts · sitemap.ts
  components/
    nav/NavCapsule.tsx  nav/ThemeToggle.tsx
    hero/Hero.tsx  hero/OrbitIris.tsx  hero/Iris.tsx
    sections/Now.tsx  Ventures.tsx  Work.tsx  Journey.tsx  Stack.tsx  Achievements.tsx  Roadmap.tsx  Contact.tsx  Footer.tsx
    ui/Bento.tsx  BentoTile.tsx  Chip.tsx  Stat.tsx  Button.tsx  InstrumentPanel.tsx  TimelineItem.tsx  CodeBlock.tsx
    parallax/ParallaxLayer.tsx  parallax/AmbientBackground.tsx
  content/
    profile.ts       name, headline, bio, location, links, education, languages, interests
    ventures.ts      Riven + Clareo (+ planned domains)
    projects.ts      all projects with status, role, stack, links, metrics, case-study body
    journey.ts       timeline milestones (dated, typed: education | hackathon | venture | launch | plan)
    skills.ts        grouped skills with "used in" project links
    achievements.ts  placements, certifications
    roadmap.ts       what's next (clearly marked as plans)
    now.ts           what he's doing this month (edit monthly)
  lib/ tilt.ts  hooks.ts  links.ts
  public/ projects/<slug>/*.webp · resume/Johnbosco-J-Elanjikal-Resume.pdf · founder.jpg (optional)
  design_port.md  skills_port.md  prompt_port.md
```

## Content lives in data files, never in components

```ts
// content/projects.ts
export type ProjectStatus = "Shipped" | "In progress" | "Planned";
export type Project = {
  slug: string;
  name: string;
  kind: string;                 // "Institutional management platform"
  status: ProjectStatus;
  role: string;                 // "Full-stack developer & architect"
  team?: string;                // "4-member team"
  period?: string;              // "2025"
  summary: string;              // one sentence
  highlights: string[];         // 2–4 bullets, each with a verb and a result
  stack: string[];
  metrics?: { value: string; label: string; source?: string; kind: "measurement" | "achievement" }[];
  links?: { live?: string; repo?: string; caseStudy?: boolean };
  venture?: "rivendevs" | "clareo";
  featured?: boolean;           // bento size
  cover?: { src: string; alt: string };
};
```

- Status is mandatory and honest. Anything not built yet goes in `roadmap.ts`, never in `projects.ts` as "Shipped".
- Metrics carry their source (test name, event name, benchmark doc).
- Placeholder links (`undefined`) render the button as "Coming soon", not clickable.

## Facts that must stay consistent (single source of truth)

| Fact | Value | Note |
|---|---|---|
| Display name | **Johnbosco J Elanjikal** | Resume PDF still says "John Bosco J" — update the resume, not the site |
| Education | B.E. CSE, LICET, Chennai — **in progress, 3rd year**; CGPA 8.09 so far (through 4th semester) | Never write graduate / alumnus / "Class of" as completed; update the year each July and the CGPA each semester; expected graduation year is a TODO for him to confirm |
| School | St. Joseph Matriculation Higher Secondary School, Ambattur — Class 12: 89% | |
| Placements | **7th — Ctrl Alt Hack 2.0** (EyeGuard) · **5th — Buildathon 3.0** | The resume says "top placement at Buildathon 3.0" in one place and "5th Place" in another — the site says **5th place** |
| Certifications | Oracle DBMS · German Language I (NPTEL) | |
| Languages | English (fluent), Tamil (native), Malayalam (basic) | |
| Interests | Developer tools, hackathons, chess, systems programming | |
| Clareo numbers | from `clareo/README.md` and `docs/DETECTION_ENGINE.md` only | re-sync when benchmarks change |

## Personal data

- Show: name, role, college, city (Chennai), GitHub, LinkedIn (if provided), Riven links, a contact form, and a **company** email (`hello@rivendevs.in`) or a dedicated portfolio inbox.
- **Never** publish the phone number or the personal Gmail address. The downloadable resume is a separate **public** PDF without the phone number.
- No exact home address (only "Chennai, India").

## How to add things

- **New project:** add to `content/projects.ts` + cover in `public/projects/<slug>/`. `featured: true` → large bento tile. Add `caseStudy: true` and a body to get `/work/<slug>`.
- **Milestone:** add to `content/journey.ts` with a date and type.
- **Plan becomes real:** move it from `roadmap.ts` to `projects.ts` or `journey.ts` and change its status. Never leave the same thing in both.
- **Now section:** edit `content/now.ts` monthly; it shows its "last updated" date.
- **Resume:** replace `public/resume/…pdf` (public version, no phone).

## Conventions

- TypeScript strict, no `any`; server components unless they need pointer/scroll state.
- Parallax only via `<ParallaxLayer>`; tilt/mouse only via `lib/tilt.ts`.
- Animate only transform/opacity; every animated component respects `useReducedMotion()`.
- Colours only via tokens; follow the **two-accent rule** in `design_port.md` §2.3.
- One `<h1>` (the name). Section `<h2>`s with one serif-italic accent word.
- `next/image` with sizes and meaningful `alt`; decorative art is `aria-hidden`.
- Copy: first person, short sentences, specific verbs ("built", "led", "shipped"), numbers with sources. No "passionate", "ninja", "rockstar", or self-rated skill percentages.

## Quality checklist (before every merge)

1. `npm run lint && npm run typecheck && npm run build` — clean.
2. Keyboard pass through nav, theme toggle, bento tiles, case-study links, resume download and form.
3. Reduced motion on: nothing moves, nothing is hidden, iris holds still.
4. Light **and** dark theme checked at 375 / 768 / 1280 / 1920px — no horizontal scroll, 44px tap targets.
5. Lighthouse mobile ≥ 95 everywhere; LCP < 2.0s; CLS < 0.05.
6. Every "Shipped" item has a working link or a screenshot; every metric has a source.
7. The phone number and personal email appear nowhere, including the PDF and page source.
8. Metadata: title, description, OG image, JSON-LD `Person` (name, jobTitle, worksFor Riven, affiliation LICET — never `alumniOf`, sameAs GitHub/LinkedIn/Riven), robots, sitemap.

## Commands

```
npm install
npm run dev
npm run build && npm start
npm run lint
npm run typecheck
```
