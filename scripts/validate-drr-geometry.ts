import{detectorGeometry,projectVolume}from'../src/core/drr';
import type{TeachingVolume}from'../src/core/teaching-volume';
import{createAcquisitionState,projectionOptions}from'../src/core/acquisition-geometry';
import{RADIOGRAPHIC_POSITIONS}from'../src/core/radiographic-positions';
const manifest={dimensions:[117,91,105],spacingMm:[3,3,3.0054945055]} as any;
const volume={source:{manifest}} as TeachingVolume;
const near=detectorGeometry(volume,{view:'PA',kVp:125,mAs:2,sidCm:100}),far=detectorGeometry(volume,{view:'PA',kVp:125,mAs:2,sidCm:180});
if(!(near.magnification>far.magnification&&near.inverseSquare>far.inverseSquare))throw new Error('DRR SID geometry regression: shorter SID must increase magnification and detector fluence');
if(!(far.magnification>1&&Number.isFinite(far.magnification)))throw new Error('DRR magnification must be finite and > 1');
const airVolume={source:{manifest:{dimensions:[20,20,30],spacingMm:[2,2,2]}},huAt:()=>-1000}as unknown as TeachingVolume;
const air=projectVolume(airVolume,{kVp:125,mAs:2,sidCm:180,view:'PA',seed:17,collimation:{left:0,right:0,top:0,bottom:0}});
const detectorCoverage=air.pixels.filter(value=>value>8).length/air.pixels.length;
if(detectorCoverage<.99)throw new Error(`DRR exposed-air regression: detector coverage ${(detectorCoverage*100).toFixed(1)}% must exceed 99%`);
const pa=RADIOGRAPHIC_POSITIONS.find(position=>position.region==='Chest'&&position.projection.toUpperCase().startsWith('PA'))!;
const paField=(1-(pa.startingField.left+pa.startingField.right)/100)*(1-(pa.startingField.top+pa.startingField.bottom)/100);
if(paField<.06||paField>.14)throw new Error(`PA chest positioning field ${(paField*100).toFixed(1)}% must remain anchored to the thorax in the whole-patient view`);
const state=createAcquisitionState({position:pa,patientSex:'male',bodyYawDeg:pa.pose.bodyYaw+7,patientXPercent:3,patientYPercent:-2,beamXPercent:11,beamYPercent:5,tubeAngleDeg:4,sidCm:180,kVp:125,mAs:2,collimation:{left:10,right:12,top:8,bottom:9}}),options=projectionOptions(state);
if(state.examination.view!=='PA'||state.source.positionMm[1]<=0||state.detector.normal[1]<=0)throw new Error('PA acquisition state must place source and detector normal on the anterior axis');
if(options.rotationDeg!==7||options.centreXPercent!==8||options.centreYPercent!==7)throw new Error('DRR options must preserve patient rotation and beam-to-patient displacement');
if(options.detectorWidthCm!==35||options.detectorHeightCm!==43||options.kVp!==125||options.mAs!==2)throw new Error('DRR options must preserve detector and exposure state');
const tissueManifest={dimensions:[117,91,105],spacingMm:[3,3,3.0054945055]} as any;
const tissue={source:{manifest:tissueManifest},huAt:(x:number,y:number,z:number)=>x>8&&x<108&&y>8&&y<82&&z>5&&z<100?0:-1000}as unknown as TeachingVolume;
const chest=projectVolume(tissue,{kVp:125,mAs:2,sidCm:180,view:'PA',seed:17,collimation:{left:18,right:18,top:13,bottom:17},centreYPercent:-8});
if(!chest.anatomyBounds||chest.anatomyBounds.width/chest.width<.45||chest.anatomyBounds.height/chest.height<.45)throw new Error('DRR anatomy footprint regression: chest-sized anatomy must retain a substantial physical detector footprint');
const chestAspect=chest.anatomyBounds.width/chest.anatomyBounds.height,detectorAspect=chest.width/chest.height;if(chestAspect<.55||chestAspect>1.65)throw new Error(`DRR anatomy aspect regression: ${chestAspect.toFixed(2)}`);if(chest.anatomyFraction<.08)throw new Error(`DRR anatomy occupancy regression: ${(chest.anatomyFraction*100).toFixed(1)}%`);

