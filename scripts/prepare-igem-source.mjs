// Prepare editable sources with verified iGEM media URLs; Vite runs later in CI.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {globSync} from 'tinyglobby'

const root = path.resolve(import.meta.dirname, '..')
const release = path.resolve(root, process.argv[2])
const target = path.resolve(root, process.argv[3])
const relative = path.relative(root, target)
if (!relative || relative.startsWith('..') || fs.existsSync(target)) throw Error('Use a new source package inside this workspace.')
const manifest = JSON.parse(fs.readFileSync(path.join(release, 'release-media-manifest.json'), 'utf8'))
if (manifest.assets.some(a => !a.url)) throw Error('Every source media asset needs its captured official URL.')
const byHash = new Map(manifest.assets.map(a => [a.sha256, a]))
const media = /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|pdf|docx|txt)(?:[?#].*)?$/i
const seen = new Set()
function official(ref, importer) {
  if (!media.test(ref) || /^(?:https?:|data:|#|mailto:|tel:)/i.test(ref)) return
  let decoded
  try { decoded = decodeURIComponent(ref.replaceAll('&amp;', '&').split(/[?#]/)[0]) } catch { return }
  const candidates = [path.resolve(path.dirname(importer), decoded), path.resolve(root, 'public', path.relative(root, path.resolve(path.dirname(importer), decoded)))]
  for (const file of candidates) {
    if (path.relative(root, file).startsWith('..') || !fs.existsSync(file) || !fs.statSync(file).isFile()) continue
    const sha = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    const asset = byHash.get(sha)
    if (!asset) throw Error(`Source media absent from verified manifest: ${path.relative(root, file)}`)
    seen.add(sha)
    return asset.url + ref.slice(ref.split(/[?#]/)[0].length)
  }
}
function rewrite(code, file) {
  if (/\.html$/.test(file)) {
    code = code.replace(/\b(src|href|poster|data-full-src|data-story-src|data-media-src|data-wiki-pdf-url)=(['"])([^'"<>]+)\2/g,
      (all, attr, q, ref) => { const url = official(ref, file); return url ? `${attr}=${q}${url}${q}` : all })
    code = code.replace(/\bsrcset=(['"])([^'"<>]+)\1/g, (all, q, value) => 'srcset='+q+value.split(',').map(candidate => {
      const parts = /^(\S+)(.*)$/.exec(candidate.trim())
      return parts ? (official(parts[1],file)||parts[1])+parts[2] : candidate
    }).join(', ')+q)
    code = code.replace(/<video\b([^>]*)>[\s\S]*?<source\b[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/video>/g, (all, attrs, src) => {
      const asset = manifest.assets.find(a => a.kind === 'video' && a.url === src)
      if (!asset || !asset.width || !asset.height) throw Error('Verified official video metadata required.')
      const url = new URL(src)
      for (const [key, value] of Object.entries({autoplay:0,muted:0,controls:1,api:1,p2p:0})) url.searchParams.set(key,String(value))
      const label = /aria-label=(['"])(.*?)\1/.exec(attrs)?.[2] || 'JLU-SPH project video'
      return `<iframe data-wiki-article-video data-igem-video-id="${url.pathname.split('/').at(-1)}" data-igem-embed-src="${url.href.replaceAll('&','&amp;')}" title="${label.replaceAll('"','&quot;')}" width="${asset.width}" height="${asset.height}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="display:none;width:100%;height:auto;aspect-ratio:${asset.width}/${asset.height};border:0"></iframe>`
    })
    code = code.replaceAll('.contribution-video video', '.contribution-video :is(video,iframe)')
    if (code.includes('data-wiki-article-video')) {
      const script=path.relative(path.dirname(file),path.join(root,'assets/igem-article-video.js')).replaceAll('\\','/')
      code=code.replace('</body>',`<script src="${script}" defer></script></body>`)
    }
  }
  if (/\.css$/.test(file)) code=code.replace(/url\(\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^)]*))\s*\)/g, (all,a,b,c) => {
    const url=official((a??b??c).trim(),file);return url ? `url(${JSON.stringify(url)})` : all
  })
  if (/\.[cm]?js$/.test(file)) {
    code=code.replace(/import\.meta\.glob\(\s*(['"])([^'"]+)\1\s*,[\s\S]*?\}\s*\)/g, (all,q,pattern) => {
      const files=globSync(pattern,{cwd:path.dirname(file)})
      if (!files.length) throw Error('Empty source media glob: '+pattern)
      return JSON.stringify(Object.fromEntries(files.map(f => {
        const key=path.relative(path.dirname(file),path.resolve(path.dirname(file),f)).replaceAll('\\','/')
        const ref=key.startsWith('.')?key:'./'+key
        const url=official(ref,file)
        if (!url) throw Error('Unmapped glob media: '+ref)
        return [ref,url]
      })))
    })
    code=code.replace(/import\s+([\w$]+)\s+from\s+(['"])([^'"]+)\2\s*;?/g, (all,name,q,ref) => {
      const url=official(ref,file);return url ? `const ${name} = ${JSON.stringify(url)};\n` : all
    })
    code=code.replace(/new URL\(\s*(['"])([^'"]+)\1\s*,\s*import\.meta\.url\s*\)\.href/g, (all,q,ref) => {
      const url=official(ref,file);return url ? JSON.stringify(url) : all
    })
  }
  return code.replace(/\r\n?/g,'\n')
}
const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(directory,e.name)):[path.join(directory,e.name)])
const folders=['homepage','Project','Eagagement','Wet-lab','Instrument','Team','Judging']
const sourceFiles=[path.join(root,'index.html'),...folders.flatMap(dir=>walk(path.join(root,dir)).filter(f=>f.endsWith('.html')))]
const visited=new Set(sourceFiles)
for (let i=0;i<sourceFiles.length;i++) {
  const file=sourceFiles[i],code=fs.readFileSync(file,'utf8')
  const refs=[]
  if (file.endsWith('.html')) for(const m of code.matchAll(/\b(?:src|href)=["']([^"']+\.(?:css|[cm]?js|json))["']/g)) refs.push(m[1])
  else for(const m of code.matchAll(/(?:import\s+(?:[^'";\n]*?\s+from\s+)?|import\s*\(|@import\s*)(['"])([^'"]+\.(?:css|[cm]?js|json))\1/g)) refs.push(m[2])
  for(const ref of refs) {
    if (/^(?:https?:|data:)/.test(ref)) continue
    const dependency=path.resolve(path.dirname(file),decodeURIComponent(ref))
    if (visited.has(dependency)) continue
    if (!fs.existsSync(dependency)) throw Error('Missing source dependency: '+dependency)
    visited.add(dependency);sourceFiles.push(dependency)
  }
}
const allowed=new Set()
for (const file of sourceFiles.filter(f=>f.endsWith('.html'))) for (const match of fs.readFileSync(file,'utf8').matchAll(/\b(?:src|href|poster|data-full-src|data-story-src|data-media-src)=["']([^"']+)["']/g)) {
  try { allowed.add(path.resolve(path.dirname(file),decodeURIComponent(match[1].split(/[?#]/)[0]))) } catch {}
}
const presentationFile=path.join(root,'assets/media-presentation-20261018/entries.js')
const presentation=(await import(pathToFileURL(presentationFile).href)).default
let count=0
for (const file of sourceFiles) {
  let code=fs.readFileSync(file,'utf8')
  if (file===presentationFile) code='export default '+JSON.stringify(presentation.filter(e=>allowed.has(fileURLToPath(e.url))).map(e=>{
    const local=fileURLToPath(e.url)
    const ref=path.relative(path.dirname(file),local).replaceAll('\\','/')
    return {...e,url:official(ref,file)}
  }),null,2)+'\n'
  const destination=path.join(target,'frontend',path.relative(root,file))
  fs.mkdirSync(path.dirname(destination),{recursive:true})
  fs.writeFileSync(destination,rewrite(code,file));count++
}
for (const file of walk(path.join(root,'public/pdf-viewer'))) {
  if (/\.map$/.test(file)) continue
  const dest=path.join(target,'frontend/public',path.relative(path.join(root,'public'),file))
  fs.mkdirSync(path.dirname(dest),{recursive:true})
  if (/\.(?:css|[cm]?js|html)$/.test(file)) fs.writeFileSync(dest,rewrite(fs.readFileSync(file,'utf8'),file))
  else fs.copyFileSync(file,dest)
}
fs.mkdirSync(path.join(target,'tools'),{recursive:true})
fs.copyFileSync(path.join(root,'scripts/build-igem-source.mjs'),path.join(target,'tools/build.mjs'))
fs.copyFileSync(path.join(root,'scripts/igem-article-video.js'),path.join(target,'tools/igem-article-video.js'))
for (const file of ['package.json','package-lock.json','.gitlab-ci.yml','app.py','dependencies.txt','LICENSE']) fs.copyFileSync(path.join(release,file),path.join(target,file))
fs.writeFileSync(path.join(target,'release-media-manifest.json'),JSON.stringify({...manifest,buildMode:'editable-source-vite-ci',templateFiles:undefined},null,2)+'\n')
console.log(JSON.stringify({target,sourceFiles:count,officialAssets:seen.size,build:'Vite from editable sources in CI'}))
