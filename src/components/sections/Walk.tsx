import { startTransition, useEffect, useState } from 'react'
import { Intro } from './Intro'
import { About } from './About'
import { Skills } from './Skills'
import { Projects } from './Projects'
import { Education } from './Education'
import { Research } from './Research'
import { Achievements } from './Achievements'
import { Journal } from './Journal'
import { Contact } from './Contact'

const SCENES = [Intro, About, Skills, Projects, Education, Research, Achievements, Journal, Contact]

/**
 * Everything after the Garden Gate: code-split, then mounted one scene per frame
 * so no single commit blocks the main thread. Unmounted scenes hold their space.
 */
export default function Walk({ onComplete }: { onComplete?: () => void }) {
  const [count, setCount] = useState(1)
  useEffect(() => {
    if (count >= SCENES.length) {
      onComplete?.()
      return
    }
    const id = requestAnimationFrame(() => startTransition(() => setCount((c) => c + 1)))
    return () => cancelAnimationFrame(id)
  }, [count, onComplete])
  return (
    <>
      {SCENES.slice(0, count).map((Scene, i) => (
        <Scene key={i} />
      ))}
      {count < SCENES.length && (
        <div aria-hidden style={{ minHeight: `${(SCENES.length - count) * 90}vh` }} />
      )}
    </>
  )
}
