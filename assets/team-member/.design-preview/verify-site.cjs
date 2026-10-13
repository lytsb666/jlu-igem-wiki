const {chromium}=require('C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path');const fs=require('node:fs');const assert=require('node:assert/strict');const crypto=require('node:crypto');
const folder=__dirname,repo=path.resolve(folder,'../../..');
(async()=>{
  const context=await chromium.launchPersistentContext(path.join(repo,'tmp/team-site-browser-profile'),{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}});
  const errors=[];
  try{
    const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
    const response=await page.goto('http://127.0.0.1:5202/');assert.equal(response.status(),200);
    await page.locator('.jlu-avatar').first().waitFor();
    const initial=await page.locator('#jlu-team-concept-v1').evaluate(r=>({hero:r.querySelector('.jlu-hero').clientHeight,viewport:r.querySelector('.jlu-scroll').clientHeight,people:r.querySelectorAll('.jlu-avatar').length}));
    assert.equal(initial.hero,900);assert.equal(initial.viewport,900);assert.equal(initial.people,28);
    await page.screenshot({path:path.join(folder,'site-cover.png')});
    await page.locator('.jlu-members').evaluate(s=>s.closest('.jlu-scroll').scrollTo({top:s.offsetTop+30,behavior:'instant'}));
    await page.locator('.jlu-carousel').hover();
    await page.locator('.jlu-avatar[data-person-id="jingyi-kang"]').click();
    assert.equal(await page.locator('.jlu-profile-name').textContent(),'Jingyi Kang');
    await page.setViewportSize({width:390,height:844});
    const narrow=await page.locator('.jlu-scroll').evaluate(s=>({width:s.clientWidth,scrollWidth:s.scrollWidth,viewport:s.clientHeight}));
    assert.equal(narrow.viewport,844);assert.equal(narrow.width,narrow.scrollWidth);
    assert.deepEqual(errors,[]);
    const manifest=JSON.parse(fs.readFileSync(path.join(folder,'design-manifest.json'),'utf8'));
    for(const [file,hash]of Object.entries(manifest.productionHashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,file))).digest('hex'),hash);
    const result={url:'http://127.0.0.1:5202/',status:200,initial,narrow,photoClick:'pass',consoleErrors:errors,productionUnchanged:true};
    fs.writeFileSync(path.join(folder,'site-checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  }finally{await context.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
