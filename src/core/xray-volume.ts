import{loadVolume,type PatientVolume,type VoxelBounds}from'./volume';
import{PATIENTS,type PatientSex}from'./patients';
import type{PatientSide}from'./limb-regions';
import{resolveExaminationXrayModel,xrayAvailabilityMessage,type XrayAnatomyModel}from'./xray-anatomy';

export interface RegionalGeometry{sourceBounds:VoxelBounds;sourcePatient:{dimensions:[number,number,number]}}
/**
 * Radiography is traced through the canonical source-patient CT, not a detached regional crop.
 * The dedicated regional manifest remains the anatomical registration/availability contract.
 */
export interface XrayVolumeSource{model:XrayAnatomyModel;volume:PatientVolume;regionalGeometry:RegionalGeometry}

/**
 * Resolve the examination's verified regional anatomy, then load the same patient's canonical
 * source CT for projection. This keeps the light field, displayed patient and DRR in one patient
 * coordinate frame: moving the field superiorly/inferiorly genuinely changes the anatomy crossed
 * by the rays instead of recentring an isolated chest crop.
 */
export async function loadExaminationXrayVolume(sex:PatientSex,examinationRegion:string,side?:PatientSide):Promise<XrayVolumeSource>{
 const model=resolveExaminationXrayModel(sex,examinationRegion,side);
 if(!model)throw new Error(xrayAvailabilityMessage(sex,examinationRegion,side));
 const mr=await fetch(model.manifestUrl,{cache:'no-store'});if(!mr.ok)throw new Error(`Regional X-ray manifest unavailable (${mr.status})`);
 const regional=await mr.json() as PatientVolume['manifest'];const coverage=regional.coverage;
 if(!coverage?.sourceBounds||!coverage.sourcePatient)throw new Error(`${examinationRegion}: regional anatomy is not registered to the source patient`);
 const patient=PATIENTS.find(p=>p.sex===sex&&p.availability==='ready');if(!patient)throw new Error(`${sex}: canonical X-ray source patient unavailable`);
 const volume=await loadVolume(`/cases/${patient.caseId}/manifest.json`);
 const[d0,d1,d2]=coverage.sourcePatient.dimensions,[v0,v1,v2]=volume.manifest.dimensions;
 if(d0!==v0||d1!==v1||d2!==v2)throw new Error(`Regional/source geometry mismatch: ${d0}x${d1}x${d2} != ${v0}x${v1}x${v2}`);
 return{model,volume,regionalGeometry:{sourceBounds:coverage.sourceBounds,sourcePatient:{dimensions:coverage.sourcePatient.dimensions}}};
}

export function canExposeExamination(sex:PatientSex,examinationRegion:string,side?:PatientSide){
 return resolveExaminationXrayModel(sex,examinationRegion,side)!==null;
}
