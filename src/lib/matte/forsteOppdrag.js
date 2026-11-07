// Det første oppdraget i en stige (runde 5, etappe S og T; runde 6, etappe Z):
// reven finner nivået med `finnNivaa`.
//
// Kunnskapsstigene (geografi, engelsk) og klokka (vis-kort først, uten kjent):
//  - Oppdraget starter med én vis og ett spørsmål om det samme, så første svar
//    blir riktig uansett alder. Bommer barnet der, blir resten innføring
//    (vis + spørsmål), og oppdraget gir tre stjerner.
//  - Prøvene (opp, søk og slå fast) er vanlige spørsmål fra nivået: ingen
//    kjent-fortrinn, vanlige feilsvar, og alltid om nivåets eget innhold
//    (`erEgen` i nivaaTing.js). Et riktig svar gjør tingen kjent.
//  - Når nivået er funnet, fylles resten av oppdraget som et vanlig
//    kunnskapsoppdrag: spørsmål om det barnet kjenner, og vis + spørsmål om
//    høyst tre nye ting. Ingen oppgave stilles to ganger.
//  - Framdriftslinja går aldri bakover, selv om oppdraget blir lengre enn
//    anslått.
// Ren tilstand, så det kan simuleres.
import { startFinn, stegFinn, minLengde } from './finnNivaa.js'
import { oppgaveTilPlassering, oppgaveFraNivaa, oppdragLengde, lagOppgaveOm, byggKunnskapsOppdrag, visOgSpor } from './oppdrag.js'
import { tilVis } from '../kunnskap.js'

export const NYE_I_FORSTE = 3

