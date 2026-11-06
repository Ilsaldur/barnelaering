// Bygger ett oppdrag: åtte oppgaver i ett fag – fem fra eget nivå, to
// repetisjon fra de fem siste nivåene under, og én smakebit fra neste nivå,
// lett før vanskelig. Med hjelp på (etter et svakt oppdrag) hentes halvparten
// fra nivået under. Ingen oppgave kommer fra et nivå over barnets nivå + 1.
import { gen as genMatte } from './generatorer.js'
import { NIVAER as NIVAER_MATTE } from '../../data/matte/nivaer.js'
import { kortstokk, trekkKort } from './kort.js'
import { weakEntries, OPPDRAG_LENGDE, SJEF_LENGDE } from './stige.js'
import { shuffle, randInt } from '../rng.js'

// Standard er mattestigen. Andre stiger sender { nivaer, gen }.
export const MATTE_STIGE = { nivaer: NIVAER_MATTE, gen: genMatte }

function nivaaDef(id, stige = MATTE_STIGE) {
  return stige.nivaer[id - 1]
}

// Trekk en oppgavetype fra et nivå, vektet.
function trekkType(def, rng, filter = null) {
  const typer = filter ? def.typer.filter(filter) : def.typer
  const liste = typer.length ? typer : def.typer
  const total = liste.reduce((s, t) => s + (t.vekt || 1), 0)
  let r = rng() * total
  for (const t of liste) {
    r -= t.vekt || 1
    if (r <= 0) return t
  }
  return liste[liste.length - 1]
}

function lagOppgave(nivaaId, rng, { type, param } = {}, stige = MATTE_STIGE) {
  const def = nivaaDef(nivaaId, stige)
  const t = type ? { type, param: param || {} } : trekkType(def, rng)
  const task = stige.gen(t.type, t.param, rng)
  return { ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid }
}

// Finn nivået der en oppgavetype hører hjemme (brukes når bommen mangler nivå).
export function nivaaForType(type, stige = MATTE_STIGE) {
  const hit = stige.nivaer.find((n) => n.typer.some((t) => t.type === type))
  return hit ? hit.id : null
}

// Lag en oppgave av en bestemt type fra et nivå. Mange typer får et annet navn
// når de lages (skriv_diftonger, les_analog_whole …), så vi prøver nivåets
// generatorer til vi treffer typen; ellers en vanlig oppgave fra nivået.
function lagOppgaveAvType(nivaaId, type, rng, stige = MATTE_STIGE) {
  const def = nivaaDef(nivaaId, stige)
  const direkte = def.typer.find((t) => t.type === type)
  if (direkte) return lagOppgave(nivaaId, rng, direkte, stige)
  for (let i = 0; i < 30; i++) {
    const t = trekkType(def, rng)
    const task = stige.gen(t.type, t.param, rng)
    if (task.type === type) return { ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid }
  }
  return lagOppgave(nivaaId, rng, {}, stige)
}

function nøkkel(task) {
  return `${task.type}|${task.prompt}|${JSON.stringify(task.visual || null)}|${JSON.stringify(task.answer)}|${task.hørOrd || ''}`
}

// Ingen like oppgaver i samme oppdrag. En svak oppgave lages på nytt med samme
// type, så bom-lista virker også når typen har mange like spørsmål.
function unike(tasks, lagNy, rng, stige = MATTE_STIGE) {
  const seen = new Set()
  const out = []
  for (const t of tasks) {
    let cur = t
    let guard = 0
    while (seen.has(nøkkel(cur)) && guard++ < 20) {
      const ny = cur.tag === 'svak' ? lagOppgaveAvType(cur.nivaa, cur.type, rng, stige) : lagNy(cur.nivaa, rng)
      cur = { ...ny, tag: cur.tag, kortId: cur.kortId }
    }
    seen.add(nøkkel(cur))
    out.push(cur)
  }
  return out
}

