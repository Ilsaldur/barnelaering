import { useEffect, useState } from 'react'
import Stige from './Stige.jsx'
import { TopBar, Mascot } from '../components/ui.jsx'
import { SpeakButton } from '../components/Speak.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { SPOR, LESE_TAK, AAPNER_VED } from '../data/lesing/nivaer.js'
import { genLesing, lagTekstOppgaver } from '../lib/lesing/generatorer.js'

// Lesing er tre spor: Lese, Skrive riktig og Språk. Barnet velger spor selv,
// og reven foreslår det sporet det er lengst siden barnet spilte.
// Skrive riktig og Språk åpner når Lese har nådd nivå 8, og starter på nivå 1
// med «Lær først».

const START_LESE = [
  { id: 'nybegynner', navn: 'Jeg lærer bokstavene', emoji: '🔤', nivaa: 1, tak: LESE_TAK, farge: 'bg-emerald-500' },
  { id: 'lyder', navn: 'Jeg kan bokstavene og trekker sammen lyder', emoji: '🔊', nivaa: 4, tak: LESE_TAK, farge: 'bg-sky-500' },
  { id: 'ord', navn: 'Jeg leser ord og korte setninger', emoji: '💬', nivaa: 6, tak: LESE_TAK, farge: 'bg-violet-500' },
  { id: 'tekst', navn: 'Jeg leser bøker selv', emoji: '📖', nivaa: 8, tak: LESE_TAK, farge: 'bg-amber-500' },
]

// Når spilte barnet hvert spor sist?
function sistSpilt(log, fagId) {
  for (let i = log.length - 1; i >= 0; i--) if (log[i].fag === fagId) return log[i].t
  return 0
}

// Sporet det er lengst siden barnet spilte (blant de åpne).
export function foreslaaSpor(log, aapne) {
  const kandidater = SPOR.filter((s) => aapne.includes(s.id))
  if (!kandidater.length) return 'lesing'
  return kandidater.map((s) => ({ id: s.id, t: sistSpilt(log, s.id) })).sort((a, b) => a.t - b.t)[0].id
}

function SporStige({ def, go }) {
  const { fag, updateFag } = useStars()
  const state = fag[def.id]
  // Skrive riktig og Språk har ingen plasseringstest: start på nivå 1.
  useEffect(() => {
    if (def.id !== 'lesing' && !state.plassert) updateFag(def.id, (f) => ({ ...f, nivaa: 1, plassert: true }))
  }, [def.id, state.plassert, updateFag])
  if (def.id !== 'lesing' && !state.plassert) return null
  const cfg = {
    id: def.id,
    tittel: def.navn,
    kartTittel: `${def.navn}-stigen`,
    emoji: def.emoji,
    nivaer: def.nivaer,
    verdener: def.verdener,
    gen: genLesing,
    tekstOppgaver: lagTekstOppgaver,
    omraadeFor: def.omraadeFor,
    start: def.id === 'lesing' ? START_LESE : [],
    ikoner: (n) => def.omraadeFor(n.id).emoji,
  }
  return <Stige cfg={cfg} go={go} />
}

export default function LeseStige({ go, start = null }) {
  const { fag, log, profile } = useStars()
  const [spor, setSpor] = useState(start)
  const lese = fag.lesing
  const aapent = lese.plassert && (lese.nivaa || 0) >= AAPNER_VED
  const aapne = SPOR.filter((s) => !s.laast || aapent).map((s) => s.id)
  const forslag = foreslaaSpor(log, aapne)

  if (spor) {
    const def = SPOR.find((s) => s.id === spor)
    return <SporStige def={def} go={() => setSpor(null)} />
  }

  const hilsen = aapent ? `Hvilket spor vil du ta i dag? Reven foreslår ${SPOR.find((s) => s.id === forslag).navn.toLowerCase()}.` : `Hei ${profile?.name || ''}! Les deg opp til nivå ${AAPNER_VED}, så åpner Skrive riktig og Språk.`
  return (
    <div className="animate-pop-in">
      <TopBar title="Lesing 📖" onHome={go} />
      <div className="flex justify-center items-start gap-2 mb-4">
        <Mascot message={hilsen} />
        <SpeakButton text={hilsen} />
      </div>
      <div className="grid gap-3 md:gap-4">
        {SPOR.map((s) => {
          const st = fag[s.id]
          const laast = s.laast && !aapent
          const anbefalt = !laast && s.id === forslag && aapent
          return (
            <button
              key={s.id}
              disabled={laast}
              onClick={() => {
                sound.click()
                setSpor(s.id)
              }}
              className={`kid-btn ${laast ? 'bg-white/50 text-slate-500' : `${s.farge} text-white`} p-5 flex items-center gap-4 text-left ${laast ? '' : 'hover:scale-[1.02]'} ${anbefalt ? 'ring-4 ring-amber-300' : ''}`}
            >
              <span className="text-5xl">{laast ? '🔒' : s.emoji}</span>
              <span className="flex-1">
                <span className="block text-2xl font-extrabold">{s.navn}</span>
                <span className="block text-base opacity-90">
                  {laast ? `Åpner når Lese er på nivå ${AAPNER_VED}` : st.plassert && st.nivaa ? `Nivå ${st.nivaa} av ${s.nivaer.length}` : s.id === 'lesing' ? 'Finn nivået ditt' : 'Start på nivå 1 med «Lær først»'}
                </span>
              </span>
              {anbefalt && <span className="bg-amber-400 text-white text-sm font-extrabold px-3 py-1 rounded-full shadow">🦊 Forslag</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
