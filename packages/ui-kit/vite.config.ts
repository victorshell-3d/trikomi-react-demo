import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: packageRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@trikomi/ui-kit': path.resolve(packageRoot, 'src/index.ts')
    }
  },
  server: {
    host: '127.0.0.1'
  }
});
