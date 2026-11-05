import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import { useGarden } from '../../context/gardenContext'

/** Counts from 0 to `value` once visible. Renders the final value for SSR / reduced motion. */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const { reduced } = useGarden()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduced) return
    const controls = animate(0, value, {
      duration: value <= 1 ? 0.6 : 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, prefix, suffix, reduced])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {`${prefix}${value}${suffix}`}
    </span>
  )
}
