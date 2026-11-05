// End-to-end interaction checks for the garden.
// Usage: npm run build && npm run preview  (in another terminal)  then  node scripts/qa-interactions.mjs
// Optional: BASE_URL, PW_CHROMIUM (custom Chromium path), SHOTS=1 to save overlay screenshots.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/'
const SHOTS = process.env.SHOTS === '1'
if (SHOTS) mkdirSync('qa/screenshots', { recursive: true })
const results = []
const errors = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined })

async function open(viewport = { width: 1440, height: 900 }, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  return { ctx, page }
}
const loaderGone = (page) =>
  page.waitForSelector('[aria-label^="Cultivating ideas"]', { state: 'detached', timeout: 8000 })
const inView = (page, id) =>
  page.evaluate((i) => {
    const r = document.getElementById(i).getBoundingClientRect()
    return r.top < window.innerHeight * 0.5 && r.bottom > 80
  }, id)
const dialogOpen = (page) =>
  page
    .locator('[role="dialog"][aria-modal="true"]')
    .count()
    .then((n) => n > 0)
const focusInDialog = (page) => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))

/* 1. Loader + skip link */
{
  const { ctx, page } = await open()
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  check('Skip link is the first focusable element', first === 'Skip the walk and go to the content', first)
  await page.keyboard.press('Enter')
  await loaderGone(page)
  await page.waitForTimeout(3400)
  check('Skip link dismisses the loader and lands in the Curious Grove', await inView(page, 'about-section'))
  await ctx.close()
}

