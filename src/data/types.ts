export type SceneName =
  'gate' | 'grove' | 'greenhouse' | 'workshop' | 'cottage' | 'desk' | 'pavilion' | 'journal' | 'moonlit'

export interface SectionMeta {
  id: string
  /** Garden name shown as the eyebrow, e.g. "The Curious Grove". */
  garden: string
  /** Plain-language name, e.g. "About". */
  plain: string
  scene: SceneName
  number?: string
}

export type ProjectCategory = 'ai' | 'sys' | 'web'

export interface ProjectLink {
  label: string
  href?: string
  /** Rendered as a disabled "offline" chip when no href is available. */
  offline?: boolean
  kind?: 'code' | 'demo' | 'info'
}

export interface Metric {
  value: number
  prefix: string
  suffix: string
  label: string
}

export interface Project {
  id: string
  title: string
  status: 'COMPLETED' | 'IN PROGRESS' | 'LIVE AT MANTEXIA'
  year: string
  description: string
  tags: string[]
  categories: ProjectCategory[]
  metrics: Metric[]
  links: ProjectLink[]
  /** Accent colour used for the project's bloom. */
  flower: string
  /** Short delivery note shown in the details timeline (from legacy). */
  delivery: string
}

export interface SkillItem {
  name: string
  icon: string
}

export interface SkillGroup {
  label: string
  items: SkillItem[]
}

export interface EducationEntry {
  period: string
  badge?: string
  title: string
  subtitle: string
  description: string
  current?: boolean
}

export interface BlogPost {
  id: string
  category: string
  cardTitle: string
  title: string
  excerpt: string
  readTime: string
  body: { heading: string; level: 2 | 3; text: string }[]
  summary: string[]
}
