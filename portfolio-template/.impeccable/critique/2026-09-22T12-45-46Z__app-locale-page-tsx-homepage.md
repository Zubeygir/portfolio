---
target: homepage (app/[locale]/page.tsx)
total_score: 21
p0_count: 2
p1_count: 2
timestamp: 2026-09-22T12-45-46Z
slug: app-locale-page-tsx-homepage
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Unlabeled loading square before the 3D avatar mounts; no active-section nav state; hero 3D pops in 2–4s after paint |
| 2 | Match System / Real World | 3 | Desk metaphor is apt, but paper labels are baked into an unreadable canvas texture |
| 3 | User Control and Freedom | 3 | Modal has Esc/close/backdrop and focus restore, but no focus trap; entering the site hijacks scroll for 1.1s |
| 4 | Consistency and Standards | 2 | Four different H2 scales across sections; heading component used inconsistently |
| 5 | Error Prevention | 2 | `mailto:` is the only contact path, no fallback; WebGL failure renders a silent black rectangle |
| 6 | Recognition Rather Than Recall | 1 | Zero project images, zero project links, hover-only titles on the 3D desk |
| 7 | Flexibility and Efficiency | 2 | Keyboard parity exists via a text list, but no skip link, no filter/sort, desk is pointer-only |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained and coherent, undone by dead space and a 307px-tall sentence posing as a heading |
| 9 | Error Recovery | 1 | `error.tsx` is hardcoded English on a Turkish-first site, tells users to "contact support" with none |
| 10 | Help and Documentation | 2 | The only usage hint for the 3D desk is `aria-hidden`, invisible to assistive tech |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**Deterministic scan**: `detect.mjs` ran clean against `components`, `app`, `styles` — exit code 0, zero findings, zero false positives. Live-page overlay also reported "No anti-patterns found." No console errors, no failed network requests, no horizontal overflow at 375px, no unlabeled interactive elements, no missing alt text (the site currently ships zero `<img>` tags at all).

**LLM assessment**: The scan being clean does NOT mean the site is slop-free — it means the site avoids the *surface-level* tells (no gradient text, no glassmorphism-as-default, no ghost cards, no border-radius ≥32px, no cream background, no sketchy SVG, no reflex fonts). Credit where due: the typeface pair (Atkinson Hyperlegible Next/Mono + Cabinet Grotesk) and the hand-built voxel avatar/3D desk are genuinely not template defaults.

But the human review caught real anti-patterns the detector's pattern-matching can't reach:
- **Monospace-as-technical-costume** applied to 14+ unrelated roles (meta text, labels, footer, nav) until it stops meaning anything.
- **The exact banned "tiny uppercase tracked eyebrow"** pattern, verbatim, in `app/[locale]/loading.tsx` — leftover scaffolding.
- **Numbered markers as decoration** (`01`–`06` in the project modal) that add no information the year/category don't already carry.
- **Three structurally-identical row-grids** (project index, experience list, toolkit list) dressed as different content types.
- **A safe, timid palette** — near-black + gold + gray, the default "premium dark portfolio" look of the last two years, with no second accent or temperature shift.

This is the gap between a pattern detector and a design director: the site is clean by regex, not clean by judgment.

## Overall Impression

The bones are more honest than most AI-flavored portfolios — real typefaces, a hand-built 3D centerpiece, correct accordion motion, solid color contrast throughout. But the site spends its entire craft budget on the two elements that carry the least information (a spinning voxel avatar, an illegible 3D desk) while the actual evidence a hiring client needs — project screenshots, project links — doesn't exist. Combined with a display font that silently never loads (every heading renders in the body face) and a primary CTA button sized smaller than the fine print, the site currently undersells the one genuinely good asset on the page: the About section's human voice, buried 2,300px down.

## What's Working

1. **Real keyboard/touch fallback for the 3D desk.** The text project list is properly wired to the same selection handler and to `aria-labelledby` — most 3D-hero portfolios leave keyboard users with nothing at all.
2. **The experience accordion.** `grid-template-rows: 0fr → 1fr` with `min-height: 0`, correct `aria-expanded`/`aria-controls`, and a `prefers-reduced-motion` fallback — done the right way.
3. **The About paragraph copy.** "Bilgisayar Mühendisliği okumadan önce bir süre Tıp Fakültesi'ndeydim — galiba en başından beri detaylara takılan biriydim, sadece alanı değiştirdim." is an actual human sentence. It's the most hireable thing on the page and it's the least visible.

## Priority Issues

**[P0] There is no work in this work portfolio**
- **Why it matters**: Every project entry has `image: null` and `href: null`. The modal's CTA never renders; every project detail falls back to a flat card with a two-letter monogram. A freelance client's entire decision hinges on evidence of work, and there is none — no screenshots, no links, not even an NDA notice.
- **Fix**: Ship at least one 16:9 screenshot per project and populate `href` with a live URL or repo. For NDA'd work (Baykar, Vakıfbank), add an explicit "Under NDA — walkthrough on request" status instead of a blank.
- **Suggested command**: $impeccable harden

