// Oppgavegeneratorer for geografistigen: flagg, land, hovedsteder, kart.
// Kunnskapsstige: hver oppgave har `kjent` («land:se» / «hovedstad:se»),
// `visning` (slik tingen vises første gang) og `optionsKjent`.
import { shuffle } from '../rng.js'
import { landFor, VERDENSDELER } from '../../data/geo/land.js'
import { kartPool, KART_NAVN } from './kart.js'
import { velgKjent, kjenteFeil } from '../kunnskap.js'

const keyLand = (l) => `land:${l.kode}`
const keyHov = (l) => `hovedstad:${l.kode}`

const visFlagg = (l) => ({ tekst: `Dette er flagget til ${l.navn}.`, visual: { kind: 'flagg', kode: l.kode, navn: l.navn } })
const visKart = (l, region) => ({ tekst: `Dette er ${l.navn}.`, visual: { kind: 'kart', region, highlight: l.id } })
const visHov = (l) => ({ tekst: `${l.hovedstad} er hovedstaden i ${l.navn}.`, visual: { kind: 'flagg', kode: l.kode, navn: l.navn } })

function felles(l, region, keyOf) {
  return { emne: l.id, kjent: keyOf(l), form: 'valg' }
}

export const GEN_GEO = {
  // Flagg → land.
  flagg_land: (param, rng) => {
    const region = param.region || 'norden'
    const pool = landFor(region)
    const l = velgKjent(pool, keyLand, param, rng)
    const feil = kjenteFeil(pool, l, keyLand, param, 3, rng)
    return {
      type: `flagg_${region}`,
      ...felles(l, region, keyLand),
      prompt: 'Hvilket land har dette flagget?',
      spoken: 'Hvilket land har dette flagget?',
      visual: { kind: 'flagg', kode: l.kode, navn: l.navn },
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.navn, keyLand(x)])),
      explain: `Dette er flagget til ${l.navn}.`,
      readOptions: true,
      visning: visFlagg(l),
    }
  },
  // Land → flagg.
  land_flagg: (param, rng) => {
    const region = param.region || 'norden'
    const pool = landFor(region)
    const l = velgKjent(pool, keyLand, param, rng)
    const feil = kjenteFeil(pool, l, keyLand, param, 3, rng)
    return {
      type: `flagg_${region}`,
      ...felles(l, region, keyLand),
      prompt: `Hvilket flagg er ${l.navn} sitt?`,
      spoken: `Hvilket flagg er ${l.navn} sitt?`,
      answer: l.kode,
      options: shuffle([l.kode, ...feil.map((x) => x.kode)], rng),
      optionFlagg: Object.fromEntries([l, ...feil].map((x) => [x.kode, x.navn])),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.kode, keyLand(x)])),
      explain: `Nå vet du hvordan flagget til ${l.navn} ser ut.`,
      visning: visFlagg(l),
    }
  },
  // Hovedstad.
  hovedstad: (param, rng) => {
    const region = param.region || 'norden'
    const pool = landFor(region)
    const l = velgKjent(pool, keyHov, param, rng)
    const feil = kjenteFeil(pool, l, keyHov, param, 3, rng)
    if (rng() < 0.5) {
      return {
        type: `hovedstad_${region}`,
        ...felles(l, region, keyHov),
        prompt: `Hva er hovedstaden i ${l.navn}?`,
        spoken: `Hva er hovedstaden i ${l.navn}?`,
        visual: { kind: 'flagg', kode: l.kode, navn: l.navn },
        answer: l.hovedstad,
        options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
        optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.hovedstad, keyHov(x)])),
        explain: `Hovedstaden i ${l.navn} er ${l.hovedstad}.`,
        readOptions: true,
        visning: visHov(l),
      }
    }
    return {
      type: `hovedstad_${region}`,
      ...felles(l, region, keyHov),
      prompt: `${l.hovedstad} er hovedstaden i …`,
      spoken: `${l.hovedstad} er hovedstaden i hvilket land?`,
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.navn, keyHov(x)])),
      explain: `${l.hovedstad} er hovedstaden i ${l.navn}.`,
      readOptions: true,
      visning: visHov(l),
    }
  },
  // Finn landet på kartet.
  finn_paa_kart: (param, rng) => {
    const region = param.region || 'norden'
    const pool = kartPool(region)
    const l = velgKjent(pool, keyLand, param, rng)
    return {
      type: `kart_${region}`,
      ...felles(l, region, keyLand),
      form: 'kart',
      prompt: `Trykk på ${l.navn} på kartet${KART_NAVN[region] && region !== 'norden' && region !== 'europa' && region !== 'verden' ? ` over ${KART_NAVN[region]}` : ''}.`,
      spoken: `Trykk på ${l.navn} på kartet.`,
      region,
      answer: l.id,
      explain: `${l.navn} er markert med grønt.`,
      visning: visKart(l, region),
    }
  },
  // Hvilket land er markert?
  hvilket_land: (param, rng) => {
    const region = param.region || 'norden'
    const pool = kartPool(region)
    const l = velgKjent(pool, keyLand, param, rng)
    // Små kart (Oseania har tre land): feilsvar fra hele verden.
    const feil = kjenteFeil(pool.length >= 4 ? pool : landFor('verden'), l, keyLand, param, 3, rng)
    return {
      type: `kart_${region}`,
      ...felles(l, region, keyLand),
      prompt: 'Hvilket land er markert med rosa?',
      spoken: 'Hvilket land er markert med rosa på kartet?',
      visual: { kind: 'kart', region, highlight: l.id },
      answer: l.navn,
      options: shuffle([l.navn, ...feil.map((x) => x.navn)], rng),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.navn, keyLand(x)])),
      explain: `Det rosa landet er ${l.navn}.`,
      readOptions: true,
      visning: visKart(l, region),
    }
  },
  // Flagg → hovedstad.
  flagg_hovedstad: (param, rng) => {
    const region = param.region || 'norden'
    const pool = landFor(region)
    const l = velgKjent(pool, keyHov, param, rng)
    const feil = kjenteFeil(pool, l, keyHov, param, 3, rng)
    return {
      type: `hovedstad_${region}`,
      ...felles(l, region, keyHov),
      prompt: 'Hva er hovedstaden i landet med dette flagget?',
      spoken: 'Hva er hovedstaden i landet med dette flagget?',
      visual: { kind: 'flagg', kode: l.kode, navn: l.navn },
      answer: l.hovedstad,
      options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.hovedstad, keyHov(x)])),
      explain: `Flagget er ${l.navn} sitt, og hovedstaden er ${l.hovedstad}.`,
      readOptions: true,
      visning: visHov(l),
    }
  },
  // Hovedstad → flagg.
  hovedstad_flagg: (param, rng) => {
    const region = param.region || 'norden'
    const pool = landFor(region)
    const l = velgKjent(pool, keyHov, param, rng)
    const feil = kjenteFeil(pool, l, keyHov, param, 3, rng)
    return {
      type: `hovedstad_${region}`,
      ...felles(l, region, keyHov),
      prompt: `Hvilket flagg har landet med hovedstaden ${l.hovedstad}?`,
      spoken: `Hvilket flagg har landet med hovedstaden ${l.hovedstad}?`,
      answer: l.kode,
      options: shuffle([l.kode, ...feil.map((x) => x.kode)], rng),
      optionFlagg: Object.fromEntries([l, ...feil].map((x) => [x.kode, x.navn])),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.kode, keyHov(x)])),
      explain: `${l.hovedstad} er hovedstaden i ${l.navn}.`,
      visning: visHov(l),
    }
  },
  // Kart → hovedstad.
  kart_hovedstad: (param, rng) => {
    const region = param.region || 'norden'
    const pool = kartPool(region)
    const l = velgKjent(pool, keyHov, param, rng)
    const feil = kjenteFeil(landFor(region), l, keyHov, param, 3, rng)
    return {
      type: `kart_${region}`,
      ...felles(l, region, keyHov),
      prompt: 'Hva er hovedstaden i landet som er markert?',
      spoken: 'Hva er hovedstaden i landet som er markert med rosa på kartet?',
      visual: { kind: 'kart', region, highlight: l.id },
      answer: l.hovedstad,
      options: shuffle([l.hovedstad, ...feil.map((x) => x.hovedstad)], rng),
      optionsKjent: Object.fromEntries([l, ...feil].map((x) => [x.hovedstad, keyHov(x)])),
      explain: `Det rosa landet er ${l.navn}, og hovedstaden er ${l.hovedstad}.`,
      readOptions: true,
      visning: { tekst: `Dette er ${l.navn}. Hovedstaden er ${l.hovedstad}.`, visual: { kind: 'kart', region, highlight: l.id } },
    }
  },
  // Verdensdel.
  verdensdel: (param, rng) => {
    const pool = landFor('verden').filter((l) => (l.region === 'verden' || l.region === 'norden') && !l.ikkeVerdensdel)
    const l = velgKjent(pool, keyLand, param, rng)
    return {
      type: 'verdensdel',
      ...felles(l, 'verden', keyLand),
      prompt: `I hvilken verdensdel ligger ${l.navn}?`,
      spoken: `I hvilken verdensdel ligger ${l.navn}?`,
      visual: { kind: 'kart', region: 'verden', highlight: l.id },
      answer: l.verdensdel,
      options: shuffle([l.verdensdel, ...shuffle(VERDENSDELER.filter((v) => v !== l.verdensdel), rng).slice(0, 3)], rng),
      explain: `${l.navn} ligger i ${l.verdensdel}.`,
      readOptions: true,
      visning: { tekst: `Dette er ${l.navn}. Det ligger i ${l.verdensdel}.`, visual: { kind: 'kart', region: 'verden', highlight: l.id } },
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

