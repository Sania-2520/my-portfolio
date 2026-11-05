import type { Transition, Variants } from 'motion/react'

/** Shared motion tokens, so every animation in the garden moves alike. */
export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_IN = [0.55, 0, 0.75, 0.2] as const

export const DUR = { micro: 0.18, small: 0.28, reveal: 0.7, scene: 1.1 } as const

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 30, mass: 0.7 }
export const softSpring: Transition = { type: 'spring', stiffness: 160, damping: 22, mass: 0.9 }
export const layoutSpring: Transition = { type: 'spring', stiffness: 260, damping: 32 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE } },
}

export const stagger = (step = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
})

export const hoverLift = { y: -4, transition: spring }
export const tapPress = { scale: 0.97 }
