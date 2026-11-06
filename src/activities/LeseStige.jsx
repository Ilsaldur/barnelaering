import { useState } from 'react'
import { TopBar, Mascot, BigButton, Confetti } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import Oppdrag, { TaskCard } from './Oppdrag.jsx'
import Kart from './Kart.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { NIVAER_LESING, OMRAADER, MAKS_LESING, omraadeFor } from '../data/lesing/nivaer.js'
import { genLesing } from '../lib/lesing/generatorer.js'
import { buildMission, buildBoss, oppgaveFraNivaa } from '../lib/matte/oppdrag.js'
import { applyResult, applyBoss } from '../lib/matte/stige.js'
import { startPlassering, stegPlassering } from '../lib/matte/plassering.js'
import { starsFor } from '../lib/scoring.js'
import { nyeKort } from '../lib/samling.js'
import { kortById } from '../data/kort.js'

// Lesestigen: samme regler som matte, med 16 nivåer i seks områder.
const STIGE = { nivaer: NIVAER_LESING, gen: genLesing }

// Startvalg for plasseringstesten (ingen alder lagres, bare et nivå).
const START = [
  { id: 'nybegynner', navn: 'Jeg lærer bokstavene', emoji: '🔤', nivaa: 1, farge: 'bg-emerald-500' },
  { id: 'lyder', navn: 'Jeg kan bokstavene og trekker sammen lyder', emoji: '🔊', nivaa: 4, farge: 'bg-sky-500' },
  { id: 'ord', navn: 'Jeg leser ord og korte setninger', emoji: '💬', nivaa: 6, farge: 'bg-violet-500' },
  { id: 'tekst', navn: 'Jeg leser bøker selv', emoji: '📖', nivaa: 8, farge: 'bg-amber-500' },
  { id: 'skriver', navn: 'Jeg leser godt og skriver', emoji: '✏️', nivaa: 11, farge: 'bg-rose-500' },
]

