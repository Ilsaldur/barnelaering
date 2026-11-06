// ============================================================================
// UTKAST – ikke gjennomlest av Jon ennå. Alt innhold i lesestigen ligger her og
// kan redigeres fritt: bokstaver, ordlister, setninger, tekster, rettskriving
// og språk. Enkelt bokmål. Fjern denne merknaden når du har lest gjennom.
// ============================================================================

// Bokstavene i den rekkefølgen de læres. `lyd` er slik lyden leses opp,
// `ord` er et eksempelord med bilde.
export const BOKSTAVER = [
  { b: 'i', lyd: 'i', ord: 'is', emoji: '🍦' },
  { b: 's', lyd: 'sss', ord: 'sol', emoji: '☀️' },
  { b: 'o', lyd: 'o', ord: 'ost', emoji: '🧀' },
  { b: 'l', lyd: 'lll', ord: 'lam', emoji: '🐑' },
  { b: 'e', lyd: 'e', ord: 'elg', emoji: '🦌' },
  { b: 'v', lyd: 'vvv', ord: 'vann', emoji: '💧' },
  { b: 'a', lyd: 'a', ord: 'ape', emoji: '🐒' },
  { b: 't', lyd: 't', ord: 'tog', emoji: '🚂' },
  { b: 'b', lyd: 'b', ord: 'bil', emoji: '🚗' },
  { b: 'ø', lyd: 'ø', ord: 'øy', emoji: '🏝️' },
  { b: 'm', lyd: 'mmm', ord: 'mus', emoji: '🐭' },
  { b: 'å', lyd: 'å', ord: 'ål', emoji: '🐍' },
  { b: 'j', lyd: 'jjj', ord: 'jul', emoji: '🎄' },
  { b: 'r', lyd: 'rrr', ord: 'rev', emoji: '🦊' },
  { b: 'd', lyd: 'd', ord: 'due', emoji: '🕊️' },
  { b: 'u', lyd: 'u', ord: 'ugle', emoji: '🦉' },
  { b: 'g', lyd: 'g', ord: 'gul', emoji: '🟡' },
  { b: 'n', lyd: 'nnn', ord: 'nese', emoji: '👃' },
  { b: 'p', lyd: 'p', ord: 'pil', emoji: '🏹' },
  { b: 'y', lyd: 'y', ord: 'yr', emoji: '🌧️' },
  { b: 'h', lyd: 'h', ord: 'hus', emoji: '🏠' },
  { b: 'f', lyd: 'fff', ord: 'fisk', emoji: '🐟' },
  { b: 'k', lyd: 'k', ord: 'ku', emoji: '🐮' },
  { b: 'æ', lyd: 'æ', ord: 'ærlig', emoji: '🤝' },
]

// Lydrette ord med bilde, til lydering og lesing av ord. Bare små bokstaver.
export const LYDRETTE_ORD = [
  { ord: 'is', emoji: '🍦' },
  { ord: 'sol', emoji: '☀️' },
  { ord: 'ost', emoji: '🧀' },
  { ord: 'sel', emoji: '🦭' },
  { ord: 'elv', emoji: '🏞️' },
  { ord: 'avis', emoji: '📰' },
  { ord: 'vase', emoji: '🏺' },
  { ord: 'lås', emoji: '🔒' },
  { ord: 'tå', emoji: '🦶' },
  { ord: 'mus', emoji: '🐭' },
  { ord: 'bil', emoji: '🚗' },
  { ord: 'hus', emoji: '🏠' },
  { ord: 'båt', emoji: '⛵' },
  { ord: 'bok', emoji: '📖' },
  { ord: 'ku', emoji: '🐮' },
  { ord: 'tog', emoji: '🚂' },
  { ord: 'rev', emoji: '🦊' },
  { ord: 'fly', emoji: '✈️' },
  { ord: 'fisk', emoji: '🐟' },
  { ord: 'kake', emoji: '🍰' },
  { ord: 'pil', emoji: '🏹' },
  { ord: 'måne', emoji: '🌙' },
  { ord: 'due', emoji: '🕊️' },
  { ord: 'ugle', emoji: '🦉' },
  { ord: 'ulv', emoji: '🐺' },
  { ord: 'nese', emoji: '👃' },
  { ord: 'hest', emoji: '🐴' },
  { ord: 'lam', emoji: '🐑' },
  { ord: 'bie', emoji: '🐝' },
  { ord: 'mat', emoji: '🍲' },
  { ord: 'bad', emoji: '🛁' },
  { ord: 'gul', emoji: '🟡' },
  { ord: 'blå', emoji: '🔵' },
  { ord: 'rose', emoji: '🌹' },
  { ord: 'kanin', emoji: '🐰' },
  { ord: 'banan', emoji: '🍌' },
  { ord: 'sko', emoji: '👟' },
  { ord: 'melon', emoji: '🍉' },
]

