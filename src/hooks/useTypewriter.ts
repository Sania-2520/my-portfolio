import { useEffect, useState } from 'react'

/** Cycles through words with a type/delete rhythm (legacy hero typist). Static when disabled. */
export function useTypewriter(words: readonly string[], enabled: boolean) {
  const [text, setText] = useState(words[0] ?? '')

  useEffect(() => {
    if (!enabled) return
    let i = 0
    let chars = words[0].length
    let deleting = true
    let t: number
    const step = () => {
      const word = words[i]
      if (deleting) chars--
      else chars++
      setText(word.slice(0, chars))
      let delay = deleting ? 40 : 95
      if (!deleting && chars === word.length) {
        delay = 2000
        deleting = true
      } else if (deleting && chars === 0) {
        deleting = false
        i = (i + 1) % words.length
        delay = 450
      }
      t = window.setTimeout(step, delay)
    }
    t = window.setTimeout(step, 2400)
    return () => window.clearTimeout(t)
  }, [words, enabled])

  return enabled ? text : (words[0] ?? '')
}
