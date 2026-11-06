# Etappe 2 – Innlogging, profiler og synkronisering

Status: kode ferdig på grenen `adaptiv-laering`. Bygg og 52 tester grønne. Tre ting må gjøres manuelt av Jon (se nederst).

## Endringslogg

- **Innlogging.** Først e-postlenke med tilgangsliste; endret samme dag til e-post og passord med åpen registrering (se under). Supabase holder enheten innlogget.
- **Profiler.** Barna er rader i `children` (kallenavn og figur, ingenting annet). «Hvem skal spille?» viser figurene. Gjesteprofilen «Bare spill!» finnes fortsatt for enheter uten innlogging og lagrer bare lokalt.
- **Ny datamodell per barn** (`src/lib/profil.js`, versjon 2): nivå per fag med rekker og svake oppgavetyper, enkeltsvar (`attempts`), innstillinger, dager til ukestripen, samlekort, kostymer. Alt i én JSON i `progress.data`. Gamle profiler normaliseres automatisk uten å miste stjerner.
- **Fletting** (`mergeData`): høyeste stjerner, mestring celle for celle, logger som union, nivå og innstillinger fra den som er sist oppdatert, kort i bokser etter nyeste. Testet.
- **Offline-tolerant synk** (`StarContext.jsx`): alt lagres lokalt først. Profiler med usendte endringer står i en kø i localStorage som tømmes når nettet er tilbake, når fanen blir synlig igjen, og etter hver endring. Barnelista mellomlagres så «Hvem skal spille?» virker uten nett. Forsiden viser 📴 når nettet er borte.
- **Voksenside per barn** (`Parents.jsx`): faner for hvert barn, også de som ikke spiller nå. Per barn: stjerner, oppdrag/runder og minutter siste uke, nivå per fag (nedtrekk når stigen finnes), de tre oppgavetypene barnet bommer mest på, innstillinger (automatisk opplesing, oppdrag per dag, fagblanding, fast fag), temastiger, siste runder og nullstilling. Endringer for et annet barn lagres lokalt og synkes.
- **Tid per runde** logges automatisk (`ms` i loggen) uten endringer i motorene.
- **Automatisk opplesing følger barnet**: innstillingen ligger i profilen og speiles til enheten når profilen velges. Bryteren i aktivitetene skriver tilbake til profilen.
- **Web-app-manifest** med ikoner (`public/manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) og meta-tagger, så appen kan legges på Hjem-skjermen på iPad, Android og Mac.
- Supabase-skjemaet er uendret: tabellene `children` og `progress` med radnivåsikkerhet (en voksen ser bare egne barn) holder. Jeg har kontrollert reglene.

## Innlogging (endret 2026-11-06)

Etter samtale med Jon: **e-post og passord med åpen registrering og e-postbekreftelse**, ikke e-postlenke og tilgangsliste. Alle kan lage familiekonto; radnivåsikkerheten gjør at en konto bare ser sine egne barn. Gjestemodus («Bare spill!») finnes fortsatt uten konto. «Glemt passord» sender en lenke som åpner et skjema for nytt passord. Voksensiden har «Slett familiekontoen og alt innhold» (bruker SQL-funksjonen `delete_my_account`), og det finnes en personvernside (lenket fra innloggingen og voksensiden).

## Dette må Jon gjøre selv (nøkler og innstillinger skal ikke i repoet)

1. **Vercel → Settings → Environment Variables:** `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` for Production og Preview. ✅ Gjort 2026-11-06. Nye deploy etter dette tidspunktet har dem.
2. **Supabase → Authentication → Sign In / Providers → Email:** «Allow new users to sign up» på, «Confirm email» på. ✅ Gjort.
3. **Supabase → Authentication → Sign In / Providers → Email (eller Settings → Auth):** minimum passordlengde 8, og slå på «Leaked password protection».
4. **Supabase → Authentication → URL Configuration:** Site URL `https://selmasskole.vercel.app`, Redirect URLs `https://selmasskole.vercel.app/**`, `https://*-jon-johansens-projects-8ef07106.vercel.app/**` og `http://localhost:5173/**`.
5. **Supabase → SQL Editor:** kjør innholdet i `supabase/migrations/20261106_delete_my_account.sql` én gang, så «Slett familiekontoen» virker. (Claude fikk ikke lov til å kjøre denne selv, siden den sletter i `auth.users`.)
6. **Før lenken deles bredt:** koble på egen e-postleverandør under Authentication → Emails → SMTP Settings (Supabase sin innebygde e-post sender bare noen få e-poster i timen).

## Prøv

- Åpne appen uten innlogging: «Bare spill!» virker som før.
- Trykk «For voksne: logg inn», skriv e-posten din, åpne lenken på samme enhet. Lag to profiler med figur.
- Spill en runde som det ene barnet, bytt enhet (eller nettleser), logg inn og velg samme barn: stjernene er med.
- Slå på flymodus midt i en runde, fullfør, slå på nettet igjen: 📴 forsvinner og voksensiden viser «✅ synket».
- Voksensiden: hold inne tre sekunder, skriv årstall. Bytt fane mellom barna, slå på automatisk opplesing for det yngste. Velg det barnet på forsiden: opplesingen er på.
- «Legg til på Hjem-skjerm» på iPad: ikonet er reven.
