import { m, AnimatePresence } from 'motion/react'
import { Sprout } from 'lucide-react'
import { useGarden } from '../../context/gardenContext'

/** Polite, non-focus-stealing announcements (easter eggs, notices). */
export function Toast() {
  const { toastMsg } = useGarden()
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {toastMsg && (
          <m.p
            key={toastMsg}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            className="glass-parchment text-bark-900 flex max-w-md items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium shadow-(--shadow-bloom)"
          >
            <Sprout className="text-moss-700 size-4 shrink-0" aria-hidden />
            {toastMsg}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}
