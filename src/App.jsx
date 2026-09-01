import { useEffect, useState } from 'react'
import { StarProvider, useStars } from './StarContext.jsx'
import { TOPICS, topicById } from './data/topics.js'
import { stageByKey, resolveActivity } from './data/campaign.js'
import { ENGINES } from './activities/engines.js'
import Home from './activities/Home.jsx'
import TopicLadder from './activities/TopicLadder.jsx'
import Campaign from './activities/Campaign.jsx'
import Rewards from './activities/Rewards.jsx'
import Garden from './activities/Garden.jsx'
import Parents from './activities/Parents.jsx'
import Family from './activities/Family.jsx'

// Bakgrunner for de faste skjermene.
const HOME_BG = 'from-sky-400 via-fuchsia-400 to-amber-300'
const TOPIC_BG = 'from-sky-400 via-violet-400 to-fuchsia-400'
const REWARDS_BG = 'from-yellow-300 via-amber-400 to-orange-400'
const GARDEN_BG = 'from-sky-400 via-emerald-300 to-green-400'
const PARENTS_BG = 'from-slate-500 via-slate-400 to-sky-400'
const EVENTYR_BG = 'from-cyan-400 via-sky-400 to-emerald-300'

// Eventyrkartet er satt på vent: koden beholdes, men skjules fra forsiden.
// Sett til true for å vise det igjen.
const SHOW_EVENTYR = false

function AppInner() {
  // Enkel navigasjon uten router.
  const [nav, setNav] = useState({ view: 'home' })
  const { profile, setActiveLevel, signOutProfile } = useStars()

  const goHome = () => setNav({ view: 'home' })
  const openTopic = (topicId) => setNav({ view: 'topic', topicId })
  const openLevel = (topicId, levelIndex) => setNav({ view: 'level', topicId, levelIndex })
  const backToTopic = () => setNav({ view: 'topic', topicId: nav.topicId })

  // Eventyr-baner (skjult): åpne aktivitet, "tilbake" går til eventyrkartet.
  const openStage = (key) => setNav({ view: 'stage', stageKey: key })
  const backToEventyr = () => setNav({ view: 'eventyr' })

  // Fortell profilen hvilket nivå som spilles nå (for logg, mestring og
  // adaptivitet). Nullstilles når man går ut av nivået.
  useEffect(() => {
    if (nav.view === 'level') setActiveLevel({ topicId: nav.topicId, levelIndex: nav.levelIndex })
    else setActiveLevel(null)
  }, [nav, setActiveLevel])

  // Ingen aktiv profil → velg hvem som skal spille.
  if (!profile) {
    return (
      <div className={`min-h-screen w-full bg-gradient-to-br ${HOME_BG} transition-colors duration-500`}>
        <div className="max-w-5xl mx-auto p-3 md:p-6">
          <Family onPicked={goHome} />
        </div>
      </div>
    )
  }

  let bg = HOME_BG
  let content = null

  if (nav.view === 'topic') {
    bg = TOPIC_BG
    const topic = topicById(nav.topicId)
    content = topic ? (
      <TopicLadder topic={topic} go={goHome} onOpenLevel={openLevel} />
    ) : (
      <div className="text-white font-bold p-8 text-center">Ukjent tema 🤔</div>
    )
  } else if (nav.view === 'level') {
    bg = TOPIC_BG
    const topic = topicById(nav.topicId)
    const lvl = topic?.levels[nav.levelIndex]
    const Engine = lvl ? ENGINES[lvl.engine] : null
    const hasNext = topic && nav.levelIndex + 1 < topic.levels.length
    content = Engine ? (
      <Engine
        go={backToTopic}
        config={lvl.config}
        onNextLevel={hasNext ? () => openLevel(nav.topicId, nav.levelIndex + 1) : undefined}
      />
    ) : (
      <div className="text-white font-bold p-8 text-center">Ukjent nivå 🤔</div>
    )
  } else if (nav.view === 'eventyr') {
    bg = EVENTYR_BG
    content = <Campaign go={goHome} onOpenStage={openStage} />
  } else if (nav.view === 'stage') {
    bg = EVENTYR_BG
    const stage = stageByKey(nav.stageKey)
    const stageActivity = stage ? resolveActivity(stage.stage) : null
    const Engine = stageActivity ? ENGINES[stageActivity.engine] : null
    content = Engine ? (
      <Engine go={backToEventyr} config={stageActivity.config} />
    ) : (
      <div className="text-white font-bold p-8 text-center">Ukjent bane 🤔</div>
    )
  } else if (nav.view === 'rewards') {
    bg = REWARDS_BG
    content = <Rewards go={goHome} />
  } else if (nav.view === 'garden') {
    bg = GARDEN_BG
    content = <Garden go={goHome} />
  } else if (nav.view === 'parents') {
    bg = PARENTS_BG
    content = <Parents go={goHome} onSwitchProfile={signOutProfile} />
  } else {
    content = (
      <Home
        topics={TOPICS}
        onPick={openTopic}
        onRewards={() => setNav({ view: 'rewards' })}
        onGarden={() => setNav({ view: 'garden' })}
        onParents={() => setNav({ view: 'parents' })}
        onSwitchProfile={signOutProfile}
        onEventyr={SHOW_EVENTYR ? () => setNav({ view: 'eventyr' }) : undefined}
      />
    )
  }

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${bg} transition-colors duration-500`}>
      <div className="max-w-5xl mx-auto p-3 md:p-6">{content}</div>
    </div>
  )
}

export default function App() {
  return (
    <StarProvider>
      <AppInner />
    </StarProvider>
  )
}
