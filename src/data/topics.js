// Temaer til fri lek: former/mønster og farger. Matte, lesing, klokke,
// geografi og engelsk har egne stiger (src/data/*/nivaer.js).
import { COLORS, SHAPES } from './levels.js'

export const TOPICS = [
  {
    id: 'former',
    title: 'Former og mønster',
    emoji: '🔺',
    color: 'bg-orange-500',
    levels: [
      { sub: 'Hvilken form?', engine: 'quiz', config: { ...SHAPES } },
      { sub: 'Mønster og sortering', engine: 'patterns', config: {} },
    ],
  },
  {
    id: 'farger',
    title: 'Farger',
    emoji: '🎨',
    color: 'bg-fuchsia-500',
    levels: [
      { sub: 'Grunnfarger', engine: 'quiz', config: { ...COLORS, bank: COLORS.bank.slice(0, 8) } },
      { sub: 'Alle farger', engine: 'quiz', config: { ...COLORS } },
    ],
  },
]

export function topicById(id) {
  return TOPICS.find((t) => t.id === id) || null
}
