import { StarCounter } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

const CARDS = [
  { id: 'math', title: 'Matte', emoji: '🔢', color: 'bg-rose-500', desc: 'Pluss og gange' },
  { id: 'geography', title: 'Land og flagg', emoji: '🌍', color: 'bg-emerald-500', desc: 'Hovedsteder' },
  { id: 'clock', title: 'Klokka', emoji: '🕐', color: 'bg-indigo-500', desc: 'Hva er klokka?' },
  { id: 'patterns', title: 'Mønster', emoji: '🔺', color: 'bg-orange-500', desc: 'Sortér og dra' },
  { id: 'words', title: 'Ord og bilder', emoji: '🔤', color: 'bg-violet-500', desc: 'Finn riktig ord' },
  { id: 'rewards', title: 'Mine stjerner', emoji: '🏆', color: 'bg-amber-500', desc: 'Klistremerker' },
]

export default function Home({ go }) {
  const { stars, unlocked } = useStars()
  return (
    <div className="animate-pop-in">
      <div className="flex justify-end mb-2">
        <StarCounter />
      </div>

      <header className="text-center mb-6">
        <div className="text-7xl md:text-8xl animate-bouncey mb-2">🦊</div>
        <h1 className="text-white font-extrabold text-4xl md:text-6xl drop-shadow-lg">
          Selmas Skole
        </h1>
        <p className="text-white/95 font-bold text-xl md:text-2xl mt-2">
          Velg hva du vil gjøre 👇
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {CARDS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              sound.click()
              go(c.id)
            }}
            className={`kid-btn ${c.color} text-white p-5 md:p-8 flex flex-col items-center gap-2 hover:scale-105`}
          >
            <span className="text-6xl md:text-7xl">{c.emoji}</span>
            <span className="text-2xl md:text-3xl font-extrabold">{c.title}</span>
            <span className="text-base md:text-lg font-semibold opacity-95">{c.desc}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 bg-white/90 rounded-3xl p-4 text-center shadow-lg">
        <p className="text-lg md:text-xl font-bold text-slate-700">
          Du har samlet <span className="text-amber-500">{stars} ⭐</span> og{' '}
          <span className="text-fuchsia-500">{unlocked.length}</span> klistremerker!
        </p>
        {unlocked.length > 0 && (
          <p className="text-3xl mt-1">{unlocked.map((u) => u.emoji).join(' ')}</p>
        )}
      </div>
    </div>
  )
}
