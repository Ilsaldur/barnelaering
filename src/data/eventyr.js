// Eventyrkartet: fem steder med en liten quiz hver. Et sted gir stjerner én
// gang, og bare når alle svarene er riktige. Fullførte steder huskes i profilen.
//
// Stedene er de samme fem verdenene som mattestigen bygger på senere.

export const EVENTYR_BELONNING = 2 // stjerner for å klare et sted første gang

export const STEDER = [
  {
    id: 'skog',
    x: 20,
    y: 32,
    emoji: '🌳',
    title: 'Trylleskogen',
    need: 0,
    questions: [
      { prompt: 'Hvor mange bein har en edderkopp? 🕷️', options: ['8', '6', '4', '10'], answer: '8' },
      { prompt: 'Hva blir 2 + 3?', options: ['5', '4', '6', '7'], answer: '5' },
      { prompt: 'Hvilken farge er et blad om sommeren? 🍃', options: ['Grønn', 'Blå', 'Rød', 'Svart'], answer: 'Grønn', pictures: { Grønn: '🟩', Blå: '🟦', Rød: '🟥', Svart: '⬛' } },
    ],
  },
  {
    id: 'hav',
    x: 76,
    y: 30,
    emoji: '🌊',
    title: 'Det blå havet',
    need: 3,
    questions: [
      { prompt: 'Hvilket dyr bor i havet?', options: ['Blekksprut', 'Løve', 'Ku', 'Ulv'], answer: 'Blekksprut', pictures: { Blekksprut: '🐙', Løve: '🦁', Ku: '🐮', Ulv: '🐺' } },
      { prompt: 'Hva blir 4 + 4?', options: ['8', '6', '9', '7'], answer: '8' },
      { prompt: 'Hvor mange er et halvt dusin?', options: ['6', '12', '3', '5'], answer: '6' },
    ],
  },
  {
    id: 'fjell',
    x: 46,
    y: 18,
    emoji: '⛰️',
    title: 'Det høye fjellet',
    need: 6,
    questions: [
      { prompt: 'Hva er hovedstaden i Norge?', options: ['Oslo', 'Bergen', 'Stockholm', 'Tromsø'], answer: 'Oslo' },
      { prompt: 'Hva blir 5 × 2?', options: ['10', '7', '12', '8'], answer: '10' },
      { prompt: 'Hva er motsatt av høy?', options: ['Lav', 'Stor', 'Rask', 'Tung'], answer: 'Lav' },
    ],
  },
  {
    id: 'slott',
    x: 34,
    y: 64,
    emoji: '🏰',
    title: 'Det gylne slottet',
    need: 10,
    questions: [
      { prompt: 'Hva blir 10 + 5?', options: ['15', '14', '16', '12'], answer: '15' },
      { prompt: 'Hvor mange minutter er en halv time?', options: ['30', '15', '60', '45'], answer: '30' },
      { prompt: 'Hva blir 3 × 3?', options: ['9', '6', '12', '8'], answer: '9' },
    ],
  },
  {
    id: 'rakett',
    x: 72,
    y: 70,
    emoji: '🚀',
    title: 'Verdensrommet',
    need: 15,
    questions: [
      { prompt: 'Hvilken planet bor vi på?', options: ['Jorda', 'Mars', 'Månen', 'Sola'], answer: 'Jorda', pictures: { Jorda: '🌍', Mars: '🔴', Månen: '🌙', Sola: '☀️' } },
      { prompt: 'Hva blir 6 × 5?', options: ['30', '25', '35', '11'], answer: '30' },
      { prompt: 'Hva er halvparten av 20?', options: ['10', '5', '15', '40'], answer: '10' },
    ],
  },
]

// Hvor mange stjerner gir et sted, gitt antall riktige på første forsøk og
// om stedet er klart fra før? Bare alle riktige gir stjerner, og bare én gang.
export function eventyrStars(correct, total, alreadyDone) {
  if (alreadyDone) return 0
  return correct >= total ? EVENTYR_BELONNING : 0
}
