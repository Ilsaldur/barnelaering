// Lesing er tre spor med hver sin stige og samme regler som matte:
//   Lese (lesing, 1–12)   – lyder, lydering, ord, setninger, lese og forstå
//   Skrive riktig (skrive, 1–4) – rettskriving
//   Språk (sprak, 1–3)    – ordklasser, bøying, motsetninger, tegnsetting
// Plasseringstest finnes bare i Lese (tak 9). Skrive riktig og Språk åpner når
// barnet har nådd nivå 8 i Lese, og starter på nivå 1 med «Lær først».
import { registerStige } from '../stiger.js'

const N = (id, verden, tittel, typer, extra = {}) => ({ id, verden, tittel, typer, svar: 'valg', lengde: 8, ...extra })
const T = (type, param = {}, vekt = 1, ikkePlassering = false) => ({ type, param, vekt, ikkePlassering })

// ---------------------------------------------------------------- Lese
export const OMRAADER = [
  { id: 'lyder', navn: 'Lyder og bokstaver', emoji: '🔤', farge: 'bg-emerald-500', gradient: 'from-emerald-300 via-green-300 to-lime-200', fra: 1, til: 3 },
  { id: 'lydering', navn: 'Lydering', emoji: '🔊', farge: 'bg-sky-500', gradient: 'from-sky-300 via-cyan-300 to-blue-200', fra: 4, til: 5 },
  { id: 'ord', navn: 'Ord og setninger', emoji: '💬', farge: 'bg-violet-500', gradient: 'from-violet-300 via-purple-300 to-fuchsia-200', fra: 6, til: 7 },
  { id: 'forstaa', navn: 'Lese og forstå', emoji: '📖', farge: 'bg-amber-500', gradient: 'from-amber-300 via-yellow-300 to-orange-200', fra: 8, til: 9 },
  { id: 'dypere', navn: 'Lese mellom linjene', emoji: '🔎', farge: 'bg-rose-500', gradient: 'from-rose-300 via-pink-300 to-red-200', fra: 10, til: 12 },
]

export const NIVAER_LESING = [
  N(1, 'lyder', 'Lydene i, s, o, l, e, v, a', [T('lyd_finn_bokstav', { antall: 7 }, 2), T('forste_lyd', { antall: 7 }, 1), T('stor_liten', { antall: 7 }, 1)], { trinn: 'Før skolestart / 1. trinn' }),
  N(2, 'lyder', 'Lydene t, b, ø, m, å, j, r', [T('lyd_finn_bokstav', { antall: 14 }, 2), T('forste_lyd', { antall: 14 }, 1), T('stor_liten', { antall: 14 }, 1)], { trinn: '1. trinn' }),
  N(3, 'lyder', 'Lydene d, u, g, n, p, y, h, f, k, æ', [T('lyd_finn_bokstav', { antall: 24 }, 2), T('forste_lyd', { antall: 24 }, 1), T('stor_liten', { antall: 24 }, 1)], { trinn: '1. trinn' }),
  N(4, 'lydering', 'Trekke sammen to og tre lyder', [T('lydering_bilde', { maks: 3 }, 2), T('les_ord_bilde', { maks: 3 }, 1)], { trinn: '1. trinn' }),
  N(5, 'lydering', 'Lese lydrette ord med små bokstaver', [T('les_ord_bilde', { maks: 5 }, 2), T('lydering_bilde', { maks: 5 }, 1), T('bilde_ord', { maks: 5 }, 1)], { trinn: '1. trinn' }),
  N(6, 'ord', 'Vanlige ord: jeg, er, og, det, de, som', [T('vanlig_ord', {}, 2), T('les_ord_bilde', { maks: 5 }, 1)], { trinn: '1.–2. trinn' }),
  N(7, 'ord', 'Korte setninger: hvilket bilde passer?', [T('setning_bilde', {}, 2), T('vanlig_ord', {}, 1)], { trinn: '1.–2. trinn' }),
  N(8, 'forstaa', 'Tekster på 40–80 ord med spørsmål', [T('tekst_sporsmaal', { maksOrd: 80 })], { trinn: '2. trinn', lengde: 5, tekstOppdrag: true }),
  N(9, 'forstaa', 'Lengre tekster: fakta eller mening?', [T('tekst_sporsmaal', { maksOrd: 130 })], { trinn: '2.–3. trinn', lengde: 5, tekstOppdrag: true }),
  N(10, 'dypere', 'Lese mellom linjene: hva skjer egentlig?', [T('tekst2', { type: 'slutning' })], { trinn: '3. trinn', lengde: 5, tekstOppdrag: true }),
  N(11, 'dypere', 'Ordforråd: hva betyr ordet her?', [T('tekst2', { type: 'ordforraad' })], { trinn: '3.–4. trinn', lengde: 5, tekstOppdrag: true }),
  N(12, 'dypere', 'Hovedtanken: hva handler teksten om?', [T('tekst2', { type: 'hovedtanke' })], { trinn: '4. trinn', lengde: 5, tekstOppdrag: true }),
]

