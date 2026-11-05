import { m } from 'motion/react'
import { projects } from '../../data/projects'
import { useGarden } from '../../context/gardenContext'
import { Modal } from '../ui/Modal'
import { CountUp } from '../ui/CountUp'
import { LinkChip, StatusBadge } from '../ui/ProjectBits'
import { Flower } from '../scenes/art/Botanicals'
import { EASE } from '../../lib/motion'

const item = (d: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.12 + d } },
})

export default function ProjectModal({ id }: { id: string }) {
  const { openProject } = useGarden()
  const p = projects.find((x) => x.id === id)
  if (!p) return null
  const titleId = `project-${p.id}-title`

  return (
    <Modal
      labelledBy={titleId}
      onClose={() => openProject(null)}
      originSelector={`[data-project-card="${p.id}"]`}
      closeLabel={`Close ${p.title} details`}
    >
      <div className="relative overflow-hidden px-6 pt-8 pb-8 sm:px-10 sm:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full opacity-35 blur-3xl"
          style={{ background: p.flower }}
        />
        <m.div {...item(0)} className="flex flex-wrap items-center gap-3">
          <StatusBadge status={p.status} />
          <span className="text-muted font-mono text-sm">{p.year}</span>
        </m.div>
        <m.div {...item(0.04)} className="mt-5 flex items-center gap-4">
          <m.span
            initial={{ rotate: -90, scale: 0.4 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.15 }}
          >
            <Flower color={p.flower} className="size-14 drop-shadow" />
          </m.span>
          <h2 id={titleId} className="text-[clamp(2rem,1.5rem+2vw,2.8rem)] font-medium">
            {p.title}
          </h2>
        </m.div>
        <m.p {...item(0.08)} className="mt-5 text-[1.06rem] leading-relaxed">
          {p.description}
        </m.p>

        {p.metrics.length > 0 && (
          <m.div {...item(0.12)} className="mt-7 grid gap-3 sm:grid-cols-2">
            {p.metrics.map((m) => (
              <div key={m.label} className="border-line rounded-2xl border bg-white/65 p-5">
                <CountUp
                  value={m.value}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  className="font-display text-moss-800 text-4xl font-semibold"
                />
                <p className="text-muted mt-1 text-sm">{m.label}</p>
              </div>
            ))}
          </m.div>
        )}

        <m.div {...item(0.16)} className="mt-7">
          <h3 className="eyebrow mb-3 text-[0.68rem]">Grown with</h3>
          <ul className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <li key={t} className="chip text-sm">
                {t}
              </li>
            ))}
          </ul>
        </m.div>

        <m.div
          {...item(0.2)}
          className="border-line bg-parchment-100/50 text-bark-700 mt-7 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed px-4 py-3 font-mono text-xs"
        >
          <span className="size-2 rounded-full" style={{ background: p.flower }} aria-hidden />
          <span>{p.year}</span>
          <span aria-hidden>·</span>
          <span>{p.status}</span>
          <span aria-hidden>·</span>
          <span>{p.delivery}</span>
        </m.div>

        <m.div {...item(0.24)} className="mt-7 flex flex-wrap gap-2">
          {p.links.map((l) => (
            <LinkChip key={l.label} link={l} project={p.title} />
          ))}
        </m.div>
      </div>
    </Modal>
  )
}
