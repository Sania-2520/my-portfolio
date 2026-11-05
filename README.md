# The Garden of Ideas · Sania S Kotharkar

An illustrated, light-themed portfolio told as a walk through a garden: Garden Gate → Curious Grove → Greenhouse → Blooming Workshop → Gardener's Cottage → Cottage Desk → Pavilion of Achievements → Garden Journal → Moonlit Garden.

**Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · motion · Lenis · Howler · lucide-react · self-hosted Fontsource fonts.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
npm run preview      # serve dist/ at http://localhost:4173
```

Requires Node 20+ (22 recommended).

## Project structure

```
src/
  data/            all copy and content (edit text here, not in JSX)
  components/
    layout/        Nav, MobileMenu, Footer, SkipLink, ScrollProgress, Toast
    sections/      Hero, Intro, About, Skills, Projects, Education, Research, Achievements, Journal, Contact
    features/      Loader, GardenMap, SoundPanel, PetalField, ProjectModal, BlogModal, ContactForm, QuickContact
    scenes/        Scene / Vignette art slots, SVG botanicals
    ui/            Button, Modal, Reveal, CountUp, SectionHeading, GardenSection…
  context/         GardenProvider: smooth scroll, overlays, reduced motion, toasts
  hooks/           useActiveSection, useFocusTrap, useKeyboardShortcut, useTypewriter…
  lib/             audio engine, form submit, motion tokens, storage
  assets/scenes/   scene artwork (see its README)
public/            resume PDF, icons, robots/sitemap, audio/
scripts/           QA: screenshots, interaction tests, content parity
legacy/            the previous single-file site (reference only; never edited)
reference/         design mockups
```

## Edit content

Everything visitors read lives in `src/data/`:

| File | Content |
|---|---|
| `profile.ts` | name, role, hero + intro copy, about text, YAML manifest, garden facts, footer quotes |
| `skills.ts` | skill groups (one pot per skill) |
| `projects.ts` | projects, statuses, metrics, tags, links (`offline: true` for non-public links) |
| `education.ts`, `research.ts`, `achievements.ts` | timeline, research card, awards + leadership |
| `blogs.ts` | journal articles + their quick summaries |
| `contact.ts` | email, phone, location, form labels, status steps, footer |
| `sections.ts` | section names and nav labels |

## Swap scene art

Drop `art-<width>.avif` + `art-<width>.webp` files into `src/assets/scenes/<scene>/`. They're picked up automatically, and missing scenes fall back to SVG. Sizes and tips: `src/assets/scenes/README.md`.

## Nature sounds

The five channels (Birds, Wind, Water Stream, Fountain, Night Ambience) are synthesized live with Web Audio, so they work with no files. To use recordings, add loops to `public/audio/` and list them in `public/audio/manifest.json` (see `public/audio/README.md`). Sound never autoplays.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|---|---|
| `VITE_FORM_ENDPOINT` | Contact form endpoint that accepts a JSON POST (e.g. `https://formspree.io/f/xxxx`). Empty = the form opens a prefilled `mailto:` instead. |
| `VITE_SITE_URL` | Public URL for canonical / Open Graph tags (default `https://sania-kotharkar.vercel.app`). Also update `public/robots.txt` and `public/sitemap.xml`. |
| `VITE_BASE` | Base path. `/` for Vercel or a custom domain; `/<repo>/` for a GitHub Pages project site. |

Never put secret keys in `VITE_*` variables: they are bundled into public JavaScript.

## Deploy

**Vercel (recommended):** import the repo, keep the detected "Vite" preset, and add `VITE_FORM_ENDPOINT` / `VITE_SITE_URL` under Environment Variables. No config file is needed.

**GitHub Pages:** push to `main`/`master`; `.github/workflows/deploy.yml` builds and publishes. In the repo, set Settings → Pages → Source to **GitHub Actions**, and optionally add the variables under Settings → Secrets and variables → Actions → Variables. The base path is set automatically.

## Quality checks

```bash
npm run lint && npm run typecheck
npm run build && npm run preview          # keep running, then in another terminal:
npx playwright install chromium            # first time only
npm run qa:interactions                    # 40 end-to-end checks
npm run qa:parity                          # every legacy fact present, no mockup placeholders
npm run qa:screens                         # screenshots → qa/screenshots/
```

Results of the last full run are in `QA.md`. Design and content decisions are in `DECISIONS.md`.

## Keyboard & accessibility

- `Tab` from the top reveals **Skip the walk and go to the content**.
- `M` opens the Garden Map; `Esc` closes any dialog.
- Arrow keys move the project carousel when it has focus.
- Reduced motion is honored automatically, and there's a **Reduce motion** toggle in the sound panel.
- Try the Konami code.
