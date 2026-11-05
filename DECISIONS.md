# Decisions

Choices made while running the rebuild prompt, including where the build deviates from it.

## Content
- **Legacy is canonical.** Every fact comes from `legacy/index.html`. None of the mockup placeholders (DRDO, Scientist B, GATE AIR 105, ClariConsent, Regulatory Change Radar, the example.com email, invented social handles) appear; `scripts/content-parity.mjs` enforces this.
- **Hero copy from the mockup** ("The Garden of Ideas", tagline, "Begin the Walk", "Explore the Garden Map"). The legacy hero text (role, location, "Engineering Handcrafted AI & ML Solutions", typed tagline, lead, Explore Projects / Open Resume) sits in the "Garden Gate plaque" card directly below, so nothing is lost. "Welcome to My Garden of Ideas" hangs above it as a wooden sign.
- **Typo fixed:** a double space in the machine-unlearning article.
- **GitHub profile link** `https://github.com/saniakotharkar` is derived from the username in every legacy project URL; legacy's social links were generic placeholders. **LinkedIn is omitted** because legacy had no real URL.
- **Mantexia Solutions** is plain text: legacy had no link for it.
- **Offline links** ("Demo Offline", "CLI Core Tool", "Local Python Engine", "Proprietary IP", "Production Hub", "Private Host", "Internal Release", "Draft Paper Pre-print") render as dashed, lock-icon chips, never as `href="#"`.
- **"View Code Base"** (research) keeps the legacy behavior of walking to the Blooming Workshop.
- **About chips** (AI/ML, Backend, Research, Problem Solving) come from the mockup; they are labels, not facts. **"Know More"** reveals the seven legacy "garden facts" from the old waypoint bubbles.
- **Nav:** eight items, with "The Cottage" covering both Academics and the Cottage Desk (Research). Labels drop "The" below 1600 px so the bar fits; the full nav shows from 1280 px, and below that there's a menu sheet. All nine stops are on the Garden Map.

## Features
- **AI summary:** legacy called Gemini from the browser with a client-side key. It is replaced by pre-written summaries (`src/data/blogs.ts`) that only restate each article, revealed with a typewriter. The button reads "Generate Instant Summary" and the box "Quick Summary", since it is no longer AI-generated.
- **Contact form:** posts JSON to `VITE_FORM_ENDPOINT` (Formspree / Web3Forms style) with the legacy four steps following the real request. Without an endpoint it opens a prefilled `mailto:` and says so. It includes a honeypot, on-blur validation, inline errors and an error summary.
- **Nature sounds work without audio files.** Legacy synthesized its soundscape with Web Audio; that engine is ported, so all five channels (Birds, Wind, Water Stream, Fountain, Night Ambience) work out of the box. Recorded loops are optional: list them in `public/audio/manifest.json` and those channels switch to Howler, which is lazy-loaded only then. This replaces the prompt's "disabled slider when a file is missing" with a better default, and still never 404s or autoplays.
- **The soundscape follows the walk:** each scene has its own mix, and Night Ambience crossfades in at the Moonlit Garden.
- **Fairy cursor and rabbit:** the cursor-following fairy was dropped (pointer-chasing animation hurts performance and accessibility). The rabbit drawer became the floating "Quick Transmissions" button.
- **Light theme only.** The Moonlit Garden is a lavender-to-peach twilight with frosted-parchment cards; no dark-mode styles exist.

## Art
- **Hero:** the hero mockup's artwork, with its baked-in UI text removed by inpainting. The few softened patches sit under the real nav, title, buttons and scroll cue. Phones and portrait tablets get a crop centered on the gate (`gate-portrait`).
- **Garden map:** the design board's illustrated map with its text labels inpainted out; live HTML labels sit on top.
- **Vignettes** (Grove, Cottage, Desk, Pavilion, Moonlit) are cropped from the design board at 2× with Lanczos, with feathered edges. The Moonlit crop was regraded from night to twilight to stay in the light theme.
- **SVG-drawn:** the greenhouse, pots, hanging plants, vines, grass, flowers, moon, fox, butterflies and loader sprout. The skill pots are drawn, not cropped, because the mockup's pots had placeholder skills baked in and a duplicate Docker pot.
- **Swappable:** every raster scene lives in `src/assets/scenes/<scene>/art-<width>.(avif|webp)` and falls back to SVG when missing. See `src/assets/scenes/README.md`.
- **Fidelity:** cropped art is limited by the mockup's resolution. Higher-resolution layered art can be dropped in later.

## Tech
- **TypeScript 5.9**, not the template's 7.0, because `typescript-eslint` does not support TS 7 yet.
- **`simple-icons` brand paths are inlined** (`src/lib/brandIcons.ts`) so the full icon set is never bundled. Lucide v1 has no brand icons.
- **Performance work beyond the prompt:**
  - Lazy `m` components with async `domMax` features.
  - Everything below the hero is code-split and mounted one scene per frame.
  - A static boot loader and hero copy in `index.html` give an instant first paint.
  - The main CSS loads without blocking, and React waits for it, so there's no unstyled flash.
  - `scrollbar-gutter: stable` prevents layout shift when scroll locks.
- **Reduced motion:** honors the OS setting, plus a "Reduce motion" toggle in the sound panel (persisted). It disables Lenis, parallax, petals and typewriters.
- **Canonical/OG URL** defaults to `https://sania-kotharkar.vercel.app`; set `VITE_SITE_URL` to the real domain. `robots.txt` and `sitemap.xml` use the same default, so edit them too.
