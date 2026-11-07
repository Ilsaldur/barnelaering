// Bygger ett oppdrag: åtte oppgaver i ett fag – fem fra eget nivå, to
// repetisjon fra de fem siste nivåene under, og én smakebit fra neste nivå,
// lett før vanskelig. Med hjelp på (etter et svakt oppdrag) hentes halvparten
// fra nivået under. Ingen oppgave kommer fra et nivå over barnets nivå + 1.
//
// Mot gjentakelser (runde 4, etappe L):
//  - Nøkkelen til en oppgave er det barnet ser: spørsmål, bilde/markering,
//    fasit og ordet som leses opp. Type og nivå er ikke med, så samme flagg
//    fra «Norden» og «Europa» er samme oppgave.
//  - Samme emne (land, ord, klokkeslett) høyst to ganger per oppdrag og aldri
//    to på rad. Stiger kan sette `emneMaks` (Skrive riktig: 1).
//  - Faget husker en kort hash av de 40 siste oppgavene (`fag.sett`). En ny
//    oppgave prøves opptil 30 ganger mot lista; finnes ingen, tas den det er
//    lengst siden barnet fikk.
//  - Nivåer med færre enn 20 ulike spørsmål får fem oppgaver (3 + 1 + 1).
//    På toppnivået byttes smakebiten med en repetisjon.
import { gen as genMatte } from './generatorer.js'
import { NIVAER as NIVAER_MATTE } from '../../data/matte/nivaer.js'
import { kortstokk, trekkKort } from './kort.js'
import { weakEntries, OPPDRAG_LENGDE, SJEF_LENGDE } from './stige.js'
import { shuffle, randInt, seeded } from '../rng.js'
import { tilVis } from '../kunnskap.js'

// Standard er mattestigen. Andre stiger sender { nivaer, gen, tekstOppgaver?, emneMaks? }.
export const MATTE_STIGE = { nivaer: NIVAER_MATTE, gen: genMatte }

export const SETT_MAKS = 40 // så mange oppgaver husker faget
export const FORSOK = 30 // forsøk på å finne en oppgave barnet ikke nettopp fikk
export const LITEN_BUNKE = 20 // færre ulike spørsmål enn dette → fem oppgaver
export const EMNE_MAKS = 2

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

// `ekstra` sendes til generatoren (kunnskapsstigene: kjent, foretrekkUkjent, kun).
function lagOppgave(nivaaId, rng, { type, param, ekstra } = {}, stige = MATTE_STIGE) {
  const def = nivaaDef(nivaaId, stige)
  const t = type ? { type, param: param || {} } : trekkType(def, rng)
  const task = stige.gen(t.type, ekstra ? { ...t.param, ...ekstra } : t.param, rng)
  return { ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid, genType: t.type, genParam: t.param }
}

// Samme oppgavetype som `task`, men om én bestemt ting (`kun`) og med kjente feilsvar.
export function lagOppgaveOm(task, kun, kjent, rng, stige = MATTE_STIGE) {
  const def = nivaaDef(task.nivaa, stige)
  const ny = stige.gen(task.genType, { ...(task.genParam || {}), kun, kjent }, rng)
  return { ...ny, nivaa: task.nivaa, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid, genType: task.genType, genParam: task.genParam, tag: task.tag }
}

// Finn nivået der en oppgavetype hører hjemme (brukes når bommen mangler nivå).
export function nivaaForType(type, stige = MATTE_STIGE) {
  const hit = stige.nivaer.find((n) => n.typer.some((t) => t.type === type))
  return hit ? hit.id : null
}

// Lag en oppgave av en bestemt type fra et nivå. Mange typer får et annet navn
// når de lages (skriv_diftonger, les_analog_whole …), så vi prøver nivåets
// generatorer til vi treffer typen; ellers en vanlig oppgave fra nivået.
function lagOppgaveAvType(nivaaId, type, rng, stige = MATTE_STIGE, ekstra = null) {
  const def = nivaaDef(nivaaId, stige)
  // Generatoren som har typen i navnet først; den kan likevel gi en annen
  // variant (velg_regneart gir også tekst_ett_steg), så vi prøver til typen
  // stemmer. Finnes ingen slik generator, prøves nivåets andre generatorer.
  const direkte = def.typer.find((t) => t.type === type)
  let sist = null
  for (let i = 0; i < 40; i++) {
    const t = direkte || trekkType(def, rng)
    const task = stige.gen(t.type, ekstra ? { ...t.param, ...ekstra } : t.param, rng)
    sist = { ...task, nivaa: nivaaId, svarform: def.svar, hjelpAlltid: !!def.hjelpAlltid, genType: t.type, genParam: t.param }
    if (task.type === type) return sist
  }
  return direkte ? sist : lagOppgave(nivaaId, rng, {}, stige)
}

