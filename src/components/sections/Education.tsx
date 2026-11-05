import { useRef } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import { GraduationCap } from 'lucide-react'
import { education, educationIntro } from '../../data/education'
import { sectionById } from '../../data/sections'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Vignette } from '../scenes/Vignette'
import { EASE } from '../../lib/motion'
import { cn } from '../../lib/cn'

function BloomNode({ current }: { current?: boolean }) {
  return (
    <m.span
      className="border-parchment-50 bg-moss-100 absolute top-6 left-0 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full border-2 shadow-(--shadow-leaf)"
      initial={{ scale: 0.4, rotate: -40 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '0px 0px -35% 0px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-6">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse
            key={r}
            cx="12"
            cy="7"
            rx="3"
            ry="4.4"
            fill={current ? '#e58fae' : '#f0b9c7'}
            transform={`rotate(${r} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="2.4" fill="#ebd08e" />
      </svg>
    </m.span>
  )
}

export function Education() {
  const meta = sectionById['academics-section']
  const line = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: line, offset: ['start 75%', 'end 55%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <GardenSection id="academics-section" bg="parchment" vines="left" grass>
      <div className="wrap">
        <SectionHeading
          id="academics-section"
          number={meta.number}
          garden={meta.garden}
          title={educationIntro.title}
          subtitle={educationIntro.subtitle}
        />
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-lg lg:sticky lg:top-28">
            <Vignette
              name="cottage"
              alt="A stone cottage with glowing windows and a lantern, a laptop, a mug and books on a garden table among blossoms."
              width={592}
              height={468}
              glows={[
                { x: 43, y: 42, size: 20 },
                { x: 26, y: 40, size: 18 },
                { x: 70, y: 40, size: 16 },
              ]}
              sizes="(min-width: 1024px) 520px, 92vw"
            />
          </Reveal>

          <ol ref={line} className="relative ml-4 space-y-8 sm:ml-6">
            {/* Vine line: draws itself as you scroll */}
            <span
              aria-hidden
              className="bg-bark-500/15 absolute top-2 bottom-2 left-0 w-[3px] -translate-x-1/2 rounded-full"
            />
            <m.span
              aria-hidden
              className="from-moss-500 via-moss-700 absolute top-2 bottom-2 left-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b to-rose-400"
              style={{ scaleY: grow }}
            />
            {education.map((e, i) => (
              <m.li
                key={e.title}
                className="relative pl-7 min-[26rem]:pl-10 sm:pl-12"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
              >
                <BloomNode current={e.current} />
                <article
                  className={cn(
                    'card-parchment p-5 min-[26rem]:p-6 sm:p-7',
                    e.current && 'ring-moss-500/30 ring-1',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {e.badge && (
                      <span className="bg-moss-800 text-parchment-50 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.12em]">
                        <GraduationCap className="size-3.5" aria-hidden />
                        {e.badge}
                      </span>
                    )}
                    <span className="text-muted font-mono text-[0.8rem]">{e.period}</span>
                  </div>
                  <h3 className="mt-3 text-[1.4rem] font-medium sm:text-[1.55rem]">{e.title}</h3>
                  {e.subtitle && <p className="text-moss-800 mt-1.5 font-semibold">{e.subtitle}</p>}
                  <p className="mt-3 leading-relaxed">{e.description}</p>
                </article>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
    </GardenSection>
  )
}
