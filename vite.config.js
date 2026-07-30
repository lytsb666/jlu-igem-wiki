import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { resolve, relative, sep } from 'node:path'

const root = resolve(import.meta.dirname)
const ignoredDirectories = new Set(['node_modules', 'dist', '.git'])

function collectHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) || entry.name.startsWith('.')
        ? []
        : collectHtmlFiles(absolutePath)
    }

    return entry.name.endsWith('.html') && statSync(absolutePath).size > 0
      ? [absolutePath]
      : []
  })
}

const input = Object.fromEntries(
  collectHtmlFiles(root).map((file) => [
    relative(root, file).replaceAll(sep, '/').replace(/\.html$/, ''),
    file,
  ]),
)

function sitesOutput() {
  return {
    name: 'sites-output',
    closeBundle() {
      const serverDirectory = resolve(root, 'dist', 'server')
      const metadataDirectory = resolve(root, 'dist', '.openai')

      mkdirSync(serverDirectory, { recursive: true })
      mkdirSync(metadataDirectory, { recursive: true })
      copyFileSync(
        resolve(root, 'worker', 'index.js'),
        resolve(serverDirectory, 'index.js'),
      )
      copyFileSync(
        resolve(root, '.openai', 'hosting.json'),
        resolve(metadataDirectory, 'hosting.json'),
      )
    },
  }
}

export default {
  plugins: [sitesOutput()],
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input,
      output: {
        assetFileNames: 'assets/[hash][extname]',
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
      },
    },
  },
}
