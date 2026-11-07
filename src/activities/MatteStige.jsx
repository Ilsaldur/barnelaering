import Stige from './Stige.jsx'
import { BigButton } from '../components/ui.jsx'
import { NIVAER, VERDENER, verdenFor } from '../data/matte/nivaer.js'
import { gen } from '../lib/matte/generatorer.js'
import { historieForVerden } from '../data/historier.js'

// Mattestigen: 38 nivåer i fem verdener. Eventyrkartet er framgangen.
export default function MatteStige({ go, onNoetter }) {
  const cfg = {
    id: 'matte',
    tittel: 'Matte',
    kartTittel: 'Eventyrkartet',
    emoji: '🔢',
    nivaer: NIVAER,
    verdener: VERDENER,
    gen,
    omraadeFor: verdenFor,
    kortPerNivaa: true,
    historieFor: historieForVerden,
    ekstra: (
      <BigButton color="bg-amber-700" onClick={onNoetter}>
        🌰 Nøttehula
      </BigButton>
    ),
  }
  return <Stige cfg={cfg} go={go} />
}
