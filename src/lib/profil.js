// Barnets fremgang som ren data: tom profil, normalisering av gamle
// lagringer og fletting av to utgaver (lokal og sky) uten å miste noe.

export const DATA_VERSION = 3
export const FAG = ['matte', 'lesing', 'skrive', 'sprak', 'klokke', 'geografi', 'engelsk']

export function emptyFag() {
  return {
    nivaa: null, // null = ikke plassert ennå
    plassert: false,
    paaRad: 0, // oppdrag på rad med 7–8 riktige
    svakRad: 0, // oppdrag på rad med 0–4 riktige
    hjelpNeste: false, // neste oppdrag får hjelp på og henter fra nivået under
    beste: {}, // nivåId -> beste stjerner (0–3) på første forsøk
    bokser: {}, // kort-id -> { boks: 1–5, t }
    svake: {}, // oppgavetype -> { bom, riktig } (bom-lista)
    sjef: null, // ikke i bruk lenger (sjefsoppgaven tilbys direkte)
    updatedAt: 0,
  }
}

export function emptySettings() {
  return {
    autoSpeak: false,
    autoSpeakSet: false, // true når en voksen (eller profilskjemaet) har valgt
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
    laerkort: [], // «Lær først»-kort barnet har sett
    nullstiltT: 0, // når profilen sist ble nullstilt (nyeste vinner ved synk)
  }
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Lesing ble delt i tre spor (v3): Lese 1–9 (nå 1–12), Skrive riktig 1–4
// (gamle 10–13) og Språk 1–3 (gamle 14–16). Stjerner følger nivåene.
export function migrerLesingSpor(fag) {
  const l = { ...emptyFag(), ...(fag.lesing || {}) }
  const skrive = { ...emptyFag(), ...(fag.skrive || {}) }
  const sprak = { ...emptyFag(), ...(fag.sprak || {}) }
  const n = l.nivaa || 0
  const beste = l.beste || {}
  const flytt = (fra, til, mal) => {
    for (const [k, v] of Object.entries(beste)) {
      const nk = Number(k)
      if (nk >= fra && nk <= til) {
        mal.beste = { ...mal.beste, [nk - fra + 1]: Math.max(mal.beste?.[nk - fra + 1] || 0, v) }
        delete beste[k]
      }
    }
  }
  flytt(10, 13, skrive)
  flytt(14, 16, sprak)
  l.beste = beste
  if (n >= 14) {
    sprak.nivaa = n - 13
    sprak.plassert = true
    skrive.nivaa = Math.max(skrive.nivaa || 0, 1)
    skrive.plassert = true
    l.nivaa = 9
  } else if (n >= 10) {
    skrive.nivaa = n - 9
    skrive.plassert = true
    l.nivaa = 9
  }
  // Behold tidspunktet fra den gamle lesedataen, så en enhet med gamle data
  // ikke vinner over nivåer som er satt på en annen enhet etter oppdateringen.
  const t = l.updatedAt || 0
  return { lesing: { ...l, updatedAt: t }, skrive: { ...skrive, updatedAt: Math.max(skrive.updatedAt || 0, t) }, sprak: { ...sprak, updatedAt: Math.max(sprak.updatedAt || 0, t) } }
}

// Gjør en lagret (kanskje gammel) profil komplett.
export function normalize(raw) {
  const d = { ...emptyData(), ...(raw || {}) }
  const gammelVersjon = (raw && raw.v) || 0
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
  d.laerkort = d.laerkort || []
  const fag = {}
  for (const f of FAG) {
    const g = { ...emptyFag(), ...((d.fag || {})[f] || {}) }
    delete g.perfektRad
    // Gamle bom-lister hadde { bom, til }; nå { bom, riktig }.
    g.svake = Object.fromEntries(Object.entries(g.svake || {}).map(([k, v]) => [k, { bom: v.bom || 1, riktig: v.riktig || 0 }]))
    fag[f] = g
  }
  d.fag = fag
  if (gammelVersjon < 3 && raw?.fag?.lesing) Object.assign(d.fag, migrerLesingSpor(raw.fag))
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
  // Bom-lista og rekkene følger nivået: siden som sist ble endret vinner.
  out.svake = { ...(newest.svake || {}) }
  out.sjef = newest.sjef || null
  return out
}

// Slå sammen lokal og sky-lagret fremgang uten å miste noe:
// høyeste stjernetall vinner, mestring celle for celle, logger som union,
// nivå og innstillinger fra den som er sist oppdatert.
export function mergeData(rawA, rawB) {
  const a = normalize(rawA)
  const b = normalize(rawB)
  // Er den ene siden nullstilt etter den andre, vinner den for alt. Ellers
  // (samme tidspunkt, vanligvis 0) flettes som før.
  if ((a.nullstiltT || 0) !== (b.nullstiltT || 0)) return (a.nullstiltT || 0) > (b.nullstiltT || 0) ? a : b
  const out = emptyData()
  out.nullstiltT = a.nullstiltT || 0
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
  out.laerkort = [...new Set([...a.laerkort, ...b.laerkort])]
  if ((a.kostymeT || 0) >= (b.kostymeT || 0)) {
    out.kostyme = a.kostyme
    out.kostymeT = a.kostymeT
  } else {
    out.kostyme = b.kostyme
    out.kostymeT = b.kostymeT
  }
  return out
}

// Skal oppgavene leses opp automatisk? Er innstillingen aldri rørt, leses det
// opp for barn som ikke er plassert i lesing eller står under nivå 8.
export function effectiveAutoSpeak(data) {
  const s = data?.settings || {}
  if (s.autoSpeakSet) return !!s.autoSpeak
  const lesing = data?.fag?.lesing
  if (!lesing || !lesing.plassert || !lesing.nivaa) return true
  return lesing.nivaa < 8
}

// En nullstilt profil: alt borte, innstillingene beholdt, og tidspunktet satt så
// gamle data fra en annen enhet ikke kommer tilbake ved synk.
export function nullstiltData(gammel, now = Date.now()) {
  const fresh = emptyData()
  fresh.settings = { ...(gammel?.settings || fresh.settings), updatedAt: now }
  for (const f of Object.keys(fresh.fag)) fresh.fag[f].updatedAt = now
  fresh.nullstiltT = now
  return fresh
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
