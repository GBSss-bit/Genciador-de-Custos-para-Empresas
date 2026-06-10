import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Beluna App',
        short_name: 'Beluna',
        theme_color: '#121214',
        background_color: '#121214',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3260/3260838.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
