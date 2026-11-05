import { m, type HTMLMotionProps } from 'motion/react'
import { EASE } from '../../lib/motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'article' | 'section' | 'header'
}

/** Fades content up once it scrolls into view. Reduced motion → simple fade via MotionConfig. */
export function Reveal({ delay = 0, y = 28, as = 'div', children, ...rest }: RevealProps) {
  const Comp = m[as] as typeof m.div
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Parent that staggers direct <RevealItem> children. */
export function RevealGroup({
  step = 0.07,
  delay = 0,
  children,
  ...rest
}: HTMLMotionProps<'div'> & { step?: number; delay?: number }) {
  return (
    <m.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </m.div>
  )
}

export function RevealItem({ children, y = 22, ...rest }: HTMLMotionProps<'div'> & { y?: number }) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </m.div>
  )
}
