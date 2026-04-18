import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Forward all /api requests to the Kovera backend, bypassing CORS
      '/api': {
        target: 'https://app.kovera.io',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
