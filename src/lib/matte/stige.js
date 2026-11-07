// Nivåregler etter et oppdrag. «Riktig» er riktig på første forsøk uten hjelp.
//
//  - 7 eller 8 riktige: paaRad + 1. Når paaRad er 2, ett nivå opp og paaRad = 0.
//  - 5 eller 6 riktige: paaRad = 0.
//  - 0–4 riktige: paaRad = 0 og hjelp i neste oppdrag. To slike på rad flytter
//    barnet ett nivå ned (aldri under 1), med en vennlig melding.
//  - 8 av 8: sjefsoppgaven tilbys på resultatskjermen, så lenge barnet ikke
//    står på toppnivået. Målet er tre nivåer over nivået etter oppdraget.
//
// Bom-lista (svake): typer fra eget nivå og repetisjon. Fjernes etter to
// riktige på første forsøk. Tømmes når nivået settes for hånd, etter
// plasseringstest og når barnet flyttes ned.
import { starsFor } from '../scoring.js'

export const OPPDRAG_LENGDE = 8
export const SJEF_LENGDE = 5
export const SJEF_KREVER = 4
export const SJEF_HOPP = 3

export function sjefMaal(nivaa, maks) {
  if (nivaa >= maks) return null
  return Math.min(maks, nivaa + SJEF_HOPP)
}

// Oppdater bom-lista ut fra enkeltsvarene i oppdraget (bare eget nivå og repetisjon).
export function oppdaterSvake(svake, perTask, nivaa) {
  const out = { ...(svake || {}) }
  for (const r of perTask) {
    if (!['eget', 'rep', 'svak', 'kort', 'under'].includes(r.tag)) continue
    if (r.nivaa != null && r.nivaa > nivaa) continue
    const cur = out[r.type]
    if (r.counts) {
      if (cur) {
        const riktig = (cur.riktig || 0) + 1
        if (riktig >= 2) delete out[r.type]
        else out[r.type] = { ...cur, riktig }
      }
    } else if (!r.ok) {
      out[r.type] = { bom: (cur?.bom || 0) + 1, riktig: 0, nivaa: r.nivaa ?? cur?.nivaa ?? nivaa }
    }
  }
  return out
}

export function applyResult(fag, { correct, total = OPPDRAG_LENGDE, nivaa, perTask = [], hjelpModus = false }, maks) {
  const next = { ...fag, beste: { ...fag.beste } }
  delete next.perfektRad
  const events = { levelUp: false, levelDown: false, boss: null, toppKlart: false, stars: starsFor(correct, total) }

  next.beste[nivaa] = Math.max(next.beste[nivaa] || 0, events.stars)
  next.svake = oppdaterSvake(fag.svake, perTask, nivaa)

  // 8 oppgaver: 7–8 godt, 5–6 nøytralt, 0–4 svakt. 5 oppgaver: 4–5 godt, 3 nøytralt, 0–2 svakt.
  const oppGrense = total === 5 ? 4 : Math.ceil((total * 7) / 8)
  const sammeGrense = total === 5 ? 3 : Math.ceil((total * 5) / 8)
  if (hjelpModus && correct >= sammeGrense) {
    // Et oppdrag i hjelpemodus gir aldri paaRad + 1 og aldri sjefsoppgave.
    // Går det bra, slås hjelpemodus av.
    next.svakRad = 0
    next.hjelpNeste = false
    next.sjef = null
    return { fag: next, events }
  }
  if (correct >= oppGrense) {
    next.paaRad = (fag.paaRad || 0) + 1
    next.svakRad = 0
    next.hjelpNeste = false
    if (next.paaRad >= 2) {
      next.paaRad = 0
      if (nivaa < maks) {
        next.nivaa = nivaa + 1
        events.levelUp = true
      } else {
        // Toppnivået klart to ganger: hele stigen er klart. Meldingen vises én gang.
        if (!fag.toppKlart) events.toppKlart = true
        next.toppKlart = true
      }
    }
  } else if (correct >= sammeGrense) {
    next.paaRad = 0
    next.svakRad = 0
    next.hjelpNeste = false
  } else {
    next.paaRad = 0
    next.hjelpNeste = true
    next.svakRad = (fag.svakRad || 0) + 1
    if (next.svakRad >= 2) {
      next.svakRad = 0
      if (nivaa > 1) {
        next.nivaa = nivaa - 1
        events.levelDown = true
        next.svake = {}
        next.hjelpNeste = false // flyttes barnet ned, slås hjelpemodus av
      }
    }
  }
  next.sjef = null
  if (correct >= total) events.boss = sjefMaal(next.nivaa, maks)
  return { fag: next, events }
}

// Sjefsoppgave: minst fire av fem riktige gir hopp til målet, ellers ingen endring.
export function applyBoss(fag, { correct, target }) {
  if (correct >= SJEF_KREVER) {
    return { fag: { ...fag, nivaa: target, paaRad: 0, svakRad: 0, hjelpNeste: false, sjef: null, svake: {} }, passed: true }
  }
  return { fag: { ...fag, sjef: null }, passed: false }
}

// Nivå satt for hånd eller etter plassering: nullstill rekker og bom-liste.
export function settNivaa(fag, nivaa) {
  return { ...fag, nivaa, plassert: true, paaRad: 0, svakRad: 0, hjelpNeste: false, sjef: null, svake: {} }
}

// Hva som skal til for neste nivå, i klartekst (kartet). null på toppen.
export function nesteNivaaTekst(fag, maks, { lengde = OPPDRAG_LENGDE } = {}) {
  const n = fag.nivaa || 1
  if (n >= maks) return null
  const gode = lengde === 5 ? '4 eller 5 riktige' : '7 eller 8 riktige'
  if (fag.hjelpNeste) return `Neste oppdrag er med hjelp. Etterpå åpner nivå ${n + 1} etter to gode oppdrag på rad (${gode}).`
  if ((fag.paaRad || 0) >= 1) return `Ett godt oppdrag til (${gode}), så åpner nivå ${n + 1}!`
  return `To gode oppdrag på rad (${gode}) åpner nivå ${n + 1}. Alle riktige gir sjefsoppgave.`
}

// Samme på resultatskjermen, ut fra faget slik det er etter oppdraget.
export function resultatNivaaTekst(fag, maks, { lengde = OPPDRAG_LENGDE } = {}) {
  const n = fag.nivaa || 1
  if (n >= maks) return null
  const gode = lengde === 5 ? '4 eller 5 riktige' : '7 eller 8 riktige'
  if (fag.hjelpNeste) return `Neste oppdrag blir med hjelp, så det blir litt lettere. Nivå ${n + 1} åpner etter to gode oppdrag på rad.`
  if ((fag.paaRad || 0) >= 1) return `1 av 2 gode oppdrag på rad! Ett til med ${gode}, så åpner nivå ${n + 1}.`
  return `Nivå ${n + 1} åpner etter to gode oppdrag på rad (${gode}).`
}

// Hvilke svake typer gjelder nå (alle på lista), med nivået bommen kom fra.
export function activeWeakTypes(fag) {
  return Object.keys(fag.svake || {})
}
export function weakEntries(fag) {
  return Object.entries(fag.svake || {}).map(([type, v]) => ({ type, nivaa: v?.nivaa ?? null }))
}
