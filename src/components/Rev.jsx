import { useStarsOptional } from '../StarContext.jsx'

// Reven, tegnet (runde 5, etappe W). Fem plasser for kostymer: hode, øyne,
// hals, hånd og kropp. `kostymer` er lista med id-er som er på; uten prop
// brukes profilens `kostymerPaa`. `mood`: happy | cheer | think | oops.
const O = '#f28c28' // pels
const L = '#fff4e0' // lys pels
const M = '#2a1a10' // mørk

function Hode({ mood }) {
  const smil = mood === 'oops' ? 'M86 128 Q100 120 114 128' : mood === 'cheer' ? 'M84 124 Q100 142 116 124 Z' : 'M86 124 Q100 136 114 124'
  const oyne = mood === 'think' ? (
    <>
      <path d="M72 92 Q80 86 88 92" stroke={M} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="120" cy="95" r="5" fill={M} />
    </>
  ) : mood === 'cheer' ? (
    <>
      <path d="M72 96 Q80 88 88 96" stroke={M} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M112 96 Q120 88 128 96" stroke={M} strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ) : (
    <>
      <circle cx="80" cy="95" r="5" fill={M} />
      <circle cx="120" cy="95" r="5" fill={M} />
    </>
  )
  return (
    <g>
      <path d="M52 70 L66 28 L90 66 L110 66 L134 28 L148 70 Z" fill={O} />
      <path d="M66 38 L74 62 L86 66 Z" fill={M} />
      <path d="M134 38 L126 62 L114 66 Z" fill={M} />
      <ellipse cx="100" cy="100" rx="52" ry="44" fill={O} />
      <path d="M64 112 Q100 156 136 112 Q100 128 64 112 Z" fill={L} />
      <circle cx="100" cy="120" r="5" fill={M} />
      <path d={smil} stroke={M} strokeWidth="3" fill={mood === 'cheer' ? '#c0392b' : 'none'} strokeLinecap="round" />
      {oyne}
    </g>
  )
}

export default function Rev({ mood = 'happy', kostymer = null, className = 'w-24', title = 'Reven' }) {
  const ctx = useStarsOptional()
  const paa = kostymer ?? ctx?.data?.kostymerPaa ?? []
  const har = (id) => paa.includes(id)
  return (
    <svg viewBox="0 0 200 230" className={`inline-block h-auto ${className}`} role="img" aria-label={title} data-kostymer={paa.join(' ')}>
      {/* kropp: kappe bak */}
      {har('kappe') && <path d="M50 150 Q100 136 150 150 L176 228 L24 228 Z" fill="#7c3aed" />}
      {har('kappe') && <path d="M62 152 L100 170 L138 152 Z" fill="#c4b5fd" opacity=".8" />}
      {/* hale */}
      <path d="M150 190 Q212 184 196 134 Q184 162 150 170 Z" fill={O} />
      <path d="M194 140 Q202 154 188 162 Q186 150 194 140 Z" fill={L} />
      {/* kropp */}
      <ellipse cx="100" cy="186" rx="50" ry="42" fill={O} />
      <ellipse cx="100" cy="196" rx="28" ry="28" fill={L} />
      {/* hender */}
      <circle cx="56" cy="186" r="10" fill={O} />
      <circle cx="144" cy="186" r="10" fill={O} />
      {/* hånd-kostymer */}
      {har('tryllestav') && (
        <g>
          <line x1="56" y1="186" x2="26" y2="128" stroke={M} strokeWidth="5" strokeLinecap="round" />
          <path d="M26 128 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 Z" fill="#facc15" />
        </g>
      )}
      {har('gitar') && (
        <g>
          <path d="M112 164 Q150 150 158 182 Q166 214 136 216 Q106 218 104 190 Q102 172 112 164 Z" fill="#b45309" />
          <circle cx="132" cy="192" r="10" fill={M} />
          <rect x="150" y="128" width="8" height="50" rx="3" fill="#78350f" transform="rotate(20 154 153)" />
          <line x1="120" y1="176" x2="150" y2="136" stroke="#fde68a" strokeWidth="1.5" />
          <line x1="126" y1="180" x2="156" y2="140" stroke="#fde68a" strokeWidth="1.5" />
        </g>
      )}
      <Hode mood={mood} />
      {/* øyne-kostymer */}
      {har('briller') && (
        <g>
          <rect x="64" y="86" width="30" height="18" rx="7" fill="#111827" />
          <rect x="106" y="86" width="30" height="18" rx="7" fill="#111827" />
          <line x1="94" y1="92" x2="106" y2="92" stroke="#111827" strokeWidth="4" />
        </g>
      )}
      {/* hals-kostymer */}
      {har('skjerf') && (
        <g>
          <rect x="54" y="140" width="92" height="16" rx="8" fill="#16a34a" />
          <rect x="118" y="146" width="20" height="44" rx="8" fill="#16a34a" />
          <line x1="120" y1="186" x2="136" y2="186" stroke="#bbf7d0" strokeWidth="3" />
        </g>
      )}
      {har('sloyfe') && (
        <g>
          <path d="M100 148 L78 136 L78 160 Z" fill="#ec4899" />
          <path d="M100 148 L122 136 L122 160 Z" fill="#ec4899" />
          <circle cx="100" cy="148" r="6" fill="#be185d" />
        </g>
      )}
      {/* hode-kostymer */}
      {har('lue') && (
        <g>
          <path d="M54 66 Q100 18 146 66 Z" fill="#dc2626" />
          <path d="M146 66 L178 72 L148 76 Z" fill="#dc2626" />
          <rect x="50" y="62" width="100" height="12" rx="6" fill="#b91c1c" />
        </g>
      )}
      {har('hatt') && (
        <g>
          <rect x="60" y="8" width="80" height="54" rx="4" fill="#1f2937" />
          <rect x="44" y="58" width="112" height="12" rx="6" fill="#1f2937" />
          <rect x="60" y="48" width="80" height="10" fill="#dc2626" />
        </g>
      )}
      {har('krone') && (
        <g>
          <path d="M58 68 L58 36 L74 52 L100 24 L126 52 L142 36 L142 68 Z" fill="#facc15" />
          <circle cx="74" cy="50" r="4" fill="#ef4444" />
          <circle cx="100" cy="30" r="4" fill="#3b82f6" />
          <circle cx="126" cy="50" r="4" fill="#22c55e" />
        </g>
      )}
      {har('hjelm') && (
        <g>
          <circle cx="100" cy="92" r="66" fill="#bae6fd" opacity=".45" stroke="#e5e7eb" strokeWidth="6" />
          <path d="M44 92 Q100 150 156 92" fill="none" stroke="#9ca3af" strokeWidth="4" />
          <circle cx="68" cy="60" r="8" fill="#ffffff" opacity=".7" />
        </g>
      )}
    </svg>
  )
}
