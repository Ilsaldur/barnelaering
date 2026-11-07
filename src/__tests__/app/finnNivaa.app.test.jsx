// @vitest-environment jsdom
// Etappe S «i appen»: ny profil, trykk på Matte, svar riktig på alle: oppdraget
// slutter på nivå 38 og resultatskjermen sier «Reven fant plassen din». Ingen
// skjerm underveis inneholder «test», «plassering», «trinn» eller «av 10».
// En profil som er plassert fra før, får ikke dette oppdraget.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import MatteStige from '../../activities/MatteStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'
import { fmt } from '../../lib/matte/felles.js'

const fanget = vi.hoisted(() => ({ tasks: [] }))
vi.mock('../../lib/matte/oppdrag.js', async (importOriginal) => {
  const mod = await importOriginal()
  const fang = (fn) => (...args) => {
    const t = fn(...args)
    fanget.tasks.push(t)
    return t
  }
  return { ...mod, oppgaveTilPlassering: fang(mod.oppgaveTilPlassering), oppgaveFraNivaa: fang(mod.oppgaveFraNivaa) }
})

const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`
const lesData = () => JSON.parse(localStorage.getItem(DATA_KEY))
const knapp = (tekst) => screen.getAllByRole('button').find((b) => b.textContent.trim() === tekst || b.getAttribute('aria-label') === tekst)
const klikk = (tekst) => {
  const b = knapp(tekst)
  if (!b) throw new Error(`Fant ikke knapp «${tekst}»`)
  fireEvent.click(b)
}

function svarRiktig(task) {
  const label = (v) => (typeof v === 'number' ? fmt(v) : String(v))
  const tastKnapp = (lbl) => screen.getAllByRole('button').find((b) => b.getAttribute('aria-label') === lbl)
  if (task.form === 'valg') klikk(label(task.answer))
  else if (task.form === 'tastatur') {
    for (const c of String(task.answer)) fireEvent.click(tastKnapp(c === '-' ? '−' : c === '.' ? ',' : c))
    fireEvent.click(tastKnapp('✓'))
  } else if (task.form === 'santusant') klikk(task.answer ? '✅ Sant' : '❌ Usant')
  else if (task.form === 'sorter') for (const v of task.answer) { const it = task.items.find((x) => (x && typeof x === 'object' ? x.id : x) === v); klikk(it && typeof it === 'object' ? `${it.label} ${it.id}` : String(v)) }
  else if (task.form === 'tallinje') klikk(String(task.answer))
  else throw new Error(`ukjent form ${task.form}`)
  const neste = knapp('➡️ Neste') || knapp('🏁 Se resultat')
  if (!neste) throw new Error(`Ingen Neste etter ${task.form}/${task.type} (${task.prompt})`)
  fireEvent.click(neste)
}

const forbudt = (tekst) => {
  const t = tekst.toLowerCase()
  return ['plassering', 'trinn', 'av 10', 'test'].filter((o) => t.includes(o))
}

describe('første oppdrag finner nivået (S3, S4)', () => {
  beforeEach(() => {
    localStorage.clear()
    fanget.tasks.length = 0
    const d = emptyData()
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
  })
  afterEach(cleanup)

  it('ny profil, alle riktige: nivå 38, «Reven fant plassen din», ingen forbudte ord underveis', () => {
    render(
      <StarProvider>
        <MatteStige go={() => {}} onNoetter={() => {}} />
      </StarProvider>,
    )
    let runder = 0
    while (!screen.queryByTestId('funnet') && runder < 20) {
      // Skjermen underveis: ingen teller og ingen forbudte ord i rammen rundt oppgaven.
      const kropp = document.body.textContent
      expect(kropp).not.toMatch(/Oppgave \d+ av \d+/)
      expect(forbudt(kropp.replace(fanget.tasks[fanget.tasks.length - 1].prompt, '')), kropp.slice(0, 200)).toEqual([])
      svarRiktig(fanget.tasks[fanget.tasks.length - 1])
      runder++
    }
    expect(screen.getByTestId('funnet').textContent).toContain('Reven fant plassen din')
    expect(screen.getByTestId('funnet').textContent).toContain('nivå 38')
    const d = lesData()
    expect(d.fag.matte.nivaa).toBe(38)
    expect(d.fag.matte.plassert).toBe(true)
    expect(d.fag.matte.sett.length).toBe(fanget.tasks.length)
    expect(fanget.tasks.map((t) => t.nivaa).slice(0, 7)).toEqual([1, 2, 4, 8, 16, 32, 38])
    expect(fanget.tasks.length).toBe(9)
    // Oppdraget teller i Dagens økt.
    expect(Object.values(d.dager)[0].oppdrag).toBe(1)
  })

  it('en profil som er plassert fra før, går rett til kartet', () => {
    const d = lesData()
    d.fag.matte = { ...d.fag.matte, nivaa: 12, plassert: true }
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <MatteStige go={() => {}} onNoetter={() => {}} />
      </StarProvider>,
    )
    expect(knapp('▶️ Start oppdrag')).toBeTruthy()
    expect(fanget.tasks).toHaveLength(0)
    expect(screen.getByText(/Nivå 12 av 38/)).toBeTruthy()
  })
})
