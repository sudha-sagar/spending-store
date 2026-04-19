import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/spending-store/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,apple-touch-icon.png,mask-icon.svg}']
      },
      manifest: {
        name: 'Spending Store',
        short_name: 'SpendStore',
        description: 'Symbolic Spending Tracker for Parents',
        theme_color: '#FF8C42',
        background_color: '#FFF8F0',
        display: 'standalone',
        scope: '/spending-store/',
        start_url: '/spending-store/',
        icons: [
          {
            src: 'icon-512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
