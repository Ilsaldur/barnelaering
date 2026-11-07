import { useState } from 'react'
import { TopBar, BigButton } from '../components/ui.jsx'
import { SpeakButton } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import Historie from '../components/Historie.jsx'
import Oppdrag, { TaskCard } from './Oppdrag.jsx'
import Kart from './Kart.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { buildMission, buildBoss, huskOppgaver, oppdragLengde } from '../lib/matte/oppdrag.js'
import { startForste, gjeldende, svarForste, resultatForste, framdriftForste } from '../lib/matte/forsteOppdrag.js'
import { oppdaterKjent } from '../lib/kunnskap.js'
import { applyResult, applyBoss, settNivaa } from '../lib/matte/stige.js'
import { oppdaterBoks } from '../lib/matte/kort.js'
import { starsFor } from '../lib/scoring.js'
import { nyeKort } from '../lib/samling.js'
import { kortById } from '../data/kort.js'
import { laerkortForNivaa } from '../data/laerkort.js'
import LaerKort from '../components/LaerKort.jsx'

// Én felles stige for alle fag. `cfg` beskriver faget:
//   id, tittel, nivaer, verdener, gen, omraadeFor(id),
//   start: [{ id, navn, emoji, nivaa, tak, farge }], kortPerNivaa (bool),
//   historieFor(verdenId), ekstra (knapper på hub), hubEkstra, ikoner(n), kartTittel
export default function Stige({ cfg, go }) {
  const { fag, updateFag, addStars, updateSettings, profile, data, giKort, markHistorie, markLaerkort } = useStars()
  const state = fag[cfg.id]
  const STIGE = { nivaer: cfg.nivaer, gen: cfg.gen, tekstOppgaver: cfg.tekstOppgaver, emneMaks: cfg.emneMaks, kunnskap: !!cfg.kunnskap }
  const MAKS = cfg.nivaer.length
  const [view, setView] = useState('hub')
  const [mission, setMission] = useState(null)
  const [result, setResult] = useState(null)

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
    setMission({ ...buildBoss(state.nivaa, target, { stige: STIGE, fag: state }), sjef: true })
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
      ;({ fag: nf, events } = applyResult(state, { correct: res.correct, total: res.total, nivaa: mission.nivaa, perTask: res.perTask, hjelpModus: !!mission.hjelp }, MAKS))
    }
    let bokser = nf.bokser || {}
    for (const r of res.perTask) if (r.kortId) bokser = oppdaterBoks(bokser, r.kortId, r.ok && r.forste)
    nf.bokser = bokser
    nf = huskOppgaver(nf, mission.tasks)
    if (cfg.kunnskap) nf.kjent = oppdaterKjent(nf.kjent, res.perTask)
    updateFag(cfg.id, nf)
    addStars(events.stars, { correct: res.correct, total: res.total, fag: cfg.id, nivaa: mission.nivaa, oppdrag: true })
    const kort = delUtKort(nyeKort({ eier: data.kort, nivaa: mission.nivaa, fag: cfg.id, levelUp: events.levelUp, stars: events.stars }))
    setResult({ ...res, stars: events.stars, levelUp: events.levelUp, levelDown: events.levelDown, toppKlart: !!events.toppKlart, nyttNivaa: nf.nivaa, boss: events.boss, kort, replay: !!mission.replay })
    setView('resultat')
  }

  function ferdigSjef(res) {
    const { fag: nf0, passed } = applyBoss(state, { correct: res.correct, target: mission.target })
    const nf = huskOppgaver(nf0, mission.tasks)
    if (cfg.kunnskap) nf.kjent = oppdaterKjent(nf.kjent, res.perTask)
    updateFag(cfg.id, nf)
    const stars = starsFor(res.correct, res.total)
    addStars(stars, { correct: res.correct, total: res.total, fag: cfg.id, nivaa: mission.target, oppdrag: true, sjef: true })
    // Hopp gir kortene for nivåene som hoppes over, i alle stiger.
    const kort = passed ? delUtKort(Array.from({ length: mission.target - state.nivaa }, (_, i) => state.nivaa + i).flatMap((n) => nyeKort({ eier: data.kort, nivaa: n, fag: cfg.id, levelUp: true, stars: 0, rng: () => 1 }))) : []
    setResult({ ...res, stars, sjefPassed: passed, nyttNivaa: nf.nivaa, target: mission.target, kort })
    setView('resultat')
  }

  // ---- Første oppdrag: reven finner nivået (usynlig plassering) ----
  function ferdigFinn(res) {
    let nf = huskOppgaver(settNivaa(state, res.nivaa), res.tasks)
    if (cfg.kunnskap) nf.kjent = oppdaterKjent(nf.kjent, res.perTask)
    updateFag(cfg.id, nf)
    // Innføring (bom på nivå 1 i en kunnskapsstige) gir tre stjerner når det er fullført.
    const stars = res.innfoering ? 3 : starsFor(res.correct, res.total)
    addStars(stars, { correct: res.correct, total: res.total, fag: cfg.id, nivaa: res.nivaa, oppdrag: true })
    setResult({ correct: res.correct, total: res.total, perTask: res.perTask, stars, funnet: res.nivaa, nyttNivaa: res.nivaa, levelUp: false, levelDown: false, boss: null, kort: [] })
    setView('resultat')
  }
  if (!state.plassert || !state.nivaa) {
    return <FinnNivaa cfg={cfg} stige={STIGE} state={state} onHome={go} onDone={ferdigFinn} />
  }

  if (view === 'oppdrag' && mission) {
    const o = cfg.omraadeFor(mission.nivaa)
    // «Lær først» første gang barnet starter et oppdrag på et nivå med kort.
    // Oppdraget starter først når kortet er lukket.
    const kort = laerkortForNivaa(cfg.id, mission.nivaa)
    const visKort = kort && !(data.laerkort || []).includes(kort.id)
    if (visKort) {
      return (
        <div className="animate-pop-in">
          <TopBar title={`Nivå ${mission.nivaa} ${o.emoji}`} onHome={go} />
          <LaerKort kort={kort} stige={STIGE} sett={state.sett} modus="forst" fag={cfg.id} onDone={() => markLaerkort(kort.id)} onSkip={() => markLaerkort(kort.id)} />
        </div>
      )
    }
    return <Oppdrag tasks={mission.tasks} title={`${mission.replay ? 'Om igjen: nivå' : 'Nivå'} ${mission.nivaa} ${o.emoji}`} hjelpStart={mission.hjelp} onDone={ferdigOppdrag} onHome={go} fag={cfg.id} stige={STIGE} />
  }
  if (view === 'sjef' && mission) {
    return <Oppdrag tasks={mission.tasks} title="Sjefsoppgave 👑" onDone={ferdigSjef} onHome={go} fag={cfg.id} attempts={1} noHelp />
  }

  if (view === 'resultat' && result) {
    const nyDef = cfg.nivaer[result.nyttNivaa - 1]
    const nyO = cfg.omraadeFor(result.nyttNivaa)
    return (
      <RoundDone
        correct={result.correct}
        total={result.total}
        stars={result.stars}
        onAgain={() => setView('hub')}
        againLabel={`${cfg.emoji} Til ${(cfg.kartTittel || cfg.tittel).toLowerCase()}`}
        onHome={go}
        melding={result.sjefPassed === false ? 'Sjefsoppgaven var vanskelig denne gangen. Du fortsetter der du var, og mister ingenting.' : result.sjefPassed === true ? 'Du klarte sjefsoppgaven! 👑' : null}
        before={
          <>
            {result.funnet && (
              <div data-testid="funnet" className="bg-sky-100 text-sky-800 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
                <span className="text-3xl">🦊</span>
                <span>
                  Reven fant plassen din: {nyO.navn}, nivå {result.funnet}! {nyO.emoji}
                </span>
              </div>
            )}
            {result.toppKlart && (
              <div data-testid="topp-klart" className="bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
                <span className="text-3xl">🏆</span>
                <span>Du har klart hele stigen! Nivå {MAKS} er det høyeste, og du har klart det to ganger.</span>
              </div>
            )}
            {result.levelUp && (
              <div className="bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
                <span className="text-3xl">🎉</span>
                <span>
                  Nivå opp! Nå er du på nivå {result.nyttNivaa}: {nyDef.tittel} {nyO.emoji}
                </span>
              </div>
            )}
            {result.levelDown && (
              <div className="bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg flex items-center gap-2">
                <span className="text-3xl">🦊</span>
                <span>Reven tar deg med til nivå {result.nyttNivaa} en stund, så det blir litt lettere. Det er lurt å øve der det passer!</span>
              </div>
            )}
            {result.sjefPassed === true && <div className="bg-amber-100 text-amber-700 rounded-2xl px-5 py-3 font-extrabold text-lg">👑 Du klarte sjefsoppgaven og hoppet til nivå {result.nyttNivaa}!</div>}
            {result.sjefPassed === false && <div className="bg-sky-100 text-sky-700 rounded-2xl px-5 py-3 font-extrabold text-lg">Godt forsøk! Du fortsetter der du var, og får nytt tilbud neste gang du klarer alle {oppdragLengde(STIGE, state.nivaa) === 5 ? 'fem' : 'åtte'}.</div>}
            {result.kort?.length > 0 && (
              <div className="bg-white rounded-2xl px-5 py-3 shadow flex flex-wrap items-center justify-center gap-3">
                <span className="font-extrabold text-slate-600">{result.kort.length === 1 ? 'Nytt samlekort!' : 'Nye samlekort!'}</span>
                {result.kort.map((k) => (
                  <span key={k.id} className="flex items-center gap-1 bg-amber-50 rounded-xl px-3 py-1 font-bold text-slate-700">
                    <span className="text-2xl">{k.emoji}</span> {k.navn}
                  </span>
                ))}
              </div>
            )}
            {result.boss && (
              <div data-testid="sjefstilbud" className="bg-amber-50 rounded-2xl px-5 py-3 flex flex-col items-center gap-2 text-center">
                <p className="font-extrabold text-amber-700">Alle {result.total === 5 ? 'fem' : 'åtte'} riktige! Vil du prøve sjefsoppgaven og hoppe til nivå {result.boss}?</p>
                <p className="text-sm font-bold text-slate-500">Fem oppgaver, ett forsøk på hver. Fire riktige gir hopp. Du mister ingenting om det ikke går.</p>
                <BigButton color="bg-amber-500" className="max-w-full" onClick={() => startSjef(result.boss)}>
                  👑 Ja, prøv sjefsoppgaven!
                </BigButton>
              </div>
            )}
          </>
        }
      >
        {!result.replay && (
          <BigButton color="bg-fuchsia-500" className="max-w-full" onClick={startOppdrag}>
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
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
              Nivå {state.nivaa} av {MAKS}
              {state.toppKlart && (
                <span data-testid="topp-merke" className="ml-2 align-middle inline-block bg-amber-100 text-amber-700 text-xs font-extrabold rounded-full px-2 py-1">
                  🏆 Hele stigen klart
                </span>
              )}
            </h2>
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
        <p className="text-center text-sm font-bold text-slate-500 mt-3">
          {oppdragLengde(STIGE, state.nivaa) === 5 ? 'Fem oppgaver, to forsøk på hver.' : 'Åtte oppgaver, to forsøk på hver.'}{' '}
          {state.nivaa >= MAKS ? 'Du er på toppnivået – her er det bare å øve videre!' : `Alle ${oppdragLengde(STIGE, state.nivaa) === 5 ? 'fem' : 'åtte'} riktige gir tilbud om sjefsoppgave.`} Trykk på et nivå du har passert for å øve mer.
        </p>
      </div>
      {cfg.hubEkstra}
      <Kart matte={state} onStart={startOppdrag} onReplay={startReplay} nivaer={cfg.nivaer} verdener={cfg.verdener} ikoner={cfg.ikoner} />
    </div>
  )
}

// Det første oppdraget i en stige: ser ut som et vanlig oppdrag, men oppgavene
// velges av `finnNivaa` (1, 2, 4, 8 … så binært søk, så to på plassen, så
// vanlige oppgaver). Framdriftslinja har ingen tall. Ingenting barnet ser
// nevner at nivået blir funnet før resultatskjermen.
function FinnNivaa({ cfg, stige, state, onDone, onHome }) {
  const [st, setSt] = useState(() => startForste({ stige, fag: state, tak: cfg.tak }))
  const task = gjeldende(st)

  function svar(res) {
    const neste = svarForste(st, res)
    if (neste.ferdig) {
      onDone(resultatForste(neste))
      return
    }
    setSt(neste)
  }

  return (
    <div className="animate-pop-in">
      <TopBar title={`${cfg.kartTittel || cfg.tittel} ${cfg.emoji}`} onHome={onHome} />
      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner" aria-label="Framdrift">
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${Math.round(framdriftForste(st) * 100)}%` }} />
      </div>
      <TaskCard key={st.vist.length} task={task} fag={cfg.id} onDone={svar} />
    </div>
  )
}
