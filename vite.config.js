import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const rootDirectory = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDirectory, 'index.html'),
        poems: resolve(rootDirectory, 'poems/index.html'),
        poemManager: resolve(rootDirectory, 'poems/manage/index.html'),
      },
    },
  },
})
