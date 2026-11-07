// Engelsk: vanlige ord med bilde og lyd, så enkle setninger.
import { registerStige } from '../stiger.js'

export const ENGELSK_OMRAADER = [
  { id: 'ord', navn: 'Words', emoji: '🇬🇧', farge: 'bg-rose-500', gradient: 'from-rose-300 via-pink-300 to-red-200', fra: 1, til: 4 },
  { id: 'setninger', navn: 'Sentences', emoji: '💬', farge: 'bg-indigo-500', gradient: 'from-indigo-300 via-blue-300 to-sky-200', fra: 5, til: 7 },
  { id: 'lese', navn: 'Read and write', emoji: '📖', farge: 'bg-emerald-500', gradient: 'from-emerald-300 via-teal-300 to-cyan-200', fra: 8, til: 10 },
]

const N = (id, verden, tittel, typer, extra = {}) => ({ id, verden, tittel, typer, svar: 'valg', lengde: 8, ...extra })
const T = (type, param = {}, vekt = 1) => ({ type, param, vekt })

export const NIVAER_ENGELSK = [
  N(1, 'ord', 'Colours and numbers', [T('hor_finn_bilde', { grupper: ['farger', 'tall'] }, 2), T('bilde_finn_ord', { grupper: ['farger', 'tall'] }, 1)], { trinn: '1.–2. trinn' }),
  N(2, 'ord', 'Animals', [T('hor_finn_bilde', { grupper: ['dyr'] }, 2), T('bilde_finn_ord', { grupper: ['dyr'] }, 1), T('oversett', { grupper: ['dyr'] }, 1)], { trinn: '2. trinn' }),
  N(3, 'ord', 'Food and things at home', [T('hor_finn_bilde', { grupper: ['mat', 'hus'] }, 2), T('bilde_finn_ord', { grupper: ['mat', 'hus'] }, 1), T('oversett', { grupper: ['mat', 'hus'] }, 1)], { trinn: '2.–3. trinn' }),
  N(4, 'ord', 'Body and clothes', [T('hor_finn_bilde', { grupper: ['kropp'] }, 2), T('bilde_finn_ord', { grupper: ['kropp'] }, 1), T('oversett', { grupper: ['kropp', 'dyr', 'mat'] }, 1)], { trinn: '3. trinn' }),
  N(5, 'setninger', 'Simple sentences', [T('setning_bilde', {}, 2), T('hor_finn_bilde', { grupper: ['dyr', 'mat', 'hus'] }, 1)], { trinn: '3. trinn' }),
  N(6, 'setninger', 'Fill in the word', [T('fyll_inn', {}, 2), T('setning_bilde', {}, 1)], { trinn: '3.–4. trinn' }),
  N(7, 'setninger', 'Questions and answers', [T('sporsmaal', {}, 2), T('fyll_inn', {}, 1)], { trinn: '4. trinn' }),
  // UTKAST (runde 4): tre nye nivåer øverst.
  N(8, 'lese', 'Read and choose', [T('les_tekst_en', {}, 3), T('sporsmaal', {}, 1)], { trinn: '4.–5. trinn' }),
  N(9, 'lese', 'Spell it', [T('stav_en', { maks: 4 }, 2), T('stav_en', { min: 5 }, 1), T('fyll_inn', {}, 1)], { trinn: '4.–5. trinn', svar: 'skriv' }),
  N(10, 'lese', 'Make a sentence', [T('lag_setning', {}, 3), T('les_tekst_en', {}, 1)], { trinn: '5. trinn' }),
]

export const MAKS_ENGELSK = NIVAER_ENGELSK.length

export function engelskOmraadeFor(id) {
  return ENGELSK_OMRAADER.find((o) => id >= o.fra && id <= o.til) || ENGELSK_OMRAADER[0]
}

registerStige('engelsk', NIVAER_ENGELSK)
