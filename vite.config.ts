import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'OFW Summit',
        short_name: 'OFW Summit',
        description: 'OFW Summit Web Application',
        theme_color: '#863bff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell; download large images only when requested.
        globPatterns: ['**/*.{js,css,html,ico,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Vite's hashed asset URLs change whenever the image changes.
            // Restrict this cache to build assets, excluding API/user uploads.
            urlPattern: ({ request, url, sameOrigin }) =>
              sameOrigin && url.pathname.startsWith('/assets/') &&
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'ofw-summit-images-v1',
              cacheableResponse: { statuses: [200] },
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // Skip gzip size calculations during builds; this does not affect output.
    reportCompressedSize: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Keep dependencies cached separately from changing application code.
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 20,
            },
            {
              name: 'charts-vendor',
              test: /[\\/]node_modules[\\/](apexcharts|react-apexcharts)[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
