import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["5e7c-196-189-12-188.ngrok-free.app"], // Add your ngrok host here
  },
});
