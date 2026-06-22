// Land med flagg og hovedstad. Starter med Norden og Europa.
// region: 'norden' | 'europa' – brukes til å begynne enkelt og utvide.

export const COUNTRIES = [
  // --- Norden ---
  { id: 'no', name: 'Norge', capital: 'Oslo', flag: '🇳🇴', region: 'norden' },
  { id: 'se', name: 'Sverige', capital: 'Stockholm', flag: '🇸🇪', region: 'norden' },
  { id: 'dk', name: 'Danmark', capital: 'København', flag: '🇩🇰', region: 'norden' },
  { id: 'fi', name: 'Finland', capital: 'Helsinki', flag: '🇫🇮', region: 'norden' },
  { id: 'is', name: 'Island', capital: 'Reykjavik', flag: '🇮🇸', region: 'norden' },

  // --- Europa ---
  { id: 'de', name: 'Tyskland', capital: 'Berlin', flag: '🇩🇪', region: 'europa' },
  { id: 'fr', name: 'Frankrike', capital: 'Paris', flag: '🇫🇷', region: 'europa' },
  { id: 'gb', name: 'Storbritannia', capital: 'London', flag: '🇬🇧', region: 'europa' },
  { id: 'es', name: 'Spania', capital: 'Madrid', flag: '🇪🇸', region: 'europa' },
  { id: 'it', name: 'Italia', capital: 'Roma', flag: '🇮🇹', region: 'europa' },
  { id: 'nl', name: 'Nederland', capital: 'Amsterdam', flag: '🇳🇱', region: 'europa' },
  { id: 'pl', name: 'Polen', capital: 'Warszawa', flag: '🇵🇱', region: 'europa' },
  { id: 'pt', name: 'Portugal', capital: 'Lisboa', flag: '🇵🇹', region: 'europa' },
  { id: 'gr', name: 'Hellas', capital: 'Athen', flag: '🇬🇷', region: 'europa' },
  { id: 'ie', name: 'Irland', capital: 'Dublin', flag: '🇮🇪', region: 'europa' },
  { id: 'at', name: 'Østerrike', capital: 'Wien', flag: '🇦🇹', region: 'europa' },
  { id: 'ch', name: 'Sveits', capital: 'Bern', flag: '🇨🇭', region: 'europa' },
  { id: 'be', name: 'Belgia', capital: 'Brussel', flag: '🇧🇪', region: 'europa' },

  // --- Resten av verden (mulighet til å utvide) ---
  { id: 'us', name: 'USA', capital: 'Washington', flag: '🇺🇸', region: 'verden' },
  { id: 'jp', name: 'Japan', capital: 'Tokyo', flag: '🇯🇵', region: 'verden' },
  { id: 'br', name: 'Brasil', capital: 'Brasília', flag: '🇧🇷', region: 'verden' },
  { id: 'eg', name: 'Egypt', capital: 'Kairo', flag: '🇪🇬', region: 'verden' },
  { id: 'au', name: 'Australia', capital: 'Canberra', flag: '🇦🇺', region: 'verden' },
  { id: 'cn', name: 'Kina', capital: 'Beijing', flag: '🇨🇳', region: 'verden' },
]

export const REGIONS = [
  { id: 'norden', label: 'Norden', emoji: '❄️' },
  { id: 'europa', label: 'Europa', emoji: '🏰' },
  { id: 'verden', label: 'Hele verden', emoji: '🌍' },
]
