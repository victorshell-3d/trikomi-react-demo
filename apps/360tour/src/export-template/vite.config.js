/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  root: resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: {
      '@trikomi/ui-kit/styles.css': resolve(__dirname, '../../../../packages/ui-kit/src/styles/index.css'),
      '@trikomi/ui-kit': resolve(__dirname, '../../../../packages/ui-kit/src/index.ts')
    }
  },
  build: {
    outDir: resolve(__dirname, '../../../../public/export-dist'),
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    }
  }
});
