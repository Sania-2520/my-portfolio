import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

/** Small hand-drawn sprig (used beside headings and the hero title). */
export function Sprig(props: P) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path d="M4 34C18 30 34 20 58 6" />
      <path d="M20 28c-2-7 1-12 7-14-1 7-3 11-7 14Z" fill="currentColor" fillOpacity=".18" />
      <path d="M31 21c1-7 6-10 12-10-3 6-6 9-12 10Z" fill="currentColor" fillOpacity=".18" />
      <path d="M42 14c3-5 8-7 13-6-3 4-7 6-13 6Z" fill="currentColor" fillOpacity=".18" />
      <path d="M24 26c6 1 11 5 12 10-6-1-10-4-12-10Z" fill="currentColor" fillOpacity=".18" />
      <path d="M36 18c6 0 10 3 12 7-6 0-9-2-12-7Z" fill="currentColor" fillOpacity=".18" />
    </svg>
  )
}

/** Five-petal garden flower. `color` sets the petal fill. */
export function Flower({
  color = '#e58fae',
  center = '#ebd08e',
  ...props
}: P & { color?: string; center?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden {...props}>
      <g fill={color}>
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="20" cy="10.5" rx="6.4" ry="9" transform={`rotate(${r} 20 20)`} opacity=".92" />
        ))}
      </g>
      <g fill="#fff" opacity=".35">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="20" cy="8.5" rx="2.2" ry="4" transform={`rotate(${r} 20 20)`} />
        ))}
      </g>
      <circle cx="20" cy="20" r="4.6" fill={center} />
      <circle cx="20" cy="20" r="4.6" fill="none" stroke="#a37c25" strokeOpacity=".35" />
    </svg>
  )
}

export function Leaf({ color = '#6a8a4a', ...props }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3 21C3 11 9 4 21 3c-1 11-8 18-18 18Z" fill={color} />
      <path d="M3 21 15 9" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

export function Butterfly({ color = '#e58fae', ...props }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 40 32" aria-hidden {...props}>
      <g className="origin-center">
        <path d="M19 16C14 3 3 2 3 9c0 5 6 8 16 7Z" fill={color} />
        <path d="M19 17C11 18 6 23 9 27c3 3 8-1 10-10Z" fill={color} opacity=".8" />
        <path d="M21 16C26 3 37 2 37 9c0 5-6 8-16 7Z" fill={color} />
        <path d="M21 17c8 1 13 6 10 10-3 3-8-1-10-10Z" fill={color} opacity=".8" />
      </g>
      <path d="M20 9v16" stroke="#3b2417" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 9c-1-3-3-5-5-6M20 9c1-3 3-5 5-6" stroke="#3b2417" strokeWidth=".9" fill="none" />
    </svg>
  )
}

/** Trailing vine for section corners. Mirror with `-scale-x-100`. */
export function VineCorner(props: P) {
  return (
    <svg viewBox="0 0 260 180" fill="none" aria-hidden {...props}>
      <path
        d="M0 8c40 6 70 20 96 44s52 52 98 62 50 30 60 60"
        stroke="#6a8a4a"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".75"
      />
      <path
        d="M30 12c6 14 4 26-8 34M78 34c14-2 26 4 30 18M126 82c-4 14 0 26 12 32M176 108c12-6 26-4 34 6"
        stroke="#6a8a4a"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".6"
      />
      {[
        [22, 18, -30],
        [58, 22, 20],
        [96, 50, -10],
        [120, 72, 40],
        [150, 100, -20],
        [196, 116, 30],
        [232, 150, 60],
        [40, 40, 120],
        [108, 36, 160],
        [168, 120, 140],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0c4-8 12-10 18-8-2 7-9 11-18 8Z"
          fill={i % 3 ? '#8aa76a' : '#6a8a4a'}
          transform={`translate(${x} ${y}) rotate(${r})`}
          opacity=".9"
        />
      ))}
      {[
        [64, 30, '#f0b9c7'],
        [140, 92, '#e58fae'],
        [210, 128, '#f0b9c7'],
        [34, 50, '#e2d8f3'],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-5" rx="3.6" ry="5" fill={c as string} transform={`rotate(${r})`} />
          ))}
          <circle r="2.4" fill="#ebd08e" />
        </g>
      ))}
    </svg>
  )
}

