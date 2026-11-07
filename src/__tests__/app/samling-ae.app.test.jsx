// @vitest-environment jsdom
// Etappe AE «i appen»: settet for faget barnet sist spilte står øverst og er
// åpent, de andre er slått sammen med «x av y» til man trykker. Et grått kort
// når barnet ikke er plassert sier at reven først finner nivået.
import './setup.js'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import Samling from '../../activities/Samling.jsx'
import { emptyData } from '../../lib/profil.js'
import { SETT, KORT } from '../../data/kort.js'

afterEach(cleanup)
const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`

function tegn(d, onFag = vi.fn()) {
  localStorage.clear()
  localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
  localStorage.setItem(DATA_KEY, JSON.stringify(d))
  render(
    <StarProvider>
      <Samling go={() => {}} onGarden={() => {}} onFag={onFag} />
    </StarProvider>,
  )
  return onFag
}

describe('samlingen (AE)', () => {
  it('sist spilte fag (klokka) øverst og åpent; de andre settene sammenslått med «x av y» til man trykker', () => {
    const d = emptyData()
    d.log = [{ t: 10, fag: 'matte', oppdrag: true }, { t: 20, fag: 'klokke', oppdrag: true }]
    d.kort = ['dyr-ekorn']
    tegn(d)
    const settEl = SETT.map((s) => screen.getByTestId(`sett-${s.id}`))
    // Rekkefølge i dokumentet: klokka først.
    const rekkef = settEl.map((el) => el.getAttribute('data-testid')).sort((a, b) => (screen.getByTestId(a).compareDocumentPosition(screen.getByTestId(b)) & 4 ? -1 : 1))
    expect(rekkef[0]).toBe('sett-klokke')
    expect(screen.getByTestId('sett-klokke').getAttribute('data-aapen')).toBe('ja')
    for (const s of SETT) if (s.id !== 'klokke') expect(screen.getByTestId(`sett-${s.id}`).getAttribute('data-aapen'), s.id).toBe('nei')
    // Sammenslått: bare overskriften med «x av y», ingen grå ruter.
    const dyr = screen.getByTestId('sett-dyr')
    expect(dyr.textContent).toContain(`1 av ${KORT.filter((k) => k.sett === 'dyr').length}`)
    expect(dyr.querySelectorAll('[data-testid^="kort-"]')).toHaveLength(0)
    expect(document.querySelectorAll('[data-testid^="kort-"]').length).toBeLessThan(20)
    // Trykk åpner settet, trykk igjen lukker.
    fireEvent.click(dyr.querySelector('button'))
    expect(screen.getByTestId('sett-dyr').getAttribute('data-aapen')).toBe('ja')
    expect(screen.getByTestId('kort-dyr-ekorn')).toBeTruthy()
    fireEvent.click(screen.getByTestId('sett-dyr').querySelector('button'))
    expect(screen.getByTestId('sett-dyr').getAttribute('data-aapen')).toBe('nei')
  })
  it('grått mattekort når barnet ikke er plassert: «Reven finner først nivået ditt.», og knappen går til matte', () => {
    const d = emptyData()
    const onFag = tegn(d)
    // Matte er standard øverst (ingen logg), så settet er åpent.
    fireEvent.click(screen.getByTestId('kort-dyr-sel'))
    const vindu = screen.getByTestId('kort-vindu')
    expect(vindu.textContent).toContain('Matte, nivå 7')
    expect(vindu.textContent).toContain('Reven finner først nivået ditt.')
    fireEvent.click(screen.getByText('Til matte nivå 7'))
    expect(onFag).toHaveBeenCalledWith('matte')
  })
  it('plassert barn får ikke setningen om at reven finner nivået', () => {
    const d = emptyData()
    d.fag.matte = { ...d.fag.matte, nivaa: 3, plassert: true }
    tegn(d)
    fireEvent.click(screen.getByTestId('kort-dyr-sel'))
    expect(screen.getByTestId('kort-vindu').textContent).not.toContain('Reven finner først')
    expect(screen.getByTestId('kort-vindu').textContent).toContain('Klar nivå 7 med tre stjerner')
  })
})
