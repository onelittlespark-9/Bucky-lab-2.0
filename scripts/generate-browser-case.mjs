import{mkdir,writeFile}from'node:fs/promises';import{gzipSync}from'node:zlib';
const nx=256,ny=256,nz=512,n=nx*ny*nz,sp=2.5,b=Buffer.allocUnsafe(n*2);
const ell=(x,y,z,cx,cy,cz,rx,ry,rz)=>((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2<=1;
const shell=(x,y,z,cx,cy,cz,rx,ry,rz,t=.12)=>{const q=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2;return q<=1&&q>=1-t};
const tube=(x,y,z,ax,ay,az,bx,by,bz,r)=>{const vx=bx-ax,vy=by-ay,vz=bz-az,wx=x-ax,wy=y-ay,wz=z-az,d=vx*vx+vy*vy+vz*vz,t=Math.max(0,Math.min(1,(wx*vx+wy*vy+wz*vz)/d));return(x-(ax+t*vx))**2+(y-(ay+t*vy))**2+(z-(az+t*vz))**2<=r*r};
for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){let hu=-1000;const taper=1-.10*Math.abs(z-275)/190,body=ell(x,y,z,128,130,270,Math.max(62,91*taper),64,190);if(body){hu=-72;const core=ell(x,y,z,128,130,270,Math.max(54,79*taper),54,181);if(core)hu=32;
// lungs with mediastinal indentation and apical/basal taper
const ll=ell(x,y,z,91,125,302,34,43,94),rl=ell(x,y,z,165,125,302,35,44,95),central=ell(x,y,z,128,129,298,25,32,84);if((ll||rl)&&!central)hu=-790+Math.round(35*Math.sin(x*.31+z*.07));
// hilar vessels and bronchi
for(const s of[-1,1]){const hx=128+s*20;if(tube(x,y,z,128,128,315,hx,127,300,4))hu=45;if(tube(x,y,z,hx,127,300,128+s*43,121,322,2.6))hu=55;if(tube(x,y,z,hx,127,300,128+s*39,137,276,2.2))hu=50;if(tube(x,y,z,128,119,342,128+s*20,123,315,3.2))hu=-920;}
// trachea and main bronchi
if(tube(x,y,z,128,116,395,128,119,338,5.2))hu=-950;if(tube(x,y,z,128,119,340,104,123,317,4))hu=-940;if(tube(x,y,z,128,119,340,151,123,318,4))hu=-940;
// mediastinum, heart and great vessels
if(central)hu=43;if(ell(x,y,z,119,137,262,33,36,55))hu=58;if(ell(x,y,z,140,128,316,8,8,30))hu=52;if(tube(x,y,z,142,129,326,151,135,290,5))hu=58;if(ell(x,y,z,112,128,322,7,7,28))hu=48;
// diaphragm domes and upper abdominal organs
if(shell(x,y,z,99,133,211,43,42,24,.10)||shell(x,y,z,158,133,215,45,42,23,.10))hu=38;if(ell(x,y,z,151,137,183,50,39,43))hu=64;if(ell(x,y,z,92,135,185,20,18,28))hu=48;if(ell(x,y,z,104,134,181,15,14,22))hu=-720;
// vertebrae: cortical shell + cancellous centre, discs, spinous/transverse processes
if(z>150&&z<402){const level=Math.round((z-160)/18),zc=160+level*18;if(Math.abs(z-zc)<6){if(ell(x,y,z,128,166,zc,13,10,6))hu=210;if(shell(x,y,z,128,166,zc,13,10,6,.34))hu=780;if(tube(x,y,z,128,174,zc,128,188,zc,3.4))hu=760;if(tube(x,y,z,118,168,zc,105,170,zc,3))hu=650;if(tube(x,y,z,138,168,zc,151,170,zc,3))hu=650}else if(Math.abs(z-(zc+9))<2&&ell(x,y,z,128,166,z,11,8,2))hu=85;}
// sternum
if(z>205&&z<355&&ell(x,y,z,128,78,280,6,4,76))hu=620;
// ribs: posterior-to-anterior elliptical arcs with cortical thickness
for(let r=0;r<10;r++){const rz=190+r*19;if(Math.abs(z-rz)<3.2){const dx=(x-128)/76,dy=(y-132)/52,q=dx*dx+dy*dy;if(q>.79&&q<.94&&y<174)hu=610;if(q>.83&&q<.89&&y<174)hu=260;}}
// clavicles and scapulae
if(z>350&&z<385&&(tube(x,y,z,124,92,365,82,99,370,4)||tube(x,y,z,132,92,365,174,99,370,4)))hu=690;if(z>245&&z<360&&(shell(x,y,z,73,145,305,25,9,58,.18)||shell(x,y,z,183,145,305,25,9,58,.18)))hu=560;
// subtle skin/fat distinction
if(body&&!core)hu=-92+Math.round(8*Math.sin(x*.17+y*.11+z*.03));}
b.writeInt16LE(Math.max(-1024,Math.min(3071,Math.round(hu))),((z*ny+y)*nx+x)*2)}
const dir='public/cases/bucky-adult-normal-01';await mkdir(dir,{recursive:true});const gz=gzipSync(b,{level:9});await writeFile(`${dir}/volume.i16.gz`,gz);const manifest={version:1,caseId:'bucky-adult-normal-01',encoding:'int16-le',compression:'gzip',dimensions:[nx,ny,nz],spacingMm:[sp,sp,sp],volumeUrl:'/cases/bucky-adult-normal-01/volume.i16.gz',huRange:[-1000,780],source:{name:'Bucky Lab Patient Anatomy',record:'Build-generated anatomical teaching volume',doi:'',case:'bucky-adult-normal-01',patientType:'synthetic',licence:'Bucky Lab generated asset'},canonical:{orientation:'RAS+',voxelOrder:'x-fastest',sourceAffine:[[sp,0,0,-318.75],[0,sp,0,-318.75],[0,0,sp,-638.75],[0,0,0,1]],affine:[[sp,0,0,-318.75],[0,sp,0,-318.75],[0,0,sp,-638.75],[0,0,0,1]]},provenance:{kind:'bucky-lab-synthetic',method:'volumetric-hu-anatomy-v2',clinicalSource:false,qualityReferences:['VSDFullBody','TCIA Healthy-Total-Body-CTs'],notes:'Synthetic educational thorax with lungs, airways, mediastinum, heart, great vessels, diaphragm, upper abdominal organs, vertebral cortical/cancellous structure, ribs, sternum, clavicles and scapulae. Not a clinical patient scan.'}};await writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2));console.log(`Generated ${dir}: ${gz.length} compressed bytes`);
