import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: '/app.html'
      }
    }
  },
  server: {
    open: '/app.html'
  }
})
