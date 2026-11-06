# Etappe 4 – Dagens økt, kart og belønning

Status: kode ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## Endringslogg

- **Dagens økt på forsiden** (`Home.jsx`, `src/lib/dagen.js`): tre oppdragskort – Matte, et fast fag og en overraskelse (klokke, geografi eller tenkenøtt, lik hele dagen). Lesing-kortet dukker opp automatisk når lesestigen er registrert (etappe 5); til da brukes matte, klokke og geografi. Barnet velger selv. Voksensiden styrer antall oppdrag per dag (1–3), fagblandingen og om Matte eller Lesing er fast (📌). Et fast fag må være med før dagen regnes som ferdig.
- **Ukestripe** med sju ruter (mandag–søndag) øverst i Dagens økt. To oppdrag gir stempel. Ingen premie, ingen rekke som ryker: en fridag er bare tom. Når dagen er ferdig sier reven at alt er åpent for fri lek.
- **Oppdrag telles ett sted**: alle runder merket som oppdrag (mattestigen, sjefsoppgave, og klokke/geografi/nøtt startet fra Dagens økt) teller på dagen, per fag.
- **Eventyrkartet er framgangen** (`Kart.jsx`): fem verdener som fargede seksjoner, hvert nivå et sted på en slangesti, reven på nivået barnet er på. Passerte steder kan spilles om igjen for å forbedre stjernene (uten å påvirke nivået). Steder lenger fram er låst med en vennlig melding. Det gamle fem-steders-kartet med quiz er fjernet.
- **Stjerner per nivå**: 0–3 etter beste resultat på første forsøk, vist på kartet, kan forbedres.
- **Samlekort** (`src/data/kort.js`, `Samling.jsx`): 38 kort i settene Norske dyr, Dinosaurer og Planeter, ett per nivå, hver med en faktalinje som kan leses opp. Kortet gis ved nivå opp eller tre stjerner. Ved godt resultat er det 15 % sjanse for et uventet bonuskort (regnbue, nordlys, drage …). Klistremerkene er borte; «Mine stjerner» heter nå «Samlingen».
- **Kostymer til reven** (`src/data/kostymer.js`): ti kostymer som kjøpes med stjerner av saldoen og vises på reven i oppgavene og på kartet. Kan tas av og på.
- **Familiekisten**: summen av alle barnas stjerner (alle profilene i familiekontoen, eller profilene på enheten) med en fyllingsgrad mot neste milepæl. Appen lover ingen premie.
- **Historiebiter** (`src/data/historier.js`, `Historie.jsx`): én kort fortelling om reven per verden, vist første gang barnet kommer dit. «Les for meg» eller «Jeg leser selv». Huskes i profilen.
- Fletting av dager (`mergeData`) tar hensyn til fag per dag.
- Tester: dagens kort, dagstatus med fast fag, ukestripe, overraskelse, samlekort (ett per nivå, ingen dobbelt, bonus), kiste, og røyktest av forside, samling, kart og historie.

## Prøv som 5-åring

- På forsiden: trykk 🔊 ved teksten under «Dagens økt». Trykk på Matte-kortet og gjør et oppdrag. Tilbake på forsiden har kortet fått ✓ og teksten sier «1 av 2 gjort».
- Trykk på Overraskelse-kortet. Etterpå er dagen ferdig og fredag har fått stempel i ukestripen.
- Gå til Eventyrkartet. Reven står på nivået ditt. Trykk på et låst sted: reven sier det åpner senere.
- Første gang i en ny verden: historien om reven dukker opp. Trykk «Les for meg».
- Samlingen: trykk på et kort du har, og hør fakta om dyret.
- Kjøp en lue til reven (5 ⭐). Start et oppdrag: reven har lua på.

## Prøv som 8-åring

- Voksensiden: sett «Oppdrag per dag» til 3 og «Alltid matte». Dagen blir ikke ferdig før matte er gjort.
- Spill et passert nivå om igjen fra kartet. Nivået endrer seg ikke, men stjernene kan bli bedre.
- Få tre stjerner på nivået ditt uten å gå opp: du får kortet for nivået.
- Sjefsoppgave som lykkes gir kortene for nivåene du hopper over.
- Familiekisten: med to profiler i familiekontoen summeres stjernene til begge.

## Kjente begrensninger

- Overraskelsen Klokka/Geografi bruker de gamle øvingsrundene (åtte oppgaver) på anbefalt nivå. Klokke- og geografistigene kommer i etappe 6.
- Familiekisten hentes fra skyen når Samlingen åpnes. Uten nett vises bare det enheten vet.
