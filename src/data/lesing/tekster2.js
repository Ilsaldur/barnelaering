// ============================================================================
// UTKAST – ikke gjennomlest av Jon ennå. Tekster på 120–200 ord til Lese 10–12.
//   slutning:   svaret står ikke rett i teksten, barnet må slutte seg til det
//   ordforraad: synonymer og hva et ord betyr i sammenhengen
//   hovedtanke: hva teksten egentlig handler om
// Hver tekst har tre spørsmål av sin type. Enkelt bokmål.
// ============================================================================

export const TEKSTER2 = [
  // ------------------------------------------------------------ slutning
  {
    id: 's-regnjakke',
    type: 'slutning',
    tittel: 'Den gule regnjakka',
    tekst: 'Emma sto i gangen og så ut av vinduet. Himmelen var grå, og dråpene traff ruta med små smell. Hun tok den gule regnjakka fra knaggen og dro glidelåsen helt opp til haken. Støvlene sto ved døra, fortsatt litt våte fra i går. Mamma ropte fra kjøkkenet at matpakken lå på benken. Emma stappet den i sekken, åpnet døra og kjente den kalde lufta i ansiktet. Ute sto Jonas allerede og ventet med paraplyen sin. Den var rød og hadde et hull i kanten, så det dryppet ned på skulderen hans. «Skynd deg,» sa han, «ellers rekker vi ikke bussen.» De løp bortover fortauet, og vannet spratt opp fra dammene for hvert steg. Da de kom til holdeplassen, så de de røde baklysene forsvinne rundt svingen. Jonas sukket. Emma lo og sa at da fikk de bare gå.',
    sporsmaal: [
      { q: 'Hva slags vær er det?', alternativer: ['Det regner', 'Det snør', 'Det er sol', 'Det er tåke'], svar: 'Det regner' },
      { q: 'Hva har skjedd når de ser de røde baklysene?', alternativer: ['Bussen har akkurat kjørt', 'Bussen kommer', 'Mamma kjører forbi', 'Det er en brannbil'], svar: 'Bussen har akkurat kjørt' },
      { q: 'Hvorfor drypper det på skulderen til Jonas?', alternativer: ['Paraplyen hans har et hull', 'Han har glemt jakke', 'Han har badet', 'Emma sprutet på ham'], svar: 'Paraplyen hans har et hull' },
    ],
  },
  {
    id: 's-kake',
    type: 'slutning',
    tittel: 'Hemmeligheten på kjøkkenet',
    tekst: 'Da Olav kom hjem fra skolen, luktet det søtt i hele huset. Døra til kjøkkenet var lukket, og det var den aldri. Han hørte pappa hviske til noen der inne, og så lyden av en mikser. På benken i gangen lå en pose fra butikken med tjue fargerike ballonger. Olav satte seg på trappa og ventet. Lillesøster kom ned med noe bak ryggen og et stort smil. «Du må ikke gå inn på kjøkkenet,» sa hun strengt. Olav lot som han ikke skjønte noe. Klokka var nesten fem, og vanligvis spiste de middag nå, men ingen ropte på ham. I stedet hørte han papir som ble brettet og teip som ble revet av. Olav tenkte på kalenderen på rommet sitt, der han hadde tegnet en stor ring rundt morgendagens dato. Han smilte for seg selv og gikk opp for å gjøre lekser, uten at noen ba ham om det.',
    sporsmaal: [
      { q: 'Hva planlegger familien?', alternativer: ['En bursdagsfeiring for Olav', 'En flyttedag', 'En ferietur', 'En middag for naboene'], svar: 'En bursdagsfeiring for Olav' },
      { q: 'Hva lager pappa, tror du?', alternativer: ['En kake', 'Middag', 'Fiskesuppe', 'Pannekaker til frokost'], svar: 'En kake' },
      { q: 'Hvorfor går Olav opp uten å bli bedt om det?', alternativer: ['Han vil ikke ødelegge overraskelsen', 'Han er sint', 'Han er trøtt', 'Han vil se på TV'], svar: 'Han vil ikke ødelegge overraskelsen' },
    ],
  },
  {
    id: 's-fotspor',
    type: 'slutning',
    tittel: 'Spor i snøen',
    tekst: 'Det hadde snødd hele natten, og hagen lå hvit og urørt. Eller nesten urørt. Fra hekken og bort til fuglebrettet gikk en rekke små spor, tett i tett, som små hjerter i snøen. Ved fuglebrettet var snøen trampet ned, og frø lå spredt utover. Sporene fortsatte videre til bodveggen, der de stoppet brått under et vindu. Nora satte seg på huk og så nærmere. Ved siden av de små sporene var det nå også noen større, med fire tær og en liten pute bak. De store sporene kom fra skogen og gikk i en bue mot de små. Der sporene møttes, var snøen virvlet opp, og noen grå fjær lå igjen. Men ingen av sporene gikk videre. Nora så opp. På bodtaket satt en skjære og pusset fjærene, mens en katt med hvite poter stirret surt opp fra bakken.',
    sporsmaal: [
      { q: 'Hvem laget de små sporene?', alternativer: ['En fugl', 'En katt', 'En hund', 'Nora'], svar: 'En fugl' },
      { q: 'Hva prøvde katten å gjøre?', alternativer: ['Fange fuglen', 'Spise frø', 'Gå inn i boden', 'Leke med Nora'], svar: 'Fange fuglen' },
      { q: 'Hvordan vet vi at fuglen slapp unna?', alternativer: ['Den sitter på taket og pusser fjærene', 'Sporene går videre inn i skogen', 'Nora reddet den', 'Katten er fornøyd'], svar: 'Den sitter på taket og pusser fjærene' },
    ],
  },
  {
    id: 's-sykehus',
    type: 'slutning',
    tittel: 'Blomster til bestemor',
    tekst: 'Liam og mamma gikk gjennom lange, hvite ganger. Det luktet rent og litt skarpt, og en kvinne i grønne klær trillet en seng forbi dem. Liam holdt hardt i buketten med gule tulipaner. På rommet lå bestemor i en seng med hjul, og den ene foten hennes var pakket inn i noe hardt og hvitt helt opp til kneet. Hun smilte da hun så dem. «Det var dumt gjort å klatre i det epletreet,» sa hun og lo, men stoppet fort og tok seg til siden. På bordet sto et glass vann og en liten kopp med fire piller. Liam satte tulipanene i en vase og fortalte om fotballkampen. Bestemor spurte om han hadde scoret, og Liam nikket stolt. Da de skulle gå, sa en mann i hvit frakk at hun fikk komme hjem om to dager, men at hun måtte bruke krykker i seks uker. Bestemor himlet med øynene, og Liam lovet å hente epler for henne.',
    sporsmaal: [
      { q: 'Hvor er Liam og mamma?', alternativer: ['På sykehuset', 'På skolen', 'I en butikk', 'Hjemme hos bestemor'], svar: 'På sykehuset' },
      { q: 'Hva har skjedd med bestemor?', alternativer: ['Hun falt ned fra et tre og brakk beinet', 'Hun er forkjølet', 'Hun har vondt i magen', 'Hun har slått hodet'], svar: 'Hun falt ned fra et tre og brakk beinet' },
      { q: 'Hvem er mannen i hvit frakk?', alternativer: ['En lege', 'Bestefar', 'En kokk', 'En busssjåfør'], svar: 'En lege' },
    ],
  },
  {
    id: 's-lommelykt',
    type: 'slutning',
    tittel: 'Lyset i vinduet',
    tekst: 'Hver kveld klokka ni blinket det i vinduet i huset på andre siden av veien. Tre korte blink, en pause, og tre til. Sara hadde sett det i en uke nå. Hun fant pappas lommelykt i skuffen og ventet ved sitt eget vindu. Da blinkene kom, svarte hun med tre blink tilbake. Det ble stille lenge. Så kom det ett langt blink, og lyset forsvant. Neste morgen lå det en papirlapp under en stein ved postkassen hennes. «Du svarte! Jeg heter Theo. Jeg kan ikke gå ut, for jeg har brukket foten. Det er kjedelig. Blinker du i kveld også?» Sara leste lappen tre ganger. Hun fant et ark og tegnet et stort smilefjes og skrev navnet sitt under. Så la hun arket under steinen og så opp mot vinduet. Gardinen beveget seg litt, og en hånd vinket.',
    sporsmaal: [
      { q: 'Hvorfor blinker Theo med lyset?', alternativer: ['Han vil ha kontakt med noen', 'Lyset er ødelagt', 'Han øver på morse til skolen', 'Han prøver å skremme Sara'], svar: 'Han vil ha kontakt med noen' },
      { q: 'Hvordan kom lappen til postkassen?', alternativer: ['Noen la den der for Theo', 'Theo gikk dit selv', 'Posten leverte den', 'Vinden blåste den dit'], svar: 'Noen la den der for Theo' },
      { q: 'Hva tror du skjer i kveld klokka ni?', alternativer: ['De blinker til hverandre igjen', 'Sara flytter', 'Theo går en tur', 'Lysene er slukket'], svar: 'De blinker til hverandre igjen' },
    ],
  },
  {
    id: 's-butikk',
    type: 'slutning',
    tittel: 'Fem kroner for lite',
    tekst: 'Amir telte myntene i hånda en gang til. Tjue, tjuefem, tretti, trettifem. Isen i disken kostet førti. Han så bort på lillebror, som sto med nesen klistret mot glasset og pekte på den med jordbærsmak. Damen bak disken smilte vennlig. Amir kjente at han ble varm i kinnene. Han kunne si at de hadde ombestemt seg, men da ville lillebror gråte hele veien hjem. Han kunne også kjøpe den minste isen, men den hadde bare vaniljesmak. Så kom han på noe. Han gikk bort til hylla med flasker, tok den tomme brusflasken ut av sekken og satte den i automaten ved døra. Det klirret, og en lapp kom ut. Amir ga lappen og myntene til damen. Hun telte, nikket og rakte den store jordbærisen over disken. Lillebror jublet, og Amir pustet lettet ut.',
    sporsmaal: [
      { q: 'Hva er problemet til Amir?', alternativer: ['Han har ikke nok penger til isen', 'Butikken er stengt', 'Lillebror vil ikke ha is', 'Han har mistet sekken'], svar: 'Han har ikke nok penger til isen' },
      { q: 'Hvordan løser han det?', alternativer: ['Han panter en flaske', 'Han låner av damen', 'Han kjøper vaniljeis', 'Han ringer mamma'], svar: 'Han panter en flaske' },
      { q: 'Hvordan har Amir det til slutt?', alternativer: ['Lettet', 'Sint', 'Redd', 'Skuffet'], svar: 'Lettet' },
    ],
  },
  {
    id: 's-hund',
    type: 'slutning',
    tittel: 'Hvem har vært her?',
    tekst: 'Da familien kom hjem fra hytta, sto kjøkkendøra på gløtt. Inne lå en stol veltet, og brødposen var revet opp. Smuler lå i et spor bortover gulvet og inn i stua. Der hadde noen dratt puta av sofaen og laget en liten seng på teppet. En sokk lå i hjørnet, tygget våt. Pappa gikk rundt og ristet på hodet, mens Ida fulgte smulesporet videre. Det gikk ut gjennom verandadøra, som også sto åpen, og bort til hullet i gjerdet mot naboen. Akkurat da hørte de et velkjent bjeff. Naboens valp, Bamse, kom løpende med halen rett til værs og et stykke brødskorpe i munnen. Naboen kom etter, rød i ansiktet, og sa at Bamse hadde stukket av i morges. Ida satte seg ned og klødde valpen bak øret. Hun klarte ikke å være sint.',
    sporsmaal: [
      { q: 'Hvem har rotet i huset?', alternativer: ['Naboens valp', 'En tyv', 'Ida', 'En rev'], svar: 'Naboens valp' },
      { q: 'Hvordan kom valpen seg inn?', alternativer: ['Gjennom den åpne verandadøra', 'Gjennom vinduet', 'Naboen slapp den inn', 'Den gravde seg inn'], svar: 'Gjennom den åpne verandadøra' },
      { q: 'Hva forteller den våte sokken oss?', alternativer: ['Valpen har tygget på den', 'Noen har vasket', 'Det har regnet inn', 'Ida har mistet den'], svar: 'Valpen har tygget på den' },
    ],
  },
  {
    id: 's-klasserom',
    type: 'slutning',
    tittel: 'Den nye i klassen',
    tekst: 'Den nye gutten satt helt bakerst og så ned i pulten. Han het Mateo og hadde kommet fra et land langt borte, sa læreren. I friminuttet sto han alene ved gjerdet og så på de andre som spilte fotball. Når ballen kom i nærheten, sparket han den tilbake, hardt og presist, rett i beina på den som hadde ropt. Det skjedde tre ganger. Fjerde gangen stoppet spillet, og Jens, som var kaptein, ropte noe bort til ham og pekte på det tomme stedet i forsvaret. Mateo så seg rundt, som om Jens kunne mene noen andre. Så løp han bort. Fem minutter senere scoret han, og laget hans hoppet rundt ham. Da det ringte inn, gikk Mateo sammen med de andre, og han satte seg ikke bakerst lenger, men ved siden av Jens.',
    sporsmaal: [
      { q: 'Hvorfor står Mateo alene først?', alternativer: ['Han er ny og kjenner ingen', 'Han liker ikke fotball', 'Han er skadet', 'Han må vente på læreren'], svar: 'Han er ny og kjenner ingen' },
      { q: 'Hva får Jens til å spørre Mateo om å være med?', alternativer: ['Mateo sparker ballen veldig godt', 'Læreren ba ham', 'Laget manglet drakter', 'Mateo spurte selv'], svar: 'Mateo sparker ballen veldig godt' },
      { q: 'Hvordan har Mateo det på slutten?', alternativer: ['Han føler seg som en del av gjengen', 'Han er like ensom', 'Han vil hjem', 'Han er redd for Jens'], svar: 'Han føler seg som en del av gjengen' },
    ],
  },

  // ------------------------------------------------------------ ordforråd
  {
    id: 'o-fjelltur',
    type: 'ordforraad',
    tittel: 'Opp til vannet',
    tekst: 'Stien var bratt, og Jakob måtte stoppe flere ganger for å puste. Sekken var tung, for han hadde pakket både regntøy, ekstra genser og to matpakker. Pappa gikk foran med jevne, rolige steg, som om bakken ikke fantes. Oppe på toppen ble det plutselig flatt, og der lå vannet, blankt som et speil. Ikke en krusning på overflaten. Jakob la seg på magen på en varm steinhelle og drakk rett fra vannet. Det var så kaldt at det isnet i tennene. Pappa fant fram fiskestanga, og etter en time hadde han fått to ørreter, små, men glinsende. De grillet dem på et bål, og Jakob syntes aldri at noe hadde smakt bedre. På vei ned var beina slitne, men han gikk uten å klage. Han gledet seg allerede til neste gang.',
    sporsmaal: [
      { q: 'Hva betyr «bratt» i teksten?', alternativer: ['Stien går mye oppover', 'Stien er glatt', 'Stien er lang', 'Stien er smal'], svar: 'Stien går mye oppover' },
      { q: 'Hvilket ord betyr nesten det samme som «slitne»?', alternativer: ['Trøtte', 'Glade', 'Sterke', 'Våte'], svar: 'Trøtte' },
      { q: '«Ikke en krusning på overflaten.» Hva betyr det?', alternativer: ['Vannet var helt stille', 'Det var bølger', 'Vannet var frosset', 'Det var tomt for fisk'], svar: 'Vannet var helt stille' },
    ],
  },
  {
    id: 'o-bibliotek',
    type: 'ordforraad',
    tittel: 'Den gamle boka',
    tekst: 'Innerst i biblioteket, der ingen pleide å gå, fant Selma en bok med slitt rygg og gulnede sider. Omslaget var så bleket at tittelen knapt var synlig. Hun blåste støvet av og åpnet den forsiktig. Bokstavene var små og snirklete, og flere av ordene var gammeldagse. Men historien var spennende: en jente som fant en skjult dør i kjelleren. Selma satte seg i den dype lenestolen og leste til bibliotekaren kremtet og sa at de skulle stenge. Hun lånte boka med seg hjem. Den kvelden leste hun under dyna med lommelykt, selv om mamma hadde sagt god natt for lenge siden. Da hun endelig sovnet, drømte hun om trapper som gikk nedover i mørket. Neste dag gikk hun rett til biblioteket igjen for å lete etter flere bøker av den samme forfatteren.',
    sporsmaal: [
      { q: 'Hva betyr «bleket» om omslaget?', alternativer: ['Fargen var nesten borte', 'Det var vått', 'Det var nytt', 'Det var svart'], svar: 'Fargen var nesten borte' },
      { q: 'Hvilket ord betyr det samme som «snirklete»?', alternativer: ['Krøllete', 'Store', 'Rette', 'Røde'], svar: 'Krøllete' },
      { q: 'Hva gjør bibliotekaren når hun «kremter»?', alternativer: ['Hun lager en liten lyd med halsen for å få oppmerksomhet', 'Hun roper', 'Hun ler', 'Hun slår av lyset'], svar: 'Hun lager en liten lyd med halsen for å få oppmerksomhet' },
    ],
  },
  {
    id: 'o-sykkelverksted',
    type: 'ordforraad',
    tittel: 'Punktering',
    tekst: 'Halvveis til skolen hørte Aisha en hveselyd fra bakhjulet. Dekket ble mykere og mykere, og til slutt rullet hun på felgen. Hun trillet sykkelen de siste hundre meterne. Etter skolen gikk hun til verkstedet ved torget, der en mann med oljesvarte hender tok imot henne. Han løftet sykkelen opp i et stativ, tok av dekket med to flate pinner og dro ut slangen. Så dyppet han den i en balje med vann. Små bobler steg opp fra ett sted. «Der er synderen,» sa han og holdt opp en bitte liten spiker. Han rubbet stedet med sandpapir, limte på en lapp og pumpet slangen opp igjen. Aisha fulgte nøye med. «Neste gang gjør jeg det selv,» sa hun. Mannen lo og ga henne en ekstra lapp i en liten pose, gratis.',
    sporsmaal: [
      { q: 'Hva betyr «punktering»?', alternativer: ['Et hull i dekket så lufta går ut', 'En ødelagt kjede', 'En mistet pedal', 'En flat sal'], svar: 'Et hull i dekket så lufta går ut' },
      { q: '«Der er synderen,» sier mannen. Hva mener han?', alternativer: ['Det var spikeren som laget hullet', 'Aisha har gjort noe galt', 'Boblene er farlige', 'Slangen er ødelagt for alltid'], svar: 'Det var spikeren som laget hullet' },
      { q: 'Hvilket ord betyr det samme som «nøye»?', alternativer: ['Oppmerksomt', 'Fort', 'Trist', 'Høyt'], svar: 'Oppmerksomt' },
    ],
  },
  {
    id: 'o-bakeri',
    type: 'ordforraad',
    tittel: 'Tidlig på bakeriet',
    tekst: 'Klokka var halv fem om morgenen da Noor og pappa låste opp bakeriet. Gatene utenfor var tomme og stille, og lyset fra butikkvinduet var det eneste som skinte i mørket. Pappa satte på ovnene, og det tok ikke lang tid før varmen bredte seg i rommet. Noor fikk lov til å elte. Deigen var seig og klistret seg til fingrene, men etter hvert ble den glatt og smidig. De formet runde boller og lot dem hvile under et klede. Pappa sa at gjæren trengte tid til å arbeide, og at deigen ville ese til dobbel størrelse. Da bollene kom ut av ovnen, var de gylne og duftet søtt. Den første kunden kom klokka sju, en eldre mann som alltid kjøpte to. Han smilte og sa at det ikke fantes bedre start på dagen.',
    sporsmaal: [
      { q: 'Hva betyr «smidig» om deigen?', alternativer: ['Myk og lett å forme', 'Hard og tørr', 'Veldig varm', 'Full av klumper'], svar: 'Myk og lett å forme' },
      { q: 'Hva skjer når deigen «eser»?', alternativer: ['Den blir større', 'Den blir brun', 'Den blir kald', 'Den faller sammen'], svar: 'Den blir større' },
      { q: 'Hvilket ord betyr nesten det samme som «gylne»?', alternativer: ['Gulbrune', 'Mørke', 'Hvite', 'Bløte'], svar: 'Gulbrune' },
    ],
  },
  {
    id: 'o-storm',
    type: 'ordforraad',
    tittel: 'Natten med stormen',
    tekst: 'Vinden ulte rundt hushjørnene, og regnet pisket mot vinduene. Trærne i hagen bøyde seg så langt at Vilde var sikker på at de ville knekke. Strømmen gikk klokka ni, og huset ble helt mørkt. Mamma tente stearinlys, og de satte seg sammen under et teppe i sofaen. Lillebror var engstelig og holdt seg fast i armen til mamma. Vilde prøvde å trøste ham med å fortelle en historie, men hun hørte selv at stemmen skalv litt. Utenfor smalt det i en søppelkasse som veltet og rullet bortover. Etter midnatt ble vinden roligere, og regnet gikk over til et stille drypp. Da de våknet neste morgen, lå greiner og løv strødd utover hele veien, og trampolinen til naboen hang i et tre. Men alle var trygge, og sola skinte som om ingenting hadde hendt.',
    sporsmaal: [
      { q: 'Hva betyr «engstelig»?', alternativer: ['Redd', 'Sulten', 'Trøtt', 'Sint'], svar: 'Redd' },
      { q: 'Hva betyr det at regnet «pisket» mot vinduene?', alternativer: ['Det regnet hardt og kraftig', 'Det regnet forsiktig', 'Det snødde', 'Vinduet var åpent'], svar: 'Det regnet hardt og kraftig' },
      { q: 'Hvilket ord betyr det samme som «strødd»?', alternativer: ['Spredt', 'Samlet', 'Begravd', 'Hengt'], svar: 'Spredt' },
    ],
  },
  {
    id: 'o-robot',
    type: 'ordforraad',
    tittel: 'Roboten som ryddet',
    tekst: 'Til bursdagen fikk Elias en liten robot som kunne kjøre rundt og plukke opp småting. Den var ikke større enn en skoeske og hadde to klyper foran som gripearmer. Bruksanvisningen var på fire språk, og pappa bladde lenge før han fant norsk. Roboten måtte lades i to timer før den kunne brukes. Da den endelig våknet, blinket den blått og sa «hei» med en tynn, metallisk stemme. Elias satte den på gulvet midt blant legoklossene. Roboten snurret rundt, fant en kloss og la den i kassen. Så en til, og en til. Elias ble helt fascinert og satt og så på i en halvtime. Mamma kom inn og lo. «Du kunne ryddet alt selv på fem minutter,» sa hun. Elias nikket, men han syntes det var mye morsommere å se roboten gjøre det.',
    sporsmaal: [
      { q: 'Hva er en «bruksanvisning»?', alternativer: ['En forklaring på hvordan noe skal brukes', 'En kvittering', 'En gavelapp', 'En bok med bilder'], svar: 'En forklaring på hvordan noe skal brukes' },
      { q: 'Hva betyr «fascinert»?', alternativer: ['Veldig interessert', 'Lei seg', 'Sint', 'Søvnig'], svar: 'Veldig interessert' },
      { q: 'Hva betyr «metallisk» om stemmen?', alternativer: ['Den hørtes ut som en maskin', 'Den var høy', 'Den var vennlig', 'Den var dyp'], svar: 'Den hørtes ut som en maskin' },
    ],
  },
  {
    id: 'o-hage',
    type: 'ordforraad',
    tittel: 'Bestefars hage',
    tekst: 'Bestefar var stolt av hagen sin. Hver morgen gikk han runden med vannkanna og snakket til plantene, påsto han. Mina hjalp ham med å luke, det vil si å dra opp alt det som ikke skulle vokse der. Ugresset hadde lange røtter, og hun måtte ta godt tak og dra jevnt for ikke å slite av det. Bestefar viste henne hvordan hun skulle kjenne på jorda: var den tørr, trengte plantene vann. Var den fuktig, skulle de la dem være. I det ene hjørnet sto et drivhus av glass, der det var varmt og fuktig som i en jungel. Tomatene der inne var fortsatt grønne, men bestefar sa at de ville modne i løpet av august. Mina gledet seg til å smake. Hun syntes det var rart at så mye arbeid var gjemt bak noe som så så enkelt ut.',
    sporsmaal: [
      { q: 'Hva betyr «å luke»?', alternativer: ['Å fjerne ugress', 'Å vanne', 'Å plante frø', 'Å klippe gress'], svar: 'Å fjerne ugress' },
      { q: 'Hva betyr «fuktig»?', alternativer: ['Litt våt', 'Helt tørr', 'Veldig kald', 'Hard'], svar: 'Litt våt' },
      { q: 'Hva betyr det at tomatene «modner»?', alternativer: ['De blir ferdige og kan spises', 'De visner', 'De blir større blader', 'De fryser'], svar: 'De blir ferdige og kan spises' },
    ],
  },
  {
    id: 'o-svommehall',
    type: 'ordforraad',
    tittel: 'Første gang på dypet',
    tekst: 'Svømmehallen luktet klor, og lyden av plask og rop ga ekko under taket. Sofie hadde øvd i det grunne bassenget i mange uker. Nå sto hun ved kanten av det dype, der hun ikke kunne nå bunnen. Svømmelæreren sto i vannet med armene utstrakt og nikket oppmuntrende. Sofie tok sats og hoppet. Vannet lukket seg over hodet hennes, kaldt og stille, før hun sparket fra og kom opp igjen. Hun svømte med raske, litt klønete tak bort til kanten og holdt seg fast, andpusten. «Du klarte det!» ropte læreren. Sofie kjente hjertet dunke. Det hadde vært skummelt, men også fantastisk. Hun klatret opp og stilte seg i køen igjen. Denne gangen hoppet hun uten å nøle, og da hun kom opp, lo hun høyt.',
    sporsmaal: [
      { q: 'Hva betyr «andpusten»?', alternativer: ['Å puste fort og tungt', 'Å være våt', 'Å være redd', 'Å fryse'], svar: 'Å puste fort og tungt' },
      { q: 'Hva betyr «klønete» om svømmetakene?', alternativer: ['Ikke så fine og jevne', 'Veldig raske', 'Sterke', 'Lange'], svar: 'Ikke så fine og jevne' },
      { q: 'Hva betyr «uten å nøle»?', alternativer: ['Med en gang, uten å vente', 'Veldig forsiktig', 'Etter lang tid', 'Med lukkede øyne'], svar: 'Med en gang, uten å vente' },
    ],
  },

  // ------------------------------------------------------------ hovedtanke
  {
    id: 'h-bier',
    type: 'hovedtanke',
    tittel: 'Små, men viktige',
    tekst: 'Mange synes bier er plagsomme, og noen er redde for å bli stukket. Men uten bier ville vi hatt mye mindre mat. Når en bie flyr fra blomst til blomst for å samle nektar, fester det seg små korn av pollen på kroppen dens. Disse kornene drysser av på neste blomst, og slik får plantene det de trenger for å lage frukt og frø. Epler, jordbær, agurker og mandler er bare noen av matvarene som trenger hjelp fra bier. Forskere har regnet ut at hver tredje munnfull vi spiser, kommer fra planter som insekter har besøkt. Men biene har det vanskelig. Det blir færre blomsterenger, og sprøytemidler gjør dem syke. Heldigvis kan alle hjelpe. Du kan la en del av plenen vokse vill, plante blomster som biene liker, og la være å bruke gift i hagen. En liten blomsterkasse på balkongen er også en god start.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At bier er viktige for maten vår, og at vi kan hjelpe dem', 'At bier er farlige', 'Hvordan man lager honning', 'Hva epler smaker'], svar: 'At bier er viktige for maten vår, og at vi kan hjelpe dem' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Uten bier, mindre mat', 'Slik unngår du biestikk', 'Verdens største insekt', 'Jordbær på tallerkenen'], svar: 'Uten bier, mindre mat' },
      { q: 'Hva vil forfatteren at du skal gjøre?', alternativer: ['Hjelpe biene med blomster og uten gift', 'Fange bier', 'Spise mer frukt', 'Være redd for bier'], svar: 'Hjelpe biene med blomster og uten gift' },
    ],
  },
  {
    id: 'h-skjerm',
    type: 'hovedtanke',
    tittel: 'Kvelden uten skjerm',
    tekst: 'En onsdag bestemte familien Berg seg for å prøve noe nytt. Alle skjermer skulle slås av klokka seks, både TV, nettbrett og telefoner. Først var det stille og litt kjedelig. Lille Sander spurte hvert femte minutt om det var over snart. Men så fant pappa fram et gammelt brettspill fra loftet. Det manglet to brikker, så de brukte knapper i stedet. Mamma lagde popkorn, og de satt rundt kjøkkenbordet og spilte i to timer. De lo mye, kranglet litt om reglene, og Sander vant to ganger. Etterpå leste storesøster høyt fra en bok mens de andre hørte på. Da klokka ble ni, hadde ingen sett på en skjerm, og ingen hadde savnet det. Uka etter spurte Sander om de ikke kunne ha skjermfri kveld på onsdager alltid. Nå er det blitt fast. Familien sier at det er den beste kvelden i uka.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Tid sammen uten skjerm kan bli det beste i uka', 'Brettspill er bedre enn TV', 'Popkorn er godt', 'Sander er flink til å spille'], svar: 'Tid sammen uten skjerm kan bli det beste i uka' },
      { q: 'Hvordan endrer Sander seg i teksten?', alternativer: ['Fra å kjede seg til å ville ha det hver uke', 'Fra glad til sint', 'Fra sulten til mett', 'Han endrer seg ikke'], svar: 'Fra å kjede seg til å ville ha det hver uke' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Familien sier at det er den beste kvelden i uka.»', '«Det manglet to brikker.»', '«Mamma lagde popkorn.»', '«Klokka ble ni.»'], svar: '«Familien sier at det er den beste kvelden i uka.»' },
    ],
  },
  {
    id: 'h-sopp',
    type: 'hovedtanke',
    tittel: 'Skogens skjulte nett',
    tekst: 'Når du ser en sopp på skogbunnen, ser du bare en liten del av den. Det meste av soppen lever under jorda som tynne tråder, så fine at du knapt kan se dem. Trådene brer seg ut over store områder og kobler seg til røttene på trærne. Her skjer det noe fantastisk. Soppen gir treet vann og næring som den finner i jorda, og treet gir soppen sukker som det har laget av sollys. De bytter altså det de har for mye av. Forskere har oppdaget at trådene også knytter trær sammen, slik at et stort, gammelt tre kan sende næring til et lite tre som står i skyggen. Noen kaller dette skogens internett. Så neste gang du ser en liten, brun sopp, kan du tenke på at den er toppen av et nettverk som holder hele skogen i live.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At sopp og trær samarbeider gjennom tråder under jorda', 'Hvordan man plukker sopp', 'At sopp er giftig', 'Hvor høye trær kan bli'], svar: 'At sopp og trær samarbeider gjennom tråder under jorda' },
      { q: 'Hvorfor kaller noen dette «skogens internett»?', alternativer: ['Fordi trådene kobler trærne sammen og sender næring mellom dem', 'Fordi soppen lyser', 'Fordi trærne snakker', 'Fordi forskere bruker datamaskiner'], svar: 'Fordi trådene kobler trærne sammen og sender næring mellom dem' },
      { q: 'Hvilken overskrift passer også?', alternativer: ['Samarbeidet under skogbunnen', 'Den giftige soppen', 'Slik lager du soppsuppe', 'Verdens høyeste tre'], svar: 'Samarbeidet under skogbunnen' },
    ],
  },
  {
    id: 'h-feil',
    type: 'hovedtanke',
    tittel: 'Tegningen som gikk galt',
    tekst: 'Leah skulle tegne en hest til kunstutstillingen på skolen. Hun hadde øvd i flere dager, men den dagen det gjaldt, ble beina for korte og hodet for stort. Hun ble så lei seg at hun nesten krøllet sammen arket. Læreren satte seg ved siden av henne og så lenge på tegningen. «Hva om det ikke er en hest?» sa hun. «Hva om det er et dyr ingen har sett før?» Leah så på tegningen igjen. Det korte, tjukke dyret så faktisk litt morsomt ut. Hun tegnet på en lang hale, store ører og et smil. Så ga hun det navnet Pomp. På utstillingen var det Pomp folk stoppet ved og lo av, på en god måte. En gutt spurte om han kunne tegne Pomp også. Leah tenkte at det hun hadde trodd var en feil, var det beste hun hadde laget.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['En feil kan bli til noe bra hvis du ser den på en ny måte', 'Hester er vanskelige å tegne', 'Lærere vet alltid best', 'Utstillinger er skumle'], svar: 'En feil kan bli til noe bra hvis du ser den på en ny måte' },
      { q: 'Hva gjør læreren som hjelper mest?', alternativer: ['Hun får Leah til å se tegningen på en ny måte', 'Hun tegner hesten for henne', 'Hun gir henne et nytt ark', 'Hun sier at tegningen er fin'], svar: 'Hun får Leah til å se tegningen på en ny måte' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Det hun hadde trodd var en feil, var det beste hun hadde laget.»', '«Beina ble for korte.»', '«Hun ga det navnet Pomp.»', '«Hun hadde øvd i flere dager.»'], svar: '«Det hun hadde trodd var en feil, var det beste hun hadde laget.»' },
    ],
  },
  {
    id: 'h-soppel',
    type: 'hovedtanke',
    tittel: 'Stranda som ble ren',
    tekst: 'Klasse 4B dro til stranda for å bade, men det var nesten umulig å finne en plass uten søppel. Plastflasker, poser, tau og et gammelt bildekk lå mellom steinene. Noen av barna ble sinte, andre ble triste. Læreren spurte hva de ville gjøre med det. Først ville de bare dra hjem. Men så foreslo Omar at de kunne rydde. De hadde ingen sekker, så de brukte matpakkeposene og en jakke. På én time hadde de samlet en haug så stor at den rakk til knærne. Da kom en mann fra kommunen forbi, og han ble så imponert at han hentet ordentlige sekker og hansker. Uka etter sto det i avisen, med bilde av hele klassen. Men det barna husket best, var ikke avisen. Det var følelsen av å bade i rent vann på en strand de selv hadde gjort fin.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At barna valgte å gjøre noe med problemet i stedet for å gi opp', 'At stranda var full av søppel', 'At klassen kom i avisen', 'At det er farlig å bade'], svar: 'At barna valgte å gjøre noe med problemet i stedet for å gi opp' },
      { q: 'Hva var det viktigste for barna til slutt?', alternativer: ['Følelsen av å ha gjort stranda fin selv', 'Bildet i avisen', 'Sekkene fra kommunen', 'At de slapp skole'], svar: 'Følelsen av å ha gjort stranda fin selv' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Vi kan gjøre noe selv', 'Søppel er ekkelt', 'Klasse 4B på tur', 'Slik bader du trygt'], svar: 'Vi kan gjøre noe selv' },
    ],
  },
  {
    id: 'h-sovn',
    type: 'hovedtanke',
    tittel: 'Hvorfor sover vi?',
    tekst: 'Vi bruker nesten en tredjedel av livet på å sove. Det høres ut som bortkastet tid, men kroppen gjør mye viktig mens vi sover. Hjernen rydder opp i alt den har lært i løpet av dagen og flytter det viktigste over til langtidsminnet. Det er derfor du husker gloser bedre etter en natts søvn. Kroppen reparerer muskler og lager stoffer som gjør at du vokser. Immunforsvaret, som kjemper mot sykdom, jobber også hardest om natten. Barn på din alder trenger mellom ni og elleve timer søvn. Får du for lite, blir det vanskeligere å konsentrere seg, du blir lettere irritert, og du blir fortere syk. Lys fra skjermer lurer hjernen til å tro at det er dag, så det er lurt å legge bort nettbrettet en time før leggetid. Søvn er ikke bortkastet tid. Det er tiden da kroppen gjør seg klar til en ny dag.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Søvn er viktig fordi kroppen og hjernen gjør mye nyttig mens vi sover', 'Barn sover for mye', 'Skjermer er farlige', 'Gloser er lette å lære'], svar: 'Søvn er viktig fordi kroppen og hjernen gjør mye nyttig mens vi sover' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Søvn er ikke bortkastet tid.»', '«Vi bruker en tredjedel av livet på å sove.»', '«Barn trenger ni til elleve timer.»', '«Lys fra skjermer lurer hjernen.»'], svar: '«Søvn er ikke bortkastet tid.»' },
      { q: 'Hvorfor nevner forfatteren gloser?', alternativer: ['For å vise at søvn hjelper hukommelsen', 'For å si at skolen er viktig', 'For å fortelle om språk', 'For å gjøre teksten lengre'], svar: 'For å vise at søvn hjelper hukommelsen' },
    ],
  },
  {
    id: 'h-lillebror',
    type: 'hovedtanke',
    tittel: 'Det lille ordet',
    tekst: 'Lillebroren til Filip var to år og kunne nesten ikke snakke. Han pekte og laget lyder, og Filip syntes det var slitsomt å prøve å forstå ham. En ettermiddag var de alene hjemme en halvtime. Lillebror sto ved kjøleskapet og ropte «da! da!» og ble mer og mer sint. Filip prøvde melk, prøvde yoghurt, prøvde en agurk. Lillebror kastet alt på gulvet. Til slutt satte Filip seg ned på gulvet, helt rolig, og så på ham. Han fulgte blikket hans. Lillebror så ikke på kjøleskapet, men på magnetene på døra, en liten, gul and. «And?» sa Filip. Lillebror lyste opp, tok anda og klemte den inntil seg. Da mamma kom hjem, satt de to på gulvet og lekte sammen. Filip tenkte at det ikke var lillebror som var vanskelig å forstå. Han hadde bare ikke sett ordentlig etter.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['For å forstå noen må du roe deg ned og se ordentlig etter', 'Små barn er slitsomme', 'Filip liker ender', 'Kjøleskap er fulle av mat'], svar: 'For å forstå noen må du roe deg ned og se ordentlig etter' },
      { q: 'Hva var det som endret alt?', alternativer: ['Filip satte seg ned og fulgte blikket til lillebror', 'Mamma kom hjem', 'Lillebror ble stille', 'Filip fant yoghurten'], svar: 'Filip satte seg ned og fulgte blikket til lillebror' },
      { q: 'Hvilken overskrift passer også?', alternativer: ['Å lytte med øynene', 'Melk eller yoghurt?', 'Den sinte lillebroren', 'En halvtime alene'], svar: 'Å lytte med øynene' },
    ],
  },
  {
    id: 'h-vann',
    type: 'hovedtanke',
    tittel: 'Dråpen som reiser',
    tekst: 'Vannet du drakk i dag, kan ha vært i en sky over Afrika for lenge siden, eller i en isbre før det fantes mennesker. Vann forsvinner nemlig aldri. Det bare flytter seg. Sola varmer opp havet, og vann stiger opp som usynlig damp. Høyt oppe blir dampen kald og samler seg til små dråper, som vi ser som skyer. Når dråpene blir tunge nok, faller de ned som regn eller snø. Noe renner i elver tilbake til havet, noe siger ned i jorda og blir til grunnvann, og noe drikker vi. Så begynner det hele på nytt. Denne reisen kalles vannets kretsløp, og den har pågått i milliarder av år. Det betyr at vi aldri får nytt vann, bare det samme vannet om og om igjen. Derfor er det så viktig at vi ikke forurenser det. Det vi slipper ut i en bekk i dag, kan noen drikke et annet sted om hundre år.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At vannet går i et kretsløp og aldri blir borte', 'At det regner mye i Afrika', 'Hvordan skyer ser ut', 'At isbreer smelter'], svar: 'At vannet går i et kretsløp og aldri blir borte' },
      { q: 'Hvorfor sier forfatteren at vi ikke må forurense vannet?', alternativer: ['Fordi det samme vannet brukes om og om igjen', 'Fordi fisk liker rent vann', 'Fordi regn er sjeldent', 'Fordi vann er dyrt'], svar: 'Fordi det samme vannet brukes om og om igjen' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Det samme vannet, om og om igjen', 'Slik lager du regn', 'Afrikas skyer', 'Isbreens historie'], svar: 'Det samme vannet, om og om igjen' },
    ],
  },
]

export function teksterAvType(type) {
  return TEKSTER2.filter((t) => t.type === type)
}
