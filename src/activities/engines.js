// Kobler en aktivitets `engine`-navn (fra src/data/levels.js) til komponenten.
// Hver motor tar imot { go, config }.
import MathActivity from './Math.jsx'
import Words from './Words.jsx'
import Patterns from './Patterns.jsx'
import QuizEngine from './QuizEngine.jsx'

export const ENGINES = {
  math: MathActivity,
  words: Words,
  patterns: Patterns,
  quiz: QuizEngine,
}
