import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { Sparkles, Sprout } from 'lucide-react'
import { blogs } from '../../data/blogs'
import { useGarden } from '../../context/gardenContext'
import { Modal } from '../ui/Modal'
import { EASE } from '../../lib/motion'

/** Reveals pre-written summary lines with a typewriter effect. */
function TypedSummary({ lines, reduced }: { lines: string[]; reduced: boolean }) {
  const full = lines.join('\n')
  const [n, setN] = useState(reduced ? full.length : 0)
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(
      () => setN((v) => (v >= full.length ? (window.clearInterval(id), v) : v + 2)),
      14,
    )
    return () => window.clearInterval(id)
  }, [full, reduced])
  const total = reduced ? full.length : n
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((a, l) => a + l.length + 1, 0))
  return (
    <>
      <ul className="sr-only">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <ul aria-hidden className="space-y-2">
        {lines.map((l, i) => {
          const t = l.slice(0, Math.max(0, total - starts[i]))
          return (
            <li key={l} className="flex min-h-6 gap-2.5">
              {t && <Sprout className="text-moss-700 mt-1 size-4 shrink-0" />}
              <span>{t}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function BlogModal({ id }: { id: string }) {
  const { openBlog, reduced } = useGarden()
  const [showSummary, setShowSummary] = useState(false)
  const b = blogs.find((x) => x.id === id)
  if (!b) return null
  const titleId = `blog-${b.id}-title`

  return (
    <Modal labelledBy={titleId} onClose={() => openBlog(null)} closeLabel="Close article">
      <article className="px-6 pt-8 pb-8 sm:px-12 sm:pt-12 sm:pb-10">
        <p className="eyebrow text-rose-700">{b.category}</p>
        <h2 id={titleId} className="mt-3 text-[clamp(1.8rem,1.3rem+2vw,2.6rem)] leading-tight font-medium">
          {b.title}
        </h2>
        <p className="text-muted mt-3 text-sm">{b.readTime}</p>
        <div
          className="via-bark-500/30 my-7 h-px bg-gradient-to-r from-transparent to-transparent"
          aria-hidden
        />
        <div className="max-w-[68ch] space-y-5 text-[1.06rem] leading-[1.8]">
          {b.body.map((s) => (
            <section key={s.heading}>
              {s.level === 2 ? (
                <h3 className="mb-3 text-2xl font-medium">{s.heading}</h3>
              ) : (
                <h4 className="mb-3 text-xl font-medium">{s.heading}</h4>
              )}
              <p>{s.text}</p>
            </section>
          ))}
        </div>

        <div className="border-line mt-10 border-t pt-6">
          {!showSummary ? (
            <m.button
              type="button"
              onClick={() => setShowSummary(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="bg-moss-800 text-parchment-50 hover:bg-moss-700 inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold"
            >
              <Sparkles className="size-4.5" aria-hidden />
              Generate Instant Summary
            </m.button>
          ) : null}
          <AnimatePresence>
            {showSummary && (
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
                className="border-moss-500/30 bg-moss-100/60 rounded-2xl border p-5 sm:p-6"
                aria-live="polite"
              >
                <p className="text-moss-900 mb-3 flex items-center gap-2 font-semibold">
                  <Sprout className="size-4.5" aria-hidden /> Quick Summary
                </p>
                <TypedSummary lines={b.summary} reduced={reduced} />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </article>
    </Modal>
  )
}
