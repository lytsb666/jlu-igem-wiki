/* Browser acceptance against the real built site, not the design mockup. */
const {chromium} = require('C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path'), fs = require('node:fs'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const evidence = {url:'http://127.0.0.1:5202/Team/member.html', date:'2026-10-13', sizes:[], consoleErrors:[], failedResources:[]};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const settle = page => page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
async function center(page, selector) {await page.locator(selector).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'})); await settle(page)}
async function ensureNoOverflow(page) {
  const sizes = await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.equal(sizes.document,sizes.viewport); assert.equal(sizes.body,sizes.viewport); return sizes;
}
const xOf = (page,id) => page.locator(`.team-avatar[data-member-id="${id}"]`).evaluate(e=>e.getBoundingClientRect().x);
async function selectByArrows(page,id) {
  for(let i=0;i<29;i++) {
    if(await page.locator('.team-profile').getAttribute('data-member-id') === id) return;
    await page.locator('.team-next').click();
  }
  throw new Error(`Cannot reach ${id}`);
}
function watch(page) {
  page.on('pageerror', e=>evidence.consoleErrors.push(String(e)));
  page.on('console', message=>{if(message.type()==='error') evidence.consoleErrors.push(message.text())});
  page.on('response', response=>{if(response.status()>=400) evidence.failedResources.push({url:response.url(),status:response.status()})});
  page.on('requestfailed', request=>evidence.failedResources.push({url:request.url(),failure:request.failure()}));
}
async function runSize(page, width, height, source) {
  await page.setViewportSize({width,height});
  await page.goto(evidence.url); await page.locator('.team-avatar').first().waitFor();
  await page.waitForFunction(()=>!document.querySelector('#igem-loader'));
  await page.mouse.move(0,0);
  const initial = await page.evaluate(()=>({hero:document.querySelector('.team-hero').clientHeight,order:[...document.querySelectorAll('.team-avatar')].map(e=>e.dataset.memberId),headings:[...document.querySelectorAll('.team-section-heading h2')].map(e=>e.textContent),cue:document.querySelector('.team-scroll-cue').getBoundingClientRect().toJSON(),font:getComputedStyle(document.querySelector('.team-profile-bio')).fontSize}));
  assert.equal(initial.hero,height); assert.equal(initial.order.length,28); assert.equal(new Set(initial.order).size,28);
  assert.deepEqual(initial.order.slice(0,9),['mo-jin','jingyi-kang','zhiyuan-jin','ziyan-qin','yujia-yang','wenxian-gao','tonghui-yin','xiaojie-meng','chen-xing']);
  assert.deepEqual(initial.headings,['Members','PI','Secondary PI','Advisors']); assert.equal(initial.font,'16px');
  assert.equal(await page.getByRole('button',{name:/pause|play/i}).count(),0);
  assert.equal(await page.locator('.team-jumps,#leader-grid,[role="dialog"]').count(),0);
  await ensureNoOverflow(page);
  await page.screenshot({path:path.join(__dirname,`formal-${width}-cover.png`)});
  await page.evaluate(h=>window.scrollTo({top:h*.8,behavior:'instant'}),height); await settle(page);
  assert.equal(await page.locator('.team-hero').evaluate(e=>e.clientHeight),height/2);
  await page.screenshot({path:path.join(__dirname,`formal-${width}-half-cover.png`)});

  const groups = {All:28,'Wet Lab':6,'Dry Lab':4,'Human Practices':8,'Hardware & Wiki':4,'Visual Design':6};
  const groupResults = {};
  for(const [group,count] of Object.entries(groups)) {
    await center(page,'.team-filters');
    await page.locator(`.team-filter[data-filter="${group}"]`).click();
    await page.mouse.move(0,0);
    const state = await page.locator('.team-carousel').evaluate(e=>({
      total:e.querySelectorAll('.team-avatar').length,
      firstCenter:(()=>{const b=e.querySelector('.team-avatar').getBoundingClientRect();return b.left+b.width/2})(),
      center:(()=>{const b=e.getBoundingClientRect();return b.left+b.width/2})(),
      visible:[...e.querySelectorAll('.team-avatar')].filter(b=>getComputedStyle(b).visibility==='visible').length,
    }));
    assert.equal(state.total,count); assert(Math.abs(state.firstCenter-state.center)<6,`${group} must start from center`); assert(state.visible<=6);
    assert.equal(await page.locator(`.team-filter[data-filter="${group}"]`).getAttribute('aria-pressed'),'true');
    groupResults[group]=state;
    if(group==='Human Practices') {
      const seen = new Set();
      for(let i=0;i<count;i++) {seen.add(await page.locator('.team-profile').getAttribute('data-member-id')); await page.locator('.team-next').click()}
      assert.equal(seen.size,8,'HP must not lose two people under the six-visible limit');
    }
    await ensureNoOverflow(page);
  }
  await center(page,'.team-filters'); await page.locator('.team-filter[data-filter="All"]').click();
  await center(page,'.team-carousel'); await page.mouse.move(0,0);
  const firstX=await xOf(page,'mo-jin'); await sleep(1100); const movingX=await xOf(page,'mo-jin');
  assert(firstX-movingX>25,'Portraits must move continuously');
  // A real pointer can enter a moving photo; disable Playwright's unrelated
  // "wait until motion stops" precondition and still dispatch real mouse input.
  await page.locator('.team-avatar[data-member-id="mo-jin"] .member-photo').hover({force:true});
  await sleep(100); const hoverX=await xOf(page,'mo-jin'); await sleep(550);
  assert(Math.abs(hoverX-await xOf(page,'mo-jin'))<1,'Photo hover must stop portraits');
  await page.mouse.move(5,(await page.locator('.team-carousel').boundingBox()).y+35);
  const whitespaceX=await xOf(page,'mo-jin'); await sleep(550);
  assert(whitespaceX-await xOf(page,'mo-jin')>10,'Whitespace hover must not stop portraits');
  await page.locator('.team-avatar[data-member-id="mo-jin"] .member-photo').click({force:true});
  assert.equal(await page.locator('#selected-member-name').textContent(),'Mo Jin');
  assert.equal(await page.locator('.team-profile-return').evaluate(e=>e===document.activeElement),true);
  assert.equal(await page.locator('.team-profile-role').textContent(),'Team Leader');
  const dealing = await page.locator('.team-profile').evaluate(e=>e.getAnimations().length);
  await sleep(480); await ensureNoOverflow(page);
  const backRect=await page.locator('.team-profile-return').boundingBox();
  await page.mouse.move(backRect.x+backRect.width/2,backRect.y+backRect.height/2);
  const readingX=await xOf(page,'mo-jin');await sleep(550);
  assert(readingX-await xOf(page,'mo-jin')>10,'Reading the displayed profile must not pause a visible strip');
  await page.screenshot({path:path.join(__dirname,`formal-${width}-member-profile.png`)});
  const href=page.url(); await page.keyboard.press('Escape');
  assert.equal(await page.locator('.team-deck').evaluate(e=>e.hidden),true);
  assert.equal(await page.locator('.team-avatar[data-member-id="mo-jin"]').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Enter'); assert.equal(await page.locator('.team-deck').evaluate(e=>e.hidden),false);
  await page.locator('.team-profile-return').click();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.team-avatar[data-member-id="jingyi-kang"]').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Space'); assert.equal(await page.locator('#selected-member-name').textContent(),'Jingyi Kang');
  await page.keyboard.press('Escape');
  await page.keyboard.press('End'); assert.equal(await page.locator('.team-avatar').last().evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Home'); assert.equal(await page.locator('.team-avatar').first().evaluate(e=>e===document.activeElement),true);
  await page.mouse.move(0,0);const focusX=await xOf(page,'mo-jin');await sleep(550);
  assert(focusX-await xOf(page,'mo-jin')>10,'Keyboard focus must not pause portraits');
  assert.equal(page.url(),href,'Portrait interaction must remain on this page');

  await selectByArrows(page,'zhiyuan-jin');
  const longSource=source.teamMembers.find(p=>p.id==='zhiyuan-jin');
  assert.equal(await page.locator('.team-profile .team-profile-bio').textContent(),longSource.introduction);
  await center(page,'.team-contribution-host summary'); await page.locator('.team-contribution-host summary').click();
  assert.equal(await page.locator('.team-contribution-host .team-task').count(),longSource.tasks.length);
  assert.deepEqual(await page.locator('.team-contribution-host .team-task p').allTextContents(),longSource.tasks.map(t=>t.detail));
  assert.equal(await page.locator('.team-profile .team-profile-bio').evaluate(e=>getComputedStyle(e).fontSize),'16px');
  const longSize=await page.locator('.team-profile').evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight}));
  assert(longSize.height>height); assert(Math.abs(longSize.height-longSize.scroll)<2,'Long text must be in flow, not clipped');
  await center(page,'.team-contribution-host .team-profile-end');
  assert(await page.locator('.team-contribution-host .team-profile-end').isVisible());
  await ensureNoOverflow(page); await page.screenshot({path:path.join(__dirname,`formal-${width}-long-contribution.png`)});
  assert.equal(await page.locator('.team-contribution-host details').evaluate(e=>e.open),true,'Reading must not dismiss profile');
  await page.locator('.team-profile-return').click();
  assert.equal(await page.locator('.team-avatar[data-member-id="zhiyuan-jin"]').evaluate(e=>e===document.activeElement),true);

  assert.equal(await page.locator('#pi-grid .team-static-person').count(),3);
  assert.equal(await page.locator('#secondary-pi-grid .team-static-person').count(),3);
  assert.equal(await page.locator('#advisor-grid .team-static-person').count(),9);
  assert.equal(await page.locator('.team-static-person .member-card__role,.team-static-person .team-profile-role').count(),0);
  assert.equal(await page.locator('[data-member-id="pi-pang-bo"] .team-faculty-note').textContent(),'Judge for the 2026 iGEM Competition');
  assert.equal(await page.locator('[data-member-id="pi-li-jinhua"] .team-faculty-note').textContent(),'Instructor of the 2025 iGEM Gold Medal-Winning Team with Two Nominations');
  await center(page,'#pi-grid'); await page.screenshot({path:path.join(__dirname,`formal-${width}-pi.png`)});
  const advisor=page.locator('.team-static-person[data-member-id="luozhao-wang"]');
  await center(page,'.team-static-person[data-member-id="luozhao-wang"]');
  await advisor.locator('.team-advisor-photo').click();
  assert.equal(await advisor.locator('.team-advisor-reading').evaluate(e=>e.hidden),false);
  await advisor.locator('summary').click();
  const advisorSource=source.teamMembers.find(p=>p.id==='luozhao-wang');
  assert.deepEqual(await advisor.locator('.team-task p').allTextContents(),advisorSource.tasks.map(t=>t.detail));
  await ensureNoOverflow(page); await page.keyboard.press('Escape');
  assert.equal(await advisor.locator('.team-advisor-reading').evaluate(e=>e.hidden),true);
  assert.equal(await advisor.locator('.team-advisor-photo').evaluate(e=>e===document.activeElement),true);

  await page.emulateMedia({reducedMotion:'reduce'});
  await center(page,'.team-filters'); await page.locator('.team-filter[data-filter="All"]').click(); await center(page,'.team-carousel'); await page.mouse.move(0,0);
  const reduceX=await xOf(page,'mo-jin'); await sleep(550); assert.equal(await xOf(page,'mo-jin'),reduceX);
  await page.locator('.team-avatar[data-member-id="mo-jin"]').click({force:true});
  assert.equal(await page.locator('.team-profile').evaluate(e=>e.getAnimations().length),0);
  assert.equal(await page.locator('.team-scroll-cue i').evaluate(e=>getComputedStyle(e,'::after').animationName),'none');
  assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).scrollBehavior),'auto');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await ensureNoOverflow(page);
  evidence.sizes.push({width,height,initial,groupResults,continuousScrolling:true,photoOnlyHoverPause:true,dealingAnimationObserved:dealing>0,keyboardAndFocusReturn:true,longSourceTasks:longSource.tasks.length,longSize,advisorReadingAndFocus:true,reducedMotion:true,horizontalOverflow:0});
}

