import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve('src/processes/main/index.ts')
      }
    },
  },
  preload: {
    build: {
      lib: {
        entry: resolve('src/processes/preload/index.ts')
      }
    },
  },
  renderer: {
    plugins: [preact()]
  }
})
