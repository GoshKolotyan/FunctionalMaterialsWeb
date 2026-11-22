/** Hexagonal lattice mark — a stylised unit cell. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="logo">
      <g fill="none" strokeLinejoin="round">
        <path d="M16 3 27 9.5v13L16 29 5 22.5v-13z" stroke="var(--accent)" strokeWidth="2.2" />
        <path
          d="M16 3v26M5 9.5l22 13M27 9.5l-22 13"
          stroke="var(--gold)"
          strokeWidth="1.4"
        />
      </g>
      <circle cx="16" cy="16" r="3.2" fill="var(--accent)" />
    </svg>
  )
}
