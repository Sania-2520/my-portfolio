import { Code2, FileClock, ShieldCheck } from 'lucide-react'
import { research } from '../../data/research'
import { sectionById } from '../../data/sections'
import { useGarden } from '../../context/gardenContext'
import { GardenSection } from '../ui/GardenSection'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { Vignette } from '../scenes/Vignette'

export function Research() {
  const meta = sectionById['research-section']
  const { scrollTo } = useGarden()
  return (
    <GardenSection id="research-section" bg="blush" vines="right" className="pt-12 sm:pt-16 lg:pt-20">
      <div className="wrap">
        <SectionHeading
          id="research-section"
          number={meta.number}
          garden={meta.garden}
          title={research.title}
          subtitle={research.subtitle}
        />
        {research.items.map((r) => (
          <Reveal key={r.title} className="mx-auto max-w-5xl">
            <article className="card-parchment grid overflow-hidden lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
              <div className="bg-blush-100/60 relative h-56 sm:h-64 lg:h-auto lg:min-h-72">
                <Vignette
                  name="desk"
                  alt="A laptop, a mug and a stack of books on a wooden garden desk."
                  width={520}
                  height={192}
                  feather="soft"
                  parallax={16}
                  className="absolute inset-0 [aspect-ratio:auto]! h-full w-full"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
              </div>
              <div className="p-6 sm:p-9">
                <div className="flex items-center gap-4">
                  <span className="bg-moss-800 text-parchment-50 grid size-12 shrink-0 place-items-center rounded-2xl shadow-(--shadow-leaf)">
                    <ShieldCheck className="size-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[1.5rem] font-medium sm:text-[1.7rem]">{r.title}</h3>
                    <p className="eyebrow mt-1 text-[0.68rem]">{r.area}</p>
                  </div>
                </div>
                <p className="mt-5 text-[1.05rem] leading-relaxed">{r.text}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    iconLeft={<Code2 className="size-4.5" />}
                    onClick={() => scrollTo(r.codeTarget)}
                  >
                    {r.codeLabel}
                  </Button>
                  <span className="border-bark-500/40 text-muted inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed px-4 text-sm font-medium">
                    <FileClock className="size-4" aria-hidden />
                    {r.paperLabel}
                    <span className="sr-only">(not yet published)</span>
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </GardenSection>
  )
}