// Vanlige ord barnet må kjenne igjen som helord.
export const VANLIGE_ORD = ['jeg', 'er', 'og', 'det', 'de', 'som', 'en', 'et', 'på', 'til', 'har', 'ikke', 'kan', 'vi', 'du', 'han', 'hun', 'med', 'for', 'var', 'skal', 'her', 'der', 'seg', 'av']

// Korte setninger: hvilket bilde passer? `svar` er bildet som passer,
// `feil` er bilder som ikke passer.
export const SETNINGER = [
  { tekst: 'Katten sover.', svar: '🐱', feil: ['🐶', '🐟', '🐦'] },
  { tekst: 'Jeg har en rød bil.', svar: '🚗', feil: ['🚲', '✈️', '⛵'] },
  { tekst: 'Sola skinner.', svar: '☀️', feil: ['🌧️', '🌙', '❄️'] },
  { tekst: 'Hunden løper i parken.', svar: '🐶', feil: ['🐱', '🐮', '🐸'] },
  { tekst: 'Vi spiser is.', svar: '🍦', feil: ['🍎', '🍕', '🥕'] },
  { tekst: 'Det regner i dag.', svar: '🌧️', feil: ['☀️', '🌈', '⛄'] },
  { tekst: 'Han leser en bok.', svar: '📖', feil: ['📺', '🎸', '⚽'] },
  { tekst: 'Fisken svømmer i vannet.', svar: '🐟', feil: ['🐦', '🐴', '🐝'] },
  { tekst: 'Hun har på seg lue.', svar: '🧢', feil: ['👟', '🧤', '👗'] },
  { tekst: 'Toget er langt.', svar: '🚂', feil: ['🚗', '🚲', '🛴'] },
  { tekst: 'Vi bygger en snømann.', svar: '⛄', feil: ['🏖️', '🌻', '🍁'] },
  { tekst: 'Fuglen flyr høyt.', svar: '🐦', feil: ['🐟', '🐢', '🐌'] },
  { tekst: 'Jeg spiser et eple.', svar: '🍎', feil: ['🍌', '🍞', '🧀'] },
  { tekst: 'Ballen er rund.', svar: '⚽', feil: ['📏', '📦', '📐'] },
  { tekst: 'Pappa baker brød.', svar: '🍞', feil: ['🍝', '🥗', '🍦'] },
  { tekst: 'Det er natt og månen lyser.', svar: '🌙', feil: ['☀️', '🌈', '⛅'] },
  { tekst: 'Kua sier mø.', svar: '🐮', feil: ['🐷', '🐑', '🐔'] },
  { tekst: 'Vi drar på ferie med fly.', svar: '✈️', feil: ['🚂', '🚌', '🚢'] },
  { tekst: 'Blomsten er gul.', svar: '🌻', feil: ['🌹', '🌵', '🌲'] },
  { tekst: 'Mamma drikker kaffe.', svar: '☕', feil: ['🥛', '🧃', '🍵'] },
]

