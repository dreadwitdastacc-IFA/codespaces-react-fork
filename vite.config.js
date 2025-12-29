import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
  build: {
    // Split large vendor bundles by package to reduce single huge chunk sizes
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // create a chunk per top level package in node_modules
            const parts = id.split('node_modules/')[1].split('/');
            // scoped packages like @babel/core -> @babel
            if (parts[0].startsWith('@')) return `${parts[0]}/${parts[1]}`;
            return parts[0];
          }
        }
      }
    },
    // keep warning threshold reasonable
    chunkSizeWarningLimit: 600
  }
})
