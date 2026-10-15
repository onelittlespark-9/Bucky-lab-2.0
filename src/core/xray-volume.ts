import {loadVolume,type PatientVolume,type VoxelBounds} from './volume';
import {PATIENTS,type PatientSex} from './patients';
import type {PatientSide} from './limb-regions';
import {resolveExaminationXrayModel,xrayAvailabilityMessage,type XrayAnatomyModel} from './xray-anatomy';

export interface SourcePatientAnchors {headZ:number;pelvisZ:number;leftShoulderX:number;rightShoulderX:number}
export interface RegionalGeometry {sourceBounds:VoxelBounds;sourcePatient:{dimensions:[number,number,number]};sourceAnchors:SourcePatientAnchors}
export interface XrayVolumeSource {model:XrayAnatomyModel;volume:PatientVolume;regionalGeometry:RegionalGeometry}

const midpoint=(b:VoxelBounds,axis:'x'|'z')=>(b[`${axis}0`]+b[`${axis}1`])/2;

/**
 * Load landmark positions from the canonical patient's labelled segmentation metadata.
 * Importantly, this does not download the canonical whole-body CT voxel payload.
 * The MakeHuman surface is not yet a segmented internal attenuation atlas.
 */
async function loadSourceAnchors(caseId:string,sourceDimensions:readonly number[]):Promise<SourcePatientAnchors> {
 const response=await fetch(`/cases/${caseId}/regions.json`,{cache:'no-store'});
 if(!response.ok)throw new Error(`X-ray atlas landmark metadata unavailable (${response.status})`);
 const data=await response.json() as {regions?:Record<string,{bounds?:VoxelBounds}>};
 if(!data.regions)throw new Error('X-ray landmark segmentation metadata is missing');
 const pick=(names:string[],axis:'x'|'z')=>{
  const bounds=names.map(name=>data.regions?.[name]?.bounds).filter((b):b is VoxelBounds=>!!b);
  if(!bounds.length)throw new Error(`X-ray source landmark missing: ${names.join('/')}`);
  for(const b of bounds){
   if(![b.x0,b.x1,b.y0,b.y1,b.z0,b.z1].every(Number.isFinite)||
      b.x0<0||b.y0<0||b.z0<0||
      b.x1>=sourceDimensions[0]||b.y1>=sourceDimensions[1]||b.z1>=sourceDimensions[2]||
      b.x0>b.x1||b.y0>b.y1||b.z0>b.z1)
    throw new Error('X-ray source landmark lies outside the canonical anatomy');
  }
  return bounds.reduce((sum,b)=>sum+midpoint(b,axis),0)/bounds.length;
 };
 return {
  headZ:pick(['skull','brain'],'z'),
  pelvisZ:pick(['hip_left','hip_right','sacrum'],'z'),
  leftShoulderX:pick(['clavicula_left','scapula_left','humerus_left'],'x'),
  rightShoulderX:pick(['clavicula_right','scapula_right','humerus_right'],'x')
 };
}

/** Validate a regional source before using its voxel array in the X-ray attenuation solver. */
export function assertDedicatedXrayVolume(volume:PatientVolume,expectedRegion:string):void {
 const {coverage,dimensions,spacingMm}=volume.manifest;
 if(!coverage?.sourceBounds||!coverage.sourcePatient)
  throw new Error(`${expectedRegion}: missing regional anatomical registration`);
 if(coverage.region!==expectedRegion)
  throw new Error(`${expectedRegion}: incorrect dedicated volume (${coverage.region})`);
 const b=coverage.sourceBounds,source=coverage.sourcePatient;
 const shape=[b.x1-b.x0+1,b.y1-b.y0+1,b.z1-b.z0+1];
 if(!shape.every((size,i)=>size===dimensions[i])||
    ![b.x0,b.y0,b.z0].every(Number.isInteger)||
    ![b.x1,b.y1,b.z1].every(Number.isInteger)||
    b.x0<0||b.y0<0||b.z0<0||
    b.x1>=source.dimensions[0]||b.y1>=source.dimensions[1]||b.z1>=source.dimensions[2])
  throw new Error(`${expectedRegion}: regional attenuation voxels are not registered to the source patient`);
 if(!spacingMm.every((mm,i)=>Math.abs(mm-source.spacingMm[i])<.00001))
  throw new Error(`${expectedRegion}: incompatible regional/source voxel spacing`);
 if(volume.hu.length!==dimensions[0]*dimensions[1]*dimensions[2])
  throw new Error(`${expectedRegion}: missing regional attenuation voxels`);
}

/**
 * Use the examination-specific registered attenuation volume, NOT the whole-body CT payload.
 * The HU voxels remain CT-derived material data for educational DRRs; they are not the
 * displayed rig's internal anatomy. True rig-coupled attenuation is a separate roadmap gap.
 */
export async function loadExaminationXrayVolume(sex:PatientSex,examinationRegion:string,side?:PatientSide):Promise<XrayVolumeSource> {
 const model=resolveExaminationXrayModel(sex,examinationRegion,side);
 if(!model)throw new Error(xrayAvailabilityMessage(sex,examinationRegion,side));
 const patient=PATIENTS.find(p=>p.sex===sex&&p.availability==='ready');
 if(!patient)throw new Error(`${sex}: canonical X-ray source patient unavailable`);
 const volume=await loadVolume(model.manifestUrl);
 assertDedicatedXrayVolume(volume,model.region);
 const coverage=volume.manifest.coverage!;
 const sourceAnchors=await loadSourceAnchors(patient.caseId,coverage.sourcePatient!.dimensions);
 return {model,volume,regionalGeometry:{
  sourceBounds:coverage.sourceBounds,
  sourcePatient:{dimensions:coverage.sourcePatient!.dimensions},
  sourceAnchors
 }};
}
export function canExposeExamination(sex:PatientSex,examinationRegion:string,side?:PatientSide){
 return resolveExaminationXrayModel(sex,examinationRegion,side)!==null;
}
