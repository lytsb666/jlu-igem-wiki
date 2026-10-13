import { chromium } from 'file:///C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {createHash} from 'node:crypto'
import assert from 'node:assert/strict'
const root=process.cwd(), scratch=resolve(root,'.sites-work/hardware-review-20261012')
mkdirSync(scratch,{recursive:true})
const browser=await chromium.launchPersistentContext(resolve(scratch,'browser-profile'),{
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,
  viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:false,
})
const page=await browser.newPage(),errors=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' at '+m.location().url)})
const base='http://127.0.0.1:5208',report={responsive:[],documents:[],errors}
report.failedRequests=[]
page.on('response',response=>{if(response.status()>=400)report.failedRequests.push({url:response.url(),status:response.status()})})
try{
  report.loading=[]
  // Hold the cover image briefly so the loading video can be measured while visible.
  // Article video sizing must never constrain the shared full-screen loading video.
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000})
    await page.route('**/*',async route=>{
      if(route.request().resourceType()==='image'&&/\/hardware-[^/]+\.webp$/.test(new URL(route.request().url()).pathname))
        await new Promise(resolve=>setTimeout(resolve,2500))
      await route.continue()
    })
    await page.goto(base+'/Instrument/hardware.html',{waitUntil:'domcontentloaded'})
    await page.waitForFunction(()=>document.querySelector('#igem-loader .loading-video')?.currentTime>.05)
    const result=await page.evaluate(()=>{
      const video=document.querySelector('#igem-loader .loading-video'),box=video.getBoundingClientRect(),css=getComputedStyle(video)
      return {width:innerWidth,height:innerHeight,video:{left:box.left,top:box.top,right:box.right,bottom:box.bottom,height:box.height,maxHeight:css.maxHeight,aspectRatio:css.aspectRatio},
        playing:!video.paused&&video.currentTime>0,locked:document.body.classList.contains('loading-lock')}
    })
    assert.equal(result.video.maxHeight,'none');assert.equal(result.video.aspectRatio,'auto')
    assert(result.video.left<=0&&result.video.top<=0&&result.video.right>=result.width&&result.video.bottom>=result.height)
    assert(result.playing&&result.locked)
    await page.screenshot({path:resolve(scratch,`loading-after-${width}.png`)})
    await page.locator('#igem-loader').waitFor({state:'detached',timeout:6000})
    assert.equal(await page.locator('body.loading-lock').count(),0)
    result.dismissedAndUnlocked=true
    report.loading.push(result)
    await page.unrouteAll({behavior:'wait'})
  }
  await page.setViewportSize({width:1440,height:1000})
  await page.goto(base+'/Instrument/hardware.html',{waitUntil:'domcontentloaded'})
  await page.locator('#igem-loader').waitFor({state:'hidden',timeout:20000})
  await page.screenshot({path:resolve(scratch,'desktop-cover.png')})
  for(const width of [1440,900,390,320]){
    await page.setViewportSize({width,height:1000})
    const result=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      tocHeading:document.querySelector('.hw-directory').innerText.includes('On this page'),backToTop:document.querySelectorAll('.hw-backtop').length,
      coverLeft:document.querySelector('.image-page-hero').getBoundingClientRect().left,
      coverRight:document.querySelector('.image-page-hero').getBoundingClientRect().right,
      clientWidth:document.documentElement.clientWidth,brokenLoadedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),
      bodySize:getComputedStyle(document.querySelector('.hw-section p')).fontSize,
      contentCards:[...document.querySelectorAll('.hw-intro,.hw-section')].map(el=>({
        background:getComputedStyle(el).backgroundColor,radius:getComputedStyle(el).borderRadius,
        padding:getComputedStyle(el).padding,shadow:getComputedStyle(el).boxShadow}))}))
    if(result.overflow) console.log(JSON.stringify(await page.evaluate(()=>({width:innerWidth,main:getComputedStyle(document.querySelector('main')).width,grid:getComputedStyle(document.querySelector('.hw-layout')).gridTemplateColumns,sheets:[...document.styleSheets].map(s=>s.href),wide:[...document.querySelectorAll('body *')].map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width,src:el.getAttribute('src')})).filter(x=>x.right>document.documentElement.clientWidth+2).sort((a,b)=>b.right-a.right).slice(0,12)})),null,2))
    assert.equal(result.overflow,0);assert.equal(result.tocHeading,false);assert.equal(result.backToTop,0)
    assert.equal(result.contentCards.length,11)
    for(const card of result.contentCards){
      assert.equal(card.background,'rgb(255, 255, 255)');assert(parseFloat(card.radius)>0)
      assert(parseFloat(card.padding)>0);assert.notEqual(card.shadow,'none')
    }
    assert.equal(result.brokenLoadedImages.length,0);assert(Math.abs(result.coverRight-result.clientWidth)<1);assert.equal(result.coverLeft,0)
    report.responsive.push(result)
    if(width===390){await page.locator('#hw-introduction > h2').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(scratch,'mobile-content.png')})}
  }
  await page.setViewportSize({width:1440,height:1000})
  await page.locator('#hw-introduction > h2').scrollIntoViewIfNeeded()
  await page.screenshot({path:resolve(scratch,'desktop-content.png')})
  await page.locator('img[alt^="Figure 2."]').screenshot({path:resolve(scratch,'timeline.png')})
  await page.locator('img[alt^="Figure 23."]').screenshot({path:resolve(scratch,'cost-chart.png')})
  await page.locator('.hw-cost-detail').first().locator('summary').click()
  assert.equal(await page.locator('.hw-cost-detail').first().getAttribute('open'),'')
  await page.locator('.hw-cost-detail').first().locator('summary').press('Enter')
  assert.equal(await page.locator('.hw-cost-detail').first().getAttribute('open'),null)
  const totalsVisible=await page.locator('main table').evaluateAll(tables=>tables.filter(t=>t.querySelector('caption').textContent.includes('Total Device Cost Summary')).every(t=>!t.closest('details')&&t.getClientRects().length>0))
  assert(totalsVisible)
  report.costAccordion={clickOpens:true,enterCloses:true,totalTablesAlwaysVisible:totalsVisible}
  await page.locator('#hw-reproduction').scrollIntoViewIfNeeded()
  for(const region of await page.locator('.hw-pdf-scroll').all()){
    await region.focus();await region.press('PageDown')
    await page.waitForFunction(el=>el.scrollTop>0,await region.elementHandle())
    assert(await region.evaluate(el=>el.scrollTop)>0)
  }
  await page.screenshot({path:resolve(scratch,'desktop-guides.png')})
  report.pdfScrollReaders={count:2,keyboardScroll:true,pageImages:await page.locator('.hw-pdf-scroll img').count()}
  const manifest=JSON.parse(readFileSync(resolve(root,'assets/hardware/review/materials.json'),'utf8'))
  for(const item of manifest.pdfs){
    const url=base+'/hardware-resources/'+item.target.split(/[\\/]/).at(-1)
    const response=await fetch(url);assert(response.ok)
    const digest=createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex')
    assert.equal(digest,item.sha256)
    report.documents.push({url,status:response.status,sha256Matches:true,pages:item.pages})
  }
  report.videos=[]
  for(const video of await page.locator('main video').all()){
    await video.evaluate(el=>{el.preload='metadata';el.load()})
    await video.evaluate(el=>new Promise((resolve,reject)=>{
      if(el.readyState>=1)return resolve()
      el.addEventListener('loadedmetadata',resolve,{once:true})
      el.addEventListener('error',()=>reject(new Error('Video metadata failed')),{once:true})
    }))
    report.videos.push(await video.evaluate(el=>({duration:el.duration,width:el.videoWidth,height:el.videoHeight,controls:el.controls})))
  }
  const first=page.locator('main video').first()
  await first.evaluate(el=>{el.muted=true;return el.play()})
  await page.waitForFunction(()=>document.querySelector('main video').currentTime>.1)
  await first.evaluate(el=>el.pause())
  report.videoPlayback=true
  for(const [n,v] of report.videos.entries())assert(Math.abs(v.duration-manifest.videos[n].duration_seconds)<.2)
  report.sidebarBackToTopRemoved=await page.locator('.hw-backtop').count()===0
  await page.goto(base+'/Judging/hardware.html?test=1#hw-costs',{waitUntil:'domcontentloaded'})
  await page.waitForURL('**/Instrument/hardware.html?test=1&nav=judging#hw-costs')
  await page.locator('#igem-loader').waitFor({state:'hidden',timeout:20000})
  const url=new URL(page.url());assert.equal(url.searchParams.get('nav'),'judging');assert.equal(url.hash,'#hw-costs')
  report.judging={url:page.url(),queryAndHashPreserved:true,links:await page.locator('.navbar .nav-link').evaluateAll(links=>links.map(a=>({text:a.textContent.trim(),classes:a.className,ariaCurrent:a.getAttribute('aria-current')})))}
  if(errors.length)console.log(JSON.stringify(report.failedRequests,null,2))
  assert.deepEqual(errors,[])
  writeFileSync(resolve(root,'assets/hardware/review/browser-checks.json'),JSON.stringify(report,null,2)+'\n')
  console.log('Hardware browser checks passed: full-screen loading playback and dismissal, white content cards and no sidebar top link at four widths, document hashes, inline scroll, video playback, cost disclosure and Judging redirect.')
}finally{await browser.close()}
