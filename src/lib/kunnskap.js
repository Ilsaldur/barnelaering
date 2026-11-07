// Kunnskapsstigene (geografi, engelsk, klokka): ting barnet må ha fått vist
// før det kan spørres om dem (runde 5, etappe T).
//
//  - Hvert fag husker hva barnet har fått vist i `fag.kjent`: nøkler som
//    «land:se», «hovedstad:se», «ord:cat», «tid:3:00».
//  - Generatorene setter `kjent` (nøkkelen), `visning` (hvordan tingen vises)
//    og `optionsKjent` (nøkkel per svaralternativ) på oppgavene.
//  - Generatorene tar `kjent` (Set), `foretrekkUkjent` og `kun` som parametre,
//    så oppdraget kan be om kjente ting, nye ting eller én bestemt ting.
import { pick, shuffle } from './rng.js'

// Velg tingen en oppgave handler om.
export function velgKjent(pool, keyOf, param = {}, rng = Math.random) {
  if (param.kun) {
    const k = pool.find((x) => keyOf(x) === param.kun)
    if (k) return k
  }
  if (!param.kjent) return pick(pool, rng)
  const kjente = pool.filter((x) => param.kjent.has(keyOf(x)))
  const ukjente = pool.filter((x) => !param.kjent.has(keyOf(x)))
  if (param.foretrekkUkjent && ukjente.length) return pick(ukjente, rng)
  return pick(kjente.length ? kjente : pool, rng)
}

// Feilsvar: blant kjente ting når barnet kjenner noen; ellers vanlige feilsvar.
// Er det færre kjente enn `n`, blir det færre alternativer (minst to).
export function kjenteFeil(pool, item, keyOf, param = {}, n = 3, rng = Math.random) {
  const andre = pool.filter((x) => keyOf(x) !== keyOf(item))
  if (!param.kjent) return shuffle(andre, rng).slice(0, n)
  const kj = andre.filter((x) => param.kjent.has(keyOf(x)))
  if (kj.length) return shuffle(kj, rng).slice(0, n)
  return shuffle(andre, rng).slice(0, 1)
}

// Lag en vis-oppgave av en spørsmålsoppgave: ett bilde med navn og én knapp.
export function tilVis(task) {
  const v = task.visning
  if (!v) return null
  return {
    type: `vis_${task.type}`,
    form: 'vis',
    kjent: task.kjent,
    emne: task.emne,
    nivaa: task.nivaa,
    svarform: task.svarform,
    prompt: v.tekst,
    spoken: v.spoken || v.tekst,
    lang: v.lang,
    under: v.under,
    visual: v.visual,
    answer: null,
    explain: null,
    hjelpAlltid: false,
    tag: task.tag,
    visAv: task.type,
  }
}

// Oppdater kjent-lista etter et oppdrag. Alt som ble vist, blir kjent. Riktig
// svar om noe ukjent gjør det kjent. Bom på noe barnet kjente fra før, gjør
// det ukjent igjen (så det blir vist neste gang); ting som ble vist i dette
// oppdraget, forblir kjent.
export function oppdaterKjent(kjent, perTask) {
  const foer = new Set(kjent || [])
  const s = new Set(foer)
  const vist = new Set()
  for (const r of perTask) {
    if (!r.kjent) continue
    if (r.vis) {
      s.add(r.kjent)
      vist.add(r.kjent)
    } else if (r.counts) {
      s.add(r.kjent)
    } else if (r.ok === false && foer.has(r.kjent) && !vist.has(r.kjent)) {
      s.delete(r.kjent)
    }
  }
  return [...s]
}
