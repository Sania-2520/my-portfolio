import { lazy, startTransition, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { sections, sectionById } from './data/sections'
import { useGarden } from './context/gardenContext'
import { useActiveSection } from './hooks/useActiveSection'
import { useKeyboardShortcut, useKonami } from './hooks/useKeyboardShortcut'
import { setScene } from './lib/audio'
import { SkipLink } from './components/layout/SkipLink'
import { Nav } from './components/layout/Nav'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { Footer } from './components/layout/Footer'
import { Toast } from './components/layout/Toast'
import { Loader } from './components/features/Loader'
import { PetalField } from './components/features/PetalField'
import { QuickContact } from './components/features/QuickContact'
import { Hero } from './components/sections/Hero'

const Walk = lazy(() => import('./components/sections/Walk'))
const GardenMap = lazy(() => import('./components/features/GardenMap'))
const ProjectModal = lazy(() => import('./components/features/ProjectModal'))
const BlogModal = lazy(() => import('./components/features/BlogModal'))

const ids = sections.map((s) => s.id)

export default function App() {
  const { mapOpen, setMapOpen, projectId, blogId, loaderDone, scrollTo, toast, triggerBurst } = useGarden()
  const [walkReady, setWalkReady] = useState(false)
  const [walkDone, setWalkDone] = useState(false)
  const onWalkComplete = useCallback(() => setWalkDone(true), [])
  const active = useActiveSection(ids, walkReady)

  // Render the rest of the garden in an interruptible (non-blocking) transition after first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => startTransition(() => setWalkReady(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  // The soundscape follows the walk.
  useEffect(() => {
    setScene(sectionById[active]?.scene ?? 'gate')
  }, [active])

  useKeyboardShortcut('m', () => setMapOpen(!mapOpen), loaderDone && !projectId && !blogId)
  useKonami(() => {
    triggerBurst()
    toast('A magical tree has grown. The garden is pleased.', 6500)
  })

  // Deep links: walk to #section after the loader lifts.
  useEffect(() => {
    if (!loaderDone) return
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash && sectionById[hash] && hash !== 'home-section') {
      const t = window.setTimeout(() => scrollTo(hash, { focus: false }), 150)
      return () => window.clearTimeout(t)
    }
  }, [loaderDone, scrollTo])

  useEffect(() => {
    console.info('%c// The garden has secrets. Try the Konami code.', 'color:#5b7d3c;font-style:italic')
  }, [])

  return (
    <>
      <SkipLink />
      <Loader />
      <Nav active={active} />
      <ScrollProgress />
      <PetalField />
      <main id="main">
        <Hero />
        {walkReady && (
          <Suspense fallback={<div className="min-h-[200vh]" aria-hidden />}>
            <Walk onComplete={onWalkComplete} />
          </Suspense>
        )}
      </main>
      {walkDone && <Footer />}
      <QuickContact />
      <Toast />

      <Suspense fallback={null}>
        <AnimatePresence>{mapOpen && <GardenMap key="map" active={active} />}</AnimatePresence>
        <AnimatePresence>{projectId && <ProjectModal key={projectId} id={projectId} />}</AnimatePresence>
        <AnimatePresence>{blogId && <BlogModal key={blogId} id={blogId} />}</AnimatePresence>
      </Suspense>
    </>
  )
}
