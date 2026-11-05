/** Generic illustrated garden used when a scene has no artwork file yet. */
export function GardenFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fce9e4" />
          <stop offset="1" stopColor="#fff6f3" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#gf-sky)" />
      <ellipse cx="200" cy="300" rx="260" ry="70" fill="#e6ecd9" />
      <path d="M70 230c0-60 10-110 0-150" stroke="#74533f" strokeWidth="12" strokeLinecap="round" />
      <circle cx="70" cy="80" r="56" fill="#f0b9c7" opacity=".9" />
      <circle cx="40" cy="110" r="36" fill="#e58fae" opacity=".7" />
      <circle cx="104" cy="104" r="40" fill="#f8d5d0" />
      <path
        d="M180 250h180M200 250v-30h140v30"
        stroke="#8a6650"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {[230, 270, 310].map((x, i) => (
        <g key={x} transform={`translate(${x} ${238 - i * 4})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="0"
              cy="-7"
              rx="5"
              ry="7"
              fill={['#e58fae', '#c9b8e8', '#ebd08e'][i]}
              transform={`rotate(${r})`}
            />
          ))}
          <circle r="3" fill="#d9b45e" />
        </g>
      ))}
    </svg>
  )
}
