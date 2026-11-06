// Alle oppgavegeneratorer i mattestigen, samlet i ett oppslag.
// gen(type, param, rng) → oppgave:
//   { type, form: 'valg'|'tastatur'|'santusant', prompt, spoken, answer,
//     options?, visual?, hjelp?, explain, allowNegative?, allowDecimal?, unit?, kortId? }
import { GEN_SKOG } from './gen_skog.js'
import { GEN_HAV_FJELL } from './gen_hav_fjell.js'
import { GEN_SLOTT_ROM } from './gen_slott_rom.js'
import { registerTypeLabels } from '../labels.js'

export const GENERATORER = { ...GEN_SKOG, ...GEN_HAV_FJELL, ...GEN_SLOTT_ROM }

export function gen(type, param = {}, rng = Math.random) {
  const g = GENERATORER[type]
  if (!g) throw new Error(`Ukjent oppgavetype: ${type}`)
  const task = g(param, rng)
  task.type = task.type || type
  if (task.form === 'valg' && !Array.isArray(task.options)) throw new Error(`Oppgave uten alternativer: ${type}`)
  if (task.form === 'sorter' && !Array.isArray(task.items)) throw new Error(`Sorteringsoppgave uten elementer: ${type}`)
  return task
}

// Lesbare navn (voksensiden: «bommer mest på»).
export const TYPE_LABELS = {
  tell: 'Telle ting',
  terning: 'Terningbilder',
  tallrekke_etter: 'Tallet etter',
  tallrekke_for: 'Tallet før',
  tallrekke_mangler: 'Tall som mangler i rekka',
  telle_med: 'Telle med 2, 5 og 10',
  mer_mindre_mengder: 'Flest, færrest og like mange',
  storst_minst: 'Størst og minst',
  sammenlign: 'Mer enn og mindre enn',
  dele_opp: 'Dele opp tall',
  pluss_innen_10: 'Pluss innenfor 10',
  minus_innen_10: 'Minus innenfor 10',
  pluss_apen: 'Pluss med ukjent tall',
  minus_apen: 'Minus med ukjent tall',
  tiervenner: 'Tiervenner',
  dobling: 'Dobling',
  tiere_enere_20: 'Tiere og enere til 20',
  pluss_uten_overgang_20: 'Pluss til 20 uten tierovergang',
  minus_uten_overgang_20: 'Minus til 20 uten tierovergang',
  pluss_tierovergang: 'Pluss med tierovergang',
  minus_tierovergang: 'Minus med tierovergang',
  partall_oddetall: 'Partall og oddetall',
  tiere_enere_100: 'Tiere og enere til 100',
  tallinje_100: 'Tallinja til 100',
  storre_mindre_100: 'Større og mindre til 100',
  hele_tiere: 'Hele tiere',
  ti_mer_mindre: 'Ti mer og ti mindre',
  tosifret_ensifret_uten: 'Tosifret ± ensifret uten overgang',
  tosifret_ensifret_med: 'Tosifret ± ensifret med overgang',
  tosifret_tosifret_uten: 'Tosifret ± tosifret uten veksling',
  tosifret_tosifret_med: 'Tosifret ± tosifret med veksling',
  apen_oppgave: 'Åpne oppgaver',
  likhetstegn: 'Likhetstegnet',
  dobling_halvering_100: 'Dobling og halvering',
  penger: 'Penger',
  tekst_enkel: 'Enkle tekstoppgaver',
  gange_grupper: 'Gange som like grupper',
  gange_rutenett: 'Gange som rutenett',
  gange_tabell: 'Gangetabell',
  gange_blandet: 'Blandet gangetabell',
  gange_apen: 'Gange med ukjent tall',
  deling: 'Deling',
  deling_rest: 'Deling med rest',
  tall_1000: 'Tall til 1000',
  tresifret_pluss_minus: 'Tresifret pluss og minus',
  velg_regneart: 'Velge regneart',
  tekst_ett_steg: 'Tekstoppgaver med ett steg',
  tall_10000: 'Tall til 10 000',
  avrunding: 'Avrunding',
  firesifret_pluss_minus: 'Firesifret pluss og minus',
  tosifret_ganger_ensifret: 'Tosifret ganger ensifret',
  tosifret_delt_ensifret: 'Tosifret delt på ensifret',
  negative_tall: 'Negative tall',
  brok: 'Brøk',
  desimal: 'Desimaltall',
  areal: 'Areal',
  omkrets: 'Omkrets',
  koordinater: 'Koordinater',
  likning: 'Likninger',
  parentes: 'Parenteser',
  tekst_to_steg: 'Tekstoppgaver med to steg',
  sorter_tall: 'Sortere tall',
  tallinje_plasser: 'Plassere tall på tallinja',
}

registerTypeLabels(TYPE_LABELS)
