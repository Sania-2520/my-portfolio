import { useEffect, useLayoutEffect, useRef } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { useGarden } from '../../context/gardenContext'
import { EASE } from '../../lib/motion'
import { VineCorner } from '../scenes/art/Botanicals'

/** Times are measured from navigation start (performance.now() origin). */
const MIN_MS = 1200
const MAX_MS = 3000

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * "Cultivating Ideas…" loader. Progress follows real readiness (fonts, hero art
 * decode, window load), shows for at least MIN_MS and never longer than MAX_MS.
 * Visuals are driven straight on the DOM each frame, so React never re-renders mid-load.
 * A static copy in index.html paints before any JavaScript runs; this one replaces it.
 */
export function Loader() {
  const { loaderDone, setLoaderDone, lockScroll, reduced } = useGarden()
  const bar = useRef<HTMLDivElement>(null)
  const pct = useRef<HTMLParagraphElement>(null)
  const stem = useRef<SVGPathElement>(null)
  const leaves = useRef<SVGGElement>(null)
  const bloom = useRef<SVGGElement>(null)

  // Hand over from the static boot loader in index.html.
  useLayoutEffect(() => {
    document.getElementById('boot-loader')?.remove()
  }, [])

  // The static hero copy (index.html) has done its job once the real hero is revealed.
  useEffect(() => {
    if (!loaderDone) return
    document.getElementById('boot-hero')?.remove()
    document.getElementById('boot-copy')?.remove()
  }, [loaderDone])

  useEffect(() => {
    if (loaderDone) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [loaderDone, lockScroll])

  useEffect(() => {
    if (loaderDone) return
    let target = 0.1
    let shown = 0
    let finished = false
    let raf = 0
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) =>
        document.readyState === 'complete'
          ? r(null)
          : window.addEventListener('load', () => r(null), { once: true }),
      ),
    ]
    const hero = document.querySelector<HTMLImageElement>('[data-hero-art] img')
    if (hero) tasks.push(hero.complete ? Promise.resolve() : hero.decode().catch(() => undefined))
    let done = 0
    tasks.forEach((t) => t.finally(() => (target = Math.max(target, ++done / tasks.length))))

    const paint = (v: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${v})`
      if (pct.current) pct.current.textContent = `${Math.round(v * 100)}%`
      if (stem.current) stem.current.style.strokeDashoffset = String(1 - clamp01(v * 1.4))
      if (leaves.current) leaves.current.style.transform = `scale(${clamp01((v - 0.25) * 2)})`
      if (bloom.current) bloom.current.style.transform = `scale(${clamp01((v - 0.7) * 3.4)})`
    }
    const tick = () => {
      const t = performance.now()
      const timeFloor = clamp01(t / MIN_MS)
      const goal = t >= MAX_MS ? 1 : Math.min(target, Math.max(timeFloor * 0.92, target * timeFloor))
      shown += (goal - shown) * 0.14
      if (goal - shown < 0.004) shown = goal
      paint(shown)
      if (shown >= 1 && t >= MIN_MS) {
        if (!finished) {
          finished = true
          window.setTimeout(() => setLoaderDone(true), 200)
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const cap = window.setTimeout(() => setLoaderDone(true), Math.max(0, MAX_MS + 600 - performance.now()))
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(cap)
    }
  }, [loaderDone, setLoaderDone])

  return (
    <AnimatePresence>
      {!loaderDone && (
        <m.div
          key="loader"
          className="bg-blush-50 fixed inset-0 z-[100] grid place-items-center overflow-hidden"
          exit={{ opacity: 0, y: reduced ? 0 : -40, transition: { duration: 0.8, ease: EASE } }}
          role="status"
          aria-busy="true"
          aria-label="Cultivating ideas: the garden is loading"
        >
          <div className="watercolor-bg absolute inset-0" aria-hidden />
          <VineCorner className="absolute top-0 left-0 w-56 opacity-80 sm:w-72" />
          <VineCorner className="absolute top-0 right-0 w-56 -scale-x-100 opacity-80 sm:w-72" />
          <VineCorner className="absolute bottom-0 left-0 w-48 -scale-y-100 opacity-60" />
          <VineCorner className="absolute right-0 bottom-0 w-48 -scale-100 opacity-60" />
          <div className="relative flex flex-col items-center px-6 text-center">
            <svg viewBox="0 0 120 120" className="size-32 sm:size-36" aria-hidden>
              <ellipse cx="60" cy="98" rx="34" ry="9" fill="#8a6650" opacity=".85" />
              <ellipse cx="60" cy="95" rx="28" ry="6" fill="#74533f" />
              <path
                ref={stem}
                d="M60 94V54"
                stroke="#3e5a2b"
                strokeWidth="3"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1}
              />
              <g ref={leaves} style={{ transformOrigin: '60px 70px', transform: 'scale(0)' }}>
                <path d="M60 72c-12 0-20-8-21-17 12 0 20 7 21 17Z" fill="#6a8a4a" />
                <path d="M60 64c12 0 20-8 21-17-12 0-20 7-21 17Z" fill="#8aa76a" />
              </g>
              <g ref={bloom} style={{ transformOrigin: '60px 50px', transform: 'scale(0)' }}>
                {[0, 72, 144, 216, 288].map((r) => (
                  <ellipse
                    key={r}
                    cx="60"
                    cy="43"
                    rx="5"
                    ry="7.5"
                    fill="#e58fae"
                    transform={`rotate(${r} 60 50)`}
                  />
                ))}
                <circle cx="60" cy="50" r="4" fill="#ebd08e" />
              </g>
            </svg>
            <p className="font-display text-bark-900 mt-2 text-3xl italic sm:text-4xl">Cultivating Ideas…</p>
            <div
              className="border-moss-700/20 mt-6 h-2 w-56 overflow-hidden rounded-full border bg-white/70 sm:w-64"
              aria-hidden
            >
              <div
                ref={bar}
                className="from-moss-700 to-moss-500 h-full origin-left rounded-full bg-gradient-to-r"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <p ref={pct} className="text-bark-700 mt-3 font-mono text-sm" aria-hidden>
              0%
            </p>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
