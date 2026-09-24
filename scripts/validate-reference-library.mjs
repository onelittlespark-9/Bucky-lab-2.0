// Run against `npm exec vite -- preview --host 127.0.0.1` after npm run build.
// Requires Playwright with Chromium; PLAYWRIGHT_MODULE can identify an existing installation.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL??'http://127.0.0.1:4173');
 await page.getByRole('button',{name:'Open learning hub'}).click();
 const library=page.locator('.exposure-library'),frame=library.locator('.reference-xray-frame');
 const select=library.locator('select');
 const waitState=state=>page.waitForFunction(s=>document.querySelector('.reference-xray-frame')?.getAttribute('data-state')===s,state);
 const blank=async()=>{
  assert.equal(await frame.locator('canvas').isVisible(),false);
  assert.equal(await frame.locator('canvas').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some(v=>v!==0)),false);
 };
 await waitState('ready');
 assert.equal(await frame.locator('canvas').isVisible(),true);
 assert.equal(await frame.locator('canvas').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some(v=>v!==0)),true);
 await select.selectOption('elbow-ap');await waitState('unavailable');await blank();
 assert.match(await frame.innerText(),/Elbow.*AP[\s\S]*No radiograph has been generated/);
 // A load error must also remove the last successful projection.
 await select.selectOption('chest-pa-erect');await waitState('ready');
 await page.route('**/cases/regional/male/pelvis/manifest.json',route=>route.fulfill({status:503,body:'unavailable'}));
 await select.selectOption('pelvis-ap');await waitState('error');await blank();
 await page.unroute('**/cases/regional/male/pelvis/manifest.json');
 // Hold an available projection's request, change to unavailable anatomy, then release it.
 let release,arrived;
 const gate=new Promise(resolve=>{release=resolve});
 const requestArrived=new Promise(resolve=>{arrived=resolve});
 await page.route('**/cases/regional/male/pelvis/manifest.json',async route=>{arrived();await gate;await route.continue()});
 await select.selectOption('elbow-lateral');await waitState('unavailable');
 await select.selectOption('pelvis-ap');await requestArrived;await waitState('loading');await blank();
 await select.selectOption('elbow-lateral');await waitState('unavailable');
 const response=page.waitForResponse(r=>r.url().includes('/cases/regional/male/pelvis/manifest.json'));
 release();await response;await page.waitForLoadState('networkidle');
 assert.equal(await frame.getAttribute('data-state'),'unavailable');await blank();
 assert.match(await frame.innerText(),/Elbow.*Lateral/);
 await page.unroute('**/cases/regional/male/pelvis/manifest.json');
 // Recovery is possible; unavailable status is not sticky.
 await select.selectOption('pelvis-ap');await waitState('ready');
 assert.equal(await frame.locator('canvas').isVisible(),true);
 assert.equal(await library.getByText('IDEAL GENERATED RADIOGRAPH',{exact:true}).count(),0);
 assert.deepEqual(errors,[]);
 console.log('Reference library: ready → unavailable, failed load, pending load, stale completion and recovery passed.');
}finally{await browser.close()}
