// @vitest-environment jsdom
// Akseptansetester H1.1 og H1.2 «i appen»: på Lese nivå 7 og 8 leser stemmen
// aldri setningen eller teksten barnet skal lese selv, og en profil der ingen
// har rørt bryteren har autoSpeakSet = false etter første oppdrag.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import LeseStige from '../../activities/LeseStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { speech } from '../../speech.js'

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

function spillAlleRiktig(mission) {
  for (const task of mission.tasks) {
    const label = String(task.answer)
    fireEvent.click(screen.getAllByRole('button').find((b) => b.textContent.trim() === label))
    fireEvent.click(knapp('➡️ Neste') || knapp('🏁 Se resultat'))
  }
}

function settOpp(nivaa, settings = {}) {
  localStorage.clear()
  fanget.missions.length = 0
  const d = emptyData()
  d.fag.lesing = { ...d.fag.lesing, nivaa, plassert: true }
  d.settings = { ...d.settings, ...settings }
  localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
  localStorage.setItem(DATA_KEY, JSON.stringify(d))
}

describe('opplesing i leseoppgaver (H1)', () => {
  let spy
  beforeEach(() => {
    vi.useFakeTimers()
    // jsdom har ingen talesyntese; vi gir speech en «stemme» å kalle, og lytter.
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

  for (const nivaa of [7, 8]) {
    it(`Lese nivå ${nivaa}: ingen opplest tekst inneholder setningen eller teksten`, () => {
      // Nivå 7: bryteren urørt → på etter regelen. Nivå 8: en voksen har slått den på.
      settOpp(nivaa, nivaa === 8 ? { autoSpeak: true, autoSpeakSet: true } : {})
      render(
        <StarProvider>
          <LeseStige go={() => {}} start="lesing" />
        </StarProvider>,
      )
      expect(speech.autoEnabled()).toBe(true)
      fireEvent.click(knapp('▶️ Start oppdrag'))
      const m = fanget.missions[0]
      spillAlleRiktig(m)
      const lest = spy.mock.calls.map((c) => String(c[0]))
      expect(lest.length).toBeGreaterThan(0)
      for (const t of m.tasks) {
        const tekst = t.visual?.kind === 'tekst' ? t.visual.tekst : t.type === 'setning_bilde' ? t.prompt : null
        if (!tekst) continue
        const bit = tekst.slice(0, 25)
        for (const l of lest) expect(l, `leste «${l.slice(0, 40)}…»`).not.toContain(bit)
      }
      if (nivaa === 7) {
        // H1.2: ingen har rørt bryteren, og appen skal ikke ha gjort det heller.
        expect(JSON.parse(localStorage.getItem(DATA_KEY)).settings.autoSpeakSet).toBe(false)
      }
    })
  }

  it('«Les teksten for meg» leser teksten og teller som hjelp; finnes ikke i plasseringstesten', () => {
    settOpp(8, { autoSpeak: false, autoSpeakSet: true })
    render(
      <StarProvider>
        <LeseStige go={() => {}} start="lesing" />
      </StarProvider>,
    )
    fireEvent.click(knapp('▶️ Start oppdrag'))
    const m = fanget.missions[0]
    const les = knapp('📖 Les teksten for meg')
    expect(les).toBeTruthy()
    fireEvent.click(les)
    const lest = spy.mock.calls.map((c) => String(c[0]))
    expect(lest.some((l) => l.includes(m.tasks[0].visual.tekst.slice(0, 25)))).toBe(true)
    // Svar riktig: oppgaven teller ikke (hjelp brukt), så første oppgave gir ikke «Riktig! 🎉» med stjernetekst.
    fireEvent.click(screen.getAllByRole('button').find((b) => b.textContent.trim() === String(m.tasks[0].answer)))
    expect(screen.getByText(/Riktig! 👍/)).toBeTruthy()
  })
})
