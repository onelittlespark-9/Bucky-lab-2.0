import {useEffect, useRef, useState, type ReactNode} from 'react';
import {LEARNING_MODULES} from '../core/learning-library';
import {ExposureReferenceLibrary} from './ExposureReferenceLibrary';

const AREAS = [
  ...LEARNING_MODULES.map(m => ({id: m.topic, title: m.title, summary: m.summary})),
  {id: 'reference', title: 'Examination reference', summary: 'Find written positioning, centring, collimation and image evaluation guidance by projection.'},
  {id: 'reporting', title: 'Image critique & reporting', summary: 'Practise a systematic image review in the radiography workspace.'},
];

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
      <strong>{a.title}</strong><span>{a.summary}</span><span className="area-link">Open area →</span>
    </button>)}</div>}
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
