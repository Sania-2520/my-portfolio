# Audit of `legacy/index.html`

The legacy site was one 228 KB HTML file: inline CSS, inline SVG sprites, vanilla JS, Lenis from a CDN, Font Awesome from a CDN and Google Fonts. Two backups (`index.backup-v2-motion.html`, a Tailwind-CDN version, and `index.backup-v3-garden.html`, an earlier garden version) contain no content that is missing from the current file.

## Sections

| id | Display name | Purpose | New component |
|---|---|---|---|
| `home-section` | The Garden Gate | Hero: name, role, location, typed tagline, lead, CTAs, interactive rose garden | `sections/Hero.tsx` + `sections/Intro.tsx` |
| `about-section` | The Curious Grove · 01 | Profile, mission, Mantexia role, `s_kotharkar.yaml` manifest | `sections/About.tsx`, `YamlManifest.tsx` |
| `skills-section` | The Greenhouse · 02 | Skill matrix on three shelves | `sections/Skills.tsx` |
| `projects-section` | The Blooming Workshop · 03 | 5 projects, category filters, search, "Open the bloom" details | `sections/Projects.tsx`, `ProjectCard.tsx`, `features/ProjectModal.tsx` |
| `academics-section` | The Gardener's Cottage · 04 | Education timeline | `sections/Education.tsx` |
| `research-section` | The Cottage Desk · 05 | Machine Unlearning Optimization research card | `sections/Research.tsx` |
| `achievements-section` | The Pavilion of Achievements · 06 | Hackathon/skills awards + campus leadership | `sections/Achievements.tsx` |
| `blogs-section` | The Garden Journal · 07 | Three technical logs with reader modal + "AI summary" | `sections/Journal.tsx`, `features/BlogModal.tsx` |
| `contact-section` | The Moonlit Garden · 08 | Contact details, metric tiles, contact form | `sections/Contact.tsx`, `features/ContactForm.tsx` |
| `footer` | n/a | "Thank you for walking through my garden.", © line, dev-quote easter egg | `layout/Footer.tsx` |

## Behaviors and JS logic

| Legacy behavior | What it did | New implementation |
|---|---|---|
| Loader "Cultivating Ideas" | Overlay with progress | `features/Loader.tsx` + static copy in `index.html`; progress follows fonts, hero decode and `load`; min 1.2 s, max 3 s |
| Skip link | "Skip the walk and go to the content" | `layout/SkipLink.tsx`, first focusable element; dismisses loader and walks to the Grove |
| Sticky nav + active section | Highlighted current section | `layout/Nav.tsx` + `useActiveSection` (IntersectionObserver), `layoutId` underline |
| `walkTo()` smooth scroll | Lenis `scrollTo` with distance-based duration | `GardenProvider.scrollTo` (Lenis; instant under reduced motion; queued while overlays close) |
| Garden Map (`M` / `Esc`) | Overlay with clickable nodes | `features/GardenMap.tsx`: illustrated map, 9 stops, focus trap, focus restore |
| Typed tagline | Cycled 4 phrases | `useTypewriter` in `Intro.tsx` (static under reduced motion, full text for screen readers) |
| Project category filter + search | `filterCategory`, `filterProjects` | Filter chips (`aria-pressed`, animated pill) + search box in `Projects.tsx` |
| "Open the bloom" | Expanded card details, counters | Accessible modal grown from the card; `CountUp` metrics |
| Counters (`data-count`) | Counted metrics up | `ui/CountUp.tsx` |
| Blog reader (`readBlog`) | Modal with article HTML | `BlogModal.tsx`, structured article data, focus trap |
| `summarizeBlogWithAI()` | Called Gemini **from the browser with an API key** (the key was empty, so it always fell back) | Replaced with pre-written summaries revealed by a typewriter. **No key, no network call.** |
| `transmitMessage()` | Fake 4-step "handshake" animation; never sent anything | Real submit to `VITE_FORM_ENDPOINT`, with steps driven by the request lifecycle; `mailto:` fallback |
| Nature sounds | Web Audio synthesis, scene-based mix, persisted on/off + volume | `lib/audio.ts`: same synthesis, five channel sliders, crossfades per scene, optional recorded loops via manifest + Howler |
| Scroll vine / progress | Vine grew with scroll | `layout/ScrollProgress.tsx`: seed → sprout → leaves → bud → bloom rail + top line |
| Ambient life (petals, fireflies, butterflies, fairy cursor) | Many DOM particles + rAF loops | One capped `<canvas>` (`PetalField`), CSS fireflies in the Moonlit Garden, floating butterflies; fairy cursor dropped (see DECISIONS) |
| Waypoint fact bubbles | 7 garden facts along the path | "Know More" in the Curious Grove lists all 7 facts |
| Easter eggs | Konami code (magic tree + petals), fox toast, footer dev quotes, console hint | Konami → petal burst + toast; fox in the Journal; tap the footer card for dev quotes; console hint kept |
| Rabbit peek-a-boo contact drawer | Quick Email / Phone / Resume | `features/QuickContact.tsx` floating drawer |
| Dark-mode toggle | `toggleTheme()` | Removed: light theme only, by requirement |

## Problems found in legacy

- **Insecure pattern:** `summarizeBlogWithAI` was built to call Gemini with an API key embedded in client JS (`const apiKey = ""`). The key was empty, so the feature always fell back. Nothing was copied.
- **Fake form:** the contact form only animated; messages were never delivered.
- **Placeholder links:** footer/contact socials pointed to `https://github.com` and `https://linkedin.com`; Kaushalya-Setu's "Private Host" used `href="#"`.
- **CDN dependencies:** Font Awesome, Google Fonts and Lenis loaded at runtime from third parties.
- **Image fallback:** the profile `<img>` hot-linked `placehold.co` on error.
- **Typo:** a double space in the machine-unlearning article ("deep learning  engineers").
- **Performance:** a 228 KB single document, ~2,800 lines of inline JS, many concurrent rAF loops.
