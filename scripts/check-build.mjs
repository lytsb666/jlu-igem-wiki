import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

const root = resolve(process.argv[2] || 'dist/client')
if (!existsSync(root)) throw new Error(`Build output missing: ${root}; run npm run build first.`)
const files = []
const walk = directory => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Symlink in output: ${file}`)
    if (entry.isDirectory()) walk(file)
    else files.push(file)
  }
}
walk(root)
const report = { files: files.length, htmlPages: 0, references: 0, maximumBytes: 0, missing: [], oversized: [], unsafe: [] }
for (const file of files) {
  const name = relative(root, file).replaceAll(sep, '/')
  const size = statSync(file).size
  report.maximumBytes = Math.max(report.maximumBytes, size)
  if (size > 25 * 1024 * 1024) report.oversized.push(name)
  if (/(?:^|\/)(?:\.[^/]+|node_modules|server|functions)(?:\/|$)|(?:^|\/)_worker\.js(?:\/|$)|\.(?:map|pem|key)$/.test(name)) report.unsafe.push(name)
  if (!name.endsWith('.html')) continue
  report.htmlPages++
  for (const match of readFileSync(file, 'utf8').matchAll(/\s(?:href|src|poster|data-full-src)=["']([^"']+)["']/g)) {
    const reference = match[1].split(/[?#]/)[0]
    if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue
    report.references++
    let path
    try { path = decodeURIComponent(reference.replaceAll('&amp;', '&')) }
    catch { report.missing.push({ page: name, reference }); continue }
    const target = path.startsWith('/') ? resolve(root, path.slice(1)) : resolve(dirname(file), path)
    const rel = relative(root, target)
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
      report.unsafe.push(`${name}: ${reference}`)
      continue
    }
    // Cloudflare Pages supports directory index pages and extensionless HTML URLs.
    if (!existsSync(target) && !existsSync(`${target}.html`) && !existsSync(resolve(target, 'index.html'))) {
      report.missing.push({ page: name, reference })
    }
  }
}
if (!existsSync(resolve(root, 'index.html'))) report.missing.push({ page: 'index.html', reference: 'required entry' })
console.log(JSON.stringify(report, null, 2))
if (report.files > 20000 || report.missing.length || report.oversized.length || report.unsafe.length) process.exitCode = 1
