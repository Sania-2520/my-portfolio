import { Reveal } from './Reveal'
import { Sprig } from '../scenes/art/Botanicals'
import { cn } from '../../lib/cn'

interface Props {
  id: string
  number?: string
  garden: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  tone?: 'day' | 'twilight'
  className?: string
}

/** Eyebrow (garden name) + serif title + subtitle, with a drawn sprig ornament. */
export function SectionHeading({
  id,
  number,
  garden,
  title,
  subtitle,
  align = 'center',
  tone = 'day',
  className,
}: Props) {
  const center = align === 'center'
  return (
    <Reveal
      className={cn(
        'relative mb-10 sm:mb-14',
        center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      <div className={cn('mb-3 flex items-center gap-3', center && 'justify-center')}>
        {number && (
          <span
            aria-hidden
            className={cn(
              'grid size-8 place-items-center rounded-full border font-mono text-[0.7rem] font-medium',
              tone === 'day'
                ? 'border-moss-700/30 bg-moss-100/70 text-moss-800'
                : 'border-twilight-700/25 text-twilight-700 bg-white/60',
            )}
          >
            {number}
          </span>
        )}
        <p className={cn('eyebrow', tone === 'twilight' && 'text-twilight-700')}>{garden}</p>
      </div>
      <h2
        id={`${id}-title`}
        data-section-heading
        className="text-[clamp(2rem,1.2rem+3.2vw,3.5rem)] font-medium tracking-[-0.01em] outline-none"
      >
        {title}
      </h2>
      <div className={cn('mt-4 flex items-center gap-3', center && 'justify-center')} aria-hidden>
        <span className="to-bark-500/40 h-px w-12 bg-gradient-to-r from-transparent" />
        <Sprig className="text-moss-500 h-5 w-8" />
        <span className="to-bark-500/40 h-px w-12 bg-gradient-to-l from-transparent" />
      </div>
      {subtitle && (
        <p className={cn('text-muted mt-4 text-[1.05rem]', center && 'mx-auto max-w-xl')}>{subtitle}</p>
      )}
    </Reveal>
  )
}
