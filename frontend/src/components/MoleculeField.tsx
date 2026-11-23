/** Decorative molecular network for dark hero backgrounds. */
type Node = [x: number, y: number, r: number]

const CHAINS: Node[][] = [
  [[180, 420], [260, 360], [300, 270], [400, 230], [470, 300], [560, 260], [640, 320]].map(
    ([x, y], i) => [x, y, i % 3 === 0 ? 16 : 10],
  ),
  [[700, 120], [780, 190], [880, 170], [940, 250], [1040, 230], [1100, 320], [1200, 290], [1260, 380]].map(
    ([x, y], i) => [x, y, i % 2 === 0 ? 18 : 11],
  ),
  [[820, 560], [900, 500], [990, 540], [1070, 480], [1160, 520]].map(([x, y], i) => [x, y, i === 2 ? 22 : 12]),
]
const BRANCHES: [Node, Node][] = [
  [[300, 270, 0], [250, 190, 9]],
  [[470, 300, 0], [500, 390, 12]],
  [[880, 170, 0], [860, 80, 9]],
  [[1040, 230, 0], [1080, 140, 13]],
  [[990, 540, 0], [1010, 630, 10]],
]

export function MoleculeField() {
  return (
    <svg className="molecule-field" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="mf-node" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e4eeec" />
          <stop offset="55%" stopColor="#7d9ea3" />
          <stop offset="100%" stopColor="#2c4247" />
        </radialGradient>
        <filter id="mf-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g stroke="#a3b6ae" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round">
        {CHAINS.map((chain, c) =>
          chain.slice(1).map((n, i) => (
            <line key={`${c}-${i}`} x1={chain[i][0]} y1={chain[i][1]} x2={n[0]} y2={n[1]} />
          )),
        )}
        {BRANCHES.map(([a, b], i) => (
          <line key={`b${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        ))}
      </g>
      <g fill="url(#mf-node)">
        {[...CHAINS.flat(), ...BRANCHES.map(([, b]) => b)].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={0.55 + (i % 3) * 0.15} />
        ))}
      </g>
      <g fill="#d8cd8c" filter="url(#mf-blur)" opacity="0.35">
        <circle cx="120" cy="600" r="40" />
        <circle cx="1300" cy="90" r="55" />
        <circle cx="620" cy="640" r="28" />
      </g>
    </svg>
  )
}
