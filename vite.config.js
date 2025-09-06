import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'framer-motion': 'framer-motion',
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
      // Ensure framer-motion is bundled and not mistakenly treated as external
      external: [],
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
