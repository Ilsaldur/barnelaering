import { useState } from 'react'
import { TopBar, Mascot, Confetti, BigButton } from '../components/ui.jsx'
import { useStars, STICKERS } from '../StarContext.jsx'
import { sound } from '../sound.js'

export default function Rewards({ go }) {
  const { stars, unlocked, nextSticker, reset } = useStars()
  const [confetti, setConfetti] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  function celebrate() {
    sound.fanfare()
    setConfetti(true)
    setTimeout(() => setConfetti(false), 2500)
  }

  return (
    <div className="animate-pop-in">
      <Confetti show={confetti} />
      <TopBar title="Mine stjerner 🏆" onHome={() => go('home')} />

      <div className="bg-white/95 rounded-3xl p-6 shadow-xl text-center">
        <button onClick={celebrate} className="text-8xl animate-bouncey">
          🏆
        </button>
        <p className="text-3xl md:text-4xl font-extrabold text-amber-500 mt-2">{stars} ⭐</p>
        <p className="text-lg text-slate-500">stjerner samlet</p>

        {nextSticker ? (
          <div className="mt-4 bg-amber-50 rounded-2xl p-4">
            <p className="text-lg font-bold text-slate-600">
              Neste klistremerke: <span className="text-2xl">{nextSticker.emoji}</span>{' '}
              {nextSticker.name}
            </p>
            <div className="bg-amber-100 rounded-full h-6 overflow-hidden mt-2">
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stars / nextSticker.need) * 100)}%` }}
              />
            </div>
            <p className="text-base text-slate-500 mt-1">
              Bare {Math.max(0, nextSticker.need - stars)} stjerner igjen!
            </p>
          </div>
        ) : (
          <Mascot mood="cheer" message="Wow! Du har alle klistremerkene! 🌈" />
        )}
      </div>

      <h2 className="text-white font-extrabold text-2xl md:text-3xl text-center mt-6 mb-3 drop-shadow">
        Klistremerkene mine
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {STICKERS.map((s) => {
          const have = unlocked.some((u) => u.id === s.id)
          return (
            <div
              key={s.id}
              className={`rounded-3xl p-3 flex flex-col items-center shadow ${
                have ? 'bg-white animate-pop-in' : 'bg-white/40'
              }`}
            >
              <span className={`text-5xl md:text-6xl ${have ? '' : 'grayscale opacity-40'}`}>
                {have ? s.emoji : '❔'}
              </span>
              <span className="text-sm md:text-base font-bold text-slate-600 mt-1 text-center">
                {have ? s.name : `${s.need} ⭐`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Liten nullstill-knapp for foreldre */}
      <div className="mt-8 text-center">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="text-white/70 text-sm underline"
          >
            (Nullstill stjerner – for voksne)
          </button>
        ) : (
          <div className="flex gap-2 justify-center items-center">
            <span className="text-white font-bold">Sikker?</span>
            <BigButton
              color="bg-rose-500"
              className="!text-lg !py-2 !px-4"
              onClick={() => {
                reset()
                setConfirmReset(false)
                sound.click()
              }}
            >
              Ja, nullstill
            </BigButton>
            <BigButton
              color="bg-slate-400"
              className="!text-lg !py-2 !px-4"
              onClick={() => setConfirmReset(false)}
            >
              Nei
            </BigButton>
          </div>
        )}
      </div>
    </div>
  )
}