export function startForste({ stige, fag, rng = Math.random, tak } = {}) {
  const MAKS = stige.nivaer.length
  const klem = (n) => Math.max(1, Math.min(MAKS, n))
  const lengdeFor = (n) => oppdragLengde(stige, klem(n))
  // Angre-regelen (etappe AD) gjelder matte og lesing. I stigene med gjettbare
  // svar (klokka, geografi, engelsk) ville et heldig gjett på det nye
  // spørsmålet sende barnet for høyt, så der angres det ikke.
  const gjettbar = !!(stige.kunnskap || stige.egneProver)
  const finn = startFinn({ maks: MAKS, tak: tak ?? MAKS, lengdeFor, angre: !gjettbar })
  const kjent = new Set(fag?.kjent || [])
  const sett = fag?.sett || []
  const st = { stige, rng, finn, kjent, sett, vist: [], kommende: [], perTask: [], innfoering: false, fylt: false, fram: 0, ferdig: false, nivaa: null }
  if (stige.kunnskap || stige.visFoerst) {
    // Vis + spørsmål om det samme. Spørsmålet har vanlige feilsvar.
    const q = oppgaveTilPlassering(1, rng, stige, { brukt: [], sett, egen: true })
    if (q.kjent && q.visning) {
      const vis = { ...tilVis(q), tag: 'plassering' }
      st.vist = [vis]
      st.kommende = [{ ...lagOppgaveOm(q, q.kjent, undefined, rng, stige), tag: 'plassering', hjelp: undefined }]
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

// Framdrift 0–1 til linja uten tall, regnet ut fra tilstanden.
function beregnFramdrift(st) {
  if (st.ferdig) return 1
  const n = st.perTask.length
  if (st.innfoering || st.fylt) {
    const total = st.vist.length + st.kommende.length
    return Math.min(0.95, n / Math.max(1, total))
  }
  const minst = Math.max(8, n + (st.finn.fase === 'vanlig' ? 1 : 3) + st.kommende.length)
  return Math.min(0.95, n / minst)
}

// Svar på oppgaven som står nå. `res` = { ok, forste, hjelp } fra oppgavekortet.
export function svarForste(st, res) {
  if (st.ferdig) return st
  const ut = stegForste(st, res)
  // Z3: linja går aldri bakover.
  return { ...ut, fram: Math.max(st.fram || 0, beregnFramdrift(ut)) }
}

function stegForste(st, res) {
  const task = gjeldende(st)
  const vis = task.form === 'vis'
  const entry = { type: task.type, nivaa: task.nivaa, tag: task.tag, kjent: task.kjent, vis, ...res, counts: vis || !!(res.ok && res.forste && !res.hjelp) }
  const perTask = [...st.perTask, entry]
  // Z1: et riktig svar (og alt som vises) gjør tingen kjent.
  const kjent = new Set(st.kjent)
  if (task.kjent && entry.counts) kjent.add(task.kjent)
  let next = { ...st, perTask, kjent }
  const legg = (t) => ({ ...next, vist: [...st.vist, t] })

  if (st.kommende.length) {
    const [t, ...rest] = st.kommende
    return { ...legg(t), kommende: rest }
  }
  if (st.innfoering) return ferdig(next, 1)
  if (st.fylt) return ferdig(next, st.finn.nivaa)
  if (vis) return next // vis uten noe i kø: skal ikke skje

  const finn = stegFinn(st.finn, entry.counts)
  // Kunnskapsstige (og klokka, som har vis-kort først): bom på nivå 1 → resten
  // er innføring, tre stjerner til slutt.
  if ((st.stige.kunnskap || st.stige.visFoerst) && st.finn.fase === 'opp' && st.finn.pos === 1 && !entry.counts) {
    // Resten av oppdraget: minst seks oppgaver, så minst to nye ting blir vist.
    const L = Math.max(6, oppdragLengde(st.stige, 1))
    const plan = Array.from({ length: L }, () => ({ nivaa: 1, tag: 'eget' }))
    const rest = st.stige.kunnskap ? byggKunnskapsOppdrag(plan, st.rng, st.stige, { L: plan.length, nivaa: 1, kjent: [...kjent], sett: st.sett, nyeMaks: 2, foer: st.vist }) : visOgSpor(1, st.rng, st.stige, { antall: 2, foer: st.vist })
    for (const t of rest) if (t.form === 'vis' && t.kjent) kjent.add(t.kjent)
    if (!rest.length) return ferdig({ ...next, finn, innfoering: true }, 1)
    const [t, ...kommende] = rest
    return { ...legg(t), finn, innfoering: true, kommende }
  }
  next = { ...next, finn }
  if (finn.ferdig) return ferdig(next, finn.nivaa)
  if (finn.fase === 'vanlig') {
    if (st.stige.kunnskap) {
      // Z2: fyll resten som et vanlig kunnskapsoppdrag på nivået.
      const R = Math.max(1, minLengde(finn) - finn.steg.length)
      const plan = Array.from({ length: R }, () => ({ nivaa: finn.nivaa, tag: 'eget' }))
      const rest = byggKunnskapsOppdrag(plan, st.rng, st.stige, { L: R, nivaa: finn.nivaa, kjent: [...kjent], sett: st.sett, nyeMaks: NYE_I_FORSTE, foer: st.vist })
      for (const t of rest) if (t.form === 'vis' && t.kjent) kjent.add(t.kjent)
      if (!rest.length) return ferdig(next, finn.nivaa)
      const [t, ...kommende] = rest
      return { ...legg(t), fylt: true, kommende }
    }
    return legg({ ...oppgaveFraNivaa(finn.nivaa, st.rng, st.stige, { brukt: st.vist, sett: st.sett }), tag: 'eget' })
  }
  // Prøve (opp, søk, slå fast): vanlig spørsmål om nivåets eget innhold.
  return legg(oppgaveTilPlassering(finn.pos, st.rng, st.stige, { brukt: st.vist, sett: st.sett, egen: !!(st.stige.kunnskap || st.stige.egneProver) }))
}

function ferdig(st, nivaa) {
  return { ...st, ferdig: true, nivaa }
}

// Resultatet når oppdraget er ferdig.
export function resultatForste(st) {
  const correct = st.perTask.filter((r) => r.counts).length
  return { correct, total: st.perTask.length, perTask: st.perTask, tasks: st.vist, nivaa: st.nivaa, innfoering: st.innfoering }
}

// Framdrift 0–1 til linja uten tall. Går aldri bakover (Z3).
export function framdriftForste(st) {
  if (st.ferdig) return 1
  return Math.max(st.fram || 0, beregnFramdrift(st))
}
