# Johnbosco J Elanjikal — Portfolio Design System

The visual language for the founder's personal portfolio.
It is deliberately a **blend of two existing systems**:

- **Jovora** (the company): near-black studio, one warm **orange** light, orbit rings, parallax depth, floating glass capsule nav, serif-italic accent words.
- **Clareo "Optic"** (the first product): calm instrument panels, **lime signal** for live data, bento grids, the iris / eye brand mark, dark + warm-paper light themes, mono readouts.

Mood: **a builder's cockpit.** Jovora supplies the atmosphere (depth, orbit, warmth); Clareo supplies the instruments (panels, readouts, live signals). The portfolio should feel like the person who designed both.

---

## 1. Principles

1. **One person, two lights.** Orange is the *founder* colour (story, calls to action, identity). Lime is the *signal* colour (live status, metrics, "shipping", code). They never compete in the same component; see §2.3.
2. **Show the work, then the words.** Every claim links to a product, a repo, a benchmark or a result. No skill bars, no percentage ratings, no "10+ years" filler.
3. **Built, building, next.** Content is always honest about status: *Shipped*, *In progress*, *Planned*. Plans are shown as a roadmap, never as achievements.
4. **Instruments, not decoration.** Motion and 3D exist to *explain* (an iris that tracks you, an orbit that holds the ventures, a live-looking trace). If an effect explains nothing, cut it.
5. **Readable first.** Every animated or 3D element has a still, fully readable fallback (`prefers-reduced-motion`, no-JS, slow devices).

---

## 2. Colour

### 2.1 Dark theme (default)

The base is **Clareo's neutral near-black**, slightly cooler than Jovora's, so both accents stay clean on it.

| Token | Hex | Use | Origin |
|---|---|---|---|
| `--bg` | `#0A0B0D` | Page background | Clareo |
| `--bg-2` | `#0E1013` | Alternate band, footer | Clareo |
| `--panel` | `#121418` | Cards, bento tiles, nav capsule | Clareo |
| `--panel-2` | `#181B20` | Hover, inputs, inner wells | Clareo |
| `--line` | `#22262D` | Hairlines, borders | Clareo |
| `--line-strong` | `#2F343C` | Focus / hover borders | Clareo |
| `--ink` | `#EEF0EA` | Primary text | Clareo |
| `--ink-2` | `#C9CCC4` | Strong secondary text | Clareo |
| `--muted` | `#8D9189` | Secondary text | Clareo |
| `--faint` | `#5F635D` | Captions, meta | Clareo |
| `--ember` | `#FF6A1A` | **Founder accent**: primary CTA, active nav, accent words, orbit | Jovora orange |
| `--ember-hot` | `#FF8A3D` | Hover of ember | Jovora |
| `--ember-glow` | `rgb(255 106 26 / .18)` | Radial glows, focus halo | Jovora |
| `--signal` | `#C8FF3D` | **Live signal**: status dots, metrics, "shipping", code highlights, iris pupil | Clareo lime |
| `--signal-ink` | `#0D1004` | Text on a lime fill | Clareo |
| `--signal-soft` | `#1F2A0C` | Lime-tinted chip background | Clareo |
| `--info` | `#A193FF` | Rare: data-viz series 2 | Clareo strain |
| `--teal` | `#5CE1E6` | Rare: data-viz series 3 | Clareo posture |
| `--danger` | `#FF6464` | Form errors only | Clareo |

### 2.2 Light theme ("paper", optional toggle)

Taken from Clareo's light mode. Jovora has no light theme; in light mode the orbit becomes a thin ink line with ember accents.

| Token | Hex |
|---|---|
| `--bg` | `#F3F2EC` |
| `--bg-2` | `#ECEAE2` |
| `--panel` | `#FBFAF6` |
| `--panel-2` | `#F1EFE8` |
| `--line` / `--line-strong` | `#E0DDD2` / `#CFCBBD` |
| `--ink` / `--muted` / `--faint` | `#121212` / `#6D6B63` / `#9A978C` |
| `--ember` (text) | `#C2410C` (darkened for 4.5:1 on paper) |
| `--signal` (text/lines) | `#4F7300` · fill stays `#C8FF3D` with `--signal-ink` text |

Theme follows `prefers-color-scheme`, overridable by a toggle stored in `localStorage` (`data-theme="light|dark"` on `<html>`), no flash (inline script in `<head>`).

### 2.3 The two-accent rule

