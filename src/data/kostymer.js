// Kostymer til reven. Kjøpes med stjerner (av saldoen, aldri av totalen).
// Hvert kostyme har en plass på reven: hode, øyne, hals, hånd eller kropp.
// Flere kan være på samtidig, men bare ett per plass. Redigér fritt.
export const PLASSER = {
  hode: 'på hodet',
  oyne: 'foran øynene',
  hals: 'rundt halsen',
  haand: 'i hånda',
  kropp: 'på kroppen',
}

export const KOSTYMER = [
  { id: 'lue', navn: 'Rød lue', emoji: '🧢', pris: 5, plass: 'hode' },
  { id: 'sloyfe', navn: 'Sløyfe', emoji: '🎀', pris: 6, plass: 'hals' },
  { id: 'briller', navn: 'Solbriller', emoji: '🕶️', pris: 8, plass: 'oyne' },
  { id: 'skjerf', navn: 'Skjerf', emoji: '🧣', pris: 8, plass: 'hals' },
  { id: 'hatt', navn: 'Flosshatt', emoji: '🎩', pris: 12, plass: 'hode' },
  { id: 'krone', navn: 'Krone', emoji: '👑', pris: 15, plass: 'hode' },
  { id: 'tryllestav', navn: 'Tryllestav', emoji: '🪄', pris: 18, plass: 'haand' },
  { id: 'hjelm', navn: 'Romhjelm', emoji: '🪖', pris: 20, plass: 'hode' },
  { id: 'gitar', navn: 'Gitar', emoji: '🎸', pris: 25, plass: 'haand' },
  { id: 'kappe', navn: 'Superkappe', emoji: '🦸', pris: 30, plass: 'kropp' },
]

export function kostymeById(id) {
  return KOSTYMER.find((k) => k.id === id) || null
}
