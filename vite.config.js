import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ВАЖЛИВО: замініть 'khata-maystra' на ТОЧНУ назву вашого репозиторію на GitHub
// (те, що йде після github.com/ваш-нік/ у посиланні на репозиторій).
export default defineConfig({
  base: '/khata-maystra/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
