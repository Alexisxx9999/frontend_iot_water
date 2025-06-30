import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Configuración para archivos estáticos
  publicDir: 'public',
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true,
    // Proxy para conectar con el backend (cuando lo tengas)
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Cambia por la URL de tu backend
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:8000', // Para archivos subidos
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Configuración para build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Configuración para archivos estáticos en producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['chart.js', 'vue-chartjs']
        }
      }
    }
  }
})
