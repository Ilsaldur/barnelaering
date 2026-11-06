// Opplesing. Hele appen går gjennom `speech.speak(text)`.
//
// Standard er nettleserens norske stemme (Web Speech API, nb-NO). Egne
// lydopptak kan kobles på senere med `speech.setProvider(fn)` uten at noe
// annet i appen må endres: fn(text) returnerer true hvis den tok jobben.

const AUTO_KEY = 'barnelaering_tale_auto_v1'

let voices = []
let provider = null
const listeners = new Set()

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  voices = window.speechSynthesis.getVoices()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
}

// Finn beste norske stemme. Faller tilbake på dansk/svensk og til slutt
// standardstemmen.
function pickVoice(lang) {
  if (!voices.length) refreshVoices()
  const by = (pred) => voices.find(pred)
  if (lang && !lang.toLowerCase().startsWith('nb') && !lang.toLowerCase().startsWith('no')) {
    const base = lang.toLowerCase().split('-')[0]
    return by((v) => v.lang?.toLowerCase() === lang.toLowerCase()) || by((v) => v.lang?.toLowerCase().startsWith(base)) || null
  }
  return (
    by((v) => v.lang?.toLowerCase().startsWith('nb')) ||
    by((v) => v.lang?.toLowerCase().startsWith('no')) ||
    by((v) => v.lang?.toLowerCase().startsWith('nn')) ||
    by((v) => v.lang?.toLowerCase().startsWith('da')) ||
    by((v) => v.lang?.toLowerCase().startsWith('sv')) ||
    null
  )
}

function browserSpeak(text, lang) {
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(lang)
  if (voice) u.voice = voice
  u.lang = voice?.lang || lang || 'nb-NO'
  u.rate = lang && !lang.startsWith('nb') ? 0.85 : 0.95
  u.pitch = 1.05
  synth.speak(u)
}

export const speech = {
  supported() {
    return !!provider || (typeof window !== 'undefined' && 'speechSynthesis' in window)
  },

  // Automatisk opplesing av hver oppgave. Av som standard.
  autoEnabled() {
    try {
      return localStorage.getItem(AUTO_KEY) === 'på'
    } catch {
      return false
    }
  },

  // `stille`: appen selv setter verdien (fra profilen); da varsles ingen, så
  // innstillingen ikke blir regnet som «rørt» av en voksen.
  setAuto(on, { stille = false } = {}) {
    const before = this.autoEnabled()
    try {
      localStorage.setItem(AUTO_KEY, on ? 'på' : 'av')
    } catch {
      /* ignorer */
    }
    if (!on) this.stop()
    if (!stille && before !== !!on) for (const fn of listeners) fn(!!on)
  },

  // Få beskjed når automatisk opplesing slås av eller på (lagres i profilen).
  onAutoChange(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  // Les opp tekst. Den eneste veien til stemmen for hele appen.
  // lang: 'nb-NO' (standard) eller f.eks. 'en-GB' for engelske ord.
  speak(text, { lang = 'nb-NO' } = {}) {
    if (!text) return
    const t = String(text).trim()
    if (!t) return
    if (provider && provider(t, lang)) return
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    browserSpeak(t, lang)
  },

  // Les opp bare hvis automatisk opplesing er på.
  auto(text, opts) {
    if (this.autoEnabled()) this.speak(text, opts)
  },

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
  },

  // Bytt stemme (f.eks. egne opptak). fn(text, lang) → true hvis den leste.
  setProvider(fn) {
    provider = typeof fn === 'function' ? fn : null
  },
}
