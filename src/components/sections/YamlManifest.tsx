import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView } from 'motion/react'
import { profile } from '../../data/profile'
import { useGarden } from '../../context/gardenContext'

/** The legacy s_kotharkar.yaml manifest, syntax-coloured and typed in on scroll. */
export function YamlManifest({ icon }: { icon: ReactNode }) {
  const m = profile.about.manifest
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const { reduced } = useGarden()
  const lines = [`${m.root}:`, ...m.entries.map(([k, v]) => `  ${k}: "${v}"`)]
  const total = lines.join('\n').length
  const [count, setCount] = useState(0)
  const shown = reduced ? total : count

  useEffect(() => {
    if (!inView || reduced) return
    let n = 0
    const id = window.setInterval(() => {
      n = Math.min(total, n + 3)
      setCount(n)
      if (n >= total) window.clearInterval(id)
    }, 16)
    return () => window.clearInterval(id)
  }, [inView, reduced, total])

  // Render each line, truncated to the typed character budget.
  let budget = shown
  const rendered = lines.map((line, i) => {
    const take = Math.max(0, Math.min(line.length, budget))
    budget -= line.length + 1
    const text = line.slice(0, take)
    if (i === 0)
      return (
        <span key={i} className="text-rose-300">
          {text}
        </span>
      )
    const colon = line.indexOf(':')
    return (
      <span key={i}>
        <span className="text-moss-300">{text.slice(0, colon + 1)}</span>
        <span className="text-gold-300">{text.slice(colon + 1)}</span>
      </span>
    )
  })

  return (
    <div
      ref={ref}
      className="border-bark-900/40 overflow-hidden rounded-[1.25rem] border bg-[#2c2a22] shadow-(--shadow-bloom)"
    >
      <div className="text-parchment-100/80 flex items-center justify-between border-b border-white/10 bg-[#36332a] px-4 py-2.5 font-mono text-xs">
        <span className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <i className="size-2.5 rounded-full bg-[#e58f8f]" />
            <i className="size-2.5 rounded-full bg-[#ebd08e]" />
            <i className="size-2.5 rounded-full bg-[#a8bb8a]" />
          </span>
          <span className="flex items-center gap-1.5">
            {icon} {m.file}
          </span>
        </span>
        <span>{m.label}</span>
      </div>
      <p className="sr-only">
        {m.file}: {m.entries.map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('; ')}
      </p>
      <pre
        aria-hidden
        className="text-parchment-100 overflow-x-auto p-5 font-mono text-[0.82rem] leading-7 sm:text-sm"
      >
        <code>
          {rendered.map((r, i) => (
            <span key={i} className="block min-h-7 whitespace-pre-wrap">
              {r}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
