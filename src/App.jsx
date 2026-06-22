import { useState } from 'react'
import { StarProvider } from './StarContext.jsx'
import { LEVELS } from './data/levels.js'
import { ENGINES } from './activities/engines.js'
import Home from './activities/Home.jsx'
import LevelMenu from './activities/LevelMenu.jsx'
import Rewards from './activities/Rewards.jsx'
import AdventureMap from './activities/AdventureMap.jsx'

// Bakgrunner for de faste skjermene.
const HOME_BG = 'from-sky-400 via-fuchsia-400 to-amber-300'
const MAP_BG = 'from-cyan-400 via-sky-400 to-emerald-300'
const REWARDS_BG = 'from-yellow-300 via-amber-400 to-orange-400'

export default function App() {
  // Enkel navigasjon uten router: { view, levelId?, activityId? }
  const [nav, setNav] = useState({ view: 'home' })

  const level = LEVELS.find((l) => l.id === nav.levelId) || null
  const activity = level?.activities.find((a) => a.id === nav.activityId) || null

  const goHome = () => setNav({ view: 'home' })
  const openLevel = (levelId) => setNav({ view: 'level', levelId })
  const openActivity = (activityId) => setNav({ view: 'activity', levelId: nav.levelId, activityId })
  const backToLevel = () => setNav({ view: 'level', levelId: nav.levelId })

  // Motorene kaller go('home') for "tilbake" – send dem til nivåmenyen.
  const engineGo = (dest) => (dest === 'home' ? backToLevel() : goHome())

  let bg = HOME_BG
  let content = null

  if (nav.view === 'level' && level) {
    bg = level.gradient
    content = <LevelMenu level={level} onHome={goHome} onPick={openActivity} />
  } else if (nav.view === 'activity' && activity) {
    bg = level.gradient
    const Engine = ENGINES[activity.engine]
    content = Engine ? (
      <Engine go={engineGo} config={activity.config} />
    ) : (
      <div className="text-white font-bold p-8 text-center">Ukjent aktivitet 🤔</div>
    )
  } else if (nav.view === 'rewards') {
    bg = REWARDS_BG
    content = <Rewards go={goHome} />
  } else if (nav.view === 'map') {
    bg = MAP_BG
    content = <AdventureMap go={goHome} />
  } else {
    content = (
      <Home
        levels={LEVELS}
        onPick={openLevel}
        onRewards={() => setNav({ view: 'rewards' })}
        onMap={() => setNav({ view: 'map' })}
      />
    )
  }

  return (
    <StarProvider>
      <div className={`min-h-screen w-full bg-gradient-to-br ${bg} transition-colors duration-500`}>
        <div className="max-w-5xl mx-auto p-3 md:p-6">{content}</div>
      </div>
    </StarProvider>
  )
}
