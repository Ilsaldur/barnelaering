import { useState } from 'react'
import { TopBar, Mascot, Confetti } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

// Selmas hage: her BRUKER man stjernene sine på ting til sin egen hage.
// Å bygge noe eget er en sterkere motivasjon enn poeng alene – og siden bare
// saldoen brukes (aldri totalsummen), mister man ingen klistremerke-fremdrift.

export const GARDEN_ITEMS = [
  { id: 'flower1', emoji: '🌷', name: 'Tulipan', cost: 2 },
  { id: 'flower2', emoji: '🌻', name: 'Solsikke', cost: 3 },
  { id: 'mushroom', emoji: '🍄', name: 'Sopp', cost: 3 },
  { id: 'butterfly', emoji: '🦋', name: 'Sommerfugl', cost: 4 },
  { id: 'bush', emoji: '🌳', name: 'Tre', cost: 5 },
  { id: 'duck', emoji: '🦆', name: 'And', cost: 6 },
  { id: 'rabbit', emoji: '🐰', name: 'Kanin', cost: 7 },
  { id: 'turtle', emoji: '🐢', name: 'Skilpadde', cost: 8 },
  { id: 'fountain', emoji: '⛲', name: 'Fontene', cost: 10 },
  { id: 'pony', emoji: '🐴', name: 'Hest', cost: 12 },
  { id: 'house', emoji: '🏠', name: 'Lekehus', cost: 15 },
  { id: 'rainbow', emoji: '🌈', name: 'Regnbue', cost: 20 },
  { id: 'castle', emoji: '🏰', name: 'Slott', cost: 30 },
  { id: 'dragon', emoji: '🐉', name: 'Hagedrage', cost: 40 },
]

const itemById = (id) => GARDEN_ITEMS.find((i) => i.id === id)

// Faste "plasser" i hagen (prosent-koordinater), så tingene fordeler seg fint.
const SLOTS = [
  [8, 62], [22, 74], [36, 60], [50, 78], [64, 62], [78, 74], [90, 64],
  [14, 84], [30, 90], [46, 66], [58, 88], [72, 92], [86, 84], [6, 92],
  [40, 82], [66, 72], [94, 90], [18, 66], [52, 92], [82, 60], [28, 78], [60, 76],
]

export default function Garden({ go }) {
  const { garden, balance, buyGardenItem } = useStars()
  const [confetti, setConfetti] = useState(false)
  const [wiggling, setWiggling] = useState(null)
  const [message, setMessage] = useState(null)

  function freeSlot() {
    const used = new Set(garden.map((g) => g.slot))
    const open = SLOTS.map((_, i) => i).filter((i) => !used.has(i))
    if (open.length === 0) return Math.floor(Math.random() * SLOTS.length)
    return open[Math.floor(Math.random() * open.length)]
  }

  function buy(item) {
    if (balance < item.cost) {
      sound.wrong()
      setMessage(`Du trenger ${item.cost - balance} stjerner til for ${item.name.toLowerCase()}! 💪`)
      return
    }
    const ok = buyGardenItem(item, freeSlot())
    if (ok) {
      sound.fanfare()
      setConfetti(true)
      setMessage(`${item.emoji} ${item.name} flyttet inn i hagen din!`)
      setTimeout(() => setConfetti(false), 2000)
    }
  }

  function poke(uid) {
    sound.click()
    setWiggling(uid)
    setTimeout(() => setWiggling(null), 700)
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title="Hagen min 🌷" onHome={go} />

      <div className="flex justify-center mb-3">
        <Mascot
          message={
            message ||
            (garden.length === 0
              ? 'Bruk stjernene dine og bygg din egen hage! 🌱'
              : `Så fin hagen din er! Du har ${garden.length} ting.`)
          }
        />
      </div>

      {/* Selve hagen */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-72 md:h-96 bg-gradient-to-b from-sky-300 via-sky-200 to-green-300">
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-green-300 to-green-500" />
        <span className="absolute top-3 right-5 text-5xl md:text-6xl animate-wiggle">☀️</span>
        <span className="absolute top-6 left-6 text-4xl opacity-90">☁️</span>
        <span className="absolute top-12 left-1/2 text-3xl opacity-80">☁️</span>
        {garden.map((g) => {
          const item = itemById(g.id)
          const [x, y] = SLOTS[g.slot % SLOTS.length]
          if (!item) return null
          return (
            <button
              key={g.uid}
              onClick={() => poke(g.uid)}
              className={`absolute text-4xl md:text-6xl drop-shadow-lg hover:scale-110 transition-transform ${
                wiggling === g.uid ? 'animate-bouncey' : ''
              }`}
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -80%)' }}
            >
              {item.emoji}
            </button>
          )
        })}
        {garden.length === 0 && (
          <p className="absolute inset-x-0 bottom-6 text-center text-white font-extrabold text-xl drop-shadow">
            Hagen er tom … enn så lenge! 🌱
          </p>
        )}
      </div>

      {/* Butikken */}
      <div className="mt-4 bg-white/90 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-700">🛒 Hagebutikken</h2>
          <span className="bg-amber-100 text-amber-600 font-extrabold rounded-full px-4 py-1 text-lg md:text-xl">
            Du kan bruke: {balance} ⭐
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
          {GARDEN_ITEMS.map((item) => {
            const affordable = balance >= item.cost
            return (
              <button
                key={item.id}
                onClick={() => buy(item)}
                className={`rounded-2xl p-2 md:p-3 flex flex-col items-center shadow transition-transform ${
                  affordable
                    ? 'bg-emerald-50 hover:scale-105 hover:bg-emerald-100'
                    : 'bg-slate-100 opacity-60'
                }`}
              >
                <span className="text-3xl md:text-4xl">{item.emoji}</span>
                <span className="text-xs md:text-sm font-bold text-slate-600">{item.name}</span>
                <span
                  className={`text-sm font-extrabold ${affordable ? 'text-amber-500' : 'text-slate-400'}`}
                >
                  {item.cost} ⭐
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-center text-sm text-slate-400 font-semibold mt-3">
          Tjen flere stjerner ved å gjøre oppdrag. Samlekortene dine påvirkes ikke av det du kjøper.
        </p>
      </div>
    </div>
  )
}
