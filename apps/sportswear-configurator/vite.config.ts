import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'



// https://vite.dev/config/

const localSdkRoot = path.resolve(__dirname, '../../../3dviewer/packages');
const localSportswearEntry = path.resolve(localSdkRoot, 'sportswear/src/index.ts');
const useLocalSdk = fs.existsSync(localSportswearEntry) || process.env.USE_LOCAL_SDK === 'true';

const dynamicAlias = useLocalSdk ? {
  '@trikomi/core/8thwall': path.resolve(localSdkRoot, '8thwall/src/index.ts'),
  '@trikomi/core/sportswear': localSportswearEntry,
  '@trikomi/core/face-mocap': path.resolve(localSdkRoot, 'face-mocap/src/index.ts'),
  '@trikomi/core/eyewear': path.resolve(localSdkRoot, 'eyewear/src/index.ts'),
  '@trikomi/core/tour': path.resolve(localSdkRoot, 'tour/src/index.ts'),
  '@trikomi/core/viewer': path.resolve(localSdkRoot, 'viewer/src/index.ts'),
  '@trikomi/core/box': path.resolve(localSdkRoot, 'box/src/index.ts'),
  '@trikomi/core': path.resolve(localSdkRoot, 'core/src/index.ts'),
  '@trikomi/sportswear': localSportswearEntry
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
    outDir: '../../dist/sportswear-configurator',
    emptyOutDir: true
  },
  define: {
    
    
    
  },
  
  resolve: {
    alias: dynamicAlias
  },
  plugins: [react(), ...(useLocalSdk ? [serveSecurityTxtPlugin()] : [])],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
  optimizeDeps: {
    exclude: ['@trikomi/core', '@trikomi/sportswear']
  }
}))
