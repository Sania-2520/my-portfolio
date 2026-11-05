import { useEffect, useRef, useState } from 'react'
import { useGarden } from '../../context/gardenContext'

interface Petal {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  rot: number
  vr: number
  phase: number
  color: string
  leaf: boolean
}

const COLORS = ['#f3c1cf', '#f8d5d0', '#e9a3b8', '#fff0f4', '#e2d8f3']

/**
 * Drifting petals on one capped <canvas>. Pauses when the tab is hidden,
 * thins out near the Moonlit Garden, bursts on celebrations, and is
 * disabled entirely under reduced motion.
 */
export function PetalField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { reduced, burst, loaderDone } = useGarden()
  const burstRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  // Start drifting only once the garden is revealed and the main thread is idle.
  useEffect(() => {
    if (!loaderDone || ready) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(() => setReady(true), { timeout: 2000 })
    else window.setTimeout(() => setReady(true), 900)
  }, [loaderDone, ready])

  useEffect(() => {
    if (reduced || !ready) return
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const small = window.matchMedia('(max-width: 767px)').matches
    const CAP = small ? 12 : 30
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = performance.now()
    let wind = 0
    const petals: Petal[] = []

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const spawn = (atTop: boolean, x?: number, y?: number): Petal => ({
      x: x ?? Math.random() * w,
      y: y ?? (atTop ? -20 : Math.random() * h),
      r: 4 + Math.random() * 5,
      vy: 14 + Math.random() * 22,
      vx: -6 + Math.random() * 12,
      rot: Math.random() * Math.PI * 2,
      vr: (-0.6 + Math.random() * 1.2) * 0.9,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      leaf: Math.random() < 0.18,
    })
    resize()
    for (let i = 0; i < CAP; i++) petals.push(spawn(false))

    const draw = (p: Petal) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.phase)))
      ctx.fillStyle = p.leaf ? '#9db57e' : p.color
      ctx.globalAlpha = 0.82
      ctx.beginPath()
      ctx.moveTo(0, -p.r)
      ctx.bezierCurveTo(p.r, -p.r * 0.6, p.r * 0.7, p.r * 0.8, 0, p.r)
      ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.8, -p.r, -p.r * 0.6, 0, -p.r)
      ctx.fill()
      ctx.restore()
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      wind = Math.sin(now / 4000) * 10
      // Fewer petals once the visitor reaches the twilight garden.
      const doc = document.documentElement
      const progress = window.scrollY / Math.max(1, doc.scrollHeight - h)
      const fade = progress > 0.86 ? Math.max(0.15, 1 - (progress - 0.86) * 6) : 1
      canvas.style.opacity = String(fade)
      ctx.clearRect(0, 0, w, h)
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.phase += dt * 2.2
        p.x += (p.vx + wind + Math.sin(p.phase) * 12) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        if (p.y > h + 20 || p.x < -40 || p.x > w + 40) {
          if (petals.length > CAP) petals.splice(i, 1)
          else petals[i] = spawn(true)
          continue
        }
        draw(p)
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start())
    burstRef.current = () => {
      for (let i = 0; i < 26; i++) {
        const p = spawn(true, w * (0.2 + Math.random() * 0.6), -10 - Math.random() * 120)
        p.vy *= 1.6
        petals.push(p)
      }
    }
    start()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      burstRef.current = null
    }
  }, [reduced, ready])

  useEffect(() => {
    if (burst > 0) burstRef.current?.()
  }, [burst])

  if (reduced || !ready) return null
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 h-full w-full transition-opacity duration-700"
    />
  )
}
