// @vitest-environment jsdom
// Etappe Z, akseptansetest 4 «i appen»: et barn som svarer riktig bare på hele
// timer, plasseres på Klokka 1 eller 2.
import './setup.js'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { StarProvider, GUEST_PROFILE } from '../../StarContext.jsx'
import KlokkeStige from '../../activities/KlokkeStige.jsx'
import { emptyData } from '../../lib/profil.js'
import { HISTORIER } from '../../data/historier.js'
import { timeVinkel } from '../../lib/klokke/vinkel.js'

// Klokka tegnes som knapper, så testen kan «dra» viserne.
vi.mock('../../components/AnalogClock.jsx', () => ({
  default: ({ hour, minute, onChange, interactive }) => (
    <div data-testid="klokke" data-tid={`${hour}:${minute}`}>
      {interactive &&
        Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <button key={`h${h}`} type="button" aria-label={`time ${h}`} onClick={() => onChange?.(h, minute, { hourDeg: timeVinkel(h, minute), viser: 'hour' })} />
        ))}
      {interactive && [0, 15, 30, 45].map((m) => <button key={`m${m}`} type="button" aria-label={`minutt ${m}`} onClick={() => onChange?.(hour, m, { hourDeg: timeVinkel(hour, m), viser: 'minute' })} />)}
    </div>
  ),
}))

const fanget = vi.hoisted(() => ({ tasks: [] }))
vi.mock('../../lib/matte/forsteOppdrag.js', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    gjeldende: (st) => {
      const t = mod.gjeldende(st)
      if (fanget.tasks[fanget.tasks.length - 1] !== t) fanget.tasks.push(t)
      return t
    },
  }
})

const DATA_KEY = `barnelaering_data_${GUEST_PROFILE.id}_v1`
const lesData = () => JSON.parse(localStorage.getItem(DATA_KEY))
const knapper = () => screen.getAllByRole('button')
const knapp = (tekst) => knapper().find((b) => b.textContent.trim() === tekst || b.getAttribute('aria-label') === tekst)
const klikk = (tekst) => {
  const b = knapp(tekst)
  if (!b) throw new Error(`Fant ikke knapp «${tekst}». Knapper: ${knapper().map((x) => x.textContent.trim() || x.getAttribute('aria-label')).join(', ')} | ${document.body.textContent.slice(0, 300)}`)
  fireEvent.click(b)
}
const helTime = (task) => task.form === 'vis' || /:00$/.test(task.kjent || '')

// Svar riktig eller galt på oppgaven som står nå.
function svar(task, riktig) {
  if (task.form === 'vis') {
    klikk(knapp('➡️ Neste') ? '➡️ Neste' : '🏁 Se resultat')
    return
  }
  if (task.form === 'valg') {
    const valg = riktig ? task.answer : task.options.find((o) => o !== task.answer)
    klikk(String(valg))
  } else if (task.form === 'valgklokke') {
    const valg = riktig ? task.options.find((o) => o.value === task.answer) : task.options.find((o) => o.value !== task.answer)
    const el = screen.getAllByTestId('klokke').find((k) => k.getAttribute('data-tid') === `${valg.h}:${valg.m}`)
    fireEvent.click(el.closest('button'))
  } else if (task.form === 'still') {
    const h = riktig ? task.answer.h : ((task.answer.h + 1) % 12) + 1 // to timer unna, utenfor toleransen
    klikk(`time ${h}`)
    klikk(`minutt ${task.answer.m}`)
    klikk('✓ Ferdig')
  } else throw new Error(`ukjent form ${task.form}`)
}

describe('Z4: klokka, barn som bare kan hele timer', () => {
  beforeEach(() => {
    localStorage.clear()
    fanget.tasks.length = 0
    vi.useFakeTimers()
    const d = emptyData()
    d.historier = HISTORIER.map((h) => h.id)
    localStorage.setItem('barnelaering_aktiv_profil_v1', JSON.stringify(GUEST_PROFILE))
    localStorage.setItem(DATA_KEY, JSON.stringify(d))
  })
  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('plasseres på nivå 1 eller 2, får prøver om nivåets eget innhold, og ingen oppgave to ganger', () => {
    render(
      <StarProvider>
        <KlokkeStige go={() => {}} />
      </StarProvider>,
    )
    let runder = 0
    while (!screen.queryByTestId('funnet') && runder < 40) {
      const task = fanget.tasks[fanget.tasks.length - 1]
      const riktig = helTime(task)
      svar(task, riktig)
      if (!riktig) {
        // Andre forsøk etter «prøv igjen»-pausen: svar riktig, så oppdraget går videre.
        act(() => vi.advanceTimersByTime(1300))
        svar(task, true)
      }
      if (task.form !== 'vis') {
        const neste = knapp('➡️ Neste') || knapp('🏁 Se resultat')
        if (!neste) throw new Error(`Ingen Neste etter ${task.form}/${task.type} (${task.prompt})`)
        fireEvent.click(neste)
      }
      runder++
    }
    const funnet = screen.getByTestId('funnet').textContent
    expect(funnet).toMatch(/nivå [12]!/)
    const d = lesData()
    expect([1, 2]).toContain(d.fag.klokke.nivaa)
    expect(d.fag.klokke.plassert).toBe(true)
    // Prøvene over nivå 2 handlet om halve timer eller kvarter, ikke hele timer.
    const prover = fanget.tasks.filter((t) => t.tag === 'plassering' && t.form !== 'vis' && t.nivaa >= 3)
    expect(prover.length).toBeGreaterThan(0)
    for (const p of prover) expect(p.kjent).not.toMatch(/:00$/)
    // Ingen oppgave to ganger.
    const prompts = fanget.tasks.filter((t) => t.form !== 'vis').map((t) => `${t.prompt}|${JSON.stringify(t.visual || null)}|${JSON.stringify(t.answer)}`)
    expect(new Set(prompts).size).toBe(prompts.length)
    // Klokka er ute av kunnskapslaget (AA, valg A): oppdraget åpner med vis + spørsmål om det samme.
    expect(fanget.tasks[0].form).toBe('vis')
    expect(fanget.tasks[1].kjent).toBe(fanget.tasks[0].kjent)
  })
})
