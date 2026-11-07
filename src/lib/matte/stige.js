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

// `correct`/`total` er spørsmålene (vis-kort og prøv-plassen teller ikke, se
// `tellOppdrag`); `stars` kan gis når stjernene regnes av noe annet.
// `krav` (kunnskapsstigene): { ok, kjent, av, trengs } – nivå opp krever at
// barnet kjenner nok av nivåets egne ting (runde 6, etappe AA). Rekka på to
// gode oppdrag holdes til kravet er oppfylt.
export function applyResult(fag, { correct, total = OPPDRAG_LENGDE, nivaa, perTask = [], hjelpModus = false, stars = null, krav = null }, maks) {
  const next = { ...fag, beste: { ...fag.beste } }
  delete next.perfektRad
  const events = { levelUp: false, levelDown: false, boss: null, toppKlart: false, kravMangler: false, stars: stars ?? starsFor(correct, total) }

  next.beste[nivaa] = Math.max(next.beste[nivaa] || 0, events.stars)
  next.svake = oppdaterSvake(fag.svake, perTask, nivaa)

  // Godt: alle spørsmål riktige unntatt høyst ett (8: 7–8, 5: 4–5).
  // Svakt: halvparten eller færre (8: 0–4, 5: 0–2). Ellers nøytralt.
  const oppGrense = Math.max(1, total - 1)
  const sammeGrense = Math.floor(total / 2) + 1
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
    if (next.paaRad >= 2 && krav && !krav.ok) {
      // To gode på rad, men nivåets ting er ikke lært ennå: rekka holdes.
      next.paaRad = 2
      events.kravMangler = true
    } else if (next.paaRad >= 2) {
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
  // Sjefsoppgaven: alle spørsmål riktige, og (i kunnskapsstigene) nivåets ting kjent.
  if (total > 0 && correct >= total && (!krav || krav.ok)) events.boss = sjefMaal(next.nivaa, maks)
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
// `krav` ({ kjent, av, trengs, ok }) og `navn` («land», «ord») i kunnskapsstigene.
export function kjentTekst(krav, navn = 'ting') {
  if (!krav || !krav.av) return null
  return `Du kjenner ${krav.kjent} av ${krav.av} ${navn}.`
}

export function nesteNivaaTekst(fag, maks, { lengde = OPPDRAG_LENGDE, krav = null, navn = 'ting' } = {}) {
  const n = fag.nivaa || 1
  if (n >= maks) return null
  const gode = krav?.av ? 'alle spørsmål riktige, eller alle unntatt ett' : lengde === 5 ? '4 eller 5 riktige' : '7 eller 8 riktige'
  const kj = kjentTekst(krav, navn)
  const pre = kj ? `${kj} ` : ''
  if (krav?.av && !krav.ok) {
    const rad = (fag.paaRad || 0) >= 2 ? '' : ' og har to gode oppdrag på rad'
    return `${pre}Nivå ${n + 1} åpner når du kjenner ${krav.trengs}${rad}.${fag.hjelpNeste ? ' Neste oppdrag er med hjelp.' : ''}`
  }
  if (fag.hjelpNeste) return `${pre}Neste oppdrag er med hjelp. Etterpå åpner nivå ${n + 1} etter to gode oppdrag på rad (${gode}).`
  if ((fag.paaRad || 0) >= 1) return `${pre}Ett godt oppdrag til (${gode}), så åpner nivå ${n + 1}!`
  return `${pre}To gode oppdrag på rad (${gode}) åpner nivå ${n + 1}. Alle riktige gir sjefsoppgave.`
}

// Samme på resultatskjermen, ut fra faget slik det er etter oppdraget.
export function resultatNivaaTekst(fag, maks, { lengde = OPPDRAG_LENGDE, krav = null, navn = 'ting' } = {}) {
  const n = fag.nivaa || 1
  if (n >= maks) return null
  const gode = krav?.av ? 'alle spørsmål riktige, eller alle unntatt ett' : lengde === 5 ? '4 eller 5 riktige' : '7 eller 8 riktige'
  const kj = kjentTekst(krav, navn)
  const pre = kj ? `${kj} ` : ''
  if (krav?.av && !krav.ok) {
    if ((fag.paaRad || 0) >= 2) return `${pre}To gode oppdrag på rad! Nivå ${n + 1} åpner når du kjenner ${krav.trengs}.`
    return `${pre}Nivå ${n + 1} åpner når du kjenner ${krav.trengs} og har to gode oppdrag på rad.`
  }
  if (fag.hjelpNeste) return `${pre}Neste oppdrag blir med hjelp, så det blir litt lettere. Nivå ${n + 1} åpner etter to gode oppdrag på rad.`
  if ((fag.paaRad || 0) >= 1) return `${pre}1 av 2 gode oppdrag på rad! Ett til med ${gode}, så åpner nivå ${n + 1}.`
  return `${pre}Nivå ${n + 1} åpner etter to gode oppdrag på rad (${gode}).`
}

// Hvilke svake typer gjelder nå (alle på lista), med nivået bommen kom fra.
export function activeWeakTypes(fag) {
  return Object.keys(fag.svake || {})
}
export function weakEntries(fag) {
  return Object.entries(fag.svake || {}).map(([type, v]) => ({ type, nivaa: v?.nivaa ?? null }))
}
