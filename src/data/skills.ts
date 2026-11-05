import type { SkillGroup } from './types'

/** Verbatim skill matrix from legacy/index.html. One pot per skill, no duplicates. */
export const skills = {
  title: 'Technical Skill Matrix',
  subtitle: 'A growing set of tools, frameworks, and technologies I work with.',
  groups: [
    {
      label: 'AI & Core Models',
      items: [
        { name: 'Machine Learning', icon: 'ml' },
        { name: 'Deep Learning', icon: 'dl' },
        { name: 'Computer Vision', icon: 'cv' },
        { name: 'Speech Vocoders', icon: 'speech' },
      ],
    },
    {
      label: 'Frameworks & Languages',
      items: [
        { name: 'PyTorch', icon: 'pytorch' },
        { name: 'OpenCV', icon: 'opencv' },
        { name: 'FastAPI', icon: 'fastapi' },
        { name: 'Python', icon: 'python' },
        { name: 'SQL', icon: 'sql' },
      ],
    },
    {
      label: 'Systems & MLOps',
      items: [
        { name: 'Docker', icon: 'docker' },
        { name: 'Apache Kafka', icon: 'kafka' },
        { name: 'Apache Airflow', icon: 'airflow' },
        { name: 'Git CI/CD', icon: 'git' },
      ],
    },
  ] satisfies SkillGroup[],
}
