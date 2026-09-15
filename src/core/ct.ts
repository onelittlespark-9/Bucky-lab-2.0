import type{TeachingVolume}from'./teaching-volume';
export interface CtWindow{center:number;width:number;label:string}
export type CtPlane='axial'|'coronal'|'sagittal';
export const CT_WINDOWS={soft:{center:40,width:400,label:'Soft tissue'},lung:{center:-600,width:1500,label:'Lung'},bone:{center:400,width:1800,label:'Bone'},brain:{center:40,width:80,label:'Brain'}} satisfies Record<string,CtWindow>;
export function windowHu(hu:number,w:CtWindow){const lo=w.center-w.width/2,hi=w.center+w.width/2;if(hu<=lo)return 0;if(hu>=hi)return 255;return Math.round((hu-lo)/(hi-lo)*255)}
// Display orientation follows radiological convention. The PyVista s1397 source is stored
// inferior -> superior in z, so the axial index is reversed: slice 0 is superior/head.
export function axialSlice(v:TeachingVolume,index:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions;const displayIndex=Math.max(0,Math.min(nz-1,Math.round(index))),z=nz-1-displayIndex;const pixels=new Uint8ClampedArray(nx*ny);for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)pixels[y*nx+x]=windowHu(v.huAt(x,y,z),w);return{width:nx,height:ny,index:displayIndex,pixels}}
export function coronalSlice(v:TeachingVolume,index:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions;const y=Math.max(0,Math.min(ny-1,Math.round(index)));const pixels=new Uint8ClampedArray(nx*nz);for(let row=0;row<nz;row++){const z=nz-1-row;for(let x=0;x<nx;x++)pixels[row*nx+x]=windowHu(v.huAt(x,y,z),w)}return{width:nx,height:nz,index:y,pixels}}
export function sagittalSlice(v:TeachingVolume,index:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions;const x=Math.max(0,Math.min(nx-1,Math.round(index)));const pixels=new Uint8ClampedArray(ny*nz);for(let row=0;row<nz;row++){const z=nz-1-row;for(let y=0;y<ny;y++)pixels[row*ny+y]=windowHu(v.huAt(x,y,z),w)}return{width:ny,height:nz,index:x,pixels}}
export function ctSlice(v:TeachingVolume,plane:CtPlane,index:number,w:CtWindow){return plane==='axial'?axialSlice(v,index,w):plane==='coronal'?coronalSlice(v,index,w):sagittalSlice(v,index,w)}
export function planeLength(v:TeachingVolume,plane:CtPlane){const[nx,ny,nz]=v.source.manifest.dimensions;return plane==='axial'?nz:plane==='coronal'?ny:nx}
