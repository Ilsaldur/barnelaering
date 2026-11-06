// Quiz-banker (data) til fri lek: farger og former (src/data/topics.js).
// Hver bank kjøres av motoren 'quiz' (src/activities/QuizEngine.jsx).
//
// Motorer i appen:
//  - 'quiz'      generisk flervalgsquiz (config.bank eller config.options per spørsmål)
//  - 'math'      regnestykker (config: ops, max, mulMax, mulFactors, divMax)
//  - 'clock'     analog klokke (config: minutes = 'whole'|'half'|'quarter'|'five')
//  - 'words'     ord og bilder (config: maxLen for å begrense til korte ord)
//  - 'patterns'  mønster og sortering
//  - 'geography' land og flagg (config: region = 'norden'|'europa'|'verden')

// Valg for de som ikke leser ennå:
//  - pictureOptions: true   svaralternativene vises som bildet til svaret
//  - optionPictures: {...}  oppslag svar → emoji på knappen
//  - readOptions: true      alternativene leses opp sammen med spørsmålet

// ---- Gjenbrukbare quiz-banker ----------------------------------------------

export const COLORS = {
  title: 'Farger',
  emoji: '🎨',
  color: 'bg-fuchsia-500',
  prompt: 'Hvilken farge er dette?',
  rounds: 8,
  readOptions: true,
  bank: [
    { show: '🟥', answer: 'Rød' },
    { show: '🟦', answer: 'Blå' },
    { show: '🟩', answer: 'Grønn' },
    { show: '🟨', answer: 'Gul' },
    { show: '🟧', answer: 'Oransje' },
    { show: '🟪', answer: 'Lilla' },
    { show: '⬛', answer: 'Svart' },
    { show: '🟫', answer: 'Brun' },
    { show: '⬜', answer: 'Hvit' },
    { show: '💗', answer: 'Rosa' },
  ],
}

export const SHAPES = {
  title: 'Former',
  emoji: '🔷',
  color: 'bg-amber-500',
  prompt: 'Hvilken form er dette?',
  rounds: 8,
  pictureOptions: true,
  readOptions: true,
  bank: [
    { show: '⚫', answer: 'Sirkel' },
    { show: '🔺', answer: 'Trekant' },
    { show: '🟦', answer: 'Firkant' },
    { show: '⭐', answer: 'Stjerne' },
    { show: '❤️', answer: 'Hjerte' },
    { show: '🔶', answer: 'Rombe' },
    { show: '🌙', answer: 'Halvmåne' },
    { show: '🥚', answer: 'Oval' },
  ],
}