/** Tufted grass with a few blooms; stretches to its container width. */
export function GrassStrip({ className, blooms = true }: { className?: string; blooms?: boolean }) {
  const blades = Array.from({ length: 46 }, (_, i) => {
    const x = (i / 46) * 1200 + ((i * 37) % 19) - 9
    const h = 26 + ((i * 53) % 34)
    const lean = ((i * 29) % 14) - 7
    return `M${x} 80 q${lean / 2} ${-h / 2} ${lean} ${-h}`
  })
  const flowers = blooms ? [80, 260, 410, 590, 760, 930, 1110] : []
  const palette = ['#f0b9c7', '#e2d8f3', '#ebd08e', '#fff', '#e58fae']
  return (
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className={className} aria-hidden>
      <g stroke="#7f9a5e" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".7">
        {blades.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {flowers.map((x, i) => (
        <g key={x} transform={`translate(${x} ${30 + (i % 3) * 8})`}>
          <path d={`M0 6 V${50 - (i % 3) * 8}`} stroke="#6a8a4a" strokeWidth="1.8" />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="0"
              cy="-5"
              rx="4.2"
              ry="6"
              fill={palette[i % palette.length]}
              transform={`rotate(${r})`}
            />
          ))}
          <circle r="2.8" fill="#d9b45e" />
        </g>
      ))}
    </svg>
  )
}

/** Growth stages for the scroll progress tracker. */
export function GrowthStage({ stage, ...props }: P & { stage: 0 | 1 | 2 | 3 | 4 }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path d="M6 27h20" stroke="#8a6650" strokeWidth="1.6" strokeLinecap="round" />
      {stage === 0 && <ellipse cx="16" cy="24" rx="4" ry="2.8" fill="#8a6650" />}
      {stage >= 1 && <path d="M16 27V16" stroke="#3e5a2b" strokeWidth="1.8" strokeLinecap="round" />}
      {stage === 1 && <path d="M16 18c-4 0-6-3-6-5 4 0 6 2 6 5Z" fill="#6a8a4a" />}
      {stage >= 2 && (
        <>
          <path d="M16 20c-5 0-8-4-8-7 5 0 8 3 8 7Z" fill="#6a8a4a" />
          <path d="M16 18c5 0 8-4 8-7-5 0-8 3-8 7Z" fill="#8aa76a" />
        </>
      )}
      {stage === 3 && <ellipse cx="16" cy="11" rx="3.2" ry="4.4" fill="#e58fae" />}
      {stage === 4 && (
        <g transform="translate(16 10)">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-4.4" rx="3.2" ry="4.6" fill="#e58fae" transform={`rotate(${r})`} />
          ))}
          <circle r="2.4" fill="#ebd08e" />
        </g>
      )}
    </svg>
  )
}

/** Terracotta pot with a small plant; `grown` makes an extra leaf sprout. */
export function Pot({ grown = false, ...props }: P & { grown?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden {...props}>
      <g
        className="transition-transform duration-500 ease-(--ease-garden)"
        style={{ transformOrigin: '60px 58px', transform: grown ? 'scale(1.08)' : 'scale(1)' }}
      >
        <path d="M60 58C60 40 54 26 40 18c4 16 10 30 20 40Z" fill="#6a8a4a" />
        <path d="M60 58c0-18 8-32 22-40-4 16-12 30-22 40Z" fill="#8aa76a" />
        <path d="M60 58c-2-12-12-20-26-20 6 10 14 18 26 20Z" fill="#7f9a5e" />
        <path d="M60 58c2-12 12-20 26-20-6 10-14 18-26 20Z" fill="#6a8a4a" />
        <path
          d="M60 56c0-14 2-26 0-38"
          stroke="#3e5a2b"
          strokeWidth="2"
          fill="none"
          style={{ opacity: grown ? 1 : 0, transition: 'opacity .4s' }}
        />
        <g
          style={{
            opacity: grown ? 1 : 0,
            transform: grown ? 'scale(1)' : 'scale(.3)',
            transformOrigin: '60px 20px',
            transition: 'all .5s cubic-bezier(.22,1,.36,1)',
          }}
        >
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="60" cy="13" rx="4" ry="6" fill="#f0b9c7" transform={`rotate(${r} 60 18)`} />
          ))}
          <circle cx="60" cy="18" r="3" fill="#ebd08e" />
        </g>
      </g>
      <path d="M28 58h64l-3 10H31Z" fill="#c9714f" />
      <path d="M32 68h56l-7 44H39Z" fill="#d98a63" />
      <path d="M32 68h56l-1.4 8H33.4Z" fill="#b8613f" opacity=".55" />
      <path d="M44 74l3 34" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Moon(props: P) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden {...props}>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#fffaf0" stopOpacity=".9" />
          <stop offset="100%" stopColor="#fffaf0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonFace" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="100%" stopColor="#f2e3c6" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#moonGlow)" opacity=".6" />
      <circle cx="60" cy="60" r="30" fill="url(#moonFace)" />
      <circle cx="50" cy="52" r="5" fill="#e8d6b3" opacity=".6" />
      <circle cx="68" cy="70" r="7" fill="#e8d6b3" opacity=".45" />
      <circle cx="70" cy="48" r="3" fill="#e8d6b3" opacity=".5" />
    </svg>
  )
}
