import { useState } from 'react'
import { m } from 'motion/react'
import { skills } from '../../data/skills'
import { sectionById } from '../../data/sections'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Pot } from '../scenes/art/Botanicals'
import { SkillIcon } from './skillIcons'
import { EASE, spring } from '../../lib/motion'
import { cn } from '../../lib/cn'

function HangingPlant({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 60 130"
      className={cn('motion-safe:animate-sway', className)}
      style={{ animationDelay: `${delay}s`, transformOrigin: '30px 0' }}
      aria-hidden
    >
      <path d="M30 0v54M30 54 14 66M30 54l16 12M30 54v12" stroke="#8a6650" strokeWidth="1.4" fill="none" />
      <path d="M12 66h36l-4 18H16Z" fill="#d98a63" />
      <path
        d="M14 70c-6 14-4 34 2 52M24 76c-2 14 0 30 4 44M40 74c6 12 6 28 0 42M46 70c6 10 8 22 4 34"
        stroke="#6a8a4a"
        strokeWidth="1.6"
        fill="none"
      />
      {[
        [14, 86],
        [16, 104],
        [26, 94],
        [28, 114],
        [42, 90],
        [40, 108],
        [48, 84],
        [50, 98],
        [17, 120],
      ].map(([x, y], i) => (
        <path
          key={i}
          d="M0 0c3-5 9-6 12-4-2 5-7 7-12 4Z"
          fill={i % 2 ? '#8aa76a' : '#6a8a4a'}
          transform={`translate(${x} ${y}) rotate(${i * 40})`}
        />
      ))}
      <circle cx="26" cy="64" r="3.4" fill="#f0b9c7" />
      <circle cx="38" cy="63" r="2.8" fill="#e58fae" />
    </svg>
  )
}

function SkillPot({ name, icon }: { name: string; icon: string }) {
  const [watered, setWatered] = useState(false)
  const [hover, setHover] = useState(false)
  const grown = watered || hover
  return (
    <m.li
      className="xs:basis-1/4 relative flex basis-1/3 justify-center px-1.5 sm:basis-auto sm:px-4"
      variants={{
        hidden: { opacity: 0, y: 26, scale: 0.92 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {/* Shelf plank segment (segments meet seamlessly across a row) */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-[calc(var(--pot)*0.94)] h-3.5 bg-gradient-to-b from-[#c9a27c] to-[#9c7350] shadow-[0_10px_12px_-8px_rgb(91_56_37/0.55)]"
      />
      <m.button
        type="button"
        aria-pressed={watered}
        aria-label={`${name}. ${watered ? 'Watered and blooming' : 'Water this plant'}`}
        onClick={() => setWatered((w) => !w)}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group relative flex w-full max-w-28 flex-col items-center rounded-2xl pb-1"
      >
        <m.span animate={{ y: grown ? -10 : 0 }} transition={spring} className="relative block w-(--pot)">
          <Pot grown={grown} className="w-full drop-shadow-[0_8px_8px_rgb(91_56_37/0.22)]" />
          <span className="bg-parchment-50 absolute bottom-[12%] left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-white/70 shadow-sm sm:size-10">
            <SkillIcon icon={icon} className="text-moss-800 size-5 sm:size-[1.35rem]" />
          </span>
        </m.span>
        <span className="text-bark-900 mt-5 text-center text-[0.82rem] leading-tight font-semibold sm:text-sm">
          {name}
        </span>
      </m.button>
    </m.li>
  )
}

export function Skills() {
  const meta = sectionById['skills-section']
  return (
    <GardenSection id="skills-section" bg="parchment" vines="left">
      <div className="wrap">
        <SectionHeading
          id="skills-section"
          number={meta.number}
          garden={meta.garden}
          title={skills.title}
          subtitle={skills.subtitle}
        />

        <Reveal className="relative mx-auto max-w-6xl">
          {/* Glasshouse */}
          <div className="border-moss-700/45 relative overflow-hidden rounded-t-[min(12rem,30vw)] rounded-b-[1.75rem] border-[3px] bg-[linear-gradient(180deg,rgb(236_244_240/0.85),rgb(252_244_238/0.9)_45%,rgb(251_245_233/0.95))] px-3 pt-24 pb-6 shadow-(--shadow-bloom) sm:px-8 sm:pt-32 lg:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent 0 calc(16.66% - 2px), rgb(62 90 43 / 0.16) calc(16.66% - 2px) 16.66%), linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.55) 42%, transparent 52%)',
              }}
            />
            <div
              aria-hidden
              className="bg-moss-700/20 pointer-events-none absolute inset-x-[8%] top-[18%] h-px"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 flex justify-around px-[12%]"
            >
              <HangingPlant className="h-24 w-12 sm:h-32 sm:w-16" />
              <HangingPlant className="hidden h-28 w-14 sm:block sm:h-36 sm:w-16" delay={-2} />
              <HangingPlant className="h-24 w-12 sm:h-32 sm:w-16" delay={-4} />
            </div>

            <div className="relative space-y-8 sm:space-y-10">
              {skills.groups.map((g) => (
                <div key={g.label}>
                  <div className="mb-4 flex justify-center">
                    <span className="border-bark-500/30 bg-parchment-50 text-bark-700 rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.14em] uppercase shadow-sm">
                      {g.label}
                    </span>
                  </div>
                  <m.ul
                    aria-label={g.label}
                    className="relative z-10 mx-auto flex max-w-4xl flex-wrap justify-center gap-y-6 [--pot:4.6rem] sm:[--pot:5.75rem]"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  >
                    {g.items.map((s) => (
                      <SkillPot key={s.name} name={s.name} icon={s.icon} />
                    ))}
                  </m.ul>
                </div>
              ))}
            </div>
          </div>
          <p className="text-muted mt-4 text-center text-sm">Hover, focus or tap a pot to water it.</p>
        </Reveal>
      </div>
    </GardenSection>
  )
}
