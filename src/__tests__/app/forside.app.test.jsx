// @vitest-environment jsdom
// Etappe R «i appen»: forsiden har nøyaktig én knapp per fag utenfor Dagens
// økt, med samme navn og ikon som kortet i Dagens økt. Og teksten «åpent for
// fri lek» finnes ikke i koden.
import './setup.js'
import { describe, it, expect, afterEach } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, cleanup, within } from '@testing-library/react'
import { StarProvider } from '../../StarContext.jsx'
import Home from '../../activities/Home.jsx'
import { TOPICS } from '../../data/topics.js'

afterEach(cleanup)
const FAG = { matte: ['Matte', '🔢'], lesing: ['Lesing', '📖'], klokke: ['Klokka', '🕐'], geografi: ['Geografi', '🌍'], engelsk: ['Engelsk', '🇬🇧'] }

function tegn() {
  return render(
    <StarProvider>
      <Home topics={TOPICS} onPick={() => {}} onSamling={() => {}} onGarden={() => {}} onParents={() => {}} onSwitchProfile={() => {}} onMatte={() => {}} onLesing={() => {}} onNoetter={() => {}} onDagens={() => {}} onFag={() => {}} />
    </StarProvider>,
  )
}

describe('forsiden', () => {
  it('én knapp per fag utenfor Dagens økt, med samme navn og ikon som kortet', () => {
    const { container } = tegn()
    const dagens = container.querySelector('section')
    const alle = screen.getAllByRole('button')
    const utenfor = alle.filter((b) => !dagens.contains(b))
    for (const [navn, emoji] of Object.values(FAG)) {
      const treff = utenfor.filter((b) => b.textContent.includes(navn))
      expect(treff, navn).toHaveLength(1)
      expect(treff[0].textContent).toContain(emoji)
      // Står faget som kort i Dagens økt, har kortet samme navn og ikon.
      const kort = within(dagens).queryAllByRole('button').filter((b) => b.textContent.includes(navn) && !b.textContent.includes('Overraskelse'))
      for (const k of kort) expect(k.textContent).toContain(emoji)
    }
    expect(utenfor.some((b) => b.textContent.includes('Eventyrkartet'))).toBe(false)
    expect(utenfor.some((b) => b.textContent.includes('stigen'))).toBe(false)
  })
  it('ny profil: fagknappene sier «Ny!»', () => {
    tegn()
    expect(screen.getAllByText('Ny!').length).toBeGreaterThanOrEqual(5)
    expect(screen.getByText(/Velg to av kortene i dag/)).toBeTruthy()
  })
  it('teksten «åpent for fri lek» finnes ikke i koden', () => {
    const filer = []
    const gaa = (dir) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f)
        if (statSync(p).isDirectory()) gaa(p)
        else if (/\.(jsx?|css|html)$/.test(f) && !p.includes('__tests__')) filer.push(p)
      }
    }
    gaa('src')
    for (const f of filer) expect(readFileSync(f, 'utf8').toLowerCase(), f).not.toContain('åpent for fri lek')
  })
})
