// Klokkeoppgaver som rene funksjoner.
import { randInt, pick, shuffle } from './rng.js'
import { uniqueRound, ROUND_LENGTH } from './round.js'

export const MIN_POOLS = {
  whole: [0],
  half: [0, 30],
  quarter: [0, 15, 30, 45],
  five: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
}

// Norsk klokkespråk uten «Klokka er» foran, så det kan settes inn i setninger:
// «7», «kvart over 3», «halv 9», «kvart på 9», «7:05».
export function timePhrase(hour, minute) {
  const h12 = ((hour + 11) % 12) + 1 // 1..12
  const next = (h12 % 12) + 1
  if (minute === 0) return `${h12}`
  if (minute === 15) return `kvart over ${h12}`
  if (minute === 30) return `halv ${next}`
  if (minute === 45) return `kvart på ${next}`
  return `${h12}:${minute.toString().padStart(2, '0')}`
}

// Slik det står på en svarknapp.
export function timeLabel(hour, minute) {
  const p = timePhrase(hour, minute)
  if (minute === 0) return `Klokka er ${p}`
  return p.charAt(0).toUpperCase() + p.slice(1)
}

// Hel setning: «Klokka er halv 9».
export function timeSentence(hour, minute) {
  return `Klokka er ${timePhrase(hour, minute)}`
}

function norm(h, m) {
  let hh = ((h - 1) % 12 + 12) % 12 + 1
  let mm = ((m % 60) + 60) % 60
  return { h: hh, m: mm }
}

// Feilsvar som ligner ekte feil: byttet om viserne, én time feil med samme
// minutt, samme time med annet minutt.
export function clockDistractors(hour, minute, pool, rng = Math.random) {
  const target = timePhrase(hour, minute)
  const cands = []
  // Viserne byttet om (bare meningsfullt når minuttviseren står på en «time»).
  if (minute % 5 === 0) {
    const swappedHour = minute === 0 ? 12 : minute / 5
    const swappedMinute = (hour % 12) * 5
    if (pool.includes(swappedMinute)) cands.push(norm(swappedHour, swappedMinute))
  }
  cands.push(norm(hour + 1, minute), norm(hour - 1, minute))
  for (const m of shuffle(pool.filter((x) => x !== minute), rng).slice(0, 3)) cands.push(norm(hour, m))
  cands.push(norm(hour + 2, minute), norm(hour - 2, minute))

  const out = []
  for (const c of cands) {
    const p = timePhrase(c.h, c.m)
    if (p === target || out.some((o) => o.phrase === p)) continue
    out.push({ ...c, phrase: p })
    if (out.length >= 3) break
  }
  let guard = 0
  while (out.length < 3 && guard < 200) {
    guard++
    const c = norm(randInt(1, 12, rng), pick(pool, rng))
    const p = timePhrase(c.h, c.m)
    if (p !== target && !out.some((o) => o.phrase === p)) out.push({ ...c, phrase: p })
  }
  return out
}

export function makeClockQuestion(pool, rng = Math.random) {
  const h = randInt(1, 12, rng)
  const m = pick(pool, rng)
  const wrong = clockDistractors(h, m, pool, rng)
  const options = shuffle([{ h, m }, ...wrong.map((w) => ({ h: w.h, m: w.m }))], rng).map((t) => ({
    ...t,
    label: timeLabel(t.h, t.m),
  }))
  return { hour: h, minute: m, label: timeLabel(h, m), sentence: timeSentence(h, m), options }
}

export function makeClockRound(mode = 'quarter', { n = ROUND_LENGTH, rng = Math.random } = {}) {
  const pool = MIN_POOLS[mode] || MIN_POOLS.quarter
  return uniqueRound(() => makeClockQuestion(pool, rng), n, { keyOf: (q) => `${q.hour}:${q.minute}` })
}
