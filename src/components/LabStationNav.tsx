import React from'react';
export type LabStation='vetting'|'positioning'|'exposure'|'critique'|'learning'|'drill';
const STATIONS:[LabStation,string,string][]=[
 ['vetting','Request','Vetting'],['positioning','Position','Positioning'],['exposure','Technique','Exposure'],['critique','Critique','Image review'],['learning','Learn','Anatomy & pathology'],['drill','Drill','Quick practice']
];
export function LabStationNav({value,onChange}:{value:LabStation;onChange:(s:LabStation)=>void}){return <nav className="station-nav" aria-label="Clinical learning stations">{STATIONS.map(([id,short,label])=><button key={id} type="button" className={value===id?'active':''} aria-current={value===id?'page':undefined} onClick={()=>onChange(id)}><strong>{short}</strong><span>{label}</span></button>)}</nav>}
