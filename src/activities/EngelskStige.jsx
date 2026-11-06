import Stige from './Stige.jsx'
import { NIVAER_ENGELSK, ENGELSK_OMRAADER, engelskOmraadeFor } from '../data/engelsk/nivaer.js'
import { genEngelsk } from '../lib/engelsk/generatorer.js'

const START = [
  { id: 'ord', navn: 'Jeg lærer de første engelske ordene', emoji: '🇬🇧', nivaa: 1, farge: 'bg-rose-500' },
  { id: 'dyr', navn: 'Jeg kan farger, tall og noen dyr', emoji: '🐱', nivaa: 3, farge: 'bg-amber-500' },
  { id: 'setninger', navn: 'Jeg kan mange ord og vil lese setninger', emoji: '💬', nivaa: 5, farge: 'bg-indigo-500' },
]

export default function EngelskStige({ go }) {
  const cfg = { id: 'engelsk', tittel: 'Engelsk', kartTittel: 'Engelskstigen', emoji: '🇬🇧', nivaer: NIVAER_ENGELSK, verdener: ENGELSK_OMRAADER, gen: genEngelsk, omraadeFor: engelskOmraadeFor, start: START, ikoner: (n) => engelskOmraadeFor(n.id).emoji }
  return <Stige cfg={cfg} go={go} />
}
