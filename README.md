<div align="center">

# 🌿 The Garden of Ideas
### *An Illustrated Walk Through AI Engineering, Privacy & Systems*

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Live_Synthesis-5b8c5a?style=for-the-badge&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Playwright](https://img.shields.io/badge/QA_Verified-39_Checks-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

<br />

**[ 🌐 Experience the Garden ](https://sania-kotharkar.vercel.app)** &nbsp;•&nbsp;
**[ 🗺️ Explore Garden Map ](#-the-journey-garden-waypoints)** &nbsp;•&nbsp;
**[ 📑 View Resume (PDF)](public/sania_resume.pdf)** &nbsp;•&nbsp;
**[ 📬 Get in Touch ](#-contact--wandering-further)**

<br />

---

<p align="center">
  <b>Sania S Kotharkar</b><br />
  Honors AI/ML Student (CGPA 9.43) • Co-Founder & ML Lead at Mantexia Solutions • Machine Unlearning Researcher
</p>

> *"A garden is never finished; it grows, adapts, and bears fruit through patient observation."*

---

</div>

<br />

## 🌸 Overview

**The Garden of Ideas** is a narrative, light-themed engineering portfolio designed as an interactive stroll through an illustrated botanical garden. 

Rather than presenting a dry grid of resume tiles, every milestone, research finding, and machine learning pipeline is framed as a waypoint along a garden path—from the **Garden Gate** to the **Moonlit Sanctuary**.

### ✨ Highlights at a Glance
- 🎨 **Illustrated Narrative Journey:** Handcrafted watercolor vignettes paired with smooth responsive SVG scene fallbacks.
- 🎵 **Generative Nature Soundscape:** 5 ambient sound channels (*Birds, Wind, Water Stream, Fountain, Night Ambience*) procedurally synthesized live in the browser using the **Web Audio API**—zero static audio asset overhead required.
- ⚡ **Cutting-Edge Front-End:** Powered by **React 19**, **Vite**, **TypeScript (Strict)**, and **Tailwind CSS v4**.
- 🍃 **Fluid Physics & Motion:** Momentum scrolling orchestrated with **Lenis**, natural interactive transitions driven by **Motion**, and a dynamic floating petal particle system.
- 🛡️ **Engineered for Rigor:** Comprehensive automated test suite including **39 Playwright end-to-end interaction checks**, visual regression snapshots, and content parity validation.
- ♿ **Accessible by Design:** Full keyboard traversal, focus trapping, screen-reader friendly semantic landmarks, skip links, and automated compliance with `prefers-reduced-motion`.

<br />

---

## 🗺️ The Journey: Garden Waypoints

Step through each area of the garden to explore the technical milestones:

| # | Garden Waypoint | Theme & Focus | What You'll Discover |
|:---:|:---|:---|:---|
| **00** | **The Garden Gate** | *Gateway & Orientation* | Entrance plaque, dynamic typewriter role terminal, and ambient sound controls. |
| **01** | **The Curious Grove** | *Biography & Philosophy* | Engineering mission, research values, and an interactive YAML profile manifest. |
| **02** | **The Greenhouse** | *Technical Skill Matrix* | Terracotta pots growing skills in AI/ML, Python, PyTorch, Docker, Kafka, and MLOps. |
| **03** | **The Blooming Workshop** | *Featured Projects* | Interactive carousel showcasing **Cyber Rakshak**, **VeriUnlearn**, **Culling AI**, and **DreamTalk TTS**. |
| **04** | **The Gardener's Cottage** | *Academic History* | B.E. in Computer Science (Honors AI/ML, CGPA 9.43) at Sahyadri College. |
| **05** | **The Cottage Desk** | *Research & Pre-prints* | Privacy-preserving Machine Unlearning using selective influence-function gradients. |
| **06** | **The Pavilion** | *Milestones & Leadership* | 1st Place at Atharva '25 Hackathon, Mantexia Solutions leadership, and academic honors. |
| **07** | **The Garden Journal** | *Engineering Logs* | Reflections on model latency, CUDA kernels, and architectural design patterns. |
| **08** | **The Moonlit Garden** | *Contact & Reflections* | Direct message dispatch, interactive location cards, and reflective closing thoughts. |

<br />

---

## 🛠️ Tech Stack & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE GARDEN OF IDEAS                             │
├───────────────────┬───────────────────┬────────────────────────────────┤
│    CORE ENGINE    │   UI & MOTION     │   AUDIO & COMPUTE              │
│  • React 19       │  • Tailwind CSS 4 │  • Web Audio API (Synthesizer) │
│  • TypeScript 5.9 │  • Motion (v14)   │  • Howler.js (Audio fallbacks) │
│  • Vite 6         │  • Lenis Scroll   │  • Lucide React Icons          │
│  • Fontsource     │  • SVG Botanicals │  • Playwright E2E Suite        │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Decoupled Content Engine
All text, project metrics, credentials, and configuration reside in strictly typed files within `src/data/`:
* 📝 **`profile.ts`** — Bio, hero copy, YAML manifest, and developer easter eggs.
* 🌿 **`skills.ts`** — Skill clusters categorized into AI/ML, Systems/MLOps, and Languages.
* 🚀 **`projects.ts`** — Project metadata, impact percentages, architecture tags, and repository links.
* 🎓 **`education.ts` & `research.ts`** — Specialization milestones, credentials, and paper drafts.
* 🏆 **`achievements.ts`** — Hackathon victories, leadership roles, and community honors.
* 📬 **`contact.ts`** — Direct communication channels, social handles, and availability flags.

<br />

---

## 🌿 Interactive Features & Easter Eggs

- **Garden Map (`M` Key):** Press <kbd>M</kbd> at any time or click the compass icon to open the overhead architectural map and fast-travel anywhere.
- **Synthesized Soundscapes:** Click the gramophone icon to blend individual sliders for birdsong, rustling wind, stream water, garden fountains, and evening crickets.
- **Skip the Walk:** For recruiters and engineers in a hurry, pressing <kbd>Tab</kbd> on load surfaces a quick jump straight to technical projects.
- **Botanical Petal Field:** Interactive floating rose and cherry blossoms reacting dynamically to viewport scroll velocity.
- **🎮 The Konami Code:** Try typing the classic code on your keyboard:
  $$\uparrow\ \uparrow\ \downarrow\ \downarrow\ \leftarrow\ \rightarrow\ \leftarrow\ \rightarrow\ \text{B}\ \text{A}$$

<br />

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js:** `v20.0.0` or higher (`v22+` recommended)
- **Package Manager:** `npm` (or `pnpm` / `yarn`)

### 1. Clone the Repository
```bash
git clone https://github.com/saniakotharkar/sania-portfolio.git
cd sania-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:2503](http://localhost:2503)** in your browser to enter the garden.

<br />

---

## 📜 Available NPM Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR) on port `2503`. |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and generates production bundles in `dist/`. |
| `npm run preview` | Spins up a local static server to preview production build at port `4173`. |
| `npm run lint` | Runs ESLint across all TypeScript and React component trees. |
| `npm run typecheck` | Strict TypeScript compiler validation without emitting files. |
| `npm run format` | Prettier code style formatting with Tailwind CSS class sorting. |
| `npm run qa:interactions` | Runs all 39 Playwright end-to-end interaction tests. |
| `npm run qa:parity` | Ensures all historical credentials and data points are present without placeholders. |
| `npm run qa:screens` | Automatically captures visual regression screenshots across 390px, 768px, and 1440px viewports. |

<br />

---

## 📁 Repository Directory Structure

```plaintext
sania-portfolio/
├── .github/workflows/       # Automated CI/CD deployment pipelines
├── public/                  # Static assets: Favicons, audio manifests, resume PDF
│   ├── audio/               # Optional audio recordings & manifest
│   ├── robots.txt           # SEO crawler directives
│   └── sitemap.xml          # Canonical URL search map
├── src/
│   ├── assets/scenes/       # Adaptive WebP/AVIF responsive scene artwork
│   ├── components/
│   │   ├── features/        # GardenMap, SoundPanel, PetalField, Modals
│   │   ├── layout/          # Navbar, Footer, MobileDrawer, ToastSystem
│   │   ├── scenes/          # Scene vignettes, watercolor frames, SVG botanicals
│   │   ├── sections/        # Hero, About, Skills, Projects, Academics, Contact
│   │   └── ui/              # Buttons, Cards, Dialogs, Headings, Counters
│   ├── context/             # GardenProvider (Scroll, audio state, overlays)
│   ├── data/                # Typed data records (profile, skills, projects, etc.)
│   ├── hooks/               # Custom hooks (useTypewriter, useSound, useFocusTrap)
│   ├── lib/                 # Web Audio synthesizers, motion tokens, storage
│   ├── index.css            # Tailwind CSS v4 design tokens & theme layers
│   └── main.tsx             # Application mount & provider tree
├── scripts/                 # QA test suites & content parity verifiers
├── .env.example             # Base environment variable templates
└── vite.config.ts           # Vite bundler, React plugin & Tailwind integration
```

<br />

---

## 🧪 Quality Assurance & Testing Rigor

Reliability is treated as a first-class feature:

```bash
# 1. Run static verification
npm run lint && npm run typecheck

# 2. Build and launch preview server
npm run build && npm run preview

# 3. In a second terminal, execute Playwright QA suites
npm run qa:interactions   # 39 interaction assertions (modals, keys, forms, audio)
npm run qa:parity         # Content completeness verification against specs
npm run qa:screens        # Multi-viewport responsive visual captures
```

Detailed test execution logs and audit records are documented in [`QA.md`](QA.md) and [`AUDIT.md`](AUDIT.md).

<br />

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Import the repository into your Vercel Dashboard.
2. Vercel automatically detects the **Vite** framework preset.
3. Configure your production environment variable:
   - `VITE_SITE_URL` = `https://your-domain.vercel.app`
4. Deploy! Zero custom build script configuration is required.

### Deploy to GitHub Pages
A GitHub Actions workflow is preconfigured in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push changes to `main` to trigger the build and publication pipeline.

<br />

---

## 📬 Contact & Wandering Further

<div align="center">

**Sania S Kotharkar**  
*AI/ML Engineer & Systems Builder*  
Adyar, Karnataka, India  

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/saniakotharkar)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sania.kotharkar@gmail.com)
[![Resume](https://img.shields.io/badge/Resume-PDF-4285F4?style=for-the-badge&logo=google-drive&logoColor=white)](public/sania_resume.pdf)

<br />

*Handcrafted with curiosity, clean code, and garden soil.*  
*© 2026 Sania S Kotharkar. All rights reserved.*

</div>
