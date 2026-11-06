// @vitest-environment jsdom
// Akseptansetest F1 «i appen»: nivå 18, ett oppdrag med 3 riktige, så et
// oppdrag der alle svar er riktige på første forsøk. Resultatskjermen viser
// 8 av 8, nivået er fortsatt 18, hjelpemodus er av, ingen sjefsoppgave.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import MatteStige from '../../activities/MatteStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'
import { fmt } from '../../lib/matte/felles.js'

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
function lesData() {
  return JSON.parse(localStorage.getItem(DATA_KEY))
}

function knapp(tekst) {
  return screen.getAllByRole('button').find((b) => b.textContent.trim() === tekst || b.getAttribute('aria-label') === tekst)
}
function klikk(tekst) {
  const b = knapp(tekst)
  if (!b) throw new Error(`Fant ikke knapp «${tekst}»`)
  fireEvent.click(b)
}

// Svar på oppgaven som vises nå, riktig eller galt, og gå videre.
function svar(task, riktig) {
  const label = (v) => (typeof v === 'number' ? fmt(v) : String(v))
  const feilValg = () => task.options.find((o) => String(o) !== String(task.answer))
  // Talltastaturet har aria-label på knappene; tallinja i hjelpen har det ikke.
  const tastKnapp = (lbl) => screen.getAllByRole('button').find((b) => b.getAttribute('aria-label') === lbl)
  const tast = (verdi) => {
    for (const c of String(verdi)) fireEvent.click(tastKnapp(c === '-' ? '−' : c))
    fireEvent.click(tastKnapp('✓'))
  }
  const gjor = (ok) => {
    if (task.form === 'valg') klikk(label(ok ? task.answer : feilValg()))
    else if (task.form === 'tastatur') tast(ok ? task.answer : task.answer + 1)
    else if (task.form === 'santusant') klikk(ok === task.answer ? '✅ Sant' : '❌ Usant')
    else if (task.form === 'sorter') for (const v of ok ? task.answer : [...task.answer].reverse()) klikk(String(v))
    else if (task.form === 'tallinje') {
      const alt = ok ? task.answer : task.line.from + (task.answer === task.line.from ? task.line.step : 0)
      klikk(String(alt))
    } else throw new Error(`ukjent form ${task.form}`)
  }
  gjor(riktig)
  if (!riktig) {
    act(() => vi.advanceTimersByTime(1300)) // «prøv igjen»-pausen
    gjor(false)
  }
  const neste = knapp('➡️ Neste') || knapp('🏁 Se resultat')
  if (!neste) throw new Error(`Ingen Neste etter ${task.form}/${task.type} (${task.prompt}) svar=${JSON.stringify(task.answer)} riktig=${riktig}: ${screen.getAllByRole('button').map((b) => b.textContent.trim() || b.getAttribute('aria-label')).join(' | ')}`)
  fireEvent.click(neste)
}

describe('hjelpemodus i appen (F1)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    fanget.missions.length = 0
    const d = emptyData()
    d.fag.matte = { ...d.fag.matte, nivaa: 18, plassert: true }
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('3 riktige, så 8 riktige i hjelpemodus: 8 av 8, nivå 18, hjelp av, ingen sjef', () => {
    render(
      <StarProvider>
        <MatteStige go={() => {}} onNoetter={() => {}} />
      </StarProvider>,
    )
    // Oppdrag 1: tre riktige.
    klikk('▶️ Start oppdrag')
    const m1 = fanget.missions[0]
    expect(m1.hjelp).toBe(false)
    m1.tasks.forEach((t, i) => svar(t, i < 3))
    expect(screen.getByText(/3 av 8/)).toBeTruthy()
    expect(lesData().fag.matte.hjelpNeste).toBe(true)

    // Oppdrag 2: hjelpemodus, alle riktige på første forsøk.
    klikk('▶️ Nytt oppdrag')
    const m2 = fanget.missions[1]
    expect(m2.hjelp).toBe(true)
    m2.tasks.forEach((t) => svar(t, true))
    expect(screen.getByText(/8 av 8/)).toBeTruthy()
    const d = lesData()
    expect(d.fag.matte.nivaa).toBe(18)
    expect(d.fag.matte.hjelpNeste).toBe(false)
    expect(d.fag.matte.paaRad).toBe(0)
    expect(screen.queryByText(/sjefsoppgaven/i)).toBeNull()
  })
})
