import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react(), tsconfigPaths()],
  build: {
    // TODO: optimize for production; e.g. use manualChunks
    chunkSizeWarningLimit: 1800,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
