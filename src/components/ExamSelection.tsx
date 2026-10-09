import {useEffect, useRef, useState, type ReactNode} from 'react';
import {RADIOGRAPHIC_POSITIONS} from '../core/radiographic-positions';
import {canExposeExamination} from '../core/xray-volume';
import type {PatientSex} from '../core/patients';

export function ExamSelection({sex, patient, onSelect}: {
  sex: PatientSex; patient: ReactNode; onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {title.current?.focus(); window.scrollTo(0, 0);}, [region]);
  const matching = RADIOGRAPHIC_POSITIONS.filter(p =>
    `${p.region} ${p.projection}`.toLowerCase().includes(query.trim().toLowerCase()));
  const regions = [...new Set(matching.map(p => p.region))];
  return <section className="exam-selection" aria-labelledby="exam-title">
    <p className="eyebrow">RADIOGRAPHY LAB</p>
    <h1 ref={title} id="exam-title" tabIndex={-1}>{region ? `${region} projections` : 'Choose an examination'}</h1>
    <p className="page-intro">Select an anatomical area and projection to open the X-ray workspace.</p>
    <div className="exam-filters">{patient}{!region && <label>Search examinations
      <input type="search" value={query} placeholder="For example, chest or elbow" onChange={e => setQuery(e.target.value)}/>
    </label>}</div>
    {region ? <>
      <button onClick={() => setRegion(null)}>← All examinations</button>
      {!canExposeExamination(sex, region) && <p className="availability-note">Positioning practice is available. Exposure is unavailable for this patient and anatomical area.</p>}
      <div className="area-grid">{RADIOGRAPHIC_POSITIONS.filter(p => p.region === region).map(p =>
        <button className="area-card" key={p.id} onClick={() => onSelect(p.id)}>
          <span className="panel-kicker">{p.region}</span><strong>{p.projection}</strong>
          <span>Open positioning workspace →</span>
        </button>)}</div>
    </> : <>
      <div className="area-grid">{regions.map(name => <button className="area-card" key={name} onClick={() => setRegion(name)}>
        <strong>{name}</strong>
        <span>{RADIOGRAPHIC_POSITIONS.filter(p => p.region === name).map(p => p.projection).join(' · ')}</span>
        <span className="area-link">Choose projection →</span>
      </button>)}</div>
      {regions.length === 0 && <p role="status">No examinations match “{query}”. Try another anatomical area or projection.</p>}
    </>}
  </section>;
}
