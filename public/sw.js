// Service worker for Selmas skole: lagrer appskallet så appen starter uten nett
// etter første besøk. Hashede filer i /assets/ caches først (de endrer seg
// aldri), sider hentes fra nettet først med cachet index.html som reserve.
const CACHE = 'selmas-skole-v5'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']
const LISTE = '/assets-liste.json' // skrives ved bygging: alle filene i /assets/

// Ved installasjon: lagre skallet og alle filene i /assets/ (runde 6, etappe
// AC) – også dem som lastes først når de trengs (geografi, kartet, Supabase),
// så de virker uten nett selv om de aldri har vært åpnet. Lista skrives ved
// bygging; mangler den, brukes filene index.html peker på.
async function hentSkall() {
  const c = await caches.open(CACHE)
  await c.addAll(SHELL)
  try {
    const res = await fetch('/index.html', { cache: 'no-cache' })
    const html = await res.text()
    await c.put('/index.html', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))
    let filer = []
    try {
      filer = await (await fetch(LISTE, { cache: 'no-cache' })).json()
      if (!Array.isArray(filer)) filer = []
    } catch {
      filer = []
    }
    if (!filer.length) filer = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
    await Promise.all(filer.map((f) => c.add(f).catch(() => {})))
  } catch {
    /* uten nett ved installasjon: skallet fylles ved neste besøk */
  }
}

// Alle flaggene, så flaggoppgavene virker uten nett. Hentes etter at
// arbeideren er aktiv, så appen er klar uten nett etter noen sekunder også
// på dårlig nett. Flagg som ikke rakk å bli hentet, lagres når de brukes.
async function hentFlagg() {
  try {
    const c = await caches.open(CACHE)
    const liste = await (await fetch('/flagg/liste.json', { cache: 'no-cache' })).json()
    await c.add('/flagg/liste.json').catch(() => {})
    for (const k of liste) if (!(await c.match(`/flagg/${k}.svg`))) await c.add(`/flagg/${k}.svg`).catch(() => {})
  } catch {
    /* uten nett: prøves ved neste aktivering */
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(hentSkall().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        hentFlagg() // ikke ventet på: arbeideren er aktiv før flaggene er hentet
      }),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // Supabase, fonter o.l. går rett ut

  // Navigasjon: nett først, så cachet index.html.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('/index.html', copy))
          return res
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }

  // Hashede ressurser og ikoner: cache først, ellers hent og lagre.
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/flagg/') || SHELL.includes(url.pathname))) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        }),
    ),
  )
})
