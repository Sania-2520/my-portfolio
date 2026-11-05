import { ArrowRight, FileText, MapPin } from 'lucide-react'
import { profile } from '../../data/profile'
import { useGarden } from '../../context/gardenContext'
import { useTypewriter } from '../../hooks/useTypewriter'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Flower, VineCorner } from '../scenes/art/Botanicals'
import photo320 from '../../assets/profile/sania-320.webp'
import photo640 from '../../assets/profile/sania-640.webp'
import photoAvif320 from '../../assets/profile/sania-320.avif'
import photoAvif640 from '../../assets/profile/sania-640.avif'

/** Second hero beat: the legacy hero facts, presented as the garden-gate plaque. */
export function Intro() {
  const { reduced, scrollTo } = useGarden()
  const typed = useTypewriter(profile.intro.typed, !reduced)
  const i = profile.intro

  return (
    <div className="relative z-10 -mt-10 pb-16 sm:-mt-16 lg:-mt-24 lg:pb-24">
      <div className="wrap">
        <Reveal className="relative">
          {/* Hanging wooden sign */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-9 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center md:flex"
          >
            <div className="flex w-56 justify-between px-10">
              <span className="bg-bark-600/60 h-6 w-px" />
              <span className="bg-bark-600/60 h-6 w-px" />
            </div>
            <div className="border-bark-800/30 font-display text-sign motion-safe:animate-sway rounded-lg border bg-gradient-to-b from-[#c9a27c] to-[#a97f5b] px-5 py-1.5 text-sm italic shadow-md">
              {i.welcome}
            </div>
          </div>

          <article
            aria-labelledby="intro-title"
            className="card-parchment overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14"
          >
            <VineCorner className="pointer-events-none absolute -top-2 -right-2 w-48 -scale-x-100 opacity-70 sm:w-64" />
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
              {/* Plaque + portrait */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div
                    className="border-gold-400/50 absolute -inset-3 rounded-t-[999px] rounded-b-[2rem] border"
                    aria-hidden
                  />
                  <div className="border-parchment-50 relative h-64 w-52 overflow-hidden rounded-t-[999px] rounded-b-[1.6rem] border-4 shadow-(--shadow-bloom) sm:h-72 sm:w-60">
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`${photoAvif320} 320w, ${photoAvif640} 640w`}
                        sizes="240px"
                      />
                      <img
                        src={photo640}
                        srcSet={`${photo320} 320w, ${photo640} 640w`}
                        sizes="240px"
                        alt="Portrait of Sania S Kotharkar"
                        width={240}
                        height={288}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-[50%_25%]"
                      />
                    </picture>
                  </div>
                  <Flower color="#e58fae" className="absolute -bottom-3 -left-4 size-11 drop-shadow" />
                  <Flower color="#f0b9c7" className="absolute -right-3 bottom-6 size-8 drop-shadow" />
                </div>
                <div className="border-gold-600/30 from-gold-300 mt-7 rounded-xl border bg-gradient-to-b to-[#cfa856] px-6 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_6px_16px_-8px_rgb(91_56_37/0.5)]">
                  <p className="font-display text-sign text-xl italic">{profile.name}</p>
                  <p className="text-sign text-[0.8rem] font-semibold">{profile.role}</p>
                </div>
                <p className="text-muted mt-4 inline-flex items-center gap-1.5 text-sm">
                  <MapPin className="size-4 text-rose-500" aria-hidden />
                  <span>
                    Location Node: <span className="text-bark-700 font-semibold">{profile.location}</span>
                  </span>
                </p>
              </div>

              {/* Story */}
              <div>
                <p className="eyebrow mb-4 text-[0.68rem] tracking-[0.24em]">{i.eyebrow}</p>
                <h2
                  id="intro-title"
                  className="text-[clamp(2.1rem,1.3rem+3vw,3.6rem)] font-medium tracking-[-0.015em]"
                >
                  {i.titleLine1} <em className="font-normal text-rose-700">{i.titleEmphasis}</em>
                  <span className="from-moss-800 via-moss-700 to-bark-700 block bg-gradient-to-r bg-clip-text text-transparent">
                    {i.titleLine2}
                  </span>
                </h2>
                <p className="font-display text-bark-800 mt-6 text-[clamp(1.25rem,1rem+0.8vw,1.6rem)]">
                  <span className="sr-only">
                    “{i.taglinePrefix} {i.typed.join(', ')}”
                  </span>
                  <span aria-hidden>
                    “{i.taglinePrefix} <span className="text-moss-700 italic">{typed}</span>
                    <span className="bg-moss-700 ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-1 motion-safe:animate-pulse" />
                    ”
                  </span>
                </p>
                <p className="mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed">{i.lead}</p>
                <div className="xs:flex-row mt-8 flex flex-col gap-3">
                  <Button
                    icon={<ArrowRight className="size-4.5" />}
                    onClick={() => scrollTo('projects-section')}
                  >
                    {i.ctaProjects}
                  </Button>
                  <Button
                    variant="secondary"
                    href={`${import.meta.env.BASE_URL}${profile.resume}`}
                    target="_blank"
                    icon={<FileText className="text-moss-800 size-4.5" />}
                  >
                    {i.ctaResume}
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  )
}
