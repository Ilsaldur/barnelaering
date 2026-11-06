import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { StarProvider } from '../StarContext.jsx'
import { TOPICS } from '../data/topics.js'
import { ENGINES } from '../activities/engines.js'
import Home from '../activities/Home.jsx'
import Samling from '../activities/Samling.jsx'
import Kart from '../activities/Kart.jsx'
import Historie from '../components/Historie.jsx'
import { emptyFag } from '../lib/profil.js'
import { HISTORIER } from '../data/historier.js'
import { VERDENER } from '../data/matte/nivaer.js'
import Parents from '../activities/Parents.jsx'
import Garden from '../activities/Garden.jsx'
import Family from '../activities/Family.jsx'
import Personvern from '../activities/Personvern.jsx'
import TopicLadder from '../activities/TopicLadder.jsx'
import RoundDone from '../components/RoundDone.jsx'
import AdultGate from '../components/AdultGate.jsx'
import MatteStige from '../activities/MatteStige.jsx'
import LeseStige from '../activities/LeseStige.jsx'
import KlokkeStige from '../activities/KlokkeStige.jsx'
import GeoStige from '../activities/GeoStige.jsx'
import EngelskStige from '../activities/EngelskStige.jsx'
import VerdensKart from '../components/VerdensKart.jsx'
import { NIVAER_KLOKKE } from '../data/klokke/nivaer.js'
import { NIVAER_GEO } from '../data/geo/nivaer.js'
import { NIVAER_ENGELSK } from '../data/engelsk/nivaer.js'
import { genKlokke } from '../lib/klokke/generatorer.js'
import { genGeo } from '../lib/geo/generatorer.js'
import { genEngelsk } from '../lib/engelsk/generatorer.js'
import { NIVAER_LESING } from '../data/lesing/nivaer.js'
import { genLesing } from '../lib/lesing/generatorer.js'
import Noettehula from '../activities/Noettehula.jsx'
import Oppdrag, { TaskCard } from '../activities/Oppdrag.jsx'
import { NIVAER } from '../data/matte/nivaer.js'
import { gen } from '../lib/matte/generatorer.js'
import { lagNoetter } from '../lib/matte/noetter.js'
import { seeded } from '../lib/rng.js'

const noop = () => {}
const wrap = (el) => renderToString(<StarProvider>{el}</StarProvider>)

