/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';



// Custom plugin to handle file saving (Fallback for browsers without showDirectoryPicker)
const localExportPlugin = () => ({
  name: 'local-export-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/save-export-file' && req.method === 'POST') {
        const filePath = req.headers['x-file-path'];
        if (!filePath) {
          res.statusCode = 400;
          return res.end('Missing x-file-path header');
        }

        const fullPath = path.resolve(__dirname, 'export', filePath);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const writeStream = fs.createWriteStream(fullPath);
        req.pipe(writeStream);
        req.on('end', () => {
          res.statusCode = 200;
          res.end('Saved');
        });
        req.on('error', (_err) => {
          res.statusCode = 500;
          res.end('Error saving file');
        });
        return;
      }
      next();
    });
  }
});

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
  '@trikomi/tour': path.resolve(__dirname, '../../../3dviewer/packages/tour/src/index.ts')
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
    outDir: '../../dist/360tour',
    emptyOutDir: true
  },
  define: {
    
    
    
  },
  
  resolve: {
    alias: dynamicAlias
  },
  plugins: [
    react(),
    localExportPlugin()
  , ...(useLocalSdk ? [serveSecurityTxtPlugin()] : [])],
  server: {
    port: 5175,
    proxy: {
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
}));
