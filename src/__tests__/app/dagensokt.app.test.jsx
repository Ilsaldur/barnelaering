// @vitest-environment jsdom
// Etappe AB «i appen»: spill kortet lengst til venstre. Forsiden viser de samme
// tre kortene med ✓ på det første. Neste dag er kortene nye, og det spilte
// faget er ikke blant de to første.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE, useStars } from '../../StarContext.jsx'
import Home from '../../activities/Home.jsx'
import '../../data/alleStiger.js'
import { emptyData } from '../../lib/profil.js'

const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`
const lesData = () => JSON.parse(localStorage.getItem(DATA_KEY))

// Lar testen «spille» et oppdrag i et fag, slik stigene gjør.
let spill = null
function Spiller() {
  const { addStars } = useStars()
  spill = (fag) => addStars(2, { correct: 7, total: 8, fag, nivaa: 3, oppdrag: true })
  return null
}
function tegn() {
  return render(
    <StarProvider>
      <Spiller />
      <Home onSamling={() => {}} onGarden={() => {}} onParents={() => {}} onSwitchProfile={() => {}} onMatte={() => {}} onLesing={() => {}} onNoetter={() => {}} onDagens={() => {}} onFag={() => {}} />
    </StarProvider>,
  )
}
// Kortene i Dagens økt: [navn, har ✓].
function kortene(container) {
  return [...container.querySelectorAll('[data-testid="dagens-kort"]')].map((b) => ({ tekst: b.textContent, gjort: b.textContent.includes('✓') }))
}
const NAVN = { Matte: 'matte', Lesing: 'lesing', Klokka: 'klokke', Geografi: 'geografi', Engelsk: 'engelsk', Tenkenøtt: 'nott' }
const fagAv = (tekst) => Object.entries(NAVN).find(([n]) => tekst.includes(n))[1]

describe('Dagens økt står stille', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 7, 10, 0, 0))
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(emptyData()))
  })
  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('samme tre kort hele dagen med ✓ på det spilte; nye kort neste dag uten det spilte faget først', () => {
    const { container, unmount } = tegn()
    const foer = kortene(container)
    expect(foer).toHaveLength(3)
    expect(foer.every((k) => !k.gjort)).toBe(true)
    // Kortene er lagret på dagen.
    expect(lesData().dager['2026-11-07'].kort.map((k) => k.fag)).toEqual(foer.map((k) => fagAv(k.tekst)))

    const spilt = fagAv(foer[0].tekst)
    act(() => spill(spilt))
    let etter = kortene(container)
    expect(etter.map((k) => k.tekst.replace('✓', ''))).toEqual(foer.map((k) => k.tekst))
    expect(etter[0].gjort).toBe(true)
    expect(etter[1].gjort).toBe(false)
    expect(etter[2].gjort).toBe(false)
    expect(screen.getByText(/1 av 2 gjort/)).toBeTruthy()

    // Forsiden åpnes på nytt senere samme dag: fortsatt de samme kortene.
    unmount()
    vi.setSystemTime(new Date(2026, 10, 7, 18, 0, 0))
    const igjen = tegn()
    etter = kortene(igjen.container)
    expect(etter.map((k) => k.tekst.replace('✓', ''))).toEqual(foer.map((k) => k.tekst))
    expect(etter[0].gjort).toBe(true)
    igjen.unmount()

    // Neste dag: nye kort, og det spilte faget er ikke blant de to første.
    vi.setSystemTime(new Date(2026, 10, 8, 9, 0, 0))
    const neste = tegn()
    const dag2 = kortene(neste.container)
    expect(dag2).toHaveLength(3)
    expect(dag2.every((k) => !k.gjort)).toBe(true)
    expect(dag2.slice(0, 2).map((k) => fagAv(k.tekst))).not.toContain(spilt)
    expect(lesData().dager['2026-11-08'].kort).toHaveLength(3)
  })
  it('oppdrag fra Fri lek teller mot dagen og får ✓ om faget står på et kort', () => {
    const { container } = tegn()
    const foer = kortene(container)
    const fag = fagAv(foer[1].tekst)
    act(() => spill(fag))
    const etter = kortene(container)
    expect(etter[1].gjort).toBe(true)
    expect(lesData().dager['2026-11-07'].oppdrag).toBe(1)
  })
})