/* 2. Desktop: nav, map, filters, carousel, modals, sound, form */
{
  const { ctx, page } = await open()
  await loaderGone(page)
  check('Loader completes within the cap', true)

  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: /Workshop/ })
    .click()
  await page.waitForTimeout(2800)
  check('Nav link walks to the Blooming Workshop', await inView(page, 'projects-section'))
  const current = await page
    .getByRole('navigation', { name: 'Primary' })
    .locator('[aria-current="location"]')
    .innerText()
  check('Active nav item updates', /Workshop/.test(current), current)

  // Map via button + Escape + focus return
  const mapBtn = page.getByRole('button', { name: /^Garden Map/ })
  await mapBtn.click()
  await page.waitForTimeout(600)
  check('Garden Map opens from the nav button', await dialogOpen(page))
  if (SHOTS) await page.screenshot({ path: 'qa/screenshots/overlay-1440-map.png' })
  check('Focus moves into the map dialog', await focusInDialog(page))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
  check('Escape closes the map', !(await dialogOpen(page)))
  check(
    'Focus returns to the map button',
    await page.evaluate(() => /Garden Map/.test(document.activeElement?.textContent ?? '')),
  )

  // M shortcut
  await page.locator('body').click({ position: { x: 5, y: 400 } })
  await page.keyboard.press('m')
  await page.waitForTimeout(500)
  check('M key opens the map', await dialogOpen(page))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // Every map stop navigates
  const ids = [
    'home-section',
    'about-section',
    'skills-section',
    'projects-section',
    'academics-section',
    'research-section',
    'achievements-section',
    'blogs-section',
    'contact-section',
  ]
  let stopsOk = 0
  for (const [i, id] of ids.entries()) {
    await mapBtn.click()
    await page.waitForTimeout(450)
    await page.getByRole('navigation', { name: 'Garden map stops' }).locator('ol li button').nth(i).click()
    await page.waitForTimeout(3000)
    if (await inView(page, id)) stopsOk++
    else console.log('   stop missed:', id)
  }
  check('Every map stop walks to its section', stopsOk === ids.length, `${stopsOk}/${ids.length}`)

  // Filters
  await page.evaluate(() => window.scrollTo(0, document.getElementById('projects-section').offsetTop))
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: 'Web', exact: true }).click()
  await page.waitForTimeout(900)
  const webCount = await page.locator('[data-project-card]').count()
  check('Web filter shows the 2 web projects', webCount === 2, String(webCount))
  await page.getByRole('button', { name: 'MLOps', exact: true }).click()
  await page.waitForTimeout(900)
  check('MLOps filter shows Cyber Rakshak only', (await page.locator('[data-project-card]').count()) === 1)
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await page.waitForTimeout(900)
  check('All filter restores 5 projects', (await page.locator('[data-project-card]').count()) === 5)
  await page.getByPlaceholder('Search systems or tags...').fill('opencv')
  await page.waitForTimeout(700)
  check('Search narrows to Culling AI', (await page.locator('[data-project-card]').count()) === 1)
  await page.getByRole('button', { name: 'Clear search' }).click()
  await page.waitForTimeout(700)

  // Carousel: keys, buttons, swipe
  const live = page.locator('#projects-section p[aria-live="polite"]')
  await page.locator('[aria-roledescription="carousel"]').focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(400)
  check('Arrow key advances the carousel', /2 of 5/.test(await live.innerText()))
  await page.getByRole('button', { name: 'Next project' }).click()
  await page.waitForTimeout(400)
  check('Next button advances the carousel', /3 of 5/.test(await live.innerText()))
  await page.getByRole('button', { name: 'Previous project' }).click()
  await page.waitForTimeout(600)
  const track = await page.locator('[data-project-card]').first().boundingBox()
  await page.mouse.move(720, track.y + 120)
  await page.mouse.down()
  await page.mouse.move(520, track.y + 120, { steps: 8 })
  await page.mouse.move(380, track.y + 120, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(700)
  check(
    'Swipe/drag advances the carousel',
    /3 of 5|4 of 5/.test(await live.innerText()),
    await live.innerText(),
  )

  // Every project modal opens, traps focus, closes
  let modalsOk = 0
  for (let i = 0; i < 5; i++) {
    await page
      .getByRole('button', { name: /^Show / })
      .nth(i)
      .click()
    await page.waitForTimeout(700)
    await page
      .locator('[data-project-card]')
      .nth(i)
      .getByRole('button', { name: /Open the bloom/ })
      .click()
    await page.waitForTimeout(800)
    const opened = await dialogOpen(page)
    if (i === 1 && SHOTS) await page.screenshot({ path: 'qa/screenshots/overlay-1440-project.png' })
    let trapped = true
    for (let t = 0; t < 12; t++) {
      await page.keyboard.press('Tab')
      if (!(await focusInDialog(page))) trapped = false
    }
    await page.keyboard.press('Escape')
    await page.waitForTimeout(600)
    if (opened && trapped && !(await dialogOpen(page))) modalsOk++
  }
  check('Every project modal opens, traps focus and closes', modalsOk === 5, `${modalsOk}/5`)

  // Blog modal + summary
  await page.evaluate(() => window.scrollTo(0, document.getElementById('blogs-section').offsetTop))
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: /Read Log: Demystifying/ }).click()
  await page.waitForTimeout(800)
  check('Read Log opens the article', await dialogOpen(page))
  await page.getByRole('button', { name: 'Generate Instant Summary' }).click()
  await page.waitForTimeout(2500)
  check(
    'Instant summary appears without any network call',
    (await page.getByText('Quick Summary').count()) === 1,
  )
  if (SHOTS) await page.screenshot({ path: 'qa/screenshots/overlay-1440-blog.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // Sound panel
  await page.getByRole('button', { name: /Nature sounds/ }).click()
  await page.waitForTimeout(400)
  const sw = page.getByRole('switch', { name: 'Nature Sounds' })
  await sw.click()
  await page.waitForTimeout(800)
  check('Sound toggle turns on without errors', (await sw.getAttribute('aria-checked')) === 'true')
  await page.locator('#vol-birds').fill('30')
  if (SHOTS) await page.screenshot({ path: 'qa/screenshots/overlay-1440-sound.png' })
  await sw.click()
  await page.keyboard.press('Escape')

  // Contact form
  await page.evaluate(() => window.scrollTo(0, document.getElementById('contact-section').offsetTop))
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Submit Handshake Byte' }).click()
  await page.waitForTimeout(500)
  const invalid = await page.locator('#contact-section [aria-invalid="true"]').count()
  check('Empty submit shows 4 inline errors', invalid === 4, String(invalid))
  check(
    'Error summary receives focus',
    await page.evaluate(() => document.activeElement?.getAttribute('role') === 'alert'),
  )
  await page.getByLabel(/Your Full Name/).fill('Garden Visitor')
  await page.getByLabel(/Email Address/).fill('visitor@example.org')
  await page.getByLabel(/Inquiry Topic Vector/).fill('Collaboration')
  await page
    .getByLabel(/Payload message bytes/)
    .fill('Hello Sania, I would love to collaborate on unlearning research.')
  await page.getByRole('button', { name: 'Submit Handshake Byte' }).click()
  await page.waitForTimeout(2200)
  check(
    'Valid submit runs all 4 steps (mailto fallback)',
    (await page.getByText(/Pipeline transmission SUCCESS/).count()) === 1 &&
      (await page.getByText(/email app should open/).count()) === 1,
  )

  // Resume
  const res = await page.request.get(new URL('sania_resume.pdf', BASE).toString())
  check('Resume PDF is served', res.ok() && res.headers()['content-type']?.includes('pdf'))
  await ctx.close()
}

/* 3. Mobile: menu + no overflow */
{
  const { ctx, page } = await open(
    { width: 390, height: 844 },
    { isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  )
  await loaderGone(page)
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await page.waitForTimeout(600)
  check('Mobile menu opens', await dialogOpen(page))
  if (SHOTS) await page.screenshot({ path: 'qa/screenshots/overlay-390-menu.png' })
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /The Journal/ })
    .click()
  await page.waitForTimeout(3000)
  check(
    'Mobile menu link closes the menu and walks to the Journal',
    !(await dialogOpen(page)) && (await inView(page, 'blogs-section')),
  )
  await page.getByRole('button', { name: 'Quick contact' }).click()
  await page.waitForTimeout(400)
  check('Quick contact drawer opens', (await page.locator('#quick-contact').count()) === 1)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check('No horizontal overflow at 390px', overflow <= 0, `${overflow}px`)
  await page.evaluate(() => window.scrollTo(0, document.getElementById('skills-section').offsetTop))
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: /^Python\./ }).tap()
  check(
    'Tapping a pot waters it',
    (await page.getByRole('button', { name: /^Python\./ }).getAttribute('aria-pressed')) === 'true',
  )
  await ctx.close()
}

