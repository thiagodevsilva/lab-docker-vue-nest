import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'app.local',
      'api.local',
      'status-sistem.thiagosilva.dev.br',
      'api.status-sistem.thiagosilva.dev.br',
    ],
    // Desativa HMR na VPS (variável definida no docker-compose.vps.yml) para evitar erro de WebSocket
    hmr: process.env.VITE_HMR_DISABLE === '1' ? false : true,
  },
})
