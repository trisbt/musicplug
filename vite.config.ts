import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this directory aligns with what Express serves
  },
  server: {
    proxy: {
      host: '0.0.0.0',
      '/api': 'http://localhost:4000' // adjust this according to your API routes
    }
  }
})