/* 4. Reduced motion */
{
  const { ctx, page } = await open({ width: 1280, height: 800 }, { reducedMotion: 'reduce' })
  await loaderGone(page)
  check('Reduced motion: petal canvas disabled', (await page.locator('canvas').count()) === 0)
  check(
    'Reduced motion: Lenis smoothing disabled',
    !(await page.evaluate(() => document.documentElement.classList.contains('lenis-smooth'))),
  )
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: /Pavilion/ })
    .click()
  await page.waitForTimeout(400)
  check('Reduced motion: nav jumps instantly', await inView(page, 'achievements-section'))
  await ctx.close()
}

/* 5. Other widths: overflow */
for (const w of [360, 768, 1024, 1280, 1920]) {
  const { ctx, page } = await open({ width: w, height: w < 800 ? 800 : 900 })
  await loaderGone(page)
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += 900) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(60)
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check(`No horizontal overflow at ${w}px`, overflow <= 0, `${overflow}px`)
  await ctx.close()
}

/* Landscape phone */
{
  const { ctx, page } = await open({ width: 844, height: 390 }, { isMobile: true, hasTouch: true })
  await loaderGone(page)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check('No horizontal overflow in landscape phone', overflow <= 0, `${overflow}px`)
  if (SHOTS) await page.screenshot({ path: 'qa/screenshots/landscape-844.png' })
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.ok)
const uniqErrors = [...new Set(errors)].filter((e) => !e.includes('mailto:'))
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
console.log(
  uniqErrors.length ? `Runtime problems:\n${uniqErrors.join('\n')}` : 'No console errors or failed requests.',
)
process.exit(failed.length || uniqErrors.length ? 1 : 0)
