# Etappe Q – Korrektur (runde 4)

## Rettet

- Matte 36: «1 tidel skrives som desimaltall». Matte 37: «1 rute langt».
- Lese 8, «Veien til skolen»: «et bakeri».
- Skrive riktig: «kval» → «hwal» og «hai» → «hæj» som feilsvar (gjort i etappe M, testet her).
- Lese 12: åtte spørsmål har fått like lange feilsvar; riktig svar er nå alene lengst i 5 av 24 spørsmål (21 %), nær det tilfeldige.
- Emojier fra 2020–21: hjul → ☸️; stein → ordet «seil» ⛵; tau og tannbørste er tatt ut av Skrive riktig (erstattet av nye ord i M); «sel» i de lydrette ordene er byttet mot «ris» 🍚; samlekortet «Sel» er blitt «Ulv» 🐺 (samme kort-id, så samlinger beholdes); Merkur har 🌑.

## Testet

`src/lib/__tests__/etappeQ.test.js`: ingen «1 tideler»/«1 ruter» i 400 oppgaver; «et bakeri»; kval/hai borte; andelen lengste riktige svar på Lese 12 mellom 10 og 35 %; ingen av de nye emojiene finnes i datafilene.
