import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'electron-vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: [
          'better-sqlite3',
          'electron',
        ],
      },
      commonjsOptions: {
        ignoreDynamicRequires: true
      },
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
    plugins: [
      preact(),
      tailwindcss(),
    ],
  }
})
