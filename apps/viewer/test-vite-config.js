import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: '../../dist/viewer',
    rollupOptions: {
      output: {
        assetFileNames: '../assets/[name]-[hash][extname]',
      }
    }
  }
});
