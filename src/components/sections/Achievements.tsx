import { m } from 'motion/react'
import { Award, Crown, Sprout, Trophy } from 'lucide-react'
import { achievements, achievementsIntro, leadership } from '../../data/achievements'
import { sectionById } from '../../data/sections'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal'
import { Vignette } from '../scenes/Vignette'

const icons = { trophy: Trophy, ribbon: Award }

export function Achievements() {
  const meta = sectionById['achievements-section']
  return (
    <GardenSection id="achievements-section" bg="meadow" vines="both" grass>
      <div className="wrap">
        <SectionHeading
          id="achievements-section"
          number={meta.number}
          garden={meta.garden}
          title={achievementsIntro.title}
          subtitle={achievementsIntro.subtitle}
        />

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-14">
          <Reveal className="mx-auto w-full max-w-sm">
            <Vignette
              name="pavilion"
              alt="A white garden gazebo wrapped in climbing roses with a lantern glowing inside."
              width={412}
              height={468}
              glows={[{ x: 46, y: 30, size: 26 }]}
              sizes="(min-width: 1024px) 380px, 80vw"
            />
          </Reveal>

          <div>
            <RevealGroup className="grid gap-5 sm:grid-cols-2">
              {achievements.map((a) => {
                const Icon = icons[a.icon]
                return (
                  <RevealItem key={a.title}>
                    <m.article
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="card-parchment group relative h-full overflow-hidden p-6 sm:p-7"
                    >
                      <span
                        aria-hidden
                        className="group-hover:animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/70 to-transparent"
                      />
                      <m.span
                        variants={{
                          rest: { rotate: 0, y: 0 },
                          hover: { rotate: [0, -10, 8, 0], y: -3, transition: { duration: 0.6 } },
                        }}
                        className="border-gold-600/30 from-gold-300 to-gold-400 text-bark-900 grid size-14 place-items-center rounded-2xl border bg-gradient-to-b shadow-(--shadow-glow)"
                      >
                        <Icon className="size-7" aria-hidden />
                      </m.span>
                      <h3 className="mt-5 text-[1.3rem] leading-snug font-medium">{a.title}</h3>
                      <p className="eyebrow mt-2 text-[0.66rem] tracking-[0.16em]">{a.meta}</p>
                      <p className="mt-3 leading-relaxed">{a.text}</p>
                    </m.article>
                  </RevealItem>
                )
              })}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-medium">
                <Crown className="text-gold-600 size-5" aria-hidden />
                {achievementsIntro.leadershipTitle}
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {leadership.map((l) => (
                  <li
                    key={l.title}
                    className="border-line rounded-2xl border bg-white/60 p-5 transition-colors hover:bg-white"
                  >
                    <p className="text-muted font-mono text-xs tracking-wide">{l.period}</p>
                    <p className="font-display text-bark-900 mt-1.5 flex items-center gap-2 text-lg">
                      <Sprout className="text-moss-700 size-4" aria-hidden />
                      {l.title}
                    </p>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed">{l.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </GardenSection>
  )
}
