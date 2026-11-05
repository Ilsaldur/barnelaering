// Opplesing. Hele appen går gjennom `speech.speak(text)`.
//
// Standard er nettleserens norske stemme (Web Speech API, nb-NO). Egne
// lydopptak kan kobles på senere med `speech.setProvider(fn)` uten at noe
// annet i appen må endres: fn(text) returnerer true hvis den tok jobben.

const AUTO_KEY = 'barnelaering_tale_auto_v1'

let voices = []
let provider = null

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
function pickVoice() {
  if (!voices.length) refreshVoices()
  const by = (pred) => voices.find(pred)
  return (
    by((v) => v.lang?.toLowerCase().startsWith('nb')) ||
    by((v) => v.lang?.toLowerCase().startsWith('no')) ||
    by((v) => v.lang?.toLowerCase().startsWith('nn')) ||
    by((v) => v.lang?.toLowerCase().startsWith('da')) ||
    by((v) => v.lang?.toLowerCase().startsWith('sv')) ||
    null
  )
}

function browserSpeak(text) {
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) u.voice = voice
  u.lang = voice?.lang || 'nb-NO'
  u.rate = 0.95
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

  setAuto(on) {
    try {
      localStorage.setItem(AUTO_KEY, on ? 'på' : 'av')
    } catch {
      /* ignorer */
    }
    if (!on) this.stop()
  },

  // Les opp tekst. Den eneste veien til stemmen for hele appen.
  speak(text) {
    if (!text) return
    const t = String(text).trim()
    if (!t) return
    if (provider && provider(t)) return
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    browserSpeak(t)
  },

  // Les opp bare hvis automatisk opplesing er på.
  auto(text) {
    if (this.autoEnabled()) this.speak(text)
  },

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
  },

  // Bytt stemme (f.eks. egne opptak). fn(text) → true hvis den leste.
  setProvider(fn) {
    provider = typeof fn === 'function' ? fn : null
  },
}
