import { useGarden } from '../../context/gardenContext'

/** First focusable element: skips the loader and the hero walk straight to the content. */
export function SkipLink() {
  const { setLoaderDone, scrollTo } = useGarden()
  return (
    <a
      href="#about-section"
      onClick={(e) => {
        e.preventDefault()
        setLoaderDone(true)
        requestAnimationFrame(() => scrollTo('about-section'))
      }}
      className="bg-moss-800 text-parchment-50 fixed top-3 left-3 z-[200] -translate-y-24 rounded-full px-5 py-3 font-semibold shadow-lg transition-transform focus:translate-y-0"
    >
      Skip the walk and go to the content
    </a>
  )
}
