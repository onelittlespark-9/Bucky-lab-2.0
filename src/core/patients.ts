import type{SimulatedPathology,VoxelTransform}from'./teaching-volume';
export type PatientSex='male'|'female';
export interface PatientProfile{id:string;label:string;sex:PatientSex;caseId:string;availability:'ready'|'source-required';notes:string}
export const PATIENTS:PatientProfile[]=[
{id:'male-s1397',label:'Adult male',sex:'male',caseId:'totalseg-s1397',availability:'ready',notes:'TotalSegmentator s1397 source-derived anatomy.'},
{id:'female-reference',label:'Adult female',sex:'female',caseId:'female-reference',availability:'source-required',notes:'Female reference volume slot. Must use a genuine/validated female volumetric source rather than geometrically altering male anatomy.'}
];
export type PathologyId='none'|'pneumothorax'|'pleural-effusion'|'consolidation'|'pulmonary-nodule'|'rib-fracture'|'renal-calculus'|'aortic-aneurysm'|'intracranial-haemorrhage';
export interface PathologyDefinition{id:PathologyId;label:string;regions:string[];modalities:('CT'|'X-ray')[];description:string}
export const PATHOLOGIES:PathologyDefinition[]=[
{id:'none',label:'Normal / no simulated pathology',regions:['all'],modalities:['CT','X-ray'],description:'Unmodified teaching volume.'},
{id:'pneumothorax',label:'Pneumothorax',regions:['chest'],modalities:['CT','X-ray'],description:'Volumetric pleural-air simulation.'},
{id:'pleural-effusion',label:'Pleural effusion',regions:['chest'],modalities:['CT','X-ray'],description:'Dependent pleural-fluid simulation.'},
{id:'consolidation',label:'Pulmonary consolidation',regions:['chest'],modalities:['CT','X-ray'],description:'Regional airspace-density simulation.'},
{id:'pulmonary-nodule',label:'Pulmonary nodule',regions:['chest'],modalities:['CT','X-ray'],description:'Focal pulmonary soft-tissue lesion.'},
{id:'rib-fracture',label:'Rib fracture',regions:['chest','trauma'],modalities:['CT','X-ray'],description:'Cortical discontinuity teaching simulation.'},
{id:'renal-calculus',label:'Urinary calculus',regions:['kub','abdomen-pelvis'],modalities:['CT','X-ray'],description:'High-attenuation urinary-tract calculus.'},
{id:'aortic-aneurysm',label:'Aortic aneurysm',regions:['aorta','cap','abdomen-pelvis'],modalities:['CT'],description:'Aortic calibre/pathology teaching case.'},
{id:'intracranial-haemorrhage',label:'Intracranial haemorrhage',regions:['head','trauma'],modalities:['CT'],description:'Hyperattenuating acute haemorrhage teaching simulation.'}
];
// Pathology transforms are intentionally registered separately from source anatomy. Final transforms
// must be segmentation/anatomy constrained; generic geometric lesions are not accepted as reference quality.
export interface PathologyBuild{metadata:SimulatedPathology;transforms:VoxelTransform[]}
export function pathologyBuild(id:PathologyId):PathologyBuild{const d=PATHOLOGIES.find(x=>x.id===id)??PATHOLOGIES[0];return{metadata:{id:d.id,label:d.label,category:'simulated pathology',targetRegion:d.regions.join(', '),parameters:{referenceQuality:'segmentation-constrained-required'},provenance:{kind:'simulated',method:'Bucky Lab volumetric teaching transform'}},transforms:[]}}
