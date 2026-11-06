// Klokkestigen: åtte nivåer. Norsk klokkespråk («fem over halv fire») og
// digital skrivemåte blandes ikke i samme oppgave.
import { registerStige } from '../stiger.js'

export const KLOKKE_OMRAADER = [
  { id: 'hel', navn: 'Hele og halve timer', emoji: '🕐', farge: 'bg-sky-500', gradient: 'from-sky-300 via-cyan-300 to-blue-200', fra: 1, til: 3 },
  { id: 'kvart', navn: 'Kvarter og fem minutter', emoji: '🕒', farge: 'bg-indigo-500', gradient: 'from-indigo-300 via-violet-300 to-purple-200', fra: 4, til: 6 },
  { id: 'digital', navn: 'Digital og tidsregning', emoji: '⏱️', farge: 'bg-fuchsia-500', gradient: 'from-fuchsia-300 via-pink-300 to-rose-200', fra: 7, til: 8 },
]

const N = (id, verden, tittel, typer, extra = {}) => ({ id, verden, tittel, typer, svar: 'valg', lengde: 8, ...extra })
const T = (type, param = {}, vekt = 1) => ({ type, param, vekt })

export const NIVAER_KLOKKE = [
  N(1, 'hel', 'Hele timer', [T('les_analog', { minutes: 'whole' }, 2), T('finn_klokka', { minutes: 'whole' }, 1)], { trinn: '1. trinn' }),
  N(2, 'hel', 'Still klokka på hele timer', [T('still_klokka', { minutes: 'whole' }, 2), T('les_analog', { minutes: 'whole' }, 1)], { trinn: '1. trinn' }),
  N(3, 'hel', 'Halve timer', [T('les_analog', { minutes: 'half' }, 2), T('finn_klokka', { minutes: 'half' }, 1), T('still_klokka', { minutes: 'half' }, 1)], { trinn: '1.–2. trinn' }),
  N(4, 'kvart', 'Kvart over og kvart på', [T('les_analog', { minutes: 'quarter' }, 2), T('finn_klokka', { minutes: 'quarter' }, 1), T('still_klokka', { minutes: 'quarter' }, 1)], { trinn: '2. trinn' }),
  N(5, 'kvart', 'Fem minutter: fem over, ti på halv …', [T('les_analog', { minutes: 'five' }, 2), T('finn_klokka', { minutes: 'five' }, 1)], { trinn: '2.–3. trinn' }),
  N(6, 'kvart', 'Still klokka til fem minutter', [T('still_klokka', { minutes: 'five' }, 2), T('les_analog', { minutes: 'five' }, 1)], { trinn: '3. trinn' }),
  N(7, 'digital', 'Digital mot analog', [T('analog_til_digital', { minutes: 'five' }, 1), T('digital_til_analog', { minutes: 'five' }, 1)], { trinn: '3. trinn' }),
  N(8, 'digital', 'Tidsregning', [T('tidsregning', {}, 2), T('analog_til_digital', { minutes: 'five' }, 1)], { trinn: '3.–4. trinn' }),
]

export const MAKS_KLOKKE = NIVAER_KLOKKE.length

export function klokkeOmraadeFor(id) {
  return KLOKKE_OMRAADER.find((o) => id >= o.fra && id <= o.til) || KLOKKE_OMRAADER[0]
}

registerStige('klokke', NIVAER_KLOKKE)
