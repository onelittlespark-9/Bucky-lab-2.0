import type{TeachingVolume}from'./teaching-volume';import{radiographImage,renderRadiographWhenMounted}from'./radiograph-image';
export type ProjectionView='AP'|'PA'|'LATERAL';
export interface CollimatorEdges{left:number;right:number;top:number;bottom:number}
export interface ProjectionOptions{axis?:'x'|'y'|'z';patientXPercent?:number;patientYPercent?:number;view?:ProjectionView;stepVoxels?:number;kVp:number;mAs:number;sidCm?:number;rotationDeg?:number;fieldPercent?:number;collimation?:Partial<CollimatorEdges>;centreXPercent?:number;centreYPercent?:number;tubeAngleDeg?:number;seed?:number;detectorWidthCm?:number;detectorHeightCm?:number}
function attenuation(hu:number,kVp:number){if(hu<=-950)return .00002;const density=Math.max(.02,(hu+1000)/1000),e=Math.max(.45,Math.min(1.6,kVp/100));let compton=.012,photo=.003;if(hu<-500){compton=.004;photo=.0005}else if(hu<-80){compton=.010;photo=.0018}else if(hu>250){compton=.016;photo=.022*Math.min(2.2,1+hu/1200)}return Math.max(.00001,density*(compton/e+photo/Math.pow(e,3)))}
function rng(seed:number){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}}
export function detectorGeometry(v:TeachingVolume,o:ProjectionOptions){const[nx,ny]=v.source.manifest.dimensions,[sx,sy]=v.source.manifest.spacingMm,view=o.view??(o.axis==='x'?'LATERAL':'AP'),lateral=view==='LATERAL',sidMm=Math.max(900,(o.sidCm??180)*10),depthMm=lateral?nx*sx:ny*sy;return{sidMm,depthMm,magnification:sidMm/Math.max(1,sidMm-depthMm/2),inverseSquare:Math.pow(1800/sidMm,2)}}
function sample(v:TeachingVolume,x:number,y:number,z:number){const[nx,ny,nz]=v.source.manifest.dimensions,xi=Math.round(x),yi=Math.round(y),zi=Math.round(z);if(xi<0||yi<0||zi<0||xi>=nx||yi>=ny||zi>=nz)return-1000;return v.huAt(xi,yi,zi)}
export function projectVolume(v:TeachingVolume,o:ProjectionOptions){
 const[nx,ny,nz]=v.source.manifest.dimensions,[sx,sy,sz]=v.source.manifest.spacingMm,view=o.view??(o.axis==='x'?'LATERAL':'AP'),lateral=view==='LATERAL';
 const detW=(o.detectorWidthCm??35)*10,detH=(o.detectorHeightCm??43)*10,pixelMm=1.5,width=Math.max(160,Math.min(512,Math.round(detW/pixelMm))),height=Math.max(180,Math.min(640,Math.round(detH/pixelMm))),raw=new Float32Array(width*height),mask=new Uint8Array(width*height),random=rng(o.seed??1),step=Math.max(1,o.stepVoxels??1),geometry=detectorGeometry(v,o),sidMm=geometry.sidMm,inverseSquare=geometry.inverseSquare,kvOutput=Math.pow(Math.max(40,o.kVp)/100,2),depthMm=geometry.depthMm,incidentPhotons=Math.max(50,o.mAs*4200*kvOutput*inverseSquare),magnification=geometry.magnification,angle=(o.rotationDeg??0)*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle),bounds=v.source.manifest.coverage?.sourceBounds,sourcePatient=v.source.manifest.coverage?.sourcePatient,sourceDims=sourcePatient?.dimensions,patientCx=sourceDims?(sourceDims[0]-1)/2:(nx-1)/2,patientCy=sourceDims?(sourceDims[1]-1)/2:(ny-1)/2,patientCz=sourceDims?(sourceDims[2]-1)/2:(nz-1)/2,patientShiftX=(o.patientXPercent??0)/100*detW/sx,patientShiftZ=(o.patientYPercent??0)/100*detH/sz,ox=bounds?.x0??0,oy=bounds?.y0??0,oz=bounds?.z0??0,cx=patientCx-ox+patientShiftX,cy=patientCy-oy,cz=patientCz-oz+patientShiftZ,sourceDistanceMm=sidMm-depthMm/2,detectorDistanceMm=depthMm/2,field=Math.max(.05,Math.min(1,(o.fieldPercent??100)/100)),fallback=(1-field)*50,edges={left:o.collimation?.left??fallback,right:o.collimation?.right??fallback,top:o.collimation?.top??fallback,bottom:o.collimation?.bottom??fallback},tube=Math.tan((o.tubeAngleDeg??0)*Math.PI/180),fieldArea=Math.max(.04,(1-(edges.left+edges.right)/100)*(1-(edges.top+edges.bottom)/100)),scatterFraction=.02+.16*Math.sqrt(fieldArea);let raySamples=0;
 for(let j=0;j<height;j++)for(let i=0;i<width;i++){
  const px=(i+.5)/width*100,py=(j+.5)/height*100,idx=j*width+i;if(px<edges.left||px>100-edges.right||py<edges.top||py>100-edges.bottom)continue;mask[idx]=1;
  const uMm=((i+.5)/width-.5)*detW/magnification-(o.centreXPercent??0)/100*detW,zMm=((j+.5)/height-.5)*detH/magnification-(o.centreYPercent??0)/100*detH;let src:[number,number,number],det:[number,number,number];
  // Construct rays in physical millimetres, then convert each axis independently to voxel
  // coordinates. Mixing source-axis voxel units with z/x coordinates collapses the projected
  // anatomy whenever voxel spacing differs or the regional crop has unequal dimensions.
  if(lateral){src=[cx-sourceDistanceMm/sx,cy,cz-sourceDistanceMm*tube/sz];det=[cx+detectorDistanceMm/sx,cy+uMm/sy,cz+zMm/sz]}else{const pa=view==='PA',sdir=pa?1:-1;src=[cx,cy+sdir*sourceDistanceMm/sy,cz-sourceDistanceMm*tube/sz];det=[cx+uMm/sx,cy-sdir*detectorDistanceMm/sy,cz+zMm/sz]}
  const dx=det[0]-src[0],dy=det[1]-src[1],dz=det[2]-src[2],distance=Math.sqrt(dx*dx+dy*dy+dz*dz),samples=Math.max(1,Math.ceil(distance/step));let sum=0,count=0;
  for(let q=0;q<=samples;q++){const t=q/samples,x=src[0]+dx*t,y=src[1]+dy*t,z=src[2]+dz*t,rx=c*(x-cx)-s*(y-cy)+cx,ry=s*(x-cx)+c*(y-cy)+cy,hu=sample(v,rx,ry,z);if(hu>-999){const stepX=dx/samples*sx,stepY=dy/samples*sy,stepZ=dz/samples*sz,mm=Math.sqrt(stepX*stepX+stepY*stepY+stepZ*stepZ);sum+=attenuation(hu,o.kVp)*mm;count++}}
  // Every ray inside the collimated beam irradiates the detector, including rays which traverse
  // only air outside a tightly cropped regional CT. Anatomy contributes attenuation; the crop
  // cuboid must never become an artificial image boundary.
  raySamples=Math.max(raySamples,count);const primary=Math.exp(-sum),scatter=scatterFraction*primary*Math.min(1,count/120),expected=Math.max(.5,incidentPhotons*(primary+scatter)),noise=(random()+random()+random()+random()-2)*Math.sqrt(expected),detected=Math.max(.25,expected+noise);raw[idx]=detected;
 }
 // Fixed calibrated teaching reference: it must not be derived from this exposure, otherwise mAs/SID changes cancel during display mapping.
 // More mAs/kVp output or shorter SID therefore changes receptor signal; low photon counts also increase quantum mottle.
 const reference=12500;const out=new Uint8ClampedArray(width*height);
 // Log transmission display calibrated to the reference exposure. Preserve exposure response but
 // use attenuation as the image-forming signal: air is dark, denser/thicker anatomy is brighter.
 const exposureShift=Math.log(Math.max(.05,incidentPhotons/reference));
 for(let i=0;i<out.length;i++){if(!mask[i]){out[i]=8;continue}const transmission=Math.max(1e-6,raw[i]/Math.max(1,incidentPhotons)),lineIntegral=-Math.log(transmission),display=lineIntegral*.78-exposureShift*.16;out[i]=Math.round(Math.max(8,Math.min(245,18+display*118)))}
 const flipped=new Uint8ClampedArray(out.length);for(let y=0;y<height;y++)flipped.set(out.subarray((height-1-y)*width,(height-y)*width),y*width);
 // Guard against a projection-space regression that collapses regional anatomy to a thumbnail.
 // This does not zoom or post-process the image: it measures the detector footprint produced by
 // the physical ray tracer so validation can fail instead of shipping an obviously invalid DRR.
 let minX=width,minY=height,maxX=-1,maxY=-1,anatomyPixels=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*width+x;if(mask[i]&&raw[i]<incidentPhotons*.92){anatomyPixels++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}}
 const anatomyBounds=maxX>=minX?{left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}:null,anatomyFraction=anatomyPixels/(width*height);
 // Keep the physical detector canvas. Regional CT bounds are anatomy data, not permission to
 // crop/zoom the acquired radiograph after exposure. Invalid occupancy must be fixed in geometry.
 const finalPixels=flipped,finalWidth=width,finalHeight=height;
 const image=radiographImage(finalWidth,finalHeight,finalPixels);renderRadiographWhenMounted(image);return{width:finalWidth,height:finalHeight,pixels:finalPixels,raySamples,anatomyBounds,anatomyFraction,exposure:{incidentPhotons,inverseSquare,fieldArea,scatterFraction,magnification}};
}
