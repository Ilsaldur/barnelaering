import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { StarProvider } from '../StarContext.jsx'
import { TOPICS } from '../data/topics.js'
import { ENGINES } from '../activities/engines.js'
import Home from '../activities/Home.jsx'
import AdventureMap from '../activities/AdventureMap.jsx'
import Rewards from '../activities/Rewards.jsx'
import Parents from '../activities/Parents.jsx'
import Garden from '../activities/Garden.jsx'
import Family from '../activities/Family.jsx'
import TopicLadder from '../activities/TopicLadder.jsx'
import RoundDone from '../components/RoundDone.jsx'
import AdultGate from '../components/AdultGate.jsx'

const noop = () => {}
const wrap = (el) => renderToString(<StarProvider>{el}</StarProvider>)

describe('alle skjermer rendrer uten feil', () => {
  it('forside, kart, stjerner, hage, voksenside, profilvalg', () => {
    expect(wrap(<Home topics={TOPICS} onPick={noop} onRewards={noop} onGarden={noop} onParents={noop} onSwitchProfile={noop} onEventyr={noop} />)).toContain('Eventyrkartet')
    expect(wrap(<AdventureMap go={noop} />)).toContain('Trylleskogen')
    expect(wrap(<Rewards go={noop} />)).toContain('stjerne')
    expect(wrap(<Parents go={noop} onSwitchProfile={noop} />)).toContain('Hold inne')
    expect(wrap(<Garden go={noop} />)).toContain('Hagebutikken')
    expect(wrap(<Family onPicked={noop} />)).toContain('Hvem skal spille')
    expect(wrap(<TopicLadder topic={TOPICS[0]} go={noop} onOpenLevel={noop} />)).toContain('Tell 1 til 5')
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
})
