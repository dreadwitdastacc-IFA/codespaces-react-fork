import { defineConfig } from "vite";
import fs from 'fs';
/** @type {import('vite').UserConfig} */
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
      // Use the public manifest.json when present; plugin will read this file
      // and include the referenced icons/assets during build.
      manifest: JSON.parse(fs.readFileSync(new URL('./public/manifest.json', import.meta.url), 'utf8')),
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
      }
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
  },
  build: {
    target: "esnext",
    cssMinify: "lightningcss",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const parts = id.split("node_modules/")[1].split("/");
            if (parts[0].startsWith("@")) return `${parts[0]}/${parts[1]}`;
            return parts[0];
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
