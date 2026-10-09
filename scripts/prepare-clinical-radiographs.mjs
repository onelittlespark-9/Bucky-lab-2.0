// Downloads only individually reviewed, CC0 radiographs. CI fails on missing or invalid assets.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
const entries=JSON.parse(await readFile(new URL('../src/core/real-radiograph-manifest.json',import.meta.url),'utf8'));
const output=new URL('../public/clinical-reference/',import.meta.url);
await mkdir(output,{recursive:true});
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
async function one(id,meta){
 const dest=new URL(id+'.jpg',output);
 try{
  const old=await readFile(dest);
  if(old.length>=20000 && old[0]===255 && old[1]===216 && old[2]===255){console.log('Verified existing',id,old.length);return;}
 }catch{}
 const name=meta.file.replaceAll(' ','_');
 const digest=createHash('md5').update(name).digest('hex');
 const url='https://upload.wikimedia.org/wikipedia/commons/'+digest[0]+'/'+digest.slice(0,2)+'/'+encodeURIComponent(name);
 let lastError;
 for(let attempt=0;attempt<4;attempt++){
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{'User-Agent':'BuckyLab2/1.0 (educational radiography reference; https://github.com/onelittlespark-9/Bucky-lab-2.0)','Accept':'image/jpeg'}});
   if(!response.ok)throw Error('HTTP '+response.status);
   if(!(response.headers.get('content-type')||'').includes('image/'))throw Error('Unexpected content type');
   const data=Buffer.from(await response.arrayBuffer());
   if(data.length<20000||data.length>12_000_000||data[0]!==255||data[1]!==216||data[2]!==255)throw Error('Invalid or implausible JPEG image');
   await writeFile(dest,data);
   console.log('Downloaded verified JPEG',id,data.length,url);
   return;
  }catch(e){lastError=e;console.warn('Retry',id,attempt+1,String(e));await wait((attempt+1)*1200);}
 }
 throw Error('Required reviewed image '+id+' unavailable: '+String(lastError));
}
for(const [id,meta] of Object.entries(entries))await one(id,meta);
for(const id of Object.keys(entries)){
 const s=await stat(new URL(id+'.jpg',output));
 if(s.size<20000)throw Error('Missing/invalid reference: '+id);
}
console.log('Verified '+Object.keys(entries).length+' projection-specific real radiographs.');