// Tekster på 40–120 ord med to–tre spørsmål. `type` er 'fakta' (står i teksten)
// eller 'mening' (hva tror du / hva ville du). Siste spørsmål kan være
// «Fakta eller mening?» om en påstand.
export const TEKSTER = [
  {
    id: 'rev-skog',
    tittel: 'Reven i skogen',
    tekst: 'Reven bor i skogen. Den har rød pels og en stor, lodden hale. Om dagen sover reven i hiet sitt. Om natten går den ut for å finne mat. Reven liker mus, bær og egg. Den kan høre en mus som pusler under snøen. Da hopper den høyt opp og lander med nesen først.',
    sporsmaal: [
      { q: 'Hva slags pels har reven?', alternativer: ['Rød', 'Grå', 'Hvit', 'Svart'], svar: 'Rød', type: 'fakta' },
      { q: 'Når sover reven?', alternativer: ['Om dagen', 'Om natten', 'Om morgenen', 'Aldri'], svar: 'Om dagen', type: 'fakta' },
      { q: '«Reven er det fineste dyret i skogen.» Er det fakta eller mening?', alternativer: ['Mening', 'Fakta'], svar: 'Mening', type: 'faktamening' },
    ],
  },
  {
    id: 'ida-sykkel',
    tittel: 'Ida lærer å sykle',
    tekst: 'Ida har fått en ny sykkel. Den er blå med hvite striper. Pappa holder i setet mens Ida tråkker. «Ikke slipp!» roper Ida. Pappa slipper likevel. Ida sykler helt alene bortover veien. Hun ler høyt. Så velter hun i gresset, men det gjør ikke vondt. Ida reiser seg og sykler igjen.',
    sporsmaal: [
      { q: 'Hvilken farge har sykkelen?', alternativer: ['Blå med hvite striper', 'Rød', 'Grønn', 'Gul med svarte prikker'], svar: 'Blå med hvite striper', type: 'fakta' },
      { q: 'Hva gjør Ida etter at hun velter?', alternativer: ['Sykler igjen', 'Gråter', 'Går hjem', 'Ringer mamma'], svar: 'Sykler igjen', type: 'fakta' },
      { q: 'Hvem holder i setet først?', alternativer: ['Pappa', 'Mamma', 'Ida selv', 'En nabo'], svar: 'Pappa', type: 'fakta' },
    ],
  },
  {
    id: 'pingvin',
    tittel: 'Pingviner',
    tekst: 'Pingviner er fugler, men de kan ikke fly. I stedet er de gode til å svømme. Vingene deres er som små årer. Pingviner bor der det er kaldt, helt sør på jorda. De har tykt fettlag og tette fjær som holder dem varme. Når det er veldig kaldt, står de tett sammen i en stor flokk. Pappa-pingvinen passer egget på føttene sine i mange uker.',
    sporsmaal: [
      { q: 'Hva er pingviner gode til?', alternativer: ['Å svømme', 'Å fly', 'Å klatre', 'Å grave'], svar: 'Å svømme', type: 'fakta' },
      { q: 'Hvem passer egget?', alternativer: ['Pappa-pingvinen', 'Mamma-pingvinen', 'Bestemor', 'Ingen'], svar: 'Pappa-pingvinen', type: 'fakta' },
      { q: '«Pingviner kan ikke fly.» Er det fakta eller mening?', alternativer: ['Fakta', 'Mening'], svar: 'Fakta', type: 'faktamening' },
    ],
  },
  {
    id: 'noah-matpakke',
    tittel: 'Matpakken',
    tekst: 'Noah åpner matpakken sin. Der ligger to brødskiver med ost og et eple. Han ser bort på Sara. Hun har glemt matpakken hjemme og ser lei seg ut. Noah tenker seg om. Så gir han Sara den ene brødskiven. «Takk,» sier Sara og smiler. De deler eplet også. Etterpå løper de ut og leker sisten i friminuttet.',
    sporsmaal: [
      { q: 'Hva har Noah i matpakken?', alternativer: ['Brødskiver med ost og et eple', 'Pizza', 'Pølse og brus', 'Banan og yoghurt'], svar: 'Brødskiver med ost og et eple', type: 'fakta' },
      { q: 'Hvorfor er Sara lei seg?', alternativer: ['Hun har glemt matpakken', 'Hun har slått seg', 'Hun har mistet lua', 'Hun er syk'], svar: 'Hun har glemt matpakken', type: 'fakta' },
      { q: 'Hva gjør de etter maten?', alternativer: ['Leker sisten', 'Leser bok', 'Spiller fotball', 'Går hjem'], svar: 'Leker sisten', type: 'fakta' },
    ],
  },
  {
    id: 'regnbue',
    tittel: 'Regnbuen',
    tekst: 'Har du sett en regnbue? Den kommer når sola skinner og det regner samtidig. Lyset fra sola går gjennom regndråpene og deles opp i farger. Regnbuen har alltid de samme fargene i samme rekkefølge: rød, oransje, gul, grønn, blå og fiolett. Rød er alltid ytterst. Du kan lage din egen regnbue med en hageslange en solrik dag. Stå med ryggen mot sola og sprut vannet opp i lufta.',
    sporsmaal: [
      { q: 'Når kommer regnbuen?', alternativer: ['Når sola skinner og det regner', 'Bare om natten', 'Når det snør', 'Når det er tåke'], svar: 'Når sola skinner og det regner', type: 'fakta' },
      { q: 'Hvilken farge er ytterst?', alternativer: ['Rød', 'Blå', 'Grønn', 'Gul'], svar: 'Rød', type: 'fakta' },
      { q: 'Hvordan kan du lage din egen regnbue?', alternativer: ['Sprute vann med ryggen mot sola', 'Tegne på et ark', 'Rope høyt', 'Hoppe i en dam'], svar: 'Sprute vann med ryggen mot sola', type: 'fakta' },
    ],
  },
  {
    id: 'bestefar-hytte',
    tittel: 'På hytta med bestefar',
    tekst: 'Hver sommer drar Leo på hytta til bestefar. Hytta ligger ved et vann med klart, kaldt vann. Om morgenen fisker de fra brygga. Leo har fått sin egen fiskestang. Første dagen får han ingen fisk, bare en gammel støvel. Bestefar ler så han rister. Dagen etter napper det ordentlig. Leo drar opp en stor ørret. Den steker de på bålet om kvelden, og Leo synes det er den beste maten han har smakt.',
    sporsmaal: [
      { q: 'Hva får Leo første dagen?', alternativer: ['En gammel støvel', 'En stor ørret', 'En krabbe', 'Ingenting'], svar: 'En gammel støvel', type: 'fakta' },
      { q: 'Hvor steker de fisken?', alternativer: ['På bålet', 'På kjøkkenet', 'I ovnen', 'På grillen i byen'], svar: 'På bålet', type: 'fakta' },
      { q: '«Ørret er den beste maten som finnes.» Er det fakta eller mening?', alternativer: ['Mening', 'Fakta'], svar: 'Mening', type: 'faktamening' },
    ],
  },
  {
    id: 'maur',
    tittel: 'Maur er sterke',
    tekst: 'En maur er liten, men veldig sterk. Den kan bære ting som veier mye mer enn den selv. Tenk om du kunne løfte en bil! Maur bor sammen i en tue. Der kan det bo flere tusen maur. Alle har en jobb. Noen henter mat, noen passer eggene, og noen vokter inngangen. Dronningen legger alle eggene. Mauren finner veien hjem ved å følge lukten de andre maurene har lagt igjen.',
    sporsmaal: [
      { q: 'Hvordan finner mauren veien hjem?', alternativer: ['Den følger lukt', 'Den ser på sola', 'Den spør en venn', 'Den husker veien'], svar: 'Den følger lukt', type: 'fakta' },
      { q: 'Hvem legger eggene?', alternativer: ['Dronningen', 'Vaktene', 'Alle maurene', 'Ingen'], svar: 'Dronningen', type: 'fakta' },
      { q: 'Hvor bor maurene?', alternativer: ['I en tue', 'I et tre', 'Under vann', 'I et hus'], svar: 'I en tue', type: 'fakta' },
    ],
  },
  {
    id: 'mia-tann',
    tittel: 'Mias første tann',
    tekst: 'Mia har en tann som er løs. Hun vrikker på den med tunga hele dagen. «La den være,» sier mamma. Men Mia klarer ikke å la være. Om kvelden spiser hun et hardt eple. Knekk! Tannen sitter fast i eplet. Mia ler og viser hullet i munnen til alle. Hun legger tannen under puta. Neste morgen er tannen borte, og der ligger en blank mynt.',
    sporsmaal: [
      { q: 'Hva skjer når Mia spiser eplet?', alternativer: ['Tannen løsner', 'Hun blir mett', 'Eplet er surt', 'Hun får vondt i magen'], svar: 'Tannen løsner', type: 'fakta' },
      { q: 'Hva ligger under puta neste morgen?', alternativer: ['En mynt', 'Tannen', 'Et eple', 'En lapp'], svar: 'En mynt', type: 'fakta' },
      { q: 'Hva sier mamma om den løse tannen?', alternativer: ['La den være', 'Dra den ut', 'Spis et eple', 'Gå til tannlegen'], svar: 'La den være', type: 'fakta' },
    ],
  },
  {
    id: 'kattungen',
    tittel: 'Kattungen',
    tekst: 'Mille har fått en kattunge. Den er grå med hvite poter og heter Lykke. Lykke liker å sove i en skoeske ved ovnen. Når Mille kommer hjem fra skolen, løper Lykke mot henne og maler. Om kvelden leker de med et garnnøste. Lykke hopper etter nøstet til hun blir trøtt. Da krøller hun seg sammen i esken og sover.',
    sporsmaal: [
      { q: 'Hva heter kattungen?', alternativer: ['Lykke', 'Mille', 'Nøste', 'Grå'], svar: 'Lykke', type: 'fakta' },
      { q: 'Hvor liker Lykke å sove?', alternativer: ['I en skoeske', 'I senga', 'På taket', 'I en kurv'], svar: 'I en skoeske', type: 'fakta' },
      { q: 'Hva leker de med om kvelden?', alternativer: ['Et garnnøste', 'En ball', 'En fjær', 'En bil'], svar: 'Et garnnøste', type: 'fakta' },
    ],
  },
  {
    id: 'skolevei',
    tittel: 'Veien til skolen',
    tekst: 'Hver morgen går Jon til skolen sammen med naboen Lea. De går forbi en bakeri som lukter boller. Så krysser de veien ved lysene. De venter alltid på grønn mann. Ved skolen står læreren og vinker. Jon og Lea liker best fredagene, for da har de gym.',
    sporsmaal: [
      { q: 'Hvem går Jon til skolen med?', alternativer: ['Naboen Lea', 'Mamma', 'Læreren', 'Broren sin'], svar: 'Naboen Lea', type: 'fakta' },
      { q: 'Hva venter de på ved lysene?', alternativer: ['Grønn mann', 'Bussen', 'Læreren', 'En bil'], svar: 'Grønn mann', type: 'fakta' },
      { q: 'Hvilken dag liker de best?', alternativer: ['Fredag', 'Mandag', 'Lørdag', 'Onsdag'], svar: 'Fredag', type: 'fakta' },
    ],
  },
  {
    id: 'snomann',
    tittel: 'Snømannen',
    tekst: 'Det har snødd hele natten. Emil og Sara løper ut i hagen. De ruller tre store snøballer og setter dem oppå hverandre. Sara finner en gulrot til nese og to steiner til øyne. Emil setter pappas gamle lue på toppen. Snømannen smiler. De kaller ham Bjarne.',
    sporsmaal: [
      { q: 'Hvor mange snøballer ruller de?', alternativer: ['Tre', 'To', 'Fire', 'Fem'], svar: 'Tre', type: 'fakta' },
      { q: 'Hva bruker Sara til nese?', alternativer: ['En gulrot', 'En stein', 'En pinne', 'En kongle'], svar: 'En gulrot', type: 'fakta' },
      { q: 'Hva heter snømannen?', alternativer: ['Bjarne', 'Emil', 'Pappa', 'Sara'], svar: 'Bjarne', type: 'fakta' },
    ],
  },
  {
    id: 'busstur',
    tittel: 'Bussturen',
    tekst: 'Klassen skal på tur til museet. De tar bussen klokka ni. Ali får sitte ved vinduet. Han ser kuer, en traktor og en elv. På museet ser de et skjelett av en hval. Det er lengre enn hele klasserommet. Etterpå spiser de matpakke i parken. Ali tenker at hvaler må være de største dyrene i verden.',
    sporsmaal: [
      { q: 'Når tar de bussen?', alternativer: ['Klokka ni', 'Klokka åtte', 'Klokka ti', 'Klokka tolv'], svar: 'Klokka ni', type: 'fakta' },
      { q: 'Hva ser de på museet?', alternativer: ['Et skjelett av en hval', 'En dinosaur', 'Et fly', 'En robot'], svar: 'Et skjelett av en hval', type: 'fakta' },
      { q: 'Hvor spiser de matpakke?', alternativer: ['I parken', 'På bussen', 'I klasserommet', 'På museet'], svar: 'I parken', type: 'fakta' },
    ],
  },
  {
    id: 'bakedag',
    tittel: 'Bakedag',
    tekst: 'Bestemor og Oda skal bake boller. De måler mel, sukker og gjær. Oda knekker to egg i bollen. Deigen må hvile i en time. Mens de venter, spiller de kort. Så triller de tjue runde boller og setter dem i ovnen. Snart lukter det nydelig i hele huset. Oda får den første bollen, varm med smør.',
    sporsmaal: [
      { q: 'Hvor mange egg knekker Oda?', alternativer: ['To', 'Ett', 'Tre', 'Fire'], svar: 'To', type: 'fakta' },
      { q: 'Hva gjør de mens deigen hviler?', alternativer: ['Spiller kort', 'Ser på TV', 'Går en tur', 'Vasker opp'], svar: 'Spiller kort', type: 'fakta' },
      { q: 'Hvor mange boller lager de?', alternativer: ['Tjue', 'Ti', 'Tolv', 'Tretti'], svar: 'Tjue', type: 'fakta' },
    ],
  },
  {
    id: 'fotballkamp',
    tittel: 'Kampen',
    tekst: 'Det er kamp på lørdag. Noor spiller på laget med de grønne draktene. I første omgang scorer det andre laget. Noor blir lei seg, men treneren sier at kampen ikke er over. I andre omgang får Noor ballen. Hun løper forbi to spillere og skyter. Mål! Kampen ender uavgjort, én mot én. Hele laget jubler likevel.',
    sporsmaal: [
      { q: 'Hvilken farge har draktene til Noor?', alternativer: ['Grønne', 'Røde', 'Blå', 'Gule'], svar: 'Grønne', type: 'fakta' },
      { q: 'Hvem scorer først?', alternativer: ['Det andre laget', 'Noor', 'Treneren', 'Ingen'], svar: 'Det andre laget', type: 'fakta' },
      { q: 'Hvordan ender kampen?', alternativer: ['Uavgjort, én mot én', 'Noor sitt lag vinner', 'Det andre laget vinner', 'Kampen blir avlyst'], svar: 'Uavgjort, én mot én', type: 'fakta' },
    ],
  },
  {
    id: 'fuglebrett',
    tittel: 'Fuglebrettet',
    tekst: 'Om vinteren henger pappa opp et fuglebrett utenfor kjøkkenvinduet. Theo fyller det med frø hver morgen. Først kommer kjøttmeisene. De er små og gule på magen. Så kommer en skjære som jager de små vekk. Theo banker på ruta, og skjæra flyr. Da kommer meisene tilbake. Theo teller sju av dem.',
    sporsmaal: [
      { q: 'Hvem fyller brettet med frø?', alternativer: ['Theo', 'Pappa', 'Mamma', 'Skjæra'], svar: 'Theo', type: 'fakta' },
      { q: 'Hvilken farge har kjøttmeisene på magen?', alternativer: ['Gul', 'Rød', 'Blå', 'Svart'], svar: 'Gul', type: 'fakta' },
      { q: 'Hvor mange meiser teller Theo?', alternativer: ['Sju', 'Fem', 'Ti', 'Tre'], svar: 'Sju', type: 'fakta' },
    ],
  },
  {
    id: 'bading',
    tittel: 'Første bad i sjøen',
    tekst: 'Det er sommer, og familien er på hytta. Vannet er kaldt, sier mamma, men Iver vil bade. Han går sakte uti. Først til knærne, så til magen. Så tar han sats og dykker. Vannet er iskaldt, men Iver ler. Han svømmer bort til flåten og klatrer opp. Der ligger han i sola til han er tørr. Så hopper han uti igjen.',
    sporsmaal: [
      { q: 'Hvor er familien?', alternativer: ['På hytta', 'Hjemme', 'På skolen', 'I byen'], svar: 'På hytta', type: 'fakta' },
      { q: 'Hvordan er vannet?', alternativer: ['Iskaldt', 'Varmt', 'Skittent', 'Dypt og mørkt'], svar: 'Iskaldt', type: 'fakta' },
      { q: 'Hvor svømmer Iver?', alternativer: ['Til flåten', 'Til stranda', 'Til båten', 'Rundt holmen'], svar: 'Til flåten', type: 'fakta' },
    ],
  },
]

