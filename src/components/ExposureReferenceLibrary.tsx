import {useState} from 'react';
import {EXPOSURE_REFERENCE_LIBRARY, exposureReference} from '../core/exposure-reference-library';
import './ExposureReferenceLibrary.css';

export function ExposureReferenceLibrary(){
 const[start,setStart]=useState(EXPOSURE_REFERENCE_LIBRARY[0]?.id??''),entry=exposureReference(start);
 return <section className="exposure-library">
  <div className="reference-library-head"><div><span className="panel-kicker">EXPOSURE REFERENCE LIBRARY</span><h2>Examination guidance</h2><p>Select a projection to read its positioning and image evaluation guidance.</p></div>
   <label>Projection<select value={entry.id} onChange={e=>setStart(e.target.value)}>{EXPOSURE_REFERENCE_LIBRARY.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
  </div>
  <p className="reference-source-note">Positioning images and model previews have been removed. This reference currently provides written guidance only.</p>
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
