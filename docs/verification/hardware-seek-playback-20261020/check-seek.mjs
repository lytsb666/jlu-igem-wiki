import fs from 'node:fs'
import path from 'node:path'
const {chromium}=await import(process.env.WIKI_PLAYWRIGHT_MODULE||'playwright')
const origin=process.env.WIKI_AUDIT_ORIGIN||'http://127.0.0.1:5244/'
const out=path.resolve(process.env.WIKI_AUDIT_OUTPUT||import.meta.dirname)
fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.WIKI_CHROME_EXECUTABLE||undefined,headless:true})
const results=[]
const assert=(ok,message)=>{if(!ok)throw Error(message)}
try {
  for(const width of [1440,390]) {
    const page=await browser.newPage({viewport:{width,height:900}}),errors=[]
    page.on('pageerror',e=>errors.push(e.message))
    await page.goto(origin+'Instrument/hardware.html',{waitUntil:'domcontentloaded'})
    await page.waitForFunction(()=>document.querySelectorAll('.hw-animation-controls').length===3)
    const checks=[]
    for(const id of [1,2,3]) {
      const figure=page.locator(`[data-hardware-animation="${id}"]`)
      await figure.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}))
      await page.waitForFunction(id=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame>4,id,{timeout:45000})
      const target=id===1?240:id===2?1500:100
      const during=await figure.evaluate((e,value)=>{
        const range=e.querySelector('input');range.value=value;range.dispatchEvent(new Event('input',{bubbles:true}))
        return e.querySelector('[data-action=play]').textContent
      },target)
      assert(during==='Pause','Seeking changed the playing state')
      await page.waitForFunction(({id,target})=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame>target+3,{id,target},{timeout:45000})
      await figure.locator('input').evaluate((e,value)=>{
        for(const offset of [10,30,20]) {e.value=value+offset;e.dispatchEvent(new Event('input',{bubbles:true}))}
      },target)
      await page.waitForFunction(({id,target})=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame>target+23,{id,target},{timeout:45000})
      await figure.locator('[data-action=play]').click()
      const paused=target+40
      await figure.locator('input').evaluate((e,value)=>{e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}))},paused)
      await page.waitForFunction(({id,paused})=>+document.querySelector(`[data-hardware-animation="${id}"]`).dataset.animationFrame===paused,{id,paused},{timeout:45000})
      await page.waitForTimeout(200)
      assert(Number(await figure.getAttribute('data-animation-frame'))===paused,'Seeking resumed a manually paused demonstration')
      const status=await figure.locator('.hw-animation-status').evaluate(e=>({hidden:e.hidden,height:e.getBoundingClientRect().height,text:e.textContent}))
      assert(status.hidden&&status.height===0&&!status.text,'Loading text or its empty space remains')
      assert(await figure.locator('[data-action=play]').innerText()==='Play','Paused state changed after seeking')
      checks.push({id,playingSeekContinued:true,rapidSeekContinued:true,pausedSeekStayedPaused:true,status})
    }
    assert(!errors.length,'Browser errors: '+errors.join('; '))
    results.push({width,checks,errors})
    await page.close()
  }
} finally {
  fs.writeFileSync(path.join(out,'seek-check.json'),JSON.stringify({origin,results},null,2)+'\n')
  await browser.close()
}
console.log(JSON.stringify({origin,widths:results.length,demonstrations:6,passed:true}))