// ---------------------------------------------------------------- Skrive riktig
export const OMRAADER_SKRIVE = [{ id: 'rettskriving', navn: 'Skrive riktig', emoji: '✏️', farge: 'bg-rose-500', gradient: 'from-rose-300 via-pink-300 to-red-200', fra: 1, til: 4 }]

export const NIVAER_SKRIVE = [
  N(1, 'rettskriving', 'Diftonger: au, ei, øy, ai', [T('skriv_ord', { gruppe: 'diftonger' }, 2), T('riktig_skrevet', { gruppe: 'diftonger' }, 1)], { trinn: '2. trinn', svar: 'skriv' }),
  N(2, 'rettskriving', 'Kj og skj', [T('skriv_ord', { gruppe: 'kj_skj' }, 2), T('riktig_skrevet', { gruppe: 'kj_skj' }, 1)], { trinn: '2.–3. trinn', svar: 'skriv' }),
  N(3, 'rettskriving', 'Dobbel konsonant', [T('skriv_ord', { gruppe: 'dobbel_konsonant' }, 2), T('riktig_skrevet', { gruppe: 'dobbel_konsonant' }, 1)], { trinn: '2.–3. trinn', svar: 'skriv' }),
  N(4, 'rettskriving', 'Stum h og g, sammensatte ord', [T('skriv_ord', { gruppe: 'stum_h_g' }), T('skriv_ord', { gruppe: 'sammensatte' }), T('riktig_skrevet', { gruppe: 'sammensatte' })], { trinn: '3. trinn', svar: 'skriv' }),
]

// ---------------------------------------------------------------- Språk
export const OMRAADER_SPRAK = [{ id: 'sprak', navn: 'Språk', emoji: '🧩', farge: 'bg-indigo-600', gradient: 'from-indigo-400 via-violet-400 to-fuchsia-300', fra: 1, til: 3 }]

export const NIVAER_SPRAK = [
  N(1, 'sprak', 'Ordklasser: substantiv, verb og adjektiv', [T('ordklasse', {}, 2, true), T('finn_ordklasse', {}, 1, true)], { trinn: '3. trinn' }),
  N(2, 'sprak', 'Bøying: entall og flertall, nåtid og fortid', [T('boying', {}, 1, true)], { trinn: '3. trinn' }),
  N(3, 'sprak', 'Motsetninger og tegnsetting', [T('motsetning', {}), T('tegnsetting', {}, 1, true), T('stor_bokstav', {}, 1, true)], { trinn: '3.–4. trinn' }),
]

export const MAKS_LESING = NIVAER_LESING.length
export const LESE_TAK = 9 // plasseringstesten går aldri over dette
export const AAPNER_VED = 8 // Skrive riktig og Språk åpner når Lese er her

export function omraadeFor(id) {
  return OMRAADER.find((o) => id >= o.fra && id <= o.til) || OMRAADER[0]
}

export const SPOR = [
  { id: 'lesing', navn: 'Lese', emoji: '📖', farge: 'bg-violet-500', nivaer: NIVAER_LESING, verdener: OMRAADER, omraadeFor },
  { id: 'skrive', navn: 'Skrive riktig', emoji: '✏️', farge: 'bg-rose-500', nivaer: NIVAER_SKRIVE, verdener: OMRAADER_SKRIVE, omraadeFor: () => OMRAADER_SKRIVE[0], laast: true },
  { id: 'sprak', navn: 'Språk', emoji: '🧩', farge: 'bg-indigo-600', nivaer: NIVAER_SPRAK, verdener: OMRAADER_SPRAK, omraadeFor: () => OMRAADER_SPRAK[0], laast: true },
]

registerStige('lesing', NIVAER_LESING)
registerStige('skrive', NIVAER_SKRIVE)
registerStige('sprak', NIVAER_SPRAK)
