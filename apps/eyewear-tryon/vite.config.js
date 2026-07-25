/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'
import path from 'path'



// https://vite.dev/config/
export default defineConfig(({ _mode }) => ({
  base: './',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/eyewear-tryon',
    emptyOutDir: true
  },
  define: {
    
    
    
  },
  
  plugins: [react(), basicSsl()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr', '**/*.obj'],
  server: {
    host: true, // Listen on all local IPs
  }
}))