// ---- Nøkkel og husk-liste -----------------------------------------------------

// Det barnet ser: spørsmål, bilde eller markering, fasit og ordet som leses opp.
export function nokkel(task) {
  const bilde = task.visual ? JSON.stringify(task.visual) : task.form === 'kart' ? `kart:${task.region || ''}` : ''
  return `${task.prompt || ''}|${bilde}|${JSON.stringify(task.answer ?? null)}|${task.hørOrd || ''}`
}

// Kort hash (FNV-1a, 32 bit) av nøkkelen, til lagring i profilen.
export function hashNokkel(task) {
  const s = nokkel(task)
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36)
}

// Legg oppgavene barnet nettopp fikk inn i fagets husk-liste (eldst først).
export function huskOppgaver(fag, tasks) {
  const sett = [...(fag.sett || [])]
  for (const t of tasks) {
    const h = hashNokkel(t)
    const i = sett.indexOf(h)
    if (i >= 0) sett.splice(i, 1)
    sett.push(h)
  }
  return { ...fag, sett: sett.slice(-SETT_MAKS) }
}

// ---- Velg én oppgave ------------------------------------------------------------

// Prøv opptil FORSOK ganger å lage en oppgave som
//   - ikke har samme nøkkel som en oppgave som alt er med (`brukt`),
//   - ikke bryter emne-regelen (`emneOk`), og ikke avvises ellers (`avvis`),
//   - ikke står i husk-lista (`sett`).
// Finnes ingen slik, tas den som oppfyller de to første og er lengst bak i
// husk-lista; finnes ingen slik heller, viker emne-regelen; til slutt tas den
// første som ikke er brukt i oppdraget.
function velg(lag, rng, { brukt, sett = [], emneOk = () => true, avvis = () => false }) {
  let besteOk = null
  let besteOkAlder = -2
  let besteUbrukt = null
  let forste = null
  for (let i = 0; i < FORSOK; i++) {
    const t = lag(rng)
    forste = forste || t
    const n = nokkel(t)
    if (brukt.has(n)) continue
    if (avvis(t)) continue
    if (!besteUbrukt) besteUbrukt = t
    if (!emneOk(t)) continue
    const idx = sett.indexOf(hashNokkel(t))
    if (idx < 0) return t
    // Lavere indeks = lengst siden.
    const alder = sett.length - idx
    if (alder > besteOkAlder) {
      besteOkAlder = alder
      besteOk = t
    }
  }
  return besteOk || besteUbrukt || forste
}

function emneTeller(tasks) {
  const c = {}
  for (const t of tasks) if (t.emne != null) c[t.emne] = (c[t.emne] || 0) + 1
  return c
}

// Fyll en plan med oppgaver, uten gjentakelser.
function fyll(plan, rng, stige, { sett = [], emneMaks = EMNE_MAKS, ekstraAvvis = () => false } = {}) {
  const brukt = new Set()
  const out = []
  let medNull = 0
  for (const p of plan) {
    const lag = (r) => {
      const n = p.nivaaVelger ? p.nivaaVelger(r) : p.nivaa
      const t = p.svak ? lagOppgaveAvType(n, p.type, r, stige, p.ekstra) : lagOppgave(n, r, p, stige)
      return { ...t, tag: p.tag, kortId: p.kortId || undefined }
    }
    const teller = emneTeller(out)
    const t = velg(lag, rng, {
      brukt,
      sett,
      emneOk: (x) => x.emne == null || (teller[x.emne] || 0) < emneMaks,
      // Høyst én oppgave med 0 som ledd i et oppdrag (matte 5–6).
      avvis: (x) => (x.harNull && medNull >= 1) || ekstraAvvis(x),
    })
    if (t.harNull) medNull++
    brukt.add(nokkel(t))
    out.push(t)
  }
  return out
}

