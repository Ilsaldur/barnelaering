// Kostymer til reven. Kjøpes med stjerner (av saldoen, aldri av totalen) og
// vises på reven inne i oppgavene. Redigér fritt.
export const KOSTYMER = [
  { id: 'lue', navn: 'Rød lue', emoji: '🧢', pris: 5 },
  { id: 'sloyfe', navn: 'Sløyfe', emoji: '🎀', pris: 6 },
  { id: 'briller', navn: 'Solbriller', emoji: '🕶️', pris: 8 },
  { id: 'skjerf', navn: 'Skjerf', emoji: '🧣', pris: 8 },
  { id: 'hatt', navn: 'Flosshatt', emoji: '🎩', pris: 12 },
  { id: 'krone', navn: 'Krone', emoji: '👑', pris: 15 },
  { id: 'tryllestav', navn: 'Tryllestav', emoji: '🪄', pris: 18 },
  { id: 'hjelm', navn: 'Romhjelm', emoji: '🪖', pris: 20 },
  { id: 'gitar', navn: 'Gitar', emoji: '🎸', pris: 25 },
  { id: 'kappe', navn: 'Superkappe', emoji: '🦸', pris: 30 },
]

export function kostymeById(id) {
  return KOSTYMER.find((k) => k.id === id) || null
}
