import { useEffect, useRef } from 'react'

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))

/** Fires `handler` for a single key (case-insensitive), ignoring modified keys and form fields. */
export function useKeyboardShortcut(key: string, handler: (e: KeyboardEvent) => void, enabled = true) {
  const ref = useRef(handler)
  useEffect(() => {
    ref.current = handler
  })
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (key !== 'Escape' && isTyping(e.target)) return
      if (e.key.toLowerCase() === key.toLowerCase()) ref.current(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, enabled])
}

/** Classic Konami sequence; calls `onUnlock` when completed. */
export function useKonami(onUnlock: () => void) {
  const ref = useRef(onUnlock)
  useEffect(() => {
    ref.current = onUnlock
  })
  useEffect(() => {
    const seq = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
    ]
    let pos = 0
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      const k = e.key.toLowerCase()
      pos = k === seq[pos] ? pos + 1 : k === seq[0] ? 1 : 0
      if (pos === seq.length) {
        pos = 0
        ref.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
