// ============================================================================
// UTKAST – «Lær først»-kort, ikke gjennomlest av Jon ennå.
// Et kort er tre–fire korte skjermer: én tanke per skjerm, høyst to korte
// setninger, et konkret eksempel og en enkel figur der det hjelper. Siste
// skjerm er alltid «Prøv selv» (lages av appen fra nivåets egen generator).
//
//   { id, fag, nivaa, tittel, typer: [oppgavetyper kortet dekker],
//     steg: [{ tekst, figur? }] }
//
// figur kan være { visual: {...} } (som i oppgavene) eller { hjelp: {...} }
// (som bak Hjelp-knappen). Se src/components/TaskVisual.jsx for slagene.
// `stegForType` (valgfritt) sier hvilket steg som vises etter to gale svar
// på en oppgavetype; ellers brukes det første steget.
// ============================================================================

export const LAERKORT = [
  // ---------------------------------------------------------------- Matte
  {
    id: 'm3-monster',
    fag: 'matte',
    nivaa: 3,
    tittel: 'Mønster',
    typer: ['monster_neste'],
    steg: [
      { tekst: 'Et mønster gjentar seg. Se: rød, blå, rød, blå. Hva kommer så? Rød!', figur: { visual: { kind: 'rekke', items: ['🔴', '🔵', '🔴', '🔵', '?'] } } },
      { tekst: 'Finn biten som gjentar seg. Her er biten stjerne, måne, sol – og så begynner den på nytt.', figur: { visual: { kind: 'rekke', items: ['⭐', '🌙', '☀️', '⭐', '🌙', '☀️'] } } },
      { tekst: 'Pek på hver figur og si navnet høyt. Da hører du mønsteret, og vet hva som kommer.' },
    ],
  },
  {
    id: 'm9-tiervenner',
    fag: 'matte',
    nivaa: 9,
    tittel: 'Tiervenner og dobling',
    typer: ['tiervenner', 'dobling'],
    stegForType: { dobling: 2 },
    steg: [
      { tekst: 'To tall som blir 10 til sammen, er tiervenner. 7 og 3 er tiervenner, for 7 + 3 = 10.', figur: { hjelp: { kind: 'tiervenner', a: 7 } } },
      { tekst: 'Alle tiervennene: 1 og 9, 2 og 8, 3 og 7, 4 og 6, 5 og 5. Kan du dem, går pluss mye fortere.' },
      { tekst: 'Dobling er det samme tallet to ganger. Dobbelt av 6 er 6 + 6 = 12.', figur: { hjelp: { kind: 'pluss', a: 6, b: 6, emoji: '🔵' } } },
    ],
  },
  {
    id: 'm10-tiere-enere',
    fag: 'matte',
    nivaa: 10,
    tittel: 'Tiere og enere',
    typer: ['tiere_enere_20'],
    steg: [
      { tekst: 'Tallene fra 11 til 20 er en tier og noen enere. 14 er 10 og 4.', figur: { hjelp: { kind: 'tiere', a: 10, b: 4, op: 'add' } } },
      { tekst: 'Den blå stangen er en tier, hver gul prikk er en ener. 1 tier og 7 enere er 17.', figur: { hjelp: { kind: 'tiere', a: 10, b: 7, op: 'add' } } },
      { tekst: 'Tar du bort enerne, står tieren igjen. 17 − 7 = 10.' },
    ],
  },
  {
    id: 'm12-tierovergang-pluss',
    fag: 'matte',
    nivaa: 12,
    tittel: 'Pluss over tieren',
    typer: ['pluss_tierovergang'],
    steg: [
      { tekst: 'Når svaret går forbi 10, fyller vi opp til 10 først. 8 + 5: 8 trenger 2 for å bli 10.', figur: { hjelp: { kind: 'tiervenner', a: 8 } } },
      { tekst: 'Vi deler 5 i 2 og 3. 8 + 2 = 10, og så 3 til: 13.', figur: { hjelp: { kind: 'tallinje', from: 0, to: 20, start: 8 } } },
      { tekst: 'Tenk alltid: hvor mye mangler til 10? Resten legger du på etterpå.' },
    ],
  },
  {
    id: 'm13-tierovergang-minus',
    fag: 'matte',
    nivaa: 13,
    tittel: 'Minus over tieren',
    typer: ['minus_tierovergang'],
    steg: [
      { tekst: 'Når vi skal under 10, går vi ned til 10 først. 13 − 4: fra 13 til 10 er 3.', figur: { hjelp: { kind: 'tallinje', from: 0, to: 20, start: 13 } } },
      { tekst: 'Vi deler 4 i 3 og 1. 13 − 3 = 10, og så 1 til: 9.' },
      { tekst: 'Tenk alltid: hvor mye er det ned til 10? Resten trekker du fra etterpå.' },
    ],
  },
  {
    id: 'm14-partall',
    fag: 'matte',
    nivaa: 14,
    tittel: 'Partall og oddetall',
    typer: ['partall_oddetall', 'telle_med'],
    stegForType: { telle_med: 2 },
    steg: [
      { tekst: 'Et partall kan deles i to like deler. 6 er 3 og 3.', figur: { visual: { kind: 'mengder', groups: [{ emoji: '🍎', n: 3 }, { emoji: '🍎', n: 3 }] } } },
      { tekst: 'Et oddetall har én til overs. 7 er 3 og 3 og 1. Partall ender på 0, 2, 4, 6 eller 8.', figur: { visual: { kind: 'rekke', items: ['2', '4', '6', '8', '10'] } } },
      { tekst: 'Å telle med 2 er å hoppe over annethvert tall: 2, 4, 6, 8. Med 5: 5, 10, 15, 20.', figur: { visual: { kind: 'rekke', items: ['5', '10', '15', '?', '25'] } } },
    ],
  },
  {
    id: 'm20-veksling',
    fag: 'matte',
    nivaa: 20,
    tittel: 'Pluss og minus med veksling',
    typer: ['tosifret_tosifret_med', 'tosifret_ensifret_med'],
    steg: [
      { tekst: 'Ta tierne først, så enerne. 47 + 38: 47 + 30 = 77.', figur: { hjelp: { kind: 'tiere', a: 47, b: 38, op: 'add' } } },
      { tekst: 'Så enerne: 77 + 8. Fyll opp til 80 med 3, og legg på 5: 85.' },
      { tekst: 'Minus går likt. 72 − 45: 72 − 40 = 32, så 32 − 5. Ned til 30 med 2, og 3 til: 27.', figur: { hjelp: { kind: 'tiere', a: 72, b: 45, op: 'sub' } } },
    ],
  },
  {
    id: 'm21-likhetstegn',
    fag: 'matte',
    nivaa: 21,
    tittel: 'Likhetstegnet og åpne oppgaver',
    typer: ['likhetstegn', 'apen_oppgave'],
    stegForType: { apen_oppgave: 2 },
    steg: [
      { tekst: 'Likhetstegnet betyr «like mye på begge sider». 8 + 5 = 13, og 13 = 8 + 5.', figur: { visual: { kind: 'stor', text: '8 + 5 = 13' } } },
      { tekst: 'Begge sider kan ha regnestykker: 8 + 5 = ? + 6. Venstre side er 13, så høyre må også bli 13. 13 − 6 = 7.', figur: { visual: { kind: 'stor', text: '8 + 5 = ? + 6' } } },
      { tekst: 'Mangler et tall i et regnestykke, regn baklengs. 34 + ? = 50: 50 − 34 = 16.', figur: { visual: { kind: 'stor', text: '34 + ? = 50' } } },
    ],
  },
  {
    id: 'm23-gange',
    fag: 'matte',
    nivaa: 23,
    tittel: 'Gange er like grupper',
    typer: ['gange_grupper', 'gange_rutenett', 'gange_tabell'],
    steg: [
      { tekst: 'Gange er å legge sammen like grupper. 3 grupper med 4 er 4 + 4 + 4 = 12.', figur: { visual: { kind: 'grupper', grupper: 3, per: 4, emoji: '🍎' } } },
      { tekst: 'Vi skriver 3 × 4 = 12. Tegnet × leses «ganger».', figur: { visual: { kind: 'rutenett', rader: 3, kolonner: 4 } } },
      { tekst: 'Et rutenett viser det samme: 3 rader med 4 i hver. Snu det, og du ser at 4 × 3 også er 12.' },
    ],
  },
  {
    id: 'm28-deling',
    fag: 'matte',
    nivaa: 28,
    tittel: 'Deling er gange baklengs',
    typer: ['deling', 'deling_rest'],
    stegForType: { deling_rest: 2 },
    steg: [
      { tekst: 'Deling er å dele likt. 12 kjeks på 3 barn: hver får 4. Vi skriver 12 ÷ 3 = 4.', figur: { visual: { kind: 'grupper', grupper: 3, per: 4, emoji: '🍪' } } },
      { tekst: 'Deling er gange baklengs. 12 ÷ 3 = ? spør: 3 ganger hva er 12? Svaret er 4.', figur: { visual: { kind: 'rutenett', rader: 4, kolonner: 3 } } },
      { tekst: 'Går det ikke opp, blir det rest. 14 ÷ 4: 4 × 3 = 12, og 2 er til overs. Svar: 3, rest 2.' },
    ],
  },
  {
    id: 'm34-negative',
    fag: 'matte',
    nivaa: 34,
    tittel: 'Negative tall',
    typer: ['negative_tall', 'tallinje_plasser'],
    steg: [
      { tekst: 'Tallene fortsetter til venstre for 0. De heter negative tall og har minus foran: −1, −2, −3.', figur: { visual: { kind: 'tallinje', from: -10, to: 10, step: 1, marker: -3 } } },
      { tekst: 'På et termometer er minusgrader under null. −5 grader er kaldere enn 0.', figur: { visual: { kind: 'termometer', temp: -5 } } },
      { tekst: 'Blir det varmere, går vi til høyre på tallinja. −4 + 7: gå 7 steg til høyre fra −4, og du lander på 3.', figur: { hjelp: { kind: 'tallinje', from: -10, to: 10, start: -4 } } },
    ],
  },
  {
    id: 'm35-brok',
    fag: 'matte',
    nivaa: 35,
    tittel: 'Brøk',
    typer: ['brok'],
    steg: [
      { tekst: 'En brøk er deler av en hel. Tallet under sier hvor mange like deler: 4 betyr firedeler.', figur: { visual: { kind: 'brok', deler: 4, farget: 1 } } },
      { tekst: 'Tallet over sier hvor mange deler vi har. 3/4 er tre av fire deler.', figur: { visual: { kind: 'brok', deler: 4, farget: 3 } } },
      { tekst: 'Brøk av en mengde: 1/4 av 12 er 12 ÷ 4 = 3. Da er 3/4 av 12 tre ganger så mye: 9.', figur: { visual: { kind: 'mengde', emoji: '🍓', n: 12 } } },
      { tekst: 'Flere deler betyr mindre biter. 1/2 er større enn 1/3, for halve er større enn tredeler.', figur: { visual: { kind: 'brokpar', x: '1/2', y: '1/3' } } },
    ],
  },
  {
    id: 'm36-desimal',
    fag: 'matte',
    nivaa: 36,
    tittel: 'Desimaltall',
    typer: ['desimal'],
    steg: [
      { tekst: 'Deler vi 1 i ti like deler, får vi tideler. Én tidel skrives 0,1.', figur: { visual: { kind: 'brok', deler: 10, farget: 1 } } },
      { tekst: 'Kommaet skiller hele og tideler. 2,3 er 2 hele og 3 tideler.', figur: { visual: { kind: 'stor', text: '2,3' } } },
      { tekst: 'Pluss går som vanlig, hele for seg og tideler for seg. 2,3 + 1,4 = 3,7.' },
      { tekst: 'Penger er desimaltall: 3 kr og 50 øre er 3,50 kr, for 50 øre er en halv krone.', figur: { visual: { kind: 'stor', text: '3,50 kr' } } },
    ],
  },
  {
    id: 'm37-areal',
    fag: 'matte',
    nivaa: 37,
    tittel: 'Areal, omkrets og koordinater',
    typer: ['areal', 'omkrets', 'koordinater'],
    stegForType: { omkrets: 1, koordinater: 2 },
    steg: [
      { tekst: 'Areal er hvor mange ruter det er inni. Et rektangel på 4 ganger 3 har 4 × 3 = 12 ruter.', figur: { visual: { kind: 'rektangel', l: 4, b: 3 } } },
      { tekst: 'Omkrets er veien rundt. 4 + 3 + 4 + 3 = 14. Du går alle fire sidene.', figur: { visual: { kind: 'rektangel', l: 4, b: 3 } } },
      { tekst: 'Koordinater er en adresse: først bortover, så oppover. (3, 2) er 3 bortover og 2 opp.', figur: { visual: { kind: 'koordinater', points: [{ x: 3, y: 2, label: 'A' }], size: 5 } } },
    ],
  },
  {
    id: 'm38-likning',
    fag: 'matte',
    nivaa: 38,
    tittel: 'Likninger og parenteser',
    typer: ['likning', 'parentes', 'tekst_to_steg'],
    stegForType: { parentes: 2, tekst_to_steg: 3 },
    steg: [
      { tekst: 'I en likning er x et tall vi ikke vet ennå. x + 3 = 7 spør: hva pluss 3 er 7? x = 4.', figur: { visual: { kind: 'stor', text: 'x + 3 = 7' } } },
      { tekst: 'Gjør det samme på begge sider. 2 · x + 1 = 9: ta bort 1 på begge sider, 2 · x = 8. Del på 2: x = 4.' },
      { tekst: 'Parentesen regnes først. 3 × (4 + 2) = 3 × 6 = 18. Uten parentes gjelder gange før pluss: 3 × 4 + 2 = 14.', figur: { visual: { kind: 'stor', text: '3 × (4 + 2)' } } },
      { tekst: 'En tekstoppgave med to steg løses ett steg om gangen. Først 3 pakker med 5: 15. Så 15 − 4 = 11.' },
    ],
  },

  // ------------------------------------------- Lesing: Skrive riktig (1–4) og Språk (1–3)
  {
    id: 'l10-diftonger',
    fag: 'skrive',
    nivaa: 1,
    tittel: 'Diftonger',
    typer: ['skriv_diftonger'],
    steg: [
      { tekst: 'En diftong er to vokaler som glir sammen til én lyd. I «sau» hører du a og u i ett.', figur: { visual: { kind: 'lyder', bokstaver: ['s', 'au'] } } },
      { tekst: 'Vi skriver au, ei og øy. Sau, hei, øy. Ikke av, æi eller øi.', figur: { visual: { kind: 'ordkort', tekst: 'sau · hei · øy' } } },
      { tekst: 'Hører du en lyd som glir, tenk: er det au, ei eller øy? Hai og mai skrives med ai.' },
    ],
  },
  {
    id: 'l11-kj-skj',
    fag: 'skrive',
    nivaa: 2,
    tittel: 'Kj og skj',
    typer: ['skriv_kj_skj'],
    steg: [
      { tekst: 'Kj-lyden er myk, som i kjole og kjeks. Den skrives kj, og foran i og y bare k: kino, kysse.', figur: { visual: { kind: 'ordkort', tekst: 'kjole · kino' } } },
      { tekst: 'Skj-lyden er sterkere, som i skje og skjerf. Foran i og y skrives den bare sk: ski, sky.', figur: { visual: { kind: 'ordkort', tekst: 'skje · ski' } } },
      { tekst: 'Si ordet høyt. Hører du en myk kj eller en susende skj? Kjøre, men skjorte.' },
    ],
  },
  {
    id: 'l12-dobbel',
    fag: 'skrive',
    nivaa: 3,
    tittel: 'Dobbel konsonant',
    typer: ['skriv_dobbel_konsonant'],
    steg: [
      { tekst: 'Når vokalen er kort, skriver vi ofte to like konsonanter etter. Hatt har kort a, hat har lang a.', figur: { visual: { kind: 'ordkort', tekst: 'hatt · hat' } } },
      { tekst: 'Si ordet langsomt. Er vokalen kort og rask? Da er det dobbel: katt, buss, sokk, natt.', figur: { visual: { kind: 'ordkort', tekst: 'katt · buss' } } },
      { tekst: 'Unntak: m er nesten aldri dobbel til slutt. Vi skriver «kom» og «hjem», men «sommer» inni ordet.' },
    ],
  },
  {
    id: 'l13-stum-sammensatt',
    fag: 'skrive',
    nivaa: 4,
    tittel: 'Stumme bokstaver og sammensatte ord',
    typer: ['skriv_stum_h_g', 'skriv_sammensatte'],
    stegForType: { skriv_sammensatte: 2 },
    steg: [
      { tekst: 'Noen bokstaver skrives, men høres ikke. H-en i hjul, hjerte og hvit er stum.', figur: { visual: { kind: 'ordkort', tekst: 'hjul · hvit' } } },
      { tekst: 'G-en i gjest og gjerde er også stum: ordet begynner med gj, men du hører bare j. I deig er g-en stum til slutt.', figur: { visual: { kind: 'ordkort', tekst: 'gjest · deig' } } },
      { tekst: 'Sammensatte ord er to ord som blir ett, skrevet i ett: fot + ball = fotball. Aldri mellomrom.', figur: { visual: { kind: 'ordkort', tekst: 'fot + ball = fotball' } } },
    ],
  },
  {
    id: 'l14-ordklasser',
    fag: 'sprak',
    nivaa: 1,
    tittel: 'Ordklasser',
    typer: ['ordklasse'],
    steg: [
      { tekst: 'Et substantiv er navn på ting, dyr og mennesker: hund, bok, Oslo. Du kan si en, ei eller et foran.', figur: { visual: { kind: 'ordkort', tekst: 'en hund · ei bok' } } },
      { tekst: 'Et verb er noe du gjør: løpe, spise, sove. Du kan si å foran.', figur: { visual: { kind: 'ordkort', tekst: 'å løpe · å sove' } } },
      { tekst: 'Et adjektiv forteller hvordan noe er: stor, rød, glad. Det beskriver et substantiv.', figur: { visual: { kind: 'ordkort', tekst: 'en stor, rød ball' } } },
    ],
  },
  {
    id: 'l15-boying',
    fag: 'sprak',
    nivaa: 2,
    tittel: 'Bøying',
    typer: ['boying'],
    steg: [
      { tekst: 'Ord skifter form. Én bil, to biler. Én katt, mange katter. Flertall får oftest -er.', figur: { visual: { kind: 'ordkort', tekst: 'bil → biler' } } },
      { tekst: 'Noen ord endrer seg ikke: ett hus, to hus. Ett barn, mange barn. Og noen skifter vokal: en bok, flere bøker.' },
      { tekst: 'Verb skifter tid. I dag leker jeg, i går lekte jeg. I dag løper han, i går løp han.', figur: { visual: { kind: 'ordkort', tekst: 'leker → lekte' } } },
    ],
  },
  {
    id: 'l16-motsetning-tegn',
    fag: 'sprak',
    nivaa: 3,
    tittel: 'Motsetninger og tegnsetting',
    typer: ['motsetning', 'tegnsetting', 'stor_bokstav'],
    stegForType: { tegnsetting: 1, stor_bokstav: 2 },
    steg: [
      { tekst: 'Motsetninger er ord som betyr det motsatte: varm og kald, stor og liten, opp og ned.', figur: { visual: { kind: 'ordkort', tekst: 'varm ↔ kald' } } },
      { tekst: 'En setning slutter med punktum. Et spørsmål får spørsmålstegn, og et rop får utropstegn. Hva heter du? Se opp!', figur: { visual: { kind: 'ordkort', tekst: '. ? !' } } },
      { tekst: 'Stor bokstav først i setningen, og i navn på folk og steder: Ida bor i Oslo.', figur: { visual: { kind: 'ordkort', tekst: 'Ida bor i Oslo.' } } },
    ],
  },
]

export function laerkortForNivaa(fag, nivaa) {
  return LAERKORT.find((k) => k.fag === fag && k.nivaa === nivaa) || null
}

export function laerkortForType(fag, type) {
  return LAERKORT.find((k) => k.fag === fag && k.typer.includes(type)) || null
}

// Steget som vises etter to gale svar på en oppgavetype.
export function stegForType(fag, type) {
  const k = laerkortForType(fag, type)
  if (!k) return null
  const i = k.stegForType?.[type] ?? 0
  return { kort: k, steg: k.steg[Math.min(i, k.steg.length - 1)], index: Math.min(i, k.steg.length - 1) }
}
