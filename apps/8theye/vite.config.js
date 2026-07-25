import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/8theye',
    emptyOutDir: true
  },
  
  plugins: [react(), basicSsl()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev'],
  }
})
