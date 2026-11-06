# Etappe K – Innhold (runde 3)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne. Filene under er fortsatt merket UTKAST: `src/data/lesing/innhold.js`, `src/data/lesing/tekster2.js`, `src/data/engelsk/innhold.js`, `src/data/laerkort.js`.

## Rettet

- **Lydrette ord:** ski, sky, hund, rød, kopp og gås er tatt ut (gås fordi emojien er for ny).
- **Rettskriving:** «sten» og «ren» er byttet mot «stain» og «rain» som feilsvar.
- **Ordklasser:** verbene står i infinitiv (løpe, spise, sove …), som kortet sier.
- **Tegnsetting:** tolv setninger der bare ett tegn er naturlig, fire per tegn.
- **Kortet om stumme bokstaver:** «gj» forklares før eksempelet «deig».
- **Lese 10–12:** feilsvarene i 63 spørsmål er skrevet om så de er like lange som riktig svar. Test: riktig svar er det lengste i under 35 % av spørsmålene, og aldri mer enn 40 % lengre enn det lengste feilsvaret.
- **Lese 8:** åtte nye tekster på 40–80 ord (kattungen, skoleveien, snømannen, bussturen, bakedag, kampen, fuglebrettet, første bad), tre faktaspørsmål hver.
- **Matte nivå 5–6:** høyst én av åtte oppgaver har 0 som ledd (oppgavene er merket `harNull`, og oppdragsbyggeren bytter ut de overflødige). Null har egne forklaringer: «Pluss null er det samme tallet», «Tar vi bort null, er alt igjen», «Alle ligger i én haug, den andre er tom».
- **Forklaringer:** entall og flertall der tallet er 1 (eple/epler, tier/tiere, hundrer/hundrere, ener/enere, gruppe/grupper, rad/rader), og «1/3 av 12 er 12 ÷ 3 = 4» i stedet for «1 × 4».
- **Matte nivå 32:** «… = 160 + ?» med svar 0 lages ikke lenger.
- **Flagg som bilder:** 53 SVG-flagg fra `flag-icons` (MIT) ligger i `public/flagg/`. Flaggoppgavene viser bilder i oppgaven og som svaralternativer, og «Utforsk kartet» bruker dem også. Service workeren lagrer dem.
- **For nye emojier:** elg → 🦌, gås ute, rosa → 💗, lyseblå og grå ute, bord → lampe 💡, gjerde → 🚧.
- **Småting:** «Du starter på nivå …» vises nå etter plasseringstesten; topplinjens tittel brytes og er mindre på mobil («Geografistigen» klippes ikke); «Prøv selv»-kortet er ugjennomsiktig.

## Testet

- Alle punktene over har en test i `src/lib/__tests__/etappeK.test.js`: ordlister, feilsvar, infinitiv, tegnsetting, kortrekkefølge, svarlengder, antall tekster, null-regelen med forklaring, forklaringer over alle matte-nivåer, nivå 32, fraværende emojier, flaggfiler og flaggoppgaver.

## Prøv selv

- Geografistigen nivå 1 på en Windows-PC: flaggene er bilder.
- Matte nivå 5: et oppdrag har høyst én oppgave med 0, og forklaringen nevner null.
- Lese nivå 8: nye tekster. Lese nivå 10–12: svaralternativene er like lange.
- Nullstill matte og ta plasseringstesten: skjermen «Du starter på nivå …» kommer før kartet.
