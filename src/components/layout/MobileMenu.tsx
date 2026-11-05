import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { m, AnimatePresence } from 'motion/react'
import { Map, X } from 'lucide-react'
import { navItems, sectionById } from '../../data/sections'
import { useGarden } from '../../context/gardenContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'
import { GrassStrip } from '../scenes/art/Botanicals'

interface Props {
  open: boolean
  onClose: () => void
  active: string
  onNavigate: (e: React.MouseEvent, id: string) => void
}

export function MobileMenu({ open, onClose, active, onNavigate }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { lockScroll, setMapOpen } = useGarden()
  useFocusTrap(ref, open, onClose)

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [open, lockScroll])

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="nav:hidden fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="bg-bark-900/30 absolute inset-0 backdrop-blur-[3px]"
            onClick={onClose}
            aria-hidden
          />
          <m.div
            ref={ref}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Garden navigation"
            className="card-parchment absolute inset-x-3 top-3 overflow-hidden rounded-[1.75rem] pb-4"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
            initial={{ y: -24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } }}
            exit={{ y: -16, opacity: 0, transition: { duration: 0.25 } }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <p className="eyebrow">Walk the garden</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="hover:bg-blush-100 grid size-11 place-items-center rounded-full"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <m.ul
              className="max-h-[70dvh] overflow-y-auto px-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
            >
              {navItems.map((item) => {
                const isActive = item.covers.includes(active)
                return (
                  <m.li
                    key={item.target}
                    variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  >
                    <a
                      href={`#${item.target}`}
                      onClick={(e) => onNavigate(e, item.target)}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'font-display flex min-h-12 items-center justify-between rounded-2xl px-4 text-lg transition-colors',
                        isActive ? 'bg-moss-100 text-moss-900' : 'text-bark-900 hover:bg-blush-100',
                      )}
                    >
                      {item.label}
                      <span className="text-muted font-sans text-xs tracking-wide">
                        {sectionById[item.target]?.plain}
                      </span>
                    </a>
                  </m.li>
                )
              })}
            </m.ul>
            <div className="px-5 pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  setMapOpen(true)
                }}
                className="bg-moss-800 text-parchment-50 flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-semibold"
              >
                <Map className="size-4.5" aria-hidden /> Open the Garden Map
              </button>
            </div>
            <GrassStrip className="pointer-events-none mt-3 h-8 w-full opacity-70" />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
