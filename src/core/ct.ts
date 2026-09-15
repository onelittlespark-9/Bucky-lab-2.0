import type{TeachingVolume}from'./teaching-volume';
export interface CtWindow{center:number;width:number;label:string}
export type CtPlane='axial'|'coronal'|'sagittal';
export const CT_WINDOWS={soft:{center:40,width:400,label:'Soft tissue'},lung:{center:-600,width:1500,label:'Lung'},bone:{center:400,width:1800,label:'Bone'},brain:{center:40,width:80,label:'Brain'}} satisfies Record<string,CtWindow>;
export function windowHu(hu:number,w:CtWindow){const lo=w.center-w.width/2,hi=w.center+w.width/2;if(hu<=lo)return 0;if(hu>=hi)return 255;return Math.round((hu-lo)/(hi-lo)*255)}
// Radiological display convention: axial images are viewed from the patient's feet,
// therefore patient right appears on screen left and anterior is at the top. The s1397
// source z axis runs inferior -> superior, so the UI slice index is reversed head -> feet.
export function axialSlice(v:TeachingVolume,index:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions,displayIndex=Math.max(0,Math.min(nz-1,Math.round(index))),z=nz-1-displayIndex,pixels=new Uint8ClampedArray(nx*ny);for(let row=0;row<ny;row++){const sourceY=ny-1-row;for(let col=0;col<nx;col++){const sourceX=nx-1-col;pixels[row*nx+col]=windowHu(v.huAt(sourceX,sourceY,z),w)}}return{width:nx,height:ny,index:displayIndex,pixels}}
// Coronal and sagittal reformats are head-up. Coronal is displayed as if facing the patient.
export function coronalSlice(v:TeachingVolume,index:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions,y=Math.max(0,Math.min(ny-1,Math.round(index))),pixels=new Uint8ClampedArray(nx*nz);for(let row=0;row<nz;row++){const z=nz-1-row;for(let col=0;col<nx;col++){const sourceX=nx-1-col;pixels[row*nx+col]=windowHu(v.huAt(sourceX,y,z),w)}}return{width:nx,height:nz,index:y,pixels}}
export function sagittalSlice(v:TeachingVolume,index:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions,x=Math.max(0,Math.min(nx-1,Math.round(index))),pixels=new Uint8ClampedArray(ny*nz);for(let row=0;row<nz;row++){const z=nz-1-row;for(let col=0;col<ny;col++){const sourceY=ny-1-col;pixels[row*ny+col]=windowHu(v.huAt(x,sourceY,z),w)}}return{width:ny,height:nz,index:x,pixels}}
export function ctSlice(v:TeachingVolume,plane:CtPlane,index:number,w:CtWindow){return plane==='axial'?axialSlice(v,index,w):plane==='coronal'?coronalSlice(v,index,w):sagittalSlice(v,index,w)}
export function planeLength(v:TeachingVolume,plane:CtPlane){const[nx,ny,nz]=v.source.manifest.dimensions;return plane==='axial'?nz:plane==='coronal'?ny:nx}
