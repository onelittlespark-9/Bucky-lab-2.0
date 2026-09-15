export type Vec3=[number,number,number];
export interface PatientPose{translationMm:Vec3;rotationDeg:Vec3}
export interface TubeGeometry{source:Vec3;sidMm:number}
export interface DetectorGeometry{center:Vec3;normal:Vec3;up:Vec3;widthMm:number;heightMm:number;pixelWidth:number;pixelHeight:number}
export interface Collimation{left:number;right:number;top:number;bottom:number}
export interface Exposure{kVp:number;mAs:number}
export interface AcquisitionGeometry{patient:PatientPose;tube:TubeGeometry;detector:DetectorGeometry;collimation:Collimation;exposure:Exposure}
export const DEFAULT_XRAY:AcquisitionGeometry={patient:{translationMm:[0,0,0],rotationDeg:[0,0,0]},tube:{source:[0,-1800,0],sidMm:1800},detector:{center:[0,0,0],normal:[0,-1,0],up:[0,0,1],widthMm:430,heightMm:430,pixelWidth:512,pixelHeight:512},collimation:{left:.08,right:.92,top:.08,bottom:.92},exposure:{kVp:110,mAs:2}}
