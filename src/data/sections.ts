import type { SectionMeta } from './types'

/** The walk, in order. Garden names come from the legacy site and the design mockups. */
export const sections: SectionMeta[] = [
  { id: 'home-section', garden: 'The Garden Gate', plain: 'Home', scene: 'gate' },
  { id: 'about-section', garden: 'The Curious Grove', plain: 'About', scene: 'grove', number: '01' },
  { id: 'skills-section', garden: 'The Greenhouse', plain: 'Skills', scene: 'greenhouse', number: '02' },
  {
    id: 'projects-section',
    garden: 'The Blooming Workshop',
    plain: 'Projects',
    scene: 'workshop',
    number: '03',
  },
  {
    id: 'academics-section',
    garden: "The Gardener's Cottage",
    plain: 'Academics',
    scene: 'cottage',
    number: '04',
  },
  { id: 'research-section', garden: 'The Cottage Desk', plain: 'Research', scene: 'desk', number: '05' },
  {
    id: 'achievements-section',
    garden: 'The Pavilion of Achievements',
    plain: 'Achievements',
    scene: 'pavilion',
    number: '06',
  },
  { id: 'blogs-section', garden: 'The Garden Journal', plain: 'Logs', scene: 'journal', number: '07' },
  { id: 'contact-section', garden: 'The Moonlit Garden', plain: 'Contact', scene: 'moonlit', number: '08' },
]

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<string, SectionMeta>

/** Top navigation. "Cottage" covers both Academics and the Cottage Desk (Research). */
export const navItems: { label: string; short: string; target: string; covers: string[] }[] = [
  { label: 'The Garden Gate', short: 'Garden Gate', target: 'home-section', covers: ['home-section'] },
  { label: 'The Curious Grove', short: 'Curious Grove', target: 'about-section', covers: ['about-section'] },
  { label: 'The Greenhouse', short: 'Greenhouse', target: 'skills-section', covers: ['skills-section'] },
  {
    label: 'The Blooming Workshop',
    short: 'Workshop',
    target: 'projects-section',
    covers: ['projects-section'],
  },
  {
    label: 'The Cottage',
    short: 'Cottage',
    target: 'academics-section',
    covers: ['academics-section', 'research-section'],
  },
  {
    label: 'The Pavilion',
    short: 'Pavilion',
    target: 'achievements-section',
    covers: ['achievements-section'],
  },
  { label: 'The Journal', short: 'Journal', target: 'blogs-section', covers: ['blogs-section'] },
  {
    label: 'The Moonlit Garden',
    short: 'Moonlit Garden',
    target: 'contact-section',
    covers: ['contact-section'],
  },
]
