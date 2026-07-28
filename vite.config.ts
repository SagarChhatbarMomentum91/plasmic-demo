import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // antd alone is ~670kB minified; warn only above that envelope
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('antd') || id.includes('@ant-design')) return 'antd'
          if (id.includes('@dnd-kit')) return 'dnd-kit'
          if (id.includes('@plasmicapp')) return 'plasmic'
          if (id.includes('@tanstack')) return 'query'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react'
        },
      },
    },
  },
  server: {
    port: 3003,
    // Plasmic Studio app-host needs to iframe this origin
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