// Rettskriving: ord gruppert etter det som er vanskelig. `feil` er vanlige
// feilskrivinger. Brukes både til «skriv ordet du hører» og «hvilket er riktig?».
export const RETTSKRIVING = {
  diftonger: [
    { ord: 'sau', emoji: '🐑', feil: ['sav', 'sæu', 'saw'] },
    { ord: 'øy', emoji: '🏝️', feil: ['øi', 'øj', 'oy'] },
    { ord: 'hai', emoji: '🦈', feil: ['hæi', 'haj', 'hay'] },
    { ord: 'hei', emoji: '👋', feil: ['hæi', 'hej', 'hai'] },
    { ord: 'stein', emoji: '🪨', feil: ['stæin', 'stain', 'stejn'] },
    { ord: 'rein', emoji: '🦌', feil: ['ræin', 'rain', 'rejn'] },
    { ord: 'tau', emoji: '🪢', feil: ['tav', 'tæu', 'taw'] },
    { ord: 'mai', emoji: '🌷', feil: ['mæi', 'maj', 'may'] },
    { ord: 'høy', emoji: '🌾', feil: ['høi', 'høj', 'hoy'] },
    { ord: 'gøy', emoji: '🎉', feil: ['gøi', 'gøj', 'goy'] },
  ],
  kj_skj: [
    { ord: 'kjole', emoji: '👗', feil: ['skjole', 'kole', 'jole'] },
    { ord: 'skje', emoji: '🥄', feil: ['kje', 'sje', 'skie'] },
    { ord: 'kjeks', emoji: '🍪', feil: ['skjeks', 'keks', 'sjeks'] },
    { ord: 'skjorte', emoji: '👔', feil: ['kjorte', 'sjorte', 'skorte'] },
    { ord: 'skjerf', emoji: '🧣', feil: ['kjerf', 'sjerf', 'skerf'] },
    { ord: 'kjøtt', emoji: '🥩', feil: ['skjøtt', 'kjøt', 'sjøtt'] },
    { ord: 'ski', emoji: '🎿', feil: ['skji', 'sji', 'kji'] },
    { ord: 'kino', emoji: '🎬', feil: ['kjino', 'skjino', 'chino'] },
    { ord: 'skjegg', emoji: '🧔', feil: ['kjegg', 'sjegg', 'skjeg'] },
    { ord: 'kjøre', emoji: '🚗', feil: ['skjøre', 'kjore', 'sjøre'] },
  ],
  dobbel_konsonant: [
    { ord: 'ball', emoji: '⚽', feil: ['bal', 'balll', 'baal'] },
    { ord: 'katt', emoji: '🐱', feil: ['kat', 'kaat', 'katte'] },
    { ord: 'hatt', emoji: '🎩', feil: ['hat', 'haat', 'hatte'] },
    { ord: 'buss', emoji: '🚌', feil: ['bus', 'buus', 'busse'] },
    { ord: 'sokk', emoji: '🧦', feil: ['sok', 'sock', 'sokke'] },
    { ord: 'egg', emoji: '🥚', feil: ['eg', 'ægg', 'egge'] },
    { ord: 'natt', emoji: '🌙', feil: ['nat', 'naat', 'natte'] },
    { ord: 'klokke', emoji: '⏰', feil: ['kloke', 'klocke', 'klokk'] },
    { ord: 'vann', emoji: '💧', feil: ['van', 'vaan', 'vand'] },
    { ord: 'troll', emoji: '👹', feil: ['trol', 'trold', 'trolll'] },
    { ord: 'bukk', emoji: '🐐', feil: ['buk', 'buck', 'bukke'] },
    { ord: 'sommer', emoji: '☀️', feil: ['somer', 'sommar', 'såmmer'] },
  ],
  stum_h_g: [
    { ord: 'hjul', emoji: '🛞', feil: ['jul', 'hjull', 'hul'] },
    { ord: 'hjerte', emoji: '❤️', feil: ['jerte', 'hjærte', 'hjerta'] },
    { ord: 'hvit', emoji: '⬜', feil: ['vit', 'hvitt', 'hwit'] },
    { ord: 'hval', emoji: '🐋', feil: ['val', 'hvall', 'kval'] },
    { ord: 'hjelm', emoji: '⛑️', feil: ['jelm', 'hjælm', 'helm'] },
    { ord: 'hjem', emoji: '🏠', feil: ['jem', 'hjæm', 'hem'] },
    { ord: 'gjest', emoji: '🙋', feil: ['jest', 'gest', 'gjæst'] },
    { ord: 'gjerde', emoji: '🚧', feil: ['jerde', 'gerde', 'gjære'] },
    { ord: 'deig', emoji: '🍞', feil: ['dei', 'deik', 'dæig'] },
    { ord: 'gjøre', emoji: '🔨', feil: ['jøre', 'gøre', 'gjore'] },
  ],
  sammensatte: [
    { ord: 'fotball', emoji: '⚽', feil: ['fot ball', 'fotbal', 'fottball'] },
    { ord: 'solbriller', emoji: '🕶️', feil: ['sol briller', 'solbriler', 'solbrille'] },
    { ord: 'regnbue', emoji: '🌈', feil: ['regn bue', 'reinbue', 'regnbu'] },
    { ord: 'snømann', emoji: '⛄', feil: ['snø mann', 'snøman', 'snemann'] },
    { ord: 'brannbil', emoji: '🚒', feil: ['brann bil', 'branbil', 'brandbil'] },
    { ord: 'tannbørste', emoji: '🪥', feil: ['tann børste', 'tanbørste', 'tannbøste'] },
    { ord: 'isbjørn', emoji: '🐻‍❄️', feil: ['is bjørn', 'isbjørnn', 'ispjørn'] },
    { ord: 'skolesekk', emoji: '🎒', feil: ['skole sekk', 'skolesek', 'skolsekk'] },
    { ord: 'jordbær', emoji: '🍓', feil: ['jord bær', 'jorbær', 'jordber'] },
    { ord: 'badeand', emoji: '🦆', feil: ['bade and', 'badand', 'badeann'] },
  ],
}

