import fs from 'node:fs'
import path from 'node:path'
import {build} from 'vite'

const root=path.resolve(import.meta.dirname,'..')
const manifest=JSON.parse(fs.readFileSync(path.join(root,'release-media-manifest.json'),'utf8'))
for(const asset of manifest.assets) {
  if(!asset.url) throw Error('Missing verified iGEM media URL: '+asset.filename)
  const url=new URL(asset.url)
  if(url.protocol!=='https:'||!['static.igem.wiki','video.igem.org','gitlab.igem.org'].includes(url.hostname)) throw Error('Non-iGEM runtime media: '+asset.filename)
}
const frontend=path.join(root,'frontend')
const out=path.join(root,'compiled')
const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(directory,e.name)):[path.join(directory,e.name)])
const pages=walk(frontend).filter(f=>f.endsWith('.html')&&!f.startsWith(path.join(frontend,'public')+path.sep))
await build({configFile:false,root:frontend,base:'./',publicDir:false,build:{outDir:out,emptyOutDir:true,assetsInlineLimit:0,
  rollupOptions:{input:Object.fromEntries(pages.map(f=>[path.relative(frontend,f).replaceAll('\\','/').slice(0,-5),f]))}}})
fs.cpSync(path.join(frontend,'public'),out,{recursive:true})
fs.mkdirSync(path.join(out,'assets'),{recursive:true})
fs.copyFileSync(path.join(import.meta.dirname,'igem-article-video.js'),path.join(out,'assets/igem-article-video.js'))
const aliases={description:'Project/description.html',design:'Project/design.html',engineering:'Project/engineering.html',safety:'Project/safety.html',contribution:'Project/contribution.html',
  members:'Team/member.html',team:'Team/member.html',attributions:'Team/attribution.html','human-practices':'Eagagement/iHP.html',education:'Eagagement/education.html',entrepreneurship:'Eagagement/entrepreneurship.html',
  protocol:'Wet-lab/protocal.html',notebook:'Wet-lab/notebook.html',measurement:'Wet-lab/measurement.html',parts:'Wet-lab/part.html',results:'Wet-lab/result.html',hardware:'Instrument/hardware.html',software:'Instrument/software.html',model:'Instrument/model.html'}
for (const [alias,target] of Object.entries(aliases)) {
  const directory=path.join(out,alias);fs.mkdirSync(directory,{recursive:true})
  fs.writeFileSync(path.join(directory,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=../${target}"><title>JLU-SPH iGEM 2026</title></head><body><a href="../${target}">Open page</a><script>location.replace('../${target}'+location.search+location.hash)</script></body></html>`)
}
console.log(JSON.stringify({buildMode:'editable-source-vite-ci',pages:pages.length,output:out}))
