// @vitest-environment jsdom
// Akseptansetest I1 «i appen»: med «Lær først»-kortet åpent endrer «99» + Enter
// ingenting i oppdraget, og med opplesing på er kortets første steg det siste
// som leses opp når oppdraget åpnes. Samme med kortet fra Lær-knappen.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import MatteStige from '../../activities/MatteStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'
import { laerkortForNivaa } from '../../data/laerkort.js'
import { speech } from '../../speech.js'
import { fmt } from '../../lib/matte/felles.js'
import { laerkortForType } from '../../data/laerkort.js'

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
const knapp = (t) => screen.getAllByRole('button').find((b) => b.textContent.trim() === t)
// Svar riktig på oppgaven som vises, og gå videre.
function svarRiktig(task) {
  const alleKnapper = () => screen.getAllByRole('button')
  const label = (v) => (typeof v === 'number' ? fmt(v) : String(v))
  const tastKnapp = (lbl) => alleKnapper().find((b) => b.getAttribute('aria-label') === lbl)
  if (task.form === 'valg') fireEvent.click(alleKnapper().find((b) => b.textContent.trim() === label(task.answer)))
  else if (task.form === 'tastatur') {
    for (const c of String(task.answer)) fireEvent.click(tastKnapp(c === '-' ? '−' : c))
    fireEvent.click(tastKnapp('✓'))
  } else if (task.form === 'santusant') fireEvent.click(knapp(task.answer ? '✅ Sant' : '❌ Usant'))
  else if (task.form === 'sorter') for (const v of task.answer) fireEvent.click(alleKnapper().find((b) => b.textContent.trim() === String(v)))
  else if (task.form === 'tallinje') fireEvent.click(alleKnapper().find((b) => b.textContent.trim() === String(task.answer)))
  else throw new Error(`ukjent form ${task.form}`)
  fireEvent.click(knapp('➡️ Neste') || knapp('🏁 Se resultat'))
}

const tastInn = (tekst) => {
  for (const c of tekst) fireEvent.keyDown(window, { key: c })
  fireEvent.keyDown(window, { key: 'Enter' })
}

describe('«Lær først» (I1)', () => {
  let spy
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    fanget.missions.length = 0
    const d = emptyData()
    d.fag.matte = { ...d.fag.matte, nivaa: 12, plassert: true }
    d.historier = HISTORIER.map((h) => h.id)
    d.settings = { ...d.settings, autoSpeak: true, autoSpeakSet: true }
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
    globalThis.window.speechSynthesis = { cancel: () => {}, speak: () => {}, getVoices: () => [] }
    globalThis.window.SpeechSynthesisUtterance = function (t) {
      this.text = t
    }
    spy = vi.spyOn(speech, 'speak')
  })
  afterEach(() => {
    cleanup()
    spy.mockRestore()
    vi.useRealTimers()
  })

  it('oppdraget starter først når kortet er lukket; tastetrykk går ikke til oppgaven', () => {
    render(
      <StarProvider>
        <MatteStige go={() => {}} onNoetter={() => {}} />
      </StarProvider>,
    )
    fireEvent.click(knapp('▶️ Start oppdrag'))
    const kort = laerkortForNivaa('matte', 12)
    expect(screen.getByText(`📚 ${kort.tittel}`)).toBeTruthy()
    // Ingen oppgave bak kortet.
    expect(screen.queryByText(/Oppgave 1 av/)).toBeNull()
    // Siste opplesing er kortets første steg.
    const sist = spy.mock.calls.at(-1)[0]
    expect(sist).toContain(kort.steg[0].tekst)
    // «99» + Enter endrer ingenting.
    tastInn('99')
    expect(screen.queryByText(/Oppgave 1 av/)).toBeNull()
    expect(screen.queryByText(/Riktig|Ikke helt|Svaret er/)).toBeNull()

    // Lukk kortet: nå starter oppdraget.
    fireEvent.click(knapp('Jeg kan dette – til oppdraget'))
    expect(screen.getByText(/Oppgave 1 av 8/)).toBeTruthy()

    // Gå fram til en oppgave som har kort (repetisjon fra lavere nivå har ikke alltid det).
    const m = fanget.missions[0]
    let i = 0
    while (!laerkortForType('matte', m.tasks[i].type)) {
      svarRiktig(m.tasks[i])
      i++
    }
    expect(screen.getByText(new RegExp(`Oppgave ${i + 1} av 8`))).toBeTruthy()
    // Åpne kortet med Lær-knappen: tastetrykk går ikke til oppgaven bak.
    const laer = knapp('📚 Lær')
    expect(laer).toBeTruthy()
    fireEvent.click(laer)
    const kortNaa = laerkortForType('matte', m.tasks[i].type)
    expect(screen.getByText(`📚 ${kortNaa.tittel}`)).toBeTruthy()
    tastInn('99')
    expect(screen.queryByText(/Riktig|Ikke helt|Svaret er/)).toBeNull()
    expect(screen.getByText(new RegExp(`Oppgave ${i + 1} av 8`))).toBeTruthy()
    // Tastaturvisningen står fortsatt tom.
    expect(screen.queryByText('99')).toBeNull()
  })
})
