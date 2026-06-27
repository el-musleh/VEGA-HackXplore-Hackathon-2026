import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  // All source files (index.html, main.jsx, …) live in src/
  root: fileURLToPath(new URL('./src', import.meta.url)),
  plugins: [react(), tailwindcss()],
  build: {
    // Keep the production build output at the repo-level dist/ folder
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
  },
})
