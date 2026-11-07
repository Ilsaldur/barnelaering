// «Dagens økt»: tre oppdragskort, barnet velger to. To oppdrag gjør dagen
// ferdig og gir et stempel i ukestripen. Ingen premie for stempelet, ingenting
// går tapt på en fridag. Reven velger kortene selv (runde 5, etappe R):
// kort 1 og 2 er de to fagene det er lengst siden barnet spilte, kort 3 er en
// overraskelse trukket per dato blant de andre fagene og Nøttehula.
import { todayKey } from './profil.js'

export const FAG_I_DAGEN = ['matte', 'lesing', 'klokke', 'geografi', 'engelsk']
export const OVERRASKELSER = [...FAG_I_DAGEN, 'nott']

// Enkel deterministisk «tilfeldighet» per dato, så kortene er like hele dagen.
function hashDay(key) {
  let h = 0
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function overraskelseFor(dayKey = todayKey(), tilgjengelige = OVERRASKELSER) {
  if (!tilgjengelige.length) return null
  return tilgjengelige[hashDay(dayKey) % tilgjengelige.length]
}

// Når spilte barnet hvert fag sist (fra loggen)? Lesing teller alle tre
// sporene. Fag uten oppdrag i loggen får 0 = «lengst siden».
export function sistSpilt(log = []) {
  const ut = Object.fromEntries(FAG_I_DAGEN.map((f) => [f, 0]))
  for (const e of log) {
    if (!e || !e.t) continue
    const f = e.fag === 'skrive' || e.fag === 'sprak' ? 'lesing' : e.fag
    if (f in ut && e.t > ut[f]) ut[f] = e.t
  }
  return ut
}

// Kortene i dag. `fagTilgjengelig` sier hvilke stiger som finnes.
export function dagensKort({ log = [], dayKey = todayKey(), fagTilgjengelig = FAG_I_DAGEN } = {}) {
  const fag = FAG_I_DAGEN.filter((f) => fagTilgjengelig.includes(f))
  const sist = sistSpilt(log)
  // Lengst siden først; blant like (aldri spilt) avgjør datoen, så alle
  // stigene kommer i løpet av den første uka.
  const sortert = [...fag].sort((a, b) => sist[a] - sist[b] || hashDay(`${dayKey}:${a}`) - hashDay(`${dayKey}:${b}`))
  const kort = sortert.slice(0, 2).map((f) => ({ id: f, fag: f }))
  const valg = OVERRASKELSER.filter((o) => (o === 'nott' || fag.includes(o)) && !kort.some((k) => k.fag === o))
  const o = overraskelseFor(dayKey, valg)
  if (o) kort.push({ id: 'overraskelse', fag: o, overraskelse: true })
  return kort.slice(0, 3)
}

// Status for dagen ut fra dager[today] = { oppdrag, fag: { matte: 1 } }.
export function dagStatus({ dager, settings, dayKey = todayKey() }) {
  const d = dager?.[dayKey] || { oppdrag: 0, fag: {} }
  const maal = settings?.oppdragPerDag || 2
  const fagCount = (f) => (f === 'lesing' ? (d.fag?.lesing || 0) + (d.fag?.skrive || 0) + (d.fag?.sprak || 0) : d.fag?.[f] || 0)
  const gjort = d.oppdrag || 0
  const ferdig = gjort >= maal
  const fagAlle = { ...(d.fag || {}), lesing: fagCount('lesing') }
  return { gjort, maal, ferdig, fag: fagAlle }
}

// Ukestripe: mandag til søndag i inneværende uke, med stempel for ferdige dager.
export function ukestripe({ dager, settings, now = new Date() }) {
  const day = (now.getDay() + 6) % 7 // 0 = mandag
  const monday = new Date(now)
  monday.setDate(now.getDate() - day)
  const navn = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø']
  return navn.map((n, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = todayKey(d)
    const st = dagStatus({ dager, settings, dayKey: key })
    return { key, navn: n, idag: i === day, framtid: i > day, ferdig: st.ferdig, gjort: st.gjort }
  })
}

// Grad i Nøttehula ut fra mattenivået.
export function nottGrad(matteNivaa) {
  if (!matteNivaa || matteNivaa < 15) return 1
  if (matteNivaa < 29) return 2
  return 3
}
