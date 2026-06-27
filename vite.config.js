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
  // deck.gl needs explicit pre-bundling (mixed ESM/CJS internals).
  // react-map-gl is intentionally excluded: it has no root "." export,
  // only subpath exports (./maplibre, ./mapbox) — Vite resolves those fine
  // at import time without pre-bundling.
  // The window.global polyfill for maplibre-gl is in index.html.
  optimizeDeps: {
    include: [
      'deck.gl',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/react',
      'maplibre-gl',
    ],
  },
})



