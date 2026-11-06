// Oppgavegeneratorer for klokkestigen. Norsk klokkespråk og digital
// skrivemåte blandes aldri i samme oppgave.
import { randInt, pick, shuffle } from '../rng.js'
import { registerTypeLabels } from '../labels.js'

const MIN_POOLS = { whole: [0], half: [0, 30], quarter: [0, 15, 30, 45], five: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] }

const h12 = (h) => ((h + 11) % 12) + 1
const neste = (h) => (h12(h) % 12) + 1

// Norsk klokkespråk uten «Klokka er» foran: «3», «fem over 3», «ti på halv 4», «halv 4», «kvart på 4».
export function klokkespraak(h, m) {
  const t = h12(h)
  const n = neste(h)
  switch (m) {
    case 0:
      return `${t}`
    case 5:
      return `fem over ${t}`
    case 10:
      return `ti over ${t}`
    case 15:
      return `kvart over ${t}`
    case 20:
      return `ti på halv ${n}`
    case 25:
      return `fem på halv ${n}`
    case 30:
      return `halv ${n}`
    case 35:
      return `fem over halv ${n}`
    case 40:
      return `ti over halv ${n}`
    case 45:
      return `kvart på ${n}`
    case 50:
      return `ti på ${n}`
    case 55:
      return `fem på ${n}`
    default:
      return `${t} og ${m} minutter`
  }
}

export function klokkeSetning(h, m) {
  return `Klokka er ${klokkespraak(h, m)}`
}

export function knapp(h, m) {
  const p = klokkespraak(h, m)
  return m === 0 ? `Klokka er ${p}` : p.charAt(0).toUpperCase() + p.slice(1)
}

