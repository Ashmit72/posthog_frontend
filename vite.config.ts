import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to your backend server
      '/': {
        target: 'http://13.233.168.114',
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Set to false if you are using a self-signed certificate
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove /api prefix
      },
    },
  },
})
