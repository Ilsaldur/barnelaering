// Samlekort. Ett kort for hvert nivå barnet mestrer i mattestigen, i sett.
// `nivaa` kobler kortet til nivået. Bonuskort (uten nivå) dukker opp av og til.
// Redigér fritt: navn, bilde (emoji) og én faktalinje per kort.

export const SETT = [
  { id: 'dyr', navn: 'Norske dyr', emoji: '🦌' },
  { id: 'dino', navn: 'Dinosaurer', emoji: '🦕' },
  { id: 'planeter', navn: 'Planeter og rommet', emoji: '🪐' },
  { id: 'bonus', navn: 'Bonuskort', emoji: '✨' },
]

export const KORT = [
  // Trylleskogen (1–6): norske dyr
  { id: 'dyr-ekorn', sett: 'dyr', nivaa: 1, navn: 'Ekorn', emoji: '🐿️', fakta: 'Ekornet gjemmer nøtter om høsten og finner dem igjen om vinteren.' },
  { id: 'dyr-pinnsvin', sett: 'dyr', nivaa: 2, navn: 'Pinnsvin', emoji: '🦔', fakta: 'Et pinnsvin har rundt 5000 pigger.' },
  { id: 'dyr-rev', sett: 'dyr', nivaa: 3, navn: 'Rev', emoji: '🦊', fakta: 'Reven kan høre en mus under snøen.' },
  { id: 'dyr-hare', sett: 'dyr', nivaa: 4, navn: 'Hare', emoji: '🐇', fakta: 'Haren blir hvit om vinteren og brun om sommeren.' },
  { id: 'dyr-ugle', sett: 'dyr', nivaa: 5, navn: 'Hubro', emoji: '🦉', fakta: 'Hubroen er Norges største ugle og kan snu hodet nesten helt rundt.' },
  { id: 'dyr-elg', sett: 'dyr', nivaa: 6, navn: 'Elg', emoji: '🫎', fakta: 'Elgen er skogens konge og kan bli over to meter høy.' },
  // Det blå havet (7–14): dyr i og ved havet
  { id: 'dyr-sel', sett: 'dyr', nivaa: 7, navn: 'Sel', emoji: '🦭', fakta: 'Selen kan holde pusten i over 20 minutter.' },
  { id: 'dyr-torsk', sett: 'dyr', nivaa: 8, navn: 'Torsk', emoji: '🐟', fakta: 'Torsken har en skjeggtråd under haken som den kjenner med.' },
  { id: 'dyr-krabbe', sett: 'dyr', nivaa: 9, navn: 'Krabbe', emoji: '🦀', fakta: 'Krabben går sidelengs og kan miste en klo og få en ny.' },
  { id: 'dyr-lunde', sett: 'dyr', nivaa: 10, navn: 'Lundefugl', emoji: '🐧', fakta: 'Lundefuglen kan holde ti småfisk i nebbet samtidig.' },
  { id: 'dyr-nise', sett: 'dyr', nivaa: 11, navn: 'Nise', emoji: '🐬', fakta: 'Nisen er Norges minste hval.' },
  { id: 'dyr-oter', sett: 'dyr', nivaa: 12, navn: 'Oter', emoji: '🦦', fakta: 'Oteren har den tetteste pelsen av alle dyr.' },
  { id: 'dyr-orn', sett: 'dyr', nivaa: 13, navn: 'Havørn', emoji: '🦅', fakta: 'Havørnen har vinger som er bredere enn en voksen mann er høy.' },
  { id: 'dyr-hval', sett: 'dyr', nivaa: 14, navn: 'Knølhval', emoji: '🐋', fakta: 'Knølhvalen synger sanger som kan vare i timevis.' },
  // Det høye fjellet (15–22): fjelldyr
  { id: 'dyr-rein', sett: 'dyr', nivaa: 15, navn: 'Reinsdyr', emoji: '🦌', fakta: 'Både hunn og hann hos reinsdyret har gevir.' },
  { id: 'dyr-rype', sett: 'dyr', nivaa: 16, navn: 'Rype', emoji: '🐦', fakta: 'Rypa har fjær på beina som fungerer som truger.' },
  { id: 'dyr-fjellrev', sett: 'dyr', nivaa: 17, navn: 'Fjellrev', emoji: '🦊', fakta: 'Fjellreven tåler 40 kuldegrader uten å fryse.' },
  { id: 'dyr-lemen', sett: 'dyr', nivaa: 18, navn: 'Lemen', emoji: '🐹', fakta: 'Lemen er sinte små dyr som piper høyt når de blir skremt.' },
  { id: 'dyr-jerv', sett: 'dyr', nivaa: 19, navn: 'Jerv', emoji: '🦡', fakta: 'Jerven kan bære et bytte som veier mer enn den selv.' },
  { id: 'dyr-gaupe', sett: 'dyr', nivaa: 20, navn: 'Gaupe', emoji: '🐈', fakta: 'Gaupa er Norges eneste ville kattedyr.' },
  { id: 'dyr-moskus', sett: 'dyr', nivaa: 21, navn: 'Moskus', emoji: '🐂', fakta: 'Moskusen har ull som er åtte ganger varmere enn saueull.' },
  { id: 'dyr-bjorn', sett: 'dyr', nivaa: 22, navn: 'Brunbjørn', emoji: '🐻', fakta: 'Bjørnen sover hele vinteren uten å spise eller drikke.' },
  // Det gylne slottet (23–30): dinosaurer
  { id: 'dino-trex', sett: 'dino', nivaa: 23, navn: 'Tyrannosaurus rex', emoji: '🦖', fakta: 'T. rex hadde tenner så lange som bananer.' },
  { id: 'dino-tricera', sett: 'dino', nivaa: 24, navn: 'Triceratops', emoji: '🦏', fakta: 'Triceratops hadde tre horn og en stor krage av bein.' },
  { id: 'dino-brachio', sett: 'dino', nivaa: 25, navn: 'Brachiosaurus', emoji: '🦕', fakta: 'Brachiosaurus var så høy at den kunne kikke inn i fjerde etasje.' },
  { id: 'dino-stego', sett: 'dino', nivaa: 26, navn: 'Stegosaurus', emoji: '🦎', fakta: 'Stegosaurus hadde en hjerne på størrelse med en valnøtt.' },
  { id: 'dino-veloci', sett: 'dino', nivaa: 27, navn: 'Velociraptor', emoji: '🦃', fakta: 'Velociraptor var på størrelse med en kalkun og hadde fjær.' },
  { id: 'dino-ptera', sett: 'dino', nivaa: 28, navn: 'Pteranodon', emoji: '🦅', fakta: 'Pteranodon fløy over havet og hadde ikke tenner.' },
  { id: 'dino-anky', sett: 'dino', nivaa: 29, navn: 'Ankylosaurus', emoji: '🐢', fakta: 'Ankylosaurus hadde en klubbe på halen som kunne knekke bein.' },
  { id: 'dino-spino', sett: 'dino', nivaa: 30, navn: 'Spinosaurus', emoji: '🐊', fakta: 'Spinosaurus var lengre enn T. rex og kunne svømme.' },
  // Verdensrommet (31–38): planeter
  { id: 'planet-merkur', sett: 'planeter', nivaa: 31, navn: 'Merkur', emoji: '🪨', fakta: 'Merkur er nærmest sola, og et år der varer bare 88 dager.' },
  { id: 'planet-venus', sett: 'planeter', nivaa: 32, navn: 'Venus', emoji: '🌕', fakta: 'Venus er den varmeste planeten, varmere enn Merkur.' },
  { id: 'planet-jorda', sett: 'planeter', nivaa: 33, navn: 'Jorda', emoji: '🌍', fakta: 'Jorda er den eneste planeten vi vet har liv.' },
  { id: 'planet-mars', sett: 'planeter', nivaa: 34, navn: 'Mars', emoji: '🔴', fakta: 'Mars har det høyeste fjellet i solsystemet, tre ganger så høyt som Mount Everest.' },
  { id: 'planet-jupiter', sett: 'planeter', nivaa: 35, navn: 'Jupiter', emoji: '🟠', fakta: 'Jupiter er så stor at alle de andre planetene får plass inni den.' },
  { id: 'planet-saturn', sett: 'planeter', nivaa: 36, navn: 'Saturn', emoji: '🪐', fakta: 'Saturns ringer er laget av is og stein.' },
  { id: 'planet-uranus', sett: 'planeter', nivaa: 37, navn: 'Uranus', emoji: '🔵', fakta: 'Uranus ruller rundt sola på siden, som en ball.' },
  { id: 'planet-neptun', sett: 'planeter', nivaa: 38, navn: 'Neptun', emoji: '🌀', fakta: 'På Neptun blåser det sterkere enn noe annet sted i solsystemet.' },
  // Bonuskort (uten nivå): dukker opp uventet
  { id: 'bonus-regnbue', sett: 'bonus', navn: 'Regnbuen', emoji: '🌈', fakta: 'En regnbue har alltid rødt ytterst og fiolett innerst.' },
  { id: 'bonus-nordlys', sett: 'bonus', navn: 'Nordlys', emoji: '🌌', fakta: 'Nordlyset lages av partikler fra sola som treffer lufta høyt oppe.' },
  { id: 'bonus-enhjorning', sett: 'bonus', navn: 'Enhjørning', emoji: '🦄', fakta: 'Enhjørningen er Skottlands nasjonaldyr, selv om den ikke finnes.' },
  { id: 'bonus-drage', sett: 'bonus', navn: 'Drage', emoji: '🐉', fakta: 'Komodovaranen er det nærmeste vi har en ekte drage.' },
  { id: 'bonus-rakett', sett: 'bonus', navn: 'Rakett', emoji: '🚀', fakta: 'En rakett må kjøre i 40 000 km/t for å komme seg vekk fra jorda.' },
  { id: 'bonus-skatt', sett: 'bonus', navn: 'Skattekiste', emoji: '💎', fakta: 'Diamant er det hardeste stoffet som finnes i naturen.' },
  { id: 'bonus-sommerfugl', sett: 'bonus', navn: 'Sommerfugl', emoji: '🦋', fakta: 'Sommerfugler smaker med føttene.' },
  { id: 'bonus-blekksprut', sett: 'bonus', navn: 'Blekksprut', emoji: '🐙', fakta: 'Blekkspruten har tre hjerter og blått blod.' },
]

export function kortForNivaa(nivaa) {
  return KORT.find((k) => k.nivaa === nivaa) || null
}

export function kortById(id) {
  return KORT.find((k) => k.id === id) || null
}

export const BONUSKORT = KORT.filter((k) => k.sett === 'bonus')
