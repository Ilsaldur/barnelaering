// @vitest-environment jsdom
// Etappe P1 «i appen»: før svaret finnes ikke landets navn i alt, title eller
// aria-label på flaggbildene. Etter svaret vises navnet.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { StarProvider } from '../../StarContext.jsx'
import { TaskCard } from '../../activities/Oppdrag.jsx'
import { genGeo } from '../../lib/geo/generatorer.js'
import { seeded } from '../../lib/rng.js'
import { LAND } from '../../data/geo/land.js'

afterEach(cleanup)
const navn = LAND.map((l) => l.navn)
function roeper(img) {
  const tekster = [img.getAttribute('alt'), img.getAttribute('title'), img.getAttribute('aria-label')].filter(Boolean)
  return tekster.some((t) => navn.includes(t))
}

describe('flagg i oppgaver', () => {
  it('«Hvilket land har dette flagget?»: nøytral tekst før svaret, navnet etter', () => {
    const task = { ...genGeo('flagg_land', { region: 'norden' }, seeded(3)), nivaa: 1, svarform: 'valg' }
    render(
      <StarProvider>
        <TaskCard task={task} onDone={() => {}} index={0} total={1} fag="geografi" />
      </StarProvider>,
    )
    const img = screen.getByRole('img', { name: 'flagg' })
    expect(roeper(img)).toBe(false)
    fireEvent.click(screen.getAllByRole('button').find((b) => b.textContent.trim() === task.answer))
    expect(screen.getByRole('img', { name: task.answer })).toBeTruthy()
  })
  it('«Hvilket flagg er … sitt?»: svaralternativene røper ikke navnene før svaret', () => {
    const task = { ...genGeo('land_flagg', { region: 'norden' }, seeded(4)), nivaa: 1, svarform: 'valg' }
    render(
      <StarProvider>
        <TaskCard task={task} onDone={() => {}} index={0} total={1} fag="geografi" />
      </StarProvider>,
    )
    const bilder = screen.getAllByRole('img')
    expect(bilder.length).toBe(4)
    for (const img of bilder) expect(roeper(img)).toBe(false)
    fireEvent.click(bilder.find((img) => img.getAttribute('src') === `/flagg/${task.answer}.svg`).closest('button'))
    expect(screen.getAllByRole('img').some((img) => img.getAttribute('alt') === task.optionFlagg[task.answer])).toBe(true)
  })
})