**[P0] The display font never loads — every heading silently falls back to the body face**
- **Why it matters**: `--font-display` is declared only inside Tailwind v4's `@theme inline` block, which never emits it as a real CSS custom property, so `var(--font-display)` in hand-written CSS resolves to an empty string. Verified live: the font stays `unloaded` and every H1–H3 computes to Atkinson Hyperlegible Next — an accessibility body face — at 95px. This is why the hero reads soft and undifferentiated: there is no actual type pairing running.
- **Fix**: Move the font custom properties out of `@theme inline` into `:root` (or reference the real font variable directly in `globals.css`), then re-tune weights to the 3 the display font actually ships (400/500/700) instead of the current 6 decorative near-duplicates.
- **Suggested command**: $impeccable typeset

**[P1] The hero wastes the first screen and hides its best trust signal**
- **Why it matters**: The availability line ("open to new ideas") — the single highest-value trust signal on a freelance site — is `aria-hidden` and, at common viewport heights, sits below the fold. Between 721–980px the 3D avatar renders behind the headline at partial opacity. Hero copy is center-aligned inside a left-aligned column, giving the layout no spine.
- **Fix**: Promote availability into a visible badge next to the CTA and remove `aria-hidden`. Left-align hero copy. Reserve an aspect-ratio box with a poster image for the 3D avatar so the right half isn't blank while it loads.
- **Suggested command**: $impeccable layout

**[P1] The 3D desk drops a project and can't be read at rest**
- **Why it matters**: The desk hardcodes a slice of 5 projects while 6 exist — the 6th is only reachable via the text list, and the on-screen counter lies about the total. Project titles are canvas textures at roughly 20px on a tilted surface, illegible without hovering one paper at a time.
- **Fix**: Either lay out all 6 papers or label the desk explicitly as "5 featured" with a clear handoff to the full list. Add persistent 2D title overlays anchored to each paper's projected position so the desk is scannable without hovering.
- **Suggested command**: $impeccable clarify

**[P2] Contact is a 4-line sentence posing as a heading, behind a mailto-only link**
- **Why it matters**: The entire contact pitch is stuffed into an `<h2>` rendered at up to 96px across 4 lines (307px tall), so there's no real section title. The only action is `mailto:`, which fails silently on any browser without a configured mail client — a meaningful failure rate with zero feedback.
- **Fix**: Add a short real heading, demote the sentence to body copy, and add a copy-to-clipboard email button with a confirmation state alongside the mailto link. Add one line of reassurance (typical response time, what to include).
- **Suggested command**: $impeccable clarify

## Persona Red Flags

**Jordan (First-Timer)**: Lands on a black hero with a two-line name and an 11.8px CTA button — smaller than the surrounding body text. An unlabeled loading square blinks for a few seconds before the avatar appears; dragging it snaps back with no explanation of what happened. Scrolling to the work section, Jordan sees a desk with illegible paper labels and, below it, a text list at ~13px gray mono — nothing signals these are the same six projects. Opening a project gets a monogram instead of a screenshot and no outbound link.

**Casey (Distracted Mobile User)**: At 375px, the first screen is mostly black while the 3D avatar's model loads, followed by a cropped figure with its feet cut off. The availability line is off-screen. The showpiece 3D desk shrinks to roughly 224–320px tall with no hover available on touch, making the entire feature decorative — Casey's real path is the text list, meaning the site pays a three.js/WebGL cost that half the audience never benefits from.

**Riley (Stress Tester)**: No skip link — six header stops before any content. Tabbing through an open project modal walks straight out the back since there's no focus trap, despite `aria-modal="true"` telling assistive tech the rest of the page is inert. The 3D desk's counter says "x / 5" while the list has 6 rows. With JavaScript disabled, the page is stuck permanently on "3D Proje Masası Hazırlanıyor…" with no fallback content ever rendering.

## Minor Observations

- No `scroll-margin-top` against the sticky header; only saved by generous section padding.
- Desktop nav links render at ~12.2px, below the 14px comfortable-reading floor.
- Primary modal CTA is ~11.5px uppercase — and never renders anyway since no project has a link.
- Console shows a deprecated `THREE.Clock` warning twice — will break on a future three.js upgrade.
- Color contrast is solid throughout (body text ≈7.8–8.3:1 against background) — genuinely no work needed here.
- `error.tsx` and `loading.tsx` ship hardcoded English strings on a Turkish-first site.
- `font-mono` Tailwind utility is mapped but never actually used anywhere; dead mapping.

## Questions to Consider

1. If the 3D desk and voxel avatar were deleted tonight, what would a hiring client actually lose — versus what they'd gain from a page where six project titles are instantly readable?
2. Who is the avatar actually for? The copy sells enterprise real-time pipelines and banking infrastructure; the hero sells a spinning blocky gamer doll. Those read as two different freelancers at two different rates.
3. Atkinson Hyperlegible is an accessibility-engineered typeface — was that choice an accessibility commitment, or aesthetics with an accessibility alibi, given the hidden availability badge, missing skip link, and the modal's broken focus trap?
