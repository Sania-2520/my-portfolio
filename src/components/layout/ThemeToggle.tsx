import { m } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { setTheme, useTheme } from '../../lib/theme'
import { cn } from '../../lib/cn'

/** Light / dark switch. The new theme blooms outward from the button. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme()
  const dark = theme === 'dark'

  return (
    <m.button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      className={cn(
        'border-bark-500/30 bg-parchment-50/80 text-moss-800 relative grid size-11 place-items-center overflow-hidden rounded-full border transition-colors hover:bg-white',
        className,
      )}
    >
      <m.span
        aria-hidden
        className="absolute"
        initial={false}
        animate={{ rotate: dark ? 0 : 90, scale: dark ? 1 : 0, opacity: dark ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Sun className="size-5" />
      </m.span>
      <m.span
        aria-hidden
        className="absolute"
        initial={false}
        animate={{ rotate: dark ? -90 : 0, scale: dark ? 0 : 1, opacity: dark ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Moon className="size-5" />
      </m.span>
    </m.button>
  )
}
