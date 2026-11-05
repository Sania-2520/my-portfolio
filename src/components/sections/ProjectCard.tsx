import { m } from 'motion/react'
import { Sprout } from 'lucide-react'
import type { Project } from '../../data/types'
import { useGarden } from '../../context/gardenContext'
import { Flower } from '../scenes/art/Botanicals'
import { CountUp } from '../ui/CountUp'
import { LinkChip, StatusBadge } from '../ui/ProjectBits'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'

interface Props {
  project: Project
  active: boolean
  width: number
  onSelect: () => void
  index: number
  total: number
}

export function ProjectCard({ project: p, active, width, onSelect, index, total }: Props) {
  const { openProject } = useGarden()
  return (
    <m.article
      layout="position"
      data-project-card={p.id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: active ? 1 : 0.62, scale: active ? 1 : 0.9, y: active ? 0 : 14 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
      transition={{ duration: 0.55, ease: EASE }}
      onFocusCapture={onSelect}
      onClick={() => !active && onSelect()}
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${p.title}`}
      className={cn(
        'card-parchment relative flex shrink-0 flex-col overflow-hidden p-6 sm:p-7',
        !active && 'cursor-pointer',
        active && 'shadow-(--shadow-bloom)',
      )}
      style={{ width }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-36 rounded-full opacity-40 blur-2xl"
        style={{ background: p.flower }}
      />
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={p.status} />
        <span className="text-muted font-mono text-sm">{p.year}</span>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <m.span
          animate={active ? { rotate: [0, 18, 0] } : { rotate: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <Flower color={p.flower} className="size-11 drop-shadow-sm" />
        </m.span>
        <h3 className="text-[1.65rem] font-medium">{p.title}</h3>
      </div>
      <p className="mt-4 line-clamp-4 text-[0.98rem] leading-relaxed">{p.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
        {p.tags.map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
      </ul>
      {p.metrics[0] && (
        <div className="border-line mt-5 flex items-baseline gap-2 rounded-xl border bg-white/55 px-4 py-2.5">
          <CountUp
            value={p.metrics[0].value}
            prefix={p.metrics[0].prefix}
            suffix={p.metrics[0].suffix}
            className="font-display text-moss-800 text-2xl font-semibold"
          />
          <span className="text-muted text-sm">{p.metrics[0].label}</span>
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        <m.button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            openProject(p.id)
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          aria-haspopup="dialog"
          aria-label={`Open the bloom: ${p.title} details`}
          tabIndex={active ? 0 : -1}
          className="bg-moss-800 text-parchment-50 hover:bg-moss-700 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold"
        >
          <Sprout className="size-4" aria-hidden />
          Open the bloom
        </m.button>
        <span className={cn(!active && 'pointer-events-none')} {...(!active ? { inert: true } : {})}>
          <LinkChip link={p.links[0]} project={p.title} />
        </span>
      </div>
    </m.article>
  )
}
