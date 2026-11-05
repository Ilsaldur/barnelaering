// Quiz-banker (data) som nivåstigene i src/data/topics.js bruker.
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

export const COUNTING_TO_5 = {
  title: 'Tell tingene',
  emoji: '🍎',
  color: 'bg-rose-500',
  prompt: 'Hvor mange er det?',
  rounds: 8,
  readOptions: true,
  bank: [
    { show: '🍎', count: 1, answer: '1' },
    { show: '🎈', count: 2, answer: '2' },
    { show: '⭐', count: 3, answer: '3' },
    { show: '🌸', count: 4, answer: '4' },
    { show: '🍓', count: 5, answer: '5' },
    { show: '🐠', count: 2, answer: '2' },
    { show: '🐝', count: 4, answer: '4' },
    { show: '🚗', count: 3, answer: '3' },
    { show: '🐶', count: 5, answer: '5' },
    { show: '🌳', count: 1, answer: '1' },
  ],
}

export const COUNTING_TO_10 = {
  title: 'Tell til 10',
  emoji: '🔟',
  color: 'bg-rose-500',
  prompt: 'Hvor mange er det?',
  rounds: 8,
  readOptions: true,
  bank: [
    { show: '🍎', count: 4, answer: '4' },
    { show: '🎈', count: 6, answer: '6' },
    { show: '⭐', count: 7, answer: '7' },
    { show: '🌸', count: 5, answer: '5' },
    { show: '🍓', count: 8, answer: '8' },
    { show: '🐠', count: 9, answer: '9' },
    { show: '🐝', count: 10, answer: '10' },
    { show: '🚗', count: 3, answer: '3' },
    { show: '🐶', count: 6, answer: '6' },
  ],
}

