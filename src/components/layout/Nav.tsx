import { lazy, Suspense, useRef, useState } from 'react'
import { m, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import { Map, Menu, Volume2, VolumeX } from 'lucide-react'
import { navItems } from '../../data/sections'
import { profile } from '../../data/profile'
import { useGarden } from '../../context/gardenContext'
import { useSound } from '../../hooks/useSound'
import { cn } from '../../lib/cn'
import { BrandLeaf } from './Brand'
import { MobileMenu } from './MobileMenu'

const SoundPanel = lazy(() => import('../features/SoundPanel'))

export function Nav({ active }: { active: string }) {
  const { scrollTo, setMapOpen, mapOpen } = useGarden()
  const sound = useSound()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOpen, setSoundOpen] = useState(false)
  const soundBtn = useRef<HTMLButtonElement>(null)
  const mapBtn = useRef<HTMLButtonElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollTo(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500',
        scrolled
          ? 'glass-parchment shadow-[0_8px_30px_-18px_rgb(91_56_37/0.45)]'
          : 'from-blush-50/75 via-blush-50/30 bg-gradient-to-b to-transparent',
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8"
      >
        <a
          href="#home-section"
          onClick={(e) => go(e, 'home-section')}
          className="group text-moss-800 flex min-h-11 shrink-0 items-center gap-2 rounded-full pr-2"
          aria-label={`${profile.name}, back to the Garden Gate`}
        >
          <BrandLeaf className="size-9 transition-transform duration-500 ease-(--ease-garden) group-hover:-rotate-12" />
          <span className="font-display text-bark-900 text-[1.05rem] font-medium whitespace-nowrap">
            {profile.name}
          </span>
        </a>

        <ul className="nav:flex mx-auto hidden items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = item.covers.includes(active)
            return (
              <li key={item.target} className="relative">
                <a
                  href={`#${item.target}`}
                  onClick={(e) => go(e, item.target)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'font-display relative flex min-h-11 items-center px-2 text-[0.94rem] whitespace-nowrap transition-colors duration-200 min-[1600px]:px-3',
                    isActive ? 'text-bark-900' : 'text-bark-700 hover:text-moss-800',
                  )}
                >
                  <span className="hidden min-[1600px]:inline">{item.label}</span>
                  <span className="min-[1600px]:hidden">{item.short}</span>
                  {isActive && (
                    <m.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 bottom-1.5 flex items-center justify-center"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden
                    >
                      <span className="via-moss-700 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
                      <span className="bg-moss-700 absolute size-1.5 rotate-45 rounded-[1px]" />
                    </m.span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="nav:ml-0 ml-auto flex items-center gap-2">
          <div className="relative">
            <m.button
              ref={soundBtn}
              type="button"
              onClick={() => setSoundOpen((v) => !v)}
              aria-expanded={soundOpen}
              aria-controls="sound-panel"
              aria-label={`Nature sounds ${sound.on ? 'on' : 'off'}. Open sound settings`}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'grid size-11 place-items-center rounded-full border transition-colors',
                sound.on
                  ? 'border-moss-900/30 bg-moss-800 text-parchment-50'
                  : 'border-bark-500/30 bg-parchment-50/80 text-moss-800 hover:bg-white',
              )}
            >
              {sound.on ? (
                <Volume2 className="size-5" aria-hidden />
              ) : (
                <VolumeX className="size-5" aria-hidden />
              )}
            </m.button>
            <AnimatePresence>
              {soundOpen && (
                <Suspense fallback={null}>
                  <SoundPanel onClose={() => setSoundOpen(false)} anchor={soundBtn} />
                </Suspense>
              )}
            </AnimatePresence>
          </div>
          <m.button
            ref={mapBtn}
            type="button"
            onClick={() => setMapOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={mapOpen}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="border-bark-500/35 bg-parchment-50/85 font-display text-bark-900 hidden min-h-11 items-center gap-2 rounded-full border px-4 text-[0.95rem] hover:bg-white sm:flex"
          >
            <Map className="text-moss-800 size-4.5" aria-hidden />
            Garden Map
            <kbd className="border-bark-500/25 text-muted ml-1 hidden rounded border px-1.5 font-mono text-[0.65rem] min-[1600px]:inline">
              M
            </kbd>
          </m.button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
            className="border-bark-500/30 bg-parchment-50/85 text-bark-900 nav:hidden grid size-11 place-items-center rounded-full border"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} onNavigate={go} />
    </header>
  )
}
