// Service worker for Selmas skole: lagrer appskallet så appen starter uten nett
// etter første besøk. Hashede filer i /assets/ caches først (de endrer seg
// aldri), sider hentes fra nettet først med cachet index.html som reserve.
const CACHE = 'selmas-skole-v3'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']

// Ved installasjon: lagre skallet, og hent skriptene og stilarkene som
// index.html peker på, så appen starter uten nett allerede etter første besøk.
async function hentSkall() {
  const c = await caches.open(CACHE)
  await c.addAll(SHELL)
  try {
    const res = await fetch('/index.html', { cache: 'no-cache' })
    const html = await res.text()
    await c.put('/index.html', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))
    const filer = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
    await Promise.all(filer.map((f) => c.add(f).catch(() => {})))
    // Alle flaggene, så flaggoppgavene virker uten nett etter første besøk.
    const liste = await (await fetch('/flagg/liste.json', { cache: 'no-cache' })).json()
    await c.add('/flagg/liste.json').catch(() => {})
    await Promise.all(liste.map((k) => c.add(`/flagg/${k}.svg`).catch(() => {})))
  } catch {
    /* uten nett ved installasjon: skallet fylles ved neste besøk */
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
      .then(() => self.clients.claim()),
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
