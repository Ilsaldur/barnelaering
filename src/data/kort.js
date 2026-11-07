// Samlekort. Ett kort for hvert nivå barnet mestrer i mattestigen, i sett.
// `nivaa` kobler kortet til nivået. Bonuskort (uten nivå) dukker opp av og til.
// Redigér fritt: navn, bilde (emoji) og én faktalinje per kort.

// Hvert sett hører til et fag (`fag`); kortene i settet har `nivaa` i den
// stigen. Bonuskort har ikke fag.
export const SETT = [
  { id: 'dyr', fag: 'matte', navn: 'Norske dyr', emoji: '🦌' },
  { id: 'dino', fag: 'matte', navn: 'Dinosaurer', emoji: '🦕' },
  { id: 'planeter', fag: 'matte', navn: 'Planeter og rommet', emoji: '🪐' },
  { id: 'lesing', fag: 'lesing', navn: 'Bokstavdyr', emoji: '🔤' },
  { id: 'skrive', fag: 'skrive', navn: 'Skrivesaker', emoji: '✏️' },
  { id: 'sprak', fag: 'sprak', navn: 'Språkskatter', emoji: '🧩' },
  { id: 'klokke', fag: 'klokke', navn: 'Klokker og tider', emoji: '🕐' },
  { id: 'geografi', fag: 'geografi', navn: 'Flagg og landemerker', emoji: '🌍' },
  { id: 'engelsk', fag: 'engelsk', navn: 'English words', emoji: '🇬🇧' },
  { id: 'bonus', navn: 'Bonuskort', emoji: '✨' },
]

