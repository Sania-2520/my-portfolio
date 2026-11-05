import type { BlogPost } from './types'

export const journalIntro = {
  title: 'Technical Logs & Insights',
  subtitle: 'Documenting framework discoveries, security parameters, and performance optimization workflows',
}

/**
 * Article text is verbatim from the legacy blogsDB.
 * `summary` replaces the legacy Gemini call (which needed a client-side API key);
 * each line restates the article's own points. See DECISIONS.md.
 */
export const blogs: BlogPost[] = [
  {
    id: 'unlearn',
    category: 'ML SECURITY',
    cardTitle: 'Demystifying Machine Unlearning',
    title: 'Demystifying Machine Unlearning: Why Retraining from Scratch is Obsolete',
    excerpt:
      'Discover why full retraining is obsolete. Explore PyTorch gradient influence mapping, selective removal, and protection matrices against data reconstruction hacks.',
    readTime: '5 min read',
    body: [
      {
        level: 2,
        heading: 'The Retraining Bottleneck',
        text: 'In the era of privacy mandates like GDPR and CCPA, the right to be forgotten has created massive compliance challenges for deep learning engineers. When a user requests their personal images or transaction history be purged from an active recommender model, standard practices require fully retraining the network from scratch. For modern deep networks, this means thousands of dollars in computing bills and massive development bottlenecks.',
      },
      {
        level: 3,
        heading: 'Our Selective Removal Framework',
        text: "To solve this, we applied influence-function mathematical concepts inside PyTorch. Instead of a full retrain, we evaluate the precise gradient influence score associated with the targeted sample array. We then mathematically adjust adjacent model weights to 'unlearn' that specific node with zero influence on the rest of the network. This slashes retraining overhead by roughly 20% while fully preserving model performance.",
      },
    ],
    summary: [
      'Privacy mandates like GDPR and CCPA make the right to be forgotten costly when models must be fully retrained.',
      'The framework applies influence functions in PyTorch to score a sample’s gradient influence.',
      'Adjacent weights are adjusted to unlearn that sample without a full retrain.',
      'Retraining overhead drops by roughly 20% while model performance is preserved.',
    ],
  },
  {
    id: 'speech',
    category: 'AUDIO ML',
    cardTitle: 'Optimizing Speech Synthesis Latency',
    title: 'Optimizing Speech Latency for High-Fidelity Conversational Voice Networks',
    excerpt:
      "Inside DreamTalk's parallel vocoder layers. Dive into memory scheduling, CUDA execution shortcuts, and sub-second vocal production pipelines.",
    readTime: '7 min read',
    body: [
      {
        level: 2,
        heading: 'Real-Time Synthesis Demands',
        text: 'When designing DreamTalk, our aim was clear: achieve high-quality synthesized voice outputs that flow naturally without robotic pauses. In standard architectures, processing pipelines suffer from bottlenecks at the spectrogram vocoder generation stage, leading to latency of 1.5 to 3 seconds. For actual voice calls, anything above 400 milliseconds feels unnatural.',
      },
      {
        level: 3,
        heading: 'How We Achieved Sub-Second Latency',
        text: "We refactored our training and inference loops to execute parallel vocoder calculations directly via custom CUDA instructions. By optimizing dataset loading matrices, structuring continuous audio buffers, and using Dockerized task schedulers, we streamlined speech generation down to sub-second thresholds. This research now acts as the underlying core of Mantexia's voice synthesis pipelines.",
      },
    ],
    summary: [
      'Standard pipelines bottleneck at the spectrogram vocoder stage, with 1.5 to 3 seconds of latency.',
      'Voice calls feel unnatural above roughly 400 milliseconds.',
      'DreamTalk runs parallel vocoder calculations through custom CUDA instructions, with optimized data loading, continuous audio buffers and Dockerized schedulers.',
      'Generation now runs below one second and powers Mantexia’s voice synthesis pipelines.',
    ],
  },
  {
    id: 'kafka',
    category: 'MLOPS',
    cardTitle: 'Kafka & Airflow for SOC Pipelines',
    title: 'Integrating Kafka & Airflow for Automated Event-Driven Threat Monitoring',
    excerpt:
      'Simulating reactive cyber threat networks with automated streaming schedulers. Step-by-step documentation on stream processing with FastAPI integrations.',
    readTime: '6 min read',
    body: [
      {
        level: 2,
        heading: 'Active Cybersecurity pipelines',
        text: 'In traditional security operations (SOC), threat monitoring platforms depend on batch-processing pipelines. This results in detection lag that can allow ongoing attacks to proceed unmitigated. For Cyber Rakshak, we resolved to design a reactive microservices layout that instantly triggers on log changes.',
      },
      {
        level: 3,
        heading: 'The MLOps Stack',
        text: 'We integrated Apache Kafka to stream event telemetry into a FastAPI microservice backend. On detect events, tasks are queued via automated Apache Airflow schedules to package payload logs and update interactive dashboards. This event-driven structure slashed detection responsiveness by over 25% across test threat scenarios.',
      },
    ],
    summary: [
      'Batch-processing SOC pipelines create detection lag that lets attacks proceed.',
      'Cyber Rakshak uses a reactive microservices layout that triggers on log changes.',
      'Kafka streams event telemetry into a FastAPI backend; Airflow schedules package payload logs and update dashboards.',
      'The event-driven design improved detection responsiveness by over 25% in test scenarios.',
    ],
  },
]
