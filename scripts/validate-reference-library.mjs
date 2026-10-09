// Run against a built Vite preview. Covers the learning and examination entry flows.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  const errors=[], anatomyRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/\/cases\/|\.glb|\/references\//.test(r.url()))anatomyRequests.push(r.url())});
  await page.goto(process.env.BASE_URL??'http://127.0.0.1:4173');
  await page.getByRole('button',{name:'Open learning hub'}).click();
  const hub=page.locator('.learning-hub');
  assert.equal(await hub.locator('.area-card').count(),8);
  assert.equal(await hub.locator('article, .exposure-library').count(),0);
  const titles=await hub.locator('.area-card strong').allTextContents();
  for(const title of titles){
   await hub.getByRole('button',{name:title,exact:false}).click();
   assert.equal(await hub.locator('h1').innerText(),title);
   assert.equal(await hub.locator('img, canvas, .reference-patient').count(),0);
   assert.equal(await hub.locator('.area-card').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(title==='Examination reference'){
    const library=hub.locator('.exposure-library'),select=library.locator('select');
    const projections=await select.locator('option').evaluateAll(options=>options.map(o=>o.value));
    for(const id of projections){
     await select.selectOption(id);
     assert.equal(await library.locator('img, canvas').count(),0);
     assert.ok((await library.locator('.reference-summary').innerText()).length>30);
    }
    await select.selectOption('elbow-lateral');
    assert.match(await library.innerText(),/90/);
    await select.selectOption('chest-pa-erect');
    assert.equal(await select.inputValue(),'chest-pa-erect');
   }
   await hub.getByRole('button',{name:'All learning areas'}).click();
  }
  assert.deepEqual(anatomyRequests,[],'Learning must not load model/reference/CT assets');
  // The anatomy practice link must enter examination selection as well.
  await hub.getByRole('button',{name:'Radiographic anatomy'}).click();
  await hub.getByRole('button',{name:'Choose an X-ray examination'}).click();
  const exams=page.locator('.exam-selection');
  assert.equal(await exams.isVisible(),true);
  assert.equal(await page.locator('.patient-positioner, canvas').count(),0);
  await exams.getByRole('searchbox').fill('no-matching-exam');
  assert.match(await exams.getByRole('status').innerText(),/No examinations match/);
  await exams.getByRole('searchbox').fill('elbow');
  await exams.locator('.area-card').click();
  assert.equal(await exams.locator('.area-card').count(),2);
  assert.match(await exams.locator('.availability-note').innerText(),/Exposure is unavailable/);
  await exams.getByRole('button',{name:'All examinations'}).click();
  await exams.getByRole('searchbox').fill('chest');
  await exams.locator('.area-card').click();
  // Avoid downloading large assets: navigation and selected projection are the assertion.
  await page.route('**/cases/**',route=>route.abort());
  await exams.getByRole('button',{name:'Chest PA erect Open positioning workspace'}).click();
  await page.waitForSelector('.patient-positioner');
  assert.equal(await page.locator('.lab-heading h1').innerText(),'Chest · PA erect');
  await page.getByRole('button',{name:'Change examination'}).click();
  assert.equal(await exams.isVisible(),true);
  assert.equal(await page.locator('.patient-positioner').count(),0);
  await page.getByRole('button',{name:'CT',exact:true}).click();
  await page.getByRole('button',{name:'Radiography',exact:true}).click();
  assert.equal(await exams.isVisible(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  console.log(`Learning areas, all reference projections without images, exam selection and return navigation passed (${viewport.width}px).`);
  await page.close();
 }
}finally{await browser.close()}
