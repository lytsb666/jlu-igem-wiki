const {chromium} = require('C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const folder = __dirname;
const repo = path.resolve(folder, '../../..');
const manifest = JSON.parse(fs.readFileSync(path.join(folder,'design-manifest.json'),'utf8'));
const expectedIds = manifest.membersInPreview.map(p=>p.id);
const errors = [];
const observations = {};

(async()=>{
  const context=await chromium.launchPersistentContext(path.join(repo,'tmp/team-design-browser-profile'),{
    executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,
    viewport:{width:1440,height:900},acceptDownloads:false,deviceScaleFactor:1,
  });
  try {
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto(pathToFileURL(path.join(folder,'preview.html')).href);
    const frame=page.frameLocator('iframe');
    const root=frame.locator('#jlu-team-concept-v1');
    await root.locator('.jlu-avatar').first().waitFor();
    await page.waitForTimeout(400);
    const ids=await root.locator('.jlu-avatar').evaluateAll(nodes=>nodes.map(n=>n.dataset.personId));
    assert.deepEqual(ids,expectedIds);
    assert.equal(await root.locator('.jlu-static-person').count(),15);
    assert.equal(await root.locator('.jlu-heading h2').allTextContents().then(x=>x.join('|')),'Members|PI|Secondary PI|Advisors');
    assert.equal(await root.locator('.jlu-profile-name').textContent(),'Mo Jin');
    assert.equal(await root.locator('.jlu-profile-role').textContent(),'Team Leader');
    observations.people={firstNine:ids.slice(0,9),members:ids.length,faculty:6,advisors:9,unique:43};
    const initial=await root.evaluate(r=>({hero:r.querySelector('.jlu-hero').getBoundingClientRect().height,viewport:r.querySelector('.jlu-scroll').clientHeight}));
    assert.equal(initial.hero,initial.viewport);
    await page.screenshot({path:path.join(folder,'desktop-cover.png')});
    await root.locator('.jlu-scroll').evaluate(s=>s.scrollTo({top:s.clientHeight*.82,behavior:'instant'}));
    await page.waitForTimeout(200);
    const half=await root.evaluate(r=>({hero:r.querySelector('.jlu-hero').getBoundingClientRect().height,viewport:r.querySelector('.jlu-scroll').clientHeight}));
    assert(Math.abs(half.hero-half.viewport*.5)<1);
    await page.screenshot({path:path.join(folder,'desktop-half-cover.png')});
    observations.hero={initial,half};
    await root.locator('.jlu-members').evaluate(s=>s.closest('.jlu-scroll').scrollTo({top:s.offsetTop+35,behavior:'instant'}));
    await root.locator('.jlu-carousel').hover();
    await root.locator('.jlu-avatar[data-person-id="jingyi-kang"]').click();
    assert.equal(await root.locator('.jlu-profile-name').textContent(),'Jingyi Kang');
    await page.waitForTimeout(500);
    await root.locator('.jlu-profile').evaluate(e=>{const s=e.closest('.jlu-scroll');s.scrollTo({top:s.scrollTop+e.getBoundingClientRect().top-s.getBoundingClientRect().top-82,behavior:'instant'});});
    await page.waitForTimeout(100);
    await page.screenshot({path:path.join(folder,'desktop-profile.png')});
    await root.locator('.jlu-next').press('Enter');
    assert.equal(await root.locator('.jlu-profile-name').textContent(),'Zhiyuan Jin');
    assert.equal(await root.locator('.jlu-profile-role').textContent(),'Wet Lab Leader');
    await page.waitForTimeout(500);
    await root.locator('.jlu-contribution summary').click();
    assert.equal(await root.locator('.jlu-task').count(),6);
    await root.locator('.jlu-task').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const desktop=await root.evaluate(r=>{const task=r.querySelector('.jlu-task:last-child').getBoundingClientRect(),viewport=r.querySelector('.jlu-scroll').getBoundingClientRect();return{width:r.clientWidth,scrollWidth:r.querySelector('.jlu-scroll').scrollWidth,clientWidth:r.querySelector('.jlu-scroll').clientWidth,textSize:getComputedStyle(r.querySelector('.jlu-profile-bio')).fontSize,allImagesLoaded:[...r.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0),details:r.querySelector('details').open,lastTask:task.top>=viewport.top+54&&task.bottom<=viewport.bottom};});
    assert.equal(desktop.scrollWidth,desktop.clientWidth);
    assert.equal(desktop.textSize,'16px');
    assert(desktop.allImagesLoaded&&desktop.details&&desktop.lastTask);
    observations.desktop=desktop;
    for(const group of ['Wet Lab','Dry Lab','Human Practices','Hardware & Wiki','Visual Design','All']){
      await root.locator(`.jlu-filter[data-group="${group}"]`).click();
      const count=await root.locator('.jlu-avatar').count();
      observations.filters??={};observations.filters[group]=count;
    }
    assert.equal(observations.filters.All,28);
    await page.setViewportSize({width:390,height:844});
    await root.locator('.jlu-filter[data-group="All"]').click();
    await root.locator('.jlu-next').click();
    await root.locator('.jlu-next').click();
    await page.waitForTimeout(500);
    await root.locator('.jlu-profile').evaluate(e=>{const s=e.closest('.jlu-scroll');s.scrollTo({top:s.scrollTop+e.getBoundingClientRect().top-s.getBoundingClientRect().top-82,behavior:'instant'});});
    await page.waitForTimeout(100);
    const mobile=await root.evaluate(r=>({width:r.clientWidth,scrollWidth:r.querySelector('.jlu-scroll').scrollWidth,clientWidth:r.querySelector('.jlu-scroll').clientWidth,columns:getComputedStyle(r.querySelector('.jlu-profile-layout')).gridTemplateColumns,textSize:getComputedStyle(r.querySelector('.jlu-profile-bio')).fontSize,title:r.querySelector('.jlu-profile-name').textContent}));
    assert.equal(mobile.scrollWidth,mobile.clientWidth);
    assert.equal(mobile.textSize,'16px');
    assert.equal(mobile.title,'Zhiyuan Jin');
    observations.mobile=mobile;
    await page.screenshot({path:path.join(folder,'mobile-profile.png')});
    await root.locator('.jlu-contribution summary').click();
    await root.locator('.jlu-task').last().scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(folder,'mobile-contribution.png')});
    await page.emulateMedia({reducedMotion:'reduce'});
    await root.locator('.jlu-filter[data-group="All"]').click();
    await root.locator('.jlu-next').click();
    const reduced=await root.evaluate(r=>({preference:matchMedia('(prefers-reduced-motion:reduce)').matches,animations:r.querySelector('.jlu-profile').getAnimations().length,scroll:getComputedStyle(r.querySelector('.jlu-scroll')).scrollBehavior}));
    assert(reduced.preference&&reduced.animations===0&&reduced.scroll==='auto');observations.reducedMotion=reduced;
    const touchContext=await context.browser().newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1});
    try {
      const touchPage=await touchContext.newPage();await touchPage.goto(pathToFileURL(path.join(folder,'preview.html')).href);
      const touchRoot=touchPage.frameLocator('iframe').locator('#jlu-team-concept-v1');
      await touchRoot.locator('.jlu-avatar').first().waitFor();
      await touchRoot.locator('.jlu-members').evaluate(s=>s.closest('.jlu-scroll').scrollTo({top:s.offsetTop+35,behavior:'instant'}));
      await touchRoot.locator('.jlu-play').tap();
      await touchRoot.locator('.jlu-avatar[data-person-id="jingyi-kang"]').tap();
      assert.equal(await touchRoot.locator('.jlu-profile-name').textContent(),'Jingyi Kang');
      observations.touch={emulatedTouch:true,selected:'Jingyi Kang',passed:true};
    } finally {await touchContext.close();}
    assert.deepEqual(errors,[]);observations.consoleErrors=errors;
    for(const [file,hash] of Object.entries(manifest.productionHashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,file))).digest('hex'),hash,`Production file changed: ${file}`);
    observations.productionFilesUnchanged=true;
    fs.writeFileSync(path.join(folder,'preview-checks.json'),JSON.stringify(observations,null,2));
    console.log(JSON.stringify(observations,null,2));
  } finally {await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
