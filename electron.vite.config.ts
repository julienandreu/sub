import { resolve } from 'path';
import { defineConfig, bytecodePlugin } from 'electron-vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve('src/processes/main/index.ts')
      }
    },
    plugins: [
      bytecodePlugin()
    ]
  },
  preload: {
    build: {
      lib: {
        entry: resolve('src/processes/preload/index.ts')
      }
    },
    plugins: [
      bytecodePlugin()
    ]
  },
  renderer: {
    plugins: [preact()]
  }
})
