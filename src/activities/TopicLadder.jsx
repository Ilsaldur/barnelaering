import { TopBar, Mascot } from '../components/ui.jsx'
import { useStars } from '../StarContext.jsx'
import { recommendedIndex } from '../progress.js'
import { sound } from '../sound.js'

// Nivåstigen for ett tema. Mestring lagres i profilen (synkes til skyen), og
// appen anbefaler neste nivå ut fra hvordan det har gått («Anbefalt»-merket).
export default function TopicLadder({ topic, go, onOpenLevel }) {
  const { best } = useStars()
  const topicBest = best[topic.id] || {}

  const recommended = recommendedIndex(topic, best)

  // "Nådd" = nivåer man har jobbet seg fram til (låst opp i rekkefølge).
  const isReached = (idx) => idx === 0 || (topicBest[idx - 1] || 0) > 0

  // Alle nivåer kan spilles – også de man ikke har "nådd" ennå (fri prøving).
  function play(idx) {
    sound.click()
    onOpenLevel(topic.id, idx)
  }

  const doneCount = topic.levels.filter((_, i) => (topicBest[i] || 0) > 0).length

  return (
    <div className="animate-pop-in">
      <TopBar title={`${topic.title} ${topic.emoji}`} onHome={go} />

      <div className="flex justify-center my-3">
        <Mascot
          message={
            recommended < 0
              ? 'Du har mestret hele temaet! 🌈'
              : `Jeg anbefaler nivå ${recommended + 1} nå! 🎯`
          }
        />
      </div>

      <div className="space-y-3 max-w-xl mx-auto">
        {topic.levels.map((lvl, idx) => {
          const reached = isReached(idx)
          const bestStars = topicBest[idx] || 0
          const active = reached || bestStars > 0
          const isRecommended = idx === recommended
          return (
            <button
              key={idx}
              onClick={() => play(idx)}
              className={`w-full kid-btn p-4 md:p-5 flex items-center gap-4 hover:scale-[1.02] ${
                active ? `${topic.color} text-white` : 'bg-white/70 text-slate-500'
              } ${isRecommended ? 'ring-4 ring-amber-300' : ''}`}
            >
              <span className="text-2xl md:text-3xl font-extrabold w-12 shrink-0">
                {bestStars > 0 ? '⭐'.repeat(bestStars) : active ? `N${idx + 1}` : '🔓'}
              </span>
              <span className="flex-1 text-left">
                <span className="block text-xl md:text-2xl font-extrabold">Nivå {idx + 1}</span>
                <span className="block text-sm md:text-base opacity-95">{lvl.sub}</span>
              </span>
              <span className="text-lg md:text-xl font-bold shrink-0">
                {isRecommended ? (
                  <span className="bg-amber-400 text-white text-sm md:text-base px-3 py-1 rounded-full shadow">
                    🎯 Anbefalt
                  </span>
                ) : bestStars > 0 ? (
                  ''
                ) : active ? (
                  '▶️'
                ) : (
                  'Prøv'
                )}
              </span>
            </button>
          )
        })}
      </div>

      <p className="text-center text-white/90 font-bold mt-5 drop-shadow">
        Klart {doneCount} av {topic.levels.length} nivåer
      </p>
    </div>
  )
}
