// Oppgavegeneratorer for geografistigen: flagg, land, hovedsteder, kart.
import { pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'
import { landFor, VERDENSDELER } from '../../data/geo/land.js'
import { storeNokPaaVerdenskart } from './topo.js'

// På verdenskartet spørres det bare etter land som synes godt (minst 24 × 24
// punkter på mobil). Små europeiske land hører til Europa-kartet.
let storeIds = null
function kartPool(region) {
  const pool = landFor(region)
  if (region !== 'verden') return pool
  if (!storeIds) storeIds = new Set(storeNokPaaVerdenskart(pool.map((l) => l.id)))
  return pool.filter((l) => storeIds.has(l.id))
}

function andre(pool, l, n, rng) {
  return shuffle(
    pool.filter((x) => x.id !== l.id),
    rng,
  ).slice(0, n)
}

export const GEN_GEO = {
  // Flagg → land.
  flagg_land: ({ region = 'norden' }, rng) => {
    const pool = landFor(region)
    const l = pick(pool, rng)
    const feil = andre(pool, l, 3, rng)
    return {
      type: `flagg_${region}`,
      form: 'valg',
      prompt: 'Hvilket land har dette flagget?',
      spoken: 'Hvilket land har dette flagget?',
      visual: { kind: 'ikon', emoji: l.flagg },
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      explain: `${l.flagg} er flagget til ${l.navn}.`,
      readOptions: true,
    }
  },
  // Land → flagg.
  land_flagg: ({ region = 'norden' }, rng) => {
    const pool = landFor(region)
    const l = pick(pool, rng)
    const feil = andre(pool, l, 3, rng)
    return {
      type: `flagg_${region}`,
      form: 'valg',
      prompt: `Hvilket flagg er ${l.navn} sitt?`,
      spoken: `Hvilket flagg er ${l.navn} sitt?`,
      answer: l.flagg,
      options: shuffle([l.flagg, ...feil.map((x) => x.flagg)], rng),
      explain: `${l.navn} har flagget ${l.flagg}.`,
      stor: true,
    }
  },
  // Hovedstad.
  hovedstad: ({ region = 'norden' }, rng) => {
    const pool = landFor(region)
    const l = pick(pool, rng)
    const feil = andre(pool, l, 3, rng)
    if (rng() < 0.5) {
      return {
        type: `hovedstad_${region}`,
        form: 'valg',
        prompt: `Hva er hovedstaden i ${l.navn}?`,
        spoken: `Hva er hovedstaden i ${l.navn}?`,
        visual: { kind: 'ikon', emoji: l.flagg },
        answer: l.hovedstad,
        options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
        explain: `Hovedstaden i ${l.navn} er ${l.hovedstad}.`,
        readOptions: true,
      }
    }
    return {
      type: `hovedstad_${region}`,
      form: 'valg',
      prompt: `${l.hovedstad} er hovedstaden i …`,
      spoken: `${l.hovedstad} er hovedstaden i hvilket land?`,
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      explain: `${l.hovedstad} er hovedstaden i ${l.navn}.`,
      readOptions: true,
    }
  },
  // Finn landet på kartet.
  finn_paa_kart: ({ region = 'norden' }, rng) => {
    const pool = kartPool(region)
    const l = pick(pool, rng)
    return {
      type: `kart_${region}`,
      form: 'kart',
      prompt: `Trykk på ${l.navn} på kartet.`,
      spoken: `Trykk på ${l.navn} på kartet.`,
      region,
      answer: l.id,
      explain: `${l.navn} ${l.flagg} er markert med grønt.`,
    }
  },
  // Hvilket land er markert?
  hvilket_land: ({ region = 'norden' }, rng) => {
    const pool = kartPool(region)
    const l = pick(pool, rng)
    const feil = andre(landFor(region), l, 3, rng)
    return {
      type: `kart_${region}`,
      form: 'valg',
      prompt: 'Hvilket land er markert med rosa?',
      spoken: 'Hvilket land er markert med rosa på kartet?',
      visual: { kind: 'kart', region, highlight: l.id },
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      explain: `Det rosa landet er ${l.navn} ${l.flagg}.`,
      readOptions: true,
    }
  },
  // Verdensdel.
  verdensdel: (_, rng) => {
    const pool = landFor('verden').filter((l) => (l.region === 'verden' || l.region === 'norden') && !l.ikkeVerdensdel)
    const l = pick(pool, rng)
    return {
      type: 'verdensdel',
      form: 'valg',
      prompt: `I hvilken verdensdel ligger ${l.navn}?`,
      spoken: `I hvilken verdensdel ligger ${l.navn}?`,
      visual: { kind: 'kart', region: 'verden', highlight: l.id },
      answer: l.verdensdel,
      options: shuffle([l.verdensdel, ...shuffle(VERDENSDELER.filter((v) => v !== l.verdensdel), rng).slice(0, 3)], rng),
      explain: `${l.navn} ligger i ${l.verdensdel}.`,
      readOptions: true,
    }
  },
}

export function genGeo(type, param = {}, rng = Math.random) {
  const g = GEN_GEO[type]
  if (!g) throw new Error(`Ukjent oppgavetype i geografi: ${type}`)
  const task = g(param, rng)
  task.type = task.type || type
  return task
}

registerTypeLabels({
  flagg_norden: 'Flagg i Norden',
  flagg_europa: 'Flagg i Europa',
  flagg_verden: 'Flagg i verden',
  hovedstad_norden: 'Hovedsteder i Norden',
  hovedstad_europa: 'Hovedsteder i Europa',
  hovedstad_verden: 'Hovedsteder i verden',
  kart_norden: 'Kartet over Norden',
  kart_europa: 'Kartet over Europa',
  kart_verden: 'Verdenskartet',
  verdensdel: 'Verdensdeler',
})