export const COLORS = {
  title: 'Farger',
  emoji: '🎨',
  color: 'bg-fuchsia-500',
  prompt: 'Hvilken farge er dette?',
  rounds: 8,
  pictureOptions: true,
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
    { show: '🩷', answer: 'Rosa' },
    { show: '🩵', answer: 'Lyseblå' },
    { show: '🩶', answer: 'Grå' },
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

export const FIRST_LETTER = {
  title: 'Første bokstav',
  emoji: '🔤',
  color: 'bg-emerald-500',
  prompt: 'Hvilken bokstav begynner ordet på?',
  rounds: 8,
  readOptions: true,
  bank: [
    { show: '🐶', caption: 'HUND', answer: 'H' },
    { show: '🐱', caption: 'KATT', answer: 'K' },
    { show: '🌞', caption: 'SOL', answer: 'S' },
    { show: '🍎', caption: 'EPLE', answer: 'E' },
    { show: '🐟', caption: 'FISK', answer: 'F' },
    { show: '🌳', caption: 'TRE', answer: 'T' },
    { show: '🐮', caption: 'KU', answer: 'K' },
    { show: '🌙', caption: 'MÅNE', answer: 'M' },
    { show: '🐝', caption: 'BIE', answer: 'B' },
    { show: '🚗', caption: 'BIL', answer: 'B' },
    { show: '🦁', caption: 'LØVE', answer: 'L' },
    { show: '🍌', caption: 'BANAN', answer: 'B' },
    { show: '🐸', caption: 'FROSK', answer: 'F' },
    { show: '🌈', caption: 'REGNBUE', answer: 'R' },
    { show: '⚽', caption: 'BALL', answer: 'B' },
    { show: '🧦', caption: 'SOKK', answer: 'S' },
    { show: '🎸', caption: 'GITAR', answer: 'G' },
    { show: '🐧', caption: 'PINGVIN', answer: 'P' },
  ],
}

export const LETTER_SOUNDS = {
  title: 'Bokstaver og lyder',
  emoji: '🅰️',
  color: 'bg-emerald-500',
  prompt: 'Hvilket ord begynner med denne bokstaven?',
  rounds: 8,
  readOptions: true,
  optionPictures: {
    SOL: '🌞', MÅNE: '🌙', TRE: '🌳', BIL: '🚗', HUND: '🐶', KATT: '🐱', FISK: '🐟', EPLE: '🍎',
    HUS: '🏠', BALL: '⚽', KU: '🐮',
  },
  bank: [
    { show: 'S', options: ['SOL', 'MÅNE', 'TRE', 'BIL'], answer: 'SOL' },
    { show: 'H', options: ['HUND', 'KATT', 'FISK', 'EPLE'], answer: 'HUND' },
    { show: 'F', options: ['FISK', 'HUS', 'BALL', 'SOL'], answer: 'FISK' },
    { show: 'B', options: ['BIL', 'TRE', 'KU', 'EPLE'], answer: 'BIL' },
    { show: 'M', options: ['MÅNE', 'SOL', 'HUND', 'BALL'], answer: 'MÅNE' },
    { show: 'K', options: ['KATT', 'FISK', 'TRE', 'HUS'], answer: 'KATT' },
    { show: 'E', options: ['EPLE', 'BIL', 'SOL', 'KU'], answer: 'EPLE' },
    { show: 'T', options: ['TRE', 'HUND', 'MÅNE', 'BALL'], answer: 'TRE' },
  ],
}

export const OPPOSITES = {
  title: 'Motsatt',
  emoji: '↔️',
  color: 'bg-cyan-500',
  prompt: 'Hva er det motsatte?',
  rounds: 8,
  bank: [
    { show: '☀️', caption: 'DAG', options: ['Natt', 'Sommer', 'Varm', 'Stor'], answer: 'Natt' },
    { show: '🔥', caption: 'VARM', options: ['Kald', 'Våt', 'Liten', 'Mørk'], answer: 'Kald' },
    { show: '⬆️', caption: 'OPP', options: ['Ned', 'Ut', 'Inn', 'Stor'], answer: 'Ned' },
    { show: '🐘', caption: 'STOR', options: ['Liten', 'Tung', 'Rask', 'Glad'], answer: 'Liten' },
    { show: '😀', caption: 'GLAD', options: ['Lei seg', 'Sint', 'Trøtt', 'Sulten'], answer: 'Lei seg' },
    { show: '🚀', caption: 'RASK', options: ['Sakte', 'Høy', 'Lett', 'Ny'], answer: 'Sakte' },
    { show: '🌳', caption: 'HØY', options: ['Lav', 'Bred', 'Tung', 'Kald'], answer: 'Lav' },
    { show: '🚪', caption: 'ÅPEN', options: ['Lukket', 'Stor', 'Ny', 'Tom'], answer: 'Lukket' },
    { show: '🥛', caption: 'FULL', options: ['Tom', 'Kald', 'Stor', 'Tung'], answer: 'Tom' },
    { show: '🧽', caption: 'REN', options: ['Skitten', 'Våt', 'Myk', 'Kald'], answer: 'Skitten' },
    { show: '👶', caption: 'UNG', options: ['Gammel', 'Liten', 'Rask', 'Glad'], answer: 'Gammel' },
    { show: '🪨', caption: 'HARD', options: ['Myk', 'Tung', 'Kald', 'Stor'], answer: 'Myk' },
    { show: '💧', caption: 'VÅT', options: ['Tørr', 'Kald', 'Ren', 'Blå'], answer: 'Tørr' },
    { show: '➡️', caption: 'HØYRE', options: ['Venstre', 'Opp', 'Ned', 'Inn'], answer: 'Venstre' },
  ],
}

export const FRACTIONS = {
  title: 'Brøk og halvparten',
  emoji: '🍕',
  color: 'bg-orange-500',
  prompt: 'Tenk litt!',
  rounds: 8,
  bank: [
    { prompt: 'Hva er halvparten av 10?', options: ['5', '2', '20', '8'], answer: '5' },
    { prompt: 'Hva er halvparten av 8?', options: ['4', '2', '6', '16'], answer: '4' },
    { prompt: 'Hvor mange halve trenger du for én hel?', options: ['2', '3', '4', '1'], answer: '2' },
    { prompt: 'Hvor mange fjerdedeler er én hel?', options: ['4', '2', '3', '8'], answer: '4' },
    { prompt: '½ av en pizza med 6 stykker er …', options: ['3', '2', '6', '4'], answer: '3' },
    { prompt: 'Hva er dobbelt av 6?', options: ['12', '8', '3', '10'], answer: '12' },
    { prompt: 'Hva er ¼ av 12?', options: ['3', '4', '6', '2'], answer: '3' },
    { prompt: 'Hva er halvparten av 20?', options: ['10', '5', '40', '15'], answer: '10' },
    { prompt: 'Hva er dobbelt av 8?', options: ['16', '10', '4', '12'], answer: '16' },
    { prompt: 'Hvor mange tredjedeler er én hel?', options: ['3', '2', '4', '6'], answer: '3' },
    { prompt: 'Hva er halvparten av 6?', options: ['3', '2', '12', '4'], answer: '3' },
    { prompt: '¾ av en kake med 4 stykker er …', options: ['3', '4', '2', '1'], answer: '3' },
    { prompt: 'Hva er dobbelt av 10?', options: ['20', '12', '5', '15'], answer: '20' },
    { prompt: 'Hva er ½ av 14?', options: ['7', '6', '28', '9'], answer: '7' },
  ],
}
