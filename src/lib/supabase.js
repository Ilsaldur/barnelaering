import { createClient } from '@supabase/supabase-js'

// Supabase-klient for kontoer og synk. Uten nøkler (f.eks. lokalt uten .env.local)
// blir klienten null og appen fungerer helt fint med bare lokal lagring.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
