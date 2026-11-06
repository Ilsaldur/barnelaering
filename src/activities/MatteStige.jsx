import Stige from './Stige.jsx'
import { BigButton } from '../components/ui.jsx'
import { NIVAER, VERDENER, verdenFor } from '../data/matte/nivaer.js'
import { gen } from '../lib/matte/generatorer.js'
import { historieForVerden } from '../data/historier.js'
import { START_NIVAA, TAK_NIVAA } from '../lib/matte/plassering.js'

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
    intro: 'Først finner reven ut hvor du skal starte. Hvor vil du begynne?',
    start: VERDENER.map((v) => ({ id: v.id, navn: v.navn, under: v.trinn, emoji: v.emoji, nivaa: START_NIVAA[v.id], tak: TAK_NIVAA[v.id], farge: v.farge })),
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
