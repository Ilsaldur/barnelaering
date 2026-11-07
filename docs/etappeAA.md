# Etappe AA – Nivå opp krever at nivået er lært, klokka ut av kunnskapslaget (runde 6)

Jon valgte **A** for klokka.

## Endret

- **Kravet for nivå opp** (`kravFor` i `src/lib/nivaaTing.js`, brukt i `applyResult`): i kunnskapsstigene (geografi, engelsk) kreves det, i tillegg til to gode oppdrag på rad, at barnet kjenner minst tre firedeler av nivåets egne ting – alle når nivået har tolv eller færre. Rekka på to holdes til kravet er oppfylt; da åpner nivået etter neste gode oppdrag. Nivåer uten egne ting (Engelsk 8–10) har ikke noe krav. Startskjermen viser «👀 Du kjenner 7 av 22 land» (`data-testid="kjent-av"`), og teksten om neste nivå på kartet, på låste nivåer og på resultatskjermen sier det samme: «Du kjenner 7 av 22 land. Nivå 5 åpner når du kjenner 17 og har to gode oppdrag på rad.» Navnet på tingene kommer fra stigen (`cfg.tingNavn`): land, hovedsteder, land og verdensdeler; ord, setninger, spørsmål.
- **Grensen regnes av spørsmålene** (`tellOppdrag` i `src/lib/matte/etterOppdrag.js`): vis-kort og prøv-plassen teller ikke. Godt = alle spørsmål riktige unntatt høyst ett; svakt = halvparten eller færre. For åtte og fem spørsmål er det akkurat de gamle grensene (7 og 5; 4 og 3). Stjernene regnes av alt (vis-kort teller som riktige), men et feil svar på prøv-plassen trekker ikke: oppgaven tas ut av tellingen. `etterOppdrag` er én felles funksjon for appen (`Stige.jsx`) og simuleringene.
- **Sjefsoppgaven** tilbys bare når alle spørsmålene er riktige og nivåets ting er kjent, og bruker vanlige feilsvar også i kunnskapsstigene.
- **Fire nye**: når nivået har mer enn 20 egne ting og barnet svarte riktig på alle spørsmålene om nye ting i forrige oppdrag, får neste oppdrag fire nye (`fag.nyeMaks`). Da får oppdraget ni oppgaver, så prøv-plassen fortsatt får plass.
- **Prøv-plassen** (erstatter smakebiten i kunnskapsstigene): ett spørsmål om en ukjent ting fra nivået, med vanlige feilsvar og uten vis, sist i oppdraget (`tag: 'prov'`). Riktig gjør tingen kjent; feil trekker ikke stjerner, teller ikke i grensen og går ikke i bom-lista. Er alt på nivået kjent, prøves en ting fra nivået over. Er tingen på prøv-plassen den eneste nye som kan vises, vises den i stedet, så den ikke blir hengende.
- **Nivåets egne ting først**: nye ting som vises, og prøv-plassen, hentes helst blant nivåets egne ting barnet ikke kjenner, så kravet nås. Repetisjonsplassene viser ting fra nivåene under først når nivåets egne ting er kjent.
- **AA2** (nøkler per ferdighet i geografi) ble gjort i etappe Z.
- **Klokka ut av kunnskapslaget (A)**: `KlokkeStige` har ikke lenger `kunnskap`, men `visFoerst` og `egneProver`. Oppgavene lages uten kjent, så feilsvarene er vanlige, og `kjent` oppdateres ikke for klokka. Det første oppdraget på et nytt nivå starter med to vis-kort om nivåets nye ting («Klokka er kvart over 4» med klokke), deretter de åtte vanlige oppgavene (ti i alt; startskjermen sier «Først to kort å se på, så åtte oppgaver»). Har barnet spilt nivået før (`beste[nivå]` finnes), kommer ingen vis-kort. Plasseringen prøver nivåets eget innhold (Z1) uten kjent, og starter fortsatt med vis + spørsmål om det samme; bom der gir innføring som før (to vis-kort med spørsmål om det samme, tre stjerner).
- Samme tekst (engelsk 8) kommer ikke to ganger i ett kunnskapsoppdrag.

Egne ting per nivå: geografi 5, 5, 5, 22, 22, 22, 56, 26, 37; engelsk 20, 16, 24, 12, 41, 42, 42, 0, 0, 0.

## Testet

