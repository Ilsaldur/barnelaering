// Barnets fremgang som ren data: tom profil, normalisering av gamle
// lagringer og fletting av to utgaver (lokal og sky) uten å miste noe.

export const DATA_VERSION = 2
export const FAG = ['matte', 'lesing', 'klokke']

export function emptyFag() {
  return {
    nivaa: null, // null = ikke plassert ennå
    plassert: false,
    paaRad: 0, // oppdrag på rad med 7–8 riktige
    perfektRad: 0, // oppdrag på rad med 8 av 8
    hjelpNeste: false, // neste oppdrag får hjelp på og henter fra nivået under
    beste: {}, // nivåId -> beste stjerner (0–3) på første forsøk
    bokser: {}, // kort-id -> { boks: 1–5, t }
    svake: {}, // oppgavetype -> { bom, til (dato) }
    updatedAt: 0,
  }
}

export function emptySettings() {
  return {
    autoSpeak: false,
    fast: null, // 'matte' | 'lesing' | null – fast oppdrag i «Dagens økt»
    oppdragPerDag: 2,
    fagblanding: ['matte', 'lesing', 'overraskelse'],
    updatedAt: 0,
  }
}

export function emptyData() {
  return {
    v: DATA_VERSION,
    stars: 0,
    spent: 0,
    best: {}, // gammel temastige: tema -> nivåindeks -> stjerner
    garden: [],
    log: [], // runder: { t, stars, correct, total, topic, level, ms, fag, nivaa }
    eventyr: {}, // sted -> stjerner
    fag: Object.fromEntries(FAG.map((f) => [f, emptyFag()])),
    attempts: [], // enkeltsvar: { t, fag, nivaa, type, ok, forste, hjelp }
    settings: emptySettings(),
    dager: {}, // 'YYYY-MM-DD' -> { oppdrag: n, fag: { matte: 1 } }
    kort: [], // samlekort-id
    kostymer: [], // kjøpte kostymer
    kostyme: null, // kostyme reven har på
    kostymeT: 0,
    historier: [], // historiebiter barnet har sett
  }
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Gjør en lagret (kanskje gammel) profil komplett.
export function normalize(raw) {
  const d = { ...emptyData(), ...(raw || {}) }
  d.v = DATA_VERSION
  d.best = d.best || {}
  d.garden = d.garden || []
  d.log = d.log || []
  d.eventyr = d.eventyr || {}
  d.attempts = d.attempts || []
  d.settings = { ...emptySettings(), ...(d.settings || {}) }
  d.dager = d.dager || {}
  d.kort = d.kort || []
  d.kostymer = d.kostymer || []
  d.historier = d.historier || []
  const fag = {}
  for (const f of FAG) fag[f] = { ...emptyFag(), ...((d.fag || {})[f] || {}) }
  d.fag = fag
  return d
}

function unionBy(list, keyOf, cap) {
  const seen = new Set()
  const out = []
  for (const e of list) {
    const k = keyOf(e)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(e)
  }
  out.sort((x, y) => x.t - y.t)
  return cap ? out.slice(-cap) : out
}

function mergeFag(a, b) {
  const newest = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b
  const out = { ...emptyFag(), ...newest }
  out.beste = {}
  for (const src of [a.beste || {}, b.beste || {}]) {
    for (const [k, v] of Object.entries(src)) out.beste[k] = Math.max(out.beste[k] || 0, v)
  }
  out.bokser = {}
  for (const src of [a.bokser || {}, b.bokser || {}]) {
    for (const [k, v] of Object.entries(src)) {
      if (!out.bokser[k] || (v.t || 0) > (out.bokser[k].t || 0)) out.bokser[k] = v
    }
  }
  out.svake = {}
  for (const src of [a.svake || {}, b.svake || {}]) {
    for (const [k, v] of Object.entries(src)) {
      const cur = out.svake[k]
      if (!cur) out.svake[k] = v
      else out.svake[k] = { bom: Math.max(cur.bom || 0, v.bom || 0), til: cur.til > v.til ? cur.til : v.til }
    }
  }
  return out
}

// Slå sammen lokal og sky-lagret fremgang uten å miste noe:
// høyeste stjernetall vinner, mestring celle for celle, logger som union,
// nivå og innstillinger fra den som er sist oppdatert.
export function mergeData(rawA, rawB) {
  const a = normalize(rawA)
  const b = normalize(rawB)
  const out = emptyData()
  out.stars = Math.max(a.stars, b.stars)
  out.spent = Math.max(a.spent, b.spent)

  for (const src of [a.best, b.best]) {
    for (const [topic, levels] of Object.entries(src)) {
      out.best[topic] = out.best[topic] || {}
      for (const [idx, val] of Object.entries(levels)) out.best[topic][idx] = Math.max(out.best[topic][idx] || 0, val)
    }
  }
  out.garden = unionBy([...a.garden, ...b.garden].map((g) => ({ t: 0, ...g })), (g) => g.uid)
  out.log = unionBy([...a.log, ...b.log], (e) => `${e.t}_${e.topic || e.fag || ''}_${e.level ?? e.nivaa ?? ''}`, 500)
  out.attempts = unionBy([...a.attempts, ...b.attempts], (e) => `${e.t}_${e.type}`, 2000)

  for (const src of [a.eventyr, b.eventyr]) {
    for (const [id, val] of Object.entries(src)) out.eventyr[id] = Math.max(out.eventyr[id] || 0, val)
  }
  for (const f of FAG) out.fag[f] = mergeFag(a.fag[f], b.fag[f])
  out.settings = (a.settings.updatedAt || 0) >= (b.settings.updatedAt || 0) ? { ...a.settings } : { ...b.settings }

  for (const src of [a.dager, b.dager]) {
    for (const [day, v] of Object.entries(src)) {
      const cur = out.dager[day] || { oppdrag: 0, fag: {} }
      const fag = { ...(cur.fag || {}) }
      for (const [f, n] of Object.entries(v.fag || {})) fag[f] = Math.max(fag[f] || 0, n)
      out.dager[day] = { oppdrag: Math.max(cur.oppdrag || 0, v.oppdrag || 0), fag }
    }
  }
  out.kort = [...new Set([...a.kort, ...b.kort])]
  out.kostymer = [...new Set([...a.kostymer, ...b.kostymer])]
  out.historier = [...new Set([...a.historier, ...b.historier])]
  if ((a.kostymeT || 0) >= (b.kostymeT || 0)) {
    out.kostyme = a.kostyme
    out.kostymeT = a.kostymeT
  } else {
    out.kostyme = b.kostyme
    out.kostymeT = b.kostymeT
  }
  return out
}

// ---- Statistikk brukt på voksensiden -----------------------------------------

export function recentRounds(log, days = 7, now = Date.now()) {
  const since = now - days * 24 * 60 * 60 * 1000
  return log.filter((e) => e.t >= since)
}

export function minutesLastWeek(log, now = Date.now()) {
  const ms = recentRounds(log, 7, now).reduce((s, e) => s + (e.ms || 0), 0)
  return Math.round(ms / 60000)
}

// De oppgavetypene barnet bommer mest på (første forsøk uten hjelp), siste 30 dager.
export function weakestTypes(attempts, { limit = 3, days = 30, now = Date.now(), minTries = 2 } = {}) {
  const since = now - days * 24 * 60 * 60 * 1000
  const acc = {}
  for (const a of attempts) {
    if (a.t < since || !a.forste || a.hjelp) continue
    acc[a.type] = acc[a.type] || { type: a.type, fag: a.fag, tries: 0, miss: 0 }
    acc[a.type].tries++
    if (!a.ok) acc[a.type].miss++
  }
  return Object.values(acc)
    .filter((r) => r.tries >= minTries && r.miss > 0)
    .map((r) => ({ ...r, pct: Math.round((100 * r.miss) / r.tries) }))
    .sort((x, y) => y.pct - x.pct || y.miss - x.miss)
    .slice(0, limit)
}
