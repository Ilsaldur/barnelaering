// Hva reven har på (runde 5, etappe W): `data.kostymerPaa` er en liste med
// kostyme-id-er, høyst ett per plass. Rene funksjoner.
import { kostymeById } from '../data/kostymer.js'

// Ta på et kostyme: det som lå på samme plass, tas av. Resten blir på.
export function taPaa(liste, id) {
  const k = kostymeById(id)
  if (!k) return [...(liste || [])]
  const uten = (liste || []).filter((x) => x !== id && kostymeById(x)?.plass !== k.plass)
  return [...uten, id]
}

export function taAv(liste, id) {
  return (liste || []).filter((x) => x !== id)
}

export function harPaa(liste, id) {
  return (liste || []).includes(id)
}

// Gamle profiler hadde ett kostyme i `kostyme`. Det blir lista.
export function migrerKostyme(raw) {
  if (Array.isArray(raw?.kostymerPaa)) return raw.kostymerPaa.filter((x) => typeof x === 'string' && kostymeById(x))
  if (raw?.kostyme && kostymeById(raw.kostyme)) return [raw.kostyme]
  return []
}
