import {useState} from 'react';
import {EXPOSURE_REFERENCE_LIBRARY, exposureReference} from '../core/exposure-reference-library';
import reviewed from '../core/real-radiograph-manifest.json';
import './ExposureReferenceLibrary.css';

interface RealImage{file:string;note:string;author:string;licence:string;sourceUrl:string;markers:{x:number;y:number;label:string}[]}
const radiographs:Record<string,RealImage>=reviewed;

function ReferenceIllustration({src,alt,caption}: {src:string;alt:string;caption:string}){
 const[error,setError]=useState(false);
 return <figure className="reference-illustration">{error?<p role="alert">This schematic could not be loaded. Consult the written guidance.</p>:<img src={src} alt={alt} loading="eager" decoding="async" onError={()=>setError(true)}/>}
  <figcaption>{caption}</figcaption></figure>;
}
function ClinicalRadiograph({examId,title,record}: {examId:string;title:string;record:RealImage}){
 const[error,setError]=useState(false);
 const [showLabels,setShowLabels]=useState(true);
 return <figure className="reference-real-figure">
  <p className="reference-image-kind">Real radiograph · {title}</p>
  {error?<p role="alert">The verified clinical radiograph could not be loaded. Refer to written projection guidance.</p>:
   <div className="reference-real-image-wrap">
    <img key={examId} className="reference-real-image" data-clinical-reference={examId} src={`/clinical-reference/${examId}.jpg`} alt={`Clinical radiograph of ${title.toLowerCase()}, as acquired. ${record.note}`} loading="eager" decoding="async" onError={()=>setError(true)}/>
    {showLabels && record.markers.map((m,i)=><span key={m.label} className="reference-anatomy-pin" style={{left:`${m.x}%`,top:`${m.y}%`}} title={m.label} aria-label={`${i+1}: ${m.label}`}>{i+1}</span>)}
   </div>}
  <figcaption>
   <strong>Expected radiographic anatomy — not a photograph of patient positioning.</strong>
   <p>{record.note}</p>
   {record.markers.length>0&&<><button className="reference-toggle-labels" type="button" aria-pressed={showLabels} onClick={()=>setShowLabels(v=>!v)}>{showLabels?'Hide':'Show'} anatomical labels</button>
   <ol className="reference-anatomy-key">{record.markers.map(m=><li key={m.label}>{m.label}</li>)}</ol></>}
   <p>Image by {record.author}. <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer">Original and attribution</a> · {record.licence}. No clinical positioning photograph is claimed.</p>
  </figcaption>
 </figure>;
}
export function ExposureReferenceLibrary(){
 const[start,setStart]=useState(EXPOSURE_REFERENCE_LIBRARY[0]?.id??''),entry=exposureReference(start);
 const real=radiographs[entry.id];
 return <section className="exposure-library">
  <div className="reference-library-head"><div><span className="panel-kicker">EXAMINATION REFERENCE</span><h2>Examination guidance</h2><p>Select a projection to inspect radiographic appearance, patient setup, centring and image evaluation criteria.</p></div>
   <label>Projection<select value={entry.id} onChange={e=>setStart(e.target.value)}>{EXPOSURE_REFERENCE_LIBRARY.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
  </div>
  <section className="reference-images-section" aria-label="Projection-specific examples">
   <h3>{real?'Real radiograph and positioning guidance':'Positioning and collimation references'}</h3>
   {real?<div className="reference-real-grid">
    <ClinicalRadiograph key={entry.id} examId={entry.id} title={entry.title} record={real}/>
    <article className="reference-position-steps"><h4>How to position the patient</h4>
      <p>This is written positioning guidance, not a photo of the patient or the detector. For procedures requiring adjustment, consult your department's approved technique and Clark’s.</p>
      <ol>{entry.positioning.map(step=><li key={step}>{step}</li>)}</ol>
      <h4>Centring point</h4><p>{entry.centringPoint}</p>
      <h4>Collimation / area of interest</h4><p>{entry.areaOfInterest}</p>
     </article>
   </div>:<><p className="reference-source-note">A verified photographic or radiographic example has not yet been integrated for this projection. Earlier generated artwork is a simplified schematic and not clinically verified patient anatomy.</p>
    <div className="reference-visuals">
     {entry.positionImage&&<ReferenceIllustration key={entry.positionImage} src={entry.positionImage} alt={`${entry.title}: unverified positioning schematic`} caption="Unverified schematic only — not a clinically accurate photograph."/>}
     {entry.collimationImage&&<ReferenceIllustration key={entry.collimationImage} src={entry.collimationImage} alt={`${entry.title}: schematic of collimation and centring`} caption="Diagrammatic collimation and central-ray illustration — not to scale."/>}
    </div></>}
  </section>
  <div className="reference-summary"><article><h3>Centring</h3><p>{entry.centringPoint}</p></article><article><h3>Area of interest</h3><p>{entry.areaOfInterest}</p></article></div>
  <div className="reference-teaching-grid">
   <article><h3>Positioning</h3><ul>{entry.positioning.map(x=><li key={x}>{x}</li>)}</ul></article>
   <article><h3>Expected anatomy</h3><ul>{entry.expectedAnatomy.map(x=><li key={x}>{x}</li>)}</ul></article>
   <article><h3>Check for rotation</h3><ul>{entry.rotationChecks.map(x=><li key={x}>{x}</li>)}</ul></article>
   <article><h3>Image evaluation criteria</h3><ul>{entry.qualityChecks.map(x=><li key={x}>{x}</li>)}</ul></article>
  </div>
  <div className="reference-exposure"><strong>Average adult example</strong><span>{entry.exposure.kVp} kVp</span><span>{entry.exposure.mAs} mAs</span><span>{entry.exposure.sidCm} cm SID</span><span>{entry.exposure.grid?'Grid':'No grid'}</span><span>{entry.exposure.aec?'AEC commonly used':'Manual exposure preset'}</span></div>
  <p className="reference-source-note">{entry.sourceNote}</p>
 </section>;
}
