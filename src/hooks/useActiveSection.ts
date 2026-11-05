import { useEffect, useState } from 'react'

/** Returns the id of the section currently crossing the middle band of the viewport. */
export function useActiveSection(ids: string[], ready = true): string {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    if (!ready) return
    const list = key.split('|')
    const visible = new Map<string, number>()
    const observed = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top)
          else visible.delete(e.target.id)
        }
        if (visible.size) {
          // The lowest section that has crossed the band wins (natural reading order).
          const next = list.filter((id) => visible.has(id)).pop()
          if (next) setActive(next)
        }
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )
    // Sections render lazily; keep attaching until all of them exist.
    let tries = 0
    let timer = 0
    const attach = () => {
      for (const id of list) {
        const el = document.getElementById(id)
        if (el && !observed.has(id)) {
          io.observe(el)
          observed.add(id)
        }
      }
      if (observed.size < list.length && tries++ < 50) timer = window.setTimeout(attach, 200)
    }
    attach()
    return () => {
      window.clearTimeout(timer)
      io.disconnect()
    }
  }, [key, ready])

  return active
}
