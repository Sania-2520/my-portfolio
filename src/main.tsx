import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App'
import { GardenProvider } from './context/GardenProvider'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

/** In production the stylesheet loads non-blocking; render only once it applies (no unstyled flash). */
function cssReady(): Promise<void> {
  const link = document.querySelector<HTMLLinkElement>('link[data-main-css]')
  if (!link) return Promise.resolve()
  const applied = () => link.rel === 'stylesheet' && !!link.sheet
  if (applied()) return Promise.resolve()
  return new Promise((resolve) => {
    const start = performance.now()
    const poll = () =>
      applied() || performance.now() - start > 4000 ? resolve() : requestAnimationFrame(poll)
    link.addEventListener('error', () => resolve(), { once: true })
    poll()
  })
}

cssReady().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <GardenProvider>
        <App />
      </GardenProvider>
    </StrictMode>,
  )
})
