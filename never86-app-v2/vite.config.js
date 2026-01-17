import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure proper build output for Hostinger
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Optimize for production - using esbuild (faster, built-in)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
        }
      }
    }
  },
  // Base path - leave empty for root domain deployment
  base: '/',
})
