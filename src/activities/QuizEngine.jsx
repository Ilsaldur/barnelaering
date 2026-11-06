import { useState } from 'react'
import { TopBar, Mascot, BigButton } from '../components/ui.jsx'
import { SpeakButton, useAutoSpeak, AutoSpeakToggle } from '../components/Speak.jsx'
import RoundDone from '../components/RoundDone.jsx'
import { useStars } from '../StarContext.jsx'
import { sound } from '../sound.js'
import { speech } from '../speech.js'
import { starsFor } from '../lib/scoring.js'
import { makeRound } from '../lib/quiz.js'

// Generisk flervalgsquiz drevet av data (config.bank eller config.generator).
// Hvert element: { show?, count?, groups?, caption?, prompt?, answer, options?, say? }
//  - show:     stor emoji/bokstav som vises
//  - count:    vis `show` så mange ganger (for telling)
//  - groups:   [{ emoji, count }] – to mengder side om side (mer/mindre)
//  - caption:  liten tekst under bildet (f.eks. ordet)
//  - prompt:   spørsmålstekst (faller tilbake på config.prompt)
//  - answer:   riktig svar (tekst)
//  - options:  faste svaralternativer. Mangler de, lages de fra de andre svarene.
//  - say:      egen opplesingstekst
//
// Config for de som ikke leser:
//  - pictureOptions: true   → alternativene vises som bildet (`show`) til svaret
//  - optionPictures: {}     → oppslag svar → emoji som vises på knappen
//  - readOptions: true      → alternativene leses opp sammen med spørsmålet

// Teksten som leses opp for en oppgave.
function spokenText(item, config) {
  if (item.say) return item.say
  const parts = [item.prompt || config.prompt || '']
  if (item.caption) parts.push(item.caption)
  if (config.readOptions && item._options) {
    const names = item._options.map((o) => (config.optionSay ? config.optionSay[o.value] || o.value : o.value))
    parts.push(`Er det ${names.slice(0, -1).join(', ')} eller ${names[names.length - 1]}?`)
  }
  return parts.filter(Boolean).join('. ')
}

export default function QuizEngine({ go, config, onNextLevel }) {
  const { addStars } = useStars()
  const [items, setItems] = useState(() => makeRound(config))
  const [stage, setStage] = useState('play') // play | done
  const [qIndex, setQIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const total = items.length
  const item = items[qIndex]
  const baseColor = config.color || 'bg-indigo-500'
  const title = `${config.title || 'Quiz'} ${config.emoji || ''}`.trim()
  const spoken = item ? spokenText(item, config) : ''
  useAutoSpeak(spoken, [qIndex, stage])

  function answer(opt) {
    if (feedback) return
    setPicked(opt)
    if (opt === item.answer) {
      setFeedback('right')
      setCorrect((c) => c + 1)
      sound.correct()
      speech.auto('Riktig!')
    } else {
      setFeedback('wrong')
      sound.wrong()
      speech.auto(`Det riktige er ${item.answer}.`)
    }
  }

  function next() {
    if (qIndex + 1 >= total) {
      addStars(starsFor(correct, total), { correct, total })
      setStage('done')
    } else {
      setQIndex((i) => i + 1)
      setPicked(null)
      setFeedback(null)
    }
  }

  function restart() {
    setItems(makeRound(config))
    setStage('play')
    setQIndex(0)
    setCorrect(0)
    setPicked(null)
    setFeedback(null)
  }

  if (stage === 'done') {
    return (
      <RoundDone
        correct={correct}
        total={total}
        stars={starsFor(correct, total)}
        onAgain={restart}
        onHome={() => go('home')}
        onNext={onNextLevel}
      />
    )
  }

  const pictures = item._options.some((o) => o.show)

  return (
    <div className="animate-pop-in">
      <TopBar title={title} onHome={() => go('home')} />

      <div className="bg-white/80 rounded-full h-5 overflow-hidden mb-4 shadow-inner">
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${(qIndex / total) * 100}%` }} />
      </div>
      <p className="text-center text-white font-bold text-lg mb-2">
        Oppgave {qIndex + 1} av {total}
      </p>

      <div className="bg-white/95 rounded-3xl p-5 md:p-8 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-center text-xl md:text-2xl font-bold text-slate-600">{item.prompt || config.prompt}</p>
          <SpeakButton text={spoken} />
        </div>

        {/* Visuell del: én stor emoji, mange (telling), to grupper, eller bokstav. */}
        {item.groups ? (
          <div className="flex items-stretch justify-center gap-3 my-4">
            {item.groups.map((g, gi) => (
              <div key={gi} className="flex-1 max-w-[45%] bg-slate-50 rounded-2xl p-3 flex flex-wrap justify-center gap-1 text-3xl md:text-5xl content-start">
                {Array.from({ length: g.count }).map((_, i) => (
                  <span key={i}>{g.emoji}</span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          item.show &&
          (item.count ? (
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-4xl md:text-6xl my-4 max-w-lg mx-auto">
              {Array.from({ length: item.count }).map((_, i) => (
                <span key={i}>{item.show}</span>
              ))}
            </div>
          ) : (
            <div className="text-8xl md:text-9xl text-center my-3 animate-pop-in">{item.show}</div>
          ))
        )}

        {item.caption && (
          <p className="text-center text-2xl md:text-3xl font-extrabold tracking-widest text-slate-400 mb-2">{item.caption}</p>
        )}

        <div className={`grid gap-3 md:gap-4 mt-4 ${item._options.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {item._options.map((opt) => {
            const isPicked = picked === opt.value
            const isAnswer = opt.value === item.answer
            let color = baseColor
            if (feedback) {
              if (isAnswer) color = 'bg-emerald-500'
              else if (isPicked) color = 'bg-rose-400'
              else color = 'bg-slate-300'
            }
            return (
              <button
                key={opt.value}
                disabled={!!feedback}
                onClick={() => answer(opt.value)}
                className={`kid-btn ${color} text-white py-4 md:py-5 flex flex-col items-center justify-center gap-1 ${
                  pictures ? 'text-xl' : 'text-2xl md:text-3xl'
                } ${feedback && isAnswer ? 'animate-bouncey' : ''} ${feedback && isPicked && !isAnswer ? 'animate-shake' : ''}`}
              >
                {opt.show && <span className="text-5xl md:text-6xl leading-none">{opt.show}</span>}
                <span className={opt.show ? 'text-base md:text-lg font-bold opacity-90' : ''}>{opt.value}</span>
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <Mascot
              mood={feedback === 'right' ? 'cheer' : 'oops'}
              message={feedback === 'right' ? 'Riktig! 🎉' : `Det riktige er ${item.answer}!`}
              size="text-5xl"
            />
            <BigButton color="bg-amber-500" onClick={next}>
              {qIndex + 1 >= total ? '🏁 Se resultat' : '➡️ Neste'}
            </BigButton>
          </div>
        )}

        <AutoSpeakToggle current={spoken} />
      </div>
    </div>
  )
}
