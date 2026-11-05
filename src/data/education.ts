import type { EducationEntry } from './types'

/** Verbatim from legacy/index.html. */
export const educationIntro = {
  title: 'Academic History & Credentials',
  subtitle: 'Honors specialization curriculum and continuous training milestones',
}

export const education: EducationEntry[] = [
  {
    badge: 'CURRENT TRACK',
    period: '2023 - Present (Currently in 4th Year)',
    title: 'B.E. Computer Science Engineering (Honors AI/ML)',
    subtitle: 'Sahyadri College of Engineering and Management | CGPA: 9.43',
    description:
      'Core courses focus on Machine Learning mathematical optimization, deep computer vision frameworks, database streaming loops, and custom pipeline containerizations. Joint Secretary representation for the honors AI/ML division (2026 - Present).',
    current: true,
  },
  {
    period: 'Graduated 2022',
    title: 'Higher Secondary Education (12th Grade)',
    subtitle: 'Major: Physics, Chemistry, Math, Biology (PCMB)',
    description:
      'Maintained top academic tier marks with key focus on data algorithms and logical mathematics.',
  },
  {
    period: 'Graduated 2020',
    title: 'Secondary School Education (10th Grade)',
    subtitle: '',
    description:
      'Graduated with absolute excellence, setting foundational elements for computer science and scripting fields.',
  },
]
