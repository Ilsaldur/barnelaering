# Etappe 2 – Innlogging, profiler og synkronisering

Status: kode ferdig på grenen `adaptiv-laering`. Bygg og 52 tester grønne. Tre ting må gjøres manuelt av Jon (se nederst).

## Endringslogg

- **Innlogging med e-postlenke.** `Family.jsx` ber bare om e-post og kaller `signInWithOtp` med `shouldCreateUser: false`, så ukjente adresser får ingen konto. Ingen passord. Supabase holder enheten innlogget.
- **Profiler.** Barna er rader i `children` (kallenavn og figur, ingenting annet). «Hvem skal spille?» viser figurene. Gjesteprofilen «Bare spill!» finnes fortsatt for enheter uten innlogging og lagrer bare lokalt.
- **Ny datamodell per barn** (`src/lib/profil.js`, versjon 2): nivå per fag med rekker og svake oppgavetyper, enkeltsvar (`attempts`), innstillinger, dager til ukestripen, samlekort, kostymer. Alt i én JSON i `progress.data`. Gamle profiler normaliseres automatisk uten å miste stjerner.
- **Fletting** (`mergeData`): høyeste stjerner, mestring celle for celle, logger som union, nivå og innstillinger fra den som er sist oppdatert, kort i bokser etter nyeste. Testet.
- **Offline-tolerant synk** (`StarContext.jsx`): alt lagres lokalt først. Profiler med usendte endringer står i en kø i localStorage som tømmes når nettet er tilbake, når fanen blir synlig igjen, og etter hver endring. Barnelista mellomlagres så «Hvem skal spille?» virker uten nett. Forsiden viser 📴 når nettet er borte.
- **Voksenside per barn** (`Parents.jsx`): faner for hvert barn, også de som ikke spiller nå. Per barn: stjerner, oppdrag/runder og minutter siste uke, nivå per fag (nedtrekk når stigen finnes), de tre oppgavetypene barnet bommer mest på, innstillinger (automatisk opplesing, oppdrag per dag, fagblanding, fast fag), temastiger, siste runder og nullstilling. Endringer for et annet barn lagres lokalt og synkes.
- **Tid per runde** logges automatisk (`ms` i loggen) uten endringer i motorene.
- **Automatisk opplesing følger barnet**: innstillingen ligger i profilen og speiles til enheten når profilen velges. Bryteren i aktivitetene skriver tilbake til profilen.
- **Web-app-manifest** med ikoner (`public/manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) og meta-tagger, så appen kan legges på Hjem-skjermen på iPad, Android og Mac.
- Supabase-skjemaet er uendret: tabellene `children` og `progress` med radnivåsikkerhet (en voksen ser bare egne barn) holder. Jeg har kontrollert reglene.

## Dette må Jon gjøre selv (nøkler og innstillinger skal ikke i repoet)

1. **Vercel → Settings → Environment Variables:** legg inn `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` (samme verdier som i `.env.local`) for Production og Preview. Uten dem virker bare «Bare spill!».
2. **Supabase → Authentication → Sign In / Providers → Email:** slå av «Allow new users to sign up». Da kan bare adresser som allerede er brukere, få lenke.
3. **Supabase → Authentication → Users → Add user / Invite:** legg inn e-postadressene som skal ha tilgang. Det finnes allerede én bruker i prosjektet.
4. **Supabase → Authentication → URL Configuration:** legg `https://selmasskole.vercel.app` (og forhåndsvisnings-URL-er du vil bruke) i Redirect URLs, ellers havner innloggingslenken på localhost.

## Prøv

- Åpne appen uten innlogging: «Bare spill!» virker som før.
- Trykk «For voksne: logg inn», skriv e-posten din, åpne lenken på samme enhet. Lag to profiler med figur.
- Spill en runde som det ene barnet, bytt enhet (eller nettleser), logg inn og velg samme barn: stjernene er med.
- Slå på flymodus midt i en runde, fullfør, slå på nettet igjen: 📴 forsvinner og voksensiden viser «✅ synket».
- Voksensiden: hold inne tre sekunder, skriv årstall. Bytt fane mellom barna, slå på automatisk opplesing for det yngste. Velg det barnet på forsiden: opplesingen er på.
- «Legg til på Hjem-skjerm» på iPad: ikonet er reven.
