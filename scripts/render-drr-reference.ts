import{mkdir,readFile,writeFile}from'node:fs/promises';
import{gunzipSync}from'node:zlib';
import{resolve}from'node:path';
import{projectVolume,type ProjectionOptions}from'../src/core/drr';
import{createTeachingVolume}from'../src/core/teaching-volume';
import type{PatientVolume,VolumeManifest}from'../src/core/volume';
import{RADIOGRAPHIC_POSITIONS}from'../src/core/radiographic-positions';

const root=resolve(import.meta.dirname,'..'),caseDir=resolve(root,'public/cases/regional/male/chest'),outputDir=resolve(process.argv[2]??'/tmp/bucky-drr-validation');
const manifest=JSON.parse(await readFile(resolve(caseDir,'manifest.json'),'utf8'))as VolumeManifest;
const packed=await readFile(resolve(caseDir,'volume.i16.gz')),raw=gunzipSync(packed),view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength),hu=new Int16Array(raw.byteLength/2);
for(let i=0;i<hu.length;i++)hu[i]=view.getInt16(i*2,true);
const source:PatientVolume={manifest,hu,regions:[]},volume=createTeachingVolume(source,'real-source');
const chestPa=RADIOGRAPHIC_POSITIONS.find(position=>position.id==='chest-pa-erect')!,base:ProjectionOptions={view:'PA',stepVoxels:2,kVp:125,mAs:2,sidCm:180,rotationDeg:0,collimation:chestPa.startingField,centreXPercent:chestPa.startingField.centreX,centreYPercent:chestPa.startingField.centreY,tubeAngleDeg:0,detectorWidthCm:35,detectorHeightCm:43,seed:17};
const cases:Record<string,ProjectionOptions>={
 'pa-reference':base,
 'rotation-12deg':{...base,rotationDeg:12},
 'off-centre':{...base,centreXPercent:16,centreYPercent:-12},
 'tight-collimation':{...base,collimation:{left:18,right:18,top:15,bottom:15}},
 'short-sid':{...base,sidCm:100},
 'low-mas':{...base,mAs:.5},
 'high-mas':{...base,mAs:8},
 'low-kvp':{...base,kVp:80},
 'high-kvp':{...base,kVp:145},
};
await mkdir(outputDir,{recursive:true});
for(const[name,options]of Object.entries(cases)){
 const image=projectVolume(volume,options),header=`P5\n${image.width} ${image.height}\n255\n`;
 await writeFile(resolve(outputDir,`${name}.pgm`),Buffer.concat([Buffer.from(header),Buffer.from(image.pixels)]));
 console.log(`${name}: ${image.width}x${image.height}; magnification=${image.exposure.magnification.toFixed(4)}; photons=${image.exposure.incidentPhotons.toFixed(0)}`);
}
console.log(`Rendered DRR validation set to ${outputDir}`);
