import type{PatientSex}from'./patients';
import type{LimbRegion,PatientSide}from'./limb-regions';

export type XrayAnatomyRegion='chest'|'abdomen'|'pelvis'|'cervical-spine'|LimbRegion;
export type ModelKind='source-volume'|'segmentation-derived'|'articulated-3d';

export interface XrayAnatomyModel{
 id:string;
 sex:PatientSex;
 region:XrayAnatomyRegion;
 side?:PatientSide;
 manifestUrl:string;
 modelUrl?:string;
 kind:ModelKind;
 structures:string[];
 poseRequired:boolean;
 availability:'ready'|'build-required';
}

// Every radiographic examination resolves to an anatomy-specific 3-D model/volume.
// Missing anatomy is explicit: the renderer must never substitute a whole-body scout.
export const XRAY_ANATOMY_MODELS:XrayAnatomyModel[]=[];

export function xrayModelId(sex:PatientSex,region:XrayAnatomyRegion,side?:PatientSide){
 return `${sex}-${region}${side?`-${side}`:''}`;
}

export function resolveXrayAnatomyModel(sex:PatientSex,region:XrayAnatomyRegion,side?:PatientSide){
 return XRAY_ANATOMY_MODELS.find(m=>m.sex===sex&&m.region===region&&(!side||m.side===side)&&m.availability==='ready')??null;
}

export function expectedXrayAnatomyModel(sex:PatientSex,region:XrayAnatomyRegion,side?:PatientSide):XrayAnatomyModel{
 const limb=['shoulder','humerus','elbow','forearm','wrist','hand','hip','femur','knee','tibia-fibula','ankle','foot'].includes(region);
 return{
  id:xrayModelId(sex,region,side),sex,region,side,
  manifestUrl:`/cases/xray/${sex}/${region}${side?`/${side}`:''}/manifest.json`,
  modelUrl:limb?`/cases/xray/${sex}/${region}/${side??'left'}/model.glb`:undefined,
  kind:limb?'articulated-3d':'segmentation-derived',
  structures:[],poseRequired:true,availability:'build-required'
 };
}

export const REQUIRED_XRAY_MODELS:XrayAnatomyRegion[]=[
 'chest','abdomen','pelvis','cervical-spine',
 'shoulder','humerus','elbow','forearm','wrist','hand',
 'hip','femur','knee','tibia-fibula','ankle','foot'
];
