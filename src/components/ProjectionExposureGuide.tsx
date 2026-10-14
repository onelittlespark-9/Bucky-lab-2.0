import {useState} from 'react';
import {PROJECTION_EXPOSURE_GUIDES,projectionExposure,type ProjectionExposureGuide} from '../core/projection-exposures';
import reviewed from '../core/real-radiograph-manifest.json';
import './ProjectionExposureGuide.css';

interface RealImage {file:string;author:string;licence:string;note:string;sourceUrl:string}
const radiographs:Record<string,RealImage>=reviewed;
const regions=[...new Set(PROJECTION_EXPOSURE_GUIDES.map(p=>p.region))];

function ProjectionExample({guide}:{guide:ProjectionExposureGuide}){
 const record=radiographs[guide.id];
 const chest=guide.id==='chest-pa-erect';
 if(!record&&!chest)return <p className="exposure-unavailable-example">An authentic, projection-matched radiograph has not yet been added for this examination. The exposure guidance and quality criteria remain available; no substitute anatomy image is shown.</p>;
 const source=chest?'/clinical-reference/chest-pa-normal.jpg':`/clinical-reference/${guide.id}.jpg`;
 const credit=chest?{name:'Mikael Häggström',url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',licence:'CC0 1.0'}:{name:record.author,url:record.sourceUrl,licence:record.licence};
 return <figure className="exposure-real-example">
  <img key={guide.id} src={source} loading="lazy" decoding="async" alt={`Real reference radiograph for ${guide.title}. Separate published clinical image, not a Bucky Lab simulated exposure.`}/>
  <figcaption>Real example of expected radiographic anatomy; this image was <strong>not</strong> acquired using the numerical teaching preset above. Image: {credit.name} · <a href={credit.url} target="_blank" rel="noopener noreferrer">source</a> · {credit.licence}.</figcaption>
 </figure>;
}

export function ProjectionExposureDetails({guide,compact=false}: {guide:ProjectionExposureGuide;compact?:boolean}){
 return <section className={compact?'projection-exposure-details projection-exposure-details--compact':'projection-exposure-details'} data-projection-exposure={guide.id}>
  <h3>{compact?'Exposure factors for this projection':'Exposure teaching preset'}</h3>
  <p className="exposure-strong-warning">Bucky Lab 2.0 simulator starting values for an average adult — <strong>not</strong> a clinical exposure chart or a patient-specific prescription. Use locally authorised techniques, radiographer judgement and IR(ME)R optimisation.</p>
  <div className="projection-exposure-factors">
   <div className="projection-exposure-factor" data-factor="kvp"><span>Tube potential</span><strong>{guide.preset.kVp} kVp</strong><small>Beam energy / penetration</small></div>
   <div className="projection-exposure-factor" data-factor="mas"><span>Tube charge-time product</span><strong>{guide.preset.mAs} mAs</strong><small>Photon output / noise</small></div>
   <div className="projection-exposure-factor" data-factor="sid"><span>Source–image distance</span><strong>{guide.preset.sidCm} cm</strong><small>Geometry and beam fluence</small></div>
   <div className="projection-exposure-factor" data-factor="grid"><span>Grid preset</span><strong>{guide.preset.grid?'On':'Off'}</strong><small>Scatter control setting</small></div>
   <div className="projection-exposure-factor" data-factor="aec"><span>AEC flag</span><strong>{guide.preset.aec?'On':'Off'}</strong><small>Simulator configuration</small></div>
  </div>
  <p className="exposure-aec-note">{guide.preset.aec
   ?'AEC is flagged in the stored preset. On real equipment, selected chambers, anatomy and backup limits determine termination; this mAs is a simulator example, not a predicted delivered mAs.'
   :'No AEC flag is set in this simulator preset. This does not mean real equipment must use manual exposure for this examination.'}</p>
  <div className="projection-exposure-grid">
   <article><h4>Projection-specific considerations</h4><p>{guide.learningFocus}</p><p>{guide.anatomicalConsideration}</p></article>
   <article><h4>Geometry and centring</h4><dl>
    <dt>Receptor</dt><dd>{guide.detector}</dd>
    <dt>Beam</dt><dd>{guide.beam}</dd>
    <dt>Tube angle</dt><dd>{guide.tubeAngleDeg}° (simulator setting)</dd>
    <dt>Breathing</dt><dd>{guide.respiration==='arrested-inspiration'?'Hold on inspiration':guide.respiration==='arrested-expiration'?'Hold on expiration':'No specific instruction stored'}</dd>
    <dt>Centre</dt><dd>{guide.centringPoint}</dd>
   </dl></article>
   <article><h4>Image-quality checks</h4><ul>{guide.qualityChecks.map(check=><li key={check}>{check}</li>)}</ul></article>
   <article><h4>Anatomical coverage</h4><p>{guide.areaOfInterest}</p><p>Check patient habitus, pathology, immobilisation, receptor and equipment limitations before selecting a real clinical technique.</p></article>
  </div>
 </section>;
}

export function ProjectionExposureGuide({onReference,onPractise}:{onReference:(id:string)=>void;onPractise:(id:string)=>void}){
 const [region,setRegion]=useState(regions[0]);
 const options=PROJECTION_EXPOSURE_GUIDES.filter(g=>g.region===region);
 const [id,setId]=useState(PROJECTION_EXPOSURE_GUIDES[0].id);
 const guide=projectionExposure(id)??options[0];
 function changeRegion(next:string){
  const first=PROJECTION_EXPOSURE_GUIDES.find(g=>g.region===next);
  if(first){setRegion(next);setId(first.id);}
 }
 return <section className="projection-exposure-guide" aria-labelledby="projection-exposure-heading">
  <div className="projection-exposure-intro"><span className="panel-kicker">PROJECTION EXPOSURES</span>
   <h2 id="projection-exposure-heading">Exposure guidance by examination</h2>
   <p>Explore the stored teaching technique for all {PROJECTION_EXPOSURE_GUIDES.length} projections. Each projection has its own values, centring details and image evaluation notes.</p>
  </div>
  <div className="projection-exposure-selectors">
   <label>Exposure anatomical area<select value={region} onChange={event=>changeRegion(event.target.value)}>{regions.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
   <label>Exposure projection<select value={guide.id} onChange={event=>setId(event.target.value)}>{options.map(option=><option key={option.id} value={option.id}>{option.projection}</option>)}</select></label>
  </div>
  <div className="projection-exposure-choices" aria-label="Projections in this anatomical area">
   {options.map(option=><button type="button" key={option.id} aria-pressed={guide.id===option.id} className={guide.id===option.id?'active':''} onClick={()=>setId(option.id)}>{option.projection}</button>)}
  </div>
  <div className="projection-exposure-selected" data-exposure-id={guide.id}>
   <h3>{guide.title}</h3>
   <ProjectionExposureDetails key={guide.id} guide={guide}/>
   <div className="projection-exposure-example"><h3>Projection-specific radiograph</h3><ProjectionExample key={guide.id} guide={guide}/></div>
   <div className="projection-exposure-actions">
    <button type="button" onClick={()=>onReference(guide.id)}>View positioning reference for this projection</button>
    <button type="button" onClick={()=>onPractise(guide.id)}>Open this projection in the X-ray workspace</button>
   </div>
  </div>
 </section>;
}
