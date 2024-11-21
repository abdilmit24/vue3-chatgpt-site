import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/compatible-mode': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        headers: {
          'Origin': 'http://localhost'
        }
      }
    }
  }
});