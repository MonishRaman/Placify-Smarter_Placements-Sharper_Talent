import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy forwards all requests starting with '/api' to your backend server
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
