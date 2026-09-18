---
target: portfolio homepage (app/[locale]/page.tsx)
total_score: 25
p0_count: 1
p1_count: 3
timestamp: 2026-09-16T12-09-53Z
slug: app-locale-page-tsx
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading spinners for both 3D scenes and a locale-switch disabled state exist; undercut by wrong section numbers acting as a false status cue. |
| 2 | Match Between System and Real World | 3 | Specific, real project descriptions (LightGBM/XGBoost, SwiftUI+.NET, SSE); desk/papers metaphor fits a developer's craft. |
| 3 | User Control and Freedom | 2 | Modal has close-X, Esc, backdrop-click. Header isn't sticky; mouse-wheel over the hero 3D canvas can block page scroll. |
| 4 | Consistency and Standards | 2 | Section index numbering skips "02," duplicates "03" between a dead section and Contact; only 2 of 4 indexed sections render a heading. |
| 5 | Error Prevention | n/a | No forms, no destructive actions — only a mailto link. |
| 6 | Recognition Rather Than Recall | 2 | Non-sticky header: nav/logo/language-switch/contact CTA vanish once scrolled past the hero; only way back is a footer link. |
| 7 | Flexibility and Efficiency of Use | 2 | No section shortcuts, no way to skip the 3D intro for repeat visitors. `prefers-reduced-motion` respected for hero-enter only. |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained gold-on-near-black palette, generous type scale; marked down for large dead vertical gaps between sections (mobile). |
| 9 | Error Recovery | n/a | No error states exist on this site. |
| 10 | Help and Documentation | 3 | Both 3D interactions ship inline micro-copy ("drag to spin," "click documents to inspect") — genuinely useful, most portfolios skip this. |
| **Total** | | **25/40** (proportional; 2 n/a) | **Acceptable — significant improvements possible before it's doing its job (landing work) as well as it could** |

## Anti-Patterns Verdict

**LLM assessment**: Not first-glance AI slop — the hand-modeled, drag-to-rotate 3D character and the "project desk" scene are bespoke and personal, the opposite of a template feel. The tell is one layer down: a `SectionHeading` component imported but never rendered in Projects, two fully-built, fully-translated sections (`CapabilitiesSection`, `JourneySection`) that are never mounted in `page.tsx`, and a `01/02/03/04` index scheme that no longer matches render order. Reads as "an edit pass touched this and nobody did a final integration sweep," not "AI generated this from scratch."

**Deterministic scan**: Static scan (`detect.mjs` over `app/[locale]/page.tsx`, `components/sections`, `components/character`, `components/projects`, `components/shared`) came back clean — 0 findings. The live browser-injected detector, run against the rendered page, reported 10 distinct anti-patterns / 12 findings:

- `extreme-negative-tracking` ×3 — `#hero-title` (`hero.css:95`, `-0.07em`), the "Ben Zübeyir Ali Demir…" h3 (`-0.05em`), `#contact-title` (`-0.07em`). All three sit past the -0.04em floor where letters start touching.
- `gpt-thin-border-wide-shadow` — `.hero-enter` (the primary hero CTA button) pairs a 0.8px border with a 24px shadow blur, the textbook "ghost-card" combo that's an explicit AI tell.
- `dark-glow` — same `.hero-enter` hover state, a colored `#d4af37` glow on the dark background, compounding the above.
- `all-caps-body` ×2 — `.character-note` (55 chars) and `.project-desk-instruction` (71 chars): the two inline help strings Assessment A praised as a genuine plus are set in `text-transform: uppercase`, which hurts their own readability at that length.
- `overused-font` ×2 — body text is 60% Geist / 40% Geist Mono with no other family in the mix; not a hard violation but worth naming as a monoculture default.
- `clipped-overflow-container` — `#top` (`section.hero`) clips a positioned child.
- `low-contrast` ×3 (on `.hero-kicker`, `#hero-title`, `.hero-description`) — **false positive**, verified: the detector sampled the declared `#d4af37` token at full opacity rather than the actual alpha-composited pixel. The real background under this text is near-black (`rgb(8,9,12)`) with at most an 18%-alpha gold radial glow, not a solid gold fill; actual contrast is high.

**Visual overlay**: injection succeeded in a background tab and the findings above were read from console output; the tab and the temporary live-server were closed after evidence capture, so there's no overlay left open to view live — the findings above are the full record.

## Overall Impression

