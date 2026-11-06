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
      out[r.type] = { bom: (cur?.bom || 0) + 1, riktig: 0 }
    }
  }
  return out
}

export function applyResult(fag, { correct, total = OPPDRAG_LENGDE, nivaa, perTask = [] }, maks) {
  const next = { ...fag, beste: { ...fag.beste } }
  delete next.perfektRad
  const events = { levelUp: false, levelDown: false, boss: null, stars: starsFor(correct, total) }

  next.beste[nivaa] = Math.max(next.beste[nivaa] || 0, events.stars)
  next.svake = oppdaterSvake(fag.svake, perTask, nivaa)

  const oppGrense = Math.ceil((total * 7) / 8)
  const sammeGrense = Math.ceil((total * 5) / 8)
  if (correct >= oppGrense) {
    next.paaRad = (fag.paaRad || 0) + 1
    next.svakRad = 0
    next.hjelpNeste = false
    if (next.paaRad >= 2) {
      next.paaRad = 0
      if (nivaa < maks) {
        next.nivaa = nivaa + 1
        events.levelUp = true
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

// Hvilke svake typer gjelder nå (alle på lista).
export function activeWeakTypes(fag) {
  return Object.keys(fag.svake || {})
}
