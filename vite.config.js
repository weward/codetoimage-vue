import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  resolve:{
    alias:{
      '@' : resolve(__dirname, './src')
    },
  },
  plugins: [vue()]
})
