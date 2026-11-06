// Nivåregler for en stige. Rene funksjoner over fag-tilstanden i profilen
// (se emptyFag i src/lib/profil.js).
//
//  - 7–8 riktige i to oppdrag på rad: nivå opp, med feiring.
//  - 5–6 riktige: samme nivå, nye oppgaver.
//  - 0–4 riktige: neste oppdrag har hjelp på og henter halvparten fra nivået
//    under. Ingen melding om å rykke ned.
//  - 8 av 8 i to oppdrag på rad: tilby sjefsoppgave fra to–tre nivåer høyere.
//  - Bare første forsøk uten hjelp teller (`correct` er allerede telt slik).
import { starsFor } from '../scoring.js'
import { todayKey } from '../profil.js'

export const OPPDRAG_LENGDE = 8
export const SJEF_LENGDE = 5
export const SJEF_KREVER = 4

export function applyResult(fag, { correct, total = OPPDRAG_LENGDE, nivaa, missedTypes = [] }, maks) {
  const next = { ...fag, beste: { ...fag.beste }, svake: { ...fag.svake } }
  const events = { levelUp: false, boss: null, stars: starsFor(correct, total) }

  // Beste stjerner på nivået (bare første forsøk).
  next.beste[nivaa] = Math.max(next.beste[nivaa] || 0, events.stars)

  if (correct >= 7) {
    next.paaRad = (fag.paaRad || 0) + 1
    next.hjelpNeste = false
  } else if (correct >= 5) {
    next.paaRad = 0
    next.hjelpNeste = false
  } else {
    next.paaRad = 0
    next.hjelpNeste = true
  }
  next.perfektRad = correct >= total ? (fag.perfektRad || 0) + 1 : 0

  if (next.paaRad >= 2 && nivaa < maks) {
    next.nivaa = nivaa + 1
    next.paaRad = 0
    next.perfektRad = 0
    events.levelUp = true
  }
  if (!events.levelUp && next.perfektRad >= 2 && nivaa < maks) {
    events.boss = Math.min(maks, nivaa + (nivaa + 3 <= maks ? 3 : 2))
    next.perfektRad = 0
  }

  // Oppgavetyper barnet bommet på, kommer tilbake i neste oppdrag og dagen etter.
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  for (const t of missedTypes) {
    const cur = next.svake[t] || { bom: 0 }
    next.svake[t] = { bom: (cur.bom || 0) + 1, til: todayKey(tomorrow) }
  }
  // Rydd bort gamle svake typer som ikke bommet nå.
  const today = todayKey()
  for (const [t, v] of Object.entries(next.svake)) {
    if (!missedTypes.includes(t) && v.til < today) delete next.svake[t]
  }
  return { fag: next, events }
}

// Sjefsoppgave: minst fire av fem riktige gir hopp til målnivået.
export function applyBoss(fag, { correct, target }) {
  if (correct >= SJEF_KREVER) {
    return { fag: { ...fag, nivaa: target, paaRad: 0, perfektRad: 0, hjelpNeste: false }, passed: true }
  }
  return { fag: { ...fag, perfektRad: 0 }, passed: false }
}

// Hvilke svake typer er aktive i dag?
export function activeWeakTypes(fag, today = todayKey()) {
  return Object.entries(fag.svake || {})
    .filter(([, v]) => v.til >= today)
    .map(([t]) => t)
}
