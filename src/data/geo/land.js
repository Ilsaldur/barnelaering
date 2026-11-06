// Land med flagg, hovedstad og kode (ISO 3166-1 numerisk, som i kartdataene).
// region: 'norden' | 'europa' | 'verden'. `verdensdel` brukes på verdensnivåene.
// Legg til flere land her; kartet finner dem på koden.

export const LAND = [
  // --- Norden ---
  { id: '578', kode: 'no', navn: 'Norge', hovedstad: 'Oslo', flagg: '🇳🇴', region: 'norden', verdensdel: 'Europa' },
  { id: '752', kode: 'se', navn: 'Sverige', hovedstad: 'Stockholm', flagg: '🇸🇪', region: 'norden', verdensdel: 'Europa' },
  { id: '208', kode: 'dk', navn: 'Danmark', hovedstad: 'København', flagg: '🇩🇰', region: 'norden', verdensdel: 'Europa' },
  { id: '246', kode: 'fi', navn: 'Finland', hovedstad: 'Helsinki', flagg: '🇫🇮', region: 'norden', verdensdel: 'Europa' },
  { id: '352', kode: 'is', navn: 'Island', hovedstad: 'Reykjavik', flagg: '🇮🇸', region: 'norden', verdensdel: 'Europa' },

  // --- Europa ---
  { id: '276', kode: 'de', navn: 'Tyskland', hovedstad: 'Berlin', flagg: '🇩🇪', region: 'europa', verdensdel: 'Europa' },
  { id: '250', kode: 'fr', navn: 'Frankrike', hovedstad: 'Paris', flagg: '🇫🇷', region: 'europa', verdensdel: 'Europa' },
  { id: '826', kode: 'gb', navn: 'Storbritannia', hovedstad: 'London', flagg: '🇬🇧', region: 'europa', verdensdel: 'Europa' },
  { id: '724', kode: 'es', navn: 'Spania', hovedstad: 'Madrid', flagg: '🇪🇸', region: 'europa', verdensdel: 'Europa' },
  { id: '380', kode: 'it', navn: 'Italia', hovedstad: 'Roma', flagg: '🇮🇹', region: 'europa', verdensdel: 'Europa' },
  { id: '528', kode: 'nl', navn: 'Nederland', hovedstad: 'Amsterdam', flagg: '🇳🇱', region: 'europa', verdensdel: 'Europa' },
  { id: '616', kode: 'pl', navn: 'Polen', hovedstad: 'Warszawa', flagg: '🇵🇱', region: 'europa', verdensdel: 'Europa' },
  { id: '620', kode: 'pt', navn: 'Portugal', hovedstad: 'Lisboa', flagg: '🇵🇹', region: 'europa', verdensdel: 'Europa' },
  { id: '300', kode: 'gr', navn: 'Hellas', hovedstad: 'Athen', flagg: '🇬🇷', region: 'europa', verdensdel: 'Europa' },
  { id: '372', kode: 'ie', navn: 'Irland', hovedstad: 'Dublin', flagg: '🇮🇪', region: 'europa', verdensdel: 'Europa' },
  { id: '040', kode: 'at', navn: 'Østerrike', hovedstad: 'Wien', flagg: '🇦🇹', region: 'europa', verdensdel: 'Europa' },
  { id: '756', kode: 'ch', navn: 'Sveits', hovedstad: 'Bern', flagg: '🇨🇭', region: 'europa', verdensdel: 'Europa' },
  { id: '056', kode: 'be', navn: 'Belgia', hovedstad: 'Brussel', flagg: '🇧🇪', region: 'europa', verdensdel: 'Europa' },
  { id: '804', kode: 'ua', navn: 'Ukraina', hovedstad: 'Kyiv', flagg: '🇺🇦', region: 'europa', verdensdel: 'Europa' },
  { id: '203', kode: 'cz', navn: 'Tsjekkia', hovedstad: 'Praha', flagg: '🇨🇿', region: 'europa', verdensdel: 'Europa' },
  { id: '348', kode: 'hu', navn: 'Ungarn', hovedstad: 'Budapest', flagg: '🇭🇺', region: 'europa', verdensdel: 'Europa' },
  { id: '642', kode: 'ro', navn: 'Romania', hovedstad: 'Bucuresti', flagg: '🇷🇴', region: 'europa', verdensdel: 'Europa' },
  { id: '191', kode: 'hr', navn: 'Kroatia', hovedstad: 'Zagreb', flagg: '🇭🇷', region: 'europa', verdensdel: 'Europa' },
  { id: '233', kode: 'ee', navn: 'Estland', hovedstad: 'Tallinn', flagg: '🇪🇪', region: 'europa', verdensdel: 'Europa' },
  { id: '428', kode: 'lv', navn: 'Latvia', hovedstad: 'Riga', flagg: '🇱🇻', region: 'europa', verdensdel: 'Europa' },
  { id: '440', kode: 'lt', navn: 'Litauen', hovedstad: 'Vilnius', flagg: '🇱🇹', region: 'europa', verdensdel: 'Europa' },
  { id: '792', kode: 'tr', navn: 'Tyrkia', hovedstad: 'Ankara', flagg: '🇹🇷', region: 'europa', verdensdel: 'Europa' },

  // --- Resten av verden ---
  { id: '840', kode: 'us', navn: 'USA', hovedstad: 'Washington', flagg: '🇺🇸', region: 'verden', verdensdel: 'Nord-Amerika' },
  { id: '124', kode: 'ca', navn: 'Canada', hovedstad: 'Ottawa', flagg: '🇨🇦', region: 'verden', verdensdel: 'Nord-Amerika' },
  { id: '484', kode: 'mx', navn: 'Mexico', hovedstad: 'Mexico by', flagg: '🇲🇽', region: 'verden', verdensdel: 'Nord-Amerika' },
  { id: '076', kode: 'br', navn: 'Brasil', hovedstad: 'Brasília', flagg: '🇧🇷', region: 'verden', verdensdel: 'Sør-Amerika' },
  { id: '032', kode: 'ar', navn: 'Argentina', hovedstad: 'Buenos Aires', flagg: '🇦🇷', region: 'verden', verdensdel: 'Sør-Amerika' },
  { id: '152', kode: 'cl', navn: 'Chile', hovedstad: 'Santiago', flagg: '🇨🇱', region: 'verden', verdensdel: 'Sør-Amerika' },
  { id: '604', kode: 'pe', navn: 'Peru', hovedstad: 'Lima', flagg: '🇵🇪', region: 'verden', verdensdel: 'Sør-Amerika' },
  { id: '170', kode: 'co', navn: 'Colombia', hovedstad: 'Bogotá', flagg: '🇨🇴', region: 'verden', verdensdel: 'Sør-Amerika' },
  { id: '818', kode: 'eg', navn: 'Egypt', hovedstad: 'Kairo', flagg: '🇪🇬', region: 'verden', verdensdel: 'Afrika' },
  { id: '710', kode: 'za', navn: 'Sør-Afrika', hovedstad: 'Pretoria', flagg: '🇿🇦', region: 'verden', verdensdel: 'Afrika' },
  { id: '404', kode: 'ke', navn: 'Kenya', hovedstad: 'Nairobi', flagg: '🇰🇪', region: 'verden', verdensdel: 'Afrika' },
  { id: '566', kode: 'ng', navn: 'Nigeria', hovedstad: 'Abuja', flagg: '🇳🇬', region: 'verden', verdensdel: 'Afrika' },
  { id: '504', kode: 'ma', navn: 'Marokko', hovedstad: 'Rabat', flagg: '🇲🇦', region: 'verden', verdensdel: 'Afrika' },
  { id: '231', kode: 'et', navn: 'Etiopia', hovedstad: 'Addis Abeba', flagg: '🇪🇹', region: 'verden', verdensdel: 'Afrika' },
  { id: '156', kode: 'cn', navn: 'Kina', hovedstad: 'Beijing', flagg: '🇨🇳', region: 'verden', verdensdel: 'Asia' },
  { id: '392', kode: 'jp', navn: 'Japan', hovedstad: 'Tokyo', flagg: '🇯🇵', region: 'verden', verdensdel: 'Asia' },
  { id: '356', kode: 'in', navn: 'India', hovedstad: 'New Delhi', flagg: '🇮🇳', region: 'verden', verdensdel: 'Asia' },
  { id: '643', kode: 'ru', navn: 'Russland', hovedstad: 'Moskva', flagg: '🇷🇺', region: 'verden', verdensdel: 'Asia', ikkeVerdensdel: true },
  { id: '764', kode: 'th', navn: 'Thailand', hovedstad: 'Bangkok', flagg: '🇹🇭', region: 'verden', verdensdel: 'Asia' },
  { id: '410', kode: 'kr', navn: 'Sør-Korea', hovedstad: 'Seoul', flagg: '🇰🇷', region: 'verden', verdensdel: 'Asia' },
  { id: '704', kode: 'vn', navn: 'Vietnam', hovedstad: 'Hanoi', flagg: '🇻🇳', region: 'verden', verdensdel: 'Asia' },
  { id: '360', kode: 'id', navn: 'Indonesia', hovedstad: 'Jakarta', flagg: '🇮🇩', region: 'verden', verdensdel: 'Asia' },
  { id: '682', kode: 'sa', navn: 'Saudi-Arabia', hovedstad: 'Riyadh', flagg: '🇸🇦', region: 'verden', verdensdel: 'Asia' },
  { id: '496', kode: 'mn', navn: 'Mongolia', hovedstad: 'Ulan Bator', flagg: '🇲🇳', region: 'verden', verdensdel: 'Asia' },
  { id: '036', kode: 'au', navn: 'Australia', hovedstad: 'Canberra', flagg: '🇦🇺', region: 'verden', verdensdel: 'Oseania' },
  { id: '554', kode: 'nz', navn: 'New Zealand', hovedstad: 'Wellington', flagg: '🇳🇿', region: 'verden', verdensdel: 'Oseania' },
]

export const VERDENSDELER = ['Europa', 'Asia', 'Afrika', 'Nord-Amerika', 'Sør-Amerika', 'Oseania']

export const REGIONER = [
  { id: 'norden', navn: 'Norden', emoji: '❄️' },
  { id: 'europa', navn: 'Europa', emoji: '🏰' },
  { id: 'verden', navn: 'Hele verden', emoji: '🌍' },
]

// Landene i et område (kumulativt: Europa inkluderer Norden, verden alt).
export function landFor(region) {
  if (region === 'norden') return LAND.filter((l) => l.region === 'norden')
  if (region === 'europa') return LAND.filter((l) => l.region !== 'verden')
  return LAND
}

export function landById(id) {
  return LAND.find((l) => l.id === id) || null
}
