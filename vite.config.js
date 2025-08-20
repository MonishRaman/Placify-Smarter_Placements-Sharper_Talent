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
    rollupOptions: {
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
