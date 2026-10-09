import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const sources=JSON.parse(await readFile(new URL('../src/core/learning-photo-sources.json',import.meta.url),'utf8'));
const dir=new URL('../public/clinical-reference/',import.meta.url);
await mkdir(dir,{recursive:true});
const sha1=bytes=>createHash('sha1').update(bytes).digest('hex');
const valid=(bytes,item)=>bytes.length>25000&&bytes.length<12000000&&sha1(bytes)===item.sha1&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(const [id,item] of Object.entries(sources)){
 const target=new URL(item.fileName,dir);
 try{const present=await readFile(target);if(valid(present,item)){console.log('Validated local photo',id);continue;}}catch{}
 const name=item.file.replaceAll(' ','_'),hash=createHash('md5').update(name).digest('hex');
 const url='https://upload.wikimedia.org/wikipedia/commons/'+hash[0]+'/'+hash.slice(0,2)+'/'+encodeURIComponent(name);
 let copied=false;
 for(let i=0;i<4;i++){
  try{
   const response=await fetch(url,{headers:{'User-Agent':'BuckyLab2/1.0 (educational sourced illustrations)','Accept':'image/jpeg'},signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw Error('HTTP '+response.status+' from '+url);
   const data=Buffer.from(await response.arrayBuffer());
   if(!valid(data,item))throw Error('Source checksum / JPEG mismatch: '+id);
   await writeFile(target,data);console.log('Imported checked source',id,data.length);copied=true;break;
  }catch(e){console.warn('Download attempt failed',id,i+1,String(e));await pause(1500*(i+1));}
 }
 if(!copied)throw Error('Unable to safely prepare photo '+id);
}
console.log('All three source photos verified.');
