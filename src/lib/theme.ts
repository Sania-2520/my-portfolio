import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'garden-theme'
const META: Record<Theme, string> = { light: '#FCE9E4', dark: '#190B1A' }
const listeners = new Set<() => void>()

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function apply(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[theme])
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme)
  listeners.forEach((l) => l())
}

type VT = { ready: Promise<void> }
type DocVT = Document & { startViewTransition?: (cb: () => void) => VT }

/** Switches the theme. With an origin, the new theme blooms outward from that point. */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  try {
    window.localStorage.setItem(KEY, theme)
  } catch {
    /* storage unavailable: the choice simply won't persist */
  }
  const reduce =
    document.documentElement.classList.contains('reduce-motion') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as DocVT
  if (!doc.startViewTransition || reduce || !origin) {
    apply(theme)
    return
  }
  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const vt = doc.startViewTransition(() => apply(theme))
  vt.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 750,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    .catch(() => undefined)
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => 'light')
}
