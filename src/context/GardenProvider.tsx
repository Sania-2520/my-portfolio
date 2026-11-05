import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { LazyMotion, MotionConfig } from 'motion/react'
import { GardenContext, type GardenState } from './gardenContext'
import { useSystemReducedMotion } from '../hooks/useMediaQuery'
import { readStore, writeStore } from '../lib/storage'

const NAV_OFFSET = 76
const loadFeatures = () => import('../lib/motionFeatures').then((r) => r.default)

export function GardenProvider({ children }: { children: ReactNode }) {
  const systemReduced = useSystemReducedMotion()
  const [userReduced, setUserReducedState] = useState(
    () => readStore('garden.motion', { reduce: false }).reduce,
  )
  const reduced = systemReduced || userReduced
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [blogId, setBlogId] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [loaderDone, setLoaderDone] = useState(false)
  const [burst, setBurst] = useState(0)
  const locks = useRef(0)
  /** A walk requested while an overlay holds the scroll lock; run once it releases. */
  const pendingWalk = useRef<(() => void) | null>(null)
  const scrollToRef = useRef<((id: string, opts?: { focus?: boolean }) => void) | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const setUserReduced = useCallback((v: boolean) => {
    setUserReducedState(v)
    writeStore('garden.motion', { reduce: v })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', userReduced)
  }, [userReduced])

  // Smooth scrolling (skipped entirely under reduced motion).
  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95, autoRaf: true })
    // eslint-disable-next-line react-hooks/set-state-in-effect -- publishing an external instance
    setLenis(instance)
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  const lockScroll = useCallback(
    (locked: boolean) => {
      locks.current = Math.max(0, locks.current + (locked ? 1 : -1))
      const on = locks.current > 0
      document.documentElement.style.overflow = on ? 'hidden' : ''
      if (lenis) {
        if (on) lenis.stop()
        else lenis.start() // note: start() resets any in-flight scroll animation
      }
      if (!on && pendingWalk.current) {
        const walk = pendingWalk.current
        pendingWalk.current = null
        requestAnimationFrame(walk)
      }
    },
    [lenis],
  )

  const scrollTo = useCallback(
    (id: string, opts?: { focus?: boolean }) => {
      const el = document.getElementById(id)
      if (!el) {
        // Section not rendered yet (lazy walk): retry for up to ~3s.
        const tries = (opts as { _tries?: number } | undefined)?._tries ?? 0
        if (tries < 180)
          requestAnimationFrame(() =>
            scrollToRef.current?.(id, { ...opts, _tries: tries + 1 } as typeof opts),
          )
        return
      }
      if (locks.current > 0) {
        // An overlay is closing; walk as soon as it lets go of the page.
        pendingWalk.current = () => scrollToRef.current?.(id, opts)
        return
      }
      const top = id === 'home-section' ? 0 : el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
      const focus = () => {
        if (opts?.focus === false) return
        const target = el.querySelector<HTMLElement>('[data-section-heading]') ?? el
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }
      if (lenis && !reduced) {
        const dist = Math.abs(top - window.scrollY)
        lenis.scrollTo(top, {
          duration: Math.min(2.4, Math.max(1.1, 1 + dist / 3200)),
          easing: (t) => 1 - Math.pow(1 - t, 4),
          onComplete: focus,
        })
      } else {
        window.scrollTo({ top, behavior: 'auto' })
        focus()
      }
    },
    [lenis, reduced],
  )

  useEffect(() => {
    scrollToRef.current = scrollTo
  }, [scrollTo])

  const toast = useCallback((msg: string, ms = 4200) => {
    setToastMsg(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(null), ms)
  }, [])

  const triggerBurst = useCallback(() => setBurst((b) => b + 1), [])

  const value = useMemo<GardenState>(
    () => ({
      reduced,
      userReduced,
      setUserReduced,
      lenis,
      scrollTo,
      lockScroll,
      mapOpen,
      setMapOpen,
      projectId,
      openProject: setProjectId,
      blogId,
      openBlog: setBlogId,
      toast,
      toastMsg,
      loaderDone,
      setLoaderDone,
      burst,
      triggerBurst,
    }),
    [
      reduced,
      userReduced,
      setUserReduced,
      lenis,
      scrollTo,
      lockScroll,
      mapOpen,
      projectId,
      blogId,
      toast,
      toastMsg,
      loaderDone,
      burst,
      triggerBurst,
    ],
  )

  return (
    <GardenContext.Provider value={value}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={{ ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </GardenContext.Provider>
  )
}
