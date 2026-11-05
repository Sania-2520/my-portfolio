import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { footer } from '../../data/contact'
import { devQuotes } from '../../data/profile'
import { useGarden } from '../../context/gardenContext'
import { Butterfly, GrassStrip, Sprig } from '../scenes/art/Botanicals'

export function Footer() {
  const { scrollTo } = useGarden()
  const [quote, setQuote] = useState<number | null>(null)

  return (
    <footer className="from-twilight-100 via-blush-100 to-blush-50 relative overflow-hidden bg-gradient-to-b pt-6 pb-10">
      <div className="wrap flex flex-col items-center text-center">
        <m.button
          type="button"
          onClick={() => setQuote((q) => ((q ?? -1) + 1) % devQuotes.length)}
          whileHover={{ y: -4, rotate: -0.5 }}
          whileTap={{ scale: 0.98 }}
          className="bg-moss-800 text-parchment-50 relative w-full max-w-xl overflow-hidden rounded-[1.75rem] px-8 py-10 shadow-(--shadow-bloom) dark:bg-gradient-to-br dark:from-[#ff9cc6] dark:to-[#e8629f]"
          aria-describedby="dev-quote"
        >
          <span
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(255_255_255/0.12),transparent)]"
            aria-hidden
          />
          <Butterfly color="#f0b9c7" className="motion-safe:animate-float absolute top-4 right-6 size-9" />
          <Sprig className="text-moss-300 dark:text-parchment-100 mx-auto mb-3 h-6 w-10" />
          <span className="font-display block text-[clamp(1.6rem,1.1rem+2vw,2.4rem)] leading-tight italic">
            {footer.thanks}
          </span>
          <span className="text-moss-100/80 mt-3 block text-xs tracking-[0.2em] uppercase">
            Tap for a gardener’s note
          </span>
        </m.button>
        <p id="dev-quote" aria-live="polite" className="text-bark-700 mt-4 min-h-6 font-mono text-sm">
          <AnimatePresence mode="wait">
            {quote !== null && (
              <m.span
                key={quote}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-block"
              >
                {devQuotes[quote]}
              </m.span>
            )}
          </AnimatePresence>
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <p className="text-muted text-sm">{footer.copyright}</p>
          <m.button
            type="button"
            onClick={() => scrollTo('home-section')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group border-bark-500/30 bg-parchment-50 text-moss-800 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
          >
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
            Back to the Garden Gate
          </m.button>
        </div>
      </div>
      <GrassStrip className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full opacity-60" />
    </footer>
  )
}
