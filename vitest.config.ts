import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      exclude: [
        'eslint.config.js',
        'vite.config.ts',
        'vitest.config.ts',
        'src/vite-env.d.ts',
        'src/styles/**',
        'dist/**',
      ],
    },
  },
  define: {
    'import.meta.env.VITE_APP_CLIENT_ID': JSON.stringify('mock-client-id'),
    'import.meta.env.VITE_APP_TENANT_ID': JSON.stringify('mock-tenant-id'),
    'import.meta.env.VITE_WEBAPP_URL': JSON.stringify('http://example.com'),
  },
});