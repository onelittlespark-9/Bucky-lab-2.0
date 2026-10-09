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
  assert.equal(await hub.locator('.learning-card-preview').count(),8);
  for(const image of await hub.locator('.learning-card-preview').all()){
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async img=>{if(!img.complete)await new Promise((ok,bad)=>{img.addEventListener('load',ok,{once:true});img.addEventListener('error',bad,{once:true});});if(img.naturalWidth===0)throw Error(`Missing learning card: ${img.src}`);});
  }
  assert.equal(await hub.locator('article, .exposure-library').count(),0);
  const titles=await hub.locator('.area-card strong').allTextContents();
  for(const title of titles){
   await hub.getByRole('button',{name:title,exact:false}).click();
   assert.equal(await hub.locator('h1').innerText(),title);
   assert.equal(await hub.locator('canvas, .reference-patient').count(),0);
   if(title!=='Pathology search strategy'&&title!=='Examination reference'){
    const examples=hub.locator('.learning-example-image');
    assert.equal(await examples.count(),2,`Expected two examples for ${title}`);
    for(const image of await examples.all()){
     await image.scrollIntoViewIfNeeded();
     await image.evaluate(async img=>{
      if(!(img instanceof HTMLImageElement))throw new Error('Not an image');
      if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true});});
      if(img.naturalWidth===0)throw new Error(`Missing learning image: ${img.src}`);
     });
     assert.ok((await image.getAttribute('alt')).length>20);
    }
   }
   assert.equal(await hub.locator('.area-card').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(title==='Examination reference'){
    const library=hub.locator('.exposure-library'),select=library.locator('select');
    const projections=await select.locator('option').evaluateAll(options=>options.map(o=>o.value));
    for(const id of projections){
     await select.selectOption(id);
     const realIds=["elbow-ap","elbow-lateral","wrist-pa","wrist-lateral","hand-pa","hand-oblique","knee-ap","knee-lateral","foot-dp","foot-oblique","foot-lateral"];
     const isReal=realIds.includes(id);
     const expected=isReal?[]:[`/reference/${id}-position.svg`,`/reference/${id}-collimation.svg`];
     if(isReal){
      const img=library.locator(`img[data-clinical-reference="${id}"]`);
      assert.equal(await img.count(),1,`Missing verified projection ${id}`);
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(async element=>{
       if(!element.complete)await new Promise((resolve,reject)=>{element.addEventListener('load',resolve,{once:true});element.addEventListener('error',reject,{once:true});});
       if(element.naturalWidth<250||element.naturalHeight<250)throw Error('Missing or low-resolution radiograph: '+element.src);
      });
      assert.match(await library.locator('.reference-real-figure figcaption').innerText(),/radiographic anatomy/);
      assert.equal(await library.locator('.reference-position-steps').count(),1);
     }
     assert.equal(await library.locator('canvas').count(),0);
     assert.equal(await library.locator('.reference-illustration img').count(),expected.length);
     for(const src of expected){
      const img=library.locator(`img[src="${src}"]`);
      await img.scrollIntoViewIfNeeded();
      await page.waitForFunction(path=>{
       const element=document.querySelector(`img[src="${path}"]`);
       return element instanceof HTMLImageElement && element.complete && element.naturalWidth>0;
      },src);
      assert.match(await img.getAttribute('alt'),/diagram|schematic/i);
     }
     assert.equal(await library.locator('.reference-image-missing').count(),0);
     assert.ok((await library.locator('.reference-summary').innerText()).length>30);
    }
    await select.selectOption('elbow-lateral');
    assert.match(await library.innerText(),/90/);
    await select.selectOption('chest-pa-erect');
    assert.equal(await select.inputValue(),'chest-pa-erect');
   }
   if(title==='Pathology search strategy'){
    const select=hub.getByLabel('Pathology',{exact:true});
    const cases=[['pneumothorax','pneumothorax.jpg',877,807],['pleural-effusion','pleural-effusion.png',1030,871],['intracranial-haemorrhage','intracranial-haemorrhage.jpg',1200,1484]];
    for(const [id,file,width,height] of cases){
     await select.selectOption(id);
     const frame=hub.locator('.pathology-image-frame');
     await page.waitForFunction(()=>document.querySelector('.pathology-image-frame')?.dataset.state==='ready');
     assert.equal(await frame.locator('img').getAttribute('src'),`/pathology/${file}`);
     assert.deepEqual(await frame.locator('img').evaluate(i=>[i.naturalWidth,i.naturalHeight]),[width,height]);
     assert.equal(await hub.getByRole('button',{name:'Reveal findings'}).getAttribute('aria-expanded'),'false');
     assert.equal(await hub.locator('.pathology-guidance').count(),0);
     await hub.getByRole('button',{name:'Reveal findings'}).click();
     assert.equal(await hub.getByRole('heading',{name:'Findings in this image'}).isVisible(),true);
     const explanation=hub.locator('.learning-pathology-visual img');
     assert.equal(await explanation.count(),1);
     assert.equal(await explanation.getAttribute('src'),`/learning/pathology-${id}.svg`);
     await explanation.evaluate(async img=>{if(!img.complete)await new Promise((ok,bad)=>{img.addEventListener('load',ok,{once:true});img.addEventListener('error',bad,{once:true});});if(img.naturalWidth===0)throw Error('Missing pathology explanatory diagram');});
     assert.equal(await hub.locator('.pathology-credit a').count()>0,true);
     await hub.getByRole('button',{name:'Enlarge image'}).click();
     assert.equal(await page.getByRole('dialog').isVisible(),true);
     assert.equal(await page.getByRole('dialog').locator('img').getAttribute('src'),`/pathology/${file}`);
     await page.keyboard.press('Escape');
     assert.equal(await page.getByRole('dialog').count(),0);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    // A failed image must not leave another diagnosis's image visible; retry must recover.
    await page.route('**/pathology/pleural-effusion.png',route=>route.fulfill({status:503,body:'unavailable'}));
    await select.selectOption('pleural-effusion');
    await hub.getByRole('alert').waitFor();
    assert.equal(await hub.locator('.pathology-image-frame img').count(),0);
    assert.equal(await hub.getByRole('button',{name:'Enlarge image'}).isDisabled(),true);
    await page.unroute('**/pathology/pleural-effusion.png');
    await hub.getByRole('button',{name:'Retry image'}).click();
    await page.waitForFunction(()=>document.querySelector('.pathology-image-frame')?.dataset.state==='ready');
    // A late response from a previous selection cannot replace the current image.
    let release,arrived;
    const gate=new Promise(r=>{release=r}),requested=new Promise(r=>{arrived=r});
    await page.route('**/pathology/pneumothorax.jpg',async route=>{arrived();await gate;await route.continue()});
    await select.selectOption('pneumothorax');await requested;
    await select.selectOption('intracranial-haemorrhage');
    release();await page.waitForLoadState('networkidle');
    assert.equal(await hub.locator('.pathology-image-frame img').getAttribute('src'),'/pathology/intracranial-haemorrhage.jpg');
    await page.unroute('**/pathology/pneumothorax.jpg');
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
  console.log(`Learning areas, pathology images/reveal/enlargement/error recovery, projection-specific positioning schematics and exam navigation passed (${viewport.width}px).`);
  await page.close();
 }
}finally{await browser.close()}
