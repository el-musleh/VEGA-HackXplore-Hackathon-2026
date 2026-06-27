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
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // deck.gl and maplibre-gl need explicit pre-bundling
  optimizeDeps: {
    include: [
      'deck.gl',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/react',
      'maplibre-gl',
      'react-map-gl',
    ],
    esbuildOptions: {
      // Needed by maplibre-gl in the browser
      define: {
        global: 'globalThis',
      },
    },
  },
})


