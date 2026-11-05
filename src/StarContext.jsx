import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { sound } from './sound.js'
import { supabase } from './lib/supabase.js'

// Profil- og fremgangssystem for hele appen.
//  - Hvert barn har en profil (lokal "gjest" eller barneprofil i skyen).
//  - Per profil lagres: stjerner, mestring per nivå, aktivitetslogg og hagen.
//  - Alt lagres lokalt først; med innlogget forelder synkes det til Supabase.
// Gamle komponenter bruker fortsatt `useStars()` – samme API som før, pluss mer.
const StarContext = createContext(null)

const ACTIVE_KEY = 'barnelaering_aktiv_profil_v1'
const LEGACY_STARS_KEY = 'barnelaering_belonning_v1'

export const GUEST_PROFILE = { id: 'lokal', name: 'Gjest', emoji: '🦊', local: true }

// Klistremerker som låses opp etter hvert som man samler stjerner.
export const STICKERS = [
  { id: 'frog', emoji: '🐸', name: 'Frosken Frida', need: 3 },
  { id: 'cat', emoji: '🐱', name: 'Katten Kos', need: 6 },
  { id: 'rocket', emoji: '🚀', name: 'Raketten', need: 10 },
  { id: 'unicorn', emoji: '🦄', name: 'Enhjørningen', need: 15 },
  { id: 'dino', emoji: '🦕', name: 'Dino', need: 22 },
  { id: 'rainbow', emoji: '🌈', name: 'Regnbuen', need: 30 },
  { id: 'crown', emoji: '👑', name: 'Kronen', need: 40 },
  { id: 'dragon', emoji: '🐉', name: 'Dragen', need: 55 },
]

const EMPTY_DATA = { stars: 0, spent: 0, best: {}, garden: [], log: [], eventyr: {} }

function dataKey(profileId) {
  return `barnelaering_data_${profileId}_v1`
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignorer */
  }
  return fallback
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignorer */
  }
}

// Hent gammel lagring (fra før profiler fantes) inn i gjesteprofilen,
// så ingen mister stjernene sine ved oppgradering.
function migrateLegacyInto(data) {
  const legacy = loadJSON(LEGACY_STARS_KEY, null)
  if (legacy?.stars && legacy.stars > data.stars) data.stars = legacy.stars
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const m = key?.match(/^barnelaering_tema_(.+)_v1$/)
      if (!m) continue
      const old = loadJSON(key, null)
      if (old?.best) {
        const topicId = m[1]
        data.best[topicId] = { ...old.best, ...(data.best[topicId] || {}) }
      }
    }
  } catch {
    /* ignorer */
  }
  return data
}

function loadData(profileId) {
  const data = { ...EMPTY_DATA, ...loadJSON(dataKey(profileId), {}) }
  data.best = data.best || {}
  data.garden = data.garden || []
  data.log = data.log || []
  data.eventyr = data.eventyr || {}
  if (profileId === GUEST_PROFILE.id) migrateLegacyInto(data)
  return data
}

// Slå sammen lokal og sky-lagret fremgang uten å miste noe:
// høyeste stjernetall vinner, mestring celle for celle, logg/hage som union.
function mergeData(a, b) {
  const out = { ...EMPTY_DATA }
  out.stars = Math.max(a.stars || 0, b.stars || 0)
  out.spent = Math.max(a.spent || 0, b.spent || 0)
  out.best = {}
  for (const src of [a.best || {}, b.best || {}]) {
    for (const [topic, levels] of Object.entries(src)) {
      out.best[topic] = out.best[topic] || {}
      for (const [idx, val] of Object.entries(levels)) {
        out.best[topic][idx] = Math.max(out.best[topic][idx] || 0, val)
      }
    }
  }
  const gardenSeen = new Set()
  out.garden = [...(a.garden || []), ...(b.garden || [])].filter((g) => {
    if (gardenSeen.has(g.uid)) return false
    gardenSeen.add(g.uid)
    return true
  })
  const logSeen = new Set()
  out.log = [...(a.log || []), ...(b.log || [])]
    .filter((e) => {
      const k = `${e.t}_${e.topic}_${e.level}`
      if (logSeen.has(k)) return false
      logSeen.add(k)
      return true
    })
    .sort((x, y) => x.t - y.t)
    .slice(-500)
  out.eventyr = {}
  for (const src of [a.eventyr || {}, b.eventyr || {}]) {
    for (const [id, val] of Object.entries(src)) out.eventyr[id] = Math.max(out.eventyr[id] || 0, val)
  }
  return out
}

