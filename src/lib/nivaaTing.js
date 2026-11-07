// Hvert nivås egne ting (runde 6, etappe Z). En «ting» er kjent-nøkkelen på en
// oppgave («flagg:se», «hovedstad:de», «tid:3:15», «ord:cat»). Et nivås egne
// ting er de som først opptrer på nivået: Klokka 4 eier kvart over og kvart
// på, ikke hele timer; Europa-nivåene eier landene utenfor Norden.
//
// Kartleggingen trekker oppgaver fra hvert nivås generatorer med fast frø,
// uten kjent-lister, til det ikke dukker opp nye nøkler på lenge. Resultatet
// huskes per stige.
//
// Nivåer uten egne nøkler (Klokka 2 «still på hele timer» eier ingen nye
// klokkeslett, Engelsk 9 «Spell it» staver kjente ord) kjennes på at de har
// nye oppgavetyper: der er en prøve «egen» når den kommer fra en ny type og
// handler om noe som ikke er eldre enn nivået under (Klokka 6 stiller til fem
// minutter, ikke til hele timer). Finnes ikke noe slikt, holder den nye typen.
import { seeded } from './rng.js'

const cache = new WeakMap()

export const genId = (type, param) => `${type}|${JSON.stringify(param || {})}`

function lagOppgaver(stige, def, t, rng, antall) {
  const ut = []
  for (let i = 0; i < antall; i++) {
    try {
      ut.push(stige.gen(t.type, t.param || {}, rng))
    } catch {
      break
    }
  }
  return ut
}

// Trekk til det har gått lenge uten nye nøkler: minst 300 trekk og minst 20
// per nøkkel som er funnet.
function noklerFra(stige, def, t, rng) {
  const nokler = new Set()
  const oppgaver = []
  let trekk = 0
  let maal = 300
  while (trekk < maal) {
    const bunke = lagOppgaver(stige, def, t, rng, maal - trekk)
    if (!bunke.length) break
    for (const task of bunke) {
      trekk++
      oppgaver.push(task)
      if (task.kjent) nokler.add(task.kjent)
    }
    maal = Math.max(300, 20 * nokler.size)
    if (!nokler.size) break
  }
  return { nokler, oppgaver }
}

export function kartleggStige(stige) {
  let k = cache.get(stige.nivaer)
  if (k) return k
  const forste = new Map() // nøkkel → nivået den først opptrer på
  const perNivaa = new Map()
  const setteGen = new Set()
  for (const def of stige.nivaer) {
    const alle = new Set()
    const nyeGen = new Set()
    const prover = [] // oppgaver fra nye typer, til tier 2-sjekken
    for (const t of def.typer) {
      const g = genId(t.type, t.param)
      const ny = !setteGen.has(g)
      setteGen.add(g)
      if (ny) nyeGen.add(g)
      const rng = seeded(7000 + def.id * 97 + def.typer.indexOf(t))
      const { nokler, oppgaver } = noklerFra(stige, def, t, rng)
      for (const n of nokler) alle.add(n)
      if (ny) prover.push(...oppgaver.map((o) => ({ ...o, genType: t.type, genParam: t.param })))
    }
    const egne = new Set()
    for (const n of alle) {
      if (!forste.has(n)) {
        forste.set(n, def.id)
        egne.add(n)
      }
    }
    // Tier 2 mulig: finnes det oppgaver fra nye typer som ikke handler om noe
    // eldre enn nivået under?
    const tier2 = !egne.size && prover.some((o) => !o.kjent || (forste.get(o.kjent) ?? def.id) >= def.id - 1)
    perNivaa.set(def.id, { egne, alle, nyeGen, tier2 })
  }
  k = { forste, perNivaa }
  cache.set(stige.nivaer, k)
  return k
}

// Nivåets egne ting (nøkler som først opptrer der).
export function egneTing(stige, nivaa) {
  return kartleggStige(stige).perNivaa.get(nivaa)?.egne || new Set()
}

// Alle ting et nivå spør om (også dem fra lavere nivåer).
export function alleTing(stige, nivaa) {
  return kartleggStige(stige).perNivaa.get(nivaa)?.alle || new Set()
}

// Nivået en ting først opptrer på, eller null.
export function forsteNivaa(stige, nokkel) {
  if (!nokkel) return null
  return kartleggStige(stige).forste.get(nokkel) ?? null
}

// Er oppgaven en prøve på nivåets eget innhold?
export function erEgen(stige, nivaa, task) {
  const k = kartleggStige(stige)
  const info = k.perNivaa.get(nivaa)
  if (!info) return true
  if (info.egne.size) return !!task.kjent && info.egne.has(task.kjent)
  if (!info.nyeGen.size) return true
  if (!info.nyeGen.has(genId(task.genType, task.genParam))) return false
  if (!info.tier2) return true
  if (!task.kjent) return true
  const f = k.forste.get(task.kjent)
  return f == null || f >= nivaa - 1
}

// Hvor mange av nivåets egne ting barnet kjenner.
export function kjenteAvNivaa(stige, nivaa, kjent) {
  const egne = egneTing(stige, nivaa)
  const s = new Set(kjent || [])
  let n = 0
  for (const t of egne) if (s.has(t)) n++
  return { kjent: n, av: egne.size }
}

// Kravet for nivå opp i en kunnskapsstige (runde 6, etappe AA): barnet må
// kjenne minst tre firedeler av nivåets egne ting – alle når nivået har tolv
// eller færre. Nivåer uten egne ting har ikke noe krav (av = 0, ok = true).
export function kravFor(stige, nivaa, kjent) {
  const { kjent: k, av } = kjenteAvNivaa(stige, nivaa, kjent)
  const trengs = av <= 12 ? av : Math.ceil(av * 0.75)
  return { kjent: k, av, trengs, ok: k >= trengs }
}
