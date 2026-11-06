import Stige from './Stige.jsx'
import { NIVAER_LESING, OMRAADER, omraadeFor } from '../data/lesing/nivaer.js'
import { genLesing } from '../lib/lesing/generatorer.js'

// Lesestigen: 16 nivåer i seks områder. Samme regler som matte.
const START = [
  { id: 'nybegynner', navn: 'Jeg lærer bokstavene', emoji: '🔤', nivaa: 1, farge: 'bg-emerald-500' },
  { id: 'lyder', navn: 'Jeg kan bokstavene og trekker sammen lyder', emoji: '🔊', nivaa: 4, farge: 'bg-sky-500' },
  { id: 'ord', navn: 'Jeg leser ord og korte setninger', emoji: '💬', nivaa: 6, farge: 'bg-violet-500' },
  { id: 'tekst', navn: 'Jeg leser bøker selv', emoji: '📖', nivaa: 8, farge: 'bg-amber-500' },
  { id: 'skriver', navn: 'Jeg leser godt og skriver', emoji: '✏️', nivaa: 11, farge: 'bg-rose-500' },
]

export default function LeseStige({ go }) {
  const cfg = { id: 'lesing', tittel: 'Lesing', kartTittel: 'Lesestigen', emoji: '📖', nivaer: NIVAER_LESING, verdener: OMRAADER, gen: genLesing, omraadeFor, start: START, ikoner: (n) => omraadeFor(n.id).emoji }
  return <Stige cfg={cfg} go={go} />
}
