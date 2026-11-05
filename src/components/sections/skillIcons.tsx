import { AudioWaveform, Brain, Database, Network, ScanEye } from 'lucide-react'
import {
  siApacheairflow,
  siApachekafka,
  siDocker,
  siFastapi,
  siGit,
  siOpencv,
  siPython,
  siPytorch,
} from '../../lib/brandIcons'

const brand = {
  pytorch: siPytorch,
  opencv: siOpencv,
  fastapi: siFastapi,
  python: siPython,
  docker: siDocker,
  kafka: siApachekafka,
  airflow: siApacheairflow,
  git: siGit,
}
const generic = { ml: Brain, dl: Network, cv: ScanEye, speech: AudioWaveform, sql: Database }

/** Skill badge icon: official brand marks where they exist, Lucide line icons otherwise. */
export function SkillIcon({ icon, className }: { icon: string; className?: string }) {
  const b = brand[icon as keyof typeof brand]
  if (b) {
    // Kafka's mark is black; soften to the garden ink colour.
    const fill = b.hex === '231F20' || b.hex === '000000' ? '3b2417' : b.hex
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path d={b.path} fill={`#${fill}`} />
      </svg>
    )
  }
  const G = generic[icon as keyof typeof generic] ?? Brain
  return <G className={className} aria-hidden strokeWidth={1.8} />
}
