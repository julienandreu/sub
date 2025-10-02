import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { bytecodePlugin, defineConfig, swcPlugin } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: [
          'better-sqlite3',
          'electron',
          'electron-log',
          'electron-log/main',
        ],
      },
      commonjsOptions: {
        ignoreDynamicRequires: true
      },
      lib: {
        entry: resolve('src/processes/main/index.ts')
      }
    },
    plugins: [
      bytecodePlugin({
        transformArrowFunctions: false,
      }),
      swcPlugin(),
    ],
  },
  preload: {
    build: {
      rollupOptions: {
        external: [
          'electron-log',
          'electron-log/preload',
        ],
      },
      lib: {
        entry: resolve('src/processes/preload/index.ts')
      }
    },
    plugins: [
      bytecodePlugin({
        transformArrowFunctions: false,
      }),
    ],
    publicDir: resolve('src/renderer/assets'),
  },
  renderer: {
    plugins: [
      preact(),
      tailwindcss(),
    ],
    publicDir: resolve('src/renderer/assets'),
  }
})
