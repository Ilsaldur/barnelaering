import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { sound } from './sound.js'
import { speech } from './speech.js'
import { supabase } from './lib/supabase.js'
import { emptyData, normalize, mergeData, todayKey } from './lib/profil.js'

// Profil- og fremgangssystem for hele appen.
//  - En voksen logger inn (e-postlenke). Barna er profiler under den voksne.
//  - Per profil lagres én JSON (se src/lib/profil.js) lokalt først, og synkes
//    til Supabase når det er nett. Mister vi nettet, ligger endringene i kø og
//    sendes når nettet er tilbake. Fletting gjør at ingenting går tapt.
//  - Uten innlogging finnes gjesteprofilen «Bare spill!» (bare lokal).
const StarContext = createContext(null)

const ACTIVE_KEY = 'barnelaering_aktiv_profil_v1'
const CHILDREN_KEY = 'barnelaering_barn_v1'
const DIRTY_KEY = 'barnelaering_usynket_v1'
const LEGACY_STARS_KEY = 'barnelaering_belonning_v1'

export const GUEST_PROFILE = { id: 'lokal', name: 'Gjest', emoji: '🦊', local: true }

// Klistremerker (erstattes av samlekort i etappe 4, beholdes så lenge).
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

// Hent gammel lagring (fra før profiler fantes) inn i gjesteprofilen.
function migrateLegacyInto(data) {
  const legacy = loadJSON(LEGACY_STARS_KEY, null)
  if (legacy?.stars && legacy.stars > data.stars) data.stars = legacy.stars
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const m = key?.match(/^barnelaering_tema_(.+)_v1$/)
      if (!m) continue
      const old = loadJSON(key, null)
      if (old?.best) data.best[m[1]] = { ...old.best, ...(data.best[m[1]] || {}) }
    }
  } catch {
    /* ignorer */
  }
  return data
}

export function loadLocalData(profileId) {
  const data = normalize(loadJSON(dataKey(profileId), {}))
  if (profileId === GUEST_PROFILE.id) migrateLegacyInto(data)
  return data
}

function loadDirty() {
  return new Set(loadJSON(DIRTY_KEY, []))
}
function saveDirty(set) {
  saveJSON(DIRTY_KEY, [...set])
}