// Språk: ordklasser, bøying, motsetninger og tegnsetting.
export const ORDKLASSER = {
  substantiv: ['hund', 'bil', 'hus', 'eple', 'jente', 'skole', 'sol', 'bok', 'katt', 'stol'],
  verb: ['løpe', 'spise', 'sove', 'lese', 'hoppe', 'synge', 'le', 'svømme', 'tegne', 'gå'],
  adjektiv: ['rød', 'stor', 'glad', 'liten', 'varm', 'myk', 'rask', 'sulten', 'gul', 'kald'],
}
export const ORDKLASSE_NAVN = { substantiv: 'substantiv (navn på ting)', verb: 'verb (noe man gjør)', adjektiv: 'adjektiv (hvordan noe er)' }

export const BOYING = [
  { setning: 'Én bil, to ___', svar: 'biler', feil: ['bilar', 'bils', 'bilene'] },
  { setning: 'Én katt, mange ___', svar: 'katter', feil: ['kattar', 'katts', 'kattene'] },
  { setning: 'Ett hus, to ___', svar: 'hus', feil: ['huser', 'husar', 'husene'] },
  { setning: 'Ett barn, mange ___', svar: 'barn', feil: ['barner', 'barnar', 'barne'] },
  { setning: 'Én bok, flere ___', svar: 'bøker', feil: ['boker', 'bokar', 'bøkene'] },
  { setning: 'Én mann, to ___', svar: 'menn', feil: ['manner', 'mannar', 'mennene'] },
  { setning: 'I dag leker jeg. I går ___ jeg.', svar: 'lekte', feil: ['leker', 'leke', 'lekt'] },
  { setning: 'I dag spiser vi. I går ___ vi.', svar: 'spiste', feil: ['spiser', 'spise', 'spist'] },
  { setning: 'I dag løper han. I går ___ han.', svar: 'løp', feil: ['løper', 'løpte', 'løpe'] },
  { setning: 'I dag sover hun. I går ___ hun.', svar: 'sov', feil: ['sover', 'sovte', 'sove'] },
  { setning: 'En stor hund, en enda ___ hund', svar: 'større', feil: ['storere', 'mer stor', 'størst'] },
  { setning: 'God, bedre, ___', svar: 'best', feil: ['godest', 'bedrest', 'bra'] },
]

