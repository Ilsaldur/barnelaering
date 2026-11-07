// @vitest-environment jsdom
// Etappe AC: profilvalget uten nett viser de lokale profilene med én gang;
// «Laster …» vises bare mens det faktisk hentes.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

// En Supabase-klient som aldri svarer (nettet er borte eller biblioteket kan ikke hentes).
vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: () => new Promise(() => {}),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: () => ({ select: () => ({ order: async () => ({ data: [], error: null }) }) }),
  },
  hentSupabase: () => new Promise(() => {}),
}))

import { StarProvider } from '../../StarContext.jsx'
import Family from '../../activities/Family.jsx'

const tegn = () =>
  render(
    <StarProvider>
      <Family onPicked={() => {}} onPrivacy={() => {}} />
    </StarProvider>,
  )

describe('profilvalg uten nett', () => {
  let onLine
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('barnelaering_barn_v1', JSON.stringify([{ id: 'a', name: 'Selma', emoji: '🦊' }]))
    onLine = vi.spyOn(navigator, 'onLine', 'get')
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })
  it('uten nett: lokale profiler og «Bare spill!» med én gang, ikke «Laster …»', () => {
    onLine.mockReturnValue(false)
    tegn()
    expect(screen.getByText('Selma')).toBeTruthy()
    expect(screen.queryByText('Laster …')).toBeNull()
    expect(screen.getByText('Bare spill!')).toBeTruthy()
    expect(screen.getByText(/logg inn eller lag familiekonto/)).toBeTruthy()
  })
  it('med nett, mens det hentes: profilene vises, og «Laster …» står til svaret kommer', () => {
    onLine.mockReturnValue(true)
    tegn()
    expect(screen.getByText('Selma')).toBeTruthy()
    expect(screen.getByText('Laster …')).toBeTruthy()
  })
})
