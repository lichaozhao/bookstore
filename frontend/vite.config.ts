import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = Number(process.env.PORT) || 5173
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:4000'
const allowedHosts = (process.env.VITE_ALLOWED_HOSTS || 'localhost,127.0.0.1,frontend').split(',')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port,
    host: '0.0.0.0',
    allowedHosts,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
  },
})
