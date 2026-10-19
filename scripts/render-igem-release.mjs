import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release-media-manifest.json'), 'utf8'))
const preview = process.env.IGEM_LOCAL_PREVIEW === '1'
if (preview && process.env.CI) throw Error('Local media preview is forbidden in CI.')
const missing = manifest.assets.filter(asset => !asset.url)
const uploadBlocked = asset => asset.kind === 'video' && asset.publicationStatus === 'upload-blocked-account' &&
  asset.uploadBlock?.reason === 'account-upload-disabled' && Boolean(asset.uploadBlock?.checkedAt)
const unresolved = missing.filter(asset => !uploadBlocked(asset))
if (!preview && unresolved.length) throw Error(`${unresolved.length} media files still need verified official upload URLs. Nothing was published.`)
for (const asset of manifest.assets.filter(a => a.url)) {
  const u = new URL(asset.url)
  if (u.protocol !== 'https:' || !['static.igem.wiki','video.igem.org','gitlab.igem.org'].includes(u.hostname) || /["'<>\s]/.test(asset.url)) throw Error(`Invalid official media URL: ${asset.filename}`)
  if (asset.kind === 'video' && (u.hostname !== 'video.igem.org' || !u.pathname.startsWith('/videos/embed/'))) throw Error(`An official Video Universe embed is required: ${asset.filename}`)
  if (asset.kind === 'video' && (!Number.isInteger(asset.width) || !Number.isInteger(asset.height) || asset.width <= 0 || asset.height <= 0)) throw Error(`Verified original video dimensions are required: ${asset.filename}`)
}
const out = path.join(root, preview ? 'preview/jlu-sph' : 'compiled')
const source = path.join(root, 'release-templates')
const walk = (directory) => fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(directory,entry.name)) : [path.join(directory,entry.name)])
const templates = manifest.templateFiles ? manifest.templateFiles.map(file => path.resolve(source,file)) : walk(source)
for (const file of templates) {
  const relative=path.relative(source,file);if(relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative))throw Error('Invalid template path')
  if (!/\.(?:html?|css|m?js|json|txt|md)$/i.test(file)) {
    const destination=path.join(out,path.relative(source,file));fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(file,destination);continue
  }
  let text = fs.readFileSync(file, 'utf8')
  if (!preview && file.endsWith('.html')) {
    text = text.replace(/<video\b([^>]*)>[\s\S]*?<source\b[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/video>/g, (all, attrs, src) => {
      const asset = missing.find(candidate => candidate.token === src && uploadBlocked(candidate))
      if (!asset) return all
      const label = /aria-label=(['"])(.*?)\1/.exec(attrs)?.[2] || 'JLU-SPH project video'
      const poster = /poster=(['"])(.*?)\1/.exec(attrs)?.[2]
      const still = poster ? `<img src="${poster}" alt="${label.replaceAll('"', '&quot;')}" style="display:block;width:100%;max-height:540px;object-fit:contain">` : ''
      return `<div data-igem-video-upload-blocked="${asset.sha256}" style="width:100%;text-align:center">${still}<p role="status">This video is not yet available on iGEM Video Universe.</p></div>`
    })
  }
  for (const asset of manifest.assets) {
    if (!preview && !asset.url) continue
    const url = preview ? `/jlu-sph/.media/${asset.filename}` : asset.url
    text = text.replaceAll(asset.token, url)
  }
  if (!preview && file.endsWith('.html')) {
    text = text.replace(/<video\b([^>]*)>[\s\S]*?<source\b[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/video>/g, (all, attrs, src) => {
      const asset = manifest.assets.find(a => a.kind === 'video' && a.url === src)
      if (!asset?.width || !asset?.height) throw Error('Verified original video dimensions are required before embedding.')
      const url = new URL(src)
      url.searchParams.set('autoplay', '0')
      url.searchParams.set('muted', '0')
      url.searchParams.set('controls', '1')
      url.searchParams.set('api', '1')
      url.searchParams.set('p2p', '0')
      const label = /aria-label=(['"])(.*?)\1/.exec(attrs)?.[2] || 'JLU-SPH project video'
      const preserved = [...attrs.matchAll(/\b(?:id|class)=(['"])(.*?)\1/g)].map(m => m[0]).join(' ')
      const review = asset.publicationStatus === 'awaiting-moderator-review' ? ' data-igem-review-pending' : ''
      return `<iframe ${preserved} data-wiki-article-video${review} data-igem-video-id="${url.pathname.split('/').at(-1)}" data-igem-embed-src="${url.href.replaceAll('&', '&amp;')}" title="${label.replaceAll('"', '&quot;')}" width="${asset.width}" height="${asset.height}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="display:none;width:100%;height:auto;aspect-ratio:${asset.width}/${asset.height};border:0"></iframe>`
    })
    // Keep the existing portrait-video dimensions and size limits on its official player.
    text = text.replaceAll('.contribution-video video', '.contribution-video :is(video,iframe)')
    if (text.includes('data-wiki-article-video')) {
      const script = path.relative(path.dirname(file), path.join(source, 'assets/igem-article-video.js')).replaceAll('\\', '/')
      text = text.replace('</body>', `<script src="${script}" defer></script></body>`)
    }
  }
  text = text.replaceAll('.hardware-page .hw-main video', '.hardware-page .hw-main :is(video,iframe[data-wiki-article-video])')
  if (/__IGEM_MEDIA_/.test(text)) throw Error(`Unresolved release token: ${file}`)
  const destination = path.join(out,path.relative(source,file)); fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,text)
}
if (!preview) {
  fs.mkdirSync(path.join(out, 'assets'), {recursive: true})
  fs.copyFileSync(path.join(import.meta.dirname, 'igem-article-video.js'), path.join(out, 'assets/igem-article-video.js'))
}
if (preview) {
  fs.mkdirSync(path.join(out,'.media'),{recursive:true})
  for (const asset of manifest.assets) fs.copyFileSync(path.join(root,'media',asset.filename),path.join(out,'.media',asset.filename))
}
const aliases = {description:'Project/description.html', design:'Project/design.html', engineering:'Project/engineering.html', safety:'Project/safety.html', contribution:'Project/contribution.html',
  members:'Team/member.html',team:'Team/member.html',attributions:'Team/attribution.html','human-practices':'Eagagement/iHP.html',education:'Eagagement/education.html',entrepreneurship:'Eagagement/entrepreneurship.html',
  protocol:'Wet-lab/protocal.html',notebook:'Wet-lab/notebook.html',measurement:'Wet-lab/measurement.html',parts:'Wet-lab/part.html',results:'Wet-lab/result.html',hardware:'Instrument/hardware.html',software:'Instrument/software.html',model:'Instrument/model.html'}
for (const [alias,target] of Object.entries(aliases)) {
  const dir=path.join(out,alias);fs.mkdirSync(dir,{recursive:true})
  fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=../${target}"><title>JLU-SPH iGEM 2026</title></head><body><a href="../${target}">Open page</a><script>location.replace('../${target}'+location.search+location.hash)</script></body></html>`)
}
for (const shell of manifest.shellPages) {
  const html = fs.readFileSync(path.join(out,shell),'utf8')
  if (!html.includes('data-igem-content="deferred"') || /<table\b|wiki-pdf-reader|data-ihp-atlas|measurement-map|hw-section/.test(html)) throw Error(`Deferred page contains article content: ${shell}`)
}
console.log(JSON.stringify({preview,output:out,contentPages:manifest.contentPages.length,shellPages:manifest.shellPages.length,pendingUploads:missing.length,blockedVideoUploads:missing.filter(uploadBlocked).length,pendingVideoReviews:manifest.assets.filter(asset => asset.publicationStatus === 'awaiting-moderator-review').length}))
