# Plan, runde 3 (tilbakemelding etter test 6. november 2026, etter runde 2)

## Status

| Etappe | Status | Sist oppdatert |
|--------|--------|----------------|
| F – Hjelpemodus (haster) | Ferdig og pushet. Se `docs/etappeF.md`. | 2026-11-06 |
| G – Resultatskjermen på nettbrett | Ferdig og pushet. Se `docs/etappeG.md`. | 2026-11-06 |
| H – Lesing | Ferdig og pushet. Se `docs/etappeH.md`. | 2026-11-06 |
| I – Kort, klokke og kart | Ferdig og pushet. Se `docs/etappeI.md`. | 2026-11-06 |
| J – Under panseret | Ferdig og pushet. Se `docs/etappeJ.md`. | 2026-11-06 |
| K – Innhold | Ikke startet (resten av prompten mottatt). | |

---

## Oppdraget (originalmeldingen, uendret, kuttet der den sluttet)

Du jobber videre på Selmas skole (selmasskole.vercel.app). Runde 2 (etappe A–E) er testet i den publiserte appen 6. november. Nesten alt virker som bestilt. Denne prompten retter det testen fant. Én feil haster: etter ett svakt oppdrag teller ikke riktige svar, og barnet flyttes nedover nivå for nivå.

Der denne prompten og tidligere prompter sier ulike ting, gjelder denne.

ARBEIDSMÅTE
- Ta etappene i rekkefølge. Stopp etter hver med en kort oppsummering: hva som er endret, hva som er testet, og hva jeg bør prøve selv.
- Skriv en test for hver akseptansetest. Flere av feilene lå i samspillet mellom skjerm og regler, ikke i reglene alene. Test derfor gjennom komponentene der det står «i appen».
- Eksisterende framgang skal ikke gå tapt.

ETAPPE F – HJELPEMODUS (haster)
I dag: Etter et oppdrag med 0–4 riktige starter neste oppdrag med hjelpefiguren åpen (hjelpStart). TaskCard setter da usedHelp = true, og oppgaven teller ikke selv om barnet svarer riktig på første forsøk. Et barn som svarer riktig på alt, får «0 av 8», flyttes ned og havner i samme situasjon på nivået under. I testen gikk jeg fra nivå 18 til 15 på fem oppdrag med bare riktige svar.
- Hjelp som appen åpner selv, regnes ikke som brukt hjelp. Oppgaven teller ikke bare når barnet selv trykker «Hjelp» eller «Lær».
- Et oppdrag i hjelpemodus gir aldri paaRad + 1 og aldri tilbud om sjefsoppgave. Er resultatet ikke svakt, slås hjelpemodus av og svakRad nullstilles. Er det svakt, teller det som et svakt oppdrag, som i dag.
- Når barnet flyttes ned, slås hjelpemodus av.
Akseptansetester:
1. I appen: nivå 18, ett oppdrag med 3 riktige, deretter et oppdrag der alle svar er riktige på første forsøk. Resultatskjermen viser 8 av 8, nivået er fortsatt 18, hjelpemodus er av, og det kommer ikke tilbud om sjefsoppgave.
2. Simulering: barn som svarer riktig på 92 % av oppgavene opp til nivå 12, 55 % på nivå 13 og 15 % over. Etter 40 oppdrag står færre enn 5 % på nivå 9 eller lavere.
3. Resultatskjermen viser ingen tent stjerne når resultatet er null stjerner.

ETAPPE G – RESULTATSKJERMEN PÅ NETTBRETT
I dag: Ved 8 av 8 ligger knapper, samlekort og sjefstilbud på én rad som er bredere enn skjermen mellom 768 og 1024 punkter. «Til eventyrkartet» og «Tilbake» havner utenfor kanten.
- Raden skal brytes over flere linjer. Sjefstilbudet skal stå for seg selv, over knappene.
Akseptansetest: Ved bredde 390, 768, 820, 1024 og 1280 finnes ingen vannrett rulling og ingen knapp utenfor skjermen, med både samlekort, sjefstilbud og melding om nivå ned til stede.

ETAPPE H – LESING
H1. Opplesing i leseoppgaver
I dag leser stemmen opp setningen i «Les setningen og finn bildet» og hele teksten på Lese nivå 8–12, også i plasseringstesten.
- I oppgaver der barnet skal lese selv (setning_bilde, tekst_sporsmaal, tekst2), leser stemmen bare instruksjonen og spørsmålet. Det gjelder både automatisk opplesing og høyttalerknappen ved oppgaven.
- En egen knapp «Les teksten for meg» leser teksten. Den regnes som hjelp, så oppgaven teller ikke. Knappen finnes ikke i plasseringstesten.
- speech.setAuto kalt av appen selv skal ikke sette autoSpeakSet. Bare bryteren i en aktivitet og valget på voksensiden gjør det. I dag blir innstillingen låst til «på» første gang profilen åpnes, så regelen om nivå 8 slår aldri inn.
- Plasseringstesten i Lese bruker ikke meningsspørsmål (type «mening»).

H2. Oppdrag på fem oppgaver
- Grenser når oppdraget har fem oppgaver: 4–5 riktige er godt (paaRad + 1), 3 er nøytralt, 0–2 er svakt. Sjefstilbud ved 5 av 5.
- Tekster på skjermen skal si «alle fem» der oppdraget har fem oppgaver.
- På tekstnivåene (Lese 8–12) består et oppdrag av to tekster: tre spørsmål til den ene og to til den andre. Teksten står stille mens spørsmålene byttes. Ingen repetisjon eller smakebit på disse nivåene. Sjefsoppgaven følger samme mønster.
- Meningsspørsmål rettes ikke som rett og galt. Ta dem ut av oppdragene, og skriv nye spørsmål der en tekst da får færre enn tre.
Akseptansetester:
1. I appen med opplesing på: på Lese nivå 7 og 8 inneholder ingen opplest tekst setningen eller teksten barnet skal lese.
2. Ny profil der ingen har rørt bryteren: autoSpeakSet er false etter første oppdrag.
3. Lese nivå 9: 4 av 5 to ganger gir nivå opp. 3 av 5 to ganger gir ingen nedflytting.
4. Et oppdrag på Lese nivå 10 har nøyaktig to ulike tekster.