// Lett før vanskelig, og aldri samme emne i to oppgaver på rad. Står to like
// ved siden av hverandre, lages den andre på nytt (samme nivå og tag).
function ordne(tasks, rng, stige, sett, emneMaks = EMNE_MAKS) {
  const out = [...tasks].sort((a, b) => a.nivaa - b.nivaa)
  for (let i = 1; i < out.length; i++) {
    const t = out[i]
    if (t.emne == null || t.emne !== out[i - 1].emne) continue
    // Prøv først å bytte med en senere oppgave på samme nivå.
    const j = out.findIndex((x, k) => k > i && x.nivaa === t.nivaa && x.emne !== out[i - 1].emne && (k + 1 >= out.length || out[k + 1].emne !== t.emne) && x.emne !== out[i + 1]?.emne)
    if (j > 0) {
      ;[out[i], out[j]] = [out[j], out[i]]
      continue
    }
    if (t.tag === 'kort' || t.tag === 'sjef') continue
    const brukt = new Set(out.map(nokkel))
    const naboer = new Set([out[i - 1].emne, out[i + 1]?.emne])
    const teller = emneTeller(out.filter((_, k) => k !== i))
    const ok = (x) => x.emne == null || (!naboer.has(x.emne) && (teller[x.emne] || 0) < emneMaks)
    const lag = (r) => ({ ...(t.tag === 'svak' ? lagOppgaveAvType(t.nivaa, t.type, r, stige) : lagOppgave(t.nivaa, r, {}, stige)), tag: t.tag })
    const ny = velg(lag, rng, { brukt, sett, emneOk: ok, avvis: (x) => !!x.harNull })
    if (ok(ny)) out[i] = ny
  }
  return out
}

// ---- Hvor mange ulike spørsmål har et nivå? ------------------------------------

const ulikeCache = new WeakMap()

// Teller ulike nøkler ved å trekke oppgaver fra nivået med fast frø. Stopper
// ved `tak` – mer trenger vi ikke vite. Resultatet huskes per stige og nivå.
export function antallUlike(stige, nivaaId, tak = 60) {
  let perStige = ulikeCache.get(stige.nivaer)
  if (!perStige) {
    perStige = new Map()
    ulikeCache.set(stige.nivaer, perStige)
  }
  const k = `${nivaaId}:${tak}`
  if (perStige.has(k)) return perStige.get(k)
  const def = nivaaDef(nivaaId, stige)
  let n = 0
  if (def.tekstOppdrag) {
    n = tak
  } else {
    const rng = seeded(4242 + nivaaId)
    const sett = new Set()
    for (let i = 0; i < 600 && sett.size < tak; i++) sett.add(nokkel(lagOppgave(nivaaId, rng, {}, stige)))
    n = sett.size
  }
  perStige.set(k, n)
  return n
}

// Oppdragets lengde på et nivå: fem når bunken er liten, ellers nivåets egen.
export function oppdragLengde(stige, nivaaId) {
  const def = nivaaDef(nivaaId, stige)
  if (def.tekstOppdrag) return def.lengde || 5
  if (antallUlike(stige, nivaaId, LITEN_BUNKE) < LITEN_BUNKE) return 5
  return def.lengde || OPPDRAG_LENGDE
}

// ---- Oppdrag ----------------------------------------------------------------------

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
  const L = lengde || oppdragLengde(stige, nivaa)
  const hjelp = !!fag.hjelpNeste
  const sett = fag.sett || []
  if (def.tekstOppdrag && stige.tekstOppgaver) {
    // Ingen repetisjon eller smakebit på tekstnivåene.
    return { nivaa, hjelp, tasks: byggTekstOppdrag(nivaa, stige, rng), kortIds: [] }
  }
  const under = Math.max(1, nivaa - 1)
  const neste = Math.min(MAKS, nivaa + 1)
  const plan = [] // { nivaa, nivaaVelger?, type?, param?, tag }

  // Fordeling: 8 → 5 egne, 2 repetisjon, 1 neste. Kortere oppdrag: L−2 egne, 1 rep, 1 neste.
  const antEget = L >= 8 ? 5 : Math.max(1, L - 2)
  const antRep = L >= 8 ? 2 : 1
  const antUnder = Math.floor(L / 2)
  const repFra = Math.max(1, nivaa - 5)
  // Repetisjon: fra ett av de fem nivåene under (nivå 1: fra nivået selv).
  const rep = () => (nivaa > 1 ? { nivaa: under, nivaaVelger: (r) => randInt(repFra, nivaa - 1, r), tag: 'rep' } : { nivaa, tag: 'rep' })
  // Smakebit fra neste nivå; på toppnivået en repetisjon i stedet.
  const smak = () => (neste > nivaa ? { nivaa: neste, tag: 'neste' } : rep())

  if (hjelp && nivaa > 1) {
    for (let i = 0; i < antUnder; i++) plan.push({ nivaa: under, tag: 'under' })
    for (let i = 0; i < L - antUnder - 1; i++) plan.push({ nivaa, tag: 'eget' })
    plan.push(smak())
  } else {
    for (let i = 0; i < antEget; i++) plan.push({ nivaa, tag: 'eget' })
    for (let i = 0; i < antRep; i++) plan.push(rep())
    plan.push(smak())
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
      delete p.nivaaVelger
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

  // Kunnskapsstigene: vis det barnet ikke kjenner før det spørres.
  if (stige.kunnskap) {
    const tasks = byggKunnskapsOppdrag(plan, rng, stige, { L, nivaa, kjent: fag.kjent, sett, nyeMaks: fag.nyeMaks })
    return { nivaa, hjelp, tasks, kortIds }
  }
  // Kortene først, så de andre oppgavene unngår dem.
  const rekkef = [...plan.filter((p) => p.tag === 'kort'), ...plan.filter((p) => p.tag !== 'kort')]
  let tasks = fyll(rekkef, rng, stige, { sett, emneMaks: stige.emneMaks || EMNE_MAKS })
  tasks = ordne(tasks, rng, stige, sett, stige.emneMaks || EMNE_MAKS)
  return { nivaa, hjelp, tasks: tasks.slice(0, L), kortIds }
}

