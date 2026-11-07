// Det første oppdraget i en stige (runde 5, etappe S og T): reven finner nivået
// med `finnNivaa`. I kunnskapsstigene starter oppdraget med én vis og ett
// spørsmål om det samme, så første svar blir riktig uansett alder. Bommer
// barnet på nivå 1, blir resten innføring (vis + spørsmål), og oppdraget gir
// tre stjerner. Ren tilstand, så det kan simuleres.
import { startFinn, stegFinn } from './finnNivaa.js'
import { oppgaveTilPlassering, oppgaveFraNivaa, oppdragLengde, lagOppgaveOm, byggKunnskapsOppdrag } from './oppdrag.js'
import { tilVis } from '../kunnskap.js'

export function startForste({ stige, fag, rng = Math.random, tak } = {}) {
  const MAKS = stige.nivaer.length
  const klem = (n) => Math.max(1, Math.min(MAKS, n))
  const lengdeFor = (n) => oppdragLengde(stige, klem(n))
  const finn = startFinn({ maks: MAKS, tak: tak ?? MAKS, lengdeFor })
  const kjent = new Set(fag?.kjent || [])
  const sett = fag?.sett || []
  const st = { stige, rng, finn, kjent, sett, vist: [], kommende: [], perTask: [], innfoering: false, ferdig: false, nivaa: null }
  if (stige.kunnskap) {
    const q = oppgaveTilPlassering(1, rng, stige, { brukt: [], sett, ekstra: { kjent, foretrekkUkjent: true } })
    if (q.kjent && q.visning) {
      const vis = { ...tilVis(q), tag: 'plassering' }
      kjent.add(q.kjent)
      st.vist = [vis]
      st.kommende = [{ ...lagOppgaveOm(q, q.kjent, kjent, rng, stige), tag: 'plassering', hjelp: undefined }]
      return st
    }
    st.vist = [q]
    return st
  }
  st.vist = [oppgaveTilPlassering(1, rng, stige, { brukt: [], sett })]
  return st
}

export function gjeldende(st) {
  return st.vist[st.vist.length - 1]
}

// Svar på oppgaven som står nå. `res` = { ok, forste, hjelp } fra oppgavekortet.
export function svarForste(st, res) {
  if (st.ferdig) return st
  const task = gjeldende(st)
  const vis = task.form === 'vis'
  const entry = { type: task.type, nivaa: task.nivaa, tag: task.tag, kjent: task.kjent, vis, ...res, counts: vis || !!(res.ok && res.forste && !res.hjelp) }
  const perTask = [...st.perTask, entry]
  let next = { ...st, perTask }
  const ekstra = st.stige.kunnskap ? { kjent: st.kjent } : null
  const legg = (t) => ({ ...next, vist: [...st.vist, t] })

  if (st.kommende.length) {
    const [t, ...rest] = st.kommende
    return { ...legg(t), kommende: rest }
  }
  if (st.innfoering) {
    return ferdig(next, 1)
  }
  if (vis) return next // vis uten noe i kø: skal ikke skje

  const finn = stegFinn(st.finn, entry.counts)
  // Kunnskapsstige: bom på nivå 1 → resten er innføring, tre stjerner til slutt.
  if (st.stige.kunnskap && st.finn.fase === 'opp' && st.finn.pos === 1 && !entry.counts) {
    // Resten av oppdraget: minst seks oppgaver, så minst to nye ting blir vist.
    const L = Math.max(6, oppdragLengde(st.stige, 1))
    const plan = Array.from({ length: L }, () => ({ nivaa: 1, tag: 'eget' }))
    const rest = byggKunnskapsOppdrag(plan, st.rng, st.stige, { L: plan.length, nivaa: 1, kjent: [...st.kjent], sett: st.sett, nyeMaks: 2 })
    for (const t of rest) if (t.form === 'vis' && t.kjent) st.kjent.add(t.kjent)
    if (!rest.length) return ferdig({ ...next, finn, innfoering: true }, 1)
    const [t, ...kommende] = rest
    return { ...legg(t), finn, innfoering: true, kommende }
  }
  next = { ...next, finn }
  if (finn.ferdig) return ferdig(next, finn.nivaa)
  const t = finn.fase === 'vanlig' ? { ...oppgaveFraNivaa(finn.nivaa, st.rng, st.stige, { brukt: st.vist, sett: st.sett, ekstra }), tag: 'eget' } : oppgaveTilPlassering(finn.pos, st.rng, st.stige, { brukt: st.vist, sett: st.sett, ekstra })
  return legg(t)
}

function ferdig(st, nivaa) {
  return { ...st, ferdig: true, nivaa }
}

// Resultatet når oppdraget er ferdig.
export function resultatForste(st) {
  const correct = st.perTask.filter((r) => r.counts).length
  return { correct, total: st.perTask.length, perTask: st.perTask, tasks: st.vist, nivaa: st.nivaa, innfoering: st.innfoering }
}

// Framdrift 0–1 til linja uten tall.
export function framdriftForste(st) {
  if (st.ferdig) return 1
  if (st.innfoering) {
    const total = st.vist.length + st.kommende.length
    return Math.min(0.95, st.perTask.length / Math.max(1, total))
  }
  const n = st.perTask.length
  const minst = Math.max(8, n + (st.finn.fase === 'vanlig' ? 1 : 3) + st.kommende.length)
  return Math.min(0.95, n / minst)
}
