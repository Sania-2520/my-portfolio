import { forwardRef, type ReactNode, type MouseEvent } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'
import { cn } from '../../lib/cn'
import { spring } from '../../lib/motion'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useGarden } from '../../context/gardenContext'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'

interface Common {
  variant?: Variant
  children: ReactNode
  className?: string
  icon?: ReactNode
  iconLeft?: ReactNode
  /** Gently follows the pointer on desktop. */
  magnetic?: boolean
}
type AsButton = Common & {
  href?: undefined
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-haspopup'?: 'dialog'
}
type AsLink = Common & {
  href: string
  target?: string
  rel?: string
  download?: boolean | string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

const styles: Record<Variant, string> = {
  primary:
    'bg-moss-800 text-parchment-50 shadow-[0_10px_30px_-10px_rgb(47_69_33/0.65)] hover:bg-moss-700 border border-moss-900/40',
  secondary:
    'bg-parchment-50/85 text-bark-900 border border-bark-500/35 hover:bg-white hover:border-bark-500/60 backdrop-blur-sm',
  ghost: 'text-moss-800 hover:bg-moss-100/70 border border-transparent',
  gold: 'bg-gold-300 text-bark-900 border border-gold-600/30 hover:bg-gold-400',
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, AsButton | AsLink>(
  function Button(props, ref) {
    const { variant = 'primary', children, className, icon, iconLeft, magnetic, ...rest } = props
    const fine = useFinePointer()
    const { reduced } = useGarden()
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const x = useSpring(mx, { stiffness: 220, damping: 18 })
    const y = useSpring(my, { stiffness: 220, damping: 18 })
    const enableMagnet = magnetic && fine && !reduced

    const onMove = (e: React.PointerEvent<HTMLElement>) => {
      if (!enableMagnet) return
      const r = e.currentTarget.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 10)
      my.set(((e.clientY - r.top) / r.height - 0.5) * 8)
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }

    const classes = cn(
      'group relative inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full px-6 py-2.5 text-[0.95rem] font-semibold tracking-[0.01em] transition-colors duration-200 select-none disabled:opacity-50',
      styles[variant],
      className,
    )
    const content = (
      <>
        {iconLeft && (
          <span aria-hidden className="inline-flex shrink-0">
            {iconLeft}
          </span>
        )}
        <span>{children}</span>
        {icon && (
          <span
            aria-hidden
            className="inline-flex shrink-0 transition-transform duration-300 ease-(--ease-garden) group-hover:translate-x-1"
          >
            {icon}
          </span>
        )}
      </>
    )
    const motionProps = {
      style: enableMagnet ? { x, y } : undefined,
      whileHover: { y: -2 },
      whileTap: { scale: 0.97 },
      transition: spring,
      onPointerMove: onMove,
      onPointerLeave: onLeave,
    }

    if ('href' in rest && rest.href) {
      const { href, target, rel, download, onClick } = rest as AsLink
      return (
        <m.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          download={download}
          onClick={onClick}
          className={classes}
          {...motionProps}
        >
          {content}
        </m.a>
      )
    }
    const b = rest as AsButton
    return (
      <m.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={b.type ?? 'button'}
        onClick={b.onClick}
        disabled={b.disabled}
        aria-expanded={b['aria-expanded']}
        aria-controls={b['aria-controls']}
        aria-haspopup={b['aria-haspopup']}
        className={classes}
        {...motionProps}
      >
        {content}
      </m.button>
    )
  },
)
