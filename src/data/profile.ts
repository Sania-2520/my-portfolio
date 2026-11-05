/** Verbatim from legacy/index.html unless noted. */
export const profile = {
  name: 'Sania S Kotharkar',
  plaqueName: 'Sania S. Kotharkar',
  plaqueRole: 'AI/ML Engineer',
  role: 'Honors AI/ML Student & Co-Founder of Mantexia Solutions',
  location: 'Adyar, Karnataka, India',
  resume: 'sania_resume.pdf',

  hero: {
    // Hero copy from the design mockup (reference/hero-reference).
    eyebrow: 'Welcome to',
    titleLead: 'The Garden',
    titleTail: 'of Ideas',
    tagline: 'A journey through my world of engineering, ideas and innovation.',
    primaryCta: 'Begin the Walk',
    secondaryCta: 'Explore the Garden Map',
    scrollCue: 'Scroll to Wander',
  },

  intro: {
    // Legacy hero copy, preserved as the "Garden Gate plaque" beat.
    eyebrow: 'Botanica · The Portfolio of Sania Kotharkar',
    welcome: 'Welcome to My Garden of Ideas',
    titleLine1: 'Engineering',
    titleEmphasis: 'Handcrafted',
    titleLine2: 'AI & ML Solutions',
    taglinePrefix: 'Building',
    typed: [
      'Production ML Systems',
      'Selective Unlearning',
      'Low-Latency Speech',
      'High-Performance Pipelines',
    ],
    lead: 'Computer Science Honors student centered on privacy-centric machine unlearning algorithms, streaming SOC log telemetries, and highly optimized conversational voice models.',
    ctaProjects: 'Explore Projects',
    ctaResume: 'Open Resume',
  },

  about: {
    title: "Sania's Professional Profile",
    subtitle: 'Blending computational mathematics, unlearning architectures, and elegant design',
    signText: 'Every journey starts with curiosity.',
    missionTitle: 'Academic & Engineering Mission',
    mission: [
      'I specialize in crafting high-efficiency deep learning pipelines that respect data security and modern privacy legislation. By deploying advanced model optimizations inside PyTorch and structuring low-latency streaming infrastructure with Kafka and Airflow, I help solve immediate data processing and unlearning challenges.',
    ],
    mantexia: {
      before: 'As the Co-Founder & ML Lead at',
      org: 'Mantexia Solutions',
      after:
        ', I oversee the end-to-end pipelines of our custom conversational speech generation projects, aiming to minimize real-time vocal response delays.',
    },
    // Feature chips from the design mockup.
    chips: ['AI/ML', 'Backend', 'Research', 'Problem Solving'],
    manifest: {
      file: 's_kotharkar.yaml',
      label: 'YAML Manifest',
      root: 'profile',
      entries: [
        ['name', 'Sania S Kotharkar'],
        ['academic_path', 'Honors CSE (AI & ML) - CGPA 9.43'],
        ['specialty', 'Machine Unlearning & Speech Vocoders'],
        ['co_founders', 'Mantexia Solutions'],
      ] as [string, string][],
    },
  },
} as const

/** Garden facts (legacy waypoint bubbles), revealed by "Know More". */
export const gardenFacts = [
  'Sania holds a CGPA of 9.43 in Honors CSE (AI & ML) at Sahyadri College of Engineering and Management.',
  "Cyber Rakshak's Kafka streaming pipelines improved detection responsiveness by about 25%.",
  'VeriUnlearn avoids full retraining with influence functions, cutting retraining overhead by about 20%.',
  'Culling AI reduced manual image sorting effort by about 83% using custom clustering.',
  'DreamTalk TTS delivers real-time, sub-second voice synthesis updates at Mantexia.',
  "Sania took 1st place at the 36-hour Atharva '25 Hackathon.",
  'Sania co-founded Mantexia Solutions and serves as its ML Lead.',
]

/** Footer easter-egg quotes (legacy). */
export const devQuotes = [
  '// TODO: stop gardening and ship the feature.',
  'It works on my machine. And in my garden.',
  'git commit -m "watered the code, it grew"',
  'There is no bug, only an undocumented wildflower.',
  'while (curious) { learn(); }',
]