| Situation | Ember (orange) | Signal (lime) |
|---|---|---|
| Primary button ("Hire me", "Get in touch") | ✅ fill, black text | ❌ |
| Status "Shipped" / "Live" / "Online" dot | ❌ | ✅ |
| Numbers that are *measurements* (benchmarks, test counts) | ❌ | ✅ (mono) |
| Numbers that are *achievements* (7th place, CGPA) | ✅ (mono) | ❌ |
| Serif-italic accent word in headings | ✅ | ❌ |
| Code, terminal, commit hashes | ❌ | ✅ |
| Hero orbit rings | ✅ | the *iris* at the centre is lime |

- Max **one ember fill** and **one lime fill** per viewport. Glows are ember only.
- Never place ember text on lime or lime text on ember.
- **Contrast:** ink on bg ≈ 16:1 · muted on bg ≈ 6:1 · ember on bg ≈ 6.9:1 · lime on bg ≈ 15:1 · black on ember ≈ 9:1 · `--signal-ink` on lime ≈ 16:1.

### 2.4 Gradients & texture

- Radial ember glows fading to transparent (max one per viewport), a 3% film-grain overlay (Jovora), and a faint 22px dot grid inside instrument panels (Jovora × Clareo HUD).
- The hero accent word uses a flowing ember → amber → ink gradient (Jovora's `accent-flow`).

---

## 3. Typography

Both systems already share the same trio, so it stays:

| Role | Font | Settings |
|---|---|---|
| Display / headings | **Instrument Sans** 600 | −0.035em at ≥ 48px, −0.02em below |
| Accent words, quotes, venture names | **Instrument Serif** *italic* (regular for wordmarks) | one accent per heading |
| Body | Instrument Sans 400 | 17/1.6 desktop, 16/1.6 mobile |
| Lead paragraphs (hero intro, section intros) | **Geist** 300–400 | 19–22px, −0.01em (the "modern" voice used on Jovora's hero) |
| Numbers, labels, code, HUD | **DM Mono** 400/500 | tabular, micro-labels uppercase +0.08em |

**Scale (fluid):** Hero name `clamp(52px, 8.5vw, 124px)` / 0.95 · H2 `clamp(36px, 5vw, 64px)` / 1.02 · H3 24–28px · body 16–17 · small 14 · micro 12 mono.

**Name treatment:** "Johnbosco" in Instrument Sans 600 + "J Elanjikal" in Instrument Serif italic on the second line. The "o" in *Johnbosco* can carry Clareo's lime glancing dot (`brand-o` pattern) as the personal mark.

---

## 4. Layout & spacing

- 12-column grid, max width **1240px**, gutters 24 / 16px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176. Sections 128–160px desktop, 88px mobile.
- **Radius:** 9 (small), 12 (inputs), 16 (panels, from Clareo), 22 (feature panels / bento, from Clareo), 999 (pills, capsule nav).
- Elevation = lighter surface + inset top highlight `inset 0 1px 0 rgb(255 255 255 / .04)`; no heavy drop shadows.
- Section dividers are **fading hairlines** (transparent → line → transparent), not full borders.

### Bento (from Clareo)

Projects, skills and "Now" use a bento grid: 12-col, tiles of 4/6/8 columns and 1–2 rows, 16–24px gaps. Each tile is a `--panel` with a mono label top-left, a status chip top-right, content, and a footer row of tags. On mobile the bento collapses to one column in reading order.

---

## 5. Depth, parallax & 3D

Layers (from Jovora): **L0 horizon 0.15×** (glow, star field) · **L1 atmosphere 0.35×** (orbit, grid) · **L2 content 1×** · **L3 foreground 1.2–1.4×** (device mocks, floating project shots).

### Signature moments

1. **Hero "Orbit + Iris".** A CSS-3D gyroscope of ember rings (Jovora) around a **Clareo-style iris instrument**: a lime pupil that *looks at the cursor* and blinks every few seconds. The rings bend in 3D with mouse / phone tilt and wobble on a spring when a phone is shaken. The name sits on the nearest depth plane, the intro on the farthest.
2. **Ventures orbit.** Jovora is the "sun"; Clareo is a live planet (lime dot = shipping). Future domains (robotics, devtools, edtech, enterprise) are faint planned planets with dashed orbits. Hover or tap a planet to open its card.
3. **Project reveal.** Bento tiles rise from L3 (scale .94 → 1, 16px) with 60ms stagger; the screenshot inside each tile parallaxes up to 32px.
4. **Timeline trace.** The journey section draws a Clareo-style **live trace line** (lime) that scrolls with you, with ember milestone dots (hackathons, founding Jovora, Clareo launch).
5. **Cameo: Jovo.** Optional. Jovora's robot mascot appears small in the contact section (lazy-loaded three.js), waving when the form is sent.

### Rules

- Animate only `transform` and `opacity` (exception: the accent gradient's `background-position`, which is text-sized).
- Every moving layer checks `prefers-reduced-motion`: parallax 0, rotations stop, the iris holds still, fades become 150ms opacity.
- Phones: parallax at 0.75×, orbit driven by gyroscope (iOS asks for permission on a tap), no pinned horizontal scroll longer than 300vh.
- Three.js only for the optional Jovo cameo, always lazy and paused off-screen.

---

## 6. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entrances (Jovora) |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | State changes |
| `--ease-inst` | `cubic-bezier(.2,.8,.2,1)` | Meters, gauges (Clareo) |
| `--dur-1/2/3` | 150 / 350 / 700ms | Hover / cards / sections |

Entrances: fade + 16px rise, 60ms stagger, once at 20% in view (CSS `animation-timeline: view()` first).

---

## 7. Components

- **Capsule nav** (Jovora): floating glass pill, 16px from top, `--panel` 72% + blur 18px; left = personal mark (iris "J" monogram), centre = `Work · Ventures · Journey · Stack · Contact`, right = theme toggle + ember "Hire me". Reading-progress hairline in ember. Full-screen numbered serif menu on mobile.
- **Buttons:** primary = ember fill + black text (glow on hover); secondary = hairline + ink; **signal button** (lime fill, `--signal-ink` text) only for "View live" on shipped products.
- **Chips:** mono 12px uppercase. `Shipped` = lime-soft bg + lime text with dot; `In progress` = ember-tint + ember; `Planned` = hairline + muted; role chips ("Lead developer") = hairline + ink-2.
- **Bento tile:** see §4, with the cursor spotlight (ember radial following the pointer) and a 4px lift on hover.
- **Stat:** DM Mono 40–56px number + micro-label + *source line*. Measurement stats in lime, achievement stats in ember.
- **Instrument panel** (Clareo × Jovora HUD): panel with orange corner brackets, mono top bar (`LABEL · status ●`), dot-grid backdrop. Used for the hero iris, "Now" and the Jovo cameo.
- **Timeline item:** mono date, serif-italic title, one-line body, ember milestone dot on a lime trace.
- **Code block / terminal:** `--panel-2`, DM Mono 13px, lime prompt `›`, ember for keywords (max).
- **Contact form:** Jovora's form (honeypot, rate limit, inline success) in an instrument panel.

---

## 8. Iconography & imagery

- Lucide, 1.5px stroke, 20/24px. Status uses dots, not icons.
- Real screenshots only (Excelsior ERP, EyeGuard / Clareo, oLearn, Stockfish client, Jovora site), framed in dark browser / laptop mocks with a 1px border.
- Abstract visuals: orbit rings, iris geometry, dot fields, live traces, chess-board micro-pattern for the chess project.
- No stock photos. The founder photo (optional) is shown in a circle inside an ember orbit ring, like the Jovora founder card.

---

## 9. Accessibility & performance budget

- WCAG 2.2 AA; keyboard reachable; skip link; landmarks; visible focus (ember 1px + glow; lime on light theme).
- Reduced motion fully supported; no content behind hover only; 44px tap targets.
- Lighthouse mobile ≥ 95 in every category. LCP < 2.0s on 4G, CLS < 0.05, initial JS < 170KB gzipped (three.js excluded — lazy).
- Images AVIF/WebP with explicit sizes; fonts via `next/font` (no layout shift).

---

## Palette update — single gray + red theme (supersedes §2 colours)

The owner chose **one theme only: graphite grays + red**. There is no light theme and no toggle.
Token names are unchanged so components keep working:

| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-2` | `#0B0B0C` / `#101012` | Page, footer band |
| `--panel` / `--panel-2` | `#161618` / `#1D1D20` | Tiles, inputs |
| `--line` / `--line-strong` | `#2A2A2E` / `#3A3A3F` | Hairlines |
| `--ink` / `--ink-2` / `--muted` / `--faint` | `#F2F2F3` / `#CFCFD3` / `#9A9AA1` / `#707078` | Text |
| `--ember` (red) | `#E5383B` · fill `#D92D32` with white text · hover `#E5383B` | CTAs, accent words, orbit, milestones |
| `--signal` (coral) | `#FF6B6B` · soft `#2C1416` | Live status, measurements, code |

The two-accent rule still applies, now as **red (identity) vs coral (live data)**.
