import type{PatientSex}from'./patients';
import type{CtAnatomyRegion,CtProtocol,ContrastPhase}from'./ct-protocols';

export interface CtSeriesDescriptor{
 id:string;sex:PatientSex;region:CtAnatomyRegion;phase:ContrastPhase;manifestUrl:string;
 coverageLandmarks:string[];reconstruction:string;detail:string;availability:'ready'|'build-required';
}

// Every CT protocol resolves to its own acquisition path. The viewer must never substitute the
// patient's whole-body radiography/scout volume when this manifest is absent.
export const CT_SERIES:CtSeriesDescriptor[]=[];

export function ctSeriesId(sex:PatientSex,region:CtAnatomyRegion,phase:ContrastPhase,reconstruction='thin-axial'){
 return`${sex}-${region}-${phase}-${reconstruction}`;
}
export function ctSeriesManifestUrl(sex:PatientSex,protocol:CtProtocol,phase:ContrastPhase){
 return`/cases/ct/${sex}/${protocol.region}/${phase}/manifest.json`;
}
export function resolveCtSeries(sex:PatientSex,protocol:CtProtocol,phase:ContrastPhase,reconstruction='thin-axial'){
 return CT_SERIES.find(s=>s.sex===sex&&s.region===protocol.region&&s.phase===phase&&s.reconstruction===reconstruction&&s.availability==='ready')??null;
}
export function expectedCtSeries(sex:PatientSex,protocol:CtProtocol,phase:ContrastPhase):CtSeriesDescriptor{
 return{id:ctSeriesId(sex,protocol.region,phase),sex,region:protocol.region,phase,manifestUrl:ctSeriesManifestUrl(sex,protocol,phase),coverageLandmarks:protocol.coverageLandmarks,reconstruction:'thin-axial',detail:protocol.detailTarget,availability:'build-required'};
}
export function assertDedicatedCtSeries(series:CtSeriesDescriptor|null,protocol:CtProtocol):CtSeriesDescriptor{
 if(!series)throw new Error(`${protocol.label} acquisition unavailable — dedicated ${protocol.coverage} volume required`);
 return series;
}
