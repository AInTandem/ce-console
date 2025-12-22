import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9900',
        changeOrigin: true
      },
      '/flexy': {
        target: 'http://localhost:9900',
        changeOrigin: true,
        ws: true // Enable WebSocket proxying
      },
      '/code-server': {
        target: 'http://localhost:9900',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
