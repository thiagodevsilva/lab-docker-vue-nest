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
    // Desativa HMR em produção (evita erro de WebSocket em localhost ao acessar pelo domínio)
    hmr: process.env.NODE_ENV === 'production' ? false : true,
  },
})
