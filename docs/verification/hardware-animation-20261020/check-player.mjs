import fs from 'node:fs'
import path from 'node:path'
const {chromium}=await import(process.env.WIKI_PLAYWRIGHT_MODULE||'playwright')
const origin=process.env.WIKI_AUDIT_ORIGIN||'http://127.0.0.1:5244/'
const out=path.resolve(process.env.WIKI_AUDIT_OUTPUT||import.meta.dirname)
fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.WIKI_CHROME_EXECUTABLE||undefined,headless:true})
const results=[]
function assert(value,message) { if(!value) throw Error(message) }
try {
  for(const width of [1440,390]) {
    const page=await browser.newPage({viewport:{width,height:900}}),errors=[],failures=[],requests=[]
    page.on('pageerror',e=>errors.push(e.message))
    page.on('request',r=>{if(/video-[123]-part-|\/[a-f0-9]{64}\.(webp|avif)/.test(r.url()))requests.push(r.url())})
    page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()})})
    await page.goto(origin+'Instrument/hardware.html',{waitUntil:'domcontentloaded'})
    await page.waitForFunction(()=>document.querySelectorAll('.hw-animation-controls').length===3)
    await page.waitForTimeout(500)
    const initial=await page.locator('[data-hardware-animation]').evaluateAll(es=>es.map(e=>e.dataset.animationFrame||null))
    assert(initial.every(v=>v===null),'Animations played before entering their viewport')
    const checks=[]
    for(const id of [1,2,3]) {
      const figure=page.locator(`[data-hardware-animation="${id}"]`)
      await figure.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
      await page.waitForFunction(id=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame>8,id,{timeout:60000})
      const start=Number(await figure.getAttribute('data-animation-frame'))
      await page.waitForTimeout(500)
      const advanced=Number(await figure.getAttribute('data-animation-frame'))
      assert(advanced>start,'Viewport autoplay did not advance')
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
      await page.waitForTimeout(180)
      const left=Number(await figure.getAttribute('data-animation-frame'))
      await page.waitForTimeout(250)
      assert(Number(await figure.getAttribute('data-animation-frame'))===left,'Offscreen animation kept playing')
      await figure.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
      await page.waitForFunction(({id,left})=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame>left,{id,left},{timeout:60000})
      await figure.locator('[data-action=play]').click()
      const paused=await figure.getAttribute('data-animation-frame')
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
      await figure.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
      await page.waitForTimeout(300)
      assert(await figure.getAttribute('data-animation-frame')===paused,'Manual pause did not persist')
      // Seek into another segment, including the WebP to AVIF transition in clip 2.
      const target=id===1?240:id===2?1500:100
      await figure.locator('input[type=range]').evaluate((e,value)=>{e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}))},target)
      await page.waitForFunction(({id,target})=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame===target,{id,target},{timeout:60000})
      const dimensions=await figure.locator('canvas').evaluate(e=>({width:e.width,height:e.height}))
      assert(dimensions.width===1280&&dimensions.height===720,'Original frame geometry changed')
      await figure.screenshot({path:path.join(out,`player-${width}-${id}.png`)})
      checks.push({id,start,advanced,offscreenPaused:true,manualPausePersists:true,seekFrame:target,dimensions,status:await figure.locator('.hw-animation-status').innerText()})
    }
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),'Horizontal page overflow')
    assert(!errors.length&&!failures.length,'Browser or network error')
    results.push({width,initial,checks,requests:[...new Set(requests)],errors,failures})
    await page.close()
  }
  const reduced=await browser.newPage({reducedMotion:'reduce'})
  await reduced.goto(origin+'Instrument/hardware.html',{waitUntil:'domcontentloaded'})
  const first=reduced.locator('[data-hardware-animation="1"]')
  await first.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
  await reduced.waitForTimeout(500)
  assert(!await first.getAttribute('data-animation-frame'),'Reduced-motion autoplay was enabled')
  results.push({reducedMotionAutoplay:false})
  await reduced.close()
} finally {
  fs.writeFileSync(path.join(out,'player-check.json'),JSON.stringify({origin,results},null,2)+'\n')
  await browser.close()
}
console.log(JSON.stringify({origin,checks:results.length,passed:true}))
