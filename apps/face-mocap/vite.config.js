/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'
import path from 'path'



// https://vite.dev/config/

const useLocalSdk = process.env.USE_LOCAL_SDK === 'true';
const dynamicAlias = useLocalSdk ? {
  '@trikomi/core/8thwall': path.resolve(__dirname, '../../../3dviewer/packages/8thwall/src/index.ts'),
  '@trikomi/core/sportswear': path.resolve(__dirname, '../../../3dviewer/packages/sportswear/src/index.ts'),
  '@trikomi/core/face-mocap': path.resolve(__dirname, '../../../3dviewer/packages/face-mocap/src/index.ts'),
  '@trikomi/core/eyewear': path.resolve(__dirname, '../../../3dviewer/packages/eyewear/src/index.ts'),
  '@trikomi/core/tour': path.resolve(__dirname, '../../../3dviewer/packages/tour/src/index.ts'),
  '@trikomi/core/viewer': path.resolve(__dirname, '../../../3dviewer/packages/viewer/src/index.ts'),
  '@trikomi/core/box': path.resolve(__dirname, '../../../3dviewer/packages/box/src/index.ts'),
  '@trikomi/core': path.resolve(__dirname, '../../../3dviewer/packages/core/src/index.ts'),
  '@trikomi/face': path.resolve(__dirname, '../../../3dviewer/packages/face/src/index.ts')
} : {};

const serveSecurityTxtPlugin = () => ({
  name: 'serve-security-txt',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/packages/core/dist/security.txt') {
        const fs = require('fs');
        const targetPath = path.resolve(__dirname, '../../../3dviewer/packages/core/dist/security.txt');
        if (fs.existsSync(targetPath)) {
          const content = fs.readFileSync(targetPath);
          res.setHeader('Content-Type', 'text/plain');
          res.end(content);
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig(({ _mode }) => ({
  base: process.env.VITE_BASE_URL || '/',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/face-mocap',
    emptyOutDir: true
  },
  define: {
    
    
    
  },
  
  resolve: {
    alias: dynamicAlias
  },
  plugins: [react(), basicSsl(), ...(useLocalSdk ? [serveSecurityTxtPlugin()] : [])],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
  server: {
    host: true, // Listen on all local IPs
  }
}))
