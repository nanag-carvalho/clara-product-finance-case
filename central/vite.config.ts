import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { port: 5173, strictPort: true },
  build: { rollupOptions: { input: { wireflow: path.resolve(import.meta.dirname, 'wireflow.html'), prototype: path.resolve(import.meta.dirname, 'prototype.html'), central: path.resolve(import.meta.dirname, 'index.html'), designSystem: path.resolve(import.meta.dirname, 'design-system.html') } } },
})
