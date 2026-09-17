import{loadVolume,type PatientVolume}from'./volume';
import type{PatientSex}from'./patients';
import type{PatientSide}from'./limb-regions';
import{resolveExaminationXrayModel,xrayAvailabilityMessage,type XrayAnatomyModel}from'./xray-anatomy';

/** A resolved radiographic source. The API intentionally cannot return a whole-body fallback. */
export interface XrayVolumeSource{model:XrayAnatomyModel;volume:PatientVolume}

/**
 * Resolve and load the dedicated regional HU volume for a radiographic examination.
 *
 * This is deliberately fail-closed. If an examination/sex/side has no published regional
 * anatomy, no PatientVolume is returned and callers must disable exposure. This prevents the
 * previous whole-body scout behaviour from silently re-entering the DRR pipeline.
 */
export async function loadExaminationXrayVolume(sex:PatientSex,examinationRegion:string,side?:PatientSide):Promise<XrayVolumeSource>{
 const model=resolveExaminationXrayModel(sex,examinationRegion,side);
 if(!model)throw new Error(xrayAvailabilityMessage(sex,examinationRegion,side));
 const volume=await loadVolume(model.manifestUrl);
 return{model,volume};
}

/** Useful to UI code before beginning an asynchronous load. */
export function canExposeExamination(sex:PatientSex,examinationRegion:string,side?:PatientSide){
 return resolveExaminationXrayModel(sex,examinationRegion,side)!==null;
}
