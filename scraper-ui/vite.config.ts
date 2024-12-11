import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";

dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  base: "./", // Use relative paths for assets
  build: {
    outDir: "dist", // Optional: Specify output folder
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Optionally remove '/api' prefix
      },
    },
  },
});
