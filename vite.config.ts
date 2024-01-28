import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

import manifest from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },

    plugins: [crx({ manifest }), react(),obfuscatorPlugin({
      options: {
        // your javascript-obfuscator options
        debugProtection: false,
        // ...  [See more options](https://github.com/javascript-obfuscator/javascript-obfuscator)
      },
    })],
  }
})
