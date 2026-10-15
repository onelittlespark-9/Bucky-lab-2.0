// Functional X-ray smoke test, NOT validation of the clinical anatomy.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const requests=[],errors=[];
 page.on('request',request=>{
  const path=new URL(request.url()).pathname;
  if(path.startsWith('/cases/'))requests.push(path);
 });
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.BASE_URL??'http://127.0.0.1:4173');
 await page.getByRole('button',{name:'Enter X-ray room'}).click();
 const exams=page.locator('.exam-selection');
 await exams.getByRole('searchbox').fill('chest');
 await exams.locator('.area-card').click();
 await exams.getByRole('button',{name:'Chest PA erect Open positioning workspace'}).click();
 await page.locator('.patient-positioner').waitFor();
 await page.waitForFunction(()=>{
  const el=document.querySelector('.expose-button');
  return el instanceof HTMLButtonElement&&!el.disabled;
 },null,{timeout:60000});
 assert.match(await page.locator('.case-pill').innerText(),/regional CT-derived attenuation/i);
 assert.ok(requests.includes('/cases/regional/male/chest/manifest.json'),'Missing chest regional manifest');
 assert.ok(requests.includes('/cases/regional/male/chest/volume.i16.gz'),'Missing chest regional voxels');
 assert.ok(!requests.includes('/cases/totalseg-s1397/volume.i16.gz'),'Full CT volume loaded in X-ray workspace');
 await page.locator('.expose-button').first().click();
 const canvas=page.locator('.radiograph-stage canvas[data-rendered="true"]');
 await canvas.waitFor({timeout:60000});
 const stats=await canvas.evaluate(el=>{
  const data=el.getContext('2d').getImageData(0,0,el.width,el.height).data;
  const levels=[];for(let i=0;i<data.length;i+=4)levels.push(data[i]);
  levels.sort((a,b)=>a-b);
  return {width:el.width,height:el.height,dynamicRange:levels[Math.floor(levels.length*.9)]-levels[Math.floor(levels.length*.1)],levels:new Set(levels).size};
 });
 assert.ok(stats.width>=100&&stats.height>=100,'No receptor image');
 assert.ok(stats.levels>=20&&stats.dynamicRange>25,'Receptor image lacks grayscale information');
 assert.deepEqual(errors,[],'Browser error during X-ray image acquisition');
 console.log('PA chest regional acquisition and canvas rendering passed',stats);
 await page.close();
}finally{await browser.close()}
