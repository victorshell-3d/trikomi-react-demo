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
export default defineConfig(({ _mode }) => ({
  base: './',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/360tour',
    emptyOutDir: true
  },
  define: {
    
    
    
  },
  
  plugins: [
    react(),
    localExportPlugin()
  ],
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
