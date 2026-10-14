import {RADIOGRAPHIC_POSITIONS, type RadiographicPosition} from './radiographic-positions';
import {exposureReference} from './exposure-reference-library';

export interface ProjectionExposureGuide {
  id:string; region:string; projection:string; title:string;
  preset:{kVp:number;mAs:number;sidCm:number;grid:boolean;aec:boolean};
  detector:string; beam:string; tubeAngleDeg:number; respiration:string;
  centringPoint:string; areaOfInterest:string; qualityChecks:string[];
  learningFocus:string; anatomicalConsideration:string;
  sourceNote:string;
}

// The only numerical exposure settings come from RADIOGRAPHIC_POSITIONS.
// Descriptions below explain factors; they are not published clinical technique charts.
const REGION_FOCUS:Record<string,string>={
  'Chest':'Assess lung/mediastinal penetration alongside overall field coverage and motion. A high-kVp chest technique affects contrast; technique depends on receptor and departmental validation.',
  'Abdomen':'Abdominal thickness and scatter can affect image quality. Include anatomy required by the clinical indication and consider collimation and the department’s validated technique.',
  'Pelvis':'Assess pelvic cortical and soft-tissue detail together with scatter, centring and appropriate use of the anti-scatter grid.',
  'Cervical spine':'Assess cervical vertebral cortices and intervertebral structures, minimising movement. Tube angulation and source distance depend on projection.',
  'Facial bones':'Facial bone detail and superimposition depend on positioning and tube angle; avoid excessive exposure in pursuit of contrast.',
  'Lumbar spine':'Consider attenuation and scatter through the abdomen and lumbar spine; lateral views often have substantially greater attenuation than AP views.',
  'Thoracic spine':'Consider the shoulder girdle and chest in the beam path, and the effects of respiration, scatter and positioning.',
  'Shoulder':'Evaluate proximal humerus and joint-space detail, avoiding rotation and excluding clinically significant anatomy.',
  'Humerus':'Maintain cortical detail through the entire long bone and include both adjacent joints where indicated.',
  'Elbow':'Preserve fine cortical and joint detail with close collimation and minimal movement.',
  'Forearm':'Maintain visible radius and ulna cortices, including wrist and elbow joints.',
  'Wrist':'Fine carpal trabecular and cortical detail is important; minimise motion and keep the field close to the wrist.',
  'Hand':'Small bone and joint detail is important. Avoid unnecessary scatter from a large field or avoidable motion.',
  'Hip':'Hip and proximal femoral depth affects penetration and scatter; consider patient mobility and suspected fracture before positioning.',
  'Femur':'Variable tissue thickness along the femur may require adjustment to the validated technique and more than one receptor field.',
  'Knee':'Assess articular cortex, tibial plateau and trabeculae while keeping motion and unnecessary field size low.',
  'Tibia/fibula':'Maintain cortical and medullary detail along both long bones; include knee and ankle.',
  'Ankle':'Malleolar cortex and ankle mortise must be clearly visible without avoidable movement.',
  'Foot':'Review tarsal and metatarsal margins and the effect of obliquity on demonstrated joint spaces.'
};
const VIEW_FOCUS:Record<string,string>={
  'chest-pa-erect':'The 180 cm SID and AEC flag are Bucky Lab defaults. On real AEC systems chamber selection and collimation are essential; the displayed mAs is not a predicted AEC-terminated value.',
  'chest-ap':'An AP or mobile-style chest setup can change magnification, SID and patient positioning. Do not copy the PA preset without checking the selected acquisition protocol.',
  'chest-lateral-erect':'A lateral chest traverses different tissue thickness and should demonstrate the retrosternal and posterior costophrenic regions.',
  'abdomen-ap-supine':'Selection depends on the clinical question and departmental abdomen protocol; ensure pelvic or upper abdominal coverage as required.',
  'pelvis-ap':'In trauma, do not internally rotate the legs solely to obtain a standard view where fracture is suspected.',
  'cspine-ap':'The preset includes cranial tube angulation; the beam angle is not the same as an increase in exposure.',
  'cspine-lateral':'The longer SID is deliberate in this simulator. Make sure the cervicothoracic junction is adequately demonstrated.',
  'cspine-odontoid':'Do not force head or neck positioning when cervical trauma or instability is suspected.',
  'facial-om':'Pay particular attention to rotation and the relationship between petrous ridges, orbits and maxillary sinuses.',
  'facial-om30':'The 30° projection changes overlap, not necessarily the selected kVp or mAs. Verify collimation and orbital anatomy.',
  'lspine-ap':'Avoid unnecessary scatter-producing field size and assess pedicle symmetry and intervertebral detail.',
  'lspine-lateral':'The 150 cm SID and higher mAs are application presets, not values to transfer to clinical radiography.',
  'tspine-ap':'Review upper and lower thoracic visibility; exposure alone cannot correct anatomy omitted through centring.',
  'tspine-lateral':'The lateral beam path traverses shoulder/chest tissues; evaluate vertebral margins and avoid motion.',
  'shoulder-ap':'Arm rotation and injury status determine what joint anatomy is projected; exposure cannot compensate for incorrect rotation.',
  'humerus-ap':'Assess the entire shaft and both joints; consider differing tissue thickness along the arm.',
  'humerus-lateral':'Patient movement may be contraindicated after trauma; use an appropriate adapted projection rather than force rotation.',
  'elbow-ap':'Evaluate distal humerus and proximal radius/ulna detail; maintain a straight elbow and supinated forearm where safe.',
  'elbow-lateral':'A true lateral depends on a 90° flexion and the humerus/forearm level being aligned, if clinically safe.',
  'forearm-ap':'Ensure both the elbow and wrist are included; do not increase exposure to remedy an inadequate field.',
  'forearm-lateral':'Maintain the forearm in true lateral and include adjacent joints, minimising motion.',
  'wrist-pa':'The correct carpal relationships and sharp cortical detail matter more than making the overall image artificially dark.',
  'wrist-lateral':'A true lateral is judged by alignment/superimposition, not by increasing kVp or mAs.',
  'hand-pa':'Separate digits and check both cortical detail and joint-space demonstration.',
  'hand-oblique':'The oblique angle opens particular joint relationships; excessive rotation is a positioning error, not an exposure error.',
  'hip-ap':'Where trauma is suspected avoid forced internal rotation; thickness and detector geometry influence technique.',
  'femur-ap':'The full femur may require two exposures/images; preserve anatomical coverage of hip and knee.',
  'femur-lateral':'Trauma adaptations change the beam path and may call for a different clinically validated technique.',
  'knee-ap':'Assess tibiofemoral articular detail and rotation before judging receptor exposure.',
  'knee-lateral':'Flexion and condylar superimposition are positioning issues. The preset does not determine diagnostic adequacy.',
  'tibfib-ap':'Do not omit knee or ankle to fit a preferred receptor size; image coverage is a separate consideration.',
  'tibfib-lateral':'Lateral shaft imaging must include both joints; assess motion, overlap and cortical sharpness.',
  'ankle-ap':'Assess the malleoli and tibiotalar region, keeping collimation close to the intended anatomy.',
  'ankle-mortise':'Rotate the whole lower limb appropriately for the mortise; the angle is not a factor controlled through kVp.',
  'ankle-lateral':'Check talar dome alignment and clear demonstration of calcaneus and distal tibia/fibula.',
  'foot-dp':'Check tarsal, metatarsal and phalangeal detail; field size and tube angle are separate from exposure factors.',
  'foot-oblique':'Appropriate obliquity is needed to show lateral tarsal anatomy; do not use exposure to mask poor positioning.',
  'foot-lateral':'Check midfoot and calcaneal demonstration and superimposition of metatarsals.'
};
function makeGuide(position:RadiographicPosition):ProjectionExposureGuide{
 const ref=exposureReference(position.id);
 if(!VIEW_FOCUS[position.id]||!REGION_FOCUS[position.region])throw Error('Missing projection exposure teaching content: '+position.id);
 return{
  id:position.id,region:position.region,projection:position.projection,title:ref.title,
  preset:{kVp:position.exposure.kVp,mAs:position.exposure.mAs,sidCm:position.exposure.sidCm,grid:!!position.exposure.grid,aec:!!position.exposure.aec},
  detector:position.detector,beam:position.beam,tubeAngleDeg:position.tubeAngleDeg,
  respiration:position.respiration,centringPoint:ref.centringPoint,areaOfInterest:ref.areaOfInterest,
  qualityChecks:ref.qualityChecks,learningFocus:VIEW_FOCUS[position.id],
  anatomicalConsideration:REGION_FOCUS[position.region],sourceNote:ref.sourceNote
 };
}
export const PROJECTION_EXPOSURE_GUIDES=RADIOGRAPHIC_POSITIONS.map(makeGuide);
export const projectionExposure=(id:string)=>PROJECTION_EXPOSURE_GUIDES.find(p=>p.id===id);