function Plassering({ onDone, onHome }) {
  const [start, setStart] = useState(null)
  const [pl, setPl] = useState(null)
  const [task, setTask] = useState(null)
  const intro = 'Først finner reven ut hvor du skal starte i lesing. Hva passer best?'
  useAutoSpeak(start ? '' : intro, [start])

  function velg(v) {
    sound.click()
    setStart(v)
    const s = { ...startPlassering('skog', MAKS_LESING), pos: v.nivaa }
    setPl(s)
    setTask(oppgaveFraNivaa(s.pos, Math.random, STIGE))
  }
  function svar(res) {
    const next = stegPlassering(pl, !!res.ok)
    if (next.ferdig) onDone(next.nivaa)
    else {
      setPl(next)
      setTask(oppgaveFraNivaa(next.pos, Math.random, STIGE))
    }
  }

  if (!start) {
    return (
      <div className="animate-pop-in">
        <TopBar title="Lesing 📖" onHome={onHome} />
        <div className="flex justify-center items-start gap-2 mb-4">
          <Mascot message={intro} />
          <SpeakButton text={intro} />
        </div>
        <div className="grid gap-3">
          {START.map((v) => (
            <button key={v.id} onClick={() => velg(v)} className={`kid-btn ${v.farge} text-white p-4 flex items-center gap-4 hover:scale-[1.02] text-left`}>
              <span className="text-4xl">{v.emoji}</span>
              <span className="text-xl md:text-2xl font-extrabold flex-1">{v.navn}</span>
              <SpeakButton text={v.navn} />
            </button>
          ))}
        </div>
        <p className="text-center text-white/90 font-bold mt-4">Du får 8–12 oppgaver. Det gjør ingenting om noen er for vanskelige!</p>
      </div>
    )
  }
  return (
    <div className="animate-pop-in">
      <TopBar title="Hvor skal du starte? 🧭" onHome={onHome} />
      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${Math.min(100, (pl.steg.length / 10) * 100)}%` }} />
      </div>
      <TaskCard key={pl.steg.length} task={task} attempts={1} onDone={svar} index={pl.steg.length} total={Math.max(8, pl.steg.length + 1)} fag="lesing" />
    </div>
  )
}

export default function LeseStige({ go }) {
  const { fag, updateFag, addStars, profile, data, giKort } = useStars()
  const lesing = fag.lesing
  const [view, setView] = useState('hub')
  const [mission, setMission] = useState(null)
  const [result, setResult] = useState(null)
  const [plassert, setPlassert] = useState(null)

  const def = lesing.nivaa ? NIVAER_LESING[lesing.nivaa - 1] : null
  const omr = lesing.nivaa ? omraadeFor(lesing.nivaa) : null

  function startOppdrag() {
    setMission(buildMission(lesing, { stige: STIGE }))
    setView('oppdrag')
  }
  function startReplay(nivaa) {
    setMission({ ...buildMission({ ...lesing, nivaa, hjelpNeste: false, svake: {} }, { stige: STIGE }), replay: true })
    setView('oppdrag')
  }
  function startSjef() {
    sound.click()
    setMission({ ...buildBoss(lesing.sjef, { stige: STIGE }), sjef: true })
    setView('sjef')
  }

  function ferdigOppdrag(res) {
    let nf, events
    if (mission.replay) {
      const stars = starsFor(res.correct, res.total)
      nf = { ...lesing, beste: { ...lesing.beste, [mission.nivaa]: Math.max(lesing.beste?.[mission.nivaa] || 0, stars) } }
      events = { stars, levelUp: false, boss: null }
    } else {
      ;({ fag: nf, events } = applyResult(lesing, { correct: res.correct, total: res.total, nivaa: mission.nivaa, missedTypes: res.missedTypes }, MAKS_LESING))
    }
    if (events.boss) nf.sjef = events.boss
    updateFag('lesing', nf)
    addStars(events.stars, { correct: res.correct, total: res.total, fag: 'lesing', nivaa: mission.nivaa, oppdrag: true })
    // Lesing gir bonuskort ved godt resultat (nivåkortene hører til matte).
    const kortIds = nyeKort({ eier: data.kort, nivaa: 0, levelUp: false, stars: events.stars })
    for (const id of kortIds) giKort(id)
    setResult({ ...res, stars: events.stars, levelUp: events.levelUp, nyttNivaa: nf.nivaa, sjef: nf.sjef || null, kort: kortIds.map(kortById).filter(Boolean), replay: !!mission.replay })
    setView('resultat')
  }

  function ferdigSjef(res) {
    const { fag: nf, passed } = applyBoss(lesing, { correct: res.correct, target: mission.target })
    nf.sjef = null
    updateFag('lesing', nf)
    const stars = starsFor(res.correct, res.total)
    addStars(stars, { correct: res.correct, total: res.total, fag: 'lesing', nivaa: mission.target, oppdrag: true, sjef: true })
    setResult({ ...res, stars, sjefPassed: passed, nyttNivaa: nf.nivaa, target: mission.target, kort: [] })
    setView('resultat')
  }

  if (!lesing.plassert || !lesing.nivaa) {
    if (view === 'plassert' && plassert) {
      const d = NIVAER_LESING[plassert.nivaa - 1]
      const o = omraadeFor(plassert.nivaa)
      const msg = `Du starter på nivå ${plassert.nivaa}: ${d.tittel}.`
      return (
        <div className="animate-pop-in">
          <Confetti show />
          <TopBar title="Klar! 🎉" onHome={go} />
          <div className="bg-white/95 rounded-3xl p-6 text-center shadow-xl mt-4">
            <div className="text-7xl mb-2">{o.emoji}</div>
            <div className="flex items-start justify-center gap-2">
              <Mascot mood="cheer" message={msg} />
              <SpeakButton text={msg} />
            </div>
            <div className="mt-5">
              <BigButton color="bg-emerald-500" onClick={() => setView('hub')}>
                📖 Til lesestigen
              </BigButton>
            </div>
          </div>
        </div>
      )
    }
    return (
      <Plassering
        onHome={go}
        onDone={(nivaa) => {
          updateFag('lesing', (f) => ({ ...f, nivaa, plassert: true, paaRad: 0, perfektRad: 0, hjelpNeste: false }))
          speech.stop()
          setPlassert({ nivaa })
          setView('plassert')
        }}
      />
    )
  }

  if (view === 'oppdrag' && mission) {
    const o = omraadeFor(mission.nivaa)
    return <Oppdrag tasks={mission.tasks} title={`${mission.replay ? 'Om igjen: nivå' : 'Nivå'} ${mission.nivaa} ${o.emoji}`} hjelpStart={mission.hjelp} onDone={ferdigOppdrag} onHome={go} fag="lesing" />
  }
  if (view === 'sjef' && mission) {
    return <Oppdrag tasks={mission.tasks} title="Sjefsoppgave 👑" onDone={ferdigSjef} onHome={go} fag="lesing" />
  }

  if (view === 'resultat' && result) {
    const nyDef = NIVAER_LESING[result.nyttNivaa - 1]
    return (
      <RoundDone correct={result.correct} total={result.total} stars={result.stars} onAgain={() => setView('hub')} againLabel="📖 Til lesestigen" onHome={go}>
        {result.levelUp && (
          <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
            <span className="text-3xl">🎉</span>
            <span>
              Nivå opp! Nå er du på nivå {result.nyttNivaa}: {nyDef.tittel}
            </span>
          </div>
        )}
        {result.sjefPassed === true && <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg">👑 Du klarte sjefsoppgaven og hoppet til nivå {result.nyttNivaa}!</div>}
        {result.sjefPassed === false && <div className="w-full sm:w-auto bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg">Godt forsøk! Du fortsetter der du var.</div>}
        {result.kort?.length > 0 && (
          <div className="w-full bg-white rounded-2xl px-5 py-3 shadow flex flex-wrap items-center justify-center gap-3">
            <span className="font-extrabold text-slate-600">Bonuskort!</span>
            {result.kort.map((k) => (
              <span key={k.id} className="flex items-center gap-1 bg-amber-50 rounded-xl px-3 py-1 font-bold text-slate-700">
                <span className="text-2xl">{k.emoji}</span> {k.navn}
              </span>
            ))}
          </div>
        )}
        {result.sjef && !result.levelUp && (
          <BigButton color="bg-amber-500" onClick={startSjef}>
            👑 Prøv sjefsoppgaven!
          </BigButton>
        )}
        {!result.replay && (
          <BigButton color="bg-fuchsia-500" onClick={startOppdrag}>
            ▶️ Nytt oppdrag
          </BigButton>
        )}
      </RoundDone>
    )
  }

  const hei = `${profile?.name || ''}, du er på nivå ${lesing.nivaa} i lesing: ${def.tittel}.`
  return (
    <div className="animate-pop-in">
      <TopBar title={`Lesing ${omr.emoji}`} onHome={go} />
      <div className="rounded-3xl p-4 md:p-5 shadow-xl bg-white/95 mb-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl">{omr.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-500">{omr.navn}</p>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Nivå {lesing.nivaa} av {MAKS_LESING}</h2>
            <p className="text-base font-bold text-slate-600">{def.tittel}</p>
          </div>
          <SpeakButton text={hei} />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <BigButton color="bg-emerald-500" className="flex-1" onClick={startOppdrag}>
            ▶️ Start oppdrag
          </BigButton>
          {lesing.sjef && (
            <BigButton color="bg-amber-500" onClick={startSjef}>
              👑 Sjefsoppgave
            </BigButton>
          )}
        </div>
        <p className="text-center text-sm font-bold text-slate-500 mt-3">{def.lengde === 5 ? 'Fem oppgaver med tekst.' : 'Åtte oppgaver, to forsøk på hver.'} Trykk på et nivå du har passert for å øve mer.</p>
      </div>
      <Kart matte={lesing} onStart={startOppdrag} onReplay={startReplay} nivaer={NIVAER_LESING} verdener={OMRAADER} ikoner={(n) => omraadeFor(n.id).emoji} />
    </div>
  )
}
