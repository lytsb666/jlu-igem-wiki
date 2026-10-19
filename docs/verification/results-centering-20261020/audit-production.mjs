// Run with Playwright available; WIKI_AUDIT_ORIGIN selects local or official hosting.
const {chromium}=await import(process.env.WIKI_PLAYWRIGHT_MODULE||'playwright')
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('../../../',import.meta.url))
const origin=process.env.WIKI_AUDIT_ORIGIN||'http://127.0.0.1:5244/'
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/IGEM_OFFICIAL_MEDIA_UPLOAD_20261019.json'),'utf8'))
const task=path.resolve(process.env.WIKI_AUDIT_OUTPUT||path.dirname(fileURLToPath(import.meta.url)))+path.sep
fs.mkdirSync(task,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.WIKI_CHROME_EXECUTABLE||undefined,headless:true})
const jobs=[1440,390].flatMap(width=>manifest.contentPages.filter(file=>!process.env.WIKI_AUDIT_ONLY||process.env.WIKI_AUDIT_ONLY.split(',').includes(file)).map(file=>({width,file}))),results=[]
async function worker(){
 while(jobs.length){
  const {width,file}=jobs.shift(),page=await browser.newPage({viewport:{width,height:900}}),errors=[],failures=[]
  page.on('pageerror',e=>errors.push(e.message))
  page.on('response',r=>{if(r.status()>=400&&/127\.0\.0\.1|2026\.igem\.wiki|static\.igem\.wiki/.test(r.url()))failures.push({url:r.url(),status:r.status()})})
  try{
   await page.goto(origin+file,{waitUntil:'domcontentloaded',timeout:60000})
   await page.waitForFunction(()=>!document.body.classList.contains('loading-lock'),null,{timeout:12000})
   await page.waitForTimeout(350)
   const initial=await page.evaluate(()=>({deferred:document.querySelectorAll('img[data-media-src]').length,storyDeferred:document.querySelectorAll('img[data-story-src]').length,pdfActive:document.querySelectorAll('iframe.wiki-pdf-reader[src]').length}))
   const panels=file.includes('/model.')?['model-tab-measurement','model-tab-hardware']:[null]
   const checks=[]
   for(const tab of panels){
    if(tab){await page.locator('#'+tab).click();await page.waitForTimeout(250)}
    await page.evaluate(()=>document.querySelectorAll('.research-plot-frame').forEach(frame=>{for(let n=frame;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true}))
    for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=720){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(20)}
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}))
    await page.waitForFunction(()=>[...document.querySelectorAll('main img')].filter(i=>i.checkVisibility({contentVisibilityAuto:true})&&!i.hasAttribute('data-media-src')&&!i.hasAttribute('data-story-src')).every(i=>i.complete),null,{timeout:20000})
    await page.waitForTimeout(200)
    checks.push(await page.evaluate(()=>{
     const active=e=>e.checkVisibility({contentVisibilityAuto:true})
     const images=[...document.querySelectorAll('main img')].filter(i=>active(i)&&!i.hasAttribute('data-media-src')&&!i.hasAttribute('data-story-src'))
     const plots=[...document.querySelectorAll('.research-plot-frame')].filter(active).map(e=>{
      const i=e.querySelector('img'),b=e.dataset.plotBounds.split(',').map(Number),r=i.getBoundingClientRect(),f=e.closest('figure').getBoundingClientRect()
      return {id:e.closest('figure').id,loaded:i.naturalWidth>1,error:i.naturalWidth>1?Math.abs(r.x+((b[0]+b[2])/2)/(Number(i.getAttribute('width'))||i.naturalWidth)*r.width-f.x-f.width/2):null}
     })
     return {overflow:document.documentElement.scrollWidth>innerWidth+2,brokenImages:images.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),brokenAnchors:[...document.querySelectorAll('main a[href^="#"]')].filter(a=>a.hash&&a.hash!=='#'&&!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash),replacementCharacters:document.querySelector('main')?.innerText.includes('\uFFFD')||false,rawHotspotLabels:[...document.querySelectorAll('.measurement-map__hotspot')].filter(a=>[...a.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).length,plots:plots.length,unloadedPlots:plots.filter(p=>!p.loaded).length,offCenter:plots.filter(p=>p.error>1).slice(0,5),pdfActive:document.querySelectorAll('iframe.wiki-pdf-reader[src]').length}
    }))
   }
   if(file.includes('measurement')&&width===1440){
    const map=page.locator('.measurement-map__canvas');await map.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}))
    await page.waitForFunction(()=>document.querySelector('.measurement-map__canvas>img').naturalWidth>1)
    await map.screenshot({path:task+'workflow-fixed.png'})
   }
   const result={file,width,initial,checks,errors,failures};results.push(result)
   console.log(JSON.stringify({file,width,errors:errors.length,failures:failures.length,problems:checks.filter(c=>c.overflow||c.brokenImages.length||c.brokenAnchors.length||c.replacementCharacters||c.rawHotspotLabels||c.unloadedPlots||c.offCenter.length)}))
  }catch(e){results.push({file,width,error:e.message});console.log(JSON.stringify({file,width,error:e.message}))}
  finally{await page.close();fs.writeFileSync(task+'site-audit.json',JSON.stringify(results,null,2)+'\n')}
 }
}
try{await Promise.all([worker(),worker()])}finally{await browser.close()}
if(results.some(r=>r.error||r.errors?.length||r.failures?.length||r.checks?.some(c=>c.overflow||c.brokenImages.length||c.brokenAnchors.length||c.replacementCharacters||c.rawHotspotLabels||c.unloadedPlots||c.offCenter.length)))process.exitCode=1
