import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { assetsListe } from './build/assetsListe.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), assetsListe()],
})
