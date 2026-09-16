export type PatientStance='erect'|'supine'|'prone'|'seated'|'decubitus';
export type DetectorOrientation='portrait'|'landscape';
export interface JointPose{flexion?:number;abduction?:number;rotation?:number}
export interface FullBodyPose{stance:PatientStance;bodyYaw:number;bodyPitch:number;bodyRoll:number;headRotation:number;headExtension:number;leftShoulder:JointPose;rightShoulder:JointPose;leftElbow:JointPose;rightElbow:JointPose;leftHip:JointPose;rightHip:JointPose;leftKnee:JointPose;rightKnee:JointPose;notes:string[]}
export interface StartingField{left:number;right:number;top:number;bottom:number;centreX:number;centreY:number}
export interface ExposurePreset{kVp:number;mAs:number;sidCm:number}
export interface RadiographicPosition{id:string;region:string;projection:string;detector:DetectorOrientation;beam:'horizontal'|'vertical';tubeAngleDeg:number;startingField:StartingField;pose:FullBodyPose;referenceBasis:string;exposure:ExposurePreset}
const neutral=(stance:PatientStance='erect'):FullBodyPose=>({stance,bodyYaw:0,bodyPitch:0,bodyRoll:0,headRotation:0,headExtension:0,leftShoulder:{},rightShoulder:{},leftElbow:{},rightElbow:{},leftHip:{},rightHip:{},leftKnee:{},rightKnee:{},notes:[]});
const field=(centreY=0):StartingField=>({left:28,right:28,top:28,bottom:28,centreX:0,centreY});
const pos=(id:string,region:string,projection:string,exposure:ExposurePreset,pose:FullBodyPose=neutral('supine'),detector:DetectorOrientation='portrait',beam:'horizontal'|'vertical'='vertical',tubeAngleDeg=0,startingField=field(),notes:string[]=[]):RadiographicPosition=>({id,region,projection,detector,beam,tubeAngleDeg,startingField,pose:{...pose,notes:[...pose.notes,...notes]},referenceBasis:'Educational radiographic positioning preset; verify against local departmental technique charts.',exposure});
export const RADIOGRAPHIC_POSITIONS:RadiographicPosition[]=[
pos('chest-pa-erect','Chest','PA erect',{kVp:110,mAs:2,sidCm:180},neutral('erect'),'portrait','horizontal',0,{left:18,right:18,top:18,bottom:39,centreX:0,centreY:18},['Anterior chest against detector','Shoulders rolled forward','Chin clear of apices']),
pos('chest-lateral-erect','Chest','Lateral erect',{kVp:120,mAs:4,sidCm:180},{...neutral('erect'),bodyYaw:90,leftShoulder:{flexion:180},rightShoulder:{flexion:180}},'portrait','horizontal'),
pos('abdomen-ap-supine','Abdomen','AP supine',{kVp:75,mAs:20,sidCm:100},neutral('supine')),
pos('pelvis-ap','Pelvis','AP',{kVp:75,mAs:20,sidCm:100},{...neutral('supine'),leftHip:{rotation:-15},rightHip:{rotation:15}},'landscape'),
pos('cspine-ap','Cervical spine','AP',{kVp:70,mAs:10,sidCm:110},neutral('erect'),'portrait','horizontal'),
pos('cspine-lateral','Cervical spine','Lateral erect',{kVp:70,mAs:12,sidCm:150},{...neutral('erect'),bodyYaw:90},'portrait','horizontal'),
pos('skull-ap','Skull','AP',{kVp:75,mAs:16,sidCm:100},neutral('supine')),
pos('skull-lateral','Skull','Lateral',{kVp:70,mAs:12,sidCm:100},{...neutral('supine'),bodyYaw:90}),
pos('shoulder-ap','Shoulder','AP',{kVp:65,mAs:8,sidCm:100},neutral('erect'),'portrait','horizontal'),
pos('humerus-ap','Humerus','AP',{kVp:60,mAs:6,sidCm:100}),pos('humerus-lateral','Humerus','Lateral',{kVp:60,mAs:6,sidCm:100},{...neutral('supine'),leftShoulder:{rotation:90}}),
pos('elbow-ap','Elbow','AP',{kVp:55,mAs:4,sidCm:100}),pos('elbow-lateral','Elbow','Lateral',{kVp:55,mAs:4,sidCm:100},{...neutral('seated'),leftElbow:{flexion:90}}),
pos('forearm-ap','Forearm','AP',{kVp:55,mAs:3,sidCm:100}),pos('forearm-lateral','Forearm','Lateral',{kVp:55,mAs:3,sidCm:100},{...neutral('seated'),leftElbow:{flexion:90}}),
pos('wrist-pa','Wrist','PA',{kVp:55,mAs:2.5,sidCm:100},neutral('seated')),pos('wrist-lateral','Wrist','Lateral',{kVp:55,mAs:2.5,sidCm:100},neutral('seated')),
pos('hand-pa','Hand','PA',{kVp:52,mAs:2,sidCm:100},neutral('seated')),pos('hand-oblique','Hand','Oblique',{kVp:52,mAs:2,sidCm:100},neutral('seated')),
pos('hip-ap','Hip','AP',{kVp:75,mAs:16,sidCm:100},neutral('supine')),
pos('femur-ap','Femur','AP',{kVp:70,mAs:10,sidCm:100}),pos('femur-lateral','Femur','Lateral',{kVp:70,mAs:12,sidCm:100},{...neutral('supine'),bodyYaw:90}),
pos('knee-ap','Knee','AP',{kVp:60,mAs:5,sidCm:100}),pos('knee-lateral','Knee','Lateral',{kVp:60,mAs:5,sidCm:100},{...neutral('decubitus'),bodyYaw:90,leftKnee:{flexion:30}}),
pos('tibfib-ap','Tibia/fibula','AP',{kVp:60,mAs:5,sidCm:100}),pos('tibfib-lateral','Tibia/fibula','Lateral',{kVp:60,mAs:5,sidCm:100},{...neutral('supine'),bodyYaw:90}),
pos('ankle-ap','Ankle','AP',{kVp:55,mAs:3,sidCm:100}),pos('ankle-mortise','Ankle','Mortise',{kVp:55,mAs:3,sidCm:100},{...neutral('supine'),leftHip:{rotation:-15}}),pos('ankle-lateral','Ankle','Lateral',{kVp:55,mAs:3,sidCm:100},{...neutral('supine'),bodyYaw:90}),
pos('foot-dp','Foot','DP',{kVp:55,mAs:3,sidCm:100}),pos('foot-oblique','Foot','Oblique',{kVp:55,mAs:3,sidCm:100},{...neutral('supine'),leftHip:{rotation:30}}),pos('foot-lateral','Foot','Lateral',{kVp:55,mAs:3,sidCm:100},{...neutral('supine'),bodyYaw:90})
];
export function positionsForRegion(region:string){return RADIOGRAPHIC_POSITIONS.filter(p=>p.region.toLowerCase()===region.toLowerCase())}
