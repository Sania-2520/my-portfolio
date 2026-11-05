import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { Scene } from './Scene'
import { GardenFallback } from './art/GardenFallback'
import { useGarden } from '../../context/gardenContext'
import { cn } from '../../lib/cn'

interface VignetteProps {
  name: string
  alt: string
  /** Intrinsic artwork size, reserves space (no CLS). */
  width: number
  height: number
  sizes?: string
  className?: string
  /** Lantern / light glows, positioned as % of the artwork. */
  glows?: { x: number; y: number; size?: number }[]
  parallax?: number
  feather?: 'soft' | 'strong'
}

/** A watercolour scene vignette with feathered edges, gentle parallax and flickering lantern light. */
export function Vignette({
  name,
  alt,
  width,
  height,
  sizes = '(min-width: 1024px) 420px, 80vw',
  className,
  glows = [],
  parallax = 40,
  feather = 'soft',
}: VignetteProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useGarden()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [parallax, -parallax])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.06, 1, 1.03])

  return (
    <div ref={ref} className={cn('relative', className)} style={{ aspectRatio: `${width} / ${height}` }}>
      <m.div
        className={cn(
          'art-grade absolute inset-0 will-change-transform',
          feather === 'strong' ? 'mask-feather' : 'mask-feather-soft',
        )}
        style={{ y, scale }}
      >
        <Scene
          name={name}
          alt={alt}
          sizes={sizes}
          width={width}
          height={height}
          imgClassName="object-cover"
          className="h-full w-full"
          fallback={<GardenFallback className="h-full w-full" />}
        />
        {glows.map((g, i) => (
          <span
            key={i}
            aria-hidden
            className="motion-safe:animate-flicker pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
            style={{
              left: `${g.x}%`,
              top: `${g.y}%`,
              width: `${g.size ?? 22}%`,
              aspectRatio: '1',
              background:
                'radial-gradient(circle, rgb(255 214 140 / 0.55), rgb(255 200 120 / 0.18) 45%, transparent 70%)',
              animationDelay: `${i * -1.3}s`,
            }}
          />
        ))}
      </m.div>
    </div>
  )
}