// Tekstoppdrag: to ulike tekster, tre spørsmål til den ene og to til den andre.
function byggTekstOppdrag(nivaaId, stige, rng, tag = 'eget') {
  const def = nivaaDef(nivaaId, stige)
  const t = def.typer[0]
  const a = stige.tekstOppgaver(t.type, t.param, 3, rng, [])
  const b = stige.tekstOppgaver(t.type, t.param, 2, rng, a.map((x) => x.tekstId))
  return [...a, ...b].map((task) => ({ ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: false, tag }))
}

export function buildMission(fag, { rng = Math.random, stige = MATTE_STIGE, lengde } = {}) {
  const MAKS = stige.nivaer.length
  const nivaa = Math.min(MAKS, Math.max(1, fag.nivaa || 1))
  const def = nivaaDef(nivaa, stige)
  const L = lengde || def.lengde || OPPDRAG_LENGDE
  const hjelp = !!fag.hjelpNeste
  if (def.tekstOppdrag && stige.tekstOppgaver) {
    // Ingen repetisjon eller smakebit på tekstnivåene.
    return { nivaa, hjelp, tasks: byggTekstOppdrag(nivaa, stige, rng), kortIds: [] }
  }
  const under = Math.max(1, nivaa - 1)
  const neste = Math.min(MAKS, nivaa + 1)
  const plan = [] // { nivaa, type?, param?, tag }

  // Fordeling: 8 → 5 egne, 2 repetisjon, 1 neste. Kortere oppdrag: L−2 egne, 1 rep, 1 neste.
  const antEget = L >= 8 ? 5 : Math.max(1, L - 2)
  const antRep = L >= 8 ? 2 : 1
  const antUnder = Math.floor(L / 2)
  const repFra = Math.max(1, nivaa - 5)

  if (hjelp && nivaa > 1) {
    for (let i = 0; i < antUnder; i++) plan.push({ nivaa: under, tag: 'under' })
    for (let i = 0; i < L - antUnder - 1; i++) plan.push({ nivaa, tag: 'eget' })
    plan.push({ nivaa: neste > nivaa ? neste : nivaa, tag: 'neste' })
  } else {
    for (let i = 0; i < antEget; i++) plan.push({ nivaa, tag: 'eget' })
    for (let i = 0; i < antRep; i++) plan.push({ nivaa: nivaa > 1 ? randInt(repFra, nivaa - 1, rng) : nivaa, tag: 'rep' })
    plan.push({ nivaa: neste > nivaa ? neste : nivaa, tag: 'neste' })
  }

  // Svake typer erstatter repetisjonsplassene (og under-plasser i hjelpemodus).
  // Nivået bommen kom fra følger med; aldri en type over barnets nivå.
  const svake = shuffle(
    weakEntries(fag)
      .map((e) => ({ type: e.type, nivaa: e.nivaa ?? nivaaForType(e.type, stige) }))
      .filter((e) => e.nivaa != null && e.nivaa >= 1 && e.nivaa <= Math.min(nivaa, MAKS)),
    rng,
  )
  let svakIdx = 0
  for (const p of plan) {
    if (svakIdx >= svake.length) break
    if (p.tag === 'rep' || (hjelp && p.tag === 'under' && svakIdx < 2)) {
      const e = svake[svakIdx++]
      p.nivaa = e.nivaa
      p.type = e.type
      p.svak = true
      p.tag = 'svak'
    }
  }

  // Kort i bokser: på nivåer med kortstokk erstattes to «egne» oppgaver av kort.
  let kortIds = []
  if (def.kort) {
    const stokk = kortstokk(def.kort, def.kortTabeller)
    const kort = trekkKort(stokk, fag.bokser, 2, rng)
    let k = 0
    for (const p of plan) {
      if (k >= kort.length) break
      if (p.tag === 'eget') {
        p.type = kort[k].type
        p.param = kort[k].param
        p.kortId = kort[k].id
        p.tag = 'kort'
        k++
      }
    }
    kortIds = kort.map((x) => x.id)
  }

  let tasks = plan.map((p) => ({ ...(p.svak ? lagOppgaveAvType(p.nivaa, p.type, rng, stige) : lagOppgave(p.nivaa, rng, p, stige)), tag: p.tag, kortId: p.kortId || undefined }))
  tasks = unike(tasks, (n, r) => lagOppgave(n, r, {}, stige), rng, stige)
  tasks.sort((a, b) => a.nivaa - b.nivaa)
  return { nivaa, hjelp, tasks: tasks.slice(0, L), kortIds }
}

