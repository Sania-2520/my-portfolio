# Plan

All phases complete. Status as delivered:

1. **Audit** ✅ Read the legacy file and backups; wrote `AUDIT.md`; extracted all content verbatim into `src/data/*`.
2. **Scaffold** ✅ Vite + React 19 + TypeScript (strict) + Tailwind v4 + motion + lenis + howler + lucide-react + fontsource; ESLint + Prettier.
3. **Art** ✅ Hero art cleaned from `reference/hero-reference` (UI text removed), plus a portrait crop for phones; garden map cleaned (labels removed); scene vignettes cropped from `reference/design-board`; all exported as AVIF + WebP.
4. **Design system** ✅ Light-only tokens in `@theme`, typography, parchment surfaces, paper grain, motion tokens (`src/lib/motion.ts`).
5. **Sections** ✅ Garden Gate, intro plaque, Curious Grove, Greenhouse, Blooming Workshop, Gardener's Cottage, Cottage Desk, Pavilion, Garden Journal, Moonlit Garden, footer.
6. **Cross-cutting** ✅ Loader, nav + mobile menu, scroll progress, Garden Map, Nature Sounds, petals, project and blog modals, quick contact, toast, Konami / fox / dev-quote easter eggs, deep links.
7. **Performance** ✅ LazyMotion (async features), code-split walk mounted scene by scene, lazy modals/map/sound/howler, static boot loader + hero in HTML, non-blocking CSS, art-directed hero, `scrollbar-gutter` (no CLS).
8. **QA** ✅ Build/typecheck/lint clean; screenshots at 390/768/1440; 40 interaction checks; content parity; Lighthouse mobile + desktop (see `QA.md`).
9. **Docs + deploy** ✅ README, DECISIONS, QA, scene/audio READMEs, Vercel-ready, GitHub Pages workflow.