export function StarProvider({ children }) {
  // Innlogget forelder (Supabase-session) og barneprofilene deres.
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(!supabase)
  const [childProfiles, setChildProfiles] = useState([])

  // Aktiv profil (hvem som spiller nå) og dataene deres.
  const [profile, setProfile] = useState(() => loadJSON(ACTIVE_KEY, null))
  const [data, setData] = useState(() => {
    const p = loadJSON(ACTIVE_KEY, null)
    return p ? loadData(p.id) : { ...EMPTY_DATA }
  })
  const [justEarned, setJustEarned] = useState(0)

  // Hvilket nivå spilles akkurat nå (settes av App) – brukes til logg/mestring.
  const activeLevelRef = useRef(null)
  const syncTimer = useRef(null)

  // ---- Supabase: auth og barneprofiler --------------------------------------
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const refreshChildren = useCallback(async () => {
    if (!supabase || !session) {
      setChildProfiles([])
      return []
    }
    const { data: rows, error } = await supabase
      .from('children')
      .select('id, name, emoji')
      .order('created_at')
    if (error) return []
    setChildProfiles(rows)
    return rows
  }, [session])

  useEffect(() => {
    refreshChildren()
  }, [refreshChildren])

  const addChild = useCallback(
    async (name, emoji) => {
      if (!supabase || !session) return null
      const { data: row, error } = await supabase
        .from('children')
        .insert({ user_id: session.user.id, name, emoji })
        .select()
        .single()
      if (error) return null
      await refreshChildren()
      return row
    },
    [session, refreshChildren],
  )

  const removeChild = useCallback(
    async (childId) => {
      if (!supabase || !session) return
      await supabase.from('children').delete().eq('id', childId)
      try {
        localStorage.removeItem(dataKey(childId))
      } catch {
        /* ignorer */
      }
      await refreshChildren()
    },
    [session, refreshChildren],
  )

  // ---- Synk: hent fra skyen ved profilvalg, dytt (debounced) ved endringer --
  const pushToCloud = useCallback(
    (profileId, payload) => {
      if (!supabase || !session) return
      clearTimeout(syncTimer.current)
      syncTimer.current = setTimeout(() => {
        supabase
          .from('progress')
          .upsert({ child_id: profileId, data: payload, updated_at: new Date().toISOString() })
          .then(() => {})
      }, 1500)
    },
    [session],
  )

  const selectProfile = useCallback(
    async (p) => {
      const local = loadData(p.id)
      setProfile(p)
      saveJSON(ACTIVE_KEY, p)
      setData(local)
      if (!p.local && supabase && session) {
        const { data: row } = await supabase
          .from('progress')
          .select('data')
          .eq('child_id', p.id)
          .maybeSingle()
        const merged = mergeData(local, row?.data || {})
        setData(merged)
        saveJSON(dataKey(p.id), merged)
        pushToCloud(p.id, merged)
      }
    },
    [session, pushToCloud],
  )

  // Ved sidelast med sky-profil: hent og flett inn skyens data når sesjonen
  // er klar (selectProfile kjøres jo bare når man aktivt velger profil).
  const syncedFor = useRef(null)
  useEffect(() => {
    if (!supabase || !session || !profile || profile.local) return
    if (syncedFor.current === profile.id) return
    syncedFor.current = profile.id
    supabase
      .from('progress')
      .select('data')
      .eq('child_id', profile.id)
      .maybeSingle()
      .then(({ data: row }) => {
        setData((local) => {
          const merged = mergeData(local, row?.data || {})
          saveJSON(dataKey(profile.id), merged)
          return merged
        })
      })
  }, [session, profile])

  const signOutProfile = useCallback(() => {
    setProfile(null)
    try {
      localStorage.removeItem(ACTIVE_KEY)
    } catch {
      /* ignorer */
    }
  }, [])

  // Lagre lokalt + synk til skyen hver gang dataene endres.
  useEffect(() => {
    if (!profile) return
    saveJSON(dataKey(profile.id), data)
    if (!profile.local) pushToCloud(profile.id, data)
  }, [data, profile, pushToCloud])

  // ---- Spill-API ------------------------------------------------------------
  const setActiveLevel = useCallback((meta) => {
    activeLevelRef.current = meta
  }, [])

  // n = stjerner tjent (kan være 0). extra = { correct, total } fra runden.
  // Runden logges alltid, også uten stjerner, så statistikken blir riktig.
  const addStars = useCallback((n = 0, extra = null) => {
    const meta = activeLevelRef.current
    setData((d) => {
      const nd = { ...d, stars: d.stars + n }
      const entry = { t: Date.now(), stars: n }
      if (extra) {
        entry.correct = extra.correct
        entry.total = extra.total
      }
      if (meta) {
        entry.topic = meta.topicId
        entry.level = meta.levelIndex
        const topicBest = { ...(d.best[meta.topicId] || {}) }
        topicBest[meta.levelIndex] = Math.max(topicBest[meta.levelIndex] || 0, Math.min(3, n))
        nd.best = { ...d.best, [meta.topicId]: topicBest }
      }
      nd.log = [...d.log, entry].slice(-500)
      return nd
    })
    if (n > 0) {
      setJustEarned(n)
      sound.star()
      setTimeout(() => setJustEarned(0), 1200)
    }
  }, [])

  // Eventyrkartet: et sted gir stjerner bare én gang, og huskes i profilen.
  const completeEventyr = useCallback((placeId, n) => {
    setData((d) => {
      if (d.eventyr?.[placeId]) return d
      return {
        ...d,
        stars: d.stars + n,
        eventyr: { ...(d.eventyr || {}), [placeId]: n },
        log: [...d.log, { t: Date.now(), stars: n, eventyr: placeId }].slice(-500),
      }
    })
    setJustEarned(n)
    sound.star()
    setTimeout(() => setJustEarned(0), 1200)
  }, [])

  // Kjøp til hagen: bruker av saldoen (stjerner minus brukt), aldri av
  // totalsummen – klistremerkene beholder full fremdrift.
  const buyGardenItem = useCallback((item, slot) => {
    let ok = false
    setData((d) => {
      if (d.stars - d.spent < item.cost) return d
      ok = true
      const uid = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`
      return {
        ...d,
        spent: d.spent + item.cost,
        garden: [...d.garden, { uid, id: item.id, slot }],
      }
    })
    return ok
  }, [])

  const reset = useCallback(() => {
    setData({ ...EMPTY_DATA })
  }, [])

  const stars = data.stars
  const unlocked = STICKERS.filter((s) => stars >= s.need)
  const nextSticker = STICKERS.find((s) => stars < s.need) || null

  return (
    <StarContext.Provider
      value={{
        // Gammelt API (brukes av spillmotorene)
        stars,
        addStars,
        reset,
        justEarned,
        unlocked,
        nextSticker,
        // Fremgang og adaptivitet
        data,
        best: data.best,
        log: data.log,
        setActiveLevel,
        // Eventyrkartet
        eventyr: data.eventyr || {},
        completeEventyr,
        // Hagen
        garden: data.garden,
        balance: data.stars - data.spent,
        buyGardenItem,
        // Profiler og konto
        profile,
        selectProfile,
        signOutProfile,
        session,
        authReady,
        childProfiles,
        refreshChildren,
        addChild,
        removeChild,
      }}
    >
      {children}
    </StarContext.Provider>
  )
}

export function useStars() {
  const ctx = useContext(StarContext)
  if (!ctx) throw new Error('useStars må brukes inne i StarProvider')
  return ctx
}
