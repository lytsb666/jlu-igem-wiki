import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = path.resolve(import.meta.dirname, '..')
const official = path.resolve(root, process.argv[2] || '.local/igem-release-20261019/repository')
const target = path.resolve(root, process.argv[3] || '.local/igem-release-20261019/package')
const rel = path.relative(root, target)
if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) throw Error('Release package must stay inside this workspace.')
if (fs.existsSync(target)) throw Error('Use a new package directory; existing packages are retained.')
fs.mkdirSync(target, {recursive: true})
const old = JSON.parse(fs.readFileSync(path.join(official, 'media-manifest.json'), 'utf8')).assets
const previous = new Map(old.filter(a => a.url).map(a => [a.sha256, a]))
const savedUploads = fs.readdirSync(path.join(root, 'docs')).filter(file => /^IGEM_OFFICIAL_MEDIA_UPLOAD_\d{8}\.json$/.test(file)).sort().map(file => path.join(root, 'docs', file))
for (const saved of [...savedUploads, path.join(official, 'release-media-manifest.json')]) {
  if (fs.existsSync(saved)) for (const asset of JSON.parse(fs.readFileSync(saved, 'utf8')).assets || []) {
    if (asset.url || (asset.kind === 'video' && asset.publicationStatus === 'upload-blocked-account' && asset.uploadBlock?.reason === 'account-upload-disabled')) previous.set(asset.sha256, asset)
  }
}
const shells = new Set()
const folders = ['homepage', 'Project', 'Eagagement', 'Wet-lab', 'Instrument', 'Team', 'Judging']
const pages = ['index.html', ...folders.flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.html')).map(f => `${dir}/${f}`))]
const sourcePages = new Map(pages.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]))
const allowedMedia = new Set()
const mediaExtension = /\.(?:png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|mp4|webm|pdf|docx|txt)(?:[?#].*)?$/i
function sourceFile(ref, importer) {
  if (/^(?:https?:|data:|#|mailto:|tel:)/i.test(ref)) return
  let decoded
  try { decoded = decodeURIComponent(ref.replaceAll('&amp;', '&').split(/[?#]/)[0]) } catch { return }
  if (!mediaExtension.test(decoded)) return
  const relative = path.posix.normalize(path.posix.join(path.posix.dirname(importer), decoded))
  for (const candidate of [path.resolve(root, relative), path.resolve(root, 'public', relative)]) {
    if (!path.relative(root, candidate).startsWith('..') && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  }
}
for (const [file, text] of sourcePages) for (const match of text.matchAll(/\b(?:src|href|poster|data-full-src|data-story-src|data-media-src)=["']([^"']+)["']/g)) {
  const resolved = sourceFile(match[1], file)
  if (resolved) allowedMedia.add(resolved)
}
const presentationPath = path.join(root, 'assets/media-presentation-20261018/entries.js')
const presentation = (await import(pathToFileURL(presentationPath).href)).default
const filteredPresentation = presentation.filter(entry => allowedMedia.has(fileURLToPath(entry.url)))
// Serialize only entries for images actually retained on the published pages.
const presentationCode = 'export default [' + filteredPresentation.map(entry => {
  const local = fileURLToPath(entry.url)
  const source = path.relative(path.dirname(presentationPath), local).replaceAll('\\', '/')
  const {url, ...rest} = entry
  return '{...'+JSON.stringify(rest)+',url:new URL('+JSON.stringify(source)+',import.meta.url).href}'
}).join(',') + ']'
const built = await build({configFile: false, root, base: './', publicDir: false, logLevel: 'warn',
  plugins: [{name: 'igem-content-scope', enforce: 'pre',
    transformIndexHtml: {order: 'pre', handler: (code, context) => sourcePages.get(path.relative(root, context.filename).replaceAll('\\', '/')) || code},
    transform(code, id) { if (id.split('?')[0] === presentationPath.replaceAll('\\', '/') || id.split('?')[0] === presentationPath) return presentationCode },
  }],
  build: {write: false, assetsInlineLimit: 0, rollupOptions: {input: Object.fromEntries(pages.map(file => [file.slice(0,-5), path.join(root, file)]))}},
})
const output = [...built.output]
// PDF.js libraries stay on the wiki; its images and fonts use official media URLs.
const walk = directory => fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(directory,entry.name)) : [path.join(directory,entry.name)])
for (const file of walk(path.join(root,'public/pdf-viewer'))) {
  if (/\.map$/.test(file) || path.basename(file).startsWith('.')) continue
  output.push({type:'asset',fileName:path.relative(path.join(root,'public'),file).replaceAll('\\','/'),source:fs.readFileSync(file),originalFileNames:[path.relative(root,file).replaceAll('\\','/')]})
}
const records = new Map()
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
function record(bytes, ext, original) {
  const sha256 = hash(bytes), filename = sha256 + ext.toLowerCase()
  if (!records.has(filename)) {
    const previousAsset = previous.get(sha256)
    const kind = /\.(mp4|webm)$/i.test(ext) ? 'video' : /\.(pdf|docx|txt)$/i.test(ext) ? 'document' : 'image'
    const asset = {sha256, filename, bytes: bytes.length, kind, originals: [], url: previousAsset?.url || null, token: `__IGEM_MEDIA_${sha256}_${ext.slice(1)}__`}
    for (const key of ['uploadVariant', 'officialUpload', 'publicationStatus', 'videoUpload', 'uploadBlock', 'width', 'height']) if (previousAsset?.[key]) asset[key] = previousAsset[key]
    if (kind === 'video' && original) {
      const sourceManifest = path.join(root, path.dirname(original), 'source-manifest.json')
      if (fs.existsSync(sourceManifest)) {
        const metadata = JSON.parse(fs.readFileSync(sourceManifest, 'utf8'))
        if (metadata.sha256 === sha256 && Number.isInteger(metadata.width) && Number.isInteger(metadata.height) && metadata.width > 0 && metadata.height > 0) {
          asset.width = metadata.width
          asset.height = metadata.height
        }
      }
    }
    if (kind === 'video' && (!asset.width || !asset.height)) {
      const source = path.join(root, original)
      const probe = "import cv2,json,sys;v=cv2.VideoCapture(sys.argv[1]);print(json.dumps({'width':int(v.get(cv2.CAP_PROP_FRAME_WIDTH)),'height':int(v.get(cv2.CAP_PROP_FRAME_HEIGHT))}));v.release()"
      Object.assign(asset, JSON.parse(execFileSync('python',['-c',probe,source],{encoding:'utf8'})))
      if (!asset.width || !asset.height) throw Error('Cannot determine original video dimensions: '+original)
    }
    records.set(filename, asset)
    fs.mkdirSync(path.join(target, 'media'), {recursive: true})
    fs.writeFileSync(path.join(target, 'media', filename), bytes)
  }
  const asset = records.get(filename)
  if (original && !asset.originals.includes(original)) asset.originals.push(original)
  return asset
}
const bundledMedia = new Map()
for (const file of output) if (file.type === 'asset' && mediaExtension.test(file.fileName) && !file.fileName.startsWith('pdf-viewer/vendor/standard_fonts/')) {
  const bytes = Buffer.from(file.source)
  const asset = record(bytes, path.extname(file.fileName), (file.originalFileNames || []).join(', '))
  bundledMedia.set(file.fileName, asset)
}
function rewrite(ref, file) {
  if (/^\.[a-z0-9]+$/i.test(ref)) return ref
  if (/^(?:https?:|data:|#|mailto:|tel:)/i.test(ref) || !mediaExtension.test(ref)) return ref
  const clean = ref.replaceAll('&amp;', '&').split(/[?#]/)[0]
  let decoded
  try { decoded = decodeURIComponent(clean) } catch { return ref }
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), decoded))
  let asset = bundledMedia.get(resolved)
  if (!asset) {
    const original = sourceFile(ref, file)
    if (!original) throw Error(`Unresolved release media: ${ref} in ${file}`)
    asset = record(fs.readFileSync(original), path.extname(original), path.relative(root, original).replaceAll('\\','/'))
  }
  return asset.token + ref.slice(clean.length)
}
const templateDir = path.join(target, 'release-templates')
for (const file of output) {
  if (file.type !== 'chunk' && bundledMedia.has(file.fileName)) continue
  if (file.type !== 'chunk' && !/\.(?:html?|css|m?js|json|txt|md)$/i.test(file.fileName)) {
    const destination=path.join(templateDir,file.fileName);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,Buffer.from(file.source));continue
  }
  let text = file.type === 'chunk' ? file.code : String(file.source)
  if (/\.html?$/.test(file.fileName)) text = text.replace(/\b(src|href|poster|data-full-src|data-story-src|data-media-src|data-wiki-pdf-url)=(['"])([^'"<>]+)\2/g, (all, attr, quote, ref) => `${attr}=${quote}${rewrite(ref,file.fileName)}${quote}`)
  if (/\.html?$/.test(file.fileName)) text = text.replace(/\bsrcset=(['"])([^'"<>]+)\1/g, (all,quote,value) => 'srcset='+quote+value.split(',').map(candidate => {
    const parts = /^(\S+)(.*)$/.exec(candidate.trim())
    return parts ? rewrite(parts[1],file.fileName)+parts[2] : candidate
  }).join(', ')+quote)
  if (file.fileName.endsWith('.css')) text = text.replace(/url\(\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^)]*))\s*\)/g, (all, a,b,c) => `url(${JSON.stringify(rewrite((a??b??c).trim(),file.fileName))})`)
  if (/\.m?js$/.test(file.fileName)) text = text.replace(/(["'`])([^"'`\n]*\.(?:png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|mp4|webm|pdf|docx|txt)(?:[?#][^"'`\n]*)?)\1/g, (all, quote, ref, offset) => {
    if (ref.includes('${')) return all
    if (/^\s*:/.test(text.slice(offset + all.length))) return all
    let resolved
    try { resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file.fileName), decodeURIComponent(ref.split(/[?#]/)[0]))) } catch { return all }
    if (!bundledMedia.has(resolved)) return all
    return quote + rewrite(ref, file.fileName) + quote
  })
  const destination = path.join(templateDir, file.fileName)
  fs.mkdirSync(path.dirname(destination), {recursive: true}); fs.writeFileSync(destination, text.replace(/\r\n?/g, '\n'))
}
const manifest = {date: '2026-10-19', sourceCommit: execFileSync('git',['rev-parse','HEAD'],{cwd: root, encoding:'utf8'}).trim(),
  officialBase: execFileSync('git',['rev-parse','HEAD'],{cwd: official, encoding:'utf8'}).trim(),
  contentPages: pages.filter(file => !shells.has(file) && !file.startsWith('Judging/') && !['index.html','Team/attribution.html'].includes(file)),
  shellPages: [...shells], assets: [...records.values()], templateFiles: walk(templateDir).map(file=>path.relative(templateDir,file).replaceAll('\\','/')),
}
fs.writeFileSync(path.join(target, 'release-media-manifest.json'), JSON.stringify(manifest, null, 2)+'\n')
fs.mkdirSync(path.join(target, 'tools'), {recursive: true})
fs.copyFileSync(path.join(root, 'scripts/render-igem-release.mjs'), path.join(target, 'tools/build.mjs'))
fs.copyFileSync(path.join(root, 'scripts/igem-article-video.js'), path.join(target, 'tools/igem-article-video.js'))
for (const file of ['package.json','package-lock.json','.gitlab-ci.yml','app.py','dependencies.txt','LICENSE']) fs.copyFileSync(path.join(official,file),path.join(target,file))
console.log(JSON.stringify({target, contentPages: manifest.contentPages.length, shellPages: manifest.shellPages.length,
  assets: records.size, reused: manifest.assets.filter(a=>a.url).length, pending: manifest.assets.filter(a=>!a.url).length,
  pendingBytes: manifest.assets.filter(a=>!a.url).reduce((sum,a)=>sum+a.bytes,0), presentationEntries:filteredPresentation.length},null,2))