(async()=>{
  const source=await import(require('node:url').pathToFileURL(path.join(repo,'Team/member-data.js')).href);
  const context=await chromium.launchPersistentContext(path.join(repo,'tmp/team-formal-browser-profile'),{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:900}});
  try {
    const page=await context.newPage(); watch(page);
    await runSize(page,1440,900,source); await runSize(page,390,844,source);
    // Exercise every source member and advisor: no biography, quote or task
    // becomes unreachable when moving from the old cards to the new layout.
    await page.emulateMedia({reducedMotion:'reduce'}); await center(page,'.team-filters'); await page.locator('.team-filter[data-filter="All"]').click();
    const allOrder=await page.locator('.team-avatar').evaluateAll(nodes=>nodes.map(n=>n.dataset.memberId));
    let taskCount=0;
    for(const id of allOrder) {
      const person=source.teamMembers.find(p=>p.id===id);
      await selectByArrows(page,id);
      assert.equal(await page.locator('.team-profile .team-profile-bio').textContent(),person.introduction);
      if(person.quote) assert.equal(await page.locator('.team-profile .team-profile-quote').textContent(),`“${person.quote}”`);
      assert.equal(await page.locator('.team-profile-role').textContent(),source.memberPresentation.leaders.find(p=>p.id===id)?.role||person.role);
      assert.deepEqual(await page.locator('.team-contribution-host .team-task p').allTextContents(),person.tasks.map(t=>t.detail));
      taskCount+=person.tasks.length;
    }
    for(const person of source.teamMembers.filter(p=>p.groups.includes('Advisors'))) {
      const card=page.locator(`.team-static-person[data-member-id="${person.id}"]`);
      await card.locator('.team-advisor-photo').click();
      assert.equal(await card.locator('.team-profile-bio').textContent(),person.introduction);
      assert.deepEqual(await card.locator('.team-task p').allTextContents(),person.tasks.map(t=>t.detail));
      taskCount+=person.tasks.length; await card.locator('.team-advisor-return').click();
    }
    assert.equal(taskCount,186); evidence.all37ProfilesAnd186TasksReachable=true;

    // Sample several seconds of a fully populated group; never render seven.
    await page.emulateMedia({reducedMotion:'no-preference'}); await page.setViewportSize({width:1440,height:900});
    await center(page,'.team-filters'); await page.locator('.team-filter[data-filter="All"]').click();
    await page.locator('.team-next').click(); await page.locator('.team-next').click();
    await center(page,'.team-carousel'); await page.mouse.move(0,0);
    let maximumVisible=0;
    for(let i=0;i<12;i++){await sleep(200);const count=await page.locator('.team-avatar').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).visibility==='visible').length); maximumVisible=Math.max(maximumVisible,count);assert(count<=6)}
    assert.equal(maximumVisible,6);evidence.maximumVisible=maximumVisible;

    // Check actual bytes at the built image URLs, including the two faculty
    // original framing copies, and all responsive cover resolutions.
    const builtHashes=new Map(fs.readdirSync(path.join(repo,'dist/client/assets')).filter(f=>/\.(webp|jpg)$/.test(f)).map(f=>[sha(fs.readFileSync(path.join(repo,'dist/client/assets',f))),f]));
    const requests=[];
    for(const person of [...source.teamMembers,...source.teamFaculty]) {
      const sourcePath=path.resolve(repo,'Team',person.framingPhoto||person.photo);
      const bytes=fs.readFileSync(sourcePath), builtFile=builtHashes.get(sha(bytes)); assert(builtFile,person.id);
      const displayedImage=person.groups.includes('PI')||person.groups.includes('Secondary PI')||person.groups.includes('Advisors')
        ? page.locator(`.team-static-person[data-member-id="${person.id}"] img`)
        : page.locator(`.team-avatar[data-member-id="${person.id}"] img`);
      const actualUrl=await displayedImage.evaluate(img=>img.src);
      assert.equal(new URL(actualUrl).pathname,`/assets/${builtFile}`,`${person.id} must display their own source-mapped photo`);
      const response=await context.request.get(actualUrl);
      assert.equal(response.status(),200); assert.equal(sha(await response.body()),sha(bytes)); requests.push({id:person.id,url:response.url(),status:200});
    }
    const cover=JSON.parse(fs.readFileSync(path.join(repo,'assets/team-member/cover/manifest.json'),'utf8'));
    for(const image of cover.webCopies){const f=builtHashes.get(image.sha256);assert(f); const r=await context.request.get(`http://127.0.0.1:5202/assets/${f}`);assert.equal(r.status(),200);assert.equal(sha(await r.body()),image.sha256)}
    evidence.builtImageRequests=requests;evidence.responsiveCovers=cover.webCopies.length;

    const touch=await context.browser().newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1});
    const touchPage=await touch.newPage(); watch(touchPage); await touchPage.goto(evidence.url);
    await touchPage.waitForFunction(()=>!document.querySelector('#igem-loader'));
    await center(touchPage,'.team-filters'); await touchPage.locator('.team-filter[data-filter="Dry Lab"]').tap();
    await center(touchPage,'.team-carousel');
    await touchPage.locator('.team-avatar[data-member-id="ziyan-qin"] .member-photo').tap({force:true});
    assert.equal(await touchPage.locator('#selected-member-name').textContent(),'Ziyan Qin');
    await touchPage.locator('.team-contribution-host summary').tap();
    await center(touchPage,'.team-contribution-host .team-profile-end'); await ensureNoOverflow(touchPage);
    await touchPage.locator('.team-profile-return').tap();
    assert.equal(await touchPage.locator('.team-avatar[data-member-id="ziyan-qin"]').evaluate(e=>e===document.activeElement),true);
    evidence.touchEmulation=true;await touch.close();
    assert.deepEqual(evidence.consoleErrors,[]);assert.deepEqual(evidence.failedResources,[]);
    fs.writeFileSync(path.join(__dirname,'formal-checks.json'),JSON.stringify(evidence,null,2)+'\n');
    console.log(JSON.stringify({sizes:evidence.sizes.map(s=>({width:s.width,height:s.height,longSize:s.longSize})),all37ProfilesAnd186TasksReachable:true,maximumVisible,touch:true,builtPortraits:requests.length,responsiveCovers:3,errors:[]},null,2));
  } finally {await context.close()}
})().catch(error=>{console.error(error);fs.writeFileSync(path.join(__dirname,'formal-checks-failed.json'),JSON.stringify({...evidence,failure:String(error)},null,2));process.exitCode=1});
