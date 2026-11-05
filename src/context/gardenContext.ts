import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export interface GardenState {
  /** Effective reduced-motion flag: system preference OR the in-site toggle. */
  reduced: boolean
  userReduced: boolean
  setUserReduced: (v: boolean) => void
  lenis: Lenis | null
  scrollTo: (id: string, opts?: { focus?: boolean }) => void
  lockScroll: (locked: boolean) => void
  mapOpen: boolean
  setMapOpen: (v: boolean) => void
  projectId: string | null
  openProject: (id: string | null) => void
  blogId: string | null
  openBlog: (id: string | null) => void
  toast: (msg: string, ms?: number) => void
  toastMsg: string | null
  loaderDone: boolean
  setLoaderDone: (v: boolean) => void
  /** Incremented to trigger a celebratory petal burst (Konami code, form success). */
  burst: number
  triggerBurst: () => void
}

export const GardenContext = createContext<GardenState | null>(null)

export function useGarden(): GardenState {
  const ctx = useContext(GardenContext)
  if (!ctx) throw new Error('useGarden must be used inside <GardenProvider>')
  return ctx
}
