import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';


import path from 'path';









export default defineConfig({
  plugins: [react(), basicSsl()],
  publicDir: './public',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  define: {
    'process.env.SECURITY_CODE': '""',
  },
  
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
  optimizeDeps: {
    exclude: ['@jitl/quickjs-wasmfile-release-sync']
  }
});
