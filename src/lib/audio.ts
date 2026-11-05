/**
 * Nature Sounds engine.
 *
 * Every channel is synthesized with the Web Audio API (ported from the legacy site),
 * so the garden sounds alive with no audio files. If a recorded loop is listed in
 * public/audio/manifest.json, that channel lazily switches to Howler playback instead.
 * Nothing plays until the visitor turns sound on (a user gesture).
 */
import { readStore, writeStore } from './storage'

export type Channel = 'birds' | 'wind' | 'water' | 'fountain' | 'night'
export const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'birds', label: 'Birds' },
  { id: 'wind', label: 'Wind' },
  { id: 'water', label: 'Water Stream' },
  { id: 'fountain', label: 'Fountain' },
  { id: 'night', label: 'Night Ambience' },
]

type Volumes = Record<Channel, number>
export interface SoundState {
  on: boolean
  volumes: Volumes
  supported: boolean
  /** Channels using recorded files (from the manifest). */
  recorded: Partial<Record<Channel, boolean>>
}

/** Per-scene mix multipliers: the soundscape follows the walk. */
const MIX: Record<string, Volumes> = {
  gate: { birds: 1, wind: 0.8, water: 0.15, fountain: 0, night: 0 },
  grove: { birds: 0.9, wind: 0.8, water: 0.4, fountain: 0, night: 0 },
  greenhouse: { birds: 0.4, wind: 0.25, water: 0, fountain: 0.9, night: 0 },
  workshop: { birds: 0.8, wind: 0.6, water: 0.5, fountain: 0, night: 0 },
  cottage: { birds: 0.35, wind: 0.35, water: 0, fountain: 0, night: 0 },
  desk: { birds: 0.3, wind: 0.3, water: 0, fountain: 0, night: 0 },
  pavilion: { birds: 0.5, wind: 0.4, water: 0, fountain: 1, night: 0 },
  journal: { birds: 0.5, wind: 0.5, water: 0.7, fountain: 0, night: 0.15 },
  moonlit: { birds: 0, wind: 0.35, water: 0.5, fountain: 0.25, night: 1 },
}
/** Channel loudness trims for the synthesized layers. */
const TRIM: Volumes = { birds: 1, wind: 0.95, water: 0.24, fountain: 0.13, night: 0.06 }
const FADE = 0.6

const saved = readStore('garden.sound', {
  on: false,
  volumes: { birds: 0.7, wind: 0.5, water: 0.5, fountain: 0.4, night: 0.6 } as Volumes,
})

let state: SoundState = {
  on: false, // never auto-resume on load; requires a gesture
  volumes: saved.volumes,
  supported:
    typeof window !== 'undefined' &&
    !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext),
  recorded: {},
}
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const set = (patch: Partial<SoundState>) => {
  state = { ...state, ...patch }
  writeStore('garden.sound', { on: state.on, volumes: state.volumes })
  emit()
}

export const soundStore = {
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  get: () => state,
}

/* ---------------- synthesized engine ---------------- */
let ctx: AudioContext | null = null
let master: GainNode | null = null
const gains: Partial<Record<Channel, GainNode>> = {}
let scene = 'gate'
let birdTimer: number | undefined
const howls: Partial<Record<Channel, { volume: (v: number) => void; play: () => void; pause: () => void }>> =
  {}

