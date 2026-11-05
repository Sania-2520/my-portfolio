import { useState } from 'react'
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { GrowthStage } from '../scenes/art/Botanicals'
import { cn } from '../../lib/cn'

const STAGES = [
  { at: 0, label: 'Seed' },
  { at: 0.25, label: 'Sprout' },
  { at: 0.5, label: 'Leaves' },
  { at: 0.75, label: 'Bud' },
  { at: 1, label: 'Bloom' },
] as const

/** Seed → bloom scroll tracker: a slim top line plus a vertical vine rail on large screens. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  const height = useTransform(p, [0, 1], ['0%', '100%'])
  const [stage, setStage] = useState(0)
  const [pct, setPct] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const s = STAGES.reduce((acc, st, i) => (v >= st.at - 0.02 ? i : acc), 0)
    setStage(s)
    setPct(Math.round(v * 100))
  })

  return (
    <>
      <m.div
        aria-hidden
        className="from-moss-500 to-gold-400 fixed inset-x-0 top-0 z-[45] h-[3px] origin-left bg-gradient-to-r via-rose-400"
        style={{ scaleX: p }}
      />
      <div
        className="fixed top-1/2 left-4 z-30 hidden -translate-y-1/2 flex-col items-center xl:flex 2xl:left-6"
        role="progressbar"
        aria-label="Garden walk progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${pct}% · ${STAGES[stage].label}`}
      >
        <div className="relative flex h-[46vh] max-h-[26rem] flex-col items-center justify-between">
          <span className="bg-bark-500/20 absolute inset-y-3 left-1/2 w-px -translate-x-1/2" />
          <m.span
            className="bg-moss-500 absolute top-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full"
            style={{ height }}
          />
          {STAGES.map((st, i) => (
            <span key={st.label} className="group relative z-10 flex items-center">
              <span
                className={cn(
                  'bg-parchment-50 grid size-7 place-items-center rounded-full border transition-all duration-500 ease-(--ease-garden)',
                  i <= stage
                    ? 'border-moss-500/50 scale-100 shadow-[0_0_0_4px_rgb(230_236_217/0.8)]'
                    : 'border-bark-500/25 scale-75 opacity-70',
                )}
              >
                <GrowthStage stage={i as 0 | 1 | 2 | 3 | 4} className="size-5" />
              </span>
              <span className="bg-parchment-50/90 text-bark-700 pointer-events-none absolute left-9 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {st.label} · {st.at * 100}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
