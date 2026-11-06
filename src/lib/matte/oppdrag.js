// Bygger ett oppdrag: åtte oppgaver i ett fag – fem fra eget nivå, to
// repetisjon fra tidligere nivåer og én fra neste nivå, lett før vanskelig.
// Med hjelp på (etter et svakt oppdrag) hentes halvparten fra nivået under.
import { gen as genMatte } from './generatorer.js'
import { NIVAER as NIVAER_MATTE } from '../../data/matte/nivaer.js'
import { kortstokk, trekkKort } from './kort.js'
import { activeWeakTypes, OPPDRAG_LENGDE, SJEF_LENGDE } from './stige.js'
import { shuffle, randInt } from '../rng.js'

// Standard er mattestigen. Andre stiger sender { nivaer, gen }.
export const MATTE_STIGE = { nivaer: NIVAER_MATTE, gen: genMatte }

function nivaaDef(id, stige = MATTE_STIGE) {
  return stige.nivaer[id - 1]
}

// Trekk en oppgavetype fra et nivå, vektet.
function trekkType(def, rng) {
  const total = def.typer.reduce((s, t) => s + (t.vekt || 1), 0)
  let r = rng() * total
  for (const t of def.typer) {
    r -= t.vekt || 1
    if (r <= 0) return t
  }
  return def.typer[def.typer.length - 1]
}

function lagOppgave(nivaaId, rng, { type, param } = {}, stige = MATTE_STIGE) {
  const def = nivaaDef(nivaaId, stige)
  const t = type ? { type, param: param || {} } : trekkType(def, rng)
  const task = stige.gen(t.type, t.param, rng)
  return { ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid }
}

// Finn nivået der en oppgavetype hører hjemme (til svake typer).
export function nivaaForType(type, stige = MATTE_STIGE) {
  const hit = stige.nivaer.find((n) => n.typer.some((t) => t.type === type))
  return hit ? hit.id : null
}

function nøkkel(task) {
  return `${task.type}|${task.prompt}|${JSON.stringify(task.visual || null)}`
}

function unike(tasks, lagNy, rng) {
  const seen = new Set()
  const out = []
  for (const t of tasks) {
    let cur = t
    let guard = 0
    while (seen.has(nøkkel(cur)) && guard++ < 20) cur = { ...lagNy(cur.nivaa, rng), tag: cur.tag }
    seen.add(nøkkel(cur))
    out.push(cur)
  }
  return out
}

export function buildMission(fag, { rng = Math.random, stige = MATTE_STIGE, lengde } = {}) {
  const MAKS = stige.nivaer.length
  const nivaa = Math.min(MAKS, Math.max(1, fag.nivaa || 1))
  const def = nivaaDef(nivaa, stige)
  const L = lengde || def.lengde || OPPDRAG_LENGDE
  const hjelp = !!fag.hjelpNeste
  const under = Math.max(1, nivaa - 1)
  const neste = Math.min(MAKS, nivaa + 1)
  const plan = [] // { nivaa, type?, param?, tag }

  // Fordeling: 8 → 5 egne, 2 repetisjon, 1 neste. Kortere oppdrag: L−2 egne, 1 rep, 1 neste.
  const antEget = L >= 8 ? 5 : Math.max(1, L - 2)
  const antRep = L >= 8 ? 2 : 1
  const antUnder = Math.floor(L / 2)

  if (hjelp && nivaa > 1) {
    for (let i = 0; i < antUnder; i++) plan.push({ nivaa: under, tag: 'under' })
    for (let i = 0; i < L - antUnder - 1; i++) plan.push({ nivaa, tag: 'eget' })
    plan.push({ nivaa: neste > nivaa ? neste : nivaa, tag: 'neste' })
  } else {
    for (let i = 0; i < antEget; i++) plan.push({ nivaa, tag: 'eget' })
    for (let i = 0; i < antRep; i++) plan.push({ nivaa: nivaa > 1 ? randInt(1, nivaa - 1, rng) : nivaa, tag: 'rep' })
    plan.push({ nivaa: neste > nivaa ? neste : nivaa, tag: 'neste' })
  }

  // Svake typer erstatter repetisjonsplassene (og under-plasser i hjelpemodus).
  const svake = shuffle(activeWeakTypes(fag), rng)
  let svakIdx = 0
  for (const p of plan) {
    if (svakIdx >= svake.length) break
    if (p.tag === 'rep' || (hjelp && p.tag === 'under' && svakIdx < 2)) {
      const type = svake[svakIdx++]
      const n = nivaaForType(type, stige)
      if (n) {
        p.nivaa = n
        p.type = type
        p.param = nivaaDef(n, stige).typer.find((t) => t.type === type)?.param || {}
        p.tag = 'svak'
      }
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

  let tasks = plan.map((p) => ({ ...lagOppgave(p.nivaa, rng, p, stige), tag: p.tag, kortId: p.kortId || undefined }))
  tasks = unike(tasks, (n, r) => lagOppgave(n, r, {}, stige), rng)
  // Lett før vanskelig: etter nivå.
  tasks.sort((a, b) => a.nivaa - b.nivaa)
  return { nivaa, hjelp, tasks: tasks.slice(0, L), kortIds }
}

// Sjefsoppgave: fem oppgaver fra målnivået (to–tre nivåer høyere).
export function buildBoss(target, { rng = Math.random, stige = MATTE_STIGE } = {}) {
  const fra = Math.max(1, target - 1)
  const plan = [fra, target, target, target, target]
  let tasks = plan.map((n) => ({ ...lagOppgave(n, rng, {}, stige), tag: 'sjef' }))
  tasks = unike(tasks, (n, r) => lagOppgave(n, r, {}, stige), rng)
  tasks.sort((a, b) => a.nivaa - b.nivaa)
  return { target, tasks: tasks.slice(0, SJEF_LENGDE) }
}

// Én oppgave fra et gitt nivå (til plasseringstesten).
export function oppgaveFraNivaa(nivaaId, rng = Math.random, stige = MATTE_STIGE) {
  const MAKS = stige.nivaer.length
  return lagOppgave(Math.min(MAKS, Math.max(1, nivaaId)), rng, {}, stige)
}
