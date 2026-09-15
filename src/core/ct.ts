import type{TeachingVolume}from'./teaching-volume';
export interface CtWindow{center:number;width:number;label:string}
export const CT_WINDOWS={soft:{center:40,width:400,label:'Soft tissue'},lung:{center:-600,width:1500,label:'Lung'},bone:{center:400,width:1800,label:'Bone'},brain:{center:40,width:80,label:'Brain'}} satisfies Record<string,CtWindow>;
export function windowHu(hu:number,w:CtWindow){const lo=w.center-w.width/2,hi=w.center+w.width/2;if(hu<=lo)return 0;if(hu>=hi)return 255;return Math.round((hu-lo)/(hi-lo)*255)}
export function axialSlice(v:TeachingVolume,z:number,w:CtWindow){const[nx,ny,nz]=v.source.manifest.dimensions;const zi=Math.max(0,Math.min(nz-1,Math.round(z)));const pixels=new Uint8ClampedArray(nx*ny);for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)pixels[y*nx+x]=windowHu(v.huAt(x,y,zi),w);return{width:nx,height:ny,z:zi,pixels}}
