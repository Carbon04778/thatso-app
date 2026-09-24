import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite 5: accept any host so proxied preview domains work in dev
  server: { host: true, allowedHosts: true, watch: { usePolling: true } },
})
