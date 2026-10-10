# Johnbosco J Elanjikal — portfolio

**Live → [johnbosco-portfolio-gules.vercel.app](https://johnbosco-portfolio-gules.vercel.app)**

Personal site of Johnbosco J Elanjikal: third-year CSE student at LICET, full-stack developer, and founder of Riven.
Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 3 · Framer Motion · three.js (the lazily loaded character scenes).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

## Environment variables (all optional)

Copy `.env.example` to `.env.local`.

| Variable | Default / effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and JSON-LD. Unset on Vercel, it follows the project's production domain; elsewhere it falls back to `https://johnbosco.rivendevs.in` |
| `NEXT_PUBLIC_RIVENDEVS_URL` | `https://rivendevs.in` |
| `NEXT_PUBLIC_CLAREO_URL` | `https://clareo.rivendevs.in` |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn links stay hidden until set |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form email delivery; without them messages are only logged |
| `NEXT_PUBLIC_UPI_ID` | Turns on the **Support** section with its ₹50 / ₹150 / ₹500 UPI buttons (the section and its footer link stay hidden until some payment link is set) |
| `NEXT_PUBLIC_RAZORPAY_URL`, `NEXT_PUBLIC_BMC_URL`, `NEXT_PUBLIC_KOFI_URL`, `NEXT_PUBLIC_GITHUB_SPONSORS_URL` | Each support platform appears once its link is set |

## Deploy (Vercel)

Live on Vercel as the `johnbosco-portfolio` project. `vercel.json` pins the Next.js preset — without it a CLI-created project builds nothing and serves `NOT_FOUND`. `.vercelignore` keeps the third-party reference zip out of uploads.

```bash
vercel deploy --prod
```

Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in the project's environment variables, or the contact form only logs messages. Pages are static; the GitHub feed refreshes daily (ISR); `/api/contact` and `/resume` are server routes.

## Updating content (never edit components for copy)

Everything lives in `content/`:

- **Monthly:** `content/now.ts` — edit the four tiles and `updated`.
- **Each semester:** `content/profile.ts` → `education.cgpa`, and `education.year` each July. He is a **current student** — never write "graduate" or "alumnus".
- **New project:** `content/projects.ts` (+ optional screenshot in `public/projects/<slug>/`, set `cover`). `links.caseStudy: true` + a `caseStudy` body creates `/work/<slug>`.
- **Milestone:** `content/journey.ts` (add the exact `date` when known — never guess).
- **Plan shipped?** Move it from `content/roadmap.ts` to projects/journey. Never keep it in both.
- **Skills:** `content/skills.ts` (`usedIn` = project slugs).

## Photos

- **Portrait:** save as `public/me/portrait.jpg` (square, at least 800 × 800). It replaces the "JE" monogram in About automatically.
- **Event / achievement photos:** save in `public/moments/` and list each in `content/about.ts` → `moments` with an `alt`, a `caption` and a `tag`. The **Moments** section appears once there is at least one.
- **UPI QR (optional):** `public/support/upi-qr.png`.

## Résumé

Put the **public** PDF (no phone number, name "Johnbosco J Elanjikal") at `public/resume/Johnbosco-J-Elanjikal-Resume.pdf` and rebuild. The "Download résumé" button switches on automatically.

## Assets still to supply

- Portrait + event/achievement photos (see above)
- Public résumé PDF without the phone number
- Screenshots: Clareo (dashboard, calibration, analytics), Excelsior ERP, EyeGuard, oLearn, Stockfish client, Riven site
- LinkedIn URL; repo links for Clareo, Excelsior ERP, EyeGuard, Stockfish (or confirm they stay private)
- Exact months for the Journey timeline; expected graduation year
- Excelsior ERP: front-end framework and the names of its three access tiers
- Support: UPI ID and/or platform links
- Final domain (default `johnbosco.rivendevs.in`) and the contact inbox

## Design

Single graphite-gray + red theme (see the palette update at the end of `design_port.md`). The hero is an atom: a nucleus with 3D electron shells that tilt with the mouse or the phone's gyroscope and wobble when the phone is shaken. Reduced motion makes everything still; nothing is ever hidden without JavaScript.

## Privacy

The phone number and personal Gmail never appear anywhere, including the résumé PDF. Contact goes through the form or `hello@rivendevs.in`.
