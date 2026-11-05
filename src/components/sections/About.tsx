import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { BrainCircuit, ChevronDown, FileCode2, FlaskConical, Puzzle, Server } from 'lucide-react'
import { gardenFacts, profile } from '../../data/profile'
import { sectionById } from '../../data/sections'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { Vignette } from '../scenes/Vignette'
import { Flower } from '../scenes/art/Botanicals'
import { YamlManifest } from './YamlManifest'
import { EASE } from '../../lib/motion'

const chipIcons = [BrainCircuit, Server, FlaskConical, Puzzle]

export function About() {
  const meta = sectionById['about-section']
  const a = profile.about
  const [open, setOpen] = useState(false)

  return (
    <GardenSection id="about-section" bg="meadow" vines="right" grass>
      <div className="wrap">
        <SectionHeading
          id="about-section"
          number={meta.number}
          garden={meta.garden}
          title={a.title}
          subtitle={a.subtitle}
        />

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-14">
          {/* Scene: bench beneath the blossom tree */}
          <Reveal className="relative mx-auto w-full max-w-md lg:sticky lg:top-28">
            <Vignette
              name="grove"
              alt="A wooden bench under a blossoming tree with a lantern, books, a mug and a soft blanket."
              width={400}
              height={556}
              glows={[{ x: 49, y: 30, size: 30 }]}
              sizes="(min-width: 1024px) 440px, 90vw"
            />
            <div className="border-bark-800/20 font-display text-bark-900 absolute -bottom-4 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border bg-gradient-to-b from-[#c9a27c] to-[#ad8461] px-5 py-3 text-center text-[1.05rem] italic shadow-(--shadow-leaf)">
              {a.signText}
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal className="card-parchment p-6 sm:p-8">
              <h3 className="mb-4 flex items-center gap-2.5 text-2xl font-medium">
                <Flower color="#e58fae" className="size-6" />
                {a.missionTitle}
              </h3>
              {a.mission.map((p) => (
                <p key={p.slice(0, 20)} className="text-[1.05rem] leading-relaxed">
                  {p}
                </p>
              ))}
              <p className="mt-4 text-[1.05rem] leading-relaxed">
                {a.mantexia.before} <strong className="text-moss-800 font-semibold">{a.mantexia.org}</strong>
                {a.mantexia.after}
              </p>

              <RevealGroup className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {a.chips.map((chip, idx) => {
                  const Icon = chipIcons[idx]
                  return (
                    <RevealItem key={chip}>
                      <m.div
                        whileHover={{ y: -4 }}
                        className="border-line flex h-full flex-col items-center gap-2 rounded-2xl border bg-white/60 px-3 py-4 text-center"
                      >
                        <span className="bg-blush-100 grid size-10 place-items-center rounded-full text-rose-700">
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <span className="text-bark-800 text-sm font-semibold">{chip}</span>
                      </m.div>
                    </RevealItem>
                  )
                })}
              </RevealGroup>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="garden-facts"
                className="group bg-blush-100 hover:bg-blush-200 mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-400/40 px-5 font-semibold text-rose-700 transition-colors"
              >
                {open ? 'Show Less' : 'Know More'}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <m.div
                    id="garden-facts"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: { duration: 0.5, ease: EASE } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
                    className="overflow-hidden"
                  >
                    <ul className="border-line mt-5 space-y-2.5 border-t pt-5">
                      {gardenFacts.map((f, i) => (
                        <m.li
                          key={f}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0, transition: { delay: 0.05 * i } }}
                          className="flex gap-3 text-[0.98rem]"
                        >
                          <span
                            className="bg-moss-500 mt-2 size-1.5 shrink-0 rotate-45 rounded-[1px]"
                            aria-hidden
                          />
                          {f}
                        </m.li>
                      ))}
                    </ul>
                  </m.div>
                )}
              </AnimatePresence>
            </Reveal>

            <Reveal delay={0.08}>
              <YamlManifest icon={<FileCode2 className="size-4" aria-hidden />} />
            </Reveal>
          </div>
        </div>
      </div>
    </GardenSection>
  )
}
