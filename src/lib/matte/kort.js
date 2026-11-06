// Kort i fem bokser (Leitner). Riktig svar flytter kortet én boks opp,
// feil sender det til boks 1. Kort i høyere bokser trekkes sjeldnere.
import { shuffle } from '../rng.js'

export const BOKSER = 5
// Hvor ofte kort i hver boks trekkes (relativ vekt).
const VEKT = { 1: 8, 2: 4, 3: 2, 4: 1, 5: 0.4 }

export function tiervennerKort() {
  return Array.from({ length: 9 }, (_, i) => ({ id: `tiervenner:${i + 1}`, type: 'tiervenner', param: { a: i + 1 } }))
}

export function gangeKort(tabeller) {
  const out = []
  for (const t of tabeller) {
    for (let k = 1; k <= 10; k++) out.push({ id: `gange:${t}x${k}`, type: 'gange_tabell', param: { a: t, b: k, tabeller } })
  }
  return out
}

export function kortstokk(navn, tabeller) {
  if (navn === 'tiervenner') return tiervennerKort()
  if (navn === 'gange') return gangeKort(tabeller || [2, 10])
  return []
}

export function boksFor(bokser, id) {
  return bokser?.[id]?.boks || 1
}

// Trekk n kort, vektet etter boks. Ingen kort to ganger.
export function trekkKort(stokk, bokser, n, rng = Math.random) {
  const pool = stokk.map((k) => ({ k, w: VEKT[boksFor(bokser, k.id)] || 1 }))
  const out = []
  while (out.length < n && pool.length) {
    const total = pool.reduce((s, p) => s + p.w, 0)
    let r = rng() * total
    let idx = 0
    for (; idx < pool.length; idx++) {
      r -= pool[idx].w
      if (r <= 0) break
    }
    idx = Math.min(idx, pool.length - 1)
    out.push(pool[idx].k)
    pool.splice(idx, 1)
  }
  return shuffle(out, rng)
}

export function oppdaterBoks(bokser, id, ok, now = Date.now()) {
  const cur = boksFor(bokser, id)
  const boks = ok ? Math.min(BOKSER, cur + 1) : 1
  return { ...(bokser || {}), [id]: { boks, t: now } }
}

// Oversikt til kart/voksenside: hvor mange kort i hver boks.
export function boksFordeling(stokk, bokser) {
  const out = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const k of stokk) out[boksFor(bokser, k.id)]++
  return out
}