The custom 3D character and project-desk scene are a real point of view — most portfolios don't attempt either, and both render correctly on desktop and mobile. But the site currently undersells its own strongest asset: the section right after that strong hero opens onto a large dead void (worst on mobile), the Projects section that should be the payoff has no visible title, and the header disappears the moment you need it again. This reads less like "generic AI template" and more like "strong bespoke foundation, unfinished integration pass" — the biggest opportunity is reconciling structure (headings, numbering, dead code, navigation) around the 3D work that's already good.

## What's Working

- **The Blockbench-modeled, drag-to-rotate 3D character** (`components/character/character-model.tsx`, `character-scene.tsx`) with eye-follow and snap-back — a differentiated identity element that no template ships.
- **The 3D "project desk"** (`components/projects/project-desk-scene.tsx`) turning the project list into literal documents on a desk — a clever, on-brand metaphor that renders well on both desktop and mobile.
- **`:focus-visible` implemented globally** (`app/globals.css:107-110`, 2px gold outline, 4px offset) confirmed live via keyboard Tab — most similarly-scoped sites skip this.
- **Static code quality is clean**: zero findings from the deterministic markup/component scan across every relevant section and 3D component file.

## Priority Issues

**[P0] Projects section renders with no visible title, and its `aria-labelledby` points at nothing**
- Why it matters: The section meant to be the payoff after the hero has no heading at all — visitors have to infer what the 3D scene is from a small instruction line. Screen-reader users get an invalid ARIA reference (`aria-labelledby="work-title"` with no matching id in the DOM).
- Fix: `components/sections/projects-section.tsx` already imports `SectionHeading` (line 5) but never renders it — call it with `index`, `title`, `description`, and `id="work-title"` from the existing `t()` translations before the desk container.
- Suggested command: `$impeccable clarify` (for the missing heading/labeling) or handle directly as a quick fix.

**[P1] Section index numbers are broken and out of render order**
- Why it matters: Visitors see "01 / Hakkımda" then "03 / İletişim" — "02" never appears because it belongs to the unrendered Projects heading (see P0), and "03" is separately claimed by an orphaned, never-mounted `CapabilitiesSection`. A numbering system meant to orient the visitor instead produces a "did I miss something?" moment.
- Fix: either wire the numbers to actual render order once Projects gets its heading, or drop the numbered-index pattern entirely and delete the dead `capabilities-section.tsx` / `journey-section.tsx` plus their message keys.
- Suggested command: `$impeccable distill` (strip dead code + reconcile IA) or `$impeccable layout`.

**[P1] Large dead vertical gaps between sections, worst on mobile**
- Why it matters: Confirmed live at 375px width — roughly 450px of empty screen between the About toolkit and Contact, nearly a full extra scroll of nothing, right where a mobile visitor is most likely to bounce ("did this load?").
- Fix: `styles/sections/about.css` (`padding-bottom: clamp(8rem, 14vw, 15rem)`) and `styles/sections/contact.css` (`padding-top: clamp(9rem, 15vw, 16rem)`) use rem-based clamp floors that don't actually shrink at narrow viewports. Add a mobile breakpoint capping these around 4–5rem.
- Suggested command: `$impeccable adapt` or `$impeccable layout`.

**[P1] No persistent navigation**
- Why it matters: `.site-header { position: absolute; }` (`app/globals.css:119`) means logo, nav, language switch, and the Contact CTA all vanish the instant a visitor scrolls past the hero, with no way back except a single footer link.
- Fix: switch to `position: sticky; top: 0;` — the backdrop-blur styling is already written, it just isn't pinned.
- Suggested command: `$impeccable layout`.

**[P2] Ghost-button CTA: thin border + wide shadow + colored glow stacked on the primary hero action**
- Why it matters: `.hero-enter` (the main hero CTA) combines a 0.8px border with a 24px shadow blur and a `#d4af37` colored glow on hover — the exact "ghost-card" + "dark-glow" combination that reads as an AI-generated decoration reflex rather than an intentional button state.
- Fix: pick one: a single solid border at the brand gold, OR a defined shadow at ≤8px blur — not both, and drop the glow or make it purposeful rather than decorative.
- Suggested command: `$impeccable typeset` / `$impeccable polish`.

