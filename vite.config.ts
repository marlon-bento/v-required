import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
    }) 
  ],
  build: {
    lib: {
      // Múltiplos pontos de entrada
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        core: path.resolve(__dirname, 'src/core/index.ts'),
        types: path.resolve(__dirname, 'src/types/index.ts'),
        utils: path.resolve(__dirname, 'src/utils/index.ts'),
        validation: path.resolve(__dirname, 'src/validation/index.ts'),
      },
      name: 'v-required',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: '[name].js',
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
})