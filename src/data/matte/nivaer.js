// Mattestigen: 38 nivåer i fem verdener. Hvert nivå er én smal ferdighet.
// `typer` er oppgavetypene nivået øver (navn på generatorer i
// src/lib/matte/generatorer.js) med parametre og vekt. `svar` sier om barnet
// trykker på svaret (valg) eller skriver det (tastatur). `kort` peker på
// kortstokken som øves med fem bokser.
import { registerStige } from '../stiger.js'

export const VERDENER = [
  { id: 'skog', navn: 'Trylleskogen', emoji: '🌳', farge: 'bg-emerald-500', gradient: 'from-emerald-300 via-green-300 to-lime-200', trinn: 'Før skolestart', fra: 1, til: 6 },
  { id: 'hav', navn: 'Det blå havet', emoji: '🌊', farge: 'bg-sky-500', gradient: 'from-sky-300 via-cyan-300 to-blue-200', trinn: '1. trinn og høsten i 2.', fra: 7, til: 14 },
  { id: 'fjell', navn: 'Det høye fjellet', emoji: '⛰️', farge: 'bg-slate-500', gradient: 'from-slate-300 via-stone-300 to-sky-200', trinn: '2. trinn', fra: 15, til: 22 },
  { id: 'slott', navn: 'Det gylne slottet', emoji: '🏰', farge: 'bg-amber-500', gradient: 'from-amber-300 via-yellow-300 to-orange-200', trinn: '3.–4. trinn', fra: 23, til: 30 },
  { id: 'rom', navn: 'Verdensrommet', emoji: '🚀', farge: 'bg-indigo-600', gradient: 'from-indigo-400 via-violet-400 to-fuchsia-300', trinn: '4.–5. trinn', fra: 31, til: 38 },
]

const N = (id, verden, tittel, typer, extra = {}) => ({ id, verden, tittel, typer, svar: id <= 6 ? 'valg' : 'tastatur', ...extra })
const T = (type, param = {}, vekt = 1) => ({ type, param, vekt })

