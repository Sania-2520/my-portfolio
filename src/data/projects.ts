import type { Project, ProjectCategory } from './types'

export const projectsIntro = {
  title: 'Computational & Systems Projects',
  subtitle: 'Demonstrated production ML, stream engineering, and collaborative next-gen dashboards',
  searchPlaceholder: 'Search systems or tags...',
}

export const projectFilters: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI/ML' },
  { id: 'sys', label: 'MLOps' },
  { id: 'web', label: 'Web' },
]

/** Verbatim from legacy/index.html (categories from each card's data-tags). */
export const projects: Project[] = [
  {
    id: 'cyber-rakshak',
    title: 'Cyber Rakshak',
    status: 'COMPLETED',
    year: '2026',
    description:
      'Built a distributed cybersecurity platform simulating SOC pipelines for threat monitoring. Designed a microservices architecture using FastAPI backend and React dashboard. Implemented Kafka streaming pipelines improving detection responsiveness by ~25%, and automated workflows using Apache Airflow to cut manual effort by ~30%.',
    tags: ['FastAPI', 'Kafka', 'Airflow', 'Docker'],
    categories: ['sys', 'ai'],
    metrics: [
      { value: 25, prefix: '~', suffix: '%', label: 'Detection responsiveness' },
      { value: 30, prefix: '~', suffix: '%', label: 'Manual effort cut' },
    ],
    links: [
      { label: 'Github Code', href: 'https://github.com/saniakotharkar/cyber-rakshak', kind: 'code' },
      { label: 'Demo Offline', offline: true, kind: 'demo' },
    ],
    flower: '#d98c8c',
    delivery: 'Demo Offline',
  },
  {
    id: 'veri-unlearn',
    title: 'VeriUnlearn',
    status: 'IN PROGRESS',
    year: '2026',
    description:
      'Developed a machine unlearning framework for selective data removal in ML models. Applied influence-function techniques to avoid full retraining, reducing retraining overhead by ~20% with minimal performance loss and evaluating robustness against membership inference attacks.',
    tags: ['PyTorch', 'Python', 'ML Security'],
    categories: ['ai'],
    metrics: [{ value: 20, prefix: '~', suffix: '%', label: 'Retraining overhead reduced' }],
    links: [
      { label: 'Github Code', href: 'https://github.com/saniakotharkar/veri-unlearn', kind: 'code' },
      { label: 'CLI Core Tool', offline: true, kind: 'info' },
    ],
    flower: '#e0c36d',
    delivery: 'CLI Core Tool',
  },
  {
    id: 'culling-ai',
    title: 'Culling AI',
    status: 'COMPLETED',
    year: '2025',
    description:
      'Built an automated image processing pipeline for large-scale dataset filtering. Extracted quality metrics such as sharpness, lighting, and facial clarity, reducing manual sorting effort by ~83% using custom clustering techniques.',
    tags: ['OpenCV', 'K-Means', 'Python'],
    categories: ['ai'],
    metrics: [{ value: 83, prefix: '~', suffix: '%', label: 'Manual sorting effort reduced' }],
    links: [
      { label: 'Github Code', href: 'https://github.com/saniakotharkar/culling-ai', kind: 'code' },
      { label: 'Local Python Engine', offline: true, kind: 'info' },
    ],
    flower: '#d98fb0',
    delivery: 'Local Python Engine',
  },
  {
    id: 'dreamtalk-tts',
    title: 'DreamTalk TTS',
    status: 'LIVE AT MANTEXIA',
    year: '2026',
    description:
      'Conversational voice engine utilizing optimized CUDA tensors and parallel vocoder spectrogram steps, achieving real-time sub-second voice synthesis updates.',
    tags: ['Speech Synthesis', 'Realtime CUDA', 'Vocoder'],
    categories: ['ai', 'web'],
    metrics: [{ value: 1, prefix: '< ', suffix: 's', label: 'Real-time voice synthesis updates' }],
    links: [
      { label: 'Proprietary IP', offline: true, kind: 'code' },
      { label: 'Production Hub', offline: true, kind: 'info' },
    ],
    flower: '#a996cc',
    delivery: 'Production Hub',
  },
  {
    id: 'kaushalya-setu',
    title: 'Kaushalya-Setu',
    status: 'COMPLETED',
    year: '2024',
    description:
      'Developed a multi-role platform connecting students, institutions, and industry professionals. Designed role-based interfaces for collaboration and progress tracking.',
    tags: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    categories: ['web'],
    metrics: [],
    links: [
      { label: 'Private Host', offline: true, kind: 'demo' },
      { label: 'Internal Release', offline: true, kind: 'info' },
    ],
    flower: '#8fb0d3',
    delivery: 'Internal Release',
  },
]
