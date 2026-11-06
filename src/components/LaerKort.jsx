import { useEffect, useState } from 'react'
import { BigButton } from './ui.jsx'
import { SpeakButton } from './Speak.jsx'
import { Visual, Help } from './TaskVisual.jsx'
import { TaskCard } from '../activities/Oppdrag.jsx'
import { speech } from '../speech.js'
import { sound } from '../sound.js'
import { oppgaveFraNivaa } from '../lib/matte/oppdrag.js'

// «Lær først»-kort: tre–fire korte skjermer som alltid leses opp, og til slutt
// «Prøv selv» med tre oppgaver fra nivåets generator der ingenting teller.
//   modus 'forst'  → vises før et oppdrag, med «Jeg kan dette» og «Prøv selv»
//   modus 'laer'   → åpnet fra Lær-knappen i en oppgave, uten «Prøv selv»
export default function LaerKort({ kort, stige, modus = 'forst', onDone, onSkip, fag }) {
  const [i, setI] = useState(0)
  const [prov, setProv] = useState(null) // oppgaver i «Prøv selv»
  const [pi, setPi] = useState(0)
  const steg = kort.steg[i]
  const sisteSteg = i === kort.steg.length - 1
  const tekst = steg?.tekst || ''

  useEffect(() => {
    if (prov) return
    if (tekst) speech.speak(`${i === 0 ? kort.tittel + '. ' : ''}${tekst}`)
    return () => speech.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, prov])

  function startProv() {
    sound.click()
    speech.stop()
    const tasks = Array.from({ length: 3 }, () => oppgaveFraNivaa(kort.nivaa, Math.random, stige))
    setProv(tasks)
    setPi(0)
  }

  if (prov) {
    const task = prov[pi]
    return (
      <div className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center p-3 overflow-y-auto">
        <div className="w-full max-w-2xl my-4">
          <div className="bg-white rounded-3xl px-5 py-3 shadow-xl mb-3 flex items-center justify-between">
            <span className="font-extrabold text-slate-700">🧪 Prøv selv · {pi + 1} av {prov.length}</span>
            <span className="text-xs font-bold text-slate-400">teller ikke</span>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl">
            <TaskCard
              key={pi}
              task={task}
              attempts={1}
              practice
              fag={fag}
              index={pi}
              total={prov.length}
              onDone={() => {
                if (pi + 1 >= prov.length) onDone()
                else setPi(pi + 1)
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 md:p-7 shadow-2xl max-w-xl w-full animate-pop-in max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-700">📚 {kort.tittel}</h2>
          <span className="text-sm font-bold text-slate-400">
            {i + 1} / {kort.steg.length}
          </span>
        </div>
        <div className="flex gap-1 mb-4">
          {kort.steg.map((_, k) => (
            <span key={k} className={`h-2 flex-1 rounded-full ${k <= i ? 'bg-violet-400' : 'bg-slate-200'}`} />
          ))}
        </div>

        {steg.figur?.visual && (
          <div className="mb-4">
            <Visual visual={steg.figur.visual} />
          </div>
        )}
        {steg.figur?.hjelp && (
          <div className="mb-4 bg-sky-50 rounded-2xl p-3">
            <Help hjelp={steg.figur.hjelp} />
          </div>
        )}

        <div className="flex items-start gap-2 bg-amber-50 rounded-2xl p-4">
          <p className="text-slate-700 font-semibold text-lg md:text-xl leading-relaxed flex-1">{tekst}</p>
          <SpeakButton text={tekst} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between mt-5">
          <div className="flex gap-2">
            {i > 0 && (
              <BigButton color="bg-slate-300" className="!text-lg !px-5 !py-3" onClick={() => setI(i - 1)}>
                ⬅️
              </BigButton>
            )}
            {!sisteSteg && (
              <BigButton color="bg-violet-500" className="!text-lg !px-5 !py-3" onClick={() => setI(i + 1)}>
                Neste ➡️
              </BigButton>
            )}
            {sisteSteg && modus === 'forst' && (
              <BigButton color="bg-emerald-500" className="!text-lg !px-5 !py-3" onClick={startProv}>
                🧪 Prøv selv
              </BigButton>
            )}
            {sisteSteg && modus === 'laer' && (
              <BigButton color="bg-emerald-500" className="!text-lg !px-5 !py-3" onClick={onDone}>
                ✅ Tilbake til oppgaven
              </BigButton>
            )}
          </div>
          <button
            onClick={() => {
              sound.click()
              speech.stop()
              onSkip ? onSkip() : onDone()
            }}
            className="text-sm font-bold text-slate-400 underline hover:text-slate-600 self-center"
          >
            {modus === 'forst' ? 'Jeg kan dette – til oppdraget' : 'Lukk'}
          </button>
        </div>
      </div>
    </div>
  )
}
