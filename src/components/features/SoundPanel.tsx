import { useEffect, useRef, type RefObject } from 'react'
import { m } from 'motion/react'
import { Bird, Droplets, Fan, Moon, Music2, Waves, Wind } from 'lucide-react'
import { CHANNELS, setSoundOn, setVolume, type Channel } from '../../lib/audio'
import { useSound } from '../../hooks/useSound'
import { useGarden } from '../../context/gardenContext'
import { cn } from '../../lib/cn'

const ICONS: Record<Channel, typeof Bird> = {
  birds: Bird,
  wind: Wind,
  water: Waves,
  fountain: Droplets,
  night: Moon,
}

function Toggle({ on, onChange, id }: { on: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={id}
      onClick={() => onChange(!on)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300',
        on ? 'border-moss-900/30 bg-moss-700' : 'border-bark-500/30 bg-bark-500/20',
      )}
    >
      <m.span
        className="absolute top-0.5 left-0.5 size-[1.375rem] rounded-full bg-[#fff6fa] shadow"
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
    </button>
  )
}

export default function SoundPanel({
  onClose,
  anchor,
}: {
  onClose: () => void
  anchor: RefObject<HTMLButtonElement | null>
}) {
  const sound = useSound()
  const { userReduced, setUserReduced } = useGarden()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!ref.current?.contains(t) && !anchor.current?.contains(t)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        anchor.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, anchor])

  return (
    <m.div
      ref={ref}
      id="sound-panel"
      role="group"
      aria-label="Nature sounds and motion settings"
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="card-parchment fixed inset-x-3 top-[calc(4.25rem+env(safe-area-inset-top))] z-50 origin-top-right p-5 shadow-(--shadow-bloom) sm:absolute sm:inset-x-auto sm:top-14 sm:right-0 sm:w-80"
      data-lenis-prevent
    >
      <div className="flex items-center justify-between gap-3">
        <p id="sound-master" className="font-display text-bark-900 flex items-center gap-2 text-lg">
          <Music2 className="text-moss-700 size-5" aria-hidden /> Nature Sounds
        </p>
        <Toggle id="sound-master" on={sound.on} onChange={(v) => void setSoundOn(v)} />
      </div>
      {!sound.supported && (
        <p className="mt-2 text-sm text-rose-700">Your browser doesn’t support Web Audio.</p>
      )}
      <ul className={cn('mt-4 space-y-3 transition-opacity', !sound.on && 'opacity-60')}>
        {CHANNELS.map(({ id, label }) => {
          const Icon = ICONS[id]
          const v = Math.round(sound.volumes[id] * 100)
          return (
            <li key={id} className="grid grid-cols-[1.25rem_6.5rem_1fr] items-center gap-2.5">
              <Icon className="text-bark-700 size-4.5" aria-hidden />
              <label htmlFor={`vol-${id}`} className="text-bark-900 text-sm font-medium">
                {label}
              </label>
              <input
                id={`vol-${id}`}
                type="range"
                min={0}
                max={100}
                value={v}
                onChange={(e) => setVolume(id, Number(e.target.value) / 100)}
                aria-valuetext={`${v}%`}
                className="accent-moss-700 h-11 w-full cursor-pointer"
              />
            </li>
          )
        })}
      </ul>
      <p className="text-muted mt-2 text-xs">
        <Fan className="mr-1 inline size-3.5" aria-hidden />
        The mix follows you through the garden; night ambience rises near the Moonlit Garden.
      </p>
      <div className="border-line mt-4 flex items-center justify-between gap-3 border-t pt-4">
        <p id="reduce-motion-label" className="text-bark-900 text-sm font-semibold">
          Reduce motion
        </p>
        <Toggle id="reduce-motion-label" on={userReduced} onChange={setUserReduced} />
      </div>
    </m.div>
  )
}
