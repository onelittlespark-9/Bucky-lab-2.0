import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const entries=JSON.parse(await readFile(new URL('../src/core/anatomy-image-sources.json',import.meta.url),'utf8'));
const target=new URL('../public/clinical-reference/',import.meta.url);
await mkdir(target,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const sha1=data=>createHash('sha1').update(data).digest('hex');
const valid=(data,source)=>{
 if(data.length<30000||data.length>10000000)return false;
 if(sha1(data)!==source.sha1)return false;
 if(source.type==='jpeg')return data[0]===255&&data[1]===216&&data[2]===255;
 if(source.type==='png')return data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 return false;
};
for(const [id,source] of Object.entries(entries)){
 const dest=new URL(source.fileName,target);
 try{
  const existing=await readFile(dest);
  if(valid(existing,source)){console.log('Locally verified '+id);continue;}
 }catch{}
 const filename=source.file.replaceAll(' ','_');
 const hash=createHash('md5').update(filename).digest('hex');
 const url='https://upload.wikimedia.org/wikipedia/commons/'+hash[0]+'/'+hash.slice(0,2)+'/'+encodeURIComponent(filename);
 let success=false;
 for(let i=0;i<4;i++){
  try{
   const response=await fetch(url,{headers:{'User-Agent':'BuckyLab2/1.0 (educational anatomy learning)','Accept':'image/*'},signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw Error('HTTP '+response.status+' for '+id);
   const bytes=Buffer.from(await response.arrayBuffer());
   if(!valid(bytes,source))throw Error('Checksum or image format mismatch: '+id);
   await writeFile(dest,bytes);
   success=true;console.log('Downloaded and SHA-1-verified '+id+' '+bytes.length+' bytes');break;
  }catch(error){console.warn('Attempt '+(i+1)+' failed '+id+': '+error);await pause(1100*(i+1));}
 }
 if(!success)throw Error('Cannot prepare required clinical anatomy asset '+id);
}
console.log('All '+Object.keys(entries).length+' real anatomy Learning assets validated.');
