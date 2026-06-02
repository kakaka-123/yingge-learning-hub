import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiBaseUrl = process.env.VITE_API_URL || 'https://yingge-api.up.railway.app'
const dailyhotUrl = process.env.VITE_DAILYHOT_URL || 'https://news-iota-liard-98.vercel.app'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/dailyhot': {
        target: 'https://news-iota-liard-98.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dailyhot/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('DailyHot proxy error:', err)
          })
        }
      }
    }
  }
})
