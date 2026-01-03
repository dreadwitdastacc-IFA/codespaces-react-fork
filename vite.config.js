import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            return 'vendor';
          }
        }
      }
    }
  },
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
