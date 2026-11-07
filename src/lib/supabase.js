// Supabase-klient for kontoer og synk. Uten nøkler (f.eks. lokalt uten .env.local)
// blir klienten null og appen fungerer helt fint med bare lokal lagring.
//
// Biblioteket er stort, så det lastes først når noe bruker det (runde 5,
// etappe Y). `supabase` har samme form som før: `supabase.auth.…`,
// `supabase.from(…)…` og `supabase.rpc(…)` kan awaites som vanlig. Kjeden
// spilles av mot den ekte klienten når den er hentet.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

let klientLofte = null
export function hentSupabase() {
  if (!url || !key) return Promise.resolve(null)
  if (!klientLofte) klientLofte = import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key))
  return klientLofte
}

// Spill av en kjede av oppslag og kall mot den ekte klienten.
async function spillAv(ops) {
  let obj = await hentSupabase()
  let val = obj
  for (const op of ops) {
    if ('get' in op) {
      obj = val
      val = val[op.get]
    } else {
      val = val.apply(obj, op.call)
      obj = val
    }
  }
  return val
}

function kjede(ops) {
  const f = function () {}
  return new Proxy(f, {
    get(_, prop) {
      if (prop === 'then') return (res, rej) => spillAv(ops).then(res, rej)
      if (prop === 'catch') return (rej) => spillAv(ops).catch(rej)
      if (prop === 'finally') return (fn) => spillAv(ops).finally(fn)
      return kjede([...ops, { get: prop }])
    },
    apply(_, __, args) {
      return kjede([...ops, { call: args }])
    },
  })
}

function lagLatKlient() {
  const auth = new Proxy(
    {},
    {
      get(_, prop) {
        // onAuthStateChange svarer synkront med et abonnement.
        if (prop === 'onAuthStateChange') {
          return (cb) => {
            let ekte = null
            let avmeldt = false
            hentSupabase().then((k) => {
              if (!k || avmeldt) return
              ekte = k.auth.onAuthStateChange(cb).data.subscription
            })
            return {
              data: {
                subscription: {
                  unsubscribe() {
                    avmeldt = true
                    ekte?.unsubscribe()
                  },
                },
              },
            }
          }
        }
        return (...args) => kjede([{ get: 'auth' }, { get: prop }, { call: args }])
      },
    },
  )
  return {
    auth,
    from: (...args) => kjede([{ get: 'from' }, { call: args }]),
    rpc: (...args) => kjede([{ get: 'rpc' }, { call: args }]),
    channel: (...args) => kjede([{ get: 'channel' }, { call: args }]),
  }
}

export const supabase = url && key ? lagLatKlient() : null
