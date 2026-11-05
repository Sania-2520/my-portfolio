// Captures every section at mobile / tablet / desktop widths into qa/screenshots/.
// Usage: npm run build && npm run preview  (in another terminal)  then  node scripts/qa-screens.mjs
// Optional: BASE_URL=http://localhost:4173  PW_CHROMIUM=/path/to/chrome  WIDTHS=390,768,1440
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/'
const WIDTHS = (process.env.WIDTHS ?? '390,768,1440').split(',').map(Number)
const HEIGHT = { 390: 844, 360: 740, 768: 1024, 1024: 768, 1280: 800, 1440: 900, 1920: 1080 }
const IDS = [
  'home-section',
  'about-section',
  'skills-section',
  'projects-section',
  'academics-section',
  'research-section',
  'achievements-section',
  'blogs-section',
  'contact-section',
  'footer',
]
const OUT = process.env.OUT ?? 'qa/screenshots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined })
const problems = []
for (const w of WIDTHS) {
  const page = await browser.newPage({
    viewport: { width: w, height: HEIGHT[w] ?? 900 },
    deviceScaleFactor: 1,
  })
  page.on(
    'console',
    (m) =>
      ['error', 'warning'].includes(m.type()) && problems.push(`[${w}] console.${m.type()}: ${m.text()}`),
  )
  page.on('pageerror', (e) => problems.push(`[${w}] pageerror: ${e.message}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`[${w}] ${r.status()} ${r.url()}`))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('[aria-label^="Cultivating ideas"]', { state: 'detached', timeout: 8000 })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${OUT}/${w}-00-hero.png` })
  for (const [i, id] of IDS.entries()) {
    const sel = id === 'footer' ? 'footer' : `#${id}`
    await page.evaluate(
      (s) => {
        const el = document.querySelector(s)
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - (s === '#home-section' ? 0 : 70))
      },
      id === 'home-section' ? '#intro-title' : sel,
    )
    await page.waitForTimeout(1400)
    await page.screenshot({ path: `${OUT}/${w}-${String(i + 1).padStart(2, '0')}-${id}.png` })
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  if (overflow > 0) problems.push(`[${w}] horizontal overflow: ${overflow}px`)
  await page.close()
}
await browser.close()
console.log(problems.length ? problems.join('\n') : 'No console errors, failed requests or overflow.')