export const MOTSETNINGER = [
  ['stor', 'liten'],
  ['varm', 'kald'],
  ['dag', 'natt'],
  ['opp', 'ned'],
  ['glad', 'trist'],
  ['rask', 'sakte'],
  ['høy', 'lav'],
  ['åpen', 'lukket'],
  ['full', 'tom'],
  ['ren', 'skitten'],
  ['ung', 'gammel'],
  ['hard', 'myk'],
  ['våt', 'tørr'],
  ['tung', 'lett'],
  ['lys', 'mørk'],
  ['inne', 'ute'],
]

export const TEGNSETTING = [
  { setning: 'Hva heter du', svar: '?', feil: ['.', '!'] },
  { setning: 'Hvor bor du', svar: '?', feil: ['.', '!'] },
  { setning: 'Hvor mange år er du', svar: '?', feil: ['.', '!'] },
  { setning: 'Hvilken dag er det i dag', svar: '?', feil: ['.', '!'] },
  { setning: 'Katten sover på senga', svar: '.', feil: ['?', '!'] },
  { setning: 'Toget går klokka ni', svar: '.', feil: ['?', '!'] },
  { setning: 'Vi spiser middag klokka fem', svar: '.', feil: ['?', '!'] },
  { setning: 'Ida har en rød sykkel', svar: '.', feil: ['?', '!'] },
  { setning: 'Hurra, vi vant', svar: '!', feil: ['.', '?'] },
  { setning: 'Au, det gjør vondt', svar: '!', feil: ['.', '?'] },
  { setning: 'Gratulerer med dagen', svar: '!', feil: ['.', '?'] },
  { setning: 'Pass deg for bilen', svar: '!', feil: ['.', '?'] },
]

export const STOR_BOKSTAV = [
  { riktig: 'Ida bor i Oslo.', feil: ['ida bor i Oslo.', 'Ida bor i oslo.', 'ida bor i oslo.'] },
  { riktig: 'Vi reiser til Bergen i mai.', feil: ['vi reiser til Bergen i mai.', 'Vi reiser til bergen i mai.', 'Vi reiser til Bergen i Mai.'] },
  { riktig: 'Hunden heter Pluto.', feil: ['hunden heter Pluto.', 'Hunden heter pluto.', 'Hunden Heter Pluto.'] },
  { riktig: 'På mandag har vi gym.', feil: ['på mandag har vi gym.', 'På Mandag har vi gym.', 'På mandag har vi Gym.'] },
  { riktig: 'Noah og Sara leker.', feil: ['noah og Sara leker.', 'Noah og sara leker.', 'noah og sara leker.'] },
  { riktig: 'Norge har mange fjell.', feil: ['norge har mange fjell.', 'Norge har mange Fjell.', 'norge Har mange fjell.'] },
]
