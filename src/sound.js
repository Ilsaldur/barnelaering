// Enkel lydmotor basert på Web Audio API.
// Lager alle lyder i nettleseren – ingen lydfiler trengs, fungerer uten internett.

let ctx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  // Nettlesere "pauser" lyd til brukeren har klikket – vekk den igjen.
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Spill én tone.
function tone(freq, start, duration, { type = 'sine', volume = 0.25 } = {}) {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + start)
  gain.gain.setValueAtTime(0.0001, ac.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(volume, ac.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + duration + 0.05)
}

// Spill en rekke toner (melodi).
function melody(notes, opts) {
  let t = 0
  for (const n of notes) {
    tone(n.f, t, n.d, opts)
    t += n.d
  }
}

export const sound = {
  // Et lite "klikk" når man trykker.
  click() {
    tone(520, 0, 0.08, { type: 'triangle', volume: 0.18 })
  },
  // Glad, stigende melodi for riktig svar.
  correct() {
    melody(
      [
        { f: 523, d: 0.12 }, // C5
        { f: 659, d: 0.12 }, // E5
        { f: 784, d: 0.18 }, // G5
      ],
      { type: 'triangle', volume: 0.3 },
    )
  },
  // Vennlig, lav "prøv igjen"-lyd (ikke skummel!).
  wrong() {
    tone(300, 0, 0.18, { type: 'sine', volume: 0.22 })
    tone(220, 0.16, 0.25, { type: 'sine', volume: 0.22 })
  },
  // Stor fanfare når man fullfører eller får mange stjerner.
  fanfare() {
    melody(
      [
        { f: 523, d: 0.14 },
        { f: 659, d: 0.14 },
        { f: 784, d: 0.14 },
        { f: 1046, d: 0.28 },
        { f: 784, d: 0.14 },
        { f: 1046, d: 0.4 },
      ],
      { type: 'triangle', volume: 0.32 },
    )
  },
  // "Pling" når man får en stjerne.
  star() {
    tone(880, 0, 0.1, { type: 'triangle', volume: 0.28 })
    tone(1318, 0.08, 0.18, { type: 'triangle', volume: 0.28 })
  },
}
