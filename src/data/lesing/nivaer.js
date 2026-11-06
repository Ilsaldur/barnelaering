// Lesestigen: seks områder delt i 16 nivåer. Samme regler som matte.
// Oppdrag med lengre tekster har færre oppgaver (`lengde`).
import { registerStige } from '../stiger.js'

export const OMRAADER = [
  { id: 'lyder', navn: 'Lyder og bokstaver', emoji: '🔤', farge: 'bg-emerald-500', gradient: 'from-emerald-300 via-green-300 to-lime-200', fra: 1, til: 3 },
  { id: 'lydering', navn: 'Lydering', emoji: '🔊', farge: 'bg-sky-500', gradient: 'from-sky-300 via-cyan-300 to-blue-200', fra: 4, til: 5 },
  { id: 'ord', navn: 'Ord og setninger', emoji: '💬', farge: 'bg-violet-500', gradient: 'from-violet-300 via-purple-300 to-fuchsia-200', fra: 6, til: 7 },
  { id: 'forstaa', navn: 'Lese og forstå', emoji: '📖', farge: 'bg-amber-500', gradient: 'from-amber-300 via-yellow-300 to-orange-200', fra: 8, til: 9 },
  { id: 'rettskriving', navn: 'Rettskriving', emoji: '✏️', farge: 'bg-rose-500', gradient: 'from-rose-300 via-pink-300 to-red-200', fra: 10, til: 13 },
  { id: 'sprak', navn: 'Språk', emoji: '🧩', farge: 'bg-indigo-600', gradient: 'from-indigo-400 via-violet-400 to-fuchsia-300', fra: 14, til: 16 },
]

const N = (id, verden, tittel, typer, extra = {}) => ({ id, verden, tittel, typer, svar: 'valg', lengde: 8, ...extra })
const T = (type, param = {}, vekt = 1) => ({ type, param, vekt })

export const NIVAER_LESING = [
  // Lyder og bokstaver – rekkefølgen i s o l e v a t b ø m å j r d u g n p y h f k æ
  N(1, 'lyder', 'Lydene i, s, o, l, e, v, a', [T('lyd_finn_bokstav', { antall: 7 }, 2), T('forste_lyd', { antall: 7 }, 1), T('stor_liten', { antall: 7 }, 1)], { trinn: 'Før skolestart / 1. trinn' }),
  N(2, 'lyder', 'Lydene t, b, ø, m, å, j, r', [T('lyd_finn_bokstav', { antall: 14 }, 2), T('forste_lyd', { antall: 14 }, 1), T('stor_liten', { antall: 14 }, 1)], { trinn: '1. trinn' }),
  N(3, 'lyder', 'Lydene d, u, g, n, p, y, h, f, k, æ', [T('lyd_finn_bokstav', { antall: 24 }, 2), T('forste_lyd', { antall: 24 }, 1), T('stor_liten', { antall: 24 }, 1)], { trinn: '1. trinn' }),
  // Lydering
  N(4, 'lydering', 'Trekke sammen to og tre lyder', [T('lydering_bilde', { maks: 3 }, 2), T('les_ord_bilde', { maks: 3 }, 1)], { trinn: '1. trinn' }),
  N(5, 'lydering', 'Lese lydrette ord med små bokstaver', [T('les_ord_bilde', { maks: 5 }, 2), T('lydering_bilde', { maks: 5 }, 1), T('bilde_ord', { maks: 5 }, 1)], { trinn: '1. trinn' }),
  // Ord og setninger
  N(6, 'ord', 'Vanlige ord: jeg, er, og, det, de, som', [T('vanlig_ord', {}, 2), T('les_ord_bilde', { maks: 5 }, 1)], { trinn: '1.–2. trinn' }),
  N(7, 'ord', 'Korte setninger: hvilket bilde passer?', [T('setning_bilde', {}, 2), T('vanlig_ord', {}, 1)], { trinn: '1.–2. trinn' }),
  // Lese og forstå
  N(8, 'forstaa', 'Tekster på 40–80 ord med spørsmål', [T('tekst_sporsmaal', { maksOrd: 80 })], { trinn: '2. trinn', lengde: 5 }),
  N(9, 'forstaa', 'Lengre tekster: fakta eller mening?', [T('tekst_sporsmaal', { maksOrd: 130 })], { trinn: '2.–3. trinn', lengde: 5 }),
  // Rettskriving
  N(10, 'rettskriving', 'Diftonger: au, ei, øy, ai', [T('skriv_ord', { gruppe: 'diftonger' }, 2), T('riktig_skrevet', { gruppe: 'diftonger' }, 1)], { trinn: '2. trinn', svar: 'skriv' }),
  N(11, 'rettskriving', 'Kj og skj', [T('skriv_ord', { gruppe: 'kj_skj' }, 2), T('riktig_skrevet', { gruppe: 'kj_skj' }, 1)], { trinn: '2.–3. trinn', svar: 'skriv' }),
  N(12, 'rettskriving', 'Dobbel konsonant', [T('skriv_ord', { gruppe: 'dobbel_konsonant' }, 2), T('riktig_skrevet', { gruppe: 'dobbel_konsonant' }, 1)], { trinn: '2.–3. trinn', svar: 'skriv' }),
  N(13, 'rettskriving', 'Stum h og g, sammensatte ord', [T('skriv_ord', { gruppe: 'stum_h_g' }), T('skriv_ord', { gruppe: 'sammensatte' }), T('riktig_skrevet', { gruppe: 'sammensatte' })], { trinn: '3. trinn', svar: 'skriv' }),
  // Språk
  N(14, 'sprak', 'Ordklasser: substantiv, verb og adjektiv', [T('ordklasse', {}, 2), T('finn_ordklasse', {}, 1)], { trinn: '3. trinn' }),
  N(15, 'sprak', 'Bøying: entall og flertall, nåtid og fortid', [T('boying', {})], { trinn: '3. trinn' }),
  N(16, 'sprak', 'Motsetninger og tegnsetting', [T('motsetning', {}), T('tegnsetting', {}), T('stor_bokstav', {})], { trinn: '3.–4. trinn' }),
]

export const MAKS_LESING = NIVAER_LESING.length

export function omraadeFor(id) {
  return OMRAADER.find((o) => id >= o.fra && id <= o.til) || OMRAADER[0]
}

registerStige('lesing', NIVAER_LESING)
