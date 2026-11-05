import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { m } from 'motion/react'
import { X } from 'lucide-react'
import { useGarden } from '../../context/gardenContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'

interface ModalProps {
  labelledBy: string
  onClose: () => void
  children: ReactNode
  /** Element the panel grows out of (shared-element style entrance). */
  originSelector?: string
  className?: string
  closeLabel?: string
}

/**
 * Accessible dialog: portal, focus trap, Escape/backdrop close, scroll lock,
 * focus restore, and an entrance that grows from its trigger card.
 * Mount it inside <AnimatePresence> so exit animations play.
 */
export function Modal({
  labelledBy,
  onClose,
  children,
  originSelector,
  className,
  closeLabel = 'Close',
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { lockScroll, reduced } = useGarden()
  useFocusTrap(ref, true, onClose, closeRef)

  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [lockScroll])

  // Offset from the trigger's centre to the viewport centre, for the grow-in entrance.
  const origin = useMemo(() => {
    if (!originSelector || reduced) return { x: 0, y: 24, scale: 0.96 }
    const el = document.querySelector(originSelector)
    if (!el) return { x: 0, y: 24, scale: 0.96 }
    const r = el.getBoundingClientRect()
    return {
      x: r.left + r.width / 2 - window.innerWidth / 2,
      y: r.top + r.height / 2 - window.innerHeight / 2,
      scale: Math.max(0.35, Math.min(0.85, r.width / Math.min(window.innerWidth, 760))),
    }
  }, [originSelector, reduced])

  return createPortal(
    <m.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
    >
      <div className="bg-bark-900/40 absolute inset-0 backdrop-blur-[5px]" onClick={onClose} aria-hidden />
      <m.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        data-lenis-prevent
        initial={{ opacity: 0, ...origin }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 },
        }}
        exit={{
          opacity: 0,
          ...origin,
          scale: origin.scale * 0.98,
          transition: { duration: 0.3, ease: EASE },
        }}
        className={cn(
          'card-parchment relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-[1.75rem] rounded-b-none sm:max-w-3xl sm:rounded-[1.75rem]',
          className,
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="border-bark-500/25 bg-parchment-50/90 text-bark-900 sticky top-3 right-3 z-20 float-right m-3 grid size-11 place-items-center rounded-full border backdrop-blur hover:bg-white"
        >
          <X className="size-5" aria-hidden />
        </button>
        {children}
      </m.div>
    </m.div>,
    document.body,
  )
}
