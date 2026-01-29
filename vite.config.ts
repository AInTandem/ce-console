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
  optimizeDeps: {
    exclude: ['@aintandem/sdk-core', '@aintandem/sdk-react']
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        // Safer chunk splitting - only split very large non-React dependencies
        // Use a function-based approach for better granularity
        manualChunks: (id) => {
          // Split out the SDK (external dependency)
          if (id.includes('node_modules/@aintandem/sdk')) {
            return 'sdk';
          }
          // Split out lucide-react (large icon library, safe to split)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Everything else goes into vendor chunks - let Vite handle the rest
          // This avoids circular dependency issues between React ecosystem packages
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://flexy-orchestrator-3ef9a44e:9902',
        changeOrigin: true
      },
      '/flexy': {
        target: 'http://flexy-orchestrator-3ef9a44e:9902',
        changeOrigin: true,
        ws: true // Enable WebSocket proxying
      },
      '/code-server': {
        target: 'http://flexy-orchestrator-3ef9a44e:9902',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
