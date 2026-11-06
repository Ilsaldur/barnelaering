// Plasseringstest første gang et fag åpnes: 8–12 oppgaver. Start litt under
// det som er vanlig, gå tre nivåer opp ved riktig svar og to ned ved feil.

export const PLASSERING_MIN = 8
export const PLASSERING_MAKS = 12

// Startnivå per startverden (litt under der verdenen «egentlig» begynner).
export const START_NIVAA = { skog: 1, hav: 6, fjell: 13, slott: 21, rom: 29 }

export function startPlassering(startverden = 'skog', maks = 38) {
  const start = Math.min(maks, Math.max(1, START_NIVAA[startverden] ?? 1))
  return { pos: start, steg: [], ferdig: false, nivaa: null, maks }
}

export function stegPlassering(state, ok) {
  const steg = [...state.steg, { nivaa: state.pos, ok }]
  let pos = ok ? state.pos + 3 : state.pos - 2
  pos = Math.min(state.maks, Math.max(1, pos))
  const next = { ...state, pos, steg }
  const n = steg.length
  // Ferdig når vi har minst 8 svar og retningen har snudd (eller vi er i tak/bunn), senest etter 12.
  const snudd = n >= 2 && steg[n - 1].ok !== steg[n - 2].ok
  const kant = (ok && state.pos === state.maks) || (!ok && state.pos === 1)
  if (n >= PLASSERING_MAKS || (n >= PLASSERING_MIN && (snudd || kant))) {
    next.ferdig = true
    next.nivaa = sluttNivaa(steg, state.maks)
  }
  return next
}

// Sluttnivå: det høyeste nivået barnet klarte blant de siste fire svarene,
// ellers det laveste nivået barnet bommet på, minus ett. Alltid minst 1.
export function sluttNivaa(steg, maks = 38) {
  const siste = steg.slice(-4)
  const klarte = siste.filter((s) => s.ok).map((s) => s.nivaa)
  if (klarte.length) return Math.min(maks, Math.max(1, Math.max(...klarte)))
  const bommet = steg.filter((s) => !s.ok).map((s) => s.nivaa)
  if (bommet.length) return Math.max(1, Math.min(...bommet) - 1)
  return 1
}
