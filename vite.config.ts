import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the book also opens from a file path or any sub-directory.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Single bundle keeps the service-worker precache list short and
        // guarantees no lazy chunk can ever be requested while offline.
        manualChunks: undefined,
      },
    },
  },
})
