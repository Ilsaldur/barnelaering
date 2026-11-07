// @vitest-environment jsdom
// Etappe U3 «i appen»: forsiden har ingen knapp for Former eller Farger, og en
// profil med gamle data.best åpner uten feil.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import Home from '../../activities/Home.jsx'
import Parents from '../../activities/Parents.jsx'
import { emptyData } from '../../lib/profil.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`

describe('former og farger er borte fra forsiden', () => {
  it('ingen knapp for Former eller Farger, og gamle data.best krasjer ingenting', () => {
    localStorage.clear()
    const d = emptyData()
    d.best = { former: { 0: 3, 1: 2 }, farger: { 0: 1 } }
    d.log.push({ t: Date.now() - 1000, stars: 3, correct: 8, total: 8, topic: 'former', level: 0, ms: 60000 })
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    render(
      <StarProvider>
        <Home onSamling={() => {}} onGarden={() => {}} onParents={() => {}} onSwitchProfile={() => {}} onMatte={() => {}} onLesing={() => {}} onNoetter={() => {}} onDagens={() => {}} onFag={() => {}} />
      </StarProvider>,
    )
    const tekster = screen.getAllByRole('button').map((b) => b.textContent)
    expect(tekster.some((t) => /Former|Farger/.test(t))).toBe(false)
    expect(screen.getByText('Matte')).toBeTruthy()
    cleanup()
    render(
      <StarProvider>
        <Parents go={() => {}} onSwitchProfile={() => {}} onPrivacy={() => {}} />
      </StarProvider>,
    )
    expect(document.body.textContent).not.toContain('Temastiger')
  })
})