export const NIVAER = [
  // Trylleskogen – trykk på svaret, alt leses opp
  N(1, 'skog', 'Telle 1–5 og terningbilder', [T('tell', { min: 1, max: 5 }, 2), T('terning', { max: 6 }, 1)], { trinn: 'Før skolestart' }),
  N(2, 'skog', 'Telle 6–10', [T('tell', { min: 5, max: 10 }, 1)], { trinn: 'Før skolestart' }),
  N(3, 'skog', 'Tallrekka til 20: før, etter og mangler', [T('tallrekke_etter', { max: 20 }), T('tallrekke_for', { max: 20 }), T('tallrekke_mangler', { max: 20 }), T('tallinje_plasser', { from: 0, to: 20, step: 1, labelEvery: 5 })], { trinn: 'Før skolestart' }),
  N(4, 'skog', 'Mer, mindre og like mange', [T('mer_mindre_mengder', { max: 10 }), T('storst_minst', { max: 20 }), T('sammenlign', { max: 20 }), T('sorter_tall', { max: 20, n: 4 })], { trinn: 'Før skolestart' }),
  N(5, 'skog', 'Dele opp tall til 5, pluss og minus innenfor 5', [T('dele_opp', { max: 5 }), T('pluss_valg', { max: 5 }), T('minus_valg', { max: 5 })], { trinn: 'Før skolestart' }),
  N(6, 'skog', 'Dele opp tall til 10, pluss og minus innenfor 10', [T('dele_opp', { max: 10 }), T('pluss_valg', { max: 10 }), T('minus_valg', { max: 10 })], { trinn: 'Før skolestart', hjelpAlltid: true }),

  // Det blå havet – herfra skriver barnet svaret
  N(7, 'hav', 'Pluss innenfor 10', [T('pluss_innen_10', { max: 10 }, 2), T('pluss_apen', { max: 10 }, 1)], { trinn: '1. trinn' }),
  N(8, 'hav', 'Minus innenfor 10', [T('minus_innen_10', { max: 10 }, 2), T('minus_apen', { max: 10 }, 1)], { trinn: '1. trinn' }),
  N(9, 'hav', 'Tiervenner og dobling', [T('tiervenner', {}, 2), T('dobling', { max: 10 }, 1)], { trinn: '1. trinn', kort: 'tiervenner' }),
  N(10, 'hav', 'Tallene 11–20 som tiere og enere', [T('tiere_enere_20', {})], { trinn: '1. trinn' }),
  N(11, 'hav', 'Pluss og minus innenfor 20 uten tierovergang', [T('pluss_uten_overgang_20', {}), T('minus_uten_overgang_20', {})], { trinn: '1. trinn' }),
  N(12, 'hav', 'Pluss med tierovergang', [T('pluss_tierovergang', {})], { trinn: '1.–2. trinn' }),
  N(13, 'hav', 'Minus med tierovergang', [T('minus_tierovergang', {})], { trinn: '1.–2. trinn' }),
  N(14, 'hav', 'Partall og oddetall, telle med 2, 5 og 10', [T('partall_oddetall', { max: 100 }), T('telle_med', { steps: [2, 5, 10], max: 100 })], { trinn: '2. trinn' }),

  // Det høye fjellet
  N(15, 'fjell', 'Tall til 100: tiere og enere, tallinja, større og mindre', [T('tiere_enere_100', {}), T('tallinje_100', {}), T('storre_mindre_100', {}), T('tallinje_plasser', { from: 0, to: 100, step: 5, labelEvery: 10 }), T('sorter_tall', { max: 100, min: 10, n: 4 })], { trinn: '2. trinn' }),
  N(16, 'fjell', 'Hele tiere og ti mer eller mindre', [T('hele_tiere', {}), T('ti_mer_mindre', {})], { trinn: '2. trinn' }),
  N(17, 'fjell', 'Tosifret pluss og minus ensifret uten tierovergang', [T('tosifret_ensifret_uten', {})], { trinn: '2. trinn' }),
  N(18, 'fjell', 'Tosifret pluss og minus ensifret med tierovergang', [T('tosifret_ensifret_med', {})], { trinn: '2. trinn' }),
  N(19, 'fjell', 'Tosifret pluss og minus tosifret uten veksling', [T('tosifret_tosifret_uten', {})], { trinn: '2. trinn' }),
  N(20, 'fjell', 'Tosifret pluss og minus tosifret med veksling', [T('tosifret_tosifret_med', {})], { trinn: '2. trinn' }),
  N(21, 'fjell', 'Åpne oppgaver og likhetstegn', [T('apen_oppgave', {}), T('likhetstegn', {})], { trinn: '2. trinn' }),
  N(22, 'fjell', 'Dobling og halvering til 100, penger og tekstoppgaver', [T('dobling_halvering_100', {}), T('penger', {}), T('tekst_enkel', {})], { trinn: '2. trinn' }),

  // Det gylne slottet
  N(23, 'slott', 'Gange som like grupper, 2- og 10-gangen', [T('gange_grupper', { tabeller: [2, 10] }), T('gange_rutenett', { max: 5 }), T('gange_tabell', { tabeller: [2, 10] }, 2)], { trinn: '3. trinn', kort: 'gange', kortTabeller: [2, 10] }),
  N(24, 'slott', '5- og 4-gangen', [T('gange_tabell', { tabeller: [5, 4] }, 3), T('gange_grupper', { tabeller: [5, 4] }, 1)], { trinn: '3. trinn', kort: 'gange', kortTabeller: [2, 10, 5, 4] }),
  N(25, 'slott', '3- og 6-gangen', [T('gange_tabell', { tabeller: [3, 6] }, 3), T('gange_rutenett', { max: 6 }, 1)], { trinn: '3. trinn', kort: 'gange', kortTabeller: [2, 10, 5, 4, 3, 6] }),
  N(26, 'slott', '9-, 8- og 7-gangen', [T('gange_tabell', { tabeller: [9, 8, 7] }, 3)], { trinn: '3. trinn', kort: 'gange', kortTabeller: [2, 10, 5, 4, 3, 6, 9, 8, 7] }),
  N(27, 'slott', 'Blandet gangetabell til 10 × 10', [T('gange_blandet', {}, 2), T('gange_apen', {}, 1)], { trinn: '3.–4. trinn', kort: 'gange', kortTabeller: [2, 3, 4, 5, 6, 7, 8, 9, 10] }),
  N(28, 'slott', 'Deling som omvendt gange, med og uten rest', [T('deling', { max: 10 }, 2), T('deling_rest', {}, 1)], { trinn: '3.–4. trinn' }),
  N(29, 'slott', 'Tall til 1000, tresifret pluss og minus', [T('tall_1000', {}), T('tresifret_pluss_minus', {}, 2), T('sorter_tall', { max: 999, min: 100, n: 4 })], { trinn: '3.–4. trinn' }),
  N(30, 'slott', 'Tekstoppgaver med ett steg: velg regneart', [T('velg_regneart', {})], { trinn: '4. trinn' }),

  // Verdensrommet
  N(31, 'rom', 'Tall til 10 000, avrunding, firesifret pluss og minus', [T('tall_10000', {}), T('firesifret_pluss_minus', {})], { trinn: '4. trinn' }),
  N(32, 'rom', 'Tosifret ganger ensifret', [T('tosifret_ganger_ensifret', {})], { trinn: '4. trinn' }),
  N(33, 'rom', 'Tosifret delt på ensifret, med og uten rest', [T('tosifret_delt_ensifret', {})], { trinn: '4. trinn' }),
  N(34, 'rom', 'Negative tall på tallinje og termometer', [T('negative_tall', {}, 2), T('tallinje_plasser', { from: -10, to: 10, step: 1, labelEvery: 5 }, 1)], { trinn: '4.–5. trinn' }),
  N(35, 'rom', 'Brøk av figur og mengde, sammenligne brøker', [T('brok', {})], { trinn: '4.–5. trinn' }),
  N(36, 'rom', 'Tideler, desimaltall, kroner og øre', [T('desimal', {})], { trinn: '4.–5. trinn' }),
  N(37, 'rom', 'Areal og omkrets, koordinater', [T('areal_omkrets', {}), T('koordinater', {})], { trinn: '4.–5. trinn' }),
  N(38, 'rom', 'Likninger, tekstoppgaver med to steg, parenteser', [T('likning', {})], { trinn: '5. trinn' }),
]

export const MAKS = NIVAER.length

export function nivaa(id) {
  return NIVAER[id - 1] || null
}

export function verdenFor(id) {
  return VERDENER.find((v) => id >= v.fra && id <= v.til) || VERDENER[0]
}

export function verdenById(vid) {
  return VERDENER.find((v) => v.id === vid) || VERDENER[0]
}

registerStige('matte', NIVAER)
