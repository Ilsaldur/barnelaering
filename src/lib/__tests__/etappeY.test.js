// Etappe Y (runde 5): småfeil.
import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { applyResult } from '../matte/stige.js'
import { emptyFag } from '../profil.js'

describe('Y1 – hele stigen klart', () => {
  it('8 av 8 fire ganger på toppnivået gir meldingen én gang, og faget husker det', () => {
    let fag = { ...emptyFag(), nivaa: 38, plassert: true }
    const meldinger = []
    for (let i = 0; i < 4; i++) {
      const r = applyResult(fag, { correct: 8, total: 8, nivaa: 38 }, 38)
      if (r.events.toppKlart) meldinger.push(i)
      fag = r.fag
    }
    expect(meldinger).toEqual([1])
    expect(fag.toppKlart).toBe(true)
    expect(fag.nivaa).toBe(38)
  })
})

describe('Y3 – service workeren', () => {
  it('er aktiv før flaggene er hentet: install og activate venter ikke på /flagg/', async () => {
    const src = readFileSync('public/sw.js', 'utf8')
    const handlers = {}
    const lagret = []
    const cache = {
      addAll: async (xs) => lagret.push(...xs),
      add: async (x) => lagret.push(x),
      put: async () => {},
      match: async () => undefined,
    }
    let flaggVenter = 0
    const fetchMock = (u) => {
      if (String(u).startsWith('/flagg/')) {
        flaggVenter++
        return new Promise(() => {}) // svarer aldri (dårlig nett)
      }
      return Promise.resolve({ ok: true, text: async () => '<script src="/assets/a.js"></script>', clone() { return this } })
    }
    const ctx = {
      self: { addEventListener: (n, f) => (handlers[n] = f), skipWaiting: async () => {}, clients: { claim: async () => {} }, location: { origin: 'http://x' } },
      caches: { open: async () => cache, keys: async () => ['gammel'], delete: async () => true, match: async () => undefined },
      fetch: fetchMock,
      Response: class { constructor(b, o) { this.b = b; this.o = o } },
      URL,
      console,
    }
    vm.createContext(ctx)
    vm.runInContext(src, ctx)
    const vent = (navn) => {
      let p = Promise.resolve()
      handlers[navn]({ waitUntil: (x) => (p = x) })
      return p
    }
    await Promise.race([vent('install'), new Promise((_, rej) => setTimeout(() => rej(new Error('install henger')), 500))])
    expect(lagret).toContain('/assets/a.js')
    await Promise.race([vent('activate'), new Promise((_, rej) => setTimeout(() => rej(new Error('activate henger')), 500))])
    // Arbeideren er aktiv (begge løftene løst) selv om flaggene aldri kom.
    await new Promise((r) => setTimeout(r, 20))
    expect(flaggVenter).toBeGreaterThan(0)
  })
})

describe('Y4 – supabase lastes lat', () => {
  it('klienten er null uten nøkler, ellers en lat klient med samme form', async () => {
    const mod = await import('../supabase.js')
    if (mod.supabase === null) expect(await mod.hentSupabase()).toBeNull()
    else {
      expect(typeof mod.supabase.from).toBe('function')
      expect(typeof mod.supabase.rpc).toBe('function')
      expect(typeof mod.supabase.auth.getSession).toBe('function')
      const { data } = mod.supabase.auth.onAuthStateChange(() => {})
      expect(typeof data.subscription.unsubscribe).toBe('function')
      data.subscription.unsubscribe()
    }
  })
  it('hovedpakken importerer ikke supabase-js direkte', () => {
    const src = readFileSync('src/lib/supabase.js', 'utf8')
    expect(src).toMatch(/import\('@supabase\/supabase-js'\)/)
    expect(src).not.toMatch(/^import .*@supabase/m)
    const app = readFileSync('src/App.jsx', 'utf8')
    expect(app).toMatch(/lazy\(\(\) => import\('\.\/activities\/GeoStige\.jsx'\)\)/)
  })
})
