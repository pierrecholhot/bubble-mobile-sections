import { defineConfig } from 'vite'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const banner = `/*! bubble-mobile-sections v${pkg.version} */`

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'BubbleMobileSections',
      fileName: () => 'bubble-mobile-sections.js',
      formats: ['es'],
    },
    outDir: 'dist',
    emptyDirBeforeWrite: true,
    sourcemap: false,
    minify: 'esbuild',
  },
  plugins: [
    {
      name: 'add-banner',
      generateBundle(_, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk') {
            chunk.code = banner + '\n' + chunk.code
          }
        }
      },
    },
  ],
})
