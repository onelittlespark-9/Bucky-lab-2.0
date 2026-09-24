import{useEffect,useRef,useState}from'react';
import{ArticulatedPatient}from'./ArticulatedPatient';
import{EXPOSURE_REFERENCE_LIBRARY,exposureReference,type ExposureReferenceEntry}from'../core/exposure-reference-library';
import{RADIOGRAPHIC_POSITIONS}from'../core/radiographic-positions';
import{loadExaminationXrayVolume,canExposeExamination}from'../core/xray-volume';
import{createTeachingVolume}from'../core/teaching-volume';
import{createAcquisitionState,projectionOptions}from'../core/acquisition-geometry';
import{projectVolume}from'../core/drr';
import type{PatientSex}from'../core/patients';
import'./ExposureReferenceLibrary.css';

function draw(canvas:HTMLCanvasElement,pixels:Uint8ClampedArray,width:number,height:number){
 const ctx=canvas.getContext('2d');if(!ctx)return;canvas.width=width;canvas.height=height;
 const rgba=new Uint8ClampedArray(width*height*4);for(let i=0;i<pixels.length;i++){const v=pixels[i];rgba[i*4]=rgba[i*4+1]=rgba[i*4+2]=v;rgba[i*4+3]=255}
 ctx.putImageData(new ImageData(rgba,width,height),0,0);
}

function PatientReference({entry,field}:{entry:ExposureReferenceEntry;field:boolean}){
 const staticImage=field?entry.collimationImage:entry.positionImage;if(staticImage)return <div className="reference-patient-frame reference-static-frame"><img className="reference-static-image" src={staticImage} alt={`${entry.title} ${field?'collimation':'positioning'} reference`}/></div>;
 const p=RADIOGRAPHIC_POSITIONS.find(x=>x.id===entry.id)??RADIOGRAPHIC_POSITIONS[0],f=p.startingField;
 const width=100-f.left-f.right,height=100-f.top-f.bottom,left=f.left+f.centreX,top=f.top+f.centreY;
 return <div className="reference-patient-frame">
   <div className="reference-detector"/>
   <div className="reference-patient"><ArticulatedPatient pose={p.pose} rotation={p.pose.bodyYaw}/></div>
   {field&&<div className="reference-light-field" style={{left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`}}/>}
   <div className="reference-centre" style={{left:`${left+width/2}%`,top:`${top+height/2}%`}}/>
   <div className="reference-tag">{field?'LIGHT FIELD + CENTRE':'PATIENT POSITION + CENTRE'}</div>
 </div>
}

function GeneratedRadiograph({entry,sex}:{entry:ExposureReferenceEntry;sex:PatientSex}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const [state,setState]=useState<'loading'|'ready'|'unavailable'|'error'>('loading');
 const [status,setStatus]=useState('Generating educational reference…');
 useEffect(()=>{
  let live=true;
  const target=canvas.current;
  target?.getContext('2d')?.clearRect(0,0,target.width,target.height);
  const p=RADIOGRAPHIC_POSITIONS.find(x=>x.id===entry.id);
  if(!p||!canExposeExamination(sex,p.region)){
   setState('unavailable');
   setStatus(`${entry.title}: dedicated ${sex} anatomy is unavailable. No radiograph has been generated.`);
   return()=>{live=false};
  }
  setState('loading');setStatus('Generating educational reference…');
  loadExaminationXrayVolume(sex,p.region).then(({volume,regionalGeometry})=>{
   if(!live)return;
   const a=createAcquisitionState({position:p,patientSex:sex,bodyYawDeg:p.pose.bodyYaw,patientXPercent:0,patientYPercent:0,beamXPercent:p.startingField.centreX,beamYPercent:p.startingField.centreY,tubeAngleDeg:p.tubeAngleDeg,sidCm:p.exposure.sidCm,kVp:p.exposure.kVp,mAs:p.exposure.mAs,collimation:p.startingField,regionalGeometry});
   const result=projectVolume(createTeachingVolume(volume,'derived-from-real-source'),projectionOptions(a,29));
   if(!live||!target)return;
   draw(target,result.pixels,result.width,result.height);
   setState('ready');setStatus('Simulated from the stored preset; anatomical positioning is not verified.');
  }).catch(()=>{
   if(!live)return;
   target?.getContext('2d')?.clearRect(0,0,target.width,target.height);
   setState('error');setStatus('Reference generation failed. No radiograph is displayed. Choose another projection or try again.');
  });
  return()=>{live=false};
 },[entry.id,sex]);
 return <div className="reference-xray-frame" data-state={state}>
  <canvas ref={canvas} hidden={state!=='ready'} aria-label={`${entry.title} simulated radiograph`}/>
  <div className="reference-tag">EDUCATIONAL SIMULATION</div>
  <small role="status">{status}</small>
 </div>
}

export function ExposureReferenceLibrary({sex='male',initialId}:{sex?:PatientSex;initialId?:string}){
 const[start,setStart]=useState(initialId??EXPOSURE_REFERENCE_LIBRARY[0]?.id??''),entry=exposureReference(start);
 return <section className="exposure-library">
  <div className="reference-library-head"><div><span className="panel-kicker">EXPOSURE REFERENCE LIBRARY</span><h2>Position, collimate, expose, critique</h2><p>Browse positioning and collimation guidance for each preset. Simulated radiographs are available only where dedicated anatomy is registered.</p></div>
   <label>Projection<select value={entry.id} onChange={e=>setStart(e.target.value)}>{EXPOSURE_REFERENCE_LIBRARY.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
  </div>
  <div className="reference-image-grid"><article><h3>1. Correct patient position</h3><PatientReference entry={entry} field={false}/><p><b>Centring:</b> {entry.centringPoint}</p></article>
   <article><h3>2. Light-box collimation</h3><PatientReference entry={entry} field/><p><b>Area of interest:</b> {entry.areaOfInterest}</p></article>
   <article><h3>3. Simulated radiograph</h3><GeneratedRadiograph key={`${sex}:${entry.id}`} entry={entry} sex={sex}/><p>A generated image is not a verified positioning standard. Compare it with the expected anatomy and projection criteria below.</p></article>
  </div>
  <div className="reference-teaching-grid">
   <article><h3>Positioning</h3><ul>{entry.positioning.map(x=><li key={x}>{x}</li>)}</ul></article>
   <article><h3>Expected anatomy</h3><ul>{entry.expectedAnatomy.map(x=><li key={x}>{x}</li>)}</ul></article>
   <article><h3>Check for rotation</h3><ul>{entry.rotationChecks.map(x=><li key={x}>{x}</li>)}</ul></article>
   <article><h3>Image evaluation criteria</h3><ul>{entry.qualityChecks.map(x=><li key={x}>{x}</li>)}</ul></article>
  </div>
  <div className="reference-exposure"><strong>Average adult example</strong><span>{entry.exposure.kVp} kVp</span><span>{entry.exposure.mAs} mAs</span><span>{entry.exposure.sidCm} cm SID</span><span>{entry.exposure.grid?'Grid':'No grid'}</span><span>{entry.exposure.aec?'AEC commonly used':'Manual exposure preset'}</span></div>
  <p className="reference-source-note">{entry.sourceNote}</p>
 </section>
}
