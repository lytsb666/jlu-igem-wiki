import {chromium} from 'file:///C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {createHash} from 'node:crypto'
import assert from 'node:assert/strict'

const root=process.cwd(),scratch=resolve(root,'.sites-work/hardware-update-20261014')
mkdirSync(scratch,{recursive:true})
const supplement=JSON.parse(readFileSync(resolve(root,'assets/hardware/review/pathogen-results-source-20261014.json'),'utf8'))
const browser=await chromium.launchPersistentContext(resolve(scratch,'browser-profile'),{
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,
  viewport:{width:1440,height:900},reducedMotion:'reduce',acceptDownloads:false
})
const page=await browser.newPage(),report={responsive:[],originals:[],model:[],errors:[],failedResponses:[]}
page.on('pageerror',e=>report.errors.push(e.message))
page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())})
page.on('response',r=>{if(r.status()>=400)report.failedResponses.push({url:r.url(),status:r.status()})})
const base='http://127.0.0.1:5208'
const styles=el=>{
  const img=getComputedStyle(el.querySelector('img')),caption=getComputedStyle(el.querySelector('figcaption'))
  return {image:Object.fromEntries(['width','height','maxWidth','maxHeight','objectFit','display','marginTop','marginRight','marginBottom','marginLeft','borderTopWidth','boxShadow'].map(k=>[k,img[k]])),
    caption:Object.fromEntries(['fontFamily','fontSize','fontWeight','textAlign','color','lineHeight','marginTop','marginBottom'].map(k=>[k,caption[k]]))}
}
try {
  await page.goto(base+'/Instrument/hardware.html',{waitUntil:'domcontentloaded'})
  await page.locator('#igem-loader').waitFor({state:'detached'})
  await page.locator('.hw-figure img').evaluateAll(async images=>{
    images.forEach(img=>{img.loading='eager'})
    await Promise.all(images.map(img=>img.decode()))
  })
  assert.equal(await page.locator('#hw-pathogen-results').innerText(),supplement.heading)
  assert.deepEqual(await page.locator('#hw-pathogen-results + p, #hw-pathogen-results + p + p').allTextContents(),supplement.paragraphs)
  assert.equal(await page.locator('#hw-pathogen-results-caption').textContent(),supplement.caption)
  assert.equal(await page.getByText('Result image pending',{exact:true}).count(),0)
  for(const viewport of [{width:1440,height:900},{width:1280,height:720},{width:900,height:1000},{width:390,height:844},{width:320,height:568}]) {
    await page.setViewportSize(viewport)
    const item=await page.evaluate(()=>({width:innerWidth,height:innerHeight,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      large:[...document.querySelectorAll('.hw-figure--large img')].map(img=>({alt:img.alt,height:img.getBoundingClientRect().height,maxHeight:getComputedStyle(img).maxHeight,objectFit:getComputedStyle(img).objectFit})),
      normal:[...document.querySelectorAll('.hw-figure:not(.hw-figure--large):not(.hw-pathogen-results) img')].map(img=>img.getBoundingClientRect().height),
      panels:[...document.querySelectorAll('.hw-result-panel')].map(el=>({left:el.getBoundingClientRect().left,width:el.getBoundingClientRect().width,label:el.querySelector('h4').textContent})),
      brokenImages:[...document.querySelectorAll('.hw-figure img')].filter(img=>!img.naturalWidth).map(img=>img.alt)}))
    assert.equal(item.overflow,0);assert.deepEqual(item.brokenImages,[])
    assert.equal(item.large.length,3)
    for(const img of item.large){assert(img.height<=Math.min(600,viewport.height*.65)+1);assert.equal(img.objectFit,'contain')}
    for(const height of item.normal)assert(height<=Math.min(360,viewport.height*.42)+1)
    if(viewport.width>900)for(const img of item.large)assert(img.height>Math.min(360,viewport.height*.42)+30)
    assert.deepEqual(item.panels.map(p=>p.label),supplement.panels.map(p=>p.label))
    if(viewport.width<=680)assert.equal(new Set(item.panels.map(p=>Math.round(p.left))).size,1)
    if(viewport.width===1440||viewport.width===390) {
      for(const anchor of ['hw-gen1-architecture','hw-gen1-analysis','hw-gen1-app','hw-pathogen-results']){
        await page.locator('#'+anchor).evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-100))
        await page.screenshot({path:resolve(scratch,`${anchor}-${viewport.width}.png`)})
      }
      await page.locator('.hw-result-panels').screenshot({path:resolve(scratch,`pathogen-panels-${viewport.width}.png`)})
    }
    report.responsive.push(item)
  }
  for(const [i,panel] of supplement.panels.entries()){
    const anchor=page.locator('.hw-result-panel a').nth(i),img=anchor.locator('img')
    const href=await anchor.getAttribute('href')
    assert.equal(href,await img.evaluate(el=>el.currentSrc||el.src))
    const response=await page.request.get(href)
    assert.equal(response.status(),200)
    assert.equal(createHash('sha256').update(await response.body()).digest('hex'),panel.sha256)
    report.originals.push({panel:panel.panel,status:200,sha256:panel.sha256,originalBytesUnchanged:true})
  }
  // Compare against Measurement's real rendered result chart at desktop and mobile widths.
  const reference=await browser.newPage()
  await reference.goto(base+'/Wet-lab/measurement.html',{waitUntil:'domcontentloaded'})
  await reference.locator('#igem-loader').waitFor({state:'detached'})
  await reference.locator('.research-chart').first().scrollIntoViewIfNeeded()
  await reference.locator('.research-chart').first().locator('img').evaluate(img=>img.decode())
  await page.goto(base+'/Instrument/model.html',{waitUntil:'domcontentloaded'})
  await page.locator('#igem-loader').waitFor({state:'detached'})
  const model=page.locator('.model-result-figure')
  await model.scrollIntoViewIfNeeded();await model.locator('img').evaluate(img=>img.decode())
  for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568}]){
    await page.setViewportSize(viewport);await reference.setViewportSize(viewport)
    const expected=await reference.locator('.research-chart').first().evaluate(styles)
    const actual=await model.evaluate(styles)
    // Image intrinsic aspect ratios differ; compare the presentation rules, not their pixel heights.
    for(const k of ['width','height','marginRight','marginLeft']){delete actual.image[k];delete expected.image[k]}
    assert.deepEqual(actual,expected)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),0)
    assert.equal(await page.locator('.model-equation').first().evaluate(el=>getComputedStyle(el).scrollbarWidth),'none')
    report.model.push({viewport,presentation:actual,matchedMeasurement:true,formulaScrollbarHidden:true})
    await model.scrollIntoViewIfNeeded();await model.screenshot({path:resolve(scratch,`model-result-${viewport.width}.png`)})
  }
  await reference.close()
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedResponses,[])
  writeFileSync(resolve(root,'assets/hardware/review/results-checks-20261014.json'),JSON.stringify(report,null,2)+'\n')
  console.log('Five Hardware viewports, larger selected figures, six unedited source panels, original-image links, and Measurement-matched Model results passed.')
} finally {await browser.close()}
