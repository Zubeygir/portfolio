---
target: whole project (homepage)
total_score: 25
p0_count: 1
p1_count: 2
timestamp: 2026-09-21T13-03-36Z
slug: app-locale-page-tsx
---
Method: dual-agent (A: ad33806607502dad6 · B: a256a027d9e8afd1b)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No visible fallback if the 3D desk fails to mount / WebGL unavailable |
| 2 | Match System / Real World | 3 | "Desk with documents" metaphor is intuitive, copy reads human not corporate |
| 3 | User Control and Freedom | 2 | Projects section has no keyboard-reachable equivalent to the pointer-only 3D desk |
| 4 | Consistency and Standards | 2 | 5 independently hand-rolled button/pill styles for one action grammar |
| 5 | Error Prevention | 3 | No dead-CV-link or missing-Sanity-image guard visible |
| 6 | Recognition Rather Than Recall | 3 | Short sticky nav, self-documenting interaction hints (character-note, desk-instruction) |
| 7 | Flexibility and Efficiency | 1 | Confirmed: zero keyboard/ARIA path to open any project — pointer-only |
| 8 | Aesthetic and Minimalist Design | 3 | Hero packs 6 competing elements into one viewport with no single focal point |
| 9 | Error Recovery | 2 | No visible error/empty state for failed 3D scene mount or missing project image |
| 10 | Help and Documentation | 3 | Custom interactions (drag character, click desk) are inline self-documented |
| **Total** | | **25/40** | **Acceptable — significant work needed, core content has a real accessibility gap** |

## Anti-Patterns Verdict

**LLM assessment (Assessment A, source-based):** No fresh AI-slop tells. No side-stripe borders, gradient text, repeating-linear-gradient stripes, decorative grid overlays, sketchy SVG, hero-metric template, or meta-criticism copy. The single hero eyebrow matches the documented one-eyebrow exception; radii stay ≤1rem outside genuine pills. Two borderline calls: `desk-hover-overlay-pill` stacks a 1px border with `backdrop-filter: blur(18px)` plus a glow shadow — not a literal ghost-card (blur is backdrop-filter, not box-shadow) but reads like one. More significant: glassmorphism now appears independently on three separate elements (desk pill, contact CTA, mobile menu) — each individually under the ban's letter, but collectively exactly the "glassmorphism as recurring default" pattern the design-language doc's own §11 warns against, and it lands on the site's single most important CTA (`.contact-link`), which has zero defined border/edge.

**Deterministic scan (Assessment B):** `detect.mjs --json app components` → exit 2, 1 finding: `layout-transition` on `app/globals.css:383` (`transition: padding-left` on `.mobile-nav-link:hover`). Low real-world impact (single low-frequency hover row), flagged as P3.

**Browser evidence:** Assessment B confirmed live DOM/JS evidence against the running dev server (heading order h1→h2→h3 correct, no missing accessible names on buttons, no horizontal overflow at 375px, script-injection mutation confirmed working) but could not capture screenshots (tool timeout). My own follow-up browser attempts hit port/routing instability in this sandbox (localhost:3000 intermittently resolved to an unrelated cached site) and produced no usable additional evidence — treat visual/screenshot confirmation as **not obtained this run**; DOM-level findings from Assessment B stand.

## Overall Impression

This is a genuinely distinctive portfolio — the 3D voxel character and the paper-morph project desk are real, uncommon craft, and the copy is authentically personal rather than templated. But the flagship interaction (the 3D desk) is also the site's single point of failure: it's pointer-only, with zero keyboard or screen-reader path to the main content of a "portfolio" — the projects. That's not a polish issue, it's a person being unable to see the work. The secondary issue is quieter: five different hand-rolled button treatments and creeping glassmorphism-by-accretion are undermining the disciplined single-accent system the project otherwise gets right.

## What's Working

1. Accordion built on CSS Grid `0fr → 1fr` row animation (about.css:158-166) — clean, JS-measurement-free, and correctly respects `prefers-reduced-motion`.
2. Copy is specific and human ("I spent a couple of years in medical school... I just changed the field") — rare in a portfolio, a real differentiator.
3. Origin-based modal morph (project-detail-modal.tsx:44-53) — the modal grows out of the exact clicked paper's screen position; a genuinely sophisticated, non-templated touch.

## Priority Issues

