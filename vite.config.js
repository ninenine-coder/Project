import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        vue: './index.html',
        react: './src/main.tsx'
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:preserve-backdrop-filter',
          Declaration(decl) {
            // 保留 backdrop-filter 不被移除
            if (decl.prop === 'backdrop-filter' || decl.prop === '-webkit-backdrop-filter') {
              // 確保聲明被保留
              decl.important = false;
            }
          }
        }
      ]
    }
  }
})
