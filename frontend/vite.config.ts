import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH: "/<repo-name>/" for a GitHub Pages project site, "/" for a custom domain.
// The deploy workflow sets it automatically.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
