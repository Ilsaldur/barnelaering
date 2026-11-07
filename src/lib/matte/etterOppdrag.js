// Etter et oppdrag (runde 6, etappe AA): tell opp, oppdater faget og finn
// hendelsene. Samme funksjon i appen (Stige.jsx) og i simuleringene.
//
//  - Grensen for godt/svakt regnes av spørsmålene: vis-kort og prøv-plassen
//    teller ikke. Stjernene regnes av alt, men et feil svar på prøv-plassen
//    trekker ikke (oppgaven tas ut av tellingen).
//  - Kunnskapsstigene: kjent-lista oppdateres først, så kravet for nivå opp
//    regnes med det barnet nettopp lærte. Svarte barnet riktig på alle
//    spørsmålene om nye ting, og nivået har mer enn 20 egne ting, kan neste
//    oppdrag ha fire nye.
import { applyResult } from './stige.js'
import { huskOppgaver } from './oppdrag.js'
import { oppdaterBoks } from './kort.js'
import { oppdaterKjent } from '../kunnskap.js'
import { kravFor, egneTing } from '../nivaaTing.js'
import { starsFor } from '../scoring.js'

export const STORT_NIVAA = 20

export function tellOppdrag(perTask) {
  const spm = perTask.filter((r) => !r.vis && r.tag !== 'prov')
  const correct = spm.filter((r) => r.counts).length
  const provFeil = perTask.filter((r) => r.tag === 'prov' && !r.counts).length
  const stjerneTotal = perTask.length - provFeil
  const stjerneRiktig = perTask.filter((r) => r.counts).length
  const nye = new Set(perTask.filter((r) => r.vis && r.kjent).map((r) => r.kjent))
  const nyeSpm = spm.filter((r) => r.kjent && nye.has(r.kjent))
  return {
    correct,
    total: spm.length,
    stars: starsFor(stjerneRiktig, stjerneTotal),
    nyeAlleRiktige: nyeSpm.length > 0 && nyeSpm.every((r) => r.counts),
    nye: nye.size,
  }
}

// Kravet for nivå opp slik det står nå (null når stigen ikke har kunnskapslag).
export function kravForFag(stige, fag) {
  if (!stige.kunnskap || !fag.nivaa) return null
  const k = kravFor(stige, fag.nivaa, fag.kjent)
  return k.av ? k : null
}

export function etterOppdrag(fag, { mission, res, stige, maks, replay = false }) {
  const tell = tellOppdrag(res.perTask)
  let nf
  let events
  if (replay) {
    nf = { ...fag, beste: { ...fag.beste, [mission.nivaa]: Math.max(fag.beste?.[mission.nivaa] || 0, tell.stars) } }
    events = { stars: tell.stars, levelUp: false, levelDown: false, boss: null, toppKlart: false, kravMangler: false }
  } else {
    const kjent = stige.kunnskap ? oppdaterKjent(fag.kjent, res.perTask) : fag.kjent
    const krav = stige.kunnskap ? kravFor(stige, mission.nivaa, kjent) : null
    ;({ fag: nf, events } = applyResult({ ...fag, kjent }, { correct: tell.correct, total: tell.total, nivaa: mission.nivaa, perTask: res.perTask, hjelpModus: !!mission.hjelp, stars: tell.stars, krav: krav?.av ? krav : null }, maks))
    if (stige.kunnskap) nf.nyeMaks = nf.nivaa === mission.nivaa && egneTing(stige, nf.nivaa).size > STORT_NIVAA && tell.nyeAlleRiktige ? 4 : 3
  }
  let bokser = nf.bokser || {}
  for (const r of res.perTask) if (r.kortId) bokser = oppdaterBoks(bokser, r.kortId, r.ok && r.forste)
  nf.bokser = bokser
  nf = huskOppgaver(nf, mission.tasks)
  if (stige.kunnskap && replay) nf.kjent = oppdaterKjent(nf.kjent, res.perTask)
  return { fag: nf, events, tell }
}
