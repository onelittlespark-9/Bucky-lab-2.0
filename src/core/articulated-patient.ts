import type{FullBodyPose,JointPose,PatientStance}from'./radiographic-positions';
export type PatientJoint='root'|'head'|'leftShoulder'|'rightShoulder'|'leftElbow'|'rightElbow'|'leftHip'|'rightHip'|'leftKnee'|'rightKnee';
export interface JointTransform{joint:PatientJoint;parent:PatientJoint|null;rotation:[number,number,number]}
const r=(p:JointPose={}):[number,number,number]=>[p.flexion??0,p.rotation??0,p.abduction??0];
export function poseToJointTransforms(p:FullBodyPose):JointTransform[]{return[
 {joint:'root',parent:null,rotation:[p.bodyPitch,p.bodyYaw,p.bodyRoll]},
 {joint:'head',parent:'root',rotation:[p.headExtension,p.headRotation,0]},
 {joint:'leftShoulder',parent:'root',rotation:r(p.leftShoulder)},{joint:'rightShoulder',parent:'root',rotation:r(p.rightShoulder)},
 {joint:'leftElbow',parent:'leftShoulder',rotation:r(p.leftElbow)},{joint:'rightElbow',parent:'rightShoulder',rotation:r(p.rightElbow)},
 {joint:'leftHip',parent:'root',rotation:r(p.leftHip)},{joint:'rightHip',parent:'root',rotation:r(p.rightHip)},
 {joint:'leftKnee',parent:'leftHip',rotation:r(p.leftKnee)},{joint:'rightKnee',parent:'rightHip',rotation:r(p.rightKnee)}]}
export function stanceTransform(s:PatientStance){switch(s){case'supine':return{pitch:90,roll:0};case'prone':return{pitch:-90,roll:0};case'decubitus':return{pitch:0,roll:90};default:return{pitch:0,roll:0}}}
export function poseSummary(p:FullBodyPose){const moving=poseToJointTransforms(p).filter(j=>j.rotation.some(v=>Math.abs(v)>0.1));return moving.map(j=>`${j.joint}: ${j.rotation.map(v=>Math.round(v)+'°').join(' / ')}`)}
