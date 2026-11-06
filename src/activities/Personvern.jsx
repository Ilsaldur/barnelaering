import { TopBar } from '../components/ui.jsx'

// Personvernside: hva som lagres, hvor, hvem som ser det og hvordan det slettes.
export default function Personvern({ go }) {
  return (
    <div className="animate-pop-in">
      <TopBar title="Personvern 🔒" onHome={go} />
      <div className="bg-white/95 rounded-3xl p-5 md:p-7 shadow-xl space-y-5 text-slate-700">
        <p className="font-semibold">Selmas skole er en læringsapp laget av en familie for barn. Den har ingen reklame, ingen sporing og ingen analyseverktøy fra tredjepart.</p>

        <section>
          <h2 className="text-lg font-extrabold mb-1">Hva lagres om barna</h2>
          <ul className="list-disc pl-5 space-y-1 font-semibold">
            <li>Et kallenavn og en figur (emoji) som den voksne velger.</li>
            <li>Nivå per fag, stjerner, samlekort, kostymer, og hvilke oppgaver som er besvart riktig og feil, slik at appen kan tilpasse seg.</li>
            <li>Ingen fødselsdato, ingen e-post, ingen bilder, ingen stemmeopptak.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-extrabold mb-1">Hva lagres om den voksne</h2>
          <p className="font-semibold">E-postadressen og et passord (lagret kryptert) for familiekontoen. Ingenting annet.</p>
        </section>

        <section>
          <h2 className="text-lg font-extrabold mb-1">Hvor</h2>
          <p className="font-semibold">
            Uten konto («Bare spill!») lagres alt bare i nettleseren på enheten. Med familiekonto lagres fremgangen i en database hos Supabase i EU (Stockholm), slik at den følger barnet mellom enheter. Appen kjører på Vercel. Hver familie kan bare se sine egne barn.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-extrabold mb-1">Informasjonskapsler</h2>
          <p className="font-semibold">Appen bruker ikke sporingskapsler. Den lagrer innloggingen og fremgangen lokalt i nettleseren (localStorage) for at du skal slippe å logge inn hver gang, og den lagrer selve appen på enheten (service worker) så den starter uten nett etter første besøk.</p>
        </section>

        <section>
          <h2 className="text-lg font-extrabold mb-1">Sletting</h2>
          <p className="font-semibold">
            Du kan når som helst slette en barneprofil eller hele familiekontoen under «For voksne». Da slettes alt som er lagret om dere, med en gang. Uten konto sletter du alt ved å tømme nettleserdataene.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-extrabold mb-1">Opplesing</h2>
          <p className="font-semibold">Opplesingen bruker stemmen som er innebygd i nettleseren eller enheten. Ingen tekst sendes til noen tjeneste for å lages om til tale.</p>
        </section>

        <p className="text-sm text-slate-500 font-semibold">Spørsmål? Ta kontakt med den som ga deg lenken til appen.</p>
      </div>
    </div>
  )
}
