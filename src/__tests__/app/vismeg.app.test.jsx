// @vitest-environment jsdom
// Etappe T4 «i appen»: «👀 Vis meg» på en flaggoppgave viser riktig flagg med
// navn, og oppgaven telles ikke. Og en vis-oppgave har én knapp og teller riktig.
import './setup.js'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider } from '../../StarContext.jsx'
import { TaskCard } from '../../activities/Oppdrag.jsx'
import { genGeo } from '../../lib/geo/generatorer.js'
import { tilVis } from '../../lib/kunnskap.js'
import { seeded } from '../../lib/rng.js'

afterEach(cleanup)

describe('kunnskapsoppgaver i appen', () => {
  it('«👀 Vis meg» viser flagget med navn, og oppgaven telles ikke', () => {
    const task = { ...genGeo('flagg_land', { region: 'norden' }, seeded(3)), nivaa: 1, svarform: 'valg' }
    const onDone = vi.fn()
    render(
      <StarProvider>
        <TaskCard task={task} onDone={onDone} index={0} total={1} fag="geografi" />
      </StarProvider>,
    )
    fireEvent.click(screen.getByText('👀 Vis meg'))
    const panel = screen.getByTestId('vis-meg')
    expect(panel.textContent).toContain(`Dette er flagget til ${task.answer}`)
    expect(panel.querySelector('img').getAttribute('alt')).toBe(task.answer)
    fireEvent.click(screen.getAllByRole('button').find((b) => b.textContent.trim() === task.answer))
    fireEvent.click(screen.getByText(/Se resultat|Neste/))
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onDone.mock.calls[0][0]).toMatchObject({ ok: true, hjelp: true })
  })
  it('en vis-oppgave har bare «Neste» og teller som riktig', () => {
    const q = { ...genGeo('flagg_land', { region: 'norden' }, seeded(4)), nivaa: 1, svarform: 'valg' }
    const vis = tilVis(q)
    const onDone = vi.fn()
    render(
      <StarProvider>
        <TaskCard task={vis} onDone={onDone} fag="geografi" />
      </StarProvider>,
    )
    expect(screen.getByTestId('vis-oppgave').textContent).toContain(`Dette er flagget til ${q.answer}`)
    expect(screen.getByRole('img').getAttribute('alt')).toBe(q.answer)
    expect(screen.queryByText('👀 Vis meg')).toBeNull()
    fireEvent.click(screen.getByText('➡️ Neste'))
    expect(onDone.mock.calls[0][0]).toMatchObject({ ok: true, forste: true, hjelp: false, vis: true })
  })
})
