import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'



// https://vite.dev/config/
export default defineConfig(({ _mode }) => ({
  base: './',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/sportswear-configurator',
    emptyOutDir: true
  },
  define: {
    
    
    
  },
  
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
  optimizeDeps: {
    exclude: ['@trikomi/core', '@trikomi/sportswear']
  }
}))
