// Etappe AC (runde 6): uten nett.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { assetsListe, LISTE_FIL } from '../../../build/assetsListe.js'

// Kjør service workeren i en sandkasse med en enkel cache og et nett som kan slås av.
function sandkasse({ liste, nett = true }) {
  const src = readFileSync('public/sw.js', 'utf8')
  const handlers = {}
  const cache = new Map()
  const hentet = []
  const fetchMock = (u) => {
    const url = typeof u === 'string' ? u : u.url
    const sti = url.startsWith('http') ? new URL(url).pathname : url
    hentet.push(sti)
    if (!nett) return Promise.reject(new TypeError('Failed to fetch'))
    if (sti === '/assets-liste.json') return liste ? Promise.resolve({ ok: true, json: async () => liste, clone() { return this } }) : Promise.reject(new TypeError('404'))
    if (sti === '/index.html') return Promise.resolve({ ok: true, text: async () => '<script src="/assets/index-a.js"></script><link href="/assets/index-a.css">', clone() { return this } })
    return Promise.resolve({ ok: true, sti, clone() { return this } })
  }
  const c = {
    addAll: async (xs) => xs.forEach((x) => cache.set(x, { sti: x })),
    add: async (x) => {
      const r = await fetchMock(x)
      cache.set(x, r)
    },
    put: async (k, v) => cache.set(typeof k === 'string' ? k : new URL(k.url).pathname, v),
    match: async (k) => cache.get(typeof k === 'string' ? k : new URL(k.url).pathname),
  }
  const ctx = {
    self: { addEventListener: (n, f) => (handlers[n] = f), skipWaiting: async () => {}, clients: { claim: async () => {} }, location: { origin: 'http://x' } },
    caches: { open: async () => c, keys: async () => [], delete: async () => true, match: (k) => c.match(k) },
    fetch: fetchMock,
    Response: class {
      constructor(b, o) {
        this.b = b
        this.o = o
      }
    },
    URL,
    console,
  }
  vm.createContext(ctx)
  vm.runInContext(src, ctx)
  const kjor = (navn) => {
    let p = Promise.resolve()
    handlers[navn]({ waitUntil: (x) => (p = x) })
    return p
  }
  const hent = (sti) =>
    new Promise((res) => {
      handlers.fetch({ request: { method: 'GET', url: `http://x${sti}`, mode: 'no-cors' }, respondWith: (p) => Promise.resolve(p).then(res, () => res(null)) })
    })
  return { kjor, hent, cache, hentet, nett: (v) => (nett = v) }
}

describe('AC1 – service workeren lagrer alle filene i /assets/', () => {
  it('bygget skriver /assets-liste.json med alle filene i /assets/', () => {
    const p = assetsListe()
    expect(p.apply).toBe('build')
    const emitted = []
    p.generateBundle.call({ emitFile: (f) => emitted.push(f) }, {}, { 'assets/index-a.js': {}, 'assets/GeoStige-b.js': {}, 'index.html': {}, 'assets/index-c.css': {} })
    expect(emitted).toHaveLength(1)
    expect(emitted[0].fileName).toBe(LISTE_FIL)
    expect(JSON.parse(emitted[0].source)).toEqual(['/assets/GeoStige-b.js', '/assets/index-a.js', '/assets/index-c.css'])
  })
  it('ved installasjon lagres alt i lista – også geografi og kartet som aldri har vært åpnet – og uten nett svarer cachen', async () => {
    const liste = ['/assets/GeoStige-b.js', '/assets/VerdensKart-c.js', '/assets/index-a.js', '/assets/index-a.css', '/assets/index-supabase.js']
    const s = sandkasse({ liste })
    await s.kjor('install')
    for (const f of liste) expect(s.cache.has(f), f).toBe(true)
    await s.kjor('activate')
    // Nettet forsvinner. Geografi åpnes for første gang: delen hentes fra cachen.
    s.nett(false)
    const svar = await s.hent('/assets/GeoStige-b.js')
    expect(svar).toBeTruthy()
    expect(svar.sti).toBe('/assets/GeoStige-b.js')
    expect(await s.hent('/assets/VerdensKart-c.js')).toBeTruthy()
  })
  it('mangler lista, brukes filene index.html peker på', async () => {
    const s = sandkasse({ liste: null })
    await s.kjor('install')
    expect(s.cache.has('/assets/index-a.js')).toBe(true)
    expect(s.cache.has('/assets/index-a.css')).toBe(true)
  })
  it('index.html i dist peker bare på filer som står i lista (etter bygg)', () => {
    let html
    let liste
    try {
      html = readFileSync('dist/index.html', 'utf8')
      liste = JSON.parse(readFileSync('dist/assets-liste.json', 'utf8'))
    } catch {
      return // ikke bygget her
    }
    const filer = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
    for (const f of filer) expect(liste).toContain(f)
    expect(liste.some((f) => /GeoStige/.test(f))).toBe(true)
  })
})
