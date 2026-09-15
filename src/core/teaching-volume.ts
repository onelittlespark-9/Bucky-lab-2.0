import type{PatientVolume}from'./volume';
import type{CaseProvenance}from'./cases';

export interface SimulatedPathology{id:string;label:string;category:string;targetRegion:string;parameters:Record<string,unknown>;provenance:{kind:'simulated';method:string}}
export interface TeachingVolume{source:PatientVolume;provenance:CaseProvenance;pathologies:SimulatedPathology[];huAt(x:number,y:number,z:number):number}
export type VoxelTransform=(hu:number,x:number,y:number,z:number)=>number;

export function createTeachingVolume(source:PatientVolume,provenance:CaseProvenance='real-source',transforms:VoxelTransform[]=[],pathologies:SimulatedPathology[]=[]):TeachingVolume{
 const[nx,ny,nz]=source.manifest.dimensions;
 return{source,provenance,pathologies,huAt(x,y,z){if(x<0||y<0||z<0||x>=nx||y>=ny||z>=nz)return-1000;let hu=source.hu[(z*ny+y)*nx+x]??-1000;for(const transform of transforms)hu=transform(hu,x,y,z);return hu}}
}

export function sphericalHuTransform(center:[number,number,number],radius:number,targetHu:number):VoxelTransform{
 const[cx,cy,cz]=center;const r2=radius*radius;
 return(hu,x,y,z)=>((x-cx)**2+(y-cy)**2+(z-cz)**2<=r2?targetHu:hu)
}