export const KORT = [
  // Trylleskogen (1–6): norske dyr
  { id: 'dyr-ekorn', sett: 'dyr', nivaa: 1, navn: 'Ekorn', emoji: '🐿️', fakta: 'Ekornet gjemmer nøtter om høsten og finner dem igjen om vinteren.' },
  { id: 'dyr-pinnsvin', sett: 'dyr', nivaa: 2, navn: 'Pinnsvin', emoji: '🦔', fakta: 'Et pinnsvin har rundt 5000 pigger.' },
  { id: 'dyr-rev', sett: 'dyr', nivaa: 3, navn: 'Rev', emoji: '🦊', fakta: 'Reven kan høre en mus under snøen.' },
  { id: 'dyr-hare', sett: 'dyr', nivaa: 4, navn: 'Hare', emoji: '🐇', fakta: 'Haren blir hvit om vinteren og brun om sommeren.' },
  { id: 'dyr-ugle', sett: 'dyr', nivaa: 5, navn: 'Hubro', emoji: '🦉', fakta: 'Hubroen er Norges største ugle og kan snu hodet nesten helt rundt.' },
  { id: 'dyr-elg', sett: 'dyr', nivaa: 6, navn: 'Elg', emoji: '🦌', fakta: 'Elgen er skogens konge og kan bli over to meter høy.' },
  // Det blå havet (7–14): dyr i og ved havet
  { id: 'dyr-sel', sett: 'dyr', nivaa: 7, navn: 'Blåhval', emoji: '🐳', fakta: 'Blåhvalen er det største dyret som noen gang har levd, og den svømmer langs norskekysten om sommeren.' },
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
  { id: 'planet-merkur', sett: 'planeter', nivaa: 31, navn: 'Merkur', emoji: '🌑', fakta: 'Merkur er nærmest sola, og et år der varer bare 88 dager.' },
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

  // ---- UTKAST (runde 5, etappe V): ett kort per nivå i de andre stigene ----
  // Lese 1–12: bokstavdyr
  { id: 'lese-1', sett: 'lesing', fag: 'lesing', nivaa: 1, navn: 'Ape', emoji: '🐵', fakta: 'A som i ape. Aper bruker hendene nesten som oss.' },
  { id: 'lese-2', sett: 'lesing', fag: 'lesing', nivaa: 2, navn: 'Bjørn', emoji: '🐻', fakta: 'B som i bjørn. Bjørnen sover hele vinteren.' },
  { id: 'lese-3', sett: 'lesing', fag: 'lesing', nivaa: 3, navn: 'Due', emoji: '🕊️', fakta: 'D som i due. Duer finner alltid veien hjem.' },
  { id: 'lese-4', sett: 'lesing', fag: 'lesing', nivaa: 4, navn: 'Elefant', emoji: '🐘', fakta: 'E som i elefant. Elefanten drikker med snabelen.' },
  { id: 'lese-5', sett: 'lesing', fag: 'lesing', nivaa: 5, navn: 'Frosk', emoji: '🐸', fakta: 'F som i frosk. Frosken puster gjennom huden.' },
  { id: 'lese-6', sett: 'lesing', fag: 'lesing', nivaa: 6, navn: 'Gris', emoji: '🐷', fakta: 'G som i gris. Griser er renslige og smarte.' },
  { id: 'lese-7', sett: 'lesing', fag: 'lesing', nivaa: 7, navn: 'Hest', emoji: '🐴', fakta: 'H som i hest. Hesten kan sove stående.' },
  { id: 'lese-8', sett: 'lesing', fag: 'lesing', nivaa: 8, navn: 'Krokodille', emoji: '🐊', fakta: 'K som i krokodille. Krokodillen kan ikke stikke tunga ut.' },
  { id: 'lese-9', sett: 'lesing', fag: 'lesing', nivaa: 9, navn: 'Løve', emoji: '🦁', fakta: 'L som i løve. Løvens brøl høres en mil unna.' },
  { id: 'lese-10', sett: 'lesing', fag: 'lesing', nivaa: 10, navn: 'Papegøye', emoji: '🦜', fakta: 'P som i papegøye. Noen papegøyer lærer hundre ord.' },
  { id: 'lese-11', sett: 'lesing', fag: 'lesing', nivaa: 11, navn: 'Skilpadde', emoji: '🐢', fakta: 'S som i skilpadde. Skilpadder kan bli over hundre år.' },
  { id: 'lese-12', sett: 'lesing', fag: 'lesing', nivaa: 12, navn: 'Ugle', emoji: '🦉', fakta: 'U som i ugle. Ugla flyr helt lydløst.' },
  // Skrive riktig 1–4
  { id: 'skrive-1', sett: 'skrive', fag: 'skrive', nivaa: 1, navn: 'Blyant', emoji: '✏️', fakta: 'En blyant kan tegne en strek på over 50 kilometer.' },
  { id: 'skrive-2', sett: 'skrive', fag: 'skrive', nivaa: 2, navn: 'Brev', emoji: '✉️', fakta: 'Før i tiden ble brev båret av ryttere som byttet hest underveis.' },
  { id: 'skrive-3', sett: 'skrive', fag: 'skrive', nivaa: 3, navn: 'Bok', emoji: '📖', fakta: 'De første bøkene ble skrevet for hånd og tok måneder å lage.' },
  { id: 'skrive-4', sett: 'skrive', fag: 'skrive', nivaa: 4, navn: 'Ordbok', emoji: '📚', fakta: 'Norsk har flere hundre tusen ord, og det kommer nye hvert år.' },
  // Språk 1–3
  { id: 'sprak-1', sett: 'sprak', fag: 'sprak', nivaa: 1, navn: 'Puslebit', emoji: '🧩', fakta: 'Ord er som puslebiter: substantiv, verb og adjektiv passer sammen til setninger.' },
  { id: 'sprak-2', sett: 'sprak', fag: 'sprak', nivaa: 2, navn: 'Teater', emoji: '🎭', fakta: 'I dag, i går, i morgen: ordene bøyer seg etter når det skjer.' },
  { id: 'sprak-3', sett: 'sprak', fag: 'sprak', nivaa: 3, navn: 'Skriftrull', emoji: '📜', fakta: 'Punktum, spørsmålstegn og utropstegn forteller hvordan setningen skal leses.' },
  // Klokka 1–8
  { id: 'klokke-1', sett: 'klokke', fag: 'klokke', nivaa: 1, navn: 'Klokka ett', emoji: '🕐', fakta: 'Den korte viseren viser timen, den lange minuttene.' },
  { id: 'klokke-2', sett: 'klokke', fag: 'klokke', nivaa: 2, navn: 'Klokka to', emoji: '🕑', fakta: 'Et døgn har 24 timer, så den korte viseren går rundt to ganger.' },
  { id: 'klokke-3', sett: 'klokke', fag: 'klokke', nivaa: 3, navn: 'Halv fire', emoji: '🕞', fakta: 'Halv fire betyr at det er en halv time igjen til fire.' },
  { id: 'klokke-4', sett: 'klokke', fag: 'klokke', nivaa: 4, navn: 'Kvart over fem', emoji: '🕔', fakta: 'Et kvarter er 15 minutter, en firedel av en time.' },
  { id: 'klokke-5', sett: 'klokke', fag: 'klokke', nivaa: 5, navn: 'Solur', emoji: '☀️', fakta: 'Før klokka fantes, leste folk tiden av skyggen fra sola.' },
  { id: 'klokke-6', sett: 'klokke', fag: 'klokke', nivaa: 6, navn: 'Timeglass', emoji: '⏳', fakta: 'Sanden i et timeglass renner like fort hver gang.' },
  { id: 'klokke-7', sett: 'klokke', fag: 'klokke', nivaa: 7, navn: 'Digital klokke', emoji: '⏰', fakta: '15:00 er det samme som klokka tre om ettermiddagen.' },
  { id: 'klokke-8', sett: 'klokke', fag: 'klokke', nivaa: 8, navn: 'Stoppeklokke', emoji: '⏱️', fakta: 'En time er 60 minutter, og et minutt er 60 sekunder.' },
  // Geografi 1–9: flagg (bilde fra public/flagg) og landemerker
  { id: 'geo-1', sett: 'geografi', fag: 'geografi', nivaa: 1, navn: 'Norge', flagg: 'no', fakta: 'Det norske flagget har korset fra Danmark og fargene fra Frankrike.' },
  { id: 'geo-2', sett: 'geografi', fag: 'geografi', nivaa: 2, navn: 'Island', flagg: 'is', fakta: 'På Island finnes det varme kilder midt i snøen.' },
  { id: 'geo-3', sett: 'geografi', fag: 'geografi', nivaa: 3, navn: 'Danmark', flagg: 'dk', fakta: 'Dannebrog er verdens eldste flagg som fortsatt er i bruk.' },
  { id: 'geo-4', sett: 'geografi', fag: 'geografi', nivaa: 4, navn: 'Eiffeltårnet', emoji: '🗼', fakta: 'Eiffeltårnet i Paris blir 15 centimeter høyere om sommeren når jernet utvider seg.' },
  { id: 'geo-5', sett: 'geografi', fag: 'geografi', nivaa: 5, navn: 'Italia', flagg: 'it', fakta: 'I Roma kaster folk mynter i en fontene for lykke.' },
  { id: 'geo-6', sett: 'geografi', fag: 'geografi', nivaa: 6, navn: 'Slott', emoji: '🏰', fakta: 'Europa har tusenvis av slott, og mange av dem kan du besøke.' },
  { id: 'geo-7', sett: 'geografi', fag: 'geografi', nivaa: 7, navn: 'Egypt', flagg: 'eg', fakta: 'Pyramidene i Egypt er over 4000 år gamle.' },
  { id: 'geo-8', sett: 'geografi', fag: 'geografi', nivaa: 8, navn: 'Frihetsgudinnen', emoji: '🗽', fakta: 'Frihetsgudinnen i New York var en gave fra Frankrike.' },
  { id: 'geo-9', sett: 'geografi', fag: 'geografi', nivaa: 9, navn: 'Fujifjellet', emoji: '🗻', fakta: 'Fuji i Japan er en vulkan med snø på toppen.' },
  // Engelsk 1–10: ord med bilde
  { id: 'eng-1', sett: 'engelsk', fag: 'engelsk', nivaa: 1, navn: 'Red', emoji: '🟥', fakta: 'Red – rød. Stop signs are red all over the world.' },
  { id: 'eng-2', sett: 'engelsk', fag: 'engelsk', nivaa: 2, navn: 'Cat', emoji: '🐱', fakta: 'Cat – katt. Cats sleep about sixteen hours a day.' },
  { id: 'eng-3', sett: 'engelsk', fag: 'engelsk', nivaa: 3, navn: 'Apple', emoji: '🍎', fakta: 'Apple – eple. An apple can float on water.' },
  { id: 'eng-4', sett: 'engelsk', fag: 'engelsk', nivaa: 4, navn: 'Hat', emoji: '🎩', fakta: 'Hat – hatt. A top hat was once worn every day.' },
  { id: 'eng-5', sett: 'engelsk', fag: 'engelsk', nivaa: 5, navn: 'Sun', emoji: '☀️', fakta: 'Sun – sol. The sun is a star.' },
  { id: 'eng-6', sett: 'engelsk', fag: 'engelsk', nivaa: 6, navn: 'House', emoji: '🏠', fakta: 'House – hus. Some houses in England are 500 years old.' },
  { id: 'eng-7', sett: 'engelsk', fag: 'engelsk', nivaa: 7, navn: 'Question', emoji: '❓', fakta: 'Question – spørsmål. Who, what, where, when, why.' },
  { id: 'eng-8', sett: 'engelsk', fag: 'engelsk', nivaa: 8, navn: 'Book', emoji: '📖', fakta: 'Book – bok. The longest English word has 45 letters.' },
  { id: 'eng-9', sett: 'engelsk', fag: 'engelsk', nivaa: 9, navn: 'Pencil', emoji: '✏️', fakta: 'Pencil – blyant. Spell it: p-e-n-c-i-l.' },
  { id: 'eng-10', sett: 'engelsk', fag: 'engelsk', nivaa: 10, navn: 'Rainbow', emoji: '🌈', fakta: 'Rainbow – regnbue. A rainbow has seven colours.' },
]

// Kortet for et nivå i en stige. Kort uten `fag` hører til matte.
export function kortForNivaa(nivaa, fag = 'matte') {
  return KORT.find((k) => k.nivaa === nivaa && (k.fag || 'matte') === fag) || null
}

export function fagForKort(k) {
  return k?.fag || (k?.nivaa ? 'matte' : null)
}

export function kortById(id) {
  return KORT.find((k) => k.id === id) || null
}

export const BONUSKORT = KORT.filter((k) => k.sett === 'bonus')
