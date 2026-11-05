import { CircleCheck, Hourglass, Lock, Radio } from 'lucide-react'
import { Github } from './GithubIcon'
import type { Project, ProjectLink } from '../../data/types'
import { cn } from '../../lib/cn'

const STATUS: Record<Project['status'], { cls: string; Icon: typeof CircleCheck }> = {
  COMPLETED: { cls: 'border-moss-700/25 bg-moss-100 text-moss-800', Icon: CircleCheck },
  'IN PROGRESS': { cls: 'border-gold-600/30 bg-gold-300/40 text-[#6b5013]', Icon: Hourglass },
  'LIVE AT MANTEXIA': { cls: 'border-rose-500/30 bg-blush-100 text-rose-700', Icon: Radio },
}

export function StatusBadge({ status }: { status: Project['status'] }) {
  const { cls, Icon } = STATUS[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.08em]',
        cls,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {status}
    </span>
  )
}

/** A project link, or a clearly disabled "offline" chip when there is no public URL. */
export function LinkChip({ link, project }: { link: ProjectLink; project: string }) {
  if (link.href) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-bark-900 text-parchment-50 hover:bg-moss-800 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors"
      >
        <Github className="size-4" aria-hidden />
        {link.label}
        <span className="sr-only">for {project} (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <span
      className="border-bark-500/40 text-muted inline-flex min-h-10 cursor-default items-center gap-2 rounded-full border border-dashed px-4 text-sm font-medium"
      title="Not publicly available"
    >
      <Lock className="size-3.5" aria-hidden />
      {link.label}
      <span className="sr-only">(not publicly available)</span>
    </span>
  )
}
