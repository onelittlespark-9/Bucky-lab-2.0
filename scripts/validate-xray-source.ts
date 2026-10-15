import {loadExaminationXrayVolume,assertDedicatedXrayVolume} from '../src/core/xray-volume';
import type {PatientVolume,VolumeManifest} from '../src/core/volume';

const sourceDimensions:[number,number,number]=[160,160,273];
const bounds={x0:27,x1:30,y0:27,y1:30,z0:84,z1:87};
const sourceBounds=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number)=>({bounds:{x0,x1,y0,y1,z0,z1}});
const regions={regions:{
 skull:sourceBounds(50,105,45,100,220,260),brain:sourceBounds(52,100,47,97,223,255),
 hip_left:sourceBounds(30,70,40,90,30,65),hip_right:sourceBounds(90,130,40,90,30,65),
 sacrum:sourceBounds(65,90,50,82,28,55),
 clavicula_left:sourceBounds(43,72,50,78,168,183),
 scapula_left:sourceBounds(38,73,46,82,156,185),
 humerus_left:sourceBounds(30,56,50,90,120,166),
 clavicula_right:sourceBounds(89,117,50,78,168,183),
 scapula_right:sourceBounds(88,121,46,82,156,185),
 humerus_right:sourceBounds(102,130,50,90,120,166)
}};
const manifest:VolumeManifest={
 version:1,caseId:'totalseg-s1397-chest',encoding:'int16-le',
 dimensions:[4,4,4],spacingMm:[3,3,3],
 volumeUrl:'/cases/regional/male/chest/volume.i16',huRange:[-1024,3071],
 source:{name:'Regression fixture',record:'synthetic',doi:'',case:'s1397',patientType:'synthetic',licence:'test'},
 canonical:{orientation:'fixture',voxelOrder:'x-fastest',sourceAffine:[]},
 coverage:{region:'chest',sourceBounds:bounds,
  sourcePatient:{dimensions:sourceDimensions,spacingMm:[3,3,3],originMm:[0,0,0]},
  structures:['lung_upper_lobe_left'],method:'verified-segmentation-bounds',modalities:['xray-drr']}
};
const voxels=new ArrayBuffer(4*4*4*2),dataView=new DataView(voxels);
for(let i=0;i<64;i++)dataView.setInt16(i*2,i%3===0?650:0,true);
const requests:string[]=[];
let mismatch=false;
Object.defineProperty(globalThis,'location',{configurable:true,value:{href:'http://localhost:4173/'}});
globalThis.fetch=async (input:RequestInfo|URL)=>{
 const path=String(input);requests.push(path);
 if(path==='/cases/regional/male/chest/manifest.json')
  return Response.json({...manifest,coverage:{...manifest.coverage,sourcePatient:{
   ...manifest.coverage!.sourcePatient,dimensions:mismatch?[28,160,273]:sourceDimensions
  }}});
 if(path==='/cases/regional/male/chest/volume.i16')
  return new Response(voxels,{headers:{'content-type':'application/octet-stream'}});
 if(path==='/cases/totalseg-s1397/regions.json')return Response.json(regions);
 throw new Error(`Unexpected X-ray request: ${path}`);
};
const loaded=await loadExaminationXrayVolume('male','Chest');
if(loaded.volume.hu.length!==64||loaded.volume.manifest.caseId!=='totalseg-s1397-chest')
 throw new Error('X-ray must use dedicated regional CT-derived attenuation voxels, not the whole-body CT');
if(!loaded.regionalGeometry.sourceAnchors.headZ||
 loaded.regionalGeometry.sourceAnchors.headZ<=loaded.regionalGeometry.sourceAnchors.pelvisZ||
 loaded.regionalGeometry.sourceAnchors.leftShoulderX>=loaded.regionalGeometry.sourceAnchors.rightShoulderX)
 throw new Error('Source-patient atlas landmark registration is invalid');
if(requests.some(path=>path.includes('/cases/totalseg-s1397/volume')))
 throw new Error('X-ray loader unexpectedly fetched full-body CT payload');
if(!requests.includes('/cases/regional/male/chest/volume.i16'))
 throw new Error('X-ray loader never loaded the selected examination region');
const bad={...loaded.volume,manifest:{...loaded.volume.manifest,coverage:{
 ...loaded.volume.manifest.coverage!,sourceBounds:{...bounds,x1:31}
}}} as PatientVolume;
let caught=false;
try{assertDedicatedXrayVolume(bad,'chest')}catch{caught=true}
if(!caught)throw new Error('Unregistered attenuation crops must be rejected');
mismatch=true; caught=false;
try{await loadExaminationXrayVolume('male','Chest')}catch{caught=true}
if(!caught)throw new Error('Region/source spacing or geometry mismatch must fail closed');
console.log('Validated X-ray dedicated regional loading, anatomy anchors, CT isolation and fail-closed registration.');
