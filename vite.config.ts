import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true, // Helps with WSL or Docker issues
    },
    hmr: true,
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: { "@": "/src" },
  },
  preview: {
    port: 3000,
  },
});