- `src/lib/__tests__/etappeAA.test.js`:
  - Grensen og stjernene: 2 vis + 5 spørsmål (4 riktige) + prøv-feil gir godt oppdrag, 2 stjerner (6 av 7), nivå opp når kravet er oppfylt. Åtte og fem spørsmål gir de gamle grensene.
  - To gode på rad uten nok kjente ting: rekka holdes på 2, ingen sjefsoppgave, `kravMangler`; med nok kjente: nivå opp og sjefsoppgave.
  - Kravet: alle av fem, 17 av 22; klokka har ikke krav.
  - Tekstene på kartet og resultatskjermen.
  - Prøv-plassen: høyst én per oppdrag, om en ukjent ting, fire alternativer med vanlige feilsvar, ikke vist først, høyst tre vis i oppdraget; finnes i over 90 % av oppdragene.
  - Fire nye etter et oppdrag med alt riktig på et nivå med over 20 ting; tre igjen etter én feil; aldri fire på Geografi 1.
  - Sjefsoppgaven i geografi har fire alternativer.
  - Klokka: to vis-kort først på alle åtte nivåer første gang (kvarter på nivå 4, hele timer på nivå 1), ti oppgaver, fire alternativer, ingen vis-kort på et nivå barnet har spilt; 7 av 8 spørsmål + to vis gir godt oppdrag og 2 stjerner; `kjent` forblir tom. Plasseringen starter med vis, prøvene på nivå 4 er kvarter.
  - Akseptansetest 1a (simulering, «kan ingenting» som husker det som vises, plassert på 1): kjenner minst tre firedeler av Norden-tingene (15) når det går opp til Geografi 4, og bruker 43–83 oppdrag til toppen (snitt 56).
  - Akseptansetest 1b («kan alt», 97 %, 200 barn): plassert på 9 i 84 %, 8 i 6 %, 7 i 2 %, og 1–3 i 9 % (ett glipp på den første eller andre prøven). Plassert på 8 eller 9: toppen innen 8 oppdrag i 100 % (fra 8 tar det 4 oppdrag). Plassert på 7: 13–14 oppdrag, fordi nivå 7 har 56 egne ting og barnet lærer høyst fem per oppdrag (fire vis + prøv). Testen krever ≥ 85 % plassert på 7 eller høyere og ≥ 80 % på toppen innen 8.
  - Akseptansetest 2: et barn som kjenner flagget til Sverige får vis-kort før første kartspørsmål om Sverige (300 oppdrag på Geografi 3; prøv-plassen er unntaket, den spør alltid uten vis).
- `src/__tests__/app/geokrav.app.test.jsx` (akseptansetest 3, i appen): Geografi 4 med 5 av 22 kjent, to oppdrag med alt riktig gjennom oppgavekortene: fortsatt nivå 4, paaRad 2, ingen «Nivå opp», ingen sjefsoppgave, startskjermen sier «Du kjenner x av 22 land» og kartet «Nivå 5 åpner når du kjenner 17.»; andre oppdrag hadde fire nye.
- Oppdaterte tester: etappe T (prøv-plassen spør om ukjent), nesteNivaa-app-testen (kravet), Z4 (klokka uten kjent).
- 369 tester grønne, bygget går (hovedpakken 179 kB gzip).

## To ting å vite

- Et barn som kan alt, men glipper på den første eller andre prøven, lander på nivå 1–3 og må lære seg oppover derfra (ca. 9 % med 97 %-modellen). Det er prisen for at første oppgave også er innføringen for femåringen.
- Fra Geografi 7 tar det 13–14 oppdrag til toppen for et barn som kan alt, fordi nivået har 56 egne ting. Vil du ha det raskere, kan prøv-plassen få to spørsmål når forrige prøv gikk riktig. Si til, så legger jeg det inn.

## Prøv selv

- Geografi, en profil på nivå 4 som alt har to gode oppdrag: kartet sier «Du kjenner x av 22 land. Nivå 5 åpner når du kjenner 17.» Nivå 5 åpner først når tallet er 17, og da uten nytt oppdrag med to gode på rad.
- Siste oppgave i et geografioppdrag er en prøve om noe nytt, med fire svar og uten kort først. Feil svar gir likevel full pott på stjernene om resten var riktig.
- Klokka, nytt nivå: to kort «Klokka er …» først, så oppgaver med fire klokker å velge mellom. Spill nivået igjen: ingen kort.
- Alle riktige på et geografinivå der ikke alt er kjent: ingen sjefsoppgave, og teksten forklarer hvorfor.
