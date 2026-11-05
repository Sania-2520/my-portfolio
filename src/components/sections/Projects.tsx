import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { m, AnimatePresence, animate, type PanInfo, useMotionValue } from 'motion/react'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { projectFilters, projects, projectsIntro } from '../../data/projects'
import { sectionById } from '../../data/sections'
import type { ProjectCategory } from '../../data/types'
import { useGarden } from '../../context/gardenContext'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { ProjectCard } from './ProjectCard'
import { cn } from '../../lib/cn'

const GAP = 24

export function Projects() {
  const meta = sectionById['projects-section']
  const { reduced } = useGarden()
  const [cat, setCat] = useState<'all' | ProjectCategory>('all')
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [vw, setVw] = useState(1200)
  const viewport = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      const inCat = cat === 'all' || p.categories.includes(cat)
      const hay = `${p.title} ${p.description} ${p.tags.join(' ')} ${p.categories.join(' ')}`.toLowerCase()
      return inCat && (!q || hay.includes(q))
    })
  }, [cat, query])

  const safeIndex = Math.min(index, Math.max(0, list.length - 1))
  const cardW =
    vw < 640 ? Math.min(vw - 40, 420) : vw < 1024 ? Math.min(vw * 0.56, 440) : Math.min(410, vw * 0.34)
  const target = vw / 2 - cardW / 2 - safeIndex * (cardW + GAP)

  useLayoutEffect(() => {
    const el = viewport.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setVw(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const c = animate(
      x,
      target,
      reduced ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 32, mass: 0.9 },
    )
    return () => c.stop()
  }, [target, x, reduced])

  const go = (i: number) => setIndex(Math.max(0, Math.min(list.length - 1, i)))
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.25
    const steps = Math.round(-swipe / (cardW * 0.6))
    if (steps === 0) animate(x, target, { type: 'spring', stiffness: 260, damping: 30 })
    else go(safeIndex + Math.max(-2, Math.min(2, steps)))
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(safeIndex + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(safeIndex - 1)
    }
  }

  return (
    <GardenSection id="projects-section" bg="meadow" vines="both" grass>
      <div className="wrap">
        <SectionHeading
          id="projects-section"
          number={meta.number}
          garden={meta.garden}
          title={projectsIntro.title}
          subtitle={projectsIntro.subtitle}
        />

        <Reveal className="mb-8 flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <div
            role="group"
            aria-label="Filter projects by category"
            className="border-line bg-parchment-50/80 flex flex-wrap justify-center gap-2 rounded-full border p-1.5"
          >
            {projectFilters.map((f) => {
              const on = cat === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setCat(f.id)
                    setIndex(0)
                  }}
                  className={cn(
                    'relative min-h-10 rounded-full px-4 text-sm font-semibold transition-colors',
                    on ? 'text-parchment-50' : 'text-bark-700 hover:text-moss-800',
                  )}
                >
                  {on && (
                    <m.span
                      layoutId="filter-pill"
                      className="bg-moss-800 absolute inset-0 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              )
            })}
          </div>
          <label className="relative w-full max-w-xs">
            <span className="sr-only">Search projects</span>
            <Search
              className="text-muted pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIndex(0)
              }}
              placeholder={projectsIntro.searchPlaceholder}
              className="field rounded-full pr-10 pl-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="text-muted hover:text-bark-900 absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-full"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </label>
        </Reveal>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKey}
        className="relative outline-offset-[-3px]"
      >
        <p className="sr-only" aria-live="polite">
          {list.length
            ? `Showing ${list[safeIndex]?.title}, ${safeIndex + 1} of ${list.length}`
            : 'No projects match'}
        </p>
        <div ref={viewport} className="overflow-hidden py-6">
          {list.length === 0 ? (
            <div className="wrap">
              <p className="card-parchment mx-auto max-w-md p-8 text-center">
                No blooms match “{query}”.{' '}
                <button
                  type="button"
                  className="text-moss-800 font-semibold underline underline-offset-4"
                  onClick={() => {
                    setQuery('')
                    setCat('all')
                  }}
                >
                  Show all projects
                </button>
              </p>
            </div>
          ) : (
            <m.div
              className="flex items-stretch"
              style={{ x, gap: GAP }}
              drag="x"
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={onDragEnd}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={i}
                    total={list.length}
                    active={i === safeIndex}
                    width={cardW}
                    onSelect={() => go(i)}
                  />
                ))}
              </AnimatePresence>
            </m.div>
          )}
        </div>

        {list.length > 1 && (
          <div className="wrap mt-4 flex items-center justify-center gap-5">
            <CarouselArrow dir="prev" disabled={safeIndex === 0} onClick={() => go(safeIndex - 1)} />
            <div className="flex items-center gap-1">
              {list.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${p.title}`}
                  aria-current={i === safeIndex ? 'true' : undefined}
                  className="grid size-8 place-items-center rounded-full"
                >
                  <span
                    className={cn(
                      'block h-2 rounded-full transition-all duration-500 ease-(--ease-garden)',
                      i === safeIndex ? 'bg-moss-700 w-7' : 'bg-bark-500/35 w-2',
                    )}
                  />
                </button>
              ))}
            </div>
            <CarouselArrow
              dir="next"
              disabled={safeIndex === list.length - 1}
              onClick={() => go(safeIndex + 1)}
            />
          </div>
        )}
      </div>
    </GardenSection>
  )
}

function CarouselArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  return (
    <m.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
      className="border-bark-500/30 bg-parchment-50 text-bark-900 grid size-12 place-items-center rounded-full border shadow-(--shadow-leaf) transition-opacity disabled:opacity-40"
    >
      <Icon className="size-5" aria-hidden />
    </m.button>
  )
}
