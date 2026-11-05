import { m } from 'motion/react'
import { MapPin } from 'lucide-react'
import { sections } from '../../data/sections'
import { useGarden } from '../../context/gardenContext'
import { Modal } from '../ui/Modal'
import { Scene } from '../scenes/Scene'
import { GardenFallback } from '../scenes/art/GardenFallback'
import { cn } from '../../lib/cn'

/** Stop positions as % of the map artwork, following the winding path. */
const STOPS: Record<string, { x: number; y: number }> = {
  'home-section': { x: 21.5, y: 32 },
  'about-section': { x: 85, y: 24 },
  'skills-section': { x: 54.5, y: 49 },
  'projects-section': { x: 28, y: 63.5 },
  'academics-section': { x: 85, y: 65 },
  'research-section': { x: 67, y: 57 },
  'achievements-section': { x: 34, y: 83 },
  'blogs-section': { x: 47, y: 73 },
  'contact-section': { x: 82, y: 85 },
}

export default function GardenMap({ active }: { active: string }) {
  const { setMapOpen, scrollTo } = useGarden()
  const visit = (id: string) => {
    setMapOpen(false)
    // Queued by the provider until the dialog has closed and released the scroll lock.
    scrollTo(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <Modal
      labelledBy="garden-map-title"
      onClose={() => setMapOpen(false)}
      className="sm:max-w-5xl"
      closeLabel="Close the garden map"
    >
      <div className="px-4 pt-6 pb-6 sm:px-8 sm:pt-8">
        <div className="text-center">
          <h2
            id="garden-map-title"
            className="font-display text-bark-900 text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)] italic"
          >
            The Garden Map
          </h2>
          <p className="text-bark-700 mt-1">Explore different corners of my journey</p>
          <p className="text-muted mt-1 hidden font-mono text-xs sm:block">Press M · Esc to close</p>
        </div>

        <nav aria-label="Garden map stops" className="relative mx-auto mt-5 max-w-4xl">
          <div
            className="border-bark-500/25 relative overflow-hidden rounded-2xl border shadow-(--shadow-leaf)"
            style={{ aspectRatio: '944 / 652' }}
          >
            <Scene
              name="map"
              alt=""
              sizes="(min-width: 1024px) 900px, 96vw"
              width={944}
              height={652}
              className="absolute inset-0"
              imgClassName="object-cover"
              fallback={<GardenFallback className="absolute inset-0 h-full w-full" />}
            />
            <m.ol
              className="absolute inset-0"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
            >
              {sections.map((s, i) => {
                const pos = STOPS[s.id]
                const here = s.id === active
                return (
                  <m.li
                    key={s.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.6 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: 'spring', stiffness: 300, damping: 18 },
                      },
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => visit(s.id)}
                      aria-current={here ? 'location' : undefined}
                      className="group flex flex-col items-center"
                    >
                      <span
                        className={cn(
                          'relative grid size-8 place-items-center rounded-full border-2 font-mono text-[0.7rem] font-bold shadow-md transition-transform duration-300 group-hover:scale-110 sm:size-7',
                          here
                            ? 'border-parchment-50 bg-rose-500 text-white'
                            : 'border-parchment-50 bg-moss-800 text-parchment-50',
                        )}
                      >
                        {here && (
                          <span
                            className="absolute inset-0 rounded-full bg-rose-400 motion-safe:animate-ping"
                            aria-hidden
                          />
                        )}
                        <span className="relative">{i + 1}</span>
                      </span>
                      <span className="border-bark-500/25 bg-parchment-50/95 mt-1 hidden rounded-full border px-2.5 py-1 text-center leading-tight shadow-sm transition-colors group-hover:bg-white md:block">
                        <span className="font-display text-bark-900 block text-[0.85rem] whitespace-nowrap">
                          {s.garden}
                        </span>
                        <span className="text-muted block text-[0.68rem]">
                          ({s.plain}){here ? ' · You are here' : ''}
                        </span>
                      </span>
                      <span className="sr-only md:hidden">
                        {s.garden} ({s.plain}){here ? ', you are here' : ''}
                      </span>
                    </button>
                  </m.li>
                )
              })}
            </m.ol>
          </div>

          {/* Compact list for small screens, where labels on the map would collide. */}
          <ol className="xs:grid-cols-2 mt-4 grid grid-cols-1 gap-1.5 md:hidden" aria-hidden>
            {sections.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => visit(s.id)}
                  className={cn(
                    'flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-left',
                    s.id === active ? 'bg-blush-100' : 'hover:bg-blush-100/60',
                  )}
                >
                  <span className="bg-moss-800 text-parchment-50 grid size-6 shrink-0 place-items-center rounded-full font-mono text-[0.65rem] font-bold">
                    {i + 1}
                  </span>
                  <span className="font-display text-bark-900 text-[0.95rem]">{s.garden}</span>
                  {s.id === active && <MapPin className="ml-auto size-4 text-rose-500" />}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </Modal>
  )
}
