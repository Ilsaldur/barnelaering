// @vitest-environment jsdom
// Etappe AA, akseptansetest 3 «i appen»: etter to oppdrag med alt riktig på
// Geografi 4 der barnet kjenner 5 av 22 ting, står barnet fortsatt på nivå 4,
// og kartet sier hvor mange det kjenner.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import GeoStige from '../../activities/GeoStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'
import { LAERKORT } from '../../data/laerkort.js'
import { egneTing } from '../../lib/nivaaTing.js'
import { NIVAER_GEO } from '../../data/geo/nivaer.js'
import { genGeo } from '../../lib/geo/generatorer.js'

const fanget = vi.hoisted(() => ({ missions: [] }))
vi.mock('../../lib/matte/oppdrag.js', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    buildMission: (...args) => {
      const m = mod.buildMission(...args)
      fanget.missions.push(m)
      return m
    },
  }
})

const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`
const lesData = () => JSON.parse(localStorage.getItem(DATA_KEY))
const knapper = () => screen.getAllByRole('button')
const knapp = (tekst) => knapper().find((b) => b.textContent.trim() === tekst || b.getAttribute('aria-label') === tekst)
const klikk = (tekst) => {
  const b = knapp(tekst)
  if (!b) throw new Error(`Fant ikke knapp «${tekst}». Knapper: ${knapper().map((x) => x.textContent.trim()).join(', ')}`)
  fireEvent.click(b)
}

function svarRiktig(task) {
  if (task.form === 'vis') {
    klikk(knapp('➡️ Neste') ? '➡️ Neste' : '🏁 Se resultat')
    return
  }
  if (task.form !== 'valg') throw new Error(`uventet form ${task.form} på nivå 4`)
  if (task.optionFlagg) {
    const b = knapper().find((x) => x.querySelector(`img[src="/flagg/${task.answer}.svg"]`))
    if (!b) throw new Error(`Fant ikke flaggknapp ${task.answer}`)
    fireEvent.click(b)
  } else klikk(String(task.answer))
  const neste = knapp('➡️ Neste') || knapp('🏁 Se resultat')
  if (!neste) throw new Error(`Ingen Neste etter ${task.type} (${task.prompt})`)
  fireEvent.click(neste)
}

function spillOppdrag() {
  klikk('▶️ Start oppdrag')
  const m = fanget.missions[fanget.missions.length - 1]
  for (const t of m.tasks) svarRiktig(t)
  return m
}

describe('AA3: Geografi 4, nivåets ting må være kjent', () => {
  const GEO = { nivaer: NIVAER_GEO, gen: genGeo, kunnskap: true }
  beforeEach(() => {
    localStorage.clear()
    fanget.missions.length = 0
    const d = emptyData()
    d.historier = HISTORIER.map((h) => h.id)
    d.laerkort = LAERKORT.map((k) => k.id)
    d.fag.geografi = { ...d.fag.geografi, nivaa: 4, plassert: true, kjent: [...egneTing(GEO, 4)].slice(0, 5) }
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
  })
  afterEach(cleanup)

  it('to oppdrag med alt riktig: fortsatt nivå 4, kartet sier «Du kjenner x av 22 land», ingen sjefsoppgave', () => {
    render(
      <StarProvider>
        <GeoStige go={() => {}} />
      </StarProvider>,
    )
    expect(screen.getByTestId('kjent-av').textContent).toContain('Du kjenner 5 av 22 land')
    expect(screen.getByTestId('neste-nivaa').textContent).toContain('Nivå 5 åpner når du kjenner 17 og har to gode oppdrag på rad')

    const m1 = spillOppdrag()
    expect(m1.tasks.filter((t) => t.form === 'vis').length).toBe(3)
    expect(m1.tasks.filter((t) => t.tag === 'prov').length).toBe(1)
    expect(screen.getByText(/Alle riktige/)).toBeTruthy()
    expect(screen.queryByTestId('sjefstilbud')).toBeNull()
    expect(screen.getByTestId('neste-nivaa-resultat').textContent).toMatch(/Du kjenner \d+ av 22 land/)
    klikk('🌍 Til geografistigen')
    let d = lesData()
    expect(d.fag.geografi.nivaa).toBe(4)
    expect(d.fag.geografi.paaRad).toBe(1)
    expect(d.fag.geografi.nyeMaks).toBe(4)

    const m2 = spillOppdrag()
    expect(m2.tasks.filter((t) => t.form === 'vis').length).toBe(4)
    expect(screen.queryByText(/Nivå opp/)).toBeNull()
    expect(screen.queryByTestId('sjefstilbud')).toBeNull()
    expect(screen.getByTestId('neste-nivaa-resultat').textContent).toMatch(/To gode oppdrag på rad! Nivå 5 åpner når du kjenner 17/)
    klikk('🌍 Til geografistigen')
    d = lesData()
    expect(d.fag.geografi.nivaa).toBe(4)
    expect(d.fag.geografi.paaRad).toBe(2)
    const kjente = d.fag.geografi.kjent.filter((k) => egneTing(GEO, 4).has(k)).length
    expect(kjente).toBeGreaterThanOrEqual(12)
    expect(kjente).toBeLessThan(17)
    expect(screen.getByTestId('kjent-av').textContent).toContain(`Du kjenner ${kjente} av 22 land`)
    expect(screen.getByTestId('neste-nivaa').textContent).toBe(`🪜 Du kjenner ${kjente} av 22 land. Nivå 5 åpner når du kjenner 17.`)
  })
})
