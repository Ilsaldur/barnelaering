import Stige from './Stige.jsx'
import { NIVAER_ENGELSK, ENGELSK_OMRAADER, engelskOmraadeFor } from '../data/engelsk/nivaer.js'
import { genEngelsk } from '../lib/engelsk/generatorer.js'

export default function EngelskStige({ go }) {
  const cfg = { id: 'engelsk', tittel: 'Engelsk', kartTittel: 'Engelskstigen', emoji: '🇬🇧', nivaer: NIVAER_ENGELSK, verdener: ENGELSK_OMRAADER, gen: genEngelsk, omraadeFor: engelskOmraadeFor, ikoner: (n) => engelskOmraadeFor(n.id).emoji }
  return <Stige cfg={cfg} go={go} />
}
