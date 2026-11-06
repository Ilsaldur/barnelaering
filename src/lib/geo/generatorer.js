// Oppgavegeneratorer for geografistigen: flagg, land, hovedsteder, kart.
import { pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'
import { landFor, VERDENSDELER } from '../../data/geo/land.js'
import { kartPool, KART_NAVN } from './kart.js'

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
      emne: l.id,
      form: 'valg',
      prompt: 'Hvilket land har dette flagget?',
      spoken: 'Hvilket land har dette flagget?',
      visual: { kind: 'flagg', kode: l.kode, navn: l.navn },
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      explain: `Dette er flagget til ${l.navn}.`,
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
      emne: l.id,
      form: 'valg',
      prompt: `Hvilket flagg er ${l.navn} sitt?`,
      spoken: `Hvilket flagg er ${l.navn} sitt?`,
      answer: l.kode,
      options: shuffle([l.kode, ...feil.map((x) => x.kode)], rng),
      optionFlagg: Object.fromEntries([l, ...feil].map((x) => [x.kode, x.navn])),
      explain: `Nå vet du hvordan flagget til ${l.navn} ser ut.`,
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
        emne: l.id,
        form: 'valg',
        prompt: `Hva er hovedstaden i ${l.navn}?`,
        spoken: `Hva er hovedstaden i ${l.navn}?`,
        visual: { kind: 'flagg', kode: l.kode, navn: l.navn },
        answer: l.hovedstad,
        options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
        explain: `Hovedstaden i ${l.navn} er ${l.hovedstad}.`,
        readOptions: true,
      }
    }
    return {
      type: `hovedstad_${region}`,
      emne: l.id,
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
      emne: l.id,
      form: 'kart',
      prompt: `Trykk på ${l.navn} på kartet${KART_NAVN[region] && region !== 'norden' && region !== 'europa' && region !== 'verden' ? ` over ${KART_NAVN[region]}` : ''}.`,
      spoken: `Trykk på ${l.navn} på kartet.`,
      region,
      answer: l.id,
      explain: `${l.navn} er markert med grønt.`,
    }
  },
  // Hvilket land er markert?
  hvilket_land: ({ region = 'norden' }, rng) => {
    const pool = kartPool(region)
    const l = pick(pool, rng)
    // Små kart (Oseania har tre land): feilsvar fra hele verden.
    const feil = andre(pool.length >= 4 ? pool : landFor('verden'), l, 3, rng)
    return {
      type: `kart_${region}`,
      emne: l.id,
      form: 'valg',
      prompt: 'Hvilket land er markert med rosa?',
      spoken: 'Hvilket land er markert med rosa på kartet?',
      visual: { kind: 'kart', region, highlight: l.id },
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      explain: `Det rosa landet er ${l.navn}.`,
      readOptions: true,
    }
  },
  // Flagg → hovedstad.
  flagg_hovedstad: ({ region = 'norden' }, rng) => {
    const pool = landFor(region)
    const l = pick(pool, rng)
    const feil = andre(pool, l, 3, rng)
    return {
      type: `hovedstad_${region}`,
      emne: l.id,
      form: 'valg',
      prompt: 'Hva er hovedstaden i landet med dette flagget?',
      spoken: 'Hva er hovedstaden i landet med dette flagget?',
      visual: { kind: 'flagg', kode: l.kode, navn: l.navn },
      answer: l.hovedstad,
      options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
      explain: `Flagget er ${l.navn} sitt, og hovedstaden er ${l.hovedstad}.`,
      readOptions: true,
    }
  },
  // Hovedstad → flagg.
  hovedstad_flagg: ({ region = 'norden' }, rng) => {
    const pool = landFor(region)
    const l = pick(pool, rng)
    const feil = andre(pool, l, 3, rng)
    return {
      type: `hovedstad_${region}`,
      emne: l.id,
      form: 'valg',
      prompt: `Hvilket flagg har landet med hovedstaden ${l.hovedstad}?`,
      spoken: `Hvilket flagg har landet med hovedstaden ${l.hovedstad}?`,
      answer: l.kode,
      options: shuffle([l.kode, ...feil.map((x) => x.kode)], rng),
      optionFlagg: Object.fromEntries([l, ...feil].map((x) => [x.kode, x.navn])),
      explain: `${l.hovedstad} er hovedstaden i ${l.navn}.`,
    }
  },
  // Kart → hovedstad.
  kart_hovedstad: ({ region = 'norden' }, rng) => {
    const pool = kartPool(region)
    const l = pick(pool, rng)
    const feil = andre(landFor(region), l, 3, rng)
    return {
      type: `kart_${region}`,
      emne: l.id,
      form: 'valg',
      prompt: 'Hva er hovedstaden i landet som er markert?',
      spoken: 'Hva er hovedstaden i landet som er markert med rosa på kartet?',
      visual: { kind: 'kart', region, highlight: l.id },
      answer: l.hovedstad,
      options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
      explain: `Det rosa landet er ${l.navn}, og hovedstaden er ${l.hovedstad}.`,
      readOptions: true,
    }
  },
  // Verdensdel.
  verdensdel: (_, rng) => {
    const pool = landFor('verden').filter((l) => (l.region === 'verden' || l.region === 'norden') && !l.ikkeVerdensdel)
    const l = pick(pool, rng)
    return {
      type: 'verdensdel',
      emne: l.id,
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
  kart_amerika: 'Kartet over Amerika',
  kart_afrika: 'Kartet over Afrika',
  kart_asia: 'Kartet over Asia',
  kart_oseania: 'Kartet over Oseania',
  verdensdel: 'Verdensdeler',
})
