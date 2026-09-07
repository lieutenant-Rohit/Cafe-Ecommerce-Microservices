import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/products': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/categories': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/carts': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/api/inventory': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
})