**[P0] The main content of the site — projects — is unreachable without a mouse.**
Why it matters: `project-desk-model.tsx:353` wires project selection to `onClick: (e: ThreeEvent<MouseEvent>)` on a Three.js canvas. A repo-wide search of `components/projects/` and `projects-section.tsx` found zero `tabIndex`, `role`, `onKeyDown`, or `sr-only` fallback. A keyboard user or screen-reader user cannot open a single project. For a portfolio whose entire purpose is showing work to a hiring manager or client, this is the one failure that costs the outcome the site exists for.
Fix: add a keyboard-operable, visually-hidden (or visible) list of the 6 projects that fires the same `handleSelectPaper` handler on Enter/Space, so the 3D desk is an enhancement over a real list, not the only door.
Suggested command: `$impeccable harden`

**[P1] Five independently hand-rolled button styles for one action grammar.**
`header-cta`, `hero-enter`, `contact-link`, `desk-project-tab`, `mobile-menu-cta` each define their own border/background/blur treatment — the design-language doc already names this as acknowledged debt, but it's visibly real: the hero CTA is a gold-tinted glass pill, the contact CTA is an opaque white glass pill with no border, the header CTA is a third gold-tint variant. One accent color, three different pill grammars.
Fix: consolidate into one `.pill-button` base + modifier classes, per the doc's own stated intent.
Suggested command: `$impeccable distill`

**[P1] Glassmorphism has become a recurring default across three unrelated elements.**
`desk-hover-overlay-pill`, `.contact-link`, and `.mobile-menu` each independently reach for `backdrop-filter: blur(...)`. No single instance breaks the literal ghost-card rule, but the pattern itself is what design-language §11 and the impeccable ban target: decorative glass as a habit, not a rare deliberate choice. It's most costly on `.contact-link` — the site's primary call-to-action has no defined border or edge at all.
Fix: pick one load-bearing use of glass (the mobile menu drawer is the most defensible) and give the desk pill and contact CTA a solid, tokenized treatment instead.
Suggested command: `$impeccable quieter`

**[P2] Inconsistent interaction contract for opening a project.**
Projects at index <5 get a 3D lift-and-inspect flourish with a 500ms delay before the modal opens; index ≥5 skips straight to the modal (`projects-section.tsx:51-63`) with no visible reason. A visitor who opens project 4 and then project 6 will notice the behavior change and read it as unfinished.
Fix: either extend the lift animation to all projects or document/signal the cutoff (e.g., a visual "more projects" divider on the desk itself).
Suggested command: `$impeccable polish`

**[P2] Hero viewport has six competing elements with no single dominant focal point besides the character.**
Kicker, h1, description, CTA, 3D character, orbit rings, and a location/status meta line all load into one `100svh` viewport.
Fix: mute or defer one or two of the secondary text blocks (e.g., animate `hero-meta` in slightly after the primary copy) so first-glance attention has one clear order.
Suggested command: `$impeccable layout`

## Persona Red Flags

**Riley (keyboard/stress-tester):** Tabs through the page and cannot reach a single project — the P0 above is exactly Riley's failure mode, and Riley documents it methodically rather than giving up quietly.

**Sam (screen-reader/accessibility-dependent):** Same root cause — the desk canvas exposes no accessible name, role, or focus order for any of the 6 projects; Sam's screen reader announces nothing usable for the site's core content.

**Casey (mobile, 375px):** `desk-pill-counter` (projects.css) is `display: none` under 820px, so Casey loses the "3 of 6" progress cue entirely, left with only title+hint. Worth confirming on-device that the drag-to-rotate character gesture doesn't fight page-scroll touch gestures in the cramped `42svh` mobile band (hero.css:332-337).

## Minor Observations

- `contact-link` has no defined border while `.hero-enter` and `.about-cv-link` both use `1px solid rgba(212,175,55,0.45)` — the one CTA that matters most (contact) is the one that breaks from the established border language.
- `.mobile-nav-link:hover` transitions `padding-left` (globals.css:383, detector-confirmed) — animate `transform: translateX()` instead to avoid a layout-property transition, even though real-world impact here is small (single low-frequency hover row).
- Footer's "Back to the character ↑" is charming but entirely dependent on the visitor liking/remembering the character — a plainer default with this as a bonus flourish is the safer bet.
- Locale switch performs a full route replace (`locale-switcher.tsx`) with no confirmed scroll-position preservation — worth checking whether switching EN/TR mid-read of About resets scroll to top.

## Questions to Consider

1. If the 3D desk is the only door to the first 5 projects today, was a keyboard/screen-reader fallback ever built and just not wired up, or does one not exist at all?
2. Five button treatments for one accent color and one action grammar — is that "not yet consolidated," or has it quietly become the design system?
3. Has the 500ms paper-lift delay been felt by a real visitor clicking through all 6 projects, and did it read as premium or as "the button is slow"?
