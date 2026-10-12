import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs'
import { dirname, isAbsolute, resolve, relative, sep } from 'node:path'

const root = resolve(import.meta.dirname)
const ignoredDirectories = new Set(['node_modules', 'dist', '.git', 'tmp'])

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

// Vite transforms image src attributes, but custom full-image links and some
// document links retain their original paths. Include only referenced files.
function copyLinkedAssets(clientDirectory) {
  const inside = (parent, file) => {
    const path = relative(parent, file)
    return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path)
  }
  for (const sourcePage of Object.values(input)) {
    const builtPage = resolve(clientDirectory, relative(root, sourcePage))
    const html = readFileSync(builtPage, 'utf8')
    for (const match of html.matchAll(/\s(?:href|src|poster|data-full-src)=["']([^"']+)["']/g)) {
      const reference = match[1].split(/[?#]/)[0]
      if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue
      const path = decodeURIComponent(reference)
      const target = path.startsWith('/')
        ? resolve(clientDirectory, path.slice(1)) : resolve(dirname(builtPage), path)
      if (!inside(clientDirectory, target)) throw new Error(`Invalid built link: ${reference}`)
      if (existsSync(target)) continue
      const source = path.startsWith('/')
        ? resolve(root, path.slice(1)) : resolve(dirname(sourcePage), path)
      if (!inside(root, source) || !existsSync(source) || !statSync(source).isFile()) {
        throw new Error(`Missing build resource in ${relative(root, sourcePage)}: ${reference}`)
      }
      mkdirSync(dirname(target), { recursive: true })
      copyFileSync(source, target)
    }
  }
}

function sitesOutput() {
  return {
    name: 'sites-output',
    apply: 'build',
    buildStart() {
      rmSync(resolve(root, 'dist'), { recursive: true, force: true })
    },
    closeBundle() {
      copyLinkedAssets(resolve(root, 'dist', 'client'))
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
