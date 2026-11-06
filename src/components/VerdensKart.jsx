import { useMemo } from 'react'
import { countries, pathFor, viewBoxFor, centroidFor } from '../lib/geo/topo.js'
import { landFor } from '../data/geo/land.js'

// Et ordentlig kart å trykke på. Landene i `region` kan trykkes; resten er bakgrunn.
//  - highlight: land-id som skal lyse (til «hvilket land er dette?»)
//  - picked / answer: markerer valgt og riktig land etter svar
//  - onPick(id): kalles når barnet trykker på et land i området
//  - labels: vis navn på landene (til utforsking)
export default function VerdensKart({ region = 'norden', highlight = null, picked = null, answer = null, onPick, disabled = false, labels = false, className = '' }) {
  const vb = viewBoxFor(region)
  const alle = useMemo(() => countries().filter((c) => c.id !== '010'), [])
  const iOmraadet = useMemo(() => new Set(landFor(region).map((l) => l.id)), [region])
  const navn = useMemo(() => Object.fromEntries(landFor(region).map((l) => [l.id, l.navn])), [region])
  const paths = useMemo(() => alle.map((c) => ({ c, d: pathFor(c) })), [alle])
  const strokeW = Math.max(0.08, vb.w / 900)

  return (
    <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className={`w-full h-auto rounded-2xl bg-sky-100 ${className}`} style={{ maxHeight: '60vh' }} role="img" aria-label={`Kart over ${region}`}>
      {paths.map(({ c, d }) => {
        const aktiv = iOmraadet.has(c.id)
        const isHi = highlight === c.id
        const isPicked = picked === c.id
        const isAnswer = answer === c.id
        let fill = aktiv ? '#86efac' : '#e2e8f0'
        if (isHi) fill = '#f472b6'
        if (isAnswer) fill = '#22c55e'
        else if (isPicked && answer) fill = '#fb7185'
        else if (isPicked) fill = '#38bdf8'
        return (
          <path
            key={c.id}
            d={d}
            fill={fill}
            stroke="#ffffff"
            strokeWidth={strokeW}
            strokeLinejoin="round"
            className={aktiv && !disabled && onPick ? 'cursor-pointer hover:brightness-95' : ''}
            onClick={() => aktiv && !disabled && onPick && onPick(c.id)}
            role={aktiv && onPick ? 'button' : undefined}
            aria-label={aktiv ? navn[c.id] : undefined}
          >
            {aktiv && <title>{labels ? navn[c.id] : ''}</title>}
          </path>
        )
      })}
      {labels &&
        alle
          .filter((c) => iOmraadet.has(c.id))
          .map((c) => {
            const [x, y] = centroidFor(c)
            return (
              <text key={`t${c.id}`} x={x} y={y} textAnchor="middle" fontSize={vb.w / 45} fontWeight="800" fill="#1e293b" pointerEvents="none">
                {navn[c.id]}
              </text>
            )
          })}
      {(picked || answer) &&
        [picked, answer].filter(Boolean).map((id) => {
          const c = alle.find((x) => x.id === id)
          if (!c) return null
          const [x, y] = centroidFor(c)
          return <circle key={`m${id}`} cx={x} cy={y} r={vb.w / 120} fill={id === answer ? '#15803d' : '#be123c'} stroke="#fff" strokeWidth={strokeW * 2} pointerEvents="none" />
        })}
    </svg>
  )
}
