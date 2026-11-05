# QA report

Run against the production build (`npm run build && npm run preview`) in headless Chromium.

## Build & static checks

| Check | Result |
|---|---|
| `tsc -b` (strict) | ✅ 0 errors |
| `eslint .` | ✅ 0 errors, 0 warnings |
| `prettier --check` | ✅ formatted |
| `vite build` | ✅ no warnings |
| Runtime console errors / warnings | ✅ none (all widths, all interactions) |
| Failed requests (4xx/5xx) | ✅ none |

## Lighthouse (production preview, Lighthouse 12)

| Profile | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile (simulated Moto G Power, slow 4G, 4× CPU) | **88–93** across runs | **100** | **100** | **100** | 1.9 s | 2.4 s | 140–290 ms | 0.005–0.011 |
| Desktop | **96–98** | **100** | **100** | **100** | 0.3–0.6 s | 0.8–0.9 s | 0 ms | 0.003 |

Mobile Performance sits right at the ≥ 90 target and varies with Total Blocking Time between runs (React + motion boot on a 4× throttled CPU). Optimisations applied:

- Lazy motion features
- Code-split, scene-by-scene mounting of everything below the hero
- Lazy dialogs, map, sound panel and Howler
- Static boot loader and hero copy in the HTML
- Non-blocking stylesheet
- Art-directed AVIF hero (portrait crop for phones)
- Scrollbar gutter (no CLS)
- Petals start only when idle

JS: 103 KB gzipped initial bundle, plus 19 KB for the walk, 19 KB of animation features and small lazy chunks.

## Visual review

Screenshots of every section at **390, 768 and 1440 px** are in `qa/screenshots/` (regenerate with `npm run qa:screens`), plus overlays: map, project dialog, article + summary, sound panel, mobile menu, landscape phone. All were reviewed against the mockups. Fixes made during review:

- Nav overflow at 1440 px
- Hard-edged vignettes, now feathered
- Skill labels overlapping shelves
- Map pins covering illustrations
- Cramped tablet Journal and Research layouts
- Mobile hero legibility

## Interaction tests (`npm run qa:interactions`): 40/40 pass

- Skip link is first in tab order; it dismisses the loader and lands in the Curious Grove.
- The loader completes within its cap.
- Nav links walk to the right section, and the active nav state updates.
- The Garden Map opens from the button and with `M`, focus moves inside, `Esc` closes it, and focus returns to the button.
- **All 9 map stops** walk to their sections.
- Filters show the correct counts: All 5, AI/ML, MLOps 1, Web 2. Search narrows correctly.
- The carousel moves with arrow keys, the next/previous buttons, and mouse drag/swipe.
- **All 5 project dialogs** open, trap focus through 12 Tab presses, and close with `Esc`.
- The article dialog opens; the instant summary appears with no network call.
- The sound toggle switches on without errors, and the volume slider works.
- Contact form: an empty submit shows 4 inline errors and focuses the error summary. A valid submit runs all 4 steps; the mailto fallback is used when no endpoint is set.
- The résumé PDF is served.
- Mobile (390 px, touch): the menu opens, its links close it and walk to the section, the quick-contact drawer opens, and tapping a pot waters it.
- Reduced motion: no petal canvas, no Lenis smoothing, instant navigation.
- No horizontal overflow at 360, 390, 768, 1024, 1280, 1920 px or on a landscape phone (844×390).

## Content parity (`npm run qa:parity`): pass

- 214 legacy text lines checked. All present, with 15 of them appearing only in transient UI states (loader, typed YAML, form steps, closed drawers), which were verified in source.
- All 9 legacy links present (GitHub repos, `mailto:`, `tel:`, résumé).
- None of the mockup placeholders found (DRDO, Scientist B, GATE AIR 105, ClariConsent, Regulatory Change Radar, example.com email, invented handles).

## Accessibility & motion (manual + automated)

- Keyboard-only walk through the nav, map, carousel, filters, dialogs, sound sliders and form: everything is reachable, with visible moss focus rings.
- Dialogs use `role="dialog"` and `aria-modal`, with focus trap, `Esc` to close and focus restore. The form status uses `aria-live`; errors use `role="alert"` and are linked via `aria-describedby`.
- Reduced motion is checked with the OS setting emulated and with the in-site toggle.
- Light theme only; text contrast ≥ 4.5:1 (Lighthouse contrast audit passes).
