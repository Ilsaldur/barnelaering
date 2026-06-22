import { TopBar, Mascot } from '../components/ui.jsx'
import { sound } from '../sound.js'

// Aktivitetsmenyen for ett valgt nivå (barnehage / klasse).
export default function LevelMenu({ level, onHome, onPick }) {
  return (
    <div className="animate-pop-in">
      <TopBar title={`${level.title} ${level.emoji}`} onHome={onHome} />

      <div className="flex justify-center my-3">
        <Mascot message={level.intro || 'Velg en aktivitet!'} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
        {level.activities.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              sound.click()
              onPick(a.id)
            }}
            className={`kid-btn ${a.color} text-white p-5 md:p-7 flex flex-col items-center gap-2 hover:scale-105`}
          >
            <span className="text-5xl md:text-6xl">{a.emoji}</span>
            <span className="text-xl md:text-2xl font-extrabold text-center leading-tight">{a.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
