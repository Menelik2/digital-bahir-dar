import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['mapbox-gl'],
  },
  build: {
    outDir: 'dist',
    // Faster Vercel builds + smaller uploads in production
    sourcemap: process.env.VERCEL_ENV === 'production' ? false : true,
    commonjsOptions: {
      include: [/mapbox-gl/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          map: ['mapbox-gl', 'leaflet', 'react-leaflet'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
