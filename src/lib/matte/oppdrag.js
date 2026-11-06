// Bygger ett oppdrag: åtte oppgaver i ett fag – fem fra eget nivå, to
// repetisjon fra tidligere nivåer og én fra neste nivå, lett før vanskelig.
// Med hjelp på (etter et svakt oppdrag) hentes halvparten fra nivået under.
import { gen } from './generatorer.js'
import { NIVAER, MAKS } from '../../data/matte/nivaer.js'
import { kortstokk, trekkKort } from './kort.js'
import { activeWeakTypes, OPPDRAG_LENGDE, SJEF_LENGDE } from './stige.js'
import { shuffle, randInt } from '../rng.js'

function nivaaDef(id) {
  return NIVAER[id - 1]
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

function lagOppgave(nivaaId, rng, { type, param } = {}) {
  const def = nivaaDef(nivaaId)
  const t = type ? { type, param: param || {} } : trekkType(def, rng)
  const task = gen(t.type, t.param, rng)
  return { ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid }
}

// Finn nivået der en oppgavetype hører hjemme (til svake typer).
export function nivaaForType(type) {
  const hit = NIVAER.find((n) => n.typer.some((t) => t.type === type))
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

export function buildMission(fag, { rng = Math.random, lengde = OPPDRAG_LENGDE } = {}) {
  const nivaa = Math.min(MAKS, Math.max(1, fag.nivaa || 1))
  const def = nivaaDef(nivaa)
  const hjelp = !!fag.hjelpNeste
  const under = Math.max(1, nivaa - 1)
  const neste = Math.min(MAKS, nivaa + 1)
  const plan = [] // { nivaa, type?, param?, tag }

  if (hjelp && nivaa > 1) {
    for (let i = 0; i < 4; i++) plan.push({ nivaa: under, tag: 'under' })
    for (let i = 0; i < 3; i++) plan.push({ nivaa, tag: 'eget' })
    plan.push({ nivaa: neste > nivaa ? neste : nivaa, tag: 'neste' })
  } else {
    for (let i = 0; i < 5; i++) plan.push({ nivaa, tag: 'eget' })
    const tidligere = nivaa > 1 ? [randInt(1, nivaa - 1, rng), randInt(1, nivaa - 1, rng)] : [nivaa, nivaa]
    for (const n of tidligere) plan.push({ nivaa: n, tag: 'rep' })
    plan.push({ nivaa: neste > nivaa ? neste : nivaa, tag: 'neste' })
  }

  // Svake typer erstatter repetisjonsplassene (og under-plasser i hjelpemodus).
  const svake = shuffle(activeWeakTypes(fag), rng)
  let svakIdx = 0
  for (const p of plan) {
    if (svakIdx >= svake.length) break
    if (p.tag === 'rep' || (hjelp && p.tag === 'under' && svakIdx < 2)) {
      const type = svake[svakIdx++]
      const n = nivaaForType(type)
      if (n) {
        p.nivaa = n
        p.type = type
        p.param = nivaaDef(n).typer.find((t) => t.type === type)?.param || {}
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

  let tasks = plan.map((p) => ({ ...lagOppgave(p.nivaa, rng, p), tag: p.tag, kortId: p.kortId || undefined }))
  tasks = unike(tasks, (n, r) => lagOppgave(n, r), rng)
  // Lett før vanskelig: etter nivå.
  tasks.sort((a, b) => a.nivaa - b.nivaa)
  return { nivaa, hjelp, tasks: tasks.slice(0, lengde), kortIds }
}

// Sjefsoppgave: fem oppgaver fra målnivået (to–tre nivåer høyere).
export function buildBoss(target, { rng = Math.random } = {}) {
  const fra = Math.max(1, target - 1)
  const plan = [fra, target, target, target, target]
  let tasks = plan.map((n) => ({ ...lagOppgave(n, rng), tag: 'sjef' }))
  tasks = unike(tasks, (n, r) => lagOppgave(n, r), rng)
  tasks.sort((a, b) => a.nivaa - b.nivaa)
  return { target, tasks: tasks.slice(0, SJEF_LENGDE) }
}

// Én oppgave fra et gitt nivå (til plasseringstesten).
export function oppgaveFraNivaa(nivaaId, rng = Math.random) {
  return lagOppgave(Math.min(MAKS, Math.max(1, nivaaId)), rng)
}
