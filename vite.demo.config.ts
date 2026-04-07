import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'mira-agent': resolve(__dirname, 'src/index.ts'),
    },
  },
})
