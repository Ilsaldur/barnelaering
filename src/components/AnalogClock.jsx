import { useRef, useState } from 'react'
import { timeFraVinkel } from '../lib/klokke/vinkel.js'

// Analog klokke. Med `interactive` kan viserne dras med finger eller mus;
// `step` er hvor mange minutter minuttviseren hopper i (5, 15, 30 eller 60).
export default function AnalogClock({ hour, minute, onChange, interactive = true, size = 280, step = 5, className = '' }) {
  const ref = useRef(null)
  const [active, setActive] = useState(null) // 'hour' | 'minute'

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10
  const minuteAngle = minute * 6
  const hourAngle = (hour % 12) * 30 + minute * 0.5

  function handAt(angleDeg, length) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length }
  }

  function pointerToTime(e) {
    const rect = ref.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * size
    const py = ((e.clientY - rect.top) / rect.height) * size
    let deg = (Math.atan2(px - cx, -(py - cy)) * 180) / Math.PI
    if (deg < 0) deg += 360
    if (active === 'minute') {
      const m = (Math.round(deg / (6 * step)) * step) % 60
      onChange?.(hour, m)
    } else if (active === 'hour') {
      onChange?.(timeFraVinkel(deg, minute), minute)
    }
  }

  const minTip = handAt(minuteAngle, r * 0.82)
  const hourTip = handAt(hourAngle, r * 0.55)
  const grip = size * 0.065

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className={`mx-auto touch-none select-none ${className || 'w-64 h-64 md:w-80 md:h-80'}`}
      onPointerMove={(e) => interactive && active && pointerToTime(e)}
      onPointerUp={() => setActive(null)}
      onPointerLeave={() => setActive(null)}
    >
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#facc15" strokeWidth={size * 0.035} />
      {Array.from({ length: 60 }).map((_, i) => {
        const big = i % 5 === 0
        const a = handAt(i * 6, r * 0.93)
        const b = handAt(i * 6, r * (big ? 0.86 : 0.9))
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth={big ? size * 0.012 : size * 0.005} />
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i + 1
        const pos = handAt(n * 30, r * 0.74)
        return (
          <text key={n} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.1} fontWeight="800" fill="#475569">
            {n}
          </text>
        )
      })}
      <line x1={cx} y1={cy} x2={hourTip.x} y2={hourTip.y} stroke="#6366f1" strokeWidth={size * 0.043} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={minTip.x} y2={minTip.y} stroke="#ec4899" strokeWidth={size * 0.028} strokeLinecap="round" />
      {interactive && <circle cx={hourTip.x} cy={hourTip.y} r={grip} fill="#6366f1" opacity={active === 'hour' ? 0.5 : 0.85} onPointerDown={() => setActive('hour')} style={{ cursor: 'grab' }} />}
      {interactive && <circle cx={minTip.x} cy={minTip.y} r={grip} fill="#ec4899" opacity={active === 'minute' ? 0.5 : 0.85} onPointerDown={() => setActive('minute')} style={{ cursor: 'grab' }} />}
      <circle cx={cx} cy={cy} r={size * 0.035} fill="#475569" />
    </svg>
  )
}
