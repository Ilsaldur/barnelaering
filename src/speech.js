// Opplesing med nettleserens innebygde talesyntese (Web Speech API).
// Viktig for de minste som ikke kan lese ennå. Ingen nettverk/API-nøkler.

const STORAGE_KEY = 'barnelaering_tale_v1'

let voices = []

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  voices = window.speechSynthesis.getVoices()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
}

// Finn beste norske stemme. Faller tilbake på dansk/svensk (nært nok for barn)
// og til slutt standardstemmen.
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

export const speech = {
  supported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  },

  enabled() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'av'
    } catch {
      return true
    }
  },

  setEnabled(on) {
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'på' : 'av')
    } catch {
      /* ignorer */
    }
    if (!on) this.stop()
  },

  // Les opp tekst (hvis skrudd på). `force` leser selv om bryteren er av,
  // brukes av den manuelle 🔊-knappen.
  speak(text, { force = false } = {}) {
    if (!this.supported() || !text) return
    if (!force && !this.enabled()) return
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const voice = pickVoice()
    if (voice) u.voice = voice
    u.lang = voice?.lang || 'nb-NO'
    u.rate = 0.95
    u.pitch = 1.05
    synth.speak(u)
  },

  stop() {
    if (this.supported()) window.speechSynthesis.cancel()
  },
}
