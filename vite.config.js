import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
    open: false, // 启动是否自动打开浏览器
    proxy: {
      ['/api']: {
        target: 'http://host.docker.internal:8000/',
        // target: 'https://app.navkeeper.com/',
        changeOrigin: true,
        log: 'debug'
      },
      ['/head']: {
        target: 'http://host.docker.internal:8000/',
        // target: 'https://app.navkeeper.com/',
        changeOrigin: true,
        log: 'debug'
      }
    },
    watch: {
      usePolling: true, // 使用轮询来监听文件变化
      interval: 1000,   // 可选：调整轮询间隔
    }
  }
})