// Sjefsoppgave: fem oppgaver fra nivåene mellom barnets nivå og målet –
// én fra nivået rett over og to fra hvert av de to neste. Færre nivåer igjen:
// oppgavene fordeles på de som finnes.
export function buildBoss(nivaa, target, { rng = Math.random, stige = MATTE_STIGE } = {}) {
  const MAKS = stige.nivaer.length
  const maal = Math.min(MAKS, target)
  const maalDef = nivaaDef(maal, stige)
  if (maalDef.tekstOppdrag && stige.tekstOppgaver) {
    // Samme mønster: tre spørsmål fra en tekst på nivået over, to fra en tekst på målnivået.
    const forste = Math.min(maal, nivaa + 1)
    const d1 = nivaaDef(forste, stige)
    const t1 = d1.tekstOppdrag ? d1.typer[0] : maalDef.typer[0]
    const a = stige.tekstOppgaver(t1.type, t1.param, 3, rng, []).map((x) => ({ ...x, nivaa: d1.tekstOppdrag ? forste : maal, svarform: 'valg', hjelpAlltid: false, tag: 'sjef' }))
    const t2 = maalDef.typer[0]
    const b = stige.tekstOppgaver(t2.type, t2.param, 2, rng, a.map((x) => x.tekstId)).map((x) => ({ ...x, nivaa: maal, svarform: 'valg', hjelpAlltid: false, tag: 'sjef' }))
    return { target: maal, tasks: [...a, ...b] }
  }
  const nivaaer = []
  for (let n = nivaa + 1; n <= maal; n++) nivaaer.push(n)
  let fordeling
  if (nivaaer.length >= 3) fordeling = [1, 2, 2]
  else if (nivaaer.length === 2) fordeling = [2, 3]
  else fordeling = [5]
  const plan = []
  nivaaer.slice(0, fordeling.length).forEach((n, i) => {
    for (let k = 0; k < fordeling[i]; k++) plan.push(n)
  })
  let tasks = plan.map((n) => ({ ...lagOppgave(n, rng, {}, stige), tag: 'sjef' }))
  tasks = unike(tasks, (n, r) => lagOppgave(n, r, {}, stige), rng, stige)
  tasks.sort((a, b) => a.nivaa - b.nivaa)
  return { target: maal, tasks: tasks.slice(0, SJEF_LENGDE) }
}

// Oppgave til plasseringstesten: aldri sant/usant, aldri typer som krever
// fagord barnet ikke har lært (merket `ikkePlassering` i nivådataene).
export function oppgaveTilPlassering(nivaaId, rng = Math.random, stige = MATTE_STIGE) {
  const MAKS = stige.nivaer.length
  const id = Math.min(MAKS, Math.max(1, nivaaId))
  const def = nivaaDef(id, stige)
  for (let i = 0; i < 40; i++) {
    const t = trekkType(def, rng, (x) => !x.ikkePlassering)
    const task = stige.gen(t.type, t.param, rng)
    if (task.form === 'santusant' || task.type === 'fakta_mening') continue
    return { ...task, nivaa: id, svarform: def.svar, hjelpAlltid: false, hjelp: undefined, tag: 'plassering' }
  }
  const task = lagOppgave(id, rng, {}, stige)
  return { ...task, hjelp: undefined, tag: 'plassering' }
}

// Én oppgave fra et gitt nivå (fri bruk, f.eks. «Prøv selv»).
export function oppgaveFraNivaa(nivaaId, rng = Math.random, stige = MATTE_STIGE) {
  const MAKS = stige.nivaer.length
  return lagOppgave(Math.min(MAKS, Math.max(1, nivaaId)), rng, {}, stige)
}
