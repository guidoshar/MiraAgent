import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], rollupTypes: true }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiraAgent',
      formats: ['es', 'cjs'],
      fileName: (format) => `mira-agent.${format === 'es' ? 'es' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@page-agent/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@page-agent/core': 'PageAgentCore',
        },
      },
    },
    cssCodeSplit: false,
  },
})
