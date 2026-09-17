import type{PatientSex}from'./patients';
import type{LimbRegion,PatientSide}from'./limb-regions';
import{limbRegion}from'./limb-regions';
export type XrayAnatomyRegion='chest'|'abdomen'|'pelvis'|'cervical-spine'|'thoracic-spine'|'lumbar-spine'|LimbRegion;
export type ModelKind='source-volume'|'segmentation-derived'|'articulated-3d';
export interface XrayAnatomyModel{id:string;sex:PatientSex;region:XrayAnatomyRegion;side?:PatientSide;manifestUrl:string;modelUrl?:string;kind:ModelKind;structures:string[];poseRequired:boolean;availability:'ready'|'build-required'}
const regional=(region:XrayAnatomyRegion,side?:PatientSide):XrayAnatomyModel=>{const path=side?`${region}-${side}`:region;return{id:xrayModelId('male',region,side),sex:'male',region,side,manifestUrl:`/cases/regional/male/${path}/manifest.json`,kind:'segmentation-derived',structures:[],poseRequired:true,availability:'ready'}};
// This list mirrors successfully published regional HU assets. Never add a ready entry until its
// manifest/volume exists: radiography must fail closed rather than substitute the whole-body patient.
export const XRAY_ANATOMY_MODELS:XrayAnatomyModel[]=[regional('chest'),regional('abdomen'),regional('pelvis'),regional('cervical-spine'),regional('thoracic-spine'),regional('lumbar-spine'),regional('shoulder','left'),regional('shoulder','right'),regional('humerus','left'),regional('humerus','right'),regional('hip','left'),regional('hip','right'),regional('femur','left'),regional('femur','right')];
export function xrayModelId(sex:PatientSex,region:XrayAnatomyRegion,side?:PatientSide){return`${sex}-${region}${side?`-${side}`:''}`}
export function resolveXrayAnatomyModel(sex:PatientSex,region:XrayAnatomyRegion,side?:PatientSide){return XRAY_ANATOMY_MODELS.find(m=>m.sex===sex&&m.region===region&&(!side||m.side===side)&&m.availability==='ready')??null}
export function expectedXrayAnatomyModel(sex:PatientSex,region:XrayAnatomyRegion,side?:PatientSide):XrayAnatomyModel{const limb=['shoulder','humerus','elbow','forearm','wrist','hand','hip','femur','knee','tibia-fibula','ankle','foot'].includes(region),path=side?`${region}-${side}`:region;return{id:xrayModelId(sex,region,side),sex,region,side,manifestUrl:`/cases/regional/${sex}/${path}/manifest.json`,modelUrl:limb?`/cases/xray/${sex}/${region}/${side??'left'}/model.glb`:undefined,kind:limb?'articulated-3d':'segmentation-derived',structures:[],poseRequired:true,availability:'build-required'}}
export const REQUIRED_XRAY_MODELS:XrayAnatomyRegion[]=['chest','abdomen','pelvis','cervical-spine','thoracic-spine','lumbar-spine','shoulder','humerus','elbow','forearm','wrist','hand','hip','femur','knee','tibia-fibula','ankle','foot'];

/** Convert the examination catalogue's human-readable region into the canonical anatomy key. */
export function xrayRegionForExamination(region:string):XrayAnatomyRegion|null{
 const key=region.trim().toLowerCase().replace(/\s+/g,'-').replace('/','-');
 const aliases:Record<string,XrayAnatomyRegion>={'cervical-spine':'cervical-spine','thoracic-spine':'thoracic-spine','lumbar-spine':'lumbar-spine','tibia-fibula':'tibia-fibula','tibia-fibula-':'tibia-fibula'};
 if(key in aliases)return aliases[key];
 if((REQUIRED_XRAY_MODELS as string[]).includes(key))return key as XrayAnatomyRegion;
 return null;
}

/** Resolve exactly one dedicated regional source for an examination. There is deliberately no
 * PatientVolume/whole-body fallback in this API. Unknown or unbuilt anatomy returns null. */
export function resolveExaminationXrayModel(sex:PatientSex,examinationRegion:string,side?:PatientSide):XrayAnatomyModel|null{
 const region=xrayRegionForExamination(examinationRegion);if(!region)return null;
 const limb=limbRegion(region);const requiredSide=limb?(side??limb.defaultSide):undefined;
 return resolveXrayAnatomyModel(sex,region,requiredSide);
}

export function xrayAvailabilityMessage(sex:PatientSex,examinationRegion:string,side?:PatientSide){
 const region=xrayRegionForExamination(examinationRegion);if(!region)return`${examinationRegion}: no dedicated radiographic anatomy definition.`;
 const limb=limbRegion(region),resolvedSide=limb?(side??limb.defaultSide):undefined,model=resolveXrayAnatomyModel(sex,region,resolvedSide);
 if(model)return`${examinationRegion}${resolvedSide?` · ${resolvedSide}`:''}: dedicated regional anatomy ready.`;
 return`${examinationRegion}${resolvedSide?` · ${resolvedSide}`:''}: dedicated ${sex} regional anatomy is not yet available. Exposure is disabled rather than substituting whole-body anatomy.`;
}