ETAPPE I – KORT, KLOKKE OG KART
I1. «Lær først»
I dag ligger kortet oppå et oppdrag som allerede er startet. Oppgaven bak leser opp teksten sin og avbryter kortet, og tastetrykk går til oppgaven bak. Svar skrevet på tastaturet i «Prøv selv» ga to feil på den første ekte oppgaven.
- Oppdraget startes først når kortet er lukket. Det samme gjelder kortet som åpnes med «Lær»: oppgaven bak tar ikke imot tastetrykk mens kortet er åpent.
Akseptansetest: Med kortet åpent endrer «99» + Enter ingenting i oppdraget. Med opplesing på er kortets første steg det siste som leses opp når oppdraget åpnes.

I2. Still klokka
I dag regnes timen ut fra viserens vinkel alene. «Fem på 2» blir feil når den korte viseren står nesten på 2, der den hører hjemme, og riktig når den står på 1.
- Regn timen ut fra vinkelen minus minuttenes bidrag (minutt × 0,5 grader).
Akseptansetest: For alle tider med fem minutters steg godtas den korte viseren der en ekte klokke har den.

I3. Verdenskartet
På geografinivå 9 spør appen etter små land på verdenskartet. Danmark er 4 × 5 punkter på mobil.
- På verdenskartet spørres det bare etter land som er minst 24 × 24 punkter ved bredde 390. Små europeiske land hører til Europa-kartet.
- Ta Russland ut av spørsmålene om verdensdel. Skriv Bucuresti.

ETAPPE J – UNDER PANSERET
J1. Migrering og fletting
migrerLesingSpor setter updatedAt til nå. En enhet som åpner med data fra før oppdateringen, vinner da over nivåer som ble satt på en annen enhet etterpå.
- Behold det opprinnelige tidspunktet fra den gamle lesedataen.
Akseptansetest: Enhet A har versjon 3 og nivåer satt i går. Enhet B har versjon 2 fra tre dager siden. Etter fletting gjelder nivåene fra A.

J2. Bom-lista
nivaaForType slår opp på navnet i nivålista, men mange oppgaver får et annet navn når de lages (skriv_diftonger, les_analog_whole, flagg_norden, tekst_slutning, areal, parentes og flere). For disse kommer typen aldri igjen.
- Lagre nivået bommen kom fra sammen med typen, og bruk det.
Akseptansetest: For alle stiger og alle nivåer: en type som bommes på nivå n, kan komme igjen som svak oppgave når barnet står på nivå n eller høyere.

J3. Plasseringstest nedover
I dag går testen to nivåer ned per bom. Et barn på nivå 5 som velger Verdensrommet, får tolv gale svar på rad.
- Ved bom på startnivået går testen til startnivået i verdenen under (29 → 21 → 13 → 6 → 1) og klatrer derfra som vanlig. Taket er da taket til verdenen testen havnet i.
- Hopp over prøven på taket når barnet nettopp besto nivået rett under. Da er plasseringen gitt.
Akseptansetest: Barn som kan til og med nivå 5 og velger Verdensrommet, plasseres på 5 eller 6 med høyst fem gale svar.

J4. Nøttehula
Mini-sudokuen har flere gyldige svar i ruta i 24 % av oppgavene på Vanskelig og 8 % på Middels.
- Spør bare etter en rute der alle løsninger som passer med de viste tallene, har samme tall.

J5. Uten nett
Etter første besøk er bare forsiden lagret. Appen starter uten nett først etter andre besøk.
- La service workeren hente skript og stilark når den installeres.

ETAPPE K – INNHOLD
Rett dette, og merk filene som fortsatt er utkast:
- Lydrette ord: ta ut ski, sky, hund, rød og kopp.
- Rettskriving: «sten» og «ren» er lovlige på bokmål og kan ikke stå som feilsvar.
- Ordklasser: kortet sier «du kan si å foran», men oppgavene bruker «løper» og «spiser». Gjør dem like.
- Tegnsetting: bruk setninger der bare ett tegn er naturlig.
- Kortet om stumme bokstaver: «Ordet begynner med gj» står etter eksempelet «deig».
- Lese 10–12: riktig svar er det lengste alternativet i 63–88 % av spørsmålene. Gjør feilsvarene like lange.
- Lese 8: bare fem tekster. Skriv minst åtte til på 40–80 ord.
- Matte nivå 5–6: høyst én av åtte oppgaver med 0 som ledd, og en egen forklaring for null.
- Forklaringer: «1 biler», «1 tiere», «1 tredeler» og «1/3 er 1 × 4 = 4».
- Matte nivå 32: «8 × 20 = 160 + ?» med svar 0 skal ikke lages.
- Flagg vises som bokstaver på Windows. Bruk flaggbilder (SVG) i stedet for emojier.
- Elg, gås og rosa hjerte er så nye emojier at eldre nettbrett viser tomme ruter. «Table» har bilde av en vedkubbe.
- Småting: skjermen «Du starter på nivå …» etter plasseringen vises aldri. «Geografistigen» klippes på mobil. «Prøv selv»-kortet er gjennomsiktig, så oppgaven bak skinner gjennom.
