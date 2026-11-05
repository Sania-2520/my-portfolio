import { useRef } from 'react'
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Map } from 'lucide-react'
import { profile } from '../../data/profile'
import { useGarden } from '../../context/gardenContext'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { getSceneArt, largest, srcset } from '../scenes/sceneArt'
import { GardenFallback } from '../scenes/art/GardenFallback'
import { Butterfly, Sprig } from '../scenes/art/Botanicals'
import { Button } from '../ui/Button'
import { EASE } from '../../lib/motion'

/** Lantern glows, as % of the artwork (wide art and the portrait crop). */
const LANTERNS = [
  { x: 14.2, y: 41, s: 9 },
  { x: 47.9, y: 43.5, s: 8 },
  { x: 22.9, y: 41, s: 14, portrait: true },
  { x: 77, y: 43.5, s: 13, portrait: true },
]

const HERO_ALT =
  'A stone garden gate draped in pink bougainvillea, with glowing lanterns, a brass plaque reading Sania S. Kotharkar, AI/ML Engineer, a winding stone path, a lily pond and a gazebo in soft morning light.'

/** Art-directed hero: a portrait crop centred on the gate for tall screens, the full scene elsewhere. */
function HeroArt() {
  const wide = getSceneArt('gate')
  const tall = getSceneArt('gate-portrait')
  if (!wide) return <GardenFallback className="h-full w-full" />
  return (
    <picture className="block h-full w-full">
      {tall && (
        <source
          media="(max-aspect-ratio: 1)"
          type="image/avif"
          srcSet={srcset(tall.avif)}
          sizes="max(111vh, 100vw)"
        />
      )}
      {tall && (
        <source
          media="(max-aspect-ratio: 1)"
          type="image/webp"
          srcSet={srcset(tall.webp)}
          sizes="max(111vh, 100vw)"
        />
      )}
      <source type="image/avif" srcSet={srcset(wide.avif)} sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" />
      <source type="image/webp" srcSet={srcset(wide.webp)} sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" />
      <img
        src={largest(wide).url}
        alt={HERO_ALT}
        width={1672}
        height={941}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="block h-full w-full"
      />
    </picture>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced, loaderDone, scrollTo, setMapOpen } = useGarden()
  const fine = useFinePointer()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const artY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '16%'])
  const artScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.02, 1.1])
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -110])
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const fgY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -70])

  // Subtle pointer-follow tilt on desktop.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const tiltX = useSpring(px, { stiffness: 60, damping: 18 })
  const tiltY = useSpring(py, { stiffness: 60, damping: 18 })
  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduced) return
    px.set((e.clientX / window.innerWidth - 0.5) * -16)
    py.set((e.clientY / window.innerHeight - 0.5) * -10)
  }

  const show = loaderDone
  const line = (delay: number) => ({
    initial: { opacity: 0, y: 34, filter: 'blur(6px)' },
    animate: show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  })

  return (
    <section id="home-section" aria-labelledby="hero-title" className="relative">
      <div
        ref={ref}
        onPointerMove={onMove}
        className="bg-blush-100 relative h-[100svh] min-h-[600px] overflow-hidden"
      >
        {/* Background artwork: positioned like object-fit: cover, so lantern glows stay pinned to the art. */}
        <m.div className="absolute inset-0" style={{ x: tiltX, y: tiltY }}>
          <m.div
            data-hero-art
            className="hero-stage will-change-transform"
            style={{ y: artY, scale: artScale }}
          >
            <HeroArt />
            {LANTERNS.map((l, i) => (
              <span
                key={i}
                aria-hidden
                className={`motion-safe:animate-flicker absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen ${l.portrait ? 'portrait-only' : 'landscape-only'}`}
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  width: `${l.s}%`,
                  aspectRatio: '1',
                  background:
                    'radial-gradient(circle, rgb(255 222 150 / 0.7), rgb(255 200 120 / 0.22) 42%, transparent 68%)',
                  animationDelay: `${i * -1.4}s`,
                }}
              />
            ))}
          </m.div>
        </m.div>

        {/* Legibility washes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] lg:hidden"
          style={{
            background:
              'radial-gradient(90% 60% at 50% 72%, var(--hero-wash-1), var(--hero-wash-2) 60%, transparent 85%)',
          }}
        />
        <div
          aria-hidden
          className="from-blush-50/70 pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent"
        />
        <div
          aria-hidden
          className="from-blush-50 via-blush-50/85 lg:via-blush-50/40 pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t to-transparent lg:h-56"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[8%] right-[-6%] hidden h-[78%] w-[58%] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, var(--hero-glow-1), var(--hero-glow-2) 55%, transparent)',
          }}
        />

        <m.div
          aria-hidden
          className="pointer-events-none absolute top-[22%] right-[30%] hidden lg:block"
          style={{ y: fgY }}
        >
          <Butterfly color="#e58fae" className="motion-safe:animate-float size-10" />
        </m.div>

        {/* Copy */}
        <m.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute inset-x-0 bottom-[max(5.5rem,10svh)] z-10 px-5 text-center sm:px-10 lg:inset-x-auto lg:top-[15vh] lg:right-[max(3rem,6vw)] lg:bottom-auto lg:w-[min(40rem,42vw)] lg:px-0"
        >
          <m.p {...line(0.1)} className="eyebrow text-bark-800 mb-4 tracking-[0.5em] lg:mb-6">
            {profile.hero.eyebrow}
          </m.p>
          <h1
            id="hero-title"
            className="font-display text-bark-800 leading-[0.95] font-normal tracking-[-0.02em]"
          >
            <m.span {...line(0.22)} className="block text-[clamp(3.1rem,1.6rem+6.2vw,7rem)]">
              <span className="italic">The</span> Garden
            </m.span>
            <m.span
              {...line(0.36)}
              className="flex items-center justify-center gap-3 text-[clamp(3.1rem,1.6rem+6.2vw,7rem)]"
            >
              <span>
                <span className="italic">of</span> Ideas
              </span>
              <Sprig className="text-moss-500 hidden h-12 w-16 sm:block lg:h-16 lg:w-20" />
            </m.span>
          </h1>
          <m.p
            {...line(0.5)}
            className="text-bark-800 mx-auto mt-5 max-w-md text-[clamp(1.02rem,0.9rem+0.5vw,1.3rem)] leading-relaxed tracking-[0.02em] lg:mt-7"
          >
            {profile.hero.tagline}
          </m.p>
          <m.div
            {...line(0.64)}
            className="xs:flex-row mt-7 flex flex-col items-center justify-center gap-3 lg:mt-9"
          >
            <Button
              magnetic
              icon={<ArrowRight className="size-4.5" />}
              onClick={() => scrollTo('about-section')}
              className="xs:w-auto w-full"
            >
              {profile.hero.primaryCta}
            </Button>
            <Button
              variant="secondary"
              iconLeft={<Map className="text-moss-800 size-4.5" />}
              onClick={() => setMapOpen(true)}
              aria-haspopup="dialog"
              className="xs:w-auto w-full"
            >
              {profile.hero.secondaryCta}
            </Button>
          </m.div>
        </m.div>

        {/* Scroll cue */}
        <m.button
          type="button"
          onClick={() => scrollTo('about-section')}
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="font-display text-bark-800 absolute bottom-4 left-1/2 z-10 flex min-h-11 -translate-x-1/2 flex-col items-center gap-1 px-4 text-sm tracking-[0.18em] italic"
          aria-label="Scroll to wander into the Curious Grove"
        >
          <span>{profile.hero.scrollCue}</span>
          <svg viewBox="0 0 20 34" className="h-8 w-5" aria-hidden>
            <m.path
              d="M10 33V12"
              stroke="#3e5a2b"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={reduced ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
              transition={{ duration: 2.8, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }}
            />
            <m.path
              d="M10 16c-4 0-6-3-6-6 4 0 6 2 6 6Zm0-2c4 0 6-3 6-6-4 0-6 2-6 6Z"
              fill="#6a8a4a"
              style={{ transformOrigin: '10px 16px' }}
              initial={{ scale: 0 }}
              animate={reduced ? { scale: 1 } : { scale: [0, 0, 1, 1, 0] }}
              transition={{
                duration: 2.8,
                repeat: reduced ? 0 : Infinity,
                ease: 'easeInOut',
                times: [0, 0.35, 0.55, 0.85, 1],
              }}
            />
          </svg>
        </m.button>
      </div>
    </section>
  )
}
