import type{FullBodyPose}from'./radiographic-positions';
/** One immutable positioning state is shared by the room preview and DRR acquisition. */
export interface AcquisitionGeometry{bodyYawDeg:number;bodyPitchDeg:number;bodyRollDeg:number;centreXPercent:number;centreYPercent:number;tubeAngleDeg:number;sidCm:number;collimation:{left:number;right:number;top:number;bottom:number};pose:FullBodyPose}
export function acquisitionGeometry(pose:FullBodyPose,bodyYawDeg:number,centreXPercent:number,centreYPercent:number,tubeAngleDeg:number,sidCm:number,collimation:AcquisitionGeometry['collimation']):AcquisitionGeometry{return{bodyYawDeg,bodyPitchDeg:pose.bodyPitch,bodyRollDeg:pose.bodyRoll,centreXPercent,centreYPercent,tubeAngleDeg,sidCm,collimation:{...collimation},pose}}
