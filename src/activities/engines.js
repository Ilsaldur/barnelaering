// Kobler en aktivitets `engine`-navn (fra src/data/topics.js) til komponenten.
// Hver motor tar imot { go, config }. Matte, lesing, klokke, geografi og
// engelsk har egne stiger (src/activities/Stige.jsx) og ligger ikke her.
import Patterns from './Patterns.jsx'
import QuizEngine from './QuizEngine.jsx'

export const ENGINES = {
  patterns: Patterns,
  quiz: QuizEngine,
}
