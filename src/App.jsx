import { useEffect, useState } from 'react'
import { StarProvider, useStars } from './StarContext.jsx'
import { TOPICS, topicById } from './data/topics.js'
import { ENGINES } from './activities/engines.js'
import Home from './activities/Home.jsx'
import TopicLadder from './activities/TopicLadder.jsx'
import MatteStige from './activities/MatteStige.jsx'
import Noettehula from './activities/Noettehula.jsx'
import LeseStige from './activities/LeseStige.jsx'
import Personvern from './activities/Personvern.jsx'
import Samling from './activities/Samling.jsx'
import Clock from './activities/Clock.jsx'
import Geography from './activities/Geography.jsx'
import { recommendedIndex } from './progress.js'
import Garden from './activities/Garden.jsx'
import Parents from './activities/Parents.jsx'
import Family from './activities/Family.jsx'

// Bakgrunner for de faste skjermene.
const HOME_BG = 'from-sky-400 via-fuchsia-400 to-amber-300'
const TOPIC_BG = 'from-sky-400 via-violet-400 to-fuchsia-400'
const SAMLING_BG = 'from-yellow-300 via-amber-400 to-orange-400'
const GARDEN_BG = 'from-sky-400 via-emerald-300 to-green-400'
const PARENTS_BG = 'from-slate-500 via-slate-400 to-sky-400'
const MATTE_BG = 'from-sky-400 via-indigo-400 to-fuchsia-400'

function AppInner() {
  // Enkel navigasjon uten router.
  const [nav, setNav] = useState({ view: 'home' })
  const { profile, setActiveLevel, signOutProfile, best } = useStars()

  const goHome = () => setNav({ view: 'home' })
  const openTopic = (topicId) => setNav({ view: 'topic', topicId })
  const openLevel = (topicId, levelIndex) => setNav({ view: 'level', topicId, levelIndex })
  const backToTopic = () => setNav({ view: 'topic', topicId: nav.topicId })

  // Fortell profilen hvilket nivå som spilles nå (for logg, mestring og
  // adaptivitet). Nullstilles når man går ut av nivået.
  useEffect(() => {
    if (nav.view === 'level') setActiveLevel({ topicId: nav.topicId, levelIndex: nav.levelIndex })
    else if (nav.view === 'matte') setActiveLevel({ fag: 'matte' })
    else if (nav.view === 'lesing') setActiveLevel({ fag: 'lesing' })
    else if (nav.view === 'noetter') setActiveLevel({ fag: 'nott', oppdrag: !!nav.oppdrag })
    else if (nav.view === 'dagens') setActiveLevel({ fag: nav.fag, oppdrag: true, topicId: nav.fag, levelIndex: nav.levelIndex })
    else setActiveLevel(null)
  }, [nav, setActiveLevel])

  // Personvernsiden kan åpnes både før og etter profilvalg.
  if (nav.view === 'personvern') {
    return (
      <div className={`min-h-screen w-full bg-gradient-to-br ${PARENTS_BG} transition-colors duration-500`}>
        <div className="max-w-3xl mx-auto p-3 md:p-6">
          <Personvern go={() => setNav({ view: nav.from || 'home' })} />
        </div>
      </div>
    )
  }

  // Ingen aktiv profil → velg hvem som skal spille.
  if (!profile) {
    return (
      <div className={`min-h-screen w-full bg-gradient-to-br ${HOME_BG} transition-colors duration-500`}>
        <div className="max-w-5xl mx-auto p-3 md:p-6">
          <Family onPicked={goHome} onPrivacy={() => setNav({ view: 'personvern', from: 'home' })} />
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
  } else if (nav.view === 'dagens') {
    // Dagens økt: klokke eller geografi på anbefalt nivå, teller som oppdrag.
    bg = TOPIC_BG
    const topic = topicById(nav.fag)
    const lvl = topic?.levels[nav.levelIndex]
    content =
      nav.fag === 'klokke' && lvl ? (
        <Clock go={goHome} config={lvl.config} />
      ) : nav.fag === 'geografi' && lvl ? (
        <Geography go={goHome} config={lvl.config} />
      ) : (
        <div className="text-white font-bold p-8 text-center">Ukjent oppdrag 🤔</div>
      )
  } else if (nav.view === 'matte') {
    bg = MATTE_BG
    content = <MatteStige go={goHome} onNoetter={() => setNav({ view: 'noetter' })} />
  } else if (nav.view === 'lesing') {
    bg = 'from-violet-400 via-fuchsia-400 to-rose-300'
    content = <LeseStige go={goHome} />
  } else if (nav.view === 'noetter') {
    bg = 'from-amber-600 via-orange-500 to-yellow-400'
    content = <Noettehula go={goHome} />
  } else if (nav.view === 'samling') {
    bg = SAMLING_BG
    content = <Samling go={goHome} onGarden={() => setNav({ view: 'garden' })} />
  } else if (nav.view === 'garden') {
    bg = GARDEN_BG
    content = <Garden go={goHome} />
  } else if (nav.view === 'parents') {
    bg = PARENTS_BG
    content = <Parents go={goHome} onSwitchProfile={signOutProfile} onPrivacy={() => setNav({ view: 'personvern', from: 'parents' })} />
  } else {
    content = (
      <Home
        topics={TOPICS}
        onPick={openTopic}
        onSamling={() => setNav({ view: 'samling' })}
        onGarden={() => setNav({ view: 'garden' })}
        onParents={() => setNav({ view: 'parents' })}
        onSwitchProfile={signOutProfile}
        onMatte={() => setNav({ view: 'matte' })}
        onNoetter={() => setNav({ view: 'noetter' })}
        onLesing={() => setNav({ view: 'lesing' })}
        onDagens={(fag) => {
          if (fag === 'nott') return setNav({ view: 'noetter', oppdrag: true })
          if (fag === 'lesing') return setNav({ view: 'lesing' })
          const topic = topicById(fag)
          const idx = topic ? Math.max(0, recommendedIndex(topic, best)) : 0
          setNav({ view: 'dagens', fag, levelIndex: idx })
        }}
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
