import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/pop/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'PoP🍿',
        short_name: 'PoP🍿',
        description: '',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/public/potential-octo-potato.svg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/public/potential-octo-potato.svg',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/public/potential-octo-potato.svg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
