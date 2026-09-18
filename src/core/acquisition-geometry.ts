import type{ProjectionOptions,ProjectionView}from'./drr';
import type{PatientSex}from'./patients';
import type{FullBodyPose,RadiographicPosition}from'./radiographic-positions';
export type Vec3=readonly[number,number,number];
export interface CollimationEdges{left:number;right:number;top:number;bottom:number}
export interface AcquisitionState{examination:{id:string;region:string;projection:string;view:ProjectionView;patientSex:PatientSex};patient:{pose:FullBodyPose;translationPercent:Vec3;rotationDeg:Vec3};detector:{orientation:'portrait'|'landscape';dimensionsCm:readonly[number,number];centreMm:Vec3;normal:Vec3;up:Vec3};source:{positionMm:Vec3;sidCm:number;tubeAngleDeg:number;centralRayTargetMm:Vec3};beam:{centrePercent:readonly[number,number];collimation:CollimationEdges;sourceCentreVoxel?:Vec3};exposure:{kVp:number;mAs:number}}
export interface AcquisitionInput{position:RadiographicPosition;patientSex:PatientSex;bodyYawDeg:number;patientXPercent:number;patientYPercent:number;beamXPercent:number;beamYPercent:number;tubeAngleDeg:number;sidCm:number;kVp:number;mAs:number;collimation:CollimationEdges;regionalGeometry?:{sourceBounds:{x0:number;x1:number;y0:number;y1:number;z0:number;z1:number};sourcePatient:{dimensions:[number,number,number]}}}
export function projectionView(projection:string):ProjectionView{const value=projection.trim().toUpperCase();return value.includes('LATERAL')?'LATERAL':value.startsWith('AP')?'AP':'PA'}
/** Build the immutable exposure record shared by positioning, projection and critique. */
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
/**
 * The positioning light field is drawn over a whole-patient view, while each DRR uses a
 * dedicated regional CT crop. Map the learner's field relative to the projection preset:
 * the preset rectangle represents the complete regional acquisition, and subsequent
 * movement/collimation becomes a local shift/crop inside that anatomy. This prevents a
 * chest field at the upper third of the screen being interpreted as a 20–30% detector
 * translation into empty space.
 */
export function createAcquisitionState(input:AcquisitionInput):AcquisitionState{
 const{position}=input,view=projectionView(position.projection),landscape=position.detector==='landscape',dimensionsCm=landscape?[43,35]as const:[35,43]as const;
 const preset=position.startingField,presetW=Math.max(1,100-preset.left-preset.right),presetH=Math.max(1,100-preset.top-preset.bottom),currentW=Math.max(1,100-input.collimation.left-input.collimation.right),currentH=Math.max(1,100-input.collimation.top-input.collimation.bottom);
 const presetCx=preset.left+presetW/2+preset.centreX,presetCy=preset.top+presetH/2+preset.centreY,currentCx=input.collimation.left+currentW/2+input.beamXPercent,currentCy=input.collimation.top+currentH/2+input.beamYPercent,screenDx=currentCx-presetCx,screenDy=currentCy-presetCy;
 // Keep detector collimation and anatomical targeting separate. Field size/position controls the
 // exposed receptor area, while the same whole-patient screen displacement selects a point in the
 // source-patient CT coordinate frame. This is the critical link between what the learner points at
 // on the articulated patient and which anatomy the DRR rays actually traverse.
 const centreX=screenDx/presetW*100-input.patientXPercent,centreY=screenDy/presetH*100-input.patientYPercent,beamW=clamp(currentW/presetW*100,4,100),beamH=clamp(currentH/presetH*100,4,100),maskCx=50+centreX,maskCy=50+centreY;
 const localCollimation={left:clamp(maskCx-beamW/2,0,100),right:clamp(100-(maskCx+beamW/2),0,100),top:clamp(maskCy-beamH/2,0,100),bottom:clamp(100-(maskCy+beamH/2),0,100)};
 let sourceCentreVoxel:Vec3|undefined;
 if(input.regionalGeometry){const{sourceBounds:b,sourcePatient:s}=input.regionalGeometry,[dx,dy,dz]=s.dimensions,baseX=(b.x0+b.x1)/2,baseY=(b.y0+b.y1)/2,baseZ=(b.z0+b.z1)/2;
  // Screen y increases downwards whereas source z increases towards the head in this dataset.
  // One percentage point of movement on the displayed whole patient therefore corresponds to one
  // percentage point of the full source-patient extent, anchored at the verified regional bounds.
  sourceCentreVoxel=view==='LATERAL'?[baseX,baseY+screenDx/100*dy,baseZ-screenDy/100*dz]:[baseX+screenDx/100*dx,baseY,baseZ-screenDy/100*dz];
 }
 const sidMm=input.sidCm*10,angle=Math.tan(input.tubeAngleDeg*Math.PI/180)*sidMm,detector={orientation:position.detector,dimensionsCm,centreMm:[0,0,0]as Vec3,normal:(view==='LATERAL'?[1,0,0]:[0,view==='PA'?1:-1,0])as Vec3,up:[0,0,1]as Vec3},sourcePosition:Vec3=view==='LATERAL'?[-sidMm,0,-angle]:[0,(view==='PA'?1:-1)*sidMm,-angle];
 return{examination:{id:position.id,region:position.region,projection:position.projection,view,patientSex:input.patientSex},patient:{pose:position.pose,translationPercent:[input.patientXPercent,input.patientYPercent,0],rotationDeg:[position.pose.bodyPitch,((input.bodyYawDeg-position.pose.bodyYaw+540)%360)-180,position.pose.bodyRoll]},detector,source:{positionMm:sourcePosition,sidCm:input.sidCm,tubeAngleDeg:input.tubeAngleDeg,centralRayTargetMm:[centreX/100*dimensionsCm[0]*10,0,centreY/100*dimensionsCm[1]*10]},beam:{centrePercent:[centreX,centreY],collimation:localCollimation,sourceCentreVoxel},exposure:{kVp:input.kVp,mAs:input.mAs}}
}
export function projectionOptions(state:AcquisitionState,seed=17):ProjectionOptions{return{view:state.examination.view,stepVoxels:3,patientXPercent:state.patient.translationPercent[0],patientYPercent:state.patient.translationPercent[1],kVp:state.exposure.kVp,mAs:state.exposure.mAs,sidCm:state.source.sidCm,rotationDeg:state.patient.rotationDeg[1],collimation:{...state.beam.collimation},centreXPercent:state.beam.centrePercent[0],centreYPercent:state.beam.centrePercent[1],sourceCentreVoxel:state.beam.sourceCentreVoxel?tup(state.beam.sourceCentreVoxel):undefined,tubeAngleDeg:state.source.tubeAngleDeg,detectorWidthCm:state.detector.dimensionsCm[0],detectorHeightCm:state.detector.dimensionsCm[1],seed}}
function tup(v:Vec3):[number,number,number]{return[v[0],v[1],v[2]]}
