import { useState } from 'react'
import { TopBar, Mascot } from '../components/ui.jsx'
import RoundDone from '../components/RoundDone.jsx'
import Oppdrag from './Oppdrag.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { GRADER, lagNoetter } from '../lib/matte/noetter.js'
import { starsFor } from '../lib/scoring.js'

// Nøttehula: tenkenøtter i tre grader. Påvirker ikke nivået i mattestigen.
export default function Noettehula({ go }) {
  const { addStars } = useStars()
  const [grad, setGrad] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [result, setResult] = useState(null)

  function start(g) {
    sound.click()
    setGrad(g)
    setTasks(lagNoetter(g.id, 4))
    setResult(null)
  }

  if (result) {
    return (
      <RoundDone correct={result.correct} total={result.total} stars={starsFor(result.correct, result.total)} onAgain={() => start(grad)} againLabel="🌰 Flere nøtter" onHome={go} />
    )
  }

  if (tasks) {
    return (
      <Oppdrag
        tasks={tasks}
        title={`Nøttehula ${grad.emoji}`}
        fag="nott"
        onHome={go}
        onDone={(res) => {
          addStars(starsFor(res.correct, res.total), { correct: res.correct, total: res.total, fag: 'nott' })
          setResult(res)
        }}
      />
    )
  }

  return (
    <div className="animate-pop-in">
      <TopBar title="Nøttehula 🌰" onHome={go} />
      <div className="flex justify-center my-4">
        <Mascot message="Tallmønstre, magiske kvadrater, mini-sudoku og tallgåter. Hvor vanskelig vil du ha det?" />
      </div>
      <div className="grid gap-4 mt-4">
        {GRADER.map((g, i) => (
          <button key={g.id} onClick={() => start(g)} className={`kid-btn ${['bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][i]} text-white p-6 flex items-center gap-4 hover:scale-[1.02]`}>
            <span className="text-5xl">{g.emoji}</span>
            <span className="text-left">
              <span className="block text-3xl font-extrabold">{g.navn}</span>
              <span className="block text-lg opacity-95">Fire nøtter</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
