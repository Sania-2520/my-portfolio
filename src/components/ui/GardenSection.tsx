import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { GrassStrip, VineCorner } from '../scenes/art/Botanicals'

interface Props {
  id: string
  children: ReactNode
  className?: string
  /** Background treatment for the scene. */
  bg?: 'blush' | 'meadow' | 'parchment' | 'none'
  vines?: 'left' | 'right' | 'both' | 'none'
  grass?: boolean
}

const BG: Record<NonNullable<Props['bg']>, string> = {
  blush: 'bg-blush-50',
  meadow: 'bg-gradient-to-b from-blush-50 via-[#fbf3ec] to-blush-50 dark:via-blush-100',
  parchment: 'bg-gradient-to-b from-blush-50 via-parchment-50 to-blush-50',
  none: '',
}

/** A scene along the walk: consistent spacing, watercolour wash, vines and grass. */
export function GardenSection({
  id,
  children,
  className,
  bg = 'blush',
  vines = 'none',
  grass = false,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'relative isolate scroll-mt-20 overflow-hidden py-20 sm:py-28 lg:py-32',
        BG[bg],
        className,
      )}
    >
      <div aria-hidden className="watercolor-bg pointer-events-none absolute inset-0 -z-10 opacity-80" />
      {(vines === 'left' || vines === 'both') && (
        <VineCorner className="pointer-events-none absolute top-0 left-0 -z-10 w-24 opacity-70 min-[22rem]:w-32 min-[26rem]:w-44 sm:w-64 lg:w-80" />
      )}
      {(vines === 'right' || vines === 'both') && (
        <VineCorner className="pointer-events-none absolute top-0 right-0 -z-10 w-24 -scale-x-100 opacity-70 min-[22rem]:w-32 min-[26rem]:w-44 sm:w-64 lg:w-80" />
      )}
      {children}
      {grass && (
        <GrassStrip className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-14 w-full opacity-70" />
      )}
    </section>
  )
}
