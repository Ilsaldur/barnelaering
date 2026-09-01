// Hjelpere for adaptivitet og statistikk, brukt av nivåstigen,
// forsiden ("fortsett der du slapp") og foreldresiden.
import { TOPICS, topicById } from './data/topics.js'

// Anbefalt nivå i et tema: første nivå som ikke sitter godt (under 2 stjerner),
// deretter første som ikke er perfekt. -1 = hele temaet er mestret.
export function recommendedIndex(topic, best) {
  const b = best[topic.id] || {}
  for (let i = 0; i < topic.levels.length; i++) {
    if ((b[i] || 0) < 2) return i
  }
  for (let i = 0; i < topic.levels.length; i++) {
    if ((b[i] || 0) < 3) return i
  }
  return -1
}

export function topicProgress(topic, best) {
  const b = best[topic.id] || {}
  const done = topic.levels.filter((_, i) => (b[i] || 0) > 0).length
  const mastered = topic.levels.filter((_, i) => (b[i] || 0) >= 2).length
  return { done, mastered, total: topic.levels.length }
}

// "Fortsett der du slapp": siste tema det ble spilt i, med anbefalt nivå.
export function continueSuggestion(log, best) {
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i]
    if (!e.topic) continue
    const topic = topicById(e.topic)
    if (!topic) continue
    const idx = recommendedIndex(topic, best)
    if (idx >= 0) return { topic, levelIndex: idx }
  }
  return null
}

// Treffsikkerhet per tema fra loggen (bare runder som har correct/total).
export function accuracyByTopic(log) {
  const acc = {}
  for (const e of log) {
    if (!e.topic || e.correct == null || !e.total) continue
    acc[e.topic] = acc[e.topic] || { correct: 0, total: 0, rounds: 0 }
    acc[e.topic].correct += e.correct
    acc[e.topic].total += e.total
    acc[e.topic].rounds += 1
  }
  return acc
}

// Styrker (høy treff) og øvingsområder (lav treff), minst 3 runder spilt.
export function strengthsAndPractice(log) {
  const acc = accuracyByTopic(log)
  const rows = Object.entries(acc)
    .filter(([, v]) => v.rounds >= 3)
    .map(([id, v]) => ({ topic: topicById(id), pct: Math.round((100 * v.correct) / v.total), rounds: v.rounds }))
    .filter((r) => r.topic)
  return {
    strengths: rows.filter((r) => r.pct >= 80).sort((a, b) => b.pct - a.pct),
    practice: rows.filter((r) => r.pct < 65).sort((a, b) => a.pct - b.pct),
  }
}

// Aktivitet siste N dager: antall runder og stjerner.
export function recentActivity(log, days = 7) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000
  const recent = log.filter((e) => e.t >= since)
  return {
    rounds: recent.length,
    stars: recent.reduce((s, e) => s + (e.stars || 0), 0),
  }
}

export { TOPICS }
