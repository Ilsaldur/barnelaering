import { useState } from 'react'
import { useStarsOptional } from '../StarContext.jsx'
import { kostymeById } from '../data/kostymer.js'
import { NIVAER, VERDENER } from '../data/matte/nivaer.js'
import { sound } from '../sound.js'

// Eventyrkartet: hvert nivå er et sted, reven står på nivået barnet er på.
// Steder barnet har passert kan spilles om igjen for å forbedre stjernene.
// Steder lenger fram er låst til reven kommer dit.

function Fox({ className = '' }) {
  const ctx = useStarsOptional()
  const k = ctx?.data?.kostyme ? kostymeById(ctx.data.kostyme) : null
  return (
    <span className={`relative inline-block ${className}`}>
      🦊{k && <span className="absolute -top-[0.35em] left-1/2 -translate-x-1/2 text-[0.55em]">{k.emoji}</span>}
    </span>
  )
}

export default function Kart({ matte, onStart, onReplay }) {
  const cur = matte.nivaa || 1
  const [msg, setMsg] = useState(null)

  function tap(n) {
    if (n.id === cur) {
      sound.click()
      onStart()
    } else if (n.id < cur) {
      sound.click()
      onReplay(n.id)
    } else {
      sound.wrong()
      setMsg(`🔒 Nivå ${n.id} åpner seg når reven kommer dit. Klar nivå ${cur} først!`)
      setTimeout(() => setMsg(null), 2500)
    }
  }

  return (
    <div className="space-y-4">
      {msg && <div className="bg-white/95 rounded-2xl px-4 py-3 text-center font-bold text-slate-600 shadow animate-pop-in">{msg}</div>}
      {VERDENER.map((v) => {
        const levels = NIVAER.filter((n) => n.verden === v.id)
        const here = cur >= v.fra && cur <= v.til
        const passed = cur > v.til
        return (
          <section key={v.id} className={`rounded-3xl p-4 md:p-5 shadow-xl bg-gradient-to-br ${v.gradient} ${here ? 'ring-4 ring-white' : passed ? '' : 'opacity-80'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                <span className="text-3xl">{v.emoji}</span> {v.navn}
              </h3>
              <span className="text-xs md:text-sm font-bold text-slate-700/70">
                {passed ? '✅ ferdig' : here ? 'du er her' : `åpner etter nivå ${v.fra - 1}`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              {levels.map((n, i) => {
                const stars = matte.beste?.[n.id] || 0
                const isHere = n.id === cur
                const done = n.id < cur
                const locked = n.id > cur
                // Slangesti: annenhver rad går motsatt vei.
                const row = Math.floor(i / 4)
                const col = row % 2 === 0 ? i % 4 : 3 - (i % 4)
                return (
                  <button
                    key={n.id}
                    onClick={() => tap(n)}
                    title={`Nivå ${n.id}: ${n.tittel}`}
                    aria-label={`Nivå ${n.id}: ${n.tittel}${locked ? ' (låst)' : ''}`}
                    style={{ gridColumn: col + 1, gridRow: row + 1 }}
                    className={`relative flex flex-col items-center justify-center rounded-3xl h-20 md:h-24 transition-transform ${
                      isHere ? 'bg-white shadow-xl scale-105 ring-4 ring-amber-300' : done ? 'bg-white/90 shadow hover:scale-105' : 'bg-white/40 text-slate-500'
                    }`}
                  >
                    {isHere ? <Fox className="text-4xl md:text-5xl animate-bouncey" /> : locked ? <span className="text-2xl">🔒</span> : <span className="text-2xl md:text-3xl">{n.id <= 6 ? '🌼' : n.id <= 14 ? '🐚' : n.id <= 22 ? '🪨' : n.id <= 30 ? '🏵️' : '⭐'}</span>}
                    <span className={`text-xs md:text-sm font-extrabold ${isHere ? 'text-amber-600' : 'text-slate-600'}`}>Nivå {n.id}</span>
                    {stars > 0 && <span className="absolute -top-2 bg-white rounded-full px-1.5 text-[11px] leading-5 shadow">{'⭐'.repeat(stars)}</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
