export type PatientSide='left'|'right';
export type LimbRegion='shoulder'|'humerus'|'elbow'|'forearm'|'wrist'|'hand'|'hip'|'femur'|'knee'|'tibia-fibula'|'ankle'|'foot';
export interface LimbRegionDefinition{region:LimbRegion;group:'upper'|'lower';bones:string[];softTissueEnvelope:string;defaultSide:PatientSide;requiresArticulation:boolean}
// TotalSegmentator-backed anatomical region definitions. These names are the segmentation inputs
// required by the future articulated volume builder; they are not painted 2-D limb substitutes.
export const LIMB_REGIONS:LimbRegionDefinition[]=[
{region:'shoulder',group:'upper',bones:['clavicula','scapula','humerus'],softTissueEnvelope:'upper_extremity',defaultSide:'left',requiresArticulation:true},
{region:'humerus',group:'upper',bones:['humerus'],softTissueEnvelope:'upper_arm',defaultSide:'left',requiresArticulation:true},
{region:'elbow',group:'upper',bones:['humerus','ulna','radius'],softTissueEnvelope:'elbow',defaultSide:'left',requiresArticulation:true},
{region:'forearm',group:'upper',bones:['ulna','radius'],softTissueEnvelope:'forearm',defaultSide:'left',requiresArticulation:true},
{region:'wrist',group:'upper',bones:['ulna','radius','carpal'],softTissueEnvelope:'wrist',defaultSide:'left',requiresArticulation:true},
{region:'hand',group:'upper',bones:['carpal','metacarpal','phalanges_hand'],softTissueEnvelope:'hand',defaultSide:'left',requiresArticulation:true},
{region:'hip',group:'lower',bones:['hip','femur'],softTissueEnvelope:'hip',defaultSide:'left',requiresArticulation:true},
{region:'femur',group:'lower',bones:['femur'],softTissueEnvelope:'thigh',defaultSide:'left',requiresArticulation:true},
{region:'knee',group:'lower',bones:['femur','patella','tibia','fibula'],softTissueEnvelope:'knee',defaultSide:'left',requiresArticulation:true},
{region:'tibia-fibula',group:'lower',bones:['tibia','fibula'],softTissueEnvelope:'lower_leg',defaultSide:'left',requiresArticulation:true},
{region:'ankle',group:'lower',bones:['tibia','fibula','talus'],softTissueEnvelope:'ankle',defaultSide:'left',requiresArticulation:true},
{region:'foot',group:'lower',bones:['talus','calcaneus','tarsal','metatarsal','phalanges_foot'],softTissueEnvelope:'foot',defaultSide:'left',requiresArticulation:true}
];
export const limbRegion=(region:string)=>LIMB_REGIONS.find(x=>x.region===region.toLowerCase());