const centre=chest.pixels[Math.floor(chest.height/2)*chest.width+Math.floor(chest.width/2)],corner=chest.pixels[Math.floor(chest.height*.12)*chest.width+Math.floor(chest.width*.12)];
if(centre<=corner+8)throw new Error('DRR polarity regression: attenuating central anatomy must render brighter than exposed air');
const shifted=projectVolume(tissue,{kVp:125,mAs:2,sidCm:180,view:'PA',seed:17,patientXPercent:12,patientYPercent:8,collimation:{left:18,right:18,top:13,bottom:17},centreYPercent:-8});
if(!shifted.anatomyBounds||!chest.anatomyBounds)throw new Error('Patient translation validation requires anatomy bounds');
if(Math.abs(shifted.anatomyBounds.left-chest.anatomyBounds.left)<3&&Math.abs(shifted.anatomyBounds.top-chest.anatomyBounds.top)<3)throw new Error('Patient translation is not represented in the generated DRR');
console.log('Validated DRR geometry invariants.');

const contrast=projectVolume(tissue,{kVp:125,mAs:2,sidCm:180,view:'PA',seed:17,collimation:{left:18,right:18,top:13,bottom:17},centreYPercent:-8});
const vals=Array.from(contrast.pixels).filter(v=>v>8).sort((a,b)=>a-b),p=(q:number)=>vals[Math.min(vals.length-1,Math.floor((vals.length-1)*q))]??0;
if(p(.95)-p(.05)<45)throw new Error(`DRR display contrast regression: P95-P05=${p(.95)-p(.05)}`);
if(p(.95)>=245&&p(.5)>=235)throw new Error('DRR display saturation regression: chest image is predominantly clipped white');

const paNeutral=createAcquisitionState({position:pa,patientSex:'male',bodyYawDeg:pa.pose.bodyYaw,patientXPercent:0,patientYPercent:0,beamXPercent:pa.startingField.centreX,beamYPercent:pa.startingField.centreY,tubeAngleDeg:pa.tubeAngleDeg,sidCm:pa.exposure.sidCm,kVp:pa.exposure.kVp,mAs:pa.exposure.mAs,collimation:pa.startingField});
if(projectionOptions(paNeutral).rotationDeg!==0)throw new Error('PA preset yaw must project as zero relative rotation; projection view already encodes PA orientation');
const paRotated=createAcquisitionState({position:pa,patientSex:'male',bodyYawDeg:pa.pose.bodyYaw+12,patientXPercent:0,patientYPercent:0,beamXPercent:pa.startingField.centreX,beamYPercent:pa.startingField.centreY,tubeAngleDeg:pa.tubeAngleDeg,sidCm:pa.exposure.sidCm,kVp:pa.exposure.kVp,mAs:pa.exposure.mAs,collimation:pa.startingField});
if(projectionOptions(paRotated).rotationDeg!==12)throw new Error('Patient rotation must be measured relative to the projection preset');

const defaultMapped=projectionOptions(createAcquisitionState({position:pa,patientSex:'male',bodyYawDeg:pa.pose.bodyYaw,patientXPercent:0,patientYPercent:0,beamXPercent:pa.startingField.centreX,beamYPercent:pa.startingField.centreY,tubeAngleDeg:pa.tubeAngleDeg,sidCm:pa.exposure.sidCm,kVp:pa.exposure.kVp,mAs:pa.exposure.mAs,collimation:pa.startingField}));
if(Math.abs(defaultMapped.centreXPercent??99)>.001||Math.abs(defaultMapped.centreYPercent??99)>.001)throw new Error('Default PA chest field must map to the centre of the dedicated chest CT');
if(Object.values(defaultMapped.collimation??{}).some(v=>Math.abs(v)>.001))throw new Error('Default PA chest field must expose the full dedicated chest CT rather than inherit whole-body screen margins');
const halfW=(100-pa.startingField.left-pa.startingField.right)/2,halfH=(100-pa.startingField.top-pa.startingField.bottom)/2,cx=pa.startingField.left+(100-pa.startingField.left-pa.startingField.right)/2,cy=pa.startingField.top+(100-pa.startingField.top-pa.startingField.bottom)/2,halfField={left:cx-halfW/2,right:100-(cx+halfW/2),top:cy-halfH/2,bottom:100-(cy+halfH/2)};
const tightMapped=projectionOptions(createAcquisitionState({position:pa,patientSex:'male',bodyYawDeg:pa.pose.bodyYaw,patientXPercent:0,patientYPercent:0,beamXPercent:0,beamYPercent:0,tubeAngleDeg:0,sidCm:180,kVp:125,mAs:2,collimation:halfField}));
if((tightMapped.collimation?.left??0)<20||(tightMapped.collimation?.right??0)<20||(tightMapped.collimation?.top??0)<20||(tightMapped.collimation?.bottom??0)<20)throw new Error('Tighter light-field collimation must become a centred regional detector crop');
