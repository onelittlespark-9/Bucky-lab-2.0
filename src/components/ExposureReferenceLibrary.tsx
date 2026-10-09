import {useState} from 'react';
import {EXPOSURE_REFERENCE_LIBRARY, exposureReference} from '../core/exposure-reference-library';
import './ExposureReferenceLibrary.css';

function ReferenceIllustration({src, alt, caption}: {src: string; alt: string; caption: string}) {
 const [error,setError]=useState(false);
 return <figure className="reference-illustration">
  {error ? <p role="alert">This illustration could not be loaded. Written guidance remains available below.</p> :
   <img src={src} alt={alt} loading="eager" decoding="async" onError={()=>setError(true)}/>}
  <figcaption>{caption}</figcaption>
 </figure>;
}

export function ExposureReferenceLibrary(){
 const[start,setStart]=useState(EXPOSURE_REFERENCE_LIBRARY[0]?.id??''),entry=exposureReference(start);
 const hasImages=Boolean(entry.positionImage||entry.collimationImage);
 return <section className="exposure-library">
  <div className="reference-library-head"><div><span className="panel-kicker">EXAMINATION REFERENCE</span><h2>Examination guidance</h2><p>Select a projection to review positioning illustrations, centring and image evaluation criteria.</p></div>
   <label>Projection<select value={entry.id} onChange={e=>setStart(e.target.value)}>{EXPOSURE_REFERENCE_LIBRARY.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
  </div>
  <section className="reference-images-section" aria-label="Projection-specific positioning illustrations">
   <h3>Positioning & collimation illustrations</h3>
   {hasImages ? <>
    <p className="reference-source-note">Generated Bucky Lab teaching schematics, not clinical photographs or reproductions of Clark’s illustrations. Compare each diagram with the written projection criteria and local protocols.</p>
    <div className="reference-visuals">
     {entry.positionImage&&<ReferenceIllustration key={entry.positionImage} src={entry.positionImage}
       alt={`${entry.title}: diagram of the required patient and limb position with labelled relationships.`}
       caption="Patient positioning schematic. Arm and detector relationships are illustrated; not to scale."/>}
     {entry.collimationImage&&<ReferenceIllustration key={entry.collimationImage} src={entry.collimationImage}
       alt={`${entry.title}: diagram of the required light field, centring and anatomical coverage.`}
       caption="Centring and collimation schematic. Refer to the stated anatomical field boundaries below."/>}
    </div>
   </> : <p className="reference-image-missing">A projection-specific illustration has not yet been validated for this examination. No generic or anatomically unverified image is substituted. The written positioning guidance remains available.</p>}
  </section>
  <div className="reference-summary"><article><h3>Centring</h3><p>{entry.centringPoint}</p></article>
   <article><h3>Area of interest</h3><p>{entry.areaOfInterest}</p></article></div>
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
