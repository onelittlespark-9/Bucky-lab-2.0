import type{RadiographicPosition}from'./radiographic-positions';

export type CritiqueLevel='good'|'review'|'repeat-risk';
export interface TechniqueSnapshot{rotationDeg:number;beamX:number;beamY:number;field:{left:number;right:number;top:number;bottom:number};tubeAngleDeg:number;kVp:number;mAs:number;sidCm:number}
export interface CritiqueItem{category:'positioning'|'centring'|'collimation'|'exposure'|'anatomy';level:CritiqueLevel;title:string;feedback:string}
export interface CritiqueResult{score:number;level:CritiqueLevel;items:CritiqueItem[];criteria:string[]}

const CRITERIA:Record<string,string[]>={
 'Chest|PA':['SC joints equidistant from the spinous processes','10th or 11th posterior ribs visible above the diaphragm','Scapulae clear of the lung fields','Lung apices through costophrenic angles included'],
 'Chest|Lateral':['Posterior ribs and costophrenic angles superimposed within 1 cm','Humeri and arm soft tissues clear of the lung apices','Central ray centred to the midthorax around T7'],
 'Hand|PA':['Symmetric concavity of phalangeal and metacarpal shafts','IP and MCP joint spaces open','Digits slightly separated without soft-tissue overlap'],
 'Wrist|PA':['Wrist, forearm and elbow in the same horizontal plane','Distal radioulnar and radiocarpal joints open','No radial or ulnar deviation'],
 'Forearm|AP':['Radius and ulna parallel with minimal shaft superimposition','Elbow and wrist joints both included','Humeral epicondyles parallel to the receptor'],
 'Elbow|AP':['Humeroulnar and humeroradial joint spaces open','Epicondyles non-rotated','Only slight proximal-ulna superimposition of radial head/neck'],
 'Shoulder|AP - External Rotation':['Greater tuberosity in profile laterally','Humeral head only slightly overlaps the glenoid','Lesser tuberosity anterior/medial'],
 'Shoulder|AP - Internal Rotation':['Lesser tuberosity in profile medially','Greater tuberosity superimposed over the humeral head'],
 'Foot|AP Axial':['First-second metatarsal space open with 2nd-5th mostly closed','CR 10° posterior, centred to base of third metatarsal'],
 'Ankle|AP Mortise':['Entire ankle mortise open','15–20° internal rotation'],
 'Knee|AP':['Femorotibial joint space open and symmetric','Patella centred between femoral condyles','Tibial plateaus flat and sharp'],
 'Knee|Lateral':['Femoral condyles directly superimposed','Patellofemoral joint space open','Knee flexed 20–30°'],
 'Pelvis|AP':['Iliac wings symmetric and obturator foramina equal','Femoral necks in profile without foreshortening','Lesser trochanters absent or minimally visible'],
 'Cervical spine|AP Axial':['C3–T1 intervertebral spaces open','Spinous processes aligned to vertebral-body midline','Mandible/skull base clear of C3 and below'],
 'Lumbar spine|AP':['Spinous processes centred and pedicles equidistant','T12/L1 through sacrum included'],
 'Skull|PA / Caldwell':['Petrous ridges at expected orbital level for selected projection','Lateral orbital wall-to-skull distances equal bilaterally']
};
const pct=(v:number,p:number)=>Math.abs(v-p)/Math.max(Math.abs(p),0.01);
const item=(category:CritiqueItem['category'],level:CritiqueLevel,title:string,feedback:string):CritiqueItem=>({category,level,title,feedback});
export function critiqueRadiograph(position:RadiographicPosition,t:TechniqueSnapshot):CritiqueResult{
 const items:CritiqueItem[]=[];const preset=position.exposure;
 const rot=Math.abs(t.rotationDeg-position.pose.bodyYaw);items.push(rot<=2?item('positioning','good','Rotation','Rotation is close to the projection preset. Confirm the anatomical rotation criterion on the image.'):rot<=6?item('positioning','review','Rotation','There is measurable rotation from the preset. Check symmetry/superimposition criteria before accepting the image.'):item('positioning','repeat-risk','Rotation','Rotation is substantially outside the projection preset and is likely to compromise diagnostic positioning.'));
 const centre=Math.hypot(t.beamX,t.beamY);items.push(centre<=5?item('centring','good','Centring','Central ray is close to the examination centre.'):centre<=12?item('centring','review','Centring','Central ray is offset. Check that the required anatomy and joint/field centre are demonstrated.'):item('centring','repeat-risk','Centring','Large central-ray offset risks anatomy cut-off and geometric distortion.'));
 const fieldWidth=t.field.right-t.field.left,fieldHeight=t.field.bottom-t.field.top,refW=position.startingField.right-position.startingField.left,refH=position.startingField.bottom-position.startingField.top,fieldRatio=(fieldWidth*fieldHeight)/(refW*refH);
 items.push(fieldRatio>=.7&&fieldRatio<=1.35?item('collimation','good','Collimation','Field size is close to the projection starting field; confirm all required anatomy is included.'):fieldRatio<.7?item('collimation','repeat-risk','Collimation','Field is substantially tighter than the projection preset. Check carefully for clipped required anatomy.'):item('collimation','review','Collimation','Field is wider than needed. Reduce irradiated tissue where anatomy coverage permits; a smaller field also reduces scatter.'));
 const k=pct(t.kVp,preset.kVp),m=pct(t.mAs,preset.mAs),s=pct(t.sidCm,preset.sidCm);
 items.push(k<=.08?item('exposure','good','kVp','Tube potential is close to the examination preset.'):k<=.18?item('exposure','review','kVp',t.kVp<preset.kVp?'Lower kVp reduces penetration and can increase subject contrast but risks inadequate penetration.':'Higher kVp increases penetration and tends to reduce subject contrast; assess whether the image is unnecessarily penetrated.'):item('exposure','repeat-risk','kVp',t.kVp<preset.kVp?'kVp is well below the preset and inadequate penetration is likely.':'kVp is well above the preset; excessive penetration and loss of subject contrast are likely.'));
 items.push(m<=.15?item('exposure','good','mAs','Photon quantity is close to the examination preset.'):m<=.4?item('exposure','review','mAs',t.mAs<preset.mAs?'Reduced mAs increases quantum noise; inspect fine anatomical detail.':'mAs is above the preset and increases patient exposure without necessarily improving useful image quality.'):item('exposure','repeat-risk','mAs',t.mAs<preset.mAs?'Markedly low mAs is likely to cause excessive quantum mottle.':'Markedly high mAs represents avoidable patient exposure.'));
 items.push(s<=.08?item('exposure','good','SID','SID is close to the projection preset.'):item('exposure','review','SID',t.sidCm<preset.sidCm?'Shorter SID increases detector fluence and magnification; reassess geometry and exposure.':'Longer SID reduces detector fluence by inverse-square behaviour unless technique is compensated.'));
 const criteria=CRITERIA[`${position.region}|${position.projection}`]??[];if(criteria.length)items.push(item('anatomy','review','Image acceptance criteria','Use the projection-specific anatomical criteria to decide whether this image is acceptable; technique values alone cannot prove correct anatomy.'));
 const penalty=items.reduce((n,x)=>n+(x.level==='repeat-risk'?18:x.level==='review'?7:0),0),score=Math.max(0,100-penalty),level:CritiqueLevel=items.some(x=>x.level==='repeat-risk')?'repeat-risk':items.some(x=>x.level==='review')?'review':'good';return{score,level,items,criteria};
}
