// Vite-tillegg (runde 6, etappe AC): skriver /assets-liste.json med alle
// filene i /assets/, så service workeren kan lagre alt ved installasjon –
// også delene som lastes først når de trengs (geografi, kartet, Supabase).
export const LISTE_FIL = 'assets-liste.json'

export function assetsListe() {
  return {
    name: 'selmas-assets-liste',
    apply: 'build',
    generateBundle(_, bundle) {
      const filer = Object.keys(bundle)
        .filter((f) => f.startsWith('assets/'))
        .map((f) => `/${f}`)
        .sort()
      this.emitFile({ type: 'asset', fileName: LISTE_FIL, source: JSON.stringify(filer) })
    },
  }
}