function noise(type: 'white' | 'brown') {
  const len = ctx!.sampleRate * 3
  const b = ctx!.createBuffer(1, len, ctx!.sampleRate)
  const d = b.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    if (type === 'brown') {
      last = (last + 0.02 * w) / 1.02
      d[i] = last * 3.5
    } else d[i] = w * 0.6
  }
  return b
}
function lfo(freq: number, depth: number, target: AudioParam, type: OscillatorType = 'sine') {
  const o = ctx!.createOscillator()
  o.type = type
  o.frequency.value = freq
  const g = ctx!.createGain()
  g.gain.value = depth
  o.connect(g)
  g.connect(target)
  o.start()
}
function noiseLayer(
  out: GainNode,
  type: 'white' | 'brown',
  filters: [BiquadFilterType, number, number?][],
  lfos: [number, number][],
) {
  const src = ctx!.createBufferSource()
  src.buffer = noise(type)
  src.loop = true
  let node: AudioNode = src
  for (const [t, f, q] of filters) {
    const bq = ctx!.createBiquadFilter()
    bq.type = t
    bq.frequency.value = f
    if (q) bq.Q.value = q
    node.connect(bq)
    node = bq
  }
  const mod = ctx!.createGain()
  node.connect(mod)
  mod.connect(out)
  lfos.forEach(([f, d]) => lfo(f, d, mod.gain))
  src.start()
}
function channelGain(c: Channel) {
  const g = ctx!.createGain()
  g.gain.value = 0
  g.connect(master!)
  gains[c] = g
  return g
}
function build() {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  if (!state.recorded.wind) {
    const w = channelGain('wind')
    noiseLayer(
      w,
      'brown',
      [['bandpass', 520, 0.5]],
      [
        [0.09, 0.45],
        [0.23, 0.2],
      ],
    )
    noiseLayer(
      w,
      'white',
      [['highpass', 4200, 0.7]],
      [
        [0.35, 0.05],
        [0.9, 0.03],
      ],
    ) // rustling leaves
  }
  if (!state.recorded.water)
    noiseLayer(
      channelGain('water'),
      'white',
      [
        ['bandpass', 1300, 1.1],
        ['lowpass', 3200],
      ],
      [
        [0.7, 0.15],
        [3.1, 0.1],
      ],
    )
  if (!state.recorded.fountain)
    noiseLayer(
      channelGain('fountain'),
      'white',
      [
        ['highpass', 1800],
        ['bandpass', 3600, 0.6],
      ],
      [[5, 0.12]],
    )
  if (!state.recorded.birds) channelGain('birds')
  if (!state.recorded.night) {
    const crickets = channelGain('night')
    const m1 = ctx.createGain()
    m1.gain.value = 0.5
    const m2 = ctx.createGain()
    m2.gain.value = 0.5
    m1.connect(m2)
    m2.connect(crickets)
    ;[4300, 4390, 3950].forEach((f) => {
      const o = ctx!.createOscillator()
      o.frequency.value = f
      o.connect(m1)
      o.start()
    })
    lfo(15, 0.5, m1.gain, 'square')
    lfo(1.7, 0.5, m2.gain, 'square')
  }
}
function chirp() {
  if (!state.on || !ctx || !gains.birds) return
  if (gains.birds.gain.value > 0.02 && !document.hidden) {
    const notes = 2 + Math.floor(Math.random() * 4)
    const f0 = 2200 + Math.random() * 2100
    let t = ctx.currentTime + 0.02
    for (let i = 0; i < notes; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.setValueAtTime(f0 * (0.85 + Math.random() * 0.3), t)
      o.frequency.exponentialRampToValueAtTime(f0 * (0.7 + Math.random() * 0.8), t + 0.08)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.09, t + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.1)
      o.connect(g)
      g.connect(gains.birds)
      o.start(t)
      o.stop(t + 0.12)
      t += 0.09 + Math.random() * 0.09
    }
  }
  birdTimer = window.setTimeout(chirp, 1400 + Math.random() * 3400)
}

function level(c: Channel) {
  return state.volumes[c] * (MIX[scene] ?? MIX.gate)[c]
}
function apply(time = 1.2) {
  if (ctx) {
    for (const c of CHANNELS.map((x) => x.id)) {
      gains[c]?.gain.setTargetAtTime(level(c) * TRIM[c], ctx.currentTime, time / 3)
    }
  }
  for (const [c, h] of Object.entries(howls) as [Channel, (typeof howls)[Channel]][])
    h?.volume(state.on ? level(c) : 0)
}

async function loadRecorded() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}audio/manifest.json`, { cache: 'no-cache' })
    if (!res.ok) return
    const manifest = (await res.json()) as { files?: Partial<Record<Channel, string>> }
    const files = Object.entries(manifest.files ?? {}).filter(([, f]) => !!f) as [Channel, string][]
    if (!files.length) return
    const { Howl } = await import('howler')
    const recorded: SoundState['recorded'] = {}
    for (const [c, file] of files) {
      recorded[c] = true
      howls[c] = new Howl({
        src: [`${import.meta.env.BASE_URL}audio/${file}`],
        loop: true,
        volume: 0,
        html5: false,
      })
    }
    state = { ...state, recorded }
    emit()
  } catch {
    /* manifest missing or unreadable: synthesized sound only */
  }
}
const manifestReady = typeof window !== 'undefined' ? loadRecorded() : Promise.resolve()

export async function setSoundOn(on: boolean) {
  if (!state.supported) return
  set({ on })
  if (on) {
    await manifestReady
    if (!ctx) build()
    await ctx!.resume()
    master!.gain.cancelScheduledValues(ctx!.currentTime)
    master!.gain.setTargetAtTime(0.85, ctx!.currentTime, FADE / 3)
    Object.values(howls).forEach((h) => h?.play())
    apply(0.8)
    window.clearTimeout(birdTimer)
    birdTimer = window.setTimeout(chirp, 700)
  } else {
    window.clearTimeout(birdTimer)
    Object.values(howls).forEach((h) => h?.volume(0))
    if (ctx && master) {
      master.gain.setTargetAtTime(0, ctx.currentTime, FADE / 4)
      window.setTimeout(
        () => {
          if (!state.on && ctx) {
            ctx.suspend()
            Object.values(howls).forEach((h) => h?.pause())
          }
        },
        FADE * 1000 + 100,
      )
    }
  }
}

export function setVolume(c: Channel, v: number) {
  set({ volumes: { ...state.volumes, [c]: Math.min(1, Math.max(0, v)) } })
  apply(0.25)
}

/** Called as the visitor walks between scenes; crossfades the soundscape. */
export function setScene(name: string) {
  if (name === scene) return
  scene = name
  if (state.on) apply(1.6)
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !state.on) return
    if (document.hidden) ctx.suspend()
    else ctx.resume()
  })
}