// Oppdrag i en kunnskapsstige (geografi, engelsk, klokka). Spørsmål stilles
// bare om ting barnet kjenner (`kjent`); det barnet ikke kjenner, vises først
// (vis-oppgave) og spørres om rett etterpå. Høyst `nyeMaks` nye per oppdrag.
// Kjenner barnet færre enn to ting, vises to før det første spørsmålet, så
// svaralternativene kan hentes blant kjente ting. Er alt på nivået kjent, er
// oppdraget som vanlig.
export function byggKunnskapsOppdrag(plan, rng, stige, { L, nivaa, kjent: kjentListe = [], sett = [], nyeMaks = 3 } = {}) {
  const kjent = new Set(kjentListe || [])
  const brukt = new Set()
  const tasks = []
  let nye = 0
  const lag = (p, ekstra) => (r) => {
    const n = p.nivaaVelger ? p.nivaaVelger(r) : p.nivaa
    const t = p.svak ? lagOppgaveAvType(n, p.type, r, stige, ekstra) : lagOppgave(n, r, { ...p, ekstra }, stige)
    return { ...t, tag: p.tag }
  }
  const slots = [...plan]
  const leggTil = (t) => {
    brukt.add(nokkel(t))
    tasks.push(t)
  }
  // Spørsmål om `t` sin ting, med kjente feilsvar (etter at tingen er vist).
  const spm = (t) => ({ ...lagOppgaveOm(t, t.kjent, kjent, rng, stige), tag: t.tag })
  const verdi = (o) => (o && typeof o === 'object' ? o.value : o)
  const alleKjente = (q) => !q.optionsKjent || !q.options || q.options.every((o) => kjent.has(q.optionsKjent[verdi(o)]))
  // Vis + spørsmål om tingen i `t`. Har spørsmålet ingen kjente feilsvar i sin
  // bunke, vises en ny ting til (`t2`) først: vis, vis, spm, spm. Går ikke det,
  // introduseres ikke `t` nå (returnerer false).
  const introduser = (p, t) => {
    kjent.add(t.kjent)
    let q = spm(t)
    let t2 = null
    if (!alleKjente(q)) {
      if (nye + 1 < nyeMaks && L - tasks.length >= 4) {
        // Samme type oppgave som `t`, så den andre tingen hører til samme bunke.
        for (let i = 0; i < 20 && !t2; i++) {
          const c = { ...lagOppgave(t.nivaa, rng, { type: t.genType, param: t.genParam, ekstra: { kjent, foretrekkUkjent: true } }, stige), tag: t.tag }
          if (c.kjent && !kjent.has(c.kjent)) t2 = c
        }
      }
      if (t2) {
        kjent.add(t2.kjent)
        q = spm(t)
      }
      if (!t2 || !alleKjente(q)) {
        kjent.delete(t.kjent)
        if (t2) kjent.delete(t2.kjent)
        return false
      }
    }
    leggTil({ ...tilVis(t), tag: t.tag })
    nye++
    if (t2) {
      leggTil({ ...tilVis(t2), tag: t2.tag })
      nye++
    }
    leggTil(q)
    if (t2) leggTil(spm(t2))
    return true
  }
  // Spør om noe kjent i stedet; null om bunken ikke har noe kjent med kjente feilsvar.
  const kjentSpm = (p) => {
    for (let i = 0; i < 10; i++) {
      const t2 = velg(lag(p, { kjent, foretrekkUkjent: false }), rng, { brukt, sett })
      if (!(t2.kjent && !kjent.has(t2.kjent)) && alleKjente(t2)) return t2
    }
    return null
  }
  while (slots.length && tasks.length < L) {
    const p = slots.shift()
    const kanNy = nye < nyeMaks && L - tasks.length >= 2
    const t = velg(lag(p, { kjent, foretrekkUkjent: kanNy }), rng, { brukt, sett })
    if (t.kjent && !kjent.has(t.kjent)) {
      if (kanNy && introduser(p, t)) continue
      const t2 = kjentSpm(p)
      if (t2) leggTil(t2)
    } else if (alleKjente(t)) leggTil(t)
    else {
      const t2 = kjentSpm(p)
      if (t2) leggTil(t2)
    }
  }
  // Fyll opp med kjente spørsmål fra nivået om slots ble droppet.
  for (let i = 0; i < 30 && tasks.length < L; i++) {
    const t = velg(lag({ nivaa, tag: 'eget' }, { kjent, foretrekkUkjent: false }), rng, { brukt, sett })
    if (t.kjent && !kjent.has(t.kjent)) continue
    if (!alleKjente(t)) continue
    leggTil(t)
  }
  // Rekkefølgen beholdes: en ting vises alltid før det spørres om den.
  return tasks.slice(0, Math.max(L, 2))
}