describe('alle skjermer rendrer uten feil', () => {
  it('forside, kart, stjerner, hage, voksenside, profilvalg', () => {
    const home = wrap(<Home topics={TOPICS} onPick={noop} onSamling={noop} onGarden={noop} onParents={noop} onSwitchProfile={noop} onMatte={noop} onLesing={noop} onNoetter={noop} onDagens={noop} onFag={noop} />)
    expect(home).toContain('Dagens økt')
    expect(home).toContain('Eventyrkartet')
    expect(wrap(<Samling go={noop} onGarden={noop} />)).toContain('Familiekisten')
    expect(wrap(<Kart matte={{ ...emptyFag(), nivaa: 12, beste: { 7: 3 } }} onStart={noop} onReplay={noop} />)).toContain('Det blå havet')
    expect(renderToString(<Historie historie={HISTORIER[0]} verden={VERDENER[0]} onDone={noop} />)).toContain('Trylleskogen')
    expect(wrap(<Parents go={noop} onSwitchProfile={noop} />)).toContain('Hold inne')
    expect(wrap(<Garden go={noop} />)).toContain('Hagebutikken')
    expect(wrap(<Family onPicked={noop} onPrivacy={noop} />)).toContain('Hvem skal spille')
    expect(wrap(<Personvern go={noop} />)).toContain('Sletting')
    expect(wrap(<TopicLadder topic={TOPICS[0]} go={noop} onOpenLevel={noop} />)).toContain('Hvilken form')
    expect(renderToString(<AdultGate onPass={noop} />)).toContain('tre sekunder')
  })

  it('resultatskjermen feirer ikke svakt resultat', () => {
    const weak = wrap(<RoundDone correct={2} total={8} stars={0} onAgain={noop} onHome={noop} />)
    expect(weak).not.toContain('Bra jobba')
    expect(weak).toContain('Prøv igjen')
    const strong = wrap(<RoundDone correct={8} total={8} stars={3} onAgain={noop} onHome={noop} />)
    expect(strong).toContain('Alle riktige')
  })

  it('hvert nivå i hver stige rendrer første oppgave', () => {
    for (const topic of TOPICS) {
      topic.levels.forEach((lvl, idx) => {
        const Engine = ENGINES[lvl.engine]
        expect(Engine, `${topic.id}/${idx}: ukjent motor ${lvl.engine}`).toBeTruthy()
        const html = wrap(<Engine go={noop} config={lvl.config} />)
        expect(html.length, `${topic.id}/${lvl.sub}`).toBeGreaterThan(200)
        // Tallinja skal aldri være synlig før barnet ber om hjelp.
        expect(html).not.toContain('🐰')
      })
    }
  })

  it('mattestigen: plassering, nøttehula og alle oppgavetyper rendrer', () => {
    expect(wrap(<MatteStige go={noop} onNoetter={noop} />)).toContain('Hvor vil du begynne')
    expect(wrap(<Noettehula go={noop} />)).toContain('Nøttehula')
    expect(wrap(<LeseStige go={noop} />)).toContain('Hva passer best')
    const rngL = seeded(31)
    for (const n of NIVAER_LESING) {
      for (const t of n.typer) {
        const task = { ...genLesing(t.type, t.param, rngL), nivaa: n.id }
        expect(wrap(<TaskCard task={task} onDone={noop} index={0} total={8} fag="lesing" />).length, `lesing ${n.id}/${t.type}`).toBeGreaterThan(300)
      }
    }
    const rng = seeded(21)
    for (const n of NIVAER) {
      for (const t of n.typer) {
        for (let i = 0; i < 3; i++) {
          const task = { ...gen(t.type, t.param, rng), nivaa: n.id }
          const html = wrap(<TaskCard task={task} onDone={noop} index={0} total={8} />)
          expect(html.length, `${n.id}/${t.type}`).toBeGreaterThan(300)
          // Hjelp er lukket som standard: haren på tallinja skal ikke være synlig.
          expect(html, `${n.id}/${t.type}`).not.toContain('🐰')
        }
      }
    }
    for (const grad of [1, 2, 3]) {
      const tasks = lagNoetter(grad, 4, rng)
      expect(wrap(<Oppdrag tasks={tasks} title="Nøtter" onDone={noop} onHome={noop} />)).toContain('Oppgave')
    }
  })

  it('klokke-, geografi- og engelskstigen rendrer med alle oppgavetyper', () => {
    expect(wrap(<KlokkeStige go={noop} />)).toContain('Hva passer best')
    expect(wrap(<GeoStige go={noop} />)).toContain('Hva passer best')
    expect(wrap(<EngelskStige go={noop} />)).toContain('Hva passer best')
    expect(renderToString(<VerdensKart region="norden" highlight="578" />)).toContain('<path')
    const rng = seeded(41)
    for (const [nivaer, gen, fag] of [
      [NIVAER_KLOKKE, genKlokke, 'klokke'],
      [NIVAER_GEO, genGeo, 'geografi'],
      [NIVAER_ENGELSK, genEngelsk, 'engelsk'],
    ]) {
      for (const n of nivaer) {
        for (const t of n.typer) {
          const task = { ...gen(t.type, t.param, rng), nivaa: n.id }
          expect(wrap(<TaskCard task={task} onDone={noop} index={0} total={8} fag={fag} />).length, `${fag} ${n.id}/${t.type}`).toBeGreaterThan(300)
        }
      }
    }
  })
})
