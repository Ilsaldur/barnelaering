import { useState } from 'react'
import { TopBar, Mascot, BigButton, Confetti } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import Oppdrag, { TaskCard } from './Oppdrag.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { NIVAER, VERDENER, MAKS, nivaa as nivaaDef, verdenFor } from '../data/matte/nivaer.js'
import { buildMission, buildBoss, oppgaveFraNivaa } from '../lib/matte/oppdrag.js'
import { applyResult, applyBoss } from '../lib/matte/stige.js'
import { oppdaterBoks } from '../lib/matte/kort.js'
import { startPlassering, stegPlassering } from '../lib/matte/plassering.js'
import { starsFor } from '../lib/scoring.js'

// Mattestigen: plasseringstest første gang, så oppdrag på barnets nivå.
// Nivået følger barnet (src/lib/matte/stige.js), ikke klassetrinnet.

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

function NivaaOversikt({ matte }) {
  const cur = matte.nivaa
  return (
    <div className="space-y-3 mt-6">
      {VERDENER.map((v) => {
        const levels = NIVAER.filter((n) => n.verden === v.id)
        const here = cur >= v.fra && cur <= v.til
        return (
          <div key={v.id} className={`rounded-3xl p-4 shadow-lg ${here ? 'bg-white/95' : 'bg-white/60'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg md:text-xl font-extrabold text-slate-700">
                {v.emoji} {v.navn}
              </h3>
              <span className="text-xs font-bold text-slate-400">nivå {v.fra}–{v.til}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((n) => {
                const stars = matte.beste?.[n.id] || 0
                const isHere = n.id === cur
                const passed = n.id < cur
                return (
                  <div
                    key={n.id}
                    title={`Nivå ${n.id}: ${n.tittel}`}
                    className={`relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-sm font-extrabold ${
                      isHere ? `${v.farge} text-white ring-4 ring-amber-300 scale-110` : passed || stars ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isHere ? <span className="text-xl">🦊</span> : n.id}
                    {stars > 0 && <span className="absolute -bottom-2 text-[10px] leading-none bg-white rounded-full px-1 shadow">{'⭐'.repeat(stars)}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function MatteStige({ go, onNoetter }) {
  const { fag, updateFag, addStars, finishOppdrag, updateSettings, profile } = useStars()
  const matte = fag.matte
  const [view, setView] = useState('hub') // hub | plassering | oppdrag | sjef | resultat | plassert
  const [mission, setMission] = useState(null)
  const [result, setResult] = useState(null)
  const [plassert, setPlassert] = useState(null)

  const def = matte.nivaa ? nivaaDef(matte.nivaa) : null
  const verden = matte.nivaa ? verdenFor(matte.nivaa) : null

  function startOppdrag() {
    sound.click()
    setMission(buildMission(matte))
    setView('oppdrag')
  }
  function startSjef() {
    sound.click()
    setMission({ ...buildBoss(matte.sjef), sjef: true })
    setView('sjef')
  }

  function ferdigOppdrag(res) {
    const { fag: nf, events } = applyResult(matte, { correct: res.correct, total: res.total, nivaa: mission.nivaa, missedTypes: res.missedTypes }, MAKS)
    let bokser = nf.bokser || {}
    for (const r of res.perTask) if (r.kortId) bokser = oppdaterBoks(bokser, r.kortId, r.ok && r.forste)
    nf.bokser = bokser
    if (events.boss) nf.sjef = events.boss
    updateFag('matte', nf)
    addStars(events.stars, { correct: res.correct, total: res.total, fag: 'matte', nivaa: mission.nivaa, oppdrag: true })
    finishOppdrag()
    setResult({ ...res, stars: events.stars, levelUp: events.levelUp, nyttNivaa: nf.nivaa, sjef: nf.sjef || null })
    setView('resultat')
  }

  function ferdigSjef(res) {
    const { fag: nf, passed } = applyBoss(matte, { correct: res.correct, target: mission.target })
    nf.sjef = null
    updateFag('matte', nf)
    const stars = starsFor(res.correct, res.total)
    addStars(stars, { correct: res.correct, total: res.total, fag: 'matte', nivaa: mission.target, oppdrag: true, sjef: true })
    finishOppdrag()
    setResult({ ...res, stars, sjefPassed: passed, nyttNivaa: nf.nivaa, target: mission.target })
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
                ▶️ Start første oppdrag
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
    return <Oppdrag tasks={mission.tasks} title={`Nivå ${mission.nivaa} ${verden.emoji}`} hjelpStart={mission.hjelp} onDone={ferdigOppdrag} onHome={go} fag="matte" />
  }
  if (view === 'sjef' && mission) {
    return <Oppdrag tasks={mission.tasks} title="Sjefsoppgave 👑" onDone={ferdigSjef} onHome={go} fag="matte" />
  }

  if (view === 'resultat' && result) {
    const nyDef = nivaaDef(result.nyttNivaa)
    const nyV = verdenFor(result.nyttNivaa)
    return (
      <RoundDone correct={result.correct} total={result.total} stars={result.stars} onAgain={() => setView('hub')} againLabel="🗺️ Til stigen" onHome={go}>
        {result.levelUp && (
          <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
            <span className="text-3xl">🎉</span>
            <span>
              Nivå opp! Nå er du på nivå {result.nyttNivaa}: {nyDef.tittel} {nyV.emoji}
            </span>
          </div>
        )}
        {result.sjefPassed === true && (
          <div className="w-full sm:w-auto bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg">👑 Du klarte sjefsoppgaven og hoppet til nivå {result.nyttNivaa}!</div>
        )}
        {result.sjefPassed === false && <div className="w-full sm:w-auto bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg">Godt forsøk! Du fortsetter der du var, og kan prøve igjen senere.</div>}
        {result.sjef && !result.levelUp && (
          <BigButton color="bg-amber-500" onClick={startSjef}>
            👑 Prøv sjefsoppgaven!
          </BigButton>
        )}
        <BigButton color="bg-fuchsia-500" onClick={startOppdrag}>
          ▶️ Nytt oppdrag
        </BigButton>
      </RoundDone>
    )
  }

  // ---- Hub ----
  const hei = `Hei ${profile?.name || ''}! Du er på nivå ${matte.nivaa}: ${def.tittel}.`
  return (
    <div className="animate-pop-in">
      <TopBar title={`Matte ${verden.emoji}`} onHome={go} />
      <div className={`rounded-3xl p-5 md:p-6 shadow-xl bg-gradient-to-br ${verden.gradient}`}>
        <div className="flex items-center gap-4">
          <span className="text-6xl md:text-7xl">{verden.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-600/80">{verden.navn}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Nivå {matte.nivaa} av {MAKS}</h2>
            <p className="text-base md:text-lg font-bold text-slate-700">{def.tittel}</p>
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
        </div>
        <p className="text-center text-sm font-bold text-slate-600/80 mt-3">Åtte oppgaver. Du har to forsøk på hver.</p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={onNoetter} className="kid-btn bg-amber-700 text-white p-4 flex items-center justify-center gap-3 hover:scale-[1.02]">
          <span className="text-4xl">🌰</span>
          <span className="text-left">
            <span className="block text-xl font-extrabold">Nøttehula</span>
            <span className="block text-sm opacity-90">Tenkenøtter – bare for gøy</span>
          </span>
        </button>
        <div className="bg-white/80 rounded-3xl p-4 flex items-center gap-3">
          <span className="text-4xl">⭐</span>
          <div>
            <p className="font-extrabold text-slate-700">
              {Object.values(matte.beste || {}).filter((s) => s > 0).length} nivåer med stjerner
            </p>
            <p className="text-sm font-bold text-slate-500">7–8 riktige to ganger på rad gir nivå opp</p>
          </div>
        </div>
      </div>

      <NivaaOversikt matte={matte} />
    </div>
  )
}