// Sjefsoppgave: fem oppgaver fra nivåene mellom barnets nivå og målet –
// én fra nivået rett over og to fra hvert av de to neste. Færre nivåer igjen:
// oppgavene fordeles på de som finnes.
export function buildBoss(nivaa, target, { rng = Math.random, stige = MATTE_STIGE, fag = null } = {}) {
  const MAKS = stige.nivaer.length
  const maal = Math.min(MAKS, target)
  const maalDef = nivaaDef(maal, stige)
  const sett = fag?.sett || []
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
    for (let k = 0; k < fordeling[i]; k++) plan.push({ nivaa: n, tag: 'sjef', ekstra: stige.kunnskap ? { kjent: new Set(fag?.kjent || []) } : undefined })
  })
  let tasks = fyll(plan, rng, stige, { sett, emneMaks: stige.emneMaks || EMNE_MAKS })
  tasks = ordne(tasks, rng, stige, sett, stige.emneMaks || EMNE_MAKS)
  return { target: maal, tasks: tasks.slice(0, SJEF_LENGDE) }
}

// Oppgave til plasseringstesten: aldri sant/usant, aldri typer som krever
// fagord barnet ikke har lært (merket `ikkePlassering` i nivådataene).
// `brukt` er oppgavene testen alt har vist, `sett` fagets husk-liste.
export function oppgaveTilPlassering(nivaaId, rng = Math.random, stige = MATTE_STIGE, { brukt = [], sett = [], ekstra = null } = {}) {
  const MAKS = stige.nivaer.length
  const id = Math.min(MAKS, Math.max(1, nivaaId))
  const def = nivaaDef(id, stige)
  const lag = (r) => {
    const t = trekkType(def, r, (x) => !x.ikkePlassering)
    const task = stige.gen(t.type, ekstra ? { ...t.param, ...ekstra } : t.param, r)
    return { ...task, nivaa: id, svarform: def.svar, hjelpAlltid: false, hjelp: undefined, tag: 'plassering', genType: t.type, genParam: t.param }
  }
  const bruktSett = new Set(brukt.map((t) => (typeof t === 'string' ? t : nokkel(t))))
  const emner = new Set(brukt.map((t) => t?.emne).filter((e) => e != null))
  return velg(lag, rng, {
    brukt: bruktSett,
    sett,
    emneOk: (t) => t.emne == null || !emner.has(t.emne),
    avvis: (t) => t.form === 'santusant' || t.type === 'fakta_mening',
  })
}

// Én oppgave fra et gitt nivå (fri bruk, f.eks. «Prøv selv»). `brukt` er
// oppgaver som alt er vist, `sett` fagets husk-liste.
export function oppgaveFraNivaa(nivaaId, rng = Math.random, stige = MATTE_STIGE, { brukt = [], sett = [], ekstra = null } = {}) {
  const MAKS = stige.nivaer.length
  const id = Math.min(MAKS, Math.max(1, nivaaId))
  const bruktSett = new Set(brukt.map((t) => (typeof t === 'string' ? t : nokkel(t))))
  const emner = new Set(brukt.map((t) => t?.emne).filter((e) => e != null))
  return velg((r) => lagOppgave(id, r, { ekstra }, stige), rng, { brukt: bruktSett, sett, emneOk: (t) => t.emne == null || !emner.has(t.emne) })
}
