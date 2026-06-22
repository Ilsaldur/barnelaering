import { useState } from 'react'
import { StarProvider } from './StarContext.jsx'
import Home from './activities/Home.jsx'
import MathActivity from './activities/Math.jsx'
import Geography from './activities/Geography.jsx'
import Clock from './activities/Clock.jsx'
import Patterns from './activities/Patterns.jsx'
import Words from './activities/Words.jsx'
import Rewards from './activities/Rewards.jsx'

// Enkel skjerm-navigasjon uten ekstra bibliotek.
const SCREENS = {
  home: Home,
  math: MathActivity,
  geography: Geography,
  clock: Clock,
  patterns: Patterns,
  words: Words,
  rewards: Rewards,
}

// Hver skjerm har sin egen glade bakgrunnsfarge.
const BACKGROUNDS = {
  home: 'from-sky-400 via-fuchsia-400 to-amber-300',
  math: 'from-rose-400 via-pink-400 to-orange-300',
  geography: 'from-emerald-400 via-teal-400 to-sky-400',
  clock: 'from-indigo-400 via-purple-400 to-pink-300',
  patterns: 'from-amber-400 via-orange-400 to-rose-400',
  words: 'from-violet-400 via-purple-400 to-fuchsia-400',
  rewards: 'from-yellow-300 via-amber-400 to-orange-400',
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const Screen = SCREENS[screen]
  const go = (name) => setScreen(name)

  return (
    <StarProvider>
      <div
        className={`min-h-screen w-full bg-gradient-to-br ${BACKGROUNDS[screen]} transition-colors duration-500`}
      >
        <div className="max-w-5xl mx-auto p-3 md:p-6">
          <Screen go={go} />
        </div>
      </div>
    </StarProvider>
  )
}
