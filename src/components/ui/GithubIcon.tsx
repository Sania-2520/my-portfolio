import { siGithub } from '../../lib/brandIcons'

/** GitHub mark (Lucide v1 no longer ships brand icons). */
export function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d={siGithub.path} />
    </svg>
  )
}
