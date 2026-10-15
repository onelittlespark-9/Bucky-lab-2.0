import {useRef, useState} from 'react';
import {PATHOLOGY_LESSONS, pathologyLesson, type PathologyLesson} from '../core/imaging-learning-model';
import {pathologyImage, type PathologyImage} from '../core/pathology-images';
import './PathologyLessonPanel.css';

function LessonGuidance({lesson}: {lesson: PathologyLesson}) {
  return <div className="lesson-grid">{[
    ['What to identify', lesson.lookFor], ['Appearance', lesson.appearance],
    ['Views and assessment', lesson.bestViews], ['Pitfalls', lesson.pitfalls], ['Differentials', lesson.differentials],
  ].map(([title, points]) => <div key={title as string}><h3>{title}</h3>
    <ul>{(points as string[]).map(point => <li key={point}>{point}</li>)}</ul>
  </div>)}</div>;
}

function ReferenceCase({image, lesson}: {image: PathologyImage; lesson: PathologyLesson}) {
  const [revealed, setRevealed] = useState(false);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const findingsId = `findings-${lesson.id}`;
  return <div className="pathology-case" data-lesson={lesson.id}>
    <div className="pathology-case-grid">
      <figure className="pathology-figure">
        <div className="pathology-image-frame" data-state={state}>
          {state === 'loading' && <p role="status">Loading clinical reference image…</p>}
          {state === 'error' ? <div role="alert"><p>The reference image could not be loaded.</p>
            <button onClick={() => {setAttempt(n => n + 1); setState('loading');}}>Retry image</button>
          </div> : <img key={attempt} src={image.src} alt={image.alt} width={image.width} height={image.height}
            hidden={state !== 'ready'} onLoad={() => setState('ready')} onError={() => setState('error')}/>}
        </div>
        <figcaption><strong>{image.modality} · Published clinical example</strong>
          <p>{image.caption}</p>
        </figcaption>
        <button disabled={state !== 'ready'} onClick={() => dialog.current?.showModal()}>Enlarge image</button>
      </figure>
      <div className="pathology-findings">
        <span className="panel-kicker">INSPECT FIRST</span>
        <h3>{lesson.title}</h3>
        <p>Describe what you can see before revealing the findings. This reference is a separate case, not an image of the simulator’s selected patient.</p>
        <button disabled={state !== 'ready'} aria-expanded={revealed} aria-controls={findingsId} onClick={() => setRevealed(v => !v)}>
          {revealed ? 'Hide findings' : 'Reveal findings'}
        </button>
        <div id={findingsId} hidden={!revealed}>
          <h4>Findings in this image</h4><ul>{image.findings.map(f => <li key={f}>{f}</li>)}</ul>
        </div>
        <p className="pathology-limitation">{image.limitation}</p>
        <p className="pathology-credit">Image: {image.author}. <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a> · <a href={image.licenceUrl} target="_blank" rel="noopener noreferrer">{image.licence}</a>. {image.changes}</p>
        <a href={image.readingUrl} target="_blank" rel="noopener noreferrer">Further reading</a>
      </div>
    </div>
    {revealed && <figure className="learning-pathology-visual">
      <img className="learning-example-image" src={image.src} alt={image.alt} loading="eager"/>
      <figcaption><strong>{lesson.title}</strong><p>{image.caption}</p>
        <p>Published clinical reference image shown again for the teaching discussion. The original image is unchanged; refer to the diagnostic features identified above.</p><p>Source: {image.author} · <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.licence}</a></p></figcaption>
    </figure>}
    {revealed && <div className="pathology-guidance"><h3>General lesson guidance</h3><LessonGuidance lesson={lesson}/></div>}
    <dialog ref={dialog} className="pathology-dialog" aria-label={`${lesson.title} enlarged reference`}>
      <div className="pathology-dialog-bar"><strong>{lesson.title} · {image.modality}</strong><button autoFocus onClick={() => dialog.current?.close()}>Close image</button></div>
      {state === 'ready' && <img src={image.src} alt={image.alt} width={image.width} height={image.height}/>}
      <p>{image.caption}</p><p>Image: {image.author} · <a href={image.licenceUrl} target="_blank" rel="noopener noreferrer">{image.licence}</a></p>
    </dialog>
  </div>;
}

export function PathologyLessonPanel({lessonId, onLesson, showReferenceImages = false}: {
  lessonId: string; onLesson: (id: string) => void; showReferenceImages?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const regions = [...new Set(PATHOLOGY_LESSONS.flatMap(l => l.regions))].sort();
  const matches = PATHOLOGY_LESSONS.filter(l => (region === 'All regions' || l.regions.includes(region)) &&
    [l.title, ...l.regions, ...l.appearance, ...l.differentials].join(' ').toLowerCase().includes(query.toLowerCase().trim()));
  const selectedId = matches.some(l => l.id === lessonId) ? lessonId : matches[0]?.id;
  const lesson = selectedId ? pathologyLesson(selectedId) : undefined, image = selectedId ? pathologyImage(selectedId) : undefined;
  return <article className="learning-panel pathology-panel">
    <div className="panel-kicker">PATHOLOGY LEARNING</div>
    <h2>{showReferenceImages ? 'Pathology image library' : 'Pathology guidance'}</h2>
    <p>{showReferenceImages ? 'Select a condition, inspect its reference image and reveal the teaching points.' : 'General reference guidance; selecting a condition does not add that pathology to the acquired image.'}</p>
    <div className="pathology-filters"><div>
      <label htmlFor="pathology-query">Search pathology</label><input id="pathology-query" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Condition, finding or anatomy"/>
      </div><div><label htmlFor="pathology-region">Anatomical region</label><select id="pathology-region" value={region} onChange={e => setRegion(e.target.value)}><option>All regions</option>{regions.map(r => <option key={r}>{r}</option>)}</select></div>
    </div>
    <p role="status">{matches.length} of {PATHOLOGY_LESSONS.length} conditions · published image for every entry</p>
    {matches.length === 0 && <p>No conditions match. Try another search or region. <button onClick={() => {setQuery(''); setRegion('All regions');}}>Clear filters</button></p>}
    <label htmlFor="pathology-lesson">Pathology</label><select id="pathology-lesson" value={selectedId ?? ''} disabled={!matches.length} onChange={e => onLesson(e.target.value)}>
      {matches.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
    </select>
    {lesson && (showReferenceImages ? image ? <ReferenceCase key={image.lessonId} image={image} lesson={lesson}/> : <p role="status">No reference image is available for this lesson.</p> : <LessonGuidance lesson={lesson}/>)}
    {showReferenceImages && <p className="pathology-credit">Educational examples only. These are static published images, not generated X-rays or complete diagnostic examinations.</p>}
  </article>;
}
