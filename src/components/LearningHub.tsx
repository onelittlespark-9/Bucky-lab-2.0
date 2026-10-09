import {useEffect, useRef, useState, type ReactNode} from 'react';
import {LEARNING_MODULES} from '../core/learning-library';
import {LEARNING_VISUALS, type LearningVisual} from '../core/learning-visuals';
import './LearningVisuals.css';
import {ExposureReferenceLibrary} from './ExposureReferenceLibrary';

const AREAS = [
  ...LEARNING_MODULES.map(m => ({id: m.topic, title: m.title, summary: m.summary})),
  {id: 'reference', title: 'Examination reference', summary: 'Find written positioning, centring, collimation and image evaluation guidance by projection.'},
  {id: 'reporting', title: 'Image critique & reporting', summary: 'Practise a systematic image review in the radiography workspace.'},
];

function LearningExample({item}: {item: LearningVisual}) {
  const [labelled,setLabelled]=useState(true);
  return <figure className={item.kind==='clinical'?'learning-example learning-example--clinical':'learning-example'}>
    {item.kind==='clinical'?<div className="learning-clinical-stage">
      <div className="learning-clinical-image-wrap">
        <img className="learning-example-image learning-clinical-image" src={item.src} alt={item.alt} loading="eager" decoding="async"/>
        {labelled&&item.markers?.map((m,i)=><span className="learning-clinical-marker" key={m.label}
          style={{left:`${m.x}%`,top:`${m.y}%`}} title={m.label} aria-label={m.label}>{i+1}</span>)}
      </div>
    </div>:<img className="learning-example-image" src={item.src} alt={item.alt} loading="eager" decoding="async"/>}
    <figcaption>
      <strong>{item.title}</strong><p>{item.caption}</p>
      {item.kind==='clinical'&&<>
        {item.markers&&<div className="learning-clinical-key">
          <button type="button" aria-pressed={labelled} onClick={()=>setLabelled(v=>!v)}>{labelled?'Hide':'Show'} anatomy pointers</button>
          <ol>{item.markers.map(m=><li key={m.label}>{m.label}</li>)}</ol>
        </div>}
        <p className="learning-clinical-credit">Real clinical image: {item.source?.author}. <a href={item.source?.url} target="_blank" rel="noopener noreferrer">View source</a> · {item.source?.licence}. These examples are not produced by the simulator.</p>
      </>}
    </figcaption>
  </figure>;
}
function VisualExamples({items}: {items: LearningVisual[]}) {
  const clinical=items.some(item=>item.kind==='clinical');
  return <section className="learning-visual-section" aria-label="Teaching images and examples">
    <h2>Visual examples</h2>
    <div className={clinical?'learning-visual-grid learning-visual-grid--clinical':'learning-visual-grid'}>
      {items.map(item=><LearningExample key={item.src} item={item}/>)}
    </div>
    <p className="learning-visual-provenance">{clinical
      ?'Clinical images are separate, credited examples; pointers show approximate anatomical locations. They are not the live simulator patient or a substitute for interpreting a complete examination.'
      :'Generated educational teaching diagrams are illustrative and not to scale. They are not patient images or substitutes for validated clinical positioning references.'}</p>
  </section>;
}

export function LearningHub({pathology, onXray, onCt}: {
  pathology: ReactNode; onXray: () => void; onCt: () => void;
}) {
  const [area, setArea] = useState<string | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {title.current?.focus(); window.scrollTo(0, 0);}, [area]);
  const selected = AREAS.find(a => a.id === area);
  const module = LEARNING_MODULES.find(m => m.topic === area);
  return <section className="learning-hub" aria-labelledby="learning-title">
    {selected && <button className="back-link" onClick={() => setArea(null)}>← All learning areas</button>}
    <p className="eyebrow">LEARNING</p>
    <h1 ref={title} id="learning-title" tabIndex={-1}>{selected?.title ?? 'Choose a learning area'}</h1>
    <p className="page-intro">{selected?.summary ?? 'Open one topic at a time. Return here whenever you want to change focus.'}</p>
    {!selected && <div className="area-grid">{AREAS.map(a => <button className="area-card" key={a.id} onClick={() => setArea(a.id)}>
      <img className="learning-card-preview" src={LEARNING_VISUALS[a.id][0].src} alt="" loading="lazy" decoding="async"/>
      <strong>{a.title}</strong><span>{a.summary}</span><span className="area-link">Open area →</span>
    </button>)}</div>}
    {area && area !== 'pathology' && area !== 'reference' && <VisualExamples items={LEARNING_VISUALS[area]}/>}
    {module && area !== 'pathology' && <article className="learning-topic learning-detail"><h2>{module.title}</h2>
      <ul>{module.points.map(point => <li key={point}>{point}</li>)}</ul>
    </article>}
    {area === 'anatomy' && <article className="learning-detail"><h2>Anatomy labelling</h2>
      <p>Open an acquired X-ray or CT image, then activate Learning overlay to review the available labels.</p>
      <div className="learning-actions"><button onClick={onXray}>Choose an X-ray examination</button><button onClick={onCt}>Open CT lab</button></div>
    </article>}
    {area === 'pathology' && <>{pathology}<details className="pathology-search-reminder"><summary>Systematic search reminder</summary>
      <ul><li>Inspect the complete image before focusing on the suspected abnormality.</li><li>Describe location, morphology and effect on adjacent structures.</li><li>Reveal the findings after forming an initial interpretation.</li></ul>
    </details><div className="learning-actions"><button onClick={onCt}>Practise CT review</button></div></>}
    {area === 'reference' && <ExposureReferenceLibrary/>}
    {(area === 'positioning' || area === 'exposure' || area === 'room') && <div className="learning-actions">
      <button onClick={() => setArea('reference')}>Browse examination reference</button>
      <button onClick={onXray}>Choose an X-ray examination</button>
    </div>}
    {area === 'reporting' && <article className="learning-detail"><h2>Review an acquired image</h2>
      <p>Choose an examination, position the patient and expose an image. The image critique area then opens for review of positioning, anatomy coverage, centring, collimation, rotation, exposure and artefacts.</p>
      <p>Structured report entry is not yet available.</p>
      <button onClick={onXray}>Choose an X-ray examination</button>
    </article>}
  </section>;
}
