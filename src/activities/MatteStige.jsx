import { useState } from 'react'
import { TopBar, Mascot, BigButton, Confetti } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import Historie from '../components/Historie.jsx'
import Oppdrag, { TaskCard } from './Oppdrag.jsx'
import Kart from './Kart.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { VERDENER, MAKS, nivaa as nivaaDef, verdenFor } from '../data/matte/nivaer.js'
import { kortById } from '../data/kort.js'
import { historieForVerden } from '../data/historier.js'
import { buildMission, buildBoss, oppgaveFraNivaa } from '../lib/matte/oppdrag.js'
import { applyResult, applyBoss } from '../lib/matte/stige.js'
import { oppdaterBoks } from '../lib/matte/kort.js'
import { startPlassering, stegPlassering } from '../lib/matte/plassering.js'
import { starsFor } from '../lib/scoring.js'
import { nyeKort } from '../lib/samling.js'

// Mattestigen: plasseringstest første gang, så oppdrag på barnets nivå.
// Eventyrkartet er selve framgangen: reven står på nivået barnet er på.

function Plassering({ onDone, onHome }) {
  const [verden, setVerden] = useState(null)
  const [pl, setPl] = useState(null)
  const [task, setTask] = useState(null)
  const intro = 'Først finner reven ut hvor du skal starte. Hvor vil du begynne?'
  useAutoSpeak(verden ? '' : intro, [verden])

  function velg(v) {
    sound.click()
    setVerden(v.id)
    const s = startPlassering(v.id, MAKS)
    setPl(s)
    setTask(oppgaveFraNivaa(s.pos))
  }

  function svar(res) {
    const next = stegPlassering(pl, !!res.ok)
    if (next.ferdig) onDone(next.nivaa, verden)
    else {
      setPl(next)
      setTask(oppgaveFraNivaa(next.pos))
    }
  }

  if (!verden) {
    return (
      <div className="animate-pop-in">
        <TopBar title="Matte 🔢" onHome={onHome} />
        <div className="flex justify-center items-start gap-2 mb-4">
          <Mascot message={intro} />
          <SpeakButton text={intro} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {VERDENER.map((v) => (
            <button key={v.id} onClick={() => velg(v)} className={`kid-btn ${v.farge} text-white p-5 flex items-center gap-4 hover:scale-[1.02] text-left`}>
              <span className="text-5xl">{v.emoji}</span>
              <span>
                <span className="block text-2xl font-extrabold">{v.navn}</span>
                <span className="block text-base opacity-90">{v.trinn}</span>
              </span>
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
      <TaskCard key={pl.steg.length} task={task} attempts={1} onDone={svar} index={pl.steg.length} total={Math.max(8, pl.steg.length + 1)} />
    </div>
  )
}

export default function MatteStige({ go, onNoetter }) {
  const { fag, updateFag, addStars, updateSettings, profile, data, giKort, markHistorie } = useStars()
  const matte = fag.matte
  const [view, setView] = useState('hub') // hub | oppdrag | sjef | resultat | plassert
  const [mission, setMission] = useState(null)
  const [result, setResult] = useState(null)
  const [plassert, setPlassert] = useState(null)

  const def = matte.nivaa ? nivaaDef(matte.nivaa) : null
  const verden = matte.nivaa ? verdenFor(matte.nivaa) : null

  function startOppdrag() {
    setMission(buildMission(matte))
    setView('oppdrag')
  }
  function startReplay(nivaa) {
    setMission({ ...buildMission({ ...matte, nivaa, hjelpNeste: false, svake: {} }), replay: true })
    setView('oppdrag')
  }
  function startSjef() {
    sound.click()
    setMission({ ...buildBoss(matte.sjef), sjef: true })
    setView('sjef')
  }

  function delUtKort(ids) {
    for (const id of ids) giKort(id)
    return ids.map((id) => kortById(id)).filter(Boolean)
  }

  function ferdigOppdrag(res) {
    let nf, events
    if (mission.replay) {
      // Om igjen på et tidligere nivå: bare stjerner og kort, ikke nivået.
      const stars = starsFor(res.correct, res.total)
      nf = { ...matte, beste: { ...matte.beste, [mission.nivaa]: Math.max(matte.beste?.[mission.nivaa] || 0, stars) } }
      events = { stars, levelUp: false, boss: null }
    } else {
      ;({ fag: nf, events } = applyResult(matte, { correct: res.correct, total: res.total, nivaa: mission.nivaa, missedTypes: res.missedTypes }, MAKS))
    }
    let bokser = nf.bokser || {}
    for (const r of res.perTask) if (r.kortId) bokser = oppdaterBoks(bokser, r.kortId, r.ok && r.forste)
    nf.bokser = bokser
    if (events.boss) nf.sjef = events.boss
    updateFag('matte', nf)
    addStars(events.stars, { correct: res.correct, total: res.total, fag: 'matte', nivaa: mission.nivaa, oppdrag: true })
    const kort = delUtKort(nyeKort({ eier: data.kort, nivaa: mission.nivaa, levelUp: events.levelUp, stars: events.stars }))
    setResult({ ...res, stars: events.stars, levelUp: events.levelUp, nyttNivaa: nf.nivaa, sjef: nf.sjef || null, kort, replay: !!mission.replay })
    setView('resultat')
  }

  function ferdigSjef(res) {
    const { fag: nf, passed } = applyBoss(matte, { correct: res.correct, target: mission.target })
    nf.sjef = null
    updateFag('matte', nf)
    const stars = starsFor(res.correct, res.total)
    addStars(stars, { correct: res.correct, total: res.total, fag: 'matte', nivaa: mission.target, oppdrag: true, sjef: true })
    // Hopper man over nivåer, får man kortene for dem også.
    const kort = passed ? delUtKort(Array.from({ length: mission.target - matte.nivaa }, (_, i) => matte.nivaa + i).flatMap((n) => nyeKort({ eier: data.kort, nivaa: n, levelUp: true, stars: 0, rng: () => 1 }))) : []
    setResult({ ...res, stars, sjefPassed: passed, nyttNivaa: nf.nivaa, target: mission.target, kort })
    setView('resultat')
  }

  if (!matte.plassert || !matte.nivaa) {
    if (view === 'plassert' && plassert) {
      const d = nivaaDef(plassert.nivaa)
      const v = verdenFor(plassert.nivaa)
      const msg = `Du starter på nivå ${plassert.nivaa} i ${v.navn}: ${d.tittel}.`
      return (
        <div className="animate-pop-in">
          <Confetti show />
          <TopBar title="Klar! 🎉" onHome={go} />
          <div className="bg-white/95 rounded-3xl p-6 text-center shadow-xl mt-4">
            <div className="text-7xl mb-2">{v.emoji}</div>
            <div className="flex items-start justify-center gap-2">
              <Mascot mood="cheer" message={msg} />
              <SpeakButton text={msg} />
            </div>
            <p className="text-slate-500 font-semibold mt-3">Blir det for lett eller for vanskelig, flytter reven deg etter hvert som du spiller.</p>
            <div className="mt-5">
              <BigButton color="bg-emerald-500" onClick={() => setView('hub')}>
                🗺️ Til kartet
              </BigButton>
            </div>
          </div>
        </div>
      )
    }
    return (
      <Plassering
        onHome={go}
        onDone={(nivaa, verdenId) => {
          updateFag('matte', (f) => ({ ...f, nivaa, plassert: true, paaRad: 0, perfektRad: 0, hjelpNeste: false }))
          updateSettings({ startverden: verdenId })
          speech.stop()
          setPlassert({ nivaa })
          setView('plassert')
        }}
      />
    )
  }

  if (view === 'oppdrag' && mission) {
    const v = verdenFor(mission.nivaa)
    return <Oppdrag tasks={mission.tasks} title={`${mission.replay ? 'Om igjen: nivå' : 'Nivå'} ${mission.nivaa} ${v.emoji}`} hjelpStart={mission.hjelp} onDone={ferdigOppdrag} onHome={go} fag="matte" />
  }
  if (view === 'sjef' && mission) {
    return <Oppdrag tasks={mission.tasks} title="Sjefsoppgave 👑" onDone={ferdigSjef} onHome={go} fag="matte" />
  }

  if (view === 'resultat' && result) {
    const nyDef = nivaaDef(result.nyttNivaa)
    const nyV = verdenFor(result.nyttNivaa)
    return (
      <RoundDone correct={result.correct} total={result.total} stars={result.stars} onAgain={() => setView('hub')} againLabel="🗺️ Til kartet" onHome={go}>
        {result.levelUp && (
          <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
            <span className="text-3xl">🎉</span>
            <span>
              Nivå opp! Reven går til nivå {result.nyttNivaa}: {nyDef.tittel} {nyV.emoji}
            </span>
          </div>
        )}
        {result.sjefPassed === true && <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg">👑 Du klarte sjefsoppgaven og hoppet til nivå {result.nyttNivaa}!</div>}
        {result.sjefPassed === false && <div className="w-full sm:w-auto bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg">Godt forsøk! Du fortsetter der du var, og kan prøve igjen senere.</div>}
        {result.kort?.length > 0 && (
          <div className="w-full bg-white rounded-2xl px-5 py-3 shadow flex flex-wrap items-center justify-center gap-3">
            <span className="font-extrabold text-slate-600">{result.kort.length === 1 ? 'Nytt samlekort!' : 'Nye samlekort!'}</span>
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

  // ---- Hub: kartet ----
  const historie = historieForVerden(verden.id)
  const visHistorie = historie && !(data.historier || []).includes(historie.id)
  const hei = `Reven er på nivå ${matte.nivaa}: ${def.tittel}.`
  return (
    <div className="animate-pop-in">
      {visHistorie && <Historie historie={historie} verden={verden} onDone={() => markHistorie(historie.id)} />}
      <TopBar title={`Eventyrkartet ${verden.emoji}`} onHome={go} />
      <div className={`rounded-3xl p-4 md:p-5 shadow-xl bg-white/95 mb-4`}>
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl">{verden.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-500">
              {verden.navn} · {profile?.name || ''}
            </p>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Nivå {matte.nivaa} av {MAKS}</h2>
            <p className="text-base font-bold text-slate-600">{def.tittel}</p>
          </div>
          <SpeakButton text={hei} />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <BigButton color="bg-emerald-500" className="flex-1" onClick={startOppdrag}>
            ▶️ Start oppdrag
          </BigButton>
          {matte.sjef && (
            <BigButton color="bg-amber-500" onClick={startSjef}>
              👑 Sjefsoppgave
            </BigButton>
          )}
          <BigButton color="bg-amber-700" onClick={onNoetter}>
            🌰 Nøttehula
          </BigButton>
        </div>
        <p className="text-center text-sm font-bold text-slate-500 mt-3">Åtte oppgaver, to forsøk på hver. Trykk på et sted du har passert for å spille det om igjen og få flere stjerner.</p>
      </div>

      <Kart matte={matte} onStart={startOppdrag} onReplay={startReplay} />
    </div>
  )
}
