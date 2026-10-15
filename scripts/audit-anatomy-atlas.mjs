// Offline asset audit. A named mesh is only a candidate, never proof of anatomical completeness.
import {readFileSync} from 'node:fs';
const file=process.argv[2];
if(!file)throw new Error('Usage: node scripts/audit-anatomy-atlas.mjs /path/to/source.glb');
const bytes=readFileSync(file);
if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2)throw new Error('Expected glTF 2 GLB');
if(bytes.readUInt32LE(8)!==bytes.length||bytes.readUInt32LE(16)!==0x4e4f534a)throw new Error('Invalid GLB length or JSON chunk');
const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
const names=(gltf.nodes??[]).map(n=>n.name??'');
const requirements={ribs:/\brib\b|_rib[s_]|costae/i,sternum:/sternum/i,clavicles:/clavic/i,scapulae:/scapul/i,thoracicVertebrae:/thoracic_vertebra/i,lungs:/lungs/i,heart:/heart/i,skin:/_skin$/i};
const candidates=Object.fromEntries(Object.entries(requirements).map(([key,re])=>[key,names.filter(n=>re.test(n))]));
const missing=Object.entries(candidates).filter(([,v])=>!v.length).map(([k])=>k);
console.log(JSON.stringify({file,bytes:bytes.length,meshCount:gltf.meshes?.length??0,skinningRigs:gltf.skins?.length??0,missingNamedThoracicStructures:missing,candidates,readyForRadiographicSimulation:false,reason:'Names do not validate watertight tissue volumes, full skeletal coverage, material properties, anatomical registration or coupled articulation.'},null,2));
// This script intentionally does not approve any atlas for clinical teaching.
