const {chromium} = require('C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path'); const fs = require('node:fs');
const repo = path.resolve(__dirname, '../../..');
(async () => {
  const context = await chromium.launchPersistentContext(path.join(repo, 'tmp/team-formal-browser-profile'), {headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', viewport:{width:1440,height:900}});
  try {
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => {if (m.type() === 'error') errors.push(m.text())});
    await page.goto('http://127.0.0.1:5202/Team/member.html');
    await page.locator('.team-avatar').first().waitFor();
    await page.waitForFunction(() => !document.querySelector('#igem-loader'));
    await page.screenshot({path:path.join(__dirname,'formal-desktop-cover.png')});
    console.log(JSON.stringify(await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,hero:document.querySelector('.team-hero').clientHeight,cue:document.querySelector('.team-scroll-cue').getBoundingClientRect().toJSON(),headlineColor:getComputedStyle(document.querySelector('.team-hero h1')).color,headings:[...document.querySelectorAll('.team-section-heading h2')].map(h=>({text:h.textContent,cls:h.className,alignment:getComputedStyle(h).textAlign,font:getComputedStyle(h).fontSize}))})),null,2));
    await page.locator('#team-directory').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
    await page.mouse.move(0,0);
    await page.screenshot({path:path.join(__dirname,'formal-desktop-members.png')});
    await page.setViewportSize({width:390,height:844});
    await page.locator('#team-directory').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
    await page.screenshot({path:path.join(__dirname,'formal-mobile-members.png')});
    console.log(JSON.stringify({errors,mobile:await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,font:getComputedStyle(document.querySelector('.team-profile-bio')).fontSize,visible:[...document.querySelectorAll('.team-avatar')].filter(b=>getComputedStyle(b).visibility==='visible').map(b=>b.dataset.memberId)}))},null,2));
  } finally {await context.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
