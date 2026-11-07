// @vitest-environment jsdom
// Etappe Y «i appen»: kortet heter «Gave», overskriften «Dagens økt» kan ikke
// brytes, og startskjermen viser merket «🏆 Hele stigen klart» når stigen er klart.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import Home from '../../activities/Home.jsx'
import MatteStige from '../../activities/MatteStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`

describe('forsiden og startskjermen', () => {
  it('«Gave» på overraskelseskortet og «Dagens økt» uten linjebryting', () => {
    localStorage.clear()
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(emptyData()))
    render(
      <StarProvider>
        <Home onSamling={() => {}} onGarden={() => {}} onParents={() => {}} onSwitchProfile={() => {}} onMatte={() => {}} onLesing={() => {}} onNoetter={() => {}} onDagens={() => {}} onFag={() => {}} />
      </StarProvider>,
    )
    expect(screen.getByText('Gave')).toBeTruthy()
    expect(screen.queryByText('Overraskelse')).toBeNull()
    const h2 = screen.getByText('📅 Dagens økt')
    expect(h2.className).toContain('whitespace-nowrap')
    expect(h2.parentElement.className).toContain('flex-wrap')
  })
  it('merket «🏆 Hele stigen klart» vises på startskjermen etterpå', () => {
    localStorage.clear()
    const d = emptyData()
    d.fag.matte = { ...d.fag.matte, nivaa: 38, plassert: true, toppKlart: true }
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <MatteStige go={() => {}} onNoetter={() => {}} />
      </StarProvider>,
    )
    expect(screen.getByTestId('topp-merke').textContent).toContain('Hele stigen klart')
  })
})