**[P2] All-caps micro-copy hurts the readability of the site's best UX touch**
- Why it matters: `.character-note` and `.project-desk-instruction` are the two inline help strings that Assessment A flagged as a genuine strength (real, useful contextual help most portfolios skip) — but both are set in `text-transform: uppercase` at 55–71 characters, which fights their own purpose at that length.
- Fix: drop the uppercase transform on these two strings; reserve all-caps for short labels only.
- Suggested command: `$impeccable typeset`.

**[P2] Mouse-wheel scroll gets captured by the hero 3D canvas**
- Why it matters: Scrolling with the cursor resting over the character — the visually largest element in the hero, exactly where a visitor's mouse naturally sits while reading — repeatedly failed to scroll the page in live testing; only moving off-canvas fixed it.
- Fix: check `pointer-events` / wheel event handling on the orbit controls in `components/character/character-stage.tsx`, `character-scene.tsx` to let vertical wheel scroll pass through to the page.
- Suggested command: `$impeccable optimize`.

**[P3] Display heading letter-spacing past the -0.04em floor**
- Why it matters: `#hero-title` and `#contact-title` sit at `-0.07em`, the "Ben Zübeyir Ali Demir…" h3 at `-0.05em` — beyond the point where letters start touching, reading as cramped rather than "designed tight."
- Fix: bring all three up to the -0.02em to -0.04em range.
- Suggested command: `$impeccable typeset`.

## Persona Red Flags

**Jordan (Confused First-Timer)**
- Hits the ~250–450px dead void right after the hero with no scroll cue beyond a small arrow icon inside the CTA button — plausible read: "the page is broken," not "there's more below."
- Reaches the 3D desk with no "Projects" label anywhere near it (P0) and has to infer what it is from a small mono instruction line underneath.
- Sees "01 / Hakkımda" then "03 / İletişim" with no "02" ever appearing — a small but real "did I miss something" moment.

**Riley (Deliberate Stress Tester)**
- Long project title "360° Performans Değerlendirme Sistemi" truncates to "360° Performans De…" in the desk tab pill (`max-width: 13rem` desktop / `8rem` mobile) — nearly unreadable on mobile before the ellipsis.
- At 375px, the hero's `.character-note` tooltip is left-anchored and its text visibly runs to the screen edge.
- No code path found for an empty-projects state — if the Sanity fallback JSON array were ever empty, the 3D desk would render with zero papers and zero tabs and no messaging.

**Casey (Distracted Mobile User)**
- Loses the hamburger menu entirely once she starts scrolling (non-sticky header) — has to scroll all the way back to the top to reach nav or switch language.
- The confirmed ~450px dead gap on mobile between About and Contact is exactly the kind of moment that reads as "page didn't load" to someone skimming on a phone — the highest-risk bounce point on the whole page.

## Minor Observations

- Footer states the name twice back-to-back: wordmark "ZÜBEYİR ALİ DEMİR" directly above copyright "ZÜBEYİR ALİ DEMİR · 2026."
- Contact copy promises "LinkedIn üzerinden de ulaşabilirsin" but no LinkedIn link/icon exists anywhere on the page — a dead promise on a hiring-focused site.
- No CV/resume download affordance anywhere, despite the site's explicit goal of landing work.
- `CapabilitiesSection` / `JourneySection` plus their full bilingual copy and CSS (`capabilities.css`, `journey.css`) are complete but never rendered — dead code that's a liability on a portfolio meant to demonstrate code craft.
- The pill-button treatment (rounded-999px + border + hover invert/tint) is independently redefined in at least five places (`header-cta`, `hero-enter`, `contact-link`, `desk-project-tab`, `mobile-menu-cta`) instead of sharing one class — not urgent, but drifted.
- Body font is 60% Geist / 40% Geist Mono with nothing else in the mix — not wrong, but worth a deliberate look given how common a Geist-only pairing has become.
- One honest, non-slop touch worth keeping: project 04 (this portfolio itself) is marked `"status": "Geliştiriliyor"` (in progress) while the others say "Tamamlandı."

## Questions to Consider

- If a recruiter's very next scroll after your headline lands in an unlabeled 250–450px void, what's the reaction you want — "there's more" or "did this load"?
- The repo ships two fully-translated sections that never render, and section numbers that skip a step — was that a deliberate "not ready yet," or did the structure change mid-build without a reconciliation pass?
- The 3D character is genuinely yours and nothing else on the page reaches for that level of distinctiveness again — should the rest of the site (nav, CTAs, section transitions) work harder to earn its place next to that opening?
