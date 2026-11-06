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
import { buildMission, buildBoss, oppgaveTilPlassering } from '../lib/matte/oppdrag.js'
import { applyResult, applyBoss, settNivaa } from '../lib/matte/stige.js'
import { oppdaterBoks } from '../lib/matte/kort.js'
import { startPlassering, stegPlassering, maksOppgaver } from '../lib/matte/plassering.js'
import { starsFor } from '../lib/scoring.js'
import { nyeKort } from '../lib/samling.js'
import { kortById } from '../data/kort.js'

// Én felles stige for alle fag. `cfg` beskriver faget:
//   id, tittel, nivaer, verdener, gen, omraadeFor(id),
//   start: [{ id, navn, emoji, nivaa, tak, farge }], kortPerNivaa (bool),
//   historieFor(verdenId), ekstra (knapper på hub), hubEkstra, ikoner(n), kartTittel
export default function Stige({ cfg, go }) {
  const { fag, updateFag, addStars, updateSettings, profile, data, giKort, markHistorie } = useStars()
  const state = fag[cfg.id]
  const STIGE = { nivaer: cfg.nivaer, gen: cfg.gen }
  const MAKS = cfg.nivaer.length
  const [view, setView] = useState('hub')
  const [mission, setMission] = useState(null)
  const [result, setResult] = useState(null)
  const [plassert, setPlassert] = useState(null)

  const def = state.nivaa ? cfg.nivaer[state.nivaa - 1] : null
  const omr = state.nivaa ? cfg.omraadeFor(state.nivaa) : null

  function startOppdrag() {
    setMission(buildMission(state, { stige: STIGE }))
    setView('oppdrag')
  }
  function startReplay(nivaa) {
    setMission({ ...buildMission({ ...state, nivaa, hjelpNeste: false, svake: {} }, { stige: STIGE }), replay: true })
    setView('oppdrag')
  }
  function startSjef(target) {
    sound.click()
    setMission({ ...buildBoss(state.nivaa, target, { stige: STIGE }), sjef: true })
    setView('sjef')
  }

  function delUtKort(ids) {
    for (const id of ids) giKort(id)
    return ids.map((id) => kortById(id)).filter(Boolean)
  }

  function ferdigOppdrag(res) {
    let nf, events
    if (mission.replay) {
      const stars = starsFor(res.correct, res.total)
      nf = { ...state, beste: { ...state.beste, [mission.nivaa]: Math.max(state.beste?.[mission.nivaa] || 0, stars) } }
      events = { stars, levelUp: false, levelDown: false, boss: null }
    } else {
      ;({ fag: nf, events } = applyResult(state, { correct: res.correct, total: res.total, nivaa: mission.nivaa, perTask: res.perTask }, MAKS))
    }
    let bokser = nf.bokser || {}
    for (const r of res.perTask) if (r.kortId) bokser = oppdaterBoks(bokser, r.kortId, r.ok && r.forste)
    nf.bokser = bokser
    updateFag(cfg.id, nf)
    addStars(events.stars, { correct: res.correct, total: res.total, fag: cfg.id, nivaa: mission.nivaa, oppdrag: true })
    const kort = delUtKort(nyeKort({ eier: data.kort, nivaa: cfg.kortPerNivaa ? mission.nivaa : 0, levelUp: events.levelUp, stars: events.stars }))
    setResult({ ...res, stars: events.stars, levelUp: events.levelUp, levelDown: events.levelDown, nyttNivaa: nf.nivaa, boss: events.boss, kort, replay: !!mission.replay })
    setView('resultat')
  }

  function ferdigSjef(res) {
    const { fag: nf, passed } = applyBoss(state, { correct: res.correct, target: mission.target })
    updateFag(cfg.id, nf)
    const stars = starsFor(res.correct, res.total)
    addStars(stars, { correct: res.correct, total: res.total, fag: cfg.id, nivaa: mission.target, oppdrag: true, sjef: true })
    const kort = passed && cfg.kortPerNivaa ? delUtKort(Array.from({ length: mission.target - state.nivaa }, (_, i) => state.nivaa + i).flatMap((n) => nyeKort({ eier: data.kort, nivaa: n, levelUp: true, stars: 0, rng: () => 1 }))) : []
    setResult({ ...res, stars, sjefPassed: passed, nyttNivaa: nf.nivaa, target: mission.target, kort })
    setView('resultat')
  }

  // ---- Plassering ----
  if (!state.plassert || !state.nivaa) {
    if (view === 'plassert' && plassert) {
      const d = cfg.nivaer[plassert.nivaa - 1]
      const o = cfg.omraadeFor(plassert.nivaa)
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
            <p className="text-slate-500 font-semibold mt-3">Blir det for lett eller for vanskelig, flytter reven deg etter hvert som du spiller.</p>
            <div className="mt-5">
              <BigButton color="bg-emerald-500" onClick={() => setView('hub')}>
                {cfg.kartTittel ? `🗺️ Til ${cfg.kartTittel.toLowerCase()}` : '▶️ Videre'}
              </BigButton>
            </div>
          </div>
        </div>
      )
    }
    return (
      <Plassering
        cfg={cfg}
        stige={STIGE}
        onHome={go}
        onDone={(nivaa, startId) => {
          updateFag(cfg.id, (f) => settNivaa(f, nivaa))
          if (cfg.id === 'matte') updateSettings({ startverden: startId })
          speech.stop()
          setPlassert({ nivaa })
          setView('plassert')
        }}
      />
    )
  }

  if (view === 'oppdrag' && mission) {
    const o = cfg.omraadeFor(mission.nivaa)
    return <Oppdrag tasks={mission.tasks} title={`${mission.replay ? 'Om igjen: nivå' : 'Nivå'} ${mission.nivaa} ${o.emoji}`} hjelpStart={mission.hjelp} onDone={ferdigOppdrag} onHome={go} fag={cfg.id} />
  }
  if (view === 'sjef' && mission) {
    return <Oppdrag tasks={mission.tasks} title="Sjefsoppgave 👑" onDone={ferdigSjef} onHome={go} fag={cfg.id} attempts={1} noHelp />
  }

  if (view === 'resultat' && result) {
    const nyDef = cfg.nivaer[result.nyttNivaa - 1]
    const nyO = cfg.omraadeFor(result.nyttNivaa)
    return (
      <RoundDone correct={result.correct} total={result.total} stars={result.stars} onAgain={() => setView('hub')} againLabel={`${cfg.emoji} Til ${(cfg.kartTittel || cfg.tittel).toLowerCase()}`} onHome={go}>
        {result.levelUp && (
          <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
            <span className="text-3xl">🎉</span>
            <span>
              Nivå opp! Nå er du på nivå {result.nyttNivaa}: {nyDef.tittel} {nyO.emoji}
            </span>
          </div>
        )}
        {result.levelDown && (
          <div className="w-full sm:w-auto bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
            <span className="text-3xl">🦊</span>
            <span>Reven tar deg med til nivå {result.nyttNivaa} en stund, så det blir litt lettere. Det er lurt å øve der det passer!</span>
          </div>
        )}
        {result.sjefPassed === true && <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg">👑 Du klarte sjefsoppgaven og hoppet til nivå {result.nyttNivaa}!</div>}
        {result.sjefPassed === false && <div className="w-full sm:w-auto bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg">Godt forsøk! Du fortsetter der du var, og får nytt tilbud neste gang du klarer alle åtte.</div>}
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
        {result.boss && (
          <div className="w-full sm:w-auto bg-amber-50 rounded-2xl px-5 py-3 flex flex-col items-center gap-2">
            <p className="font-extrabold text-amber-700">Alle åtte riktige! Vil du prøve sjefsoppgaven og hoppe til nivå {result.boss}?</p>
            <p className="text-sm font-bold text-slate-500">Fem oppgaver, ett forsøk på hver. Fire riktige gir hopp. Du mister ingenting om det ikke går.</p>
            <BigButton color="bg-amber-500" onClick={() => startSjef(result.boss)}>
              👑 Ja, prøv sjefsoppgaven!
            </BigButton>
          </div>
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
  const historie = cfg.historieFor ? cfg.historieFor(omr.id) : null
  const visHistorie = historie && !(data.historier || []).includes(historie.id)
  const hei = `${profile?.name || ''}, du er på nivå ${state.nivaa} i ${cfg.tittel.toLowerCase()}: ${def.tittel}.`
  return (
    <div className="animate-pop-in">
      {visHistorie && <Historie historie={historie} verden={omr} onDone={() => markHistorie(historie.id)} />}
      <TopBar title={`${cfg.kartTittel || cfg.tittel} ${omr.emoji}`} onHome={go} />
      <div className="rounded-3xl p-4 md:p-5 shadow-xl bg-white/95 mb-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl">{omr.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-500">
              {omr.navn} · {profile?.name || ''}
            </p>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Nivå {state.nivaa} av {MAKS}</h2>
            <p className="text-base font-bold text-slate-600">{def.tittel}</p>
          </div>
          <SpeakButton text={hei} />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <BigButton color="bg-emerald-500" className="flex-1" onClick={startOppdrag}>
            ▶️ Start oppdrag
          </BigButton>
          {cfg.ekstra}
        </div>
        <p className="text-center text-sm font-bold text-slate-500 mt-3">{def.lengde === 5 ? 'Fem oppgaver.' : 'Åtte oppgaver, to forsøk på hver.'} Alle åtte riktige gir tilbud om sjefsoppgave. Trykk på et nivå du har passert for å øve mer.</p>
      </div>
      {cfg.hubEkstra}
      <Kart matte={state} onStart={startOppdrag} onReplay={startReplay} nivaer={cfg.nivaer} verdener={cfg.verdener} ikoner={cfg.ikoner} />
    </div>
  )
}

function Plassering({ cfg, stige, onDone, onHome }) {
  const [start, setStart] = useState(null)
  const [pl, setPl] = useState(null)
  const [task, setTask] = useState(null)
  const intro = cfg.intro || `Først finner reven ut hvor du skal starte i ${cfg.tittel.toLowerCase()}. Hva passer best?`
  useAutoSpeak(start ? '' : intro, [start])

  function velg(v) {
    sound.click()
    setStart(v)
    const s = startPlassering({ start: v.nivaa, tak: v.tak ?? cfg.nivaer.length, maks: cfg.nivaer.length })
    setPl(s)
    setTask(oppgaveTilPlassering(s.pos, Math.random, stige))
  }
  function svar(res) {
    const next = stegPlassering(pl, !!res.ok)
    if (next.ferdig) onDone(next.nivaa, start.id)
    else {
      setPl(next)
      setTask(oppgaveTilPlassering(next.pos, Math.random, stige))
    }
  }

  if (!start) {
    return (
      <div className="animate-pop-in">
        <TopBar title={`${cfg.tittel} ${cfg.emoji}`} onHome={onHome} />
        <div className="flex justify-center items-start gap-2 mb-4">
          <Mascot message={intro} />
          <SpeakButton text={intro} />
        </div>
        <div className={`grid gap-3 ${cfg.start.length > 3 ? 'md:grid-cols-2' : ''}`}>
          {cfg.start.map((v) => (
            <button key={v.id} onClick={() => velg(v)} className={`kid-btn ${v.farge} text-white p-4 md:p-5 flex items-center gap-4 hover:scale-[1.02] text-left`}>
              <span className="text-4xl md:text-5xl">{v.emoji}</span>
              <span className="flex-1">
                <span className="block text-xl md:text-2xl font-extrabold">{v.navn}</span>
                {v.under && <span className="block text-base opacity-90">{v.under}</span>}
              </span>
              <SpeakButton text={v.navn} />
            </button>
          ))}
        </div>
        <p className="text-center text-white/90 font-bold mt-4">Noen få oppgaver, to på hvert nivå. Det gjør ingenting om noen er for vanskelige!</p>
      </div>
    )
  }
  const maks = maksOppgaver(pl)
  return (
    <div className="animate-pop-in">
      <TopBar title="Hvor skal du starte? 🧭" onHome={onHome} />
      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${Math.min(100, (pl.steg.length / maks) * 100)}%` }} />
      </div>
      <TaskCard key={pl.steg.length} task={task} attempts={1} noHelp onDone={svar} index={pl.steg.length} total={maks} fag={cfg.id} placement />
    </div>
  )
}
