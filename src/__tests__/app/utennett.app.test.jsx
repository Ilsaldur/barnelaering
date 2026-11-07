// @vitest-environment jsdom
// Etappe AC «i appen»: en kastet feil i en stige viser kortet «Noe gikk galt»,
// og «Hjem» virker. Profilvalget uten nett viser de lokale profilene med én gang.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import App from '../../App.jsx'
import { GUEST_PROFILE } from '../../StarContext.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'

const feil = vi.hoisted(() => ({ kast: false }))
vi.mock('../../activities/GeoStige.jsx', () => ({
  default: ({ go }) => {
    if (feil.kast) throw new Error('Failed to fetch dynamically imported module')
    return (
      <div>
        Geografistigen (ok) <button onClick={go}>🏠 Hjem</button>
      </div>
    )
  },
}))

const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`
const knapp = (re) => screen.getAllByRole('button').find((b) => re.test(b.textContent))

describe('AC2: feilgrensen', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const d = emptyData()
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('en feil i en stige viser kortet med «Prøv igjen» og «Hjem»; «Hjem» går til forsiden; «Prøv igjen» tegner stigen på nytt', async () => {
    feil.kast = true
    render(<App />)
    expect(screen.getByText(/Dagens økt/)).toBeTruthy()
    const geo = screen.getAllByRole('button').filter((b) => /Geografi/.test(b.textContent)).pop()
    await act(async () => {
      fireEvent.click(geo)
    })
    await act(async () => {
      await Promise.resolve()
    })
    const kort = await screen.findByTestId('feilkort')
    expect(kort.textContent).toContain('Noe gikk galt')
    expect(knapp(/Prøv igjen/)).toBeTruthy()
    expect(knapp(/Hjem/)).toBeTruthy()
    // Hvit skjerm finnes ikke: forsiden eller kortet er alltid synlig.
    expect(document.body.textContent.length).toBeGreaterThan(20)
    // «Prøv igjen» når feilen er borte: stigen vises.
    feil.kast = false
    await act(async () => {
      fireEvent.click(knapp(/Prøv igjen/))
    })
    expect(await screen.findByText('Geografistigen (ok)')).toBeTruthy()
    // Ny feil, så «Hjem».
    feil.kast = true
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button').find((b) => /Hjem/.test(b.textContent)))
    })
    expect(screen.getByText(/Dagens økt/)).toBeTruthy()
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button').filter((b) => /Geografi/.test(b.textContent)).pop())
    })
    await screen.findByTestId('feilkort')
    await act(async () => {
      fireEvent.click(knapp(/Hjem/))
    })
    expect(screen.getByText(/Dagens økt/)).toBeTruthy()
    expect(screen.queryByTestId('feilkort')).toBeNull()
  })
})
