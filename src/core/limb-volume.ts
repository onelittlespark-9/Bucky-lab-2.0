import type{TeachingVolume}from'./teaching-volume';
import type{LimbRegion,PatientSide}from'./limb-regions';
export interface VoxelBounds{x0:number;x1:number;y0:number;y1:number;z0:number;z1:number}
export interface LimbVolume{region:LimbRegion;side:PatientSide;bounds:VoxelBounds;dimensions:[number,number,number];huAt(x:number,y:number,z:number):number}
// Normalised bounds are a temporary source-volume locator for s1397 until segmentation masks are
// shipped with the browser case. Extraction remains true 3-D HU data; no 2-D anatomy is fabricated.
const Z:Record<LimbRegion,[number,number]>={shoulder:[.67,.82],humerus:[.52,.76],elbow:[.45,.58],forearm:[.34,.53],wrist:[.27,.39],hand:[.18,.34],hip:[.38,.55],femur:[.18,.46],knee:[.12,.25],'tibia-fibula':[.03,.19],ankle:[0,.08],foot:[0,.07]};
const WIDTH:Record<'upper'|'lower',number>={upper:.36,lower:.28};
const upper=new Set<LimbRegion>(['shoulder','humerus','elbow','forearm','wrist','hand']);
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
export function extractLimbVolume(v:TeachingVolume,region:LimbRegion,side:PatientSide):LimbVolume{const[nx,ny,nz]=v.source.manifest.dimensions,[za,zb]=Z[region],group=upper.has(region)?'upper':'lower',span=WIDTH[group],sideCentre=side==='left'?.68:.32,x0=Math.floor(clamp(sideCentre-span/2,0,1)*(nx-1)),x1=Math.ceil(clamp(sideCentre+span/2,0,1)*(nx-1)),y0=0,y1=ny-1,z0=Math.floor(za*(nz-1)),z1=Math.ceil(zb*(nz-1)),dx=x1-x0+1,dy=y1-y0+1,dz=z1-z0+1;return{region,side,bounds:{x0,x1,y0,y1,z0,z1},dimensions:[dx,dy,dz],huAt(x,y,z){if(x<0||y<0||z<0||x>=dx||y>=dy||z>=dz)return-1000;return v.huAt(x0+x,y0+y,z0+z)}}}
export function limbProjection(volume:LimbVolume,view:'AP'|'PA'|'LATERAL'='AP'){const[nx,ny,nz]=volume.dimensions,lateral=view==='LATERAL',width=lateral?ny:nx,height=nz,depth=lateral?nx:ny,pixels=new Uint8ClampedArray(width*height);for(let row=0;row<height;row++){const z=nz-1-row;for(let col=0;col<width;col++){let tissue=0,bone=0,soft=0,n=0;for(let d=0;d<depth;d+=2){const hu=lateral?volume.huAt(d,col,z):volume.huAt(col,d,z);if(hu>-650){tissue++;if(hu>180)bone++;if(hu>-200&&hu<180){soft+=hu;n++}}}pixels[row*width+col]=tissue?Math.round(Math.min(235,28+Math.min(90,tissue*3)+Math.min(100,bone*12)+(n?Math.max(0,Math.min(20,(soft/n+150)/15)):0))):6}}return{width,height,pixels}}
