import{loadVolume,type PatientVolume,type VoxelBounds}from'./volume';
import{PATIENTS,type PatientSex}from'./patients';
import type{PatientSide}from'./limb-regions';
import{resolveExaminationXrayModel,xrayAvailabilityMessage,type XrayAnatomyModel}from'./xray-anatomy';

export interface SourcePatientAnchors{headZ:number;pelvisZ:number;leftShoulderX:number;rightShoulderX:number}
export interface RegionalGeometry{sourceBounds:VoxelBounds;sourcePatient:{dimensions:[number,number,number]};sourceAnchors:SourcePatientAnchors}
export interface XrayVolumeSource{model:XrayAnatomyModel;volume:PatientVolume;regionalGeometry:RegionalGeometry}

const centre=(b:VoxelBounds,axis:'x'|'y'|'z')=>(b[axis+'0' as keyof VoxelBounds]+b[axis+'1' as keyof VoxelBounds])/2;
function sourceAnchors(v:PatientVolume):SourcePatientAnchors{
 const pick=(names:string[])=>v.regions.filter(r=>names.includes(r.region));
 const avg=(regions:typeof v.regions,axis:'x'|'z',fallback:number)=>regions.length?regions.reduce((n,r)=>n+centre(r.bounds,axis),0)/regions.length:fallback;
 const[dX,,dZ]=v.manifest.dimensions;
 const head=pick(['skull','brain']),pelvis=pick(['hip_left','hip_right','sacrum']);
 const leftShoulder=pick(['clavicula_left','scapula_left','humerus_left']),rightShoulder=pick(['clavicula_right','scapula_right','humerus_right']);
 return{headZ:avg(head,'z',dZ-1),pelvisZ:avg(pelvis,'z',0),leftShoulderX:avg(leftShoulder,'x',dX*.35),rightShoulderX:avg(rightShoulder,'x',dX*.65)};
}

/**
 * Load the canonical patient CT and keep the examination's verified regional registration.
 * Screen-to-CT targeting is then landmark registered rather than inferred from arbitrary stage
 * percentages or from an isolated crop.
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
 return{model,volume,regionalGeometry:{sourceBounds:coverage.sourceBounds,sourcePatient:{dimensions:coverage.sourcePatient.dimensions},sourceAnchors:sourceAnchors(volume)}};
}

export function canExposeExamination(sex:PatientSex,examinationRegion:string,side?:PatientSide){return resolveExaminationXrayModel(sex,examinationRegion,side)!==null}
