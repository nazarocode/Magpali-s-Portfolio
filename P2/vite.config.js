import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        personal: resolve(root, 'personal.html'),
        achievements: resolve(root, 'achievements.html'),
        certificate: resolve(root, 'certificate.html'),
        parents: resolve(root, 'parents.html'),
        surprise: resolve(root, 'surprise.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-vendor';
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }
        }
      }
    }
  }
});
