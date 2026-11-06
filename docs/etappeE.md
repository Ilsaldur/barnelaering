# Etappe E – Synkronisering, konto og småfeil (runde 2)

Status: ferdig på grenen `adaptiv-laering`. Bygg og tester grønne.

## Endret

- **Nullstilling som holder.** Profilen får `nullstiltT` (tidspunkt). Ved fletting vinner siden med nyest nullstilling for alt; bare når begge sider har samme tidspunkt flettes som før. Nullstill på voksensiden og «Nullstill» i profilen bruker samme `nullstiltData`. Test: nullstill på enhet A, flett med gamle data fra B, resultatet er fortsatt nullstilt.
- **Henter fra skyen og fletter** også når appen blir synlig igjen og når nettet kommer tilbake, ikke bare når profilen velges. Deretter sendes køen.
- **Supabase:** `delete_my_account` kunne kjøres av `anon`. Kjøretilgang er nå fjernet for `anon` og `public` og gitt til `authenticated` (utført direkte i prosjektet 6. november; SQL-fila i `supabase/migrations/` er oppdatert).
- **Stengt registrering** gir en vennlig melding: «Registrering er stengt for nye. Har du konto, logg inn …». Innlogging virker som før.
- **Service worker** (`public/sw.js`): lagrer appskallet, ikoner og de hashede filene, så appen starter uten nett etter første besøk. Sider hentes fra nettet først, så nye utgaver kommer når det er nett. Registreres bare i produksjon. Personvernsiden er oppdatert.
- **Småfeil:**
  - Matte nivå 2 blander nå telling, terningbilder, fingre (ny oppgavetype) og «hvor er det flest».
  - Ingen trivielle oppgaver fra nivå 7: pluss og minus innenfor 10 har aldri 0 som ledd, tiervenner går fra 1 til 9 (ikke 0 + 10).
  - Forklaringen til oppgaver som 20 − 8 går via tieren: «20 − 10 = 10, og så 2 tilbake». Ingen forklaringer sier lenger «− 0» eller «og så 0 til» (testet).
  - Farger: oppgaven viser fargen, svarene er fargenavn som leses opp.
  - Hagen: teksten om klistremerker er byttet til samlekort.
  - Kartet: stien mellom nivåene er tegnet (stiplet hvit linje i slangemønster).
  - Den gamle mattemotoren (`Math.jsx`, `lib/matte.js`), ordspillet og ubrukte quizbanker er fjernet. Fri lek har nå former/mønster og farger; alt annet er stiger.

## Testet

- Fletting etter nullstilling (begge retninger), fletting som før ved samme tidspunkt.
- Ingen 0-ledd i oppgavetypene fra nivå 7, forklaringsmønsteret for hele tiere, nivå 2-blanding, fingre.
- Kartet rendrer sti. Røyktest av alle skjermer.

## Prøv selv

- Nullstill et barn på voksensiden på én enhet. Åpne appen på en annen enhet som sto med gamle data: etter synk er barnet fortsatt nullstilt.
- Legg appen i bakgrunnen på nettbrettet mens du spiller på PC-en. Ta fram nettbrettet igjen: stjernene fra PC-en er der uten å bytte profil.
- Slå på flymodus og åpne appen på nytt (etter minst ett besøk med nett): den starter.
- Matte nivå 2: fem oppgaver på rad er ikke like lenger.
- Farger i fri lek: svarene er navn, og 🔊 leser dem.
