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
      { q: 'Hva har skjedd når de ser de røde baklysene?', alternativer: ['Bussen har akkurat kjørt', 'Bussen kommer om litt', 'Mamma kjører forbi dem', 'Det er en brannbil der'], svar: 'Bussen har akkurat kjørt' },
      { q: 'Hvorfor drypper det på skulderen til Jonas?', alternativer: ['Paraplyen hans har et hull', 'Han har glemt jakka hjemme', 'Han har nettopp badet i sjøen', 'Emma sprutet vann på ham'], svar: 'Paraplyen hans har et hull' },
    ],
  },
  {
    id: 's-kake',
    type: 'slutning',
    tittel: 'Hemmeligheten på kjøkkenet',
    tekst: 'Da Olav kom hjem fra skolen, luktet det søtt i hele huset. Døra til kjøkkenet var lukket, og det var den aldri. Han hørte pappa hviske til noen der inne, og så lyden av en mikser. På benken i gangen lå en pose fra butikken med tjue fargerike ballonger. Olav satte seg på trappa og ventet. Lillesøster kom ned med noe bak ryggen og et stort smil. «Du må ikke gå inn på kjøkkenet,» sa hun strengt. Olav lot som han ikke skjønte noe. Klokka var nesten fem, og vanligvis spiste de middag nå, men ingen ropte på ham. I stedet hørte han papir som ble brettet og teip som ble revet av. Olav tenkte på kalenderen på rommet sitt, der han hadde tegnet en stor ring rundt morgendagens dato. Han smilte for seg selv og gikk opp for å gjøre lekser, uten at noen ba ham om det.',
    sporsmaal: [
      { q: 'Hva planlegger familien?', alternativer: ['En bursdagsfeiring for Olav', 'En flyttedag til et nytt hus', 'En lang ferietur til fjells', 'En middag for alle naboene'], svar: 'En bursdagsfeiring for Olav' },
      { q: 'Hva lager pappa, tror du?', alternativer: ['En kake', 'En suppe', 'En pizza', 'En salat'], svar: 'En kake' },
      { q: 'Hvorfor går Olav opp uten å bli bedt om det?', alternativer: ['Han vil ikke ødelegge overraskelsen', 'Han er sint på hele familien sin', 'Han er så trøtt at han vil sove', 'Han vil heller se på TV på rommet'], svar: 'Han vil ikke ødelegge overraskelsen' },
    ],
  },
  {
    id: 's-fotspor',
    type: 'slutning',
    tittel: 'Spor i snøen',
    tekst: 'Det hadde snødd hele natten, og hagen lå hvit og urørt. Eller nesten urørt. Fra hekken og bort til fuglebrettet gikk en rekke små spor, tett i tett, som små hjerter i snøen. Ved fuglebrettet var snøen trampet ned, og frø lå spredt utover. Sporene fortsatte videre til bodveggen, der de stoppet brått under et vindu. Nora satte seg på huk og så nærmere. Ved siden av de små sporene var det nå også noen større, med fire tær og en liten pute bak. De store sporene kom fra skogen og gikk i en bue mot de små. Der sporene møttes, var snøen virvlet opp, og noen grå fjær lå igjen. Men ingen av sporene gikk videre. Nora så opp. På bodtaket satt en skjære og pusset fjærene, mens en katt med hvite poter stirret surt opp fra bakken.',
    sporsmaal: [
      { q: 'Hvem laget de små sporene?', alternativer: ['En fugl', 'En katt', 'En hund', 'En mus'], svar: 'En fugl' },
      { q: 'Hva prøvde katten å gjøre?', alternativer: ['Fange fuglen', 'Spise frøene', 'Gå inn i boden', 'Leke med Nora'], svar: 'Fange fuglen' },
      { q: 'Hvordan vet vi at fuglen slapp unna?', alternativer: ['Den sitter på taket og pusser fjærene', 'Sporene går videre inn i skogen bak', 'Nora reddet den fra katten i tide', 'Katten ser fornøyd ut der den sitter'], svar: 'Den sitter på taket og pusser fjærene' },
    ],
  },
  {
    id: 's-sykehus',
    type: 'slutning',
    tittel: 'Blomster til bestemor',
    tekst: 'Liam og mamma gikk gjennom lange, hvite ganger. Det luktet rent og litt skarpt, og en kvinne i grønne klær trillet en seng forbi dem. Liam holdt hardt i buketten med gule tulipaner. På rommet lå bestemor i en seng med hjul, og den ene foten hennes var pakket inn i noe hardt og hvitt helt opp til kneet. Hun smilte da hun så dem. «Det var dumt gjort å klatre i det epletreet,» sa hun og lo, men stoppet fort og tok seg til siden. På bordet sto et glass vann og en liten kopp med fire piller. Liam satte tulipanene i en vase og fortalte om fotballkampen. Bestemor spurte om han hadde scoret, og Liam nikket stolt. Da de skulle gå, sa en mann i hvit frakk at hun fikk komme hjem om to dager, men at hun måtte bruke krykker i seks uker. Bestemor himlet med øynene, og Liam lovet å hente epler for henne.',
    sporsmaal: [
      { q: 'Hvor er Liam og mamma?', alternativer: ['På sykehuset', 'På skolen hans', 'I matbutikken', 'Hjemme hos tante'], svar: 'På sykehuset' },
      { q: 'Hva har skjedd med bestemor?', alternativer: ['Hun falt ned fra et tre og brakk beinet', 'Hun ble forkjølet etter en lang tur ute', 'Hun fikk vondt i magen av å spise epler', 'Hun slo hodet da hun falt i trappa'], svar: 'Hun falt ned fra et tre og brakk beinet' },
      { q: 'Hvem er mannen i hvit frakk?', alternativer: ['En lege', 'Bestefar', 'En kokk', 'En sjåfør'], svar: 'En lege' },
    ],
  },
  {
    id: 's-lommelykt',
    type: 'slutning',
    tittel: 'Lyset i vinduet',
    tekst: 'Hver kveld klokka ni blinket det i vinduet i huset på andre siden av veien. Tre korte blink, en pause, og tre til. Sara hadde sett det i en uke nå. Hun fant pappas lommelykt i skuffen og ventet ved sitt eget vindu. Da blinkene kom, svarte hun med tre blink tilbake. Det ble stille lenge. Så kom det ett langt blink, og lyset forsvant. Neste morgen lå det en papirlapp under en stein ved postkassen hennes. «Du svarte! Jeg heter Theo. Jeg kan ikke gå ut, for jeg har brukket foten. Det er kjedelig. Blinker du i kveld også?» Sara leste lappen tre ganger. Hun fant et ark og tegnet et stort smilefjes og skrev navnet sitt under. Så la hun arket under steinen og så opp mot vinduet. Gardinen beveget seg litt, og en hånd vinket.',
    sporsmaal: [
      { q: 'Hvorfor blinker Theo med lyset?', alternativer: ['Han vil ha kontakt med noen', 'Lyset hans er gått i stykker', 'Han øver på morse til skolen', 'Han prøver å skremme Sara'], svar: 'Han vil ha kontakt med noen' },
      { q: 'Hvordan kom lappen til postkassen?', alternativer: ['Noen la den der for Theo', 'Theo gikk dit selv i natt', 'Posten leverte den i dag', 'Vinden blåste den dit bort'], svar: 'Noen la den der for Theo' },
      { q: 'Hva tror du skjer i kveld klokka ni?', alternativer: ['De blinker til hverandre igjen', 'Sara flytter til et annet hus', 'Theo går en lang tur alene', 'Lysene er slukket i begge hus'], svar: 'De blinker til hverandre igjen' },
    ],
  },
  {
    id: 's-butikk',
    type: 'slutning',
    tittel: 'Fem kroner for lite',
    tekst: 'Amir telte myntene i hånda en gang til. Tjue, tjuefem, tretti, trettifem. Isen i disken kostet førti. Han så bort på lillebror, som sto med nesen klistret mot glasset og pekte på den med jordbærsmak. Damen bak disken smilte vennlig. Amir kjente at han ble varm i kinnene. Han kunne si at de hadde ombestemt seg, men da ville lillebror gråte hele veien hjem. Han kunne også kjøpe den minste isen, men den hadde bare vaniljesmak. Så kom han på noe. Han gikk bort til hylla med flasker, tok den tomme brusflasken ut av sekken og satte den i automaten ved døra. Det klirret, og en lapp kom ut. Amir ga lappen og myntene til damen. Hun telte, nikket og rakte den store jordbærisen over disken. Lillebror jublet, og Amir pustet lettet ut.',
    sporsmaal: [
      { q: 'Hva er problemet til Amir?', alternativer: ['Han har ikke nok penger til isen', 'Butikken er stengt for i dag', 'Lillebror vil ikke ha noen is', 'Han har mistet sekken sin'], svar: 'Han har ikke nok penger til isen' },
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
      { q: 'Hvem har rotet i huset?', alternativer: ['Naboens valp', 'En tyv i natt', 'Ida og pappa', 'En sulten rev'], svar: 'Naboens valp' },
      { q: 'Hvordan kom valpen seg inn?', alternativer: ['Gjennom den åpne verandadøra', 'Gjennom et knust kjøkkenvindu', 'Naboen slapp den inn i huset', 'Den gravde seg inn under huset'], svar: 'Gjennom den åpne verandadøra' },
      { q: 'Hva forteller den våte sokken oss?', alternativer: ['Valpen har tygget på den', 'Noen har vasket klær i dag', 'Det har regnet inn i stua', 'Ida har mistet den i bad'], svar: 'Valpen har tygget på den' },
    ],
  },
  {
    id: 's-klasserom',
    type: 'slutning',
    tittel: 'Den nye i klassen',
    tekst: 'Den nye gutten satt helt bakerst og så ned i pulten. Han het Mateo og hadde kommet fra et land langt borte, sa læreren. I friminuttet sto han alene ved gjerdet og så på de andre som spilte fotball. Når ballen kom i nærheten, sparket han den tilbake, hardt og presist, rett i beina på den som hadde ropt. Det skjedde tre ganger. Fjerde gangen stoppet spillet, og Jens, som var kaptein, ropte noe bort til ham og pekte på det tomme stedet i forsvaret. Mateo så seg rundt, som om Jens kunne mene noen andre. Så løp han bort. Fem minutter senere scoret han, og laget hans hoppet rundt ham. Da det ringte inn, gikk Mateo sammen med de andre, og han satte seg ikke bakerst lenger, men ved siden av Jens.',
    sporsmaal: [
      { q: 'Hvorfor står Mateo alene først?', alternativer: ['Han er ny og kjenner ingen', 'Han liker ikke å spille fotball', 'Han er skadet i foten sin', 'Han må vente på læreren ute'], svar: 'Han er ny og kjenner ingen' },
      { q: 'Hva får Jens til å spørre Mateo om å være med?', alternativer: ['Mateo sparker ballen veldig godt', 'Læreren ba Jens om å gjøre det', 'Laget manglet drakter til kampen', 'Mateo spurte selv om å få spille'], svar: 'Mateo sparker ballen veldig godt' },
      { q: 'Hvordan har Mateo det på slutten?', alternativer: ['Han føler seg som en del av gjengen', 'Han er like ensom som han var før', 'Han vil helst dra hjem med en gang', 'Han er redd for Jens og de andre'], svar: 'Han føler seg som en del av gjengen' },
    ],
  },

  // ------------------------------------------------------------ ordforråd
  {
    id: 'o-fjelltur',
    type: 'ordforraad',
    tittel: 'Opp til vannet',
    tekst: 'Stien var bratt, og Jakob måtte stoppe flere ganger for å puste. Sekken var tung, for han hadde pakket både regntøy, ekstra genser og to matpakker. Pappa gikk foran med jevne, rolige steg, som om bakken ikke fantes. Oppe på toppen ble det plutselig flatt, og der lå vannet, blankt som et speil. Ikke en krusning på overflaten. Jakob la seg på magen på en varm steinhelle og drakk rett fra vannet. Det var så kaldt at det isnet i tennene. Pappa fant fram fiskestanga, og etter en time hadde han fått to ørreter, små, men glinsende. De grillet dem på et bål, og Jakob syntes aldri at noe hadde smakt bedre. På vei ned var beina slitne, men han gikk uten å klage. Han gledet seg allerede til neste gang.',
    sporsmaal: [
      { q: 'Hva betyr «bratt» i teksten?', alternativer: ['Stien går mye oppover', 'Stien er glatt og våt', 'Stien er lang og rett', 'Stien er smal og mørk'], svar: 'Stien går mye oppover' },
      { q: 'Hvilket ord betyr nesten det samme som «slitne»?', alternativer: ['Trøtte', 'Glade', 'Sterke', 'Våte'], svar: 'Trøtte' },
      { q: '«Ikke en krusning på overflaten.» Hva betyr det?', alternativer: ['Vannet var helt stille', 'Det var store bølger', 'Vannet var frosset til is', 'Det var tomt for fisk'], svar: 'Vannet var helt stille' },
    ],
  },
  {
    id: 'o-bibliotek',
    type: 'ordforraad',
    tittel: 'Den gamle boka',
    tekst: 'Innerst i biblioteket, der ingen pleide å gå, fant Selma en bok med slitt rygg og gulnede sider. Omslaget var så bleket at tittelen knapt var synlig. Hun blåste støvet av og åpnet den forsiktig. Bokstavene var små og snirklete, og flere av ordene var gammeldagse. Men historien var spennende: en jente som fant en skjult dør i kjelleren. Selma satte seg i den dype lenestolen og leste til bibliotekaren kremtet og sa at de skulle stenge. Hun lånte boka med seg hjem. Den kvelden leste hun under dyna med lommelykt, selv om mamma hadde sagt god natt for lenge siden. Da hun endelig sovnet, drømte hun om trapper som gikk nedover i mørket. Neste dag gikk hun rett til biblioteket igjen for å lete etter flere bøker av den samme forfatteren.',
    sporsmaal: [
      { q: 'Hva betyr «bleket» om omslaget?', alternativer: ['Fargen var nesten borte', 'Omslaget var helt vått', 'Omslaget var splitter nytt', 'Fargen var helt svart'], svar: 'Fargen var nesten borte' },
      { q: 'Hvilket ord betyr det samme som «snirklete»?', alternativer: ['Krøllete', 'Kjempestore', 'Helt rette', 'Knallrøde'], svar: 'Krøllete' },
      { q: 'Hva gjør bibliotekaren når hun «kremter»?', alternativer: ['Hun lager en liten lyd med halsen for å få oppmerksomhet', 'Hun roper høyt så alle i rommet snur seg mot henne', 'Hun ler så høyt at det runger i hele biblioteket', 'Hun slår av alle lysene så det blir mørkt der inne'], svar: 'Hun lager en liten lyd med halsen for å få oppmerksomhet' },
    ],
  },
  {
    id: 'o-sykkelverksted',
    type: 'ordforraad',
    tittel: 'Punktering',
    tekst: 'Halvveis til skolen hørte Aisha en hveselyd fra bakhjulet. Dekket ble mykere og mykere, og til slutt rullet hun på felgen. Hun trillet sykkelen de siste hundre meterne. Etter skolen gikk hun til verkstedet ved torget, der en mann med oljesvarte hender tok imot henne. Han løftet sykkelen opp i et stativ, tok av dekket med to flate pinner og dro ut slangen. Så dyppet han den i en balje med vann. Små bobler steg opp fra ett sted. «Der er synderen,» sa han og holdt opp en bitte liten spiker. Han rubbet stedet med sandpapir, limte på en lapp og pumpet slangen opp igjen. Aisha fulgte nøye med. «Neste gang gjør jeg det selv,» sa hun. Mannen lo og ga henne en ekstra lapp i en liten pose, gratis.',
    sporsmaal: [
      { q: 'Hva betyr «punktering»?', alternativer: ['Et hull i dekket så lufta går ut', 'En kjede som har hoppet av tannhjulet', 'En pedal som har falt av sykkelen', 'En sal som har blitt helt flat'], svar: 'Et hull i dekket så lufta går ut' },
      { q: '«Der er synderen,» sier mannen. Hva mener han?', alternativer: ['Det var spikeren som laget hullet', 'Aisha har gjort noe galt med sykkelen', 'Boblene i vannet er farlige å ta på', 'Slangen er ødelagt for alltid nå'], svar: 'Det var spikeren som laget hullet' },
      { q: 'Hvilket ord betyr det samme som «nøye»?', alternativer: ['Oppmerksomt', 'Kjempefort', 'Litt trist', 'Veldig høyt'], svar: 'Oppmerksomt' },
    ],
  },
  {
    id: 'o-bakeri',
    type: 'ordforraad',
    tittel: 'Tidlig på bakeriet',
    tekst: 'Klokka var halv fem om morgenen da Noor og pappa låste opp bakeriet. Gatene utenfor var tomme og stille, og lyset fra butikkvinduet var det eneste som skinte i mørket. Pappa satte på ovnene, og det tok ikke lang tid før varmen bredte seg i rommet. Noor fikk lov til å elte. Deigen var seig og klistret seg til fingrene, men etter hvert ble den glatt og smidig. De formet runde boller og lot dem hvile under et klede. Pappa sa at gjæren trengte tid til å arbeide, og at deigen ville ese til dobbel størrelse. Da bollene kom ut av ovnen, var de gylne og duftet søtt. Den første kunden kom klokka sju, en eldre mann som alltid kjøpte to. Han smilte og sa at det ikke fantes bedre start på dagen.',
    sporsmaal: [
      { q: 'Hva betyr «smidig» om deigen?', alternativer: ['Myk og lett å forme', 'Hard og helt tørr', 'Veldig varm å ta på', 'Full av små klumper'], svar: 'Myk og lett å forme' },
      { q: 'Hva skjer når deigen «eser»?', alternativer: ['Den blir større', 'Den blir brun', 'Den blir kald', 'Den faller ned'], svar: 'Den blir større' },
      { q: 'Hvilket ord betyr nesten det samme som «gylne»?', alternativer: ['Gulbrune', 'Kullsvarte', 'Snøhvite', 'Kjempebløte'], svar: 'Gulbrune' },
    ],
  },
  {
    id: 'o-storm',
    type: 'ordforraad',
    tittel: 'Natten med stormen',
    tekst: 'Vinden ulte rundt hushjørnene, og regnet pisket mot vinduene. Trærne i hagen bøyde seg så langt at Vilde var sikker på at de ville knekke. Strømmen gikk klokka ni, og huset ble helt mørkt. Mamma tente stearinlys, og de satte seg sammen under et teppe i sofaen. Lillebror var engstelig og holdt seg fast i armen til mamma. Vilde prøvde å trøste ham med å fortelle en historie, men hun hørte selv at stemmen skalv litt. Utenfor smalt det i en søppelkasse som veltet og rullet bortover. Etter midnatt ble vinden roligere, og regnet gikk over til et stille drypp. Da de våknet neste morgen, lå greiner og løv strødd utover hele veien, og trampolinen til naboen hang i et tre. Men alle var trygge, og sola skinte som om ingenting hadde hendt.',
    sporsmaal: [
      { q: 'Hva betyr «engstelig»?', alternativer: ['Redd', 'Sulten', 'Trøtt', 'Sint'], svar: 'Redd' },
      { q: 'Hva betyr det at regnet «pisket» mot vinduene?', alternativer: ['Det regnet hardt og kraftig', 'Det regnet forsiktig og stille', 'Det snødde store, våte flak', 'Vinduet sto åpent hele tiden'], svar: 'Det regnet hardt og kraftig' },
      { q: 'Hvilket ord betyr det samme som «strødd»?', alternativer: ['Spredt', 'Samlet', 'Begravd', 'Hengt'], svar: 'Spredt' },
    ],
  },
  {
    id: 'o-robot',
    type: 'ordforraad',
    tittel: 'Roboten som ryddet',
    tekst: 'Til bursdagen fikk Elias en liten robot som kunne kjøre rundt og plukke opp småting. Den var ikke større enn en skoeske og hadde to klyper foran som gripearmer. Bruksanvisningen var på fire språk, og pappa bladde lenge før han fant norsk. Roboten måtte lades i to timer før den kunne brukes. Da den endelig våknet, blinket den blått og sa «hei» med en tynn, metallisk stemme. Elias satte den på gulvet midt blant legoklossene. Roboten snurret rundt, fant en kloss og la den i kassen. Så en til, og en til. Elias ble helt fascinert og satt og så på i en halvtime. Mamma kom inn og lo. «Du kunne ryddet alt selv på fem minutter,» sa hun. Elias nikket, men han syntes det var mye morsommere å se roboten gjøre det.',
    sporsmaal: [
      { q: 'Hva er en «bruksanvisning»?', alternativer: ['En forklaring på hvordan noe skal brukes', 'En kvittering du får når du handler', 'En gavelapp med navn og en hilsen', 'En bok med bilder av roboter'], svar: 'En forklaring på hvordan noe skal brukes' },
      { q: 'Hva betyr «fascinert»?', alternativer: ['Veldig interessert', 'Skikkelig lei seg', 'Ordentlig sint', 'Trøtt og søvnig'], svar: 'Veldig interessert' },
      { q: 'Hva betyr «metallisk» om stemmen?', alternativer: ['Den hørtes ut som en maskin', 'Den var høy og skingrende', 'Den var myk og vennlig', 'Den var dyp som en bjørn'], svar: 'Den hørtes ut som en maskin' },
    ],
  },
  {
    id: 'o-hage',
    type: 'ordforraad',
    tittel: 'Bestefars hage',
    tekst: 'Bestefar var stolt av hagen sin. Hver morgen gikk han runden med vannkanna og snakket til plantene, påsto han. Mina hjalp ham med å luke, det vil si å dra opp alt det som ikke skulle vokse der. Ugresset hadde lange røtter, og hun måtte ta godt tak og dra jevnt for ikke å slite av det. Bestefar viste henne hvordan hun skulle kjenne på jorda: var den tørr, trengte plantene vann. Var den fuktig, skulle de la dem være. I det ene hjørnet sto et drivhus av glass, der det var varmt og fuktig som i en jungel. Tomatene der inne var fortsatt grønne, men bestefar sa at de ville modne i løpet av august. Mina gledet seg til å smake. Hun syntes det var rart at så mye arbeid var gjemt bak noe som så så enkelt ut.',
    sporsmaal: [
      { q: 'Hva betyr «å luke»?', alternativer: ['Å fjerne ugress', 'Å vanne blomster', 'Å plante frø i jord', 'Å klippe plenen'], svar: 'Å fjerne ugress' },
      { q: 'Hva betyr «fuktig»?', alternativer: ['Litt våt', 'Helt tørr', 'Veldig kald', 'Hard'], svar: 'Litt våt' },
      { q: 'Hva betyr det at tomatene «modner»?', alternativer: ['De blir ferdige og kan spises', 'De visner og faller av planten', 'De får større, grønne blader', 'De fryser fast til stilken'], svar: 'De blir ferdige og kan spises' },
    ],
  },
  {
    id: 'o-svommehall',
    type: 'ordforraad',
    tittel: 'Første gang på dypet',
    tekst: 'Svømmehallen luktet klor, og lyden av plask og rop ga ekko under taket. Sofie hadde øvd i det grunne bassenget i mange uker. Nå sto hun ved kanten av det dype, der hun ikke kunne nå bunnen. Svømmelæreren sto i vannet med armene utstrakt og nikket oppmuntrende. Sofie tok sats og hoppet. Vannet lukket seg over hodet hennes, kaldt og stille, før hun sparket fra og kom opp igjen. Hun svømte med raske, litt klønete tak bort til kanten og holdt seg fast, andpusten. «Du klarte det!» ropte læreren. Sofie kjente hjertet dunke. Det hadde vært skummelt, men også fantastisk. Hun klatret opp og stilte seg i køen igjen. Denne gangen hoppet hun uten å nøle, og da hun kom opp, lo hun høyt.',
    sporsmaal: [
      { q: 'Hva betyr «andpusten»?', alternativer: ['Å puste fort og tungt', 'Å være våt i håret', 'Å være redd for vann', 'Å fryse på hendene'], svar: 'Å puste fort og tungt' },
      { q: 'Hva betyr «klønete» om svømmetakene?', alternativer: ['Ikke så fine og jevne', 'Veldig raske og lette', 'Sterke og kraftige', 'Lange og rolige'], svar: 'Ikke så fine og jevne' },
      { q: 'Hva betyr «uten å nøle»?', alternativer: ['Med en gang, uten å vente', 'Veldig forsiktig og sakte', 'Etter å ha ventet lenge', 'Med øynene godt lukket'], svar: 'Med en gang, uten å vente' },
    ],
  },

  // ------------------------------------------------------------ hovedtanke
  {
    id: 'h-bier',
    type: 'hovedtanke',
    tittel: 'Små, men viktige',
    tekst: 'Mange synes bier er plagsomme, og noen er redde for å bli stukket. Men uten bier ville vi hatt mye mindre mat. Når en bie flyr fra blomst til blomst for å samle nektar, fester det seg små korn av pollen på kroppen dens. Disse kornene drysser av på neste blomst, og slik får plantene det de trenger for å lage frukt og frø. Epler, jordbær, agurker og mandler er bare noen av matvarene som trenger hjelp fra bier. Forskere har regnet ut at hver tredje munnfull vi spiser, kommer fra planter som insekter har besøkt. Men biene har det vanskelig. Det blir færre blomsterenger, og sprøytemidler gjør dem syke. Heldigvis kan alle hjelpe. Du kan la en del av plenen vokse vill, plante blomster som biene liker, og la være å bruke gift i hagen. En liten blomsterkasse på balkongen er også en god start.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At bier er viktige for maten vår, og at vi kan hjelpe dem', 'At bier er farlige, og at vi må passe oss for stikk', 'Hvordan man lager honning av nektar fra blomster', 'Hva slags epler som smaker best om høsten'], svar: 'At bier er viktige for maten vår, og at vi kan hjelpe dem' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Uten bier, mindre mat', 'Slik unngår du biestikk', 'Verdens største insekt', 'Jordbær på tallerkenen'], svar: 'Uten bier, mindre mat' },
      { q: 'Hva vil forfatteren at du skal gjøre?', alternativer: ['Hjelpe biene med blomster og uten gift', 'Fange bier og legge dem i et glass', 'Spise mer frukt og grønnsaker hver dag', 'Holde deg langt unna alle slags bier'], svar: 'Hjelpe biene med blomster og uten gift' },
    ],
  },
  {
    id: 'h-skjerm',
    type: 'hovedtanke',
    tittel: 'Kvelden uten skjerm',
    tekst: 'En onsdag bestemte familien Berg seg for å prøve noe nytt. Alle skjermer skulle slås av klokka seks, både TV, nettbrett og telefoner. Først var det stille og litt kjedelig. Lille Sander spurte hvert femte minutt om det var over snart. Men så fant pappa fram et gammelt brettspill fra loftet. Det manglet to brikker, så de brukte knapper i stedet. Mamma lagde popkorn, og de satt rundt kjøkkenbordet og spilte i to timer. De lo mye, kranglet litt om reglene, og Sander vant to ganger. Etterpå leste storesøster høyt fra en bok mens de andre hørte på. Da klokka ble ni, hadde ingen sett på en skjerm, og ingen hadde savnet det. Uka etter spurte Sander om de ikke kunne ha skjermfri kveld på onsdager alltid. Nå er det blitt fast. Familien sier at det er den beste kvelden i uka.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Tid sammen uten skjerm kan bli det beste i uka', 'Brettspill er mye bedre enn alt som er på TV', 'Popkorn smaker best når man spiller spill', 'Sander er den flinkeste i familien til å spille'], svar: 'Tid sammen uten skjerm kan bli det beste i uka' },
      { q: 'Hvordan endrer Sander seg i teksten?', alternativer: ['Fra å kjede seg til å ville ha det hver uke', 'Fra å være glad til å bli sint på hele familien', 'Fra å være sulten til å bli helt mett av popkorn', 'Han endrer seg ikke noe i det hele tatt i teksten'], svar: 'Fra å kjede seg til å ville ha det hver uke' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Familien sier at det er den beste kvelden i uka.»', '«Det manglet to brikker, så de brukte knapper i stedet.»', '«Mamma lagde popkorn mens de andre satt og ventet.»', '«Da klokka ble ni, leste storesøster høyt for alle.»'], svar: '«Familien sier at det er den beste kvelden i uka.»' },
    ],
  },
  {
    id: 'h-sopp',
    type: 'hovedtanke',
    tittel: 'Skogens skjulte nett',
    tekst: 'Når du ser en sopp på skogbunnen, ser du bare en liten del av den. Det meste av soppen lever under jorda som tynne tråder, så fine at du knapt kan se dem. Trådene brer seg ut over store områder og kobler seg til røttene på trærne. Her skjer det noe fantastisk. Soppen gir treet vann og næring som den finner i jorda, og treet gir soppen sukker som det har laget av sollys. De bytter altså det de har for mye av. Forskere har oppdaget at trådene også knytter trær sammen, slik at et stort, gammelt tre kan sende næring til et lite tre som står i skyggen. Noen kaller dette skogens internett. Så neste gang du ser en liten, brun sopp, kan du tenke på at den er toppen av et nettverk som holder hele skogen i live.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At sopp og trær samarbeider gjennom tråder under jorda', 'Hvordan man plukker sopp i skogen uten å bli syk av den', 'At sopp er giftig og aldri må spises av barn eller dyr', 'Hvor høye trærne i den norske skogen kan bli om sommeren'], svar: 'At sopp og trær samarbeider gjennom tråder under jorda' },
      { q: 'Hvorfor kaller noen dette «skogens internett»?', alternativer: ['Fordi trådene kobler trærne sammen og sender næring mellom dem', 'Fordi soppen lyser i mørket slik at trærne kan se hverandre', 'Fordi trærne snakker sammen med lyder vi ikke kan høre', 'Fordi forskerne bruker datamaskiner når de måler skogen'], svar: 'Fordi trådene kobler trærne sammen og sender næring mellom dem' },
      { q: 'Hvilken overskrift passer også?', alternativer: ['Samarbeidet under skogbunnen', 'Den giftige soppen i skogen', 'Slik lager du god soppsuppe', 'Verdens høyeste tre står her'], svar: 'Samarbeidet under skogbunnen' },
    ],
  },
  {
    id: 'h-feil',
    type: 'hovedtanke',
    tittel: 'Tegningen som gikk galt',
    tekst: 'Leah skulle tegne en hest til kunstutstillingen på skolen. Hun hadde øvd i flere dager, men den dagen det gjaldt, ble beina for korte og hodet for stort. Hun ble så lei seg at hun nesten krøllet sammen arket. Læreren satte seg ved siden av henne og så lenge på tegningen. «Hva om det ikke er en hest?» sa hun. «Hva om det er et dyr ingen har sett før?» Leah så på tegningen igjen. Det korte, tjukke dyret så faktisk litt morsomt ut. Hun tegnet på en lang hale, store ører og et smil. Så ga hun det navnet Pomp. På utstillingen var det Pomp folk stoppet ved og lo av, på en god måte. En gutt spurte om han kunne tegne Pomp også. Leah tenkte at det hun hadde trodd var en feil, var det beste hun hadde laget.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['En feil kan bli til noe bra hvis du ser den på en ny måte', 'Hester er så vanskelige å tegne at man bør la være', 'Lærere vet alltid best hva barna bør tegne på skolen', 'Utstillinger er skumle fordi alle ser på det du har laget'], svar: 'En feil kan bli til noe bra hvis du ser den på en ny måte' },
      { q: 'Hva gjør læreren som hjelper mest?', alternativer: ['Hun får Leah til å se tegningen på en ny måte', 'Hun tegner hesten for Leah så den blir riktig', 'Hun gir Leah et nytt ark og ber henne starte', 'Hun sier at tegningen er fin akkurat som den er'], svar: 'Hun får Leah til å se tegningen på en ny måte' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Det hun hadde trodd var en feil, var det beste hun hadde laget.»', '«Beina ble altfor korte og hodet ble altfor stort på hesten hennes.»', '«Hun tegnet på en lang hale og ga det rare dyret navnet Pomp.»', '«Hun hadde øvd i flere dager før den store utstillingen på skolen.»'], svar: '«Det hun hadde trodd var en feil, var det beste hun hadde laget.»' },
    ],
  },
  {
    id: 'h-soppel',
    type: 'hovedtanke',
    tittel: 'Stranda som ble ren',
    tekst: 'Klasse 4B dro til stranda for å bade, men det var nesten umulig å finne en plass uten søppel. Plastflasker, poser, tau og et gammelt bildekk lå mellom steinene. Noen av barna ble sinte, andre ble triste. Læreren spurte hva de ville gjøre med det. Først ville de bare dra hjem. Men så foreslo Omar at de kunne rydde. De hadde ingen sekker, så de brukte matpakkeposene og en jakke. På én time hadde de samlet en haug så stor at den rakk til knærne. Da kom en mann fra kommunen forbi, og han ble så imponert at han hentet ordentlige sekker og hansker. Uka etter sto det i avisen, med bilde av hele klassen. Men det barna husket best, var ikke avisen. Det var følelsen av å bade i rent vann på en strand de selv hadde gjort fin.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At barna valgte å gjøre noe med problemet i stedet for å gi opp', 'At stranda var så full av søppel at ingen lenger kunne bade der', 'At klassen kom i avisen med et stort bilde av alle på forsiden', 'At det er farlig å bade der det ligger gamle bildekk i vannet'], svar: 'At barna valgte å gjøre noe med problemet i stedet for å gi opp' },
      { q: 'Hva var det viktigste for barna til slutt?', alternativer: ['Følelsen av å ha gjort stranda fin selv', 'Bildet av klassen som sto i avisen', 'Sekkene og hanskene fra kommunen', 'At de slapp å ha skole den dagen'], svar: 'Følelsen av å ha gjort stranda fin selv' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Vi kan gjøre noe selv', 'Søppel er ekkelt å ta i', 'Klasse 4B på badetur', 'Slik bader du trygt'], svar: 'Vi kan gjøre noe selv' },
    ],
  },
  {
    id: 'h-sovn',
    type: 'hovedtanke',
    tittel: 'Hvorfor sover vi?',
    tekst: 'Vi bruker nesten en tredjedel av livet på å sove. Det høres ut som bortkastet tid, men kroppen gjør mye viktig mens vi sover. Hjernen rydder opp i alt den har lært i løpet av dagen og flytter det viktigste over til langtidsminnet. Det er derfor du husker gloser bedre etter en natts søvn. Kroppen reparerer muskler og lager stoffer som gjør at du vokser. Immunforsvaret, som kjemper mot sykdom, jobber også hardest om natten. Barn på din alder trenger mellom ni og elleve timer søvn. Får du for lite, blir det vanskeligere å konsentrere seg, du blir lettere irritert, og du blir fortere syk. Lys fra skjermer lurer hjernen til å tro at det er dag, så det er lurt å legge bort nettbrettet en time før leggetid. Søvn er ikke bortkastet tid. Det er tiden da kroppen gjør seg klar til en ny dag.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Søvn er viktig fordi kroppen og hjernen gjør mye nyttig mens vi sover', 'Barn sover altfor mye og burde heller være oppe og leke med venner', 'Skjermer er så farlige at ingen barn bør bruke dem om kvelden i det hele tatt', 'Gloser er lette å lære hvis man bare leser dem mange nok ganger'], svar: 'Søvn er viktig fordi kroppen og hjernen gjør mye nyttig mens vi sover' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Søvn er ikke bortkastet tid.»', '«Vi sover en tredjedel av livet.»', '«Barn trenger ni til elleve timer.»', '«Lys fra skjermer lurer hjernen.»'], svar: '«Søvn er ikke bortkastet tid.»' },
      { q: 'Hvorfor nevner forfatteren gloser?', alternativer: ['For å vise at søvn hjelper hukommelsen', 'For å si at skolen er det viktigste', 'For å fortelle om fremmede språk', 'For å gjøre teksten litt lengre'], svar: 'For å vise at søvn hjelper hukommelsen' },
    ],
  },
  {
    id: 'h-lillebror',
    type: 'hovedtanke',
    tittel: 'Det lille ordet',
    tekst: 'Lillebroren til Filip var to år og kunne nesten ikke snakke. Han pekte og laget lyder, og Filip syntes det var slitsomt å prøve å forstå ham. En ettermiddag var de alene hjemme en halvtime. Lillebror sto ved kjøleskapet og ropte «da! da!» og ble mer og mer sint. Filip prøvde melk, prøvde yoghurt, prøvde en agurk. Lillebror kastet alt på gulvet. Til slutt satte Filip seg ned på gulvet, helt rolig, og så på ham. Han fulgte blikket hans. Lillebror så ikke på kjøleskapet, men på magnetene på døra, en liten, gul and. «And?» sa Filip. Lillebror lyste opp, tok anda og klemte den inntil seg. Da mamma kom hjem, satt de to på gulvet og lekte sammen. Filip tenkte at det ikke var lillebror som var vanskelig å forstå. Han hadde bare ikke sett ordentlig etter.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['For å forstå noen må du roe deg ned og se ordentlig etter', 'Små barn er slitsomme fordi de ikke kan si hva de vil ha', 'Filip liker ender bedre enn alle andre dyr i hele verden', 'Kjøleskap er fulle av mat som små barn ikke liker å spise'], svar: 'For å forstå noen må du roe deg ned og se ordentlig etter' },
      { q: 'Hva var det som endret alt?', alternativer: ['Filip satte seg ned og fulgte blikket til lillebror', 'Mamma kom hjem og tok lillebror opp på fanget sitt', 'Lillebror ble helt stille og la seg ned på kjøkkengulvet', 'Filip fant yoghurten som lillebror hadde hatt lyst på'], svar: 'Filip satte seg ned og fulgte blikket til lillebror' },
      { q: 'Hvilken overskrift passer også?', alternativer: ['Å lytte med øynene', 'Melk eller yoghurt?', 'Den sinte lillebroren', 'En halvtime alene'], svar: 'Å lytte med øynene' },
    ],
  },
  {
    id: 'h-vann',
    type: 'hovedtanke',
    tittel: 'Dråpen som reiser',
    tekst: 'Vannet du drakk i dag, kan ha vært i en sky over Afrika for lenge siden, eller i en isbre før det fantes mennesker. Vann forsvinner nemlig aldri. Det bare flytter seg. Sola varmer opp havet, og vann stiger opp som usynlig damp. Høyt oppe blir dampen kald og samler seg til små dråper, som vi ser som skyer. Når dråpene blir tunge nok, faller de ned som regn eller snø. Noe renner i elver tilbake til havet, noe siger ned i jorda og blir til grunnvann, og noe drikker vi. Så begynner det hele på nytt. Denne reisen kalles vannets kretsløp, og den har pågått i milliarder av år. Det betyr at vi aldri får nytt vann, bare det samme vannet om og om igjen. Derfor er det så viktig at vi ikke forurenser det. Det vi slipper ut i en bekk i dag, kan noen drikke et annet sted om hundre år.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At vannet går i et kretsløp og aldri blir borte', 'At det regner mye mer i Afrika enn i Norge', 'Hvordan skyer ser ut når man ser dem fra fly', 'At isbreene smelter fordi det blir varmere'], svar: 'At vannet går i et kretsløp og aldri blir borte' },
      { q: 'Hvorfor sier forfatteren at vi ikke må forurense vannet?', alternativer: ['Fordi det samme vannet brukes om og om igjen', 'Fordi fiskene liker best å svømme i rent vann', 'Fordi regn er så sjeldent at vi må spare på det', 'Fordi vann er dyrt å kjøpe i butikken'], svar: 'Fordi det samme vannet brukes om og om igjen' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Det samme vannet, om og om igjen', 'Slik lager du regn i stua di', 'Afrikas skyer og hvor de kommer fra', 'Isbreens lange historie i Norge'], svar: 'Det samme vannet, om og om igjen' },
    ],
  },
  // ---- UTKAST (runde 5, etappe X): åtte nye tekster per nivå ----
  {
    id: 's-vott',
    type: 'slutning',
    tittel: 'Den ene votten',
    tekst: 'Sara kom inn døra med røde kinn. Hun hadde snø på knærne og i håret, og den ene votten var borte. I lomma lå en kongle og tre små steiner. Mamma så på henne og spurte om hun hadde hatt det gøy. Sara nikket og ristet snø ut av lua. Så kikket hun ut av vinduet mot haugen bak huset. Der sto et lite fjell av snø med to pinner stukket inn på sidene og en rød vott øverst. Mamma smilte og hentet en tørr vott fra skuffen. Hun sa at den som sto der ute, sikkert trengte votten mer enn Sara akkurat nå. Så satte hun på kakao, og Sara fortalte om de tre steinene som skulle være knapper på magen. I morgen skulle hun lage en til, sa hun, en liten en, så den store ikke ble alene.',
    sporsmaal: [
      { q: 'Hva har Sara gjort?', alternativer: ['Lekt ute i snøen bak huset', 'Sittet inne og sett på film', 'Vært på skolen hele dagen', 'Hjulpet mamma med middag'], svar: 'Lekt ute i snøen bak huset' },
      { q: 'Hvor er den andre votten?', alternativer: ['På snømannen i hagen', 'Hjemme hos en venn', 'I lomma på jakka', 'Glemt igjen på bussen'], svar: 'På snømannen i hagen' },
      { q: 'Hvordan vet vi at hun har hatt det gøy?', alternativer: ['Hun nikker og har røde kinn', 'Hun sier at hun fryser', 'Hun gråter og vil inn', 'Mamma sier det til henne'], svar: 'Hun nikker og har røde kinn' },
    ],
  },
  {
    id: 's-kake-borte',
    type: 'slutning',
    tittel: 'Hvor ble det av kaka?',
    tekst: 'Da pappa kom inn på kjøkkenet, sto kakefatet tomt på benken. Det lå smuler på gulvet i en lang stripe bort til sofaen. Hunden Max lå under bordet med halen mellom beina og så en annen vei. Han slikket seg om munnen. Lillesøster satt på gulvet og lekte med klosser, med helt rene hender. Pappa sukket, hentet kosten og så strengt på Max. Max la ørene flatt. Han tok Max i halsbåndet og fulgte ham ut i gangen, der kurven hans sto. Max la seg ned med et sukk og så på pappa med store øyne. Lillesøster lo og klappet i hendene, for hun hadde sett det hele fra gulvet. Pappa måtte bake en ny kake før gjestene kom klokka fem, og denne gangen satte han fatet øverst i skapet.',
    sporsmaal: [
      { q: 'Hvem har spist kaka?', alternativer: ['Hunden Max', 'Lillesøster', 'Pappa selv', 'En nabo'], svar: 'Hunden Max' },
      { q: 'Hvilket spor viser hvor kaka ble spist?', alternativer: ['Smulene bort til sofaen', 'Det tomme fatet på benken', 'Klossene på gulvet', 'Kosten pappa hentet'], svar: 'Smulene bort til sofaen' },
      { q: 'Hvordan vet vi at lillesøster er uskyldig?', alternativer: ['Hun har helt rene hender', 'Hun sier at hun ikke gjorde det', 'Hun sover på rommet sitt', 'Pappa gir henne en kake til'], svar: 'Hun har helt rene hender' },
    ],
  },
  {
    id: 's-sykkel',
    type: 'slutning',
    tittel: 'Sykkelen ved gjerdet',
    tekst: 'Jonas skulle sykle til fotballtrening, men sykkelen hans sto ikke i garasjen. Han lette i hagen og bak huset. Ingenting. Så så han naboen Ali komme gående med et plaster på kneet og grus på buksa. Bak Ali, lent mot gjerdet, sto en blå sykkel med et bøyd forhjul. Ali så ned i bakken og sa at han bare skulle låne den en liten tur. Jonas kjente igjen klistremerket på stanga. Han sa ingenting med det samme. Han så på kneet til Ali, som fortsatt blødde litt gjennom plasteret, og så på det skjeve hjulet. Så sa han at de kunne fikse hjulet sammen i garasjen til pappa, og at Ali måtte spørre neste gang. Ali nikket mange ganger og tilbød seg å bære sykkelen hele veien dit.',
    sporsmaal: [
      { q: 'Hva har skjedd med Ali?', alternativer: ['Han har falt med sykkelen', 'Han har mistet nøkkelen sin', 'Han har gått seg bort i skogen', 'Han har vært hos legen'], svar: 'Han har falt med sykkelen' },
      { q: 'Hvem eier den blå sykkelen?', alternativer: ['Jonas', 'Ali', 'Naboen til Ali', 'Treneren'], svar: 'Jonas' },
      { q: 'Hvorfor ser Ali ned i bakken?', alternativer: ['Han har dårlig samvittighet', 'Han leter etter noe han mistet', 'Han er trøtt etter turen', 'Han vil ikke bli sett av mamma'], svar: 'Han har dårlig samvittighet' },
    ],
  },
  {
    id: 's-nabo',
    type: 'slutning',
    tittel: 'Lyset i vinduet',
    tekst: 'Hver kveld klokka sju tente det et lys i vinduet hos den gamle damen i enden av gata. Hun satt alltid i stolen ved vinduet og så ut. Noen ganger vinket hun til barna som gikk forbi. En uke var vinduet mørkt hver kveld. Avisene lå i en haug på trappa, og postkassen var full. Så en dag sto en bil med blå striper utenfor huset. Dagen etter tente lyset igjen, og en yngre dame kom ut med posene med aviser. Barna så at den yngre damen gikk inn og ut med handleposer de neste dagene, og at hun luftet hunden hver morgen. En uke senere satt den gamle damen igjen i stolen sin ved vinduet. Hun var litt blekere enn før, men hun vinket da barna gikk forbi, og de vinket tilbake så armene nesten løsnet.',
    sporsmaal: [
      { q: 'Hvorfor var vinduet mørkt en hel uke?', alternativer: ['Damen var ikke hjemme, kanskje på sykehus', 'Strømmen i huset hadde gått', 'Damen hadde flyttet til en ny by', 'Hun ville ikke bli sett av barna'], svar: 'Damen var ikke hjemme, kanskje på sykehus' },
      { q: 'Hva tyder avisene på trappa på?', alternativer: ['Ingen hadde vært hjemme', 'Damen leste veldig mye', 'Avisbudet var syk', 'Barna hadde lekt der'], svar: 'Ingen hadde vært hjemme' },
      { q: 'Hvem er den yngre damen, tror du?', alternativer: ['Noen fra familien som hjelper', 'En ny dame som har kjøpt huset', 'En politikvinne som leter', 'En nabo som vil låne noe'], svar: 'Noen fra familien som hjelper' },
    ],
  },
  {
    id: 's-matpakke',
    type: 'slutning',
    tittel: 'Den tomme matboksen',
    tekst: 'Oda åpnet matboksen i storefri. Den var tom, bortsett fra en liten lapp. På lappen sto det «Beklager! Spiste den i bilen. Kjøper boller til deg etterpå. Pappa.» Oda sukket, men måtte le litt. Vennen Theo delte brødskiva si med henne. Etter skolen sto pappa ved porten med en pose fra bakeriet og et flaut smil. Oda tok posen, kjente lukten av kanel og sa at han var tilgitt, men bare denne ene gangen. Senere på kvelden fant hun en ny lapp i matboksen for neste dag. Der sto det «Til Oda. Pakket av pappa. Ikke spist av pappa.» Mamma lo så hun måtte sette fra seg koppen, og pappa lovet høytidelig å lage sin egen matpakke fra nå av. Oda la lappen i skuffen på rommet, sammen med de andre tingene hun ville spare på.',
    sporsmaal: [
      { q: 'Hvorfor er matboksen tom?', alternativer: ['Pappa spiste maten i bilen', 'Oda glemte å pakke mat', 'Theo tok maten hennes', 'Hunden spiste den hjemme'], svar: 'Pappa spiste maten i bilen' },
      { q: 'Hva får Oda i stedet?', alternativer: ['Boller fra bakeriet', 'Penger til kantina', 'Et nytt eple', 'En ny matboks'], svar: 'Boller fra bakeriet' },
      { q: 'Hvorfor smiler pappa flaut?', alternativer: ['Han vet at det var hans feil', 'Han har glemt bollene hjemme', 'Han er sen til et møte', 'Han er stolt av Oda'], svar: 'Han vet at det var hans feil' },
    ],
  },
  {
    id: 's-baat',
    type: 'slutning',
    tittel: 'Båten som ikke kom',
    tekst: 'Emil sto på brygga med redningsvest og fiskestang. Bestefar hadde sagt at han skulle hente ham med båten klokka ti. Nå var klokka halv elleve. Vinden hadde økt, og bølgene slo hvitt mot steinene. Emil så en liten båt langt der ute, men den gikk den andre veien, mot land på andre siden. Mobilen hans ringte. Det var bestefar. Han hørtes andpusten ut og sa at Emil måtte gå hjem og vente der. Emil pakket sammen fiskestanga og begynte å gå den lange grusveien hjem. Regnet kom før han var halvveis. Da han åpnet døra, sto bestefar i gangen, våt i håret, med kaffe i koppen. Han hadde måttet legge båten i den andre viken og gå hele veien rundt. I morgen, sa han, skulle de dra tidlig, før vinden våknet.',
    sporsmaal: [
      { q: 'Hvorfor kommer ikke bestefar?', alternativer: ['Det er for mye vind og bølger', 'Han har glemt hele avtalen', 'Båten er solgt til naboen', 'Han har sovnet hjemme'], svar: 'Det er for mye vind og bølger' },
      { q: 'Hva gjør båten der ute?', alternativer: ['Søker ly på den andre siden', 'Fisker etter makrell', 'Venter på at Emil skal svømme', 'Leter etter Emil på brygga'], svar: 'Søker ly på den andre siden' },
      { q: 'Hvorfor hørtes bestefar andpusten ut?', alternativer: ['Han har kjempet mot vinden', 'Han har løpt fra bussen', 'Han er sint på Emil', 'Han har vært og badet'], svar: 'Han har kjempet mot vinden' },
    ],
  },
  {
    id: 's-bursdag',
    type: 'slutning',
    tittel: 'Stille i huset',
    tekst: 'Da Leo kom hjem fra skolen på bursdagen sin, var huset helt stille. Ingen ballonger, ingen kake, ingen som ropte gratulerer. Han la fra seg sekken og kjente at han ble litt lei seg. Så la han merke til at stuedøra var lukket, og det var den aldri. Under døra kom det et svakt lys, og han hørte noen hviske og en papirpose som knitret. Leo smilte for seg selv, tok et dypt pust og åpnet døra sakte. Lyset ble skrudd på, og der sto alle sammen: mamma, pappa, bestemor og tre venner fra klassen, under en bue av ballonger. Kaka på bordet hadde ni lys og et lite tog av marsipan. Leo måtte sette seg ned et øyeblikk før han klarte å si noe. Så lo han, og alle begynte å synge samtidig, hver i sin takt.',
    sporsmaal: [
      { q: 'Hva venter bak stuedøra?', alternativer: ['En overraskelsesfest', 'En sovende hund', 'En ny TV til stua', 'Ingenting spesielt'], svar: 'En overraskelsesfest' },
      { q: 'Hva får Leo til å skjønne det?', alternativer: ['Lyset og hviskingen bak døra', 'Sekken sin i gangen', 'At huset var stille', 'At det var bursdagen hans'], svar: 'Lyset og hviskingen bak døra' },
      { q: 'Hvorfor smiler Leo før han åpner?', alternativer: ['Han har skjønt hva som skjer', 'Han har funnet en gave', 'Han tenker på skolen', 'Han hører at hunden bjeffer'], svar: 'Han har skjønt hva som skjer' },
    ],
  },
  {
    id: 's-hage',
    type: 'slutning',
    tittel: 'Hullene i hagen',
    tekst: 'Hver morgen fant mormor nye hull i blomsterbedet. Jorda lå spredt utover plenen, og flere løker var borte. Hun satte opp et lite gjerde, men hullene kom likevel. En natt satt hun oppe med lommelykt. Rundt midnatt kom det et grått dyr med busket hale over gjerdet. Det gravde fort med forbeina og løp opp i det store treet med noe i munnen. Mormor lo lavt og la lommelykta fra seg. Dagen etter la hun noen nøtter på et fat ved foten av treet. Hun tenkte at hvis tyven fikk mat et annet sted, ville den kanskje la løkene være. Det virket litt. Hullene ble færre, og om morgenen satt ekornet på gjerdestolpen og spiste med halen opp, som om det eide hele hagen.',
    sporsmaal: [
      { q: 'Hvem graver i bedet?', alternativer: ['Et ekorn', 'En hund', 'En katt', 'Et pinnsvin'], svar: 'Et ekorn' },
      { q: 'Hvorfor hjelper ikke gjerdet?', alternativer: ['Dyret klatrer over det', 'Gjerdet er for lavt for katter', 'Dyret graver under det', 'Mormor glemmer å lukke det'], svar: 'Dyret klatrer over det' },
      { q: 'Hvorfor ler mormor til slutt?', alternativer: ['Hun syns tyven er søt', 'Hun har fanget dyret', 'Hun fikk løkene tilbake', 'Hun ser at det er hunden'], svar: 'Hun syns tyven er søt' },
    ],
  },
  {
    id: 'o-skiheis',
    type: 'ordforraad',
    tittel: 'Første tur i skiheisen',
    tekst: 'Nora sto i køen til skiheisen med hjertet dunkende. Stolen kom glidende bakfra, og hun satte seg med et lite hopp. Heisen steg sakte oppover, og under henne ble husene bitte små. Oppe på toppen var lufta skarp og kald, og det glitret i snøen. Hun trakk pusten dypt og skjøv seg utfor. Først var svingene stive og usikre, men snart gled hun smidig nedover. Nederst sto pappa og jublet. På vei opp i heisen for andre gang var hun ikke redd lenger. Hun så på fjellene rundt, hvite og stille, og på de små prikkene av skiløpere langt der nede. Pappa sa at hun hadde vært modig, og at mot ikke betyr å ikke være redd, men å prøve likevel. Hun bestemte seg for å ta heisen ti ganger til før de dro hjem.',
    sporsmaal: [
      { q: 'Hva betyr det at hjertet «dunket»?', alternativer: ['Det slo fort og hardt', 'Det gjorde vondt', 'Det sto nesten stille', 'Det var helt rolig'], svar: 'Det slo fort og hardt' },
      { q: 'Hva betyr «skarp» om lufta?', alternativer: ['Kald og klar', 'Varm og fuktig', 'Full av røyk', 'Helt stille'], svar: 'Kald og klar' },
      { q: 'Hvilket ord betyr det motsatte av «stive»?', alternativer: ['Smidige', 'Trege', 'Harde', 'Kalde'], svar: 'Smidige' },
    ],
  },
  {
    id: 'o-brannmann',
    type: 'ordforraad',
    tittel: 'Besøk på brannstasjonen',
    tekst: 'Klassen fikk komme inn i den store garasjen. Brannbilene sto blankpusset på rekke, røde og skinnende. En brannkonstabel viste dem slangene, som lå kveilet opp i ryddige ruller. Han fortalte at bilen kunne ha med tusenvis av liter vann. Så fikk barna prøve hjelmen. Den var tung og klam innvendig. Til slutt lot han alarmen ule i tre sekunder, og alle holdt seg for ørene. Før de gikk, fikk hver elev et klistremerke med en liten rød bil på. Brannkonstabelen sa at det viktigste de kunne lære, var å komme seg ut og ringe 110, og aldri gjemme seg under senga om det brant. På bussen hjem øvde klassen på å si nummeret i kor, så høyt at sjåføren lo.',
    sporsmaal: [
      { q: 'Hva betyr «blankpusset»?', alternativer: ['Vasket til de skinner', 'Malt i en ny farge', 'Reparert og klare', 'Helt nye fra fabrikk'], svar: 'Vasket til de skinner' },
      { q: 'Hva betyr «kveilet opp»?', alternativer: ['Rullet sammen i ringer', 'Hengt opp på veggen', 'Strukket langs gulvet', 'Pakket i en kasse'], svar: 'Rullet sammen i ringer' },
      { q: 'Hva betyr «klam»?', alternativer: ['Fuktig og litt ekkel', 'Varm og god', 'Tørr og støvete', 'Kald og glatt'], svar: 'Fuktig og litt ekkel' },
    ],
  },
  {
    id: 'o-fiske',
    type: 'ordforraad',
    tittel: 'Natta på brygga',
    tekst: 'Vi dro ut før sola sto opp. Vannet lå blikkstille, og tåka hang lavt over fjorden. Onkel agnet kroken med en bit makrell og kastet snøret langt ut. Lenge skjedde ingenting. Så rykket det voldsomt i stanga, og snøret strammet seg. Jeg sveivet så fort jeg kunne. Opp av vannet kom en torsk så stor at onkel måtte hjelpe meg med håven. Den spratt og sprellet på brygga til vi fikk den i bøtta. Da sola kom opp over åsen, lettet tåka, og vi kunne se helt over til den andre siden. Onkel renset fisken på brygga med en skarp kniv og viste meg hvordan man finner hjertet. Hjemme stekte mormor torsken i smør, og jeg fikk den største biten, fordi det var jeg som hadde dratt den opp.',
    sporsmaal: [
      { q: 'Hva betyr «blikkstille»?', alternativer: ['Helt uten bølger', 'Veldig kaldt', 'Full av fisk', 'Mørkt og dypt'], svar: 'Helt uten bølger' },
      { q: 'Hva vil det si å «agne» kroken?', alternativer: ['Sette på mat til fisken', 'Kaste den langt ut', 'Gjøre den skarp', 'Knyte den fast i snøret'], svar: 'Sette på mat til fisken' },
      { q: 'Hva betyr «sprellet»?', alternativer: ['Kastet seg fram og tilbake', 'Lå helt rolig', 'Svømte vekk', 'Gjemte seg i bøtta'], svar: 'Kastet seg fram og tilbake' },
    ],
  },
  {
    id: 'o-bakeren',
    type: 'ordforraad',
    tittel: 'Morgen i bakeriet',
    tekst: 'Klokka fire om natta tenner bakeren lyset. Han elter deigen med sterke armer til den blir glatt og seig. Så setter han den til heving under et klede, og deigen vokser sakte som en pute. Ovnen glør. Når brødene er ferdige, har de en gyllen, sprø skorpe som knaser når man trykker på den. Lukten siver ut gjennom døra og lokker de første kundene inn fra den kalde gata. Bakeren liker de stille timene best, før byen våkner. Han kjenner på lukten om brødet er ferdig, lenge før klokka ringer. Når den første kunden kommer, er han allerede ferdig med halve dagen. Klokka tolv låser han døra og går hjem for å sove, mens resten av byen akkurat har begynt på lunsjen.',
    sporsmaal: [
      { q: 'Hva betyr å «elte»?', alternativer: ['Kna og trykke deigen', 'Skjære deigen i biter', 'Steke deigen i ovnen', 'Veie opp melet'], svar: 'Kna og trykke deigen' },
      { q: 'Hva betyr «heving»?', alternativer: ['At deigen vokser', 'At deigen blir stekt', 'At deigen blir kald', 'At deigen blir delt'], svar: 'At deigen vokser' },
      { q: 'Hva betyr «lokker»?', alternativer: ['Får dem til å komme inn', 'Skremmer dem bort', 'Varmer dem opp', 'Vekker dem om morgenen'], svar: 'Får dem til å komme inn' },
    ],
  },
  {
    id: 'o-dyrlege',
    type: 'ordforraad',
    tittel: 'Hos dyrlegen',
    tekst: 'Katten Pus hadde haltet i to dager, så vi tok henne med til dyrlegen. På venterommet satt en nervøs hund og skalv. Dyrlegen løftet Pus forsiktig opp på benken og kjente på poten. Pus knurret lavt, men lot henne holde på. Så fant dyrlegen en liten torn som hadde boret seg inn i tredeputen. Hun trakk den ut med en pinsett og la på en kompress. Pus hoppet ned og gikk ut døra med halen i været, like stolt som før. Dyrlegen sa at vi måtte holde poten tørr i tre dager og passe på at Pus ikke slikket på den. Vi fikk en liten tube med salve og en regning som pappa så lenge på. På vei hjem satt Pus i buret og mjauet hele veien, ikke fordi hun hadde vondt, men fordi hun ville ut og vise alle at hun var frisk.',
    sporsmaal: [
      { q: 'Hva betyr «haltet»?', alternativer: ['Gikk ujevnt fordi noe gjorde vondt', 'Sov nesten hele dagen i senga si', 'Spiste veldig lite mat i to dager', 'Mjauet høyt om natta hele uka'], svar: 'Gikk ujevnt fordi noe gjorde vondt' },
      { q: 'Hva betyr «nervøs»?', alternativer: ['Redd og urolig', 'Glad og leken', 'Trøtt og søvnig', 'Sint og sur'], svar: 'Redd og urolig' },
      { q: 'Hva er en «pinsett»?', alternativer: ['Et lite verktøy som griper', 'En slags bandasje til poten', 'En sprøyte med medisin', 'En kam til pelsen'], svar: 'Et lite verktøy som griper' },
    ],
  },
  {
    id: 'o-vulkan',
    type: 'ordforraad',
    tittel: 'Fjellet som sprutet ild',
    tekst: 'En vulkan er et fjell med et hull ned til det glødende indre av jorda. Dypt der nede er steinen så varm at den har smeltet til tykk, flytende masse. Når trykket blir for stort, presses massen opp og renner ut over kanten som lava. Lavaen er rødglødende og ødelegger alt den møter, men når den størkner, blir den til hard, svart stein. Etter mange år kan jorda på vulkanen bli svært fruktbar, og folk dyrker frukt der. Det finnes vulkaner på Island som fortsatt er aktive, og noen ganger må folk flytte fra husene sine når de våkner. Andre vulkaner har sovet i tusen år, med skog på sidene og en innsjø i krateret. Forskere måler små rystelser i bakken for å varsle i tide, slik at ingen blir overrasket av en vulkan som våkner.',
    sporsmaal: [
      { q: 'Hva betyr «glødende»?', alternativer: ['Så varmt at det lyser', 'Veldig mørkt og kaldt', 'Helt kaldt og vått', 'Vått og glatt å ta på'], svar: 'Så varmt at det lyser' },
      { q: 'Hva vil det si at lavaen «størkner»?', alternativer: ['Den blir hard og fast', 'Den blir enda varmere', 'Den renner fortere', 'Den forsvinner i jorda'], svar: 'Den blir hard og fast' },
      { q: 'Hva betyr «fruktbar» om jord?', alternativer: ['God å dyrke i', 'Full av stein', 'Dekket av lava', 'Tørr og død'], svar: 'God å dyrke i' },
    ],
  },
  {
    id: 'o-postbud',
    type: 'ordforraad',
    tittel: 'Postbudet i snøværet',
    tekst: 'Det snødde tett da Kari startet ruta si. Veien var glatt, og hun måtte trå forsiktig med den tunge sekken. Ved det første huset gjødde en hund hissig bak gjerdet, men Kari var vant til det. Hun stappet brevene i postkassa og børstet snø av lokket. Fingrene var stive av kulde. Ved det siste huset sto en gammel mann og ventet med en kopp varm kakao til henne. Det var den beste delen av dagen. Kari har gått den samme ruta i tolv år. Hun kjenner alle hundene og vet hvilke postkasser som har lokk som klemmer. Om sommeren er det lett og lyst, men hun syns vinteren er finest, når alt er stille og snøen knirker under støvlene. Den varme kakaoen hos den gamle mannen er en avtale ingen av dem noen gang har sagt høyt.',
    sporsmaal: [
      { q: 'Hva betyr «tett» om snøværet?', alternativer: ['Mye snø på en gang', 'Lite og lett snø', 'Snø bare om natta', 'Snø som smelter fort'], svar: 'Mye snø på en gang' },
      { q: 'Hva betyr «hissig»?', alternativer: ['Sint og aggressivt', 'Glad og vennlig', 'Trøtt og lavt', 'Stille og rolig'], svar: 'Sint og aggressivt' },
      { q: 'Hva betyr «stive» om fingrene?', alternativer: ['Vanskelige å bøye', 'Veldig varme', 'Rene og tørre', 'Myke og varme'], svar: 'Vanskelige å bøye' },
    ],
  },
  {
    id: 'o-stjerner',
    type: 'ordforraad',
    tittel: 'Natt under stjernene',
    tekst: 'Vi lå på ryggen i soveposene og stirret opp. Himmelen var kullsvart, og stjernene lyste skarpere enn hjemme i byen, der gatelysene blekner dem. Pappa pekte ut Karlsvogna og Nordstjerna. Plutselig strøk et stjerneskudd over himmelen, så raskt at jeg nesten ikke rakk å se det. Mamma hvisket at vi måtte ønske oss noe. Jeg lukket øynene og ønsket at natten kunne vare litt lenger. Jeg lurte på hvor langt borte stjernene var, og pappa sa at lyset fra noen av dem hadde brukt tusen år på å nå øynene mine. Det var vanskelig å forstå. Jeg prøvde å telle dem, men ga opp ved hundre. Det siste jeg husker før jeg sovnet, var at mamma dro glidelåsen på soveposen min helt opp.',
    sporsmaal: [
      { q: 'Hva betyr «kullsvart»?', alternativer: ['Helt svart', 'Litt grå', 'Mørkeblå', 'Full av skyer'], svar: 'Helt svart' },
      { q: 'Hva betyr det at gatelysene «blekner» stjernene?', alternativer: ['Gjør dem svakere å se', 'Gjør dem større', 'Slukker dem helt', 'Flytter dem på himmelen'], svar: 'Gjør dem svakere å se' },
      { q: 'Hva betyr «strøk over himmelen»?', alternativer: ['Fór raskt forbi', 'Sto stille lenge', 'Lyste svakt', 'Falt ned i skogen'], svar: 'Fór raskt forbi' },
    ],
  },
  {
    id: 'h-hjelm',
    type: 'hovedtanke',
    tittel: 'Hvorfor hjelm?',
    tekst: 'Mange barn syns hjelmen er varm og klumpete, og noen tar den av når ingen ser. Men hjelmen har én jobb: å ta imot smellen i stedet for hodet. Hjernen er myk og ligger inni skallen som en gelé i en skål. Et fall på asfalten kan skade den for alltid. En hjelm sprekker kanskje, men den kan byttes. Det kan ikke hodet ditt. Derfor bruker både proffsyklister og brannfolk hjelm, selv om de er voksne og flinke. Det er lett å tenke at det ikke skjer meg. Men de fleste som slår hodet, syklet akkurat som de pleide, på en vei de kjente. En stein, et vått kumlokk eller en bil som ikke så seg for, er alt som skal til. Hjelmen er på i to sekunder og er det billigste du noen gang kommer til å være glad for.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Hjelmen beskytter hodet, som ikke kan byttes', 'Hjelmer er varme og ubehagelige å ha på', 'Proffsyklister sykler fortere enn barn', 'Asfalt er hardere enn gress og sand'], svar: 'Hjelmen beskytter hodet, som ikke kan byttes' },
      { q: 'Hvorfor nevner teksten proffsyklister?', alternativer: ['For å vise at også flinke bruker hjelm', 'For å forklare hvordan en hjelm lages', 'For å si at sykling er farlig for voksne', 'For å fortelle om et sykkelritt'], svar: 'For å vise at også flinke bruker hjelm' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«En hjelm sprekker kanskje, men den kan byttes.»', '«Mange barn syns hjelmen er varm og klumpete å ha på.»', '«Hjernen er myk og ligger inni skallen.»', '«Noen tar den av når ingen ser.»'], svar: '«En hjelm sprekker kanskje, men den kan byttes.»' },
    ],
  },
  {
    id: 'h-pose',
    type: 'hovedtanke',
    tittel: 'Posen som ble til en fisk',
    tekst: 'En plastpose som blåser på sjøen, ser ut som en manet. Skilpadder elsker maneter. Derfor svelger de posen, og den blir liggende i magen. Hvert år dør mange sjødyr av slikt. Det gode er at plast er lett å la være å kaste. En pose i søpla ender i et anlegg, ikke i havet. Og en pose i sekken kan brukes igjen og igjen. Små valg hjemme blir store forskjeller ute på sjøen. Skilpadden er bare ett eksempel. Fugler bygger reir av plastbiter, og fisk spiser små korn av plast som senere havner på tallerkenen vår. Det du kaster riktig i dag, er derfor ikke bare pent for stranda, det er mat som ikke blir ødelagt. Neste gang du ser en pose blåse av gårde, så løp etter den.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At plast vi kaster skader dyr i havet', 'At skilpadder spiser maneter hver dag', 'At plastposer er billige i butikken', 'At havet er fullt av rare dyr'], svar: 'At plast vi kaster skader dyr i havet' },
      { q: 'Hva vil forfatteren at du skal gjøre?', alternativer: ['Kaste plast riktig og bruke posen om igjen', 'Slutte å bade i sjøen om sommeren', 'Mate skilpaddene med riktig mat', 'Kjøpe flere poser i butikken'], svar: 'Kaste plast riktig og bruke posen om igjen' },
      { q: 'Hvilken overskrift passer også?', alternativer: ['Små valg redder sjødyr', 'Slik fanger du maneter trygt', 'Skilpaddens lange liv', 'Hva koster en pose?'], svar: 'Små valg redder sjødyr' },
    ],
  },
  {
    id: 'h-lesing',
    type: 'hovedtanke',
    tittel: 'Ti minutter om dagen',
    tekst: 'Lesing er som en muskel. Den blir sterkere av å bli brukt, men den trenger ikke tunge løft. Ti minutter med en bok hver dag gjør mer enn én lang time i uka. Det kan være en tegneserie, en faktabok om dinosaurer eller baksiden av melkekartongen. Det viktige er at du leser noe du har lyst til å lese. Da går det lettere, og snart leser du både fortere og lengre uten å merke det. Noen barn tror de ikke liker å lese, fordi de har prøvd bøker som var for vanskelige eller kjedelige. Prøv noe annet. Spør på biblioteket om noe med dyr, eller fotball, eller vitser. Når du finner din bok, går de ti minuttene fort, og plutselig har det blitt tjue uten at du merket det.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Litt lesing hver dag av noe du liker gjør deg bedre', 'Tegneserier er bedre enn vanlige bøker', 'Man bør bare lese tykke bøker med små bokstaver', 'Melkekartonger har mye nyttig tekst'], svar: 'Litt lesing hver dag av noe du liker gjør deg bedre' },
      { q: 'Hvorfor sammenlignes lesing med en muskel?', alternativer: ['Begge blir sterkere av å brukes jevnt', 'Begge trenger tunge løft for å vokse', 'Begge blir slitne av å brukes mye', 'Begge finnes bare hos barn'], svar: 'Begge blir sterkere av å brukes jevnt' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Det viktige er at du leser noe du har lyst til å lese.»', '«Det kan være en tegneserie eller en faktabok om dinosaurer.»', '«Lesing er som en muskel.»', '«Snart leser du både fortere og lengre.»'], svar: '«Det viktige er at du leser noe du har lyst til å lese.»' },
    ],
  },
  {
    id: 'h-tapte',
    type: 'hovedtanke',
    tittel: 'Kampen vi tapte',
    tekst: 'Vi tapte 0–6, og det var ingen tvil om hvem som var best. I garderoben var det stille. Så sa treneren noe vi ikke hadde ventet. Han sa at han var stolt. Ingen hadde gitt opp, selv da det sto 0–4. Keeperen hadde reddet tre skudd mot slutten, og vi hadde heiet på hverandre hele tiden. Å vinne er gøy, sa han, men å fortsette når det går dårlig, det er det som gjør et lag til et lag. På vei hjem i bilen tenkte jeg på det han sa. Det er lett å være et lag når man vinner. Da smiler alle og klapper. Det vanskelige er å løfte hverandre når det går tungt, og det var det vi hadde gjort. Jeg var fortsatt lei meg for tapet, men ikke på samme måte som før.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Å ikke gi opp betyr mer enn å vinne', 'Et lag må trene mer for å vinne kamper', 'Keeperen var den beste spilleren på laget', 'Garderober er stille etter tap'], svar: 'Å ikke gi opp betyr mer enn å vinne' },
      { q: 'Hvorfor er treneren stolt?', alternativer: ['Laget fortsatte å kjempe og heie', 'Laget scoret flere mål enn ventet', 'Spillerne var stille i garderoben', 'Keeperen var ikke sint etterpå'], svar: 'Laget fortsatte å kjempe og heie' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Det som gjør et lag til et lag', 'Slik blir du en god keeper', 'Vår verste kamp noensinne', 'Treneren som ble sint'], svar: 'Det som gjør et lag til et lag' },
    ],
  },
  {
    id: 'h-tenner',
    type: 'hovedtanke',
    tittel: 'To minutter, to ganger',
    tekst: 'Bakterier elsker sukker. Når du spiser, blir det liggende små rester på tennene, og bakteriene lager syre av dem. Syren spiser seg inn i tannen og lager hull. Tannbørsten fjerner restene før det skjer. Det tar to minutter, morgen og kveld. Det høres lite ut, men de fire minuttene om dagen er forskjellen på en tannlege som sier «fint» og en som finner fram boret. Tenner vokser ikke ut igjen, så det lønner seg å passe på dem. Barn har melketenner først, og de faller ut når de nye kommer. Men de nye tennene skal vare resten av livet, og det er lenge. En tann som får et hull, må bores og fylles, og det hullet kan komme tilbake. Fire minutter om dagen er en liten pris for tenner som holder i åtti år.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['Hvorfor det er viktig å pusse tennene', 'Hvordan bakterier formerer seg i munnen', 'Hva tannlegen gjør med boret', 'Hvorfor sukker smaker godt'], svar: 'Hvorfor det er viktig å pusse tennene' },
      { q: 'Hvorfor nevnes boret?', alternativer: ['For å vise hva som skjer uten pussing', 'For å forklare hvordan tenner vokser', 'For å skremme barn fra tannlegen', 'For å si at tannleger er flinke'], svar: 'For å vise hva som skjer uten pussing' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Tenner vokser ikke ut igjen.»', '«Bakterier elsker sukker.»', '«Det tar to minutter.»', '«Syren lager hull.»'], svar: '«Tenner vokser ikke ut igjen.»' },
    ],
  },
  {
    id: 'h-feil-svar',
    type: 'hovedtanke',
    tittel: 'Hånden i været',
    tekst: 'Mange tør ikke rekke opp hånden fordi de er redde for å svare feil. Men tenk på hva som skjer når noen svarer feil i klassen. Læreren forklarer en gang til, og alle som var usikre, får høre forklaringen. Den som svarte feil, husker det riktige svaret bedre enn de som bare satt stille. Et feil svar er ikke et nederlag. Det er en gratis ekstra forklaring, både for deg og for de andre. Tenk på en time der ingen tør å si noe. Læreren forklarer én gang, og alle som ikke forsto, sitter igjen med det. Så spør én elev om noe som høres dumt ut, og plutselig puster halve klassen lettet ut, for de lurte på det samme. Den eleven gjorde alle en tjeneste.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Feil svar hjelper både deg og klassen å lære', 'Læreren liker best de som svarer riktig', 'Man bør sitte stille når man er usikker', 'Elever som rekker opp hånden får bedre karakter'], svar: 'Feil svar hjelper både deg og klassen å lære' },
      { q: 'Hvem husker svaret best, ifølge teksten?', alternativer: ['Den som svarte feil', 'Den som satt stille', 'Den som svarte riktig', 'Læreren selv'], svar: 'Den som svarte feil' },
      { q: 'Hvilken overskrift passer også?', alternativer: ['Gratis ekstra forklaring', 'Slik får du alltid rett svar', 'Den strenge læreren', 'Stille i klasserommet'], svar: 'Gratis ekstra forklaring' },
    ],
  },
  {
    id: 'h-bestemor-tlf',
    type: 'hovedtanke',
    tittel: 'Telefonen i skuffen',
    tekst: 'Hos bestemor ligger alle telefonene i en skuff når vi spiser. Først syntes jeg det var strengt. Så la jeg merke til noe. Ved bordet hos bestemor snakker vi. Onkel forteller om jobben, kusinen min om hesten sin, og bestemor om da hun var liten og gikk på ski til skolen. Hjemme ser alle ned i hver sin skjerm, og middagen er over på ti minutter. Hos bestemor sitter vi i en time, og ingen savner telefonen. Da vi kom hjem, foreslo jeg at vi kunne prøve det samme, bare én kveld i uka. Pappa sa ja med en gang, og lillebror protesterte høyt. Den første kvelden var det rart og litt stille. Men så begynte mamma å fortelle om første dag på jobb, og middagen varte i nesten en time.',
    sporsmaal: [
      { q: 'Hva handler teksten mest om?', alternativer: ['At måltider uten skjerm gir samtaler og nærhet', 'At bestemor er streng med barnebarna', 'At kusinen har en hest hun liker', 'At middagen hjemme er ferdig fort'], svar: 'At måltider uten skjerm gir samtaler og nærhet' },
      { q: 'Hvordan forandrer forfatteren mening?', alternativer: ['Fra å synes det er strengt til å like det', 'Fra å like det til å synes det er kjedelig', 'Fra å være sulten til å bli mett', 'Forfatteren forandrer ikke mening'], svar: 'Fra å synes det er strengt til å like det' },
      { q: 'Hvilken setning sier det viktigste?', alternativer: ['«Ved bordet hos bestemor snakker vi.»', '«Hos bestemor ligger alle telefonene i en skuff.»', '«Kusinen min forteller om hesten sin.»', '«Middagen er over på ti minutter.»'], svar: '«Ved bordet hos bestemor snakker vi.»' },
    ],
  },
  {
    id: 'h-tre',
    type: 'hovedtanke',
    tittel: 'Treet i skolegården',
    tekst: 'Det store treet i skolegården er over hundre år gammelt. Det gir skygge om sommeren, og om høsten lager bladene et teppe vi hopper i. Fuglene bygger reir i det, og under barken bor biller og maur. Da kommunen ville felle det for å lage flere parkeringsplasser, skrev klassen brev. Vi talte opp alt treet gjør for oss og for dyrene. Treet står der fortsatt, og nå har det et skilt: «Fredet av 4A». Skiltet er bare på liksom, for det er kommunen som bestemmer. Men brevene våre ble lest opp i et møte, og flere voksne skrev under. Nå har kommunen lovet å finne en annen plass til bilene. Når vi begynner på ungdomsskolen, skal treet fortsatt stå der, og kanskje har det fått et skilt som er ekte.',
    sporsmaal: [
      { q: 'Hva er hovedtanken i teksten?', alternativer: ['Et gammelt tre er verdt å ta vare på', 'Parkeringsplasser er viktige for skolen og foreldrene', 'Biller og maur bor under bark', 'Klassen 4A liker å skrive brev'], svar: 'Et gammelt tre er verdt å ta vare på' },
      { q: 'Hva gjorde klassen for å redde treet?', alternativer: ['Skrev brev og fortalte hva treet gir', 'Klatret opp i treet og nektet å gå ned', 'Plantet et nytt tre ved siden av', 'Lagde et skilt og hengte det opp'], svar: 'Skrev brev og fortalte hva treet gir' },
      { q: 'Hvilken overskrift passer best?', alternativer: ['Treet som fikk bli stående', 'Flere parkeringsplasser', 'Fugler og biller i skolegården', 'Høstens bladteppe'], svar: 'Treet som fikk bli stående' },
    ],
  },
]

export function teksterAvType(type) {
  return TEKSTER2.filter((t) => t.type === type)
}
