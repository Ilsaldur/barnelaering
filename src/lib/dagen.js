// «Dagens økt»: tre oppdragskort, barnet velger to. To oppdrag gjør dagen
// ferdig og gir et stempel i ukestripen. Ingen premie for stempelet, ingenting
// går tapt på en fridag. Ren logikk, testet.
import { todayKey } from './profil.js'

export const OVERRASKELSER = ['klokke', 'geografi', 'nott']

// Enkel deterministisk «tilfeldighet» per dato, så overraskelsen er lik hele dagen.
function hashDay(key) {
  let h = 0
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function overraskelseFor(dayKey = todayKey(), tilgjengelige = OVERRASKELSER) {
  if (!tilgjengelige.length) return null
  return tilgjengelige[hashDay(dayKey) % tilgjengelige.length]
}

// Kortene i dag. `fagTilgjengelig` sier hvilke stiger som finnes (lesing kommer i etappe 5).
export function dagensKort({ settings, dayKey = todayKey(), fagTilgjengelig = ['matte'] }) {
  const blanding = settings?.fagblanding?.length ? settings.fagblanding : ['matte', 'lesing', 'overraskelse']
  const kort = []
  const faste = ['matte', 'lesing', 'klokke', 'geografi'].filter((f) => blanding.includes(f))
  for (const f of faste) {
    if (f === 'lesing' && !fagTilgjengelig.includes('lesing')) continue
    kort.push({ id: f, fag: f, fast: settings?.fast === f })
  }
  if (blanding.includes('overraskelse')) {
    const valg = OVERRASKELSER.filter((o) => !kort.some((k) => k.fag === o))
    const o = overraskelseFor(dayKey, valg)
    if (o) kort.push({ id: 'overraskelse', fag: o, overraskelse: true })
  }
  // Til lesestigen er klar brukes matte, klokke og geografi.
  if (kort.length < 3) {
    for (const f of ['klokke', 'geografi']) {
      if (kort.length >= 3) break
      if (!kort.some((k) => k.fag === f)) kort.push({ id: f, fag: f })
    }
  }
  return kort.slice(0, 3)
}

// Status for dagen ut fra dager[today] = { oppdrag, fag: { matte: 1 } }.
export function dagStatus({ dager, settings, dayKey = todayKey() }) {
  const d = dager?.[dayKey] || { oppdrag: 0, fag: {} }
  const maal = settings?.oppdragPerDag || 2
  const fast = settings?.fast || null
  const fastOk = !fast || (d.fag?.[fast] || 0) > 0
  const gjort = d.oppdrag || 0
  const ferdig = gjort >= maal && fastOk
  return { gjort, maal, ferdig, fast, fastOk, fag: d.fag || {} }
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
