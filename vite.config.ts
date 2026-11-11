import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

import fs from 'fs';
import path from 'path';









const localSdkRoot = path.resolve(__dirname, '../trikomi/packages');
const localCoreEntry = path.resolve(localSdkRoot, 'core/src/index.ts');

const getDynamicAlias = (useLocalSdk: boolean) => (useLocalSdk ? {
  '@trikomi/core/8thwall': path.resolve(localSdkRoot, '8thwall/src/index.ts'),
  '@trikomi/core/sportswear': path.resolve(localSdkRoot, 'sportswear/src/index.ts'),
  '@trikomi/core/face-mocap': path.resolve(localSdkRoot, 'face-mocap/src/index.ts'),
  '@trikomi/core/eyewear': path.resolve(localSdkRoot, 'eyewear/src/index.ts'),
  '@trikomi/core/tour': path.resolve(localSdkRoot, 'tour/src/index.ts'),
  '@trikomi/core/viewer': path.resolve(localSdkRoot, 'viewer/src/index.ts'),
  '@trikomi/core/box': path.resolve(localSdkRoot, 'box/src/index.ts'),
  '@trikomi/core': localCoreEntry,
  '@trikomi/sportswear': path.resolve(localSdkRoot, 'sportswear/src/index.ts'),
  '@runtime-sdk/core': path.resolve(__dirname, '../trikomi-runtime/packages/core/src/index.ts')
} : {});

const serveSecurityTxtPlugin = () => ({
  name: 'serve-security-txt',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/packages/core/dist/security.txt') {
        const targetPath = path.resolve(__dirname, '../trikomi/packages/core/dist/security.txt');
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

export default defineConfig(({ command }) => {
  // Dev mode always uses local SDK; build mode uses npm package unless explicitly overridden
  const isDev = command === 'serve';
  const useLocalSdk = isDev ? fs.existsSync(localCoreEntry) : (process.env.USE_LOCAL_SDK === 'true');
  const dynamicAlias = getDynamicAlias(useLocalSdk);

  return {
    base: process.env.VITE_BASE_URL || '/',
    resolve: {
      alias: dynamicAlias
    },
    plugins: [react(), basicSsl(), ...(useLocalSdk ? [serveSecurityTxtPlugin()] : [])],
    publicDir: './public',
    server: {
      host: '0.0.0.0',
      port: 3000,
      fs: {
        allow: ['..']
      }
    },
    define: {
      'process.env.SECURITY_CODE': '""',
    },
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
    optimizeDeps: {
      exclude: ['@jitl/quickjs-wasmfile-release-sync']
    }
  };
});
