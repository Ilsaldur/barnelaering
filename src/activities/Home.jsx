import { StarCounter } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { continueSuggestion } from '../progress.js'
import { sound } from '../sound.js'

// Startskjerm: velg tema. Hvert tema har sin egen nivåstige.
export default function Home({ topics, onPick, onRewards, onGarden, onParents, onSwitchProfile, onEventyr }) {
  const { stars, unlocked, profile, log, best } = useStars()

  // Adaptivt: foreslå å fortsette der man slapp, på anbefalt nivå.
  const suggestion = continueSuggestion(log, best)

  return (
    <div className="animate-pop-in">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => {
            sound.click()
            onSwitchProfile()
          }}
          className="bg-white/90 rounded-full px-4 py-2 shadow flex items-center gap-2 text-lg font-extrabold text-slate-600 hover:scale-105 transition-transform"
        >
          <span className="text-2xl">{profile?.emoji || '🦊'}</span>
          {profile?.name || 'Spiller'}
        </button>
        <StarCounter />
      </div>

      <header className="text-center mb-6">
        <div className="text-7xl md:text-8xl animate-bouncey mb-2">🦊</div>
        <h1 className="text-white font-extrabold text-4xl md:text-6xl drop-shadow-lg">Selmas Skole</h1>
        <p className="text-white/95 font-bold text-xl md:text-2xl mt-2">Hva vil du øve på? 👇</p>
      </header>

      {/* Fortsett der du slapp */}
      {suggestion && (
        <button
          onClick={() => {
            sound.click()
            onPick(suggestion.topic.id)
          }}
          className="kid-btn bg-white/95 text-slate-700 w-full p-4 md:p-5 mb-4 flex items-center justify-center gap-3 hover:scale-[1.02]"
        >
          <span className="text-4xl md:text-5xl">▶️</span>
          <span className="text-left">
            <span className="block text-xl md:text-2xl font-extrabold">Fortsett der du slapp!</span>
            <span className="block text-base md:text-lg font-semibold text-slate-500">
              {suggestion.topic.emoji} {suggestion.topic.title} – nivå {suggestion.levelIndex + 1}
            </span>
          </span>
        </button>
      )}

      {/* Temavelger – hvert tema har sin egen nivåstige */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              sound.click()
              onPick(t.id)
            }}
            className={`kid-btn ${t.color} text-white p-4 md:p-6 flex flex-col items-center gap-1 hover:scale-105`}
          >
            <span className="text-5xl md:text-6xl">{t.emoji}</span>
            <span className="text-lg md:text-2xl font-extrabold text-center leading-tight">{t.title}</span>
          </button>
        ))}
      </div>

      {/* Eventyret (samlekategori) – kan skjules via flagg i App.jsx */}
      {onEventyr && (
        <div className="mt-4">
          <button
            onClick={() => {
              sound.click()
              onEventyr()
            }}
            className="kid-btn bg-cyan-500 text-white w-full p-5 md:p-7 flex items-center justify-center gap-3 hover:scale-[1.02]"
          >
            <span className="text-5xl md:text-6xl">🗺️</span>
            <span className="text-left">
              <span className="block text-2xl md:text-3xl font-extrabold">Eventyret</span>
              <span className="block text-base md:text-lg font-semibold opacity-95">Reis gjennom alle kategoriene!</span>
            </span>
          </button>
        </div>
      )}

      {/* Hagen og stjernene */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => {
            sound.click()
            onGarden()
          }}
          className="kid-btn bg-emerald-500 text-white p-4 md:p-5 flex items-center justify-center gap-3 hover:scale-[1.02]"
        >
          <span className="text-4xl md:text-5xl">🌷</span>
          <span className="text-xl md:text-3xl font-extrabold">Hagen min</span>
        </button>
        <button
          onClick={() => {
            sound.click()
            onRewards()
          }}
          className="kid-btn bg-amber-500 text-white p-4 md:p-5 flex items-center justify-center gap-3 hover:scale-[1.02]"
        >
          <span className="text-4xl md:text-5xl">🏆</span>
          <span className="text-xl md:text-3xl font-extrabold">Mine stjerner</span>
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

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            sound.click()
            onParents()
          }}
          className="text-white/70 text-sm font-bold underline hover:text-white"
        >
          👨‍👩‍👧 For voksne
        </button>
      </div>
    </div>
  )
}
