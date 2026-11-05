export function BrandLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path d="M8 34C14 24 22 16 34 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M14 27c-5-1-8-6-7-12 6 2 8 6 7 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity=".12"
      />
      <path
        d="M20 20c-1-6 2-11 8-13 1 6-2 10-8 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity=".12"
      />
      <path
        d="M17 24c5-2 11 0 13 5-6 1-10-1-13-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity=".12"
      />
    </svg>
  )
}
