// Content parity: every fact in legacy/index.html must appear in the new site,
// and no placeholder fact from the design mockups may appear.
// Usage: npm run build && npm run preview (another terminal), then node scripts/content-parity.mjs
import { chromium } from 'playwright'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/'
const norm = (s) => s.replace(/[“”"]/g, '"').replace(/[‘’']/g, "'").replace(/\s+/g, ' ').trim().toLowerCase()

// 1. Visible text of the legacy page (markup only: styles, scripts and SVG removed).
let html = readFileSync('legacy/index.html', 'utf8')
html = html.replace(
  /<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>|<noscript[\s\S]*?<\/noscript>/g,
  '',
)
const legacyLines = [
  ...new Set(
    html
      .replace(/<[^>]+>/g, '\n')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&copy;/g, '©')
      .replace(/&nbsp;/g, ' ')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 2),
  ),
]
// Blog article bodies live in the legacy script (blogsDB); include them too.
const script = readFileSync('legacy/index.html', 'utf8')
for (const m of script.matchAll(
  /<p class="blog-p">([\s\S]*?)<\/p>|<h[23] class="blog-h[23]">([\s\S]*?)<\/h[23]>|title: "([^"]+)"/g,
))
  legacyLines.push((m[1] ?? m[2] ?? m[3]).replace(/\s+/g, ' ').trim())

// Legacy UI chrome that was intentionally renamed or replaced (see DECISIONS.md).
const INTENTIONAL = new Map([
  ['Sania S Kotharkar | Professional AI/ML Portfolio', 'Page title rewritten for SEO'],
  ['Begin Your Walk', 'Hero CTA is "Begin the Walk" (mockup copy)'],
  ['View Garden Map', 'CTA is "Explore the Garden Map" (mockup copy)'],
  ['Garden Map', 'kept (nav button)'],
  ['Press M · Esc to close', 'kept in map dialog'],
  ['Github Code', 'kept'],
  ['Blog Category', 'Legacy modal placeholder label'],
  [
    'Generate Instant AI Summary',
    'Now "Generate Instant Summary": static summaries replace the client-side Gemini call',
  ],
  ['Open the bloom', 'kept'],
  ['All', 'kept (filter)'],
])

// 2. Rendered text of the new site, including every project and blog dialog.
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('[aria-label^="Cultivating ideas"]', { state: 'detached', timeout: 8000 })
await page.waitForSelector('footer', { timeout: 8000 })
let text = await page.evaluate(
  () =>
    document.body.innerText +
    ' ' +
    [...document.querySelectorAll('[aria-label],[title],img[alt]')]
      .map(
        (e) =>
          e.getAttribute('aria-label') +
          ' ' +
          (e.getAttribute('title') ?? '') +
          ' ' +
          (e.getAttribute('alt') ?? ''),
      )
      .join(' '),
)
for (const id of ['cyber-rakshak', 'veri-unlearn', 'culling-ai', 'dreamtalk-tts', 'kaushalya-setu']) {
  const i = await page
    .locator('[data-project-card]')
    .evaluateAll((els, pid) => els.findIndex((e) => e.getAttribute('data-project-card') === pid), id)
  await page
    .getByRole('button', { name: /^Show / })
    .nth(i)
    .click()
  await page.waitForTimeout(500)
  await page
    .locator(`[data-project-card="${id}"]`)
    .getByRole('button', { name: /Open the bloom/ })
    .click()
  await page.waitForTimeout(1800)
  text += ' ' + (await page.locator('[role="dialog"]').innerText())
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
}
for (const name of [/Read Log: Demystifying/, /Read Log: Optimizing/, /Read Log: Kafka/]) {
  await page.getByRole('button', { name }).click()
  await page.waitForTimeout(600)
  text += ' ' + (await page.locator('[role="dialog"]').innerText())
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
}
text +=
  ' ' + (await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')).join(' ')))
await browser.close()
const site = norm(text)

// 3. Compare. Text shown only in transient UI states (loader, typed YAML, form steps,
// closed drawers) is verified against the source instead of the rendered page.
const walk = (d) =>
  readdirSync(d).flatMap((f) =>
    statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : /\.(ts|tsx)$/.test(f) ? [join(d, f)] : [],
  )
const loose = (s) =>
  norm(s)
    .replace(/[^a-z0-9&%<>/.+-]+/g, ' ')
    .trim()
const source = loose(
  walk('src')
    .map((f) => readFileSync(f, 'utf8'))
    .join(' ') +
    ' ' +
    text,
)
const notOnScreen = legacyLines.filter((l) => !INTENTIONAL.has(l) && !site.includes(norm(l)))
const missing = notOnScreen.filter((l) => !source.includes(loose(l)))
const stateOnly = notOnScreen.filter((l) => !missing.includes(l))
const links = [...html.matchAll(/href="(https?:[^"]+|mailto:[^"]+|tel:[^"]+|sania_resume\.pdf)"/g)]
  .map((m) => m[1])
  .filter((h) => !/fonts\.g|cdnjs|^https:\/\/(github|linkedin)\.com$/.test(h))
const missingLinks = links.filter((h) => !text.includes(h))
const FORBIDDEN = [
  'DRDO',
  'Scientist B',
  'GATE AIR 105',
  'AIR 105',
  'ClariConsent',
  'Regulatory Change Radar',
  'sania.kotharkar@example.com',
  '/in/saniakotharkar',
  'sania-2520',
  'Research Publications & Projects',
]
const leaked = FORBIDDEN.filter((f) => site.includes(norm(f)))

console.log(`Legacy text lines checked: ${legacyLines.length}`)
console.log(`Present only in transient UI states (verified in source): ${stateOnly.length}`)
console.log(
  missing.length
    ? `MISSING (${missing.length}):\n  - ${missing.join('\n  - ')}`
    : 'All legacy text is present.',
)
console.log(
  missingLinks.length
    ? `MISSING LINKS:\n  - ${missingLinks.join('\n  - ')}`
    : `All ${links.length} legacy links are present.`,
)
console.log(
  leaked.length
    ? `FORBIDDEN MOCKUP CONTENT FOUND: ${leaked.join(', ')}`
    : 'No mockup placeholder content found.',
)
process.exit(missing.length || missingLinks.length || leaked.length ? 1 : 0)
