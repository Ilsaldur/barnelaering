import { StarCounter } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'

// Startskjerm: velg nivå (barnehage / klasse), eller gå til stjerner / eventyrkart.
export default function Home({ levels, onPick, onRewards, onMap }) {
  const { stars, unlocked } = useStars()

  return (
    <div className="animate-pop-in">
      <div className="flex justify-end mb-2">
        <StarCounter />
      </div>

      <header className="text-center mb-6">
        <div className="text-7xl md:text-8xl animate-bouncey mb-2">🦊</div>
        <h1 className="text-white font-extrabold text-4xl md:text-6xl drop-shadow-lg">Selmas Skole</h1>
        <p className="text-white/95 font-bold text-xl md:text-2xl mt-2">Hvem er du? 👇</p>
      </header>

      {/* Nivåvelger */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => {
              sound.click()
              onPick(lvl.id)
            }}
            className={`kid-btn ${lvl.color} text-white p-5 md:p-7 flex flex-col items-center gap-1 hover:scale-105`}
          >
            <span className="text-5xl md:text-6xl">{lvl.emoji}</span>
            <span className="text-2xl md:text-3xl font-extrabold">{lvl.title}</span>
            <span className="text-base md:text-lg font-semibold opacity-95">{lvl.age}</span>
          </button>
        ))}
      </div>

      {/* Eventyrkart + stjerner */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4">
        <button
          onClick={() => {
            sound.click()
            onMap()
          }}
          className="kid-btn bg-cyan-500 text-white p-5 md:p-7 flex flex-col items-center gap-1 hover:scale-105"
        >
          <span className="text-5xl md:text-6xl">🗺️</span>
          <span className="text-2xl md:text-3xl font-extrabold">Eventyrkart</span>
          <span className="text-base md:text-lg font-semibold opacity-95">Bruk stemplene dine</span>
        </button>
        <button
          onClick={() => {
            sound.click()
            onRewards()
          }}
          className="kid-btn bg-amber-500 text-white p-5 md:p-7 flex flex-col items-center gap-1 hover:scale-105"
        >
          <span className="text-5xl md:text-6xl">🏆</span>
          <span className="text-2xl md:text-3xl font-extrabold">Mine stjerner</span>
          <span className="text-base md:text-lg font-semibold opacity-95">Klistremerker</span>
        </button>
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