// Digital skrivemåte, 24-timer: «15:30». `h24` er 0–23.
export function digital(h24, m) {
  return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
export function digitalSpoken(h24, m) {
  return m === 0 ? `${h24} null null` : `${h24} ${String(m).padStart(2, '0')}`
}

function norm(h, m) {
  return { h: ((((h - 1) % 12) + 12) % 12) + 1, m: ((m % 60) + 60) % 60 }
}

// Feilsvar: byttede visere, én time feil, samme time annet minutt.
function feilTider(h, m, pool, rng) {
  const target = klokkespraak(h, m)
  const cands = []
  if (m % 5 === 0) {
    const sh = m === 0 ? 12 : m / 5
    const sm = (h % 12) * 5
    if (pool.includes(sm)) cands.push(norm(sh, sm))
  }
  cands.push(norm(h + 1, m), norm(h - 1, m))
  for (const mm of shuffle(pool.filter((x) => x !== m), rng).slice(0, 3)) cands.push(norm(h, mm))
  cands.push(norm(h + 2, m), norm(h - 2, m), norm(h + 1, (m + 30) % 60))
  const out = []
  for (const c of cands) {
    const p = klokkespraak(c.h, c.m)
    if (p === target || out.some((o) => klokkespraak(o.h, o.m) === p) || !pool.includes(c.m)) continue
    out.push(c)
    if (out.length >= 3) break
  }
  let guard = 0
  while (out.length < 3 && guard++ < 100) {
    const c = norm(randInt(1, 12, rng), pick(pool, rng))
    const p = klokkespraak(c.h, c.m)
    if (p !== target && !out.some((o) => klokkespraak(o.h, o.m) === p)) out.push(c)
  }
  return out
}

function poolFor(param) {
  return MIN_POOLS[param.minutes || 'whole']
}

export const GEN_KLOKKE = {
  // Analog klokke → hva er klokka (norsk klokkespråk).
  les_analog: (param, rng) => {
    const pool = poolFor(param)
    const h = randInt(1, 12, rng)
    const m = pick(pool, rng)
    const feil = feilTider(h, m, pool, rng)
    return {
      type: `les_analog_${param.minutes || 'whole'}`,
      form: 'valg',
      prompt: 'Hva er klokka?',
      spoken: 'Hva er klokka?',
      visual: { kind: 'klokke', h, m },
      answer: knapp(h, m),
      options: shuffle([knapp(h, m), ...feil.map((f) => knapp(f.h, f.m))], rng),
      explain: `${klokkeSetning(h, m)}. Den korte viseren peker på timen, den lange på minuttene.`,
      stor: true,
    }
  },
  // Still klokka: dra viserne til oppgitt tid (norsk klokkespråk).
  still_klokka: (param, rng) => {
    const pool = poolFor(param)
    const h = randInt(1, 12, rng)
    const m = pick(pool, rng)
    const step = param.minutes === 'five' ? 5 : param.minutes === 'quarter' ? 15 : param.minutes === 'half' ? 30 : 60
    return {
      type: `still_klokka_${param.minutes || 'whole'}`,
      form: 'still',
      prompt: `Still klokka på ${klokkespraak(h, m)}.`,
      spoken: `Still klokka på ${klokkespraak(h, m)}. Dra den korte viseren til timen og den lange til minuttene.`,
      answer: { h: h12(h), m },
      step,
      explain: `${klokkeSetning(h, m)}: den korte viseren ${m >= 30 ? `mellom ${h12(h)} og ${neste(h)}` : `på ${h12(h)}`}, den lange på ${m === 0 ? '12' : m / 5}.`,
    }
  },
  // Norsk klokkespråk → velg riktig klokke.
  finn_klokka: (param, rng) => {
    const pool = poolFor(param)
    const h = randInt(1, 12, rng)
    const m = pick(pool, rng)
    const feil = feilTider(h, m, pool, rng)
    return {
      type: `finn_klokka_${param.minutes || 'whole'}`,
      form: 'valgklokke',
      prompt: `Hvilken klokke viser ${klokkespraak(h, m)}?`,
      spoken: `Hvilken klokke viser ${klokkespraak(h, m)}?`,
      answer: `${h12(h)}:${m}`,
      options: shuffle([{ h: h12(h), m }, ...feil], rng).map((t) => ({ value: `${t.h}:${t.m}`, h: t.h, m: t.m })),
      explain: `${klokkeSetning(h, m)}.`,
    }
  },
  // Digital mot analog: analog klokke → digital tid (24-timer, med dag/kveld-hint).
  analog_til_digital: (param, rng) => {
    const pool = poolFor(param)
    const h24 = randInt(0, 23, rng)
    const m = pick(pool, rng)
    const h = h12(h24)
    const dagdel = h24 < 6 ? 'om natta' : h24 < 12 ? 'om formiddagen' : h24 < 18 ? 'om ettermiddagen' : 'om kvelden'
    const svar = digital(h24, m)
    const feil = [digital((h24 + 12) % 24, m), digital((h24 + 1) % 24, m), digital(h24, (m + 30) % 60), digital((h24 + 23) % 24, m)].filter((x, i, a) => x !== svar && a.indexOf(x) === i).slice(0, 3)
    return {
      type: 'digital',
      form: 'valg',
      prompt: `Klokka viser dette ${dagdel}. Hva står det på en digital klokke?`,
      spoken: `Klokka viser dette ${dagdel}. Hva står det på en digital klokke?`,
      visual: { kind: 'klokke', h, m },
      answer: svar,
      options: shuffle([svar, ...feil], rng),
      explain: `${dagdel.charAt(0).toUpperCase() + dagdel.slice(1)} er klokka ${svar}: ${h24 >= 12 ? `${h} + 12 = ${h24}` : `${h24} timer`} og ${m} minutter.`,
      stor: true,
    }
  },
  // Digital tid → velg riktig analog klokke.
  digital_til_analog: (param, rng) => {
    const pool = poolFor(param)
    const h24 = randInt(0, 23, rng)
    const m = pick(pool, rng)
    const h = h12(h24)
    const feil = feilTider(h, m, pool, rng)
    return {
      type: 'digital',
      form: 'valgklokke',
      prompt: `Hvilken klokke viser ${digital(h24, m)}?`,
      spoken: `Hvilken klokke viser ${digitalSpoken(h24, m)}?`,
      visual: { kind: 'digital', tekst: digital(h24, m) },
      answer: `${h}:${m}`,
      options: shuffle([{ h, m }, ...feil], rng).map((t) => ({ value: `${t.h}:${t.m}`, h: t.h, m: t.m })),
      explain: `${digital(h24, m)} er ${klokkespraak(h, m)} på en vanlig klokke${h24 >= 12 ? ` (${h24} − 12 = ${h})` : ''}.`,
    }
  },
  // Tidsregning: hvor lang tid, eller når er det ferdig.
  tidsregning: (_, rng) => {
    const v = pick(['til_hel', 'varighet', 'ferdig'], rng)
    if (v === 'til_hel') {
      const h = randInt(1, 11, rng)
      const m = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], rng)
      return { type: 'tidsregning', form: 'tastatur', prompt: `Klokka er ${klokkespraak(h, m)}. Hvor mange minutter er det til klokka ${h + 1}?`, spoken: `Klokka er ${klokkespraak(h, m)}. Hvor mange minutter er det til klokka ${h + 1}?`, visual: { kind: 'klokke', h, m }, answer: 60 - m, explain: `Fra ${m} minutter over til neste hele time er det 60 − ${m} = ${60 - m} minutter.`, unit: 'min' }
    }
    if (v === 'varighet') {
      const start = randInt(8, 18, rng)
      const d = pick([1, 2, 3], rng)
      const dm = pick([0, 30], rng)
      const sluttH = start + d + (dm ? 0 : 0)
      const slutt = { h: sluttH + (dm ? 0 : 0), m: dm }
      return { type: 'tidsregning', form: 'tastatur', prompt: `Kampen starter ${digital(start, 0)} og slutter ${digital(slutt.h, slutt.m)}. Hvor mange minutter varer den?`, spoken: `Kampen starter ${digitalSpoken(start, 0)} og slutter ${digitalSpoken(slutt.h, slutt.m)}. Hvor mange minutter varer den?`, answer: d * 60 + dm, explain: `${d} ${d === 1 ? 'time' : 'timer'}${dm ? ' og 30 minutter' : ''} er ${d * 60 + dm} minutter.`, unit: 'min' }
    }
    const start = randInt(7, 19, rng)
    const sm = pick([0, 15, 30, 45], rng)
    const d = pick([15, 20, 30, 45, 60, 90], rng)
    const tot = start * 60 + sm + d
    const sh = Math.floor(tot / 60) % 24
    const smm = tot % 60
    const svar = digital(sh, smm)
    const feil = [digital((sh + 1) % 24, smm), digital(sh, (smm + 15) % 60), digital((sh + 23) % 24, smm)].filter((x, i, a) => x !== svar && a.indexOf(x) === i)
    return { type: 'tidsregning', form: 'valg', prompt: `Filmen starter ${digital(start, sm)} og varer ${d} minutter. Når er den ferdig?`, spoken: `Filmen starter ${digitalSpoken(start, sm)} og varer ${d} minutter. Når er den ferdig?`, answer: svar, options: shuffle([svar, ...feil], rng), explain: `${digital(start, sm)} + ${d} minutter = ${svar}.`, stor: true }
  },
}

export function genKlokke(type, param = {}, rng = Math.random) {
  const g = GEN_KLOKKE[type]
  if (!g) throw new Error(`Ukjent oppgavetype i klokke: ${type}`)
  const task = g(param, rng)
  task.type = task.type || type
  return task
}

registerTypeLabels({
  les_analog_whole: 'Hele timer',
  les_analog_half: 'Halve timer',
  les_analog_quarter: 'Kvart over og kvart på',
  les_analog_five: 'Fem minutter',
  still_klokka_whole: 'Stille klokka (hele timer)',
  still_klokka_half: 'Stille klokka (halve timer)',
  still_klokka_quarter: 'Stille klokka (kvarter)',
  still_klokka_five: 'Stille klokka (fem minutter)',
  finn_klokka_whole: 'Finne klokka (hele timer)',
  finn_klokka_half: 'Finne klokka (halve timer)',
  finn_klokka_quarter: 'Finne klokka (kvarter)',
  finn_klokka_five: 'Finne klokka (fem minutter)',
  digital: 'Digital og analog',
  tidsregning: 'Tidsregning',
})
