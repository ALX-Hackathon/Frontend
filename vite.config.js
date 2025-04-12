import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows hosting on the network
    port: 5173, // Optional: Specify a custom port (default is 5173)
  },
})
