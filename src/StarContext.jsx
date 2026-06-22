import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { sound } from './sound.js'

// Belønningssystem: stjerner og klistremerker samles på tvers av alle aktiviteter.
const StarContext = createContext(null)

const STORAGE_KEY = 'barnelaering_belonning_v1'

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

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignorer */
  }
  return { stars: 0 }
}

export function StarProvider({ children }) {
  const [stars, setStars] = useState(() => load().stars || 0)
  const [justEarned, setJustEarned] = useState(0) // for animasjon

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stars }))
    } catch {
      /* ignorer */
    }
  }, [stars])

  const addStars = useCallback((n = 1) => {
    setStars((s) => s + n)
    setJustEarned(n)
    sound.star()
    setTimeout(() => setJustEarned(0), 1200)
  }, [])

  const reset = useCallback(() => setStars(0), [])

  const unlocked = STICKERS.filter((s) => stars >= s.need)
  const nextSticker = STICKERS.find((s) => stars < s.need) || null

  return (
    <StarContext.Provider
      value={{ stars, addStars, reset, justEarned, unlocked, nextSticker }}
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