export function StarProvider({ children }) {
  // Innlogget forelder (Supabase-session) og barneprofilene deres.
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(!supabase)
  const [childProfiles, setChildProfiles] = useState(() => loadJSON(CHILDREN_KEY, []))
  const [onLine, setOnLine] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [syncState, setSyncState] = useState('lokal') // lokal | synket | venter | frakoblet

  // Aktiv profil (hvem som spiller nå) og dataene deres.
  const [profile, setProfile] = useState(() => loadJSON(ACTIVE_KEY, null))
  const [data, setData] = useState(() => {
    const p = loadJSON(ACTIVE_KEY, null)
    return p ? loadLocalData(p.id) : emptyData()
  })
  const [justEarned, setJustEarned] = useState(0)

  // Data for andre barn (til voksensiden).
  const [childrenData, setChildrenData] = useState({})

  const activeLevelRef = useRef(null) // { topicId, levelIndex, fag, nivaa, startedAt }
  const flushTimer = useRef(null)
  const sessionRef = useRef(null)
  sessionRef.current = session

  // ---- Nett av/på -----------------------------------------------------------
  useEffect(() => {
    const up = () => setOnLine(true)
    const down = () => setOnLine(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  // ---- Supabase: auth -------------------------------------------------------
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      setAuthReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const refreshChildren = useCallback(async () => {
    if (!supabase || !session) {
      if (!session) {
        setChildProfiles([])
        saveJSON(CHILDREN_KEY, [])
      }
      return []
    }
    const { data: rows, error } = await supabase.from('children').select('id, name, emoji').order('created_at')
    if (error) return childProfiles
    setChildProfiles(rows)
    saveJSON(CHILDREN_KEY, rows)
    return rows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    if (!authReady) return
    refreshChildren()
  }, [refreshChildren, authReady])

  const addChild = useCallback(
    async (name, emoji) => {
      if (!supabase || !session) return null
      const { data: row, error } = await supabase.from('children').insert({ user_id: session.user.id, name, emoji }).select().single()
      if (error) return null
      await refreshChildren()
      return row
    },
    [session, refreshChildren],
  )

  const removeChild = useCallback(
    async (childId) => {
      if (!supabase || !session) return
      await supabase.from('progress').delete().eq('child_id', childId)
      await supabase.from('children').delete().eq('id', childId)
      try {
        localStorage.removeItem(dataKey(childId))
      } catch {
        /* ignorer */
      }
      setChildrenData((m) => {
        const n = { ...m }
        delete n[childId]
        return n
      })
      await refreshChildren()
    },
    [session, refreshChildren],
  )

  // ---- Synk ----------------------------------------------------------------
  // Alt lagres lokalt med én gang. Profiler med usendte endringer står i en
  // «usynket»-liste som tømmes når vi har nett og innlogging.
  const flush = useCallback(async () => {
    if (!supabase || !sessionRef.current) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSyncState('frakoblet')
      return
    }
    const dirty = loadDirty()
    if (dirty.size === 0) {
      setSyncState('synket')
      return
    }
    setSyncState('venter')
    for (const id of dirty) {
      if (id === GUEST_PROFILE.id) {
        dirty.delete(id)
        continue
      }
      const payload = loadJSON(dataKey(id), null)
      if (!payload) {
        dirty.delete(id)
        continue
      }
      const { error } = await supabase.from('progress').upsert({ child_id: id, data: payload, updated_at: new Date().toISOString() })
      if (error) {
        saveDirty(dirty)
        setSyncState(navigator.onLine ? 'venter' : 'frakoblet')
        return
      }
      dirty.delete(id)
      saveDirty(dirty)
    }
    setSyncState('synket')
  }, [])

  const scheduleFlush = useCallback(
    (delay = 1500) => {
      clearTimeout(flushTimer.current)
      flushTimer.current = setTimeout(() => flush(), delay)
    },
    [flush],
  )

  const markDirty = useCallback(
    (id) => {
      if (id === GUEST_PROFILE.id) return
      const dirty = loadDirty()
      dirty.add(id)
      saveDirty(dirty)
      scheduleFlush()
    },
    [scheduleFlush],
  )

  // Når nettet eller fanen kommer tilbake: send det som ligger i kø.
  useEffect(() => {
    if (onLine) scheduleFlush(300)
    else setSyncState(session ? 'frakoblet' : 'lokal')
  }, [onLine, session, scheduleFlush])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') scheduleFlush(300)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [scheduleFlush])

  // Hent sky-utgaven av en profil og flett den med den lokale.
  const pullAndMerge = useCallback(async (profileId) => {
    const local = loadLocalData(profileId)
    if (!supabase || !sessionRef.current || profileId === GUEST_PROFILE.id) return local
    const { data: row, error } = await supabase.from('progress').select('data').eq('child_id', profileId).maybeSingle()
    if (error) return local
    const merged = mergeData(local, row?.data || {})
    saveJSON(dataKey(profileId), merged)
    return merged
  }, [])

  const selectProfile = useCallback(
    async (p) => {
      setProfile(p)
      saveJSON(ACTIVE_KEY, p)
      setData(loadLocalData(p.id))
      if (!p.local) {
        const merged = await pullAndMerge(p.id)
        setData(merged)
        markDirty(p.id)
      }
    },
    [pullAndMerge, markDirty],
  )

  // Ved sidelast med sky-profil: flett inn skyens data når sesjonen er klar.
  const syncedFor = useRef(null)
  useEffect(() => {
    if (!supabase || !session || !profile || profile.local) return
    if (syncedFor.current === profile.id) return
    syncedFor.current = profile.id
    pullAndMerge(profile.id).then((merged) => {
      setData((local) => {
        const m = mergeData(local, merged)
        saveJSON(dataKey(profile.id), m)
        return m
      })
      markDirty(profile.id)
    })
  }, [session, profile, pullAndMerge, markDirty])

  const signOutProfile = useCallback(() => {
    setProfile(null)
    syncedFor.current = null
    try {
      localStorage.removeItem(ACTIVE_KEY)
    } catch {
      /* ignorer */
    }
  }, [])

  // Lagre lokalt og legg i synk-kø hver gang dataene endres.
  const firstRender = useRef(true)
  useEffect(() => {
    if (!profile) return
    saveJSON(dataKey(profile.id), data)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!profile.local) markDirty(profile.id)
  }, [data, profile, markDirty])

  // ---- Opplesing følger profilen -------------------------------------------
  useEffect(() => {
    if (!profile) return
    speech.setAuto(!!data.settings?.autoSpeak)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  useEffect(() => {
    return speech.onAutoChange((on) => {
      setData((d) => (d.settings?.autoSpeak === on ? d : { ...d, settings: { ...d.settings, autoSpeak: on, updatedAt: Date.now() } }))
    })
  }, [])

  // ---- Spill-API ------------------------------------------------------------
  const setActiveLevel = useCallback((meta) => {
    activeLevelRef.current = meta ? { ...meta, startedAt: Date.now() } : null
  }, [])

  // n = stjerner tjent (kan være 0). extra = { correct, total, fag, nivaa, oppdrag }.
  // Runden logges alltid, også uten stjerner, med tiden den tok. Er det et
  // oppdrag (fra mattestigen eller «Dagens økt»), telles det på dagen.
  const addStars = useCallback((n = 0, extra = null) => {
    const meta = activeLevelRef.current
    const erOppdrag = !!(extra?.oppdrag || meta?.oppdrag)
    const fagId = extra?.fag || meta?.fag || null
    setData((d) => {
      const nd = { ...d, stars: d.stars + n }
      const entry = { t: Date.now(), stars: n }
      if (extra) {
        if (extra.correct != null) entry.correct = extra.correct
        if (extra.total != null) entry.total = extra.total
        if (extra.fag) entry.fag = extra.fag
        if (extra.nivaa != null) entry.nivaa = extra.nivaa
      }
      if (erOppdrag) {
        entry.oppdrag = true
        const key = todayKey()
        const dag = d.dager[key] || { oppdrag: 0, fag: {} }
        nd.dager = { ...d.dager, [key]: { oppdrag: (dag.oppdrag || 0) + 1, fag: { ...(dag.fag || {}), ...(fagId ? { [fagId]: ((dag.fag || {})[fagId] || 0) + 1 } : {}) } } }
      }
      if (meta) {
        if (meta.topicId) {
          entry.topic = meta.topicId
          entry.level = meta.levelIndex
          const topicBest = { ...(d.best[meta.topicId] || {}) }
          topicBest[meta.levelIndex] = Math.max(topicBest[meta.levelIndex] || 0, Math.min(3, n))
          nd.best = { ...d.best, [meta.topicId]: topicBest }
        }
        if (meta.fag && !entry.fag) entry.fag = meta.fag
        entry.ms = Math.min(60 * 60 * 1000, Date.now() - (meta.startedAt || Date.now()))
      }
      nd.log = [...d.log, entry].slice(-500)
      return nd
    })
    if (meta) activeLevelRef.current = { ...meta, startedAt: Date.now() }
    if (n > 0) {
      setJustEarned(n)
      sound.star()
      setTimeout(() => setJustEarned(0), 1200)
    }
  }, [])

  // Ett enkeltsvar (til statistikk og svake oppgavetyper).
  const recordAttempt = useCallback((a) => {
    setData((d) => ({ ...d, attempts: [...d.attempts, { t: Date.now(), ...a }].slice(-2000) }))
  }, [])

  // Oppdater et fag (nivå, rekker, bokser …). fn(fag) → nytt fag.
  const updateFag = useCallback((fagId, fn) => {
    setData((d) => {
      const cur = d.fag[fagId]
      const next = typeof fn === 'function' ? fn(cur) : { ...cur, ...fn }
      return { ...d, fag: { ...d.fag, [fagId]: { ...next, updatedAt: Date.now() } } }
    })
  }, [])

  const updateSettings = useCallback((partial) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...partial, updatedAt: Date.now() } }))
  }, [])

  // Samlekort: legg til et kort (én gang).
  const giKort = useCallback((id) => {
    setData((d) => (d.kort.includes(id) ? d : { ...d, kort: [...d.kort, id] }))
  }, [])

  // Kostymer: kjøp av saldoen, og ta på/av.
  const buyKostyme = useCallback((k) => {
    let ok = false
    setData((d) => {
      if (d.kostymer.includes(k.id)) {
        ok = true
        return d
      }
      if (d.stars - d.spent < k.pris) return d
      ok = true
      return { ...d, spent: d.spent + k.pris, kostymer: [...d.kostymer, k.id], kostyme: k.id, kostymeT: Date.now() }
    })
    return ok
  }, [])
  const setKostyme = useCallback((id) => {
    setData((d) => ({ ...d, kostyme: id, kostymeT: Date.now() }))
  }, [])

  // Historiebit sett.
  const markHistorie = useCallback((id) => {
    setData((d) => (d.historier.includes(id) ? d : { ...d, historier: [...d.historier, id] }))
  }, [])

  // Eventyrkartet: et sted gir stjerner bare én gang.
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

  // Kjøp til hagen: bruker av saldoen (stjerner minus brukt).
  const buyGardenItem = useCallback((item, slot) => {
    let ok = false
    setData((d) => {
      if (d.stars - d.spent < item.cost) return d
      ok = true
      const uid = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`
      return { ...d, spent: d.spent + item.cost, garden: [...d.garden, { uid, id: item.id, slot, t: Date.now() }] }
    })
    return ok
  }, [])

  // Generell oppdatering (brukes av samling, kostymer m.m.).
  const updateData = useCallback((fn) => {
    setData((d) => fn(d))
  }, [])

  const reset = useCallback(() => {
    setData((d) => {
      const fresh = emptyData()
      fresh.settings = { ...d.settings, updatedAt: Date.now() }
      for (const f of Object.keys(fresh.fag)) fresh.fag[f].updatedAt = Date.now()
      return fresh
    })
  }, [])

  // ---- Andre barn (voksensiden) ---------------------------------------------
  const loadChildData = useCallback(
    async (childId) => {
      if (profile && childId === profile.id) return data
      const d = await pullAndMerge(childId)
      setChildrenData((m) => ({ ...m, [childId]: d }))
      return d
    },
    [profile, data, pullAndMerge],
  )

  const updateChildData = useCallback(
    (childId, fn) => {
      if (profile && childId === profile.id) {
        setData((d) => fn(d))
        return
      }
      const cur = childrenData[childId] || loadLocalData(childId)
      const next = fn(cur)
      saveJSON(dataKey(childId), next)
      setChildrenData((m) => ({ ...m, [childId]: next }))
      markDirty(childId)
    },
    [profile, childrenData, markDirty],
  )

  // Familiekisten: summen av alle barnas stjerner (egne profiler på enheten,
  // eller alle barna i familiekontoen).
  const [familyOthers, setFamilyOthers] = useState({})
  const loadFamily = useCallback(async () => {
    const out = {}
    if (supabase && sessionRef.current) {
      const { data: rows } = await supabase.from('progress').select('child_id, data')
      for (const r of rows || []) out[r.child_id] = r.data?.stars || 0
    }
    for (const c of childProfiles) {
      const local = loadJSON(dataKey(c.id), null)
      if (local && (out[c.id] || 0) < (local.stars || 0)) out[c.id] = local.stars || 0
    }
    setFamilyOthers(out)
    return out
  }, [childProfiles])
  const familyStars = (() => {
    let sum = 0
    for (const [id, n] of Object.entries(familyOthers)) if (!profile || id !== profile.id) sum += n
    return sum + data.stars
  })()

  const stars = data.stars
  const unlocked = STICKERS.filter((s) => stars >= s.need)
  const nextSticker = STICKERS.find((s) => stars < s.need) || null

  return (
    <StarContext.Provider
      value={{
        // Stjerner (brukes av spillmotorene)
        stars,
        addStars,
        reset,
        justEarned,
        unlocked,
        nextSticker,
        // Fremgang
        data,
        best: data.best,
        log: data.log,
        setActiveLevel,
        recordAttempt,
        fag: data.fag,
        updateFag,
        settings: data.settings,
        updateSettings,
        updateData,
        giKort,
        buyKostyme,
        setKostyme,
        markHistorie,
        familyStars,
        loadFamily,
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
        childrenData,
        loadChildData,
        updateChildData,
        // Synk
        onLine,
        syncState,
        flush,
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

// Samme, men gir null utenfor StarProvider (til små komponenter som Mascot).
export function useStarsOptional() {
  return useContext(StarContext)
}
