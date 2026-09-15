import type{PatientSex}from'./patients';
import type{CtAnatomyRegion,CtProtocol,ContrastPhase}from'./ct-protocols';

export interface CtSeriesDescriptor{
 id:string;
 sex:PatientSex;
 region:CtAnatomyRegion;
 phase:ContrastPhase;
 manifestUrl:string;
 coverageLandmarks:string[];
 reconstruction:string;
 detail:string;
 availability:'ready'|'build-required';
}

// CT examinations resolve to anatomy-specific series. A whole-body volume is never silently
// presented as a dedicated head/neck/chest/etc acquisition when the required series is absent.
export const CT_SERIES:CtSeriesDescriptor[]=[];

export function ctSeriesId(sex:PatientSex,region:CtAnatomyRegion,phase:ContrastPhase,reconstruction='thin-axial'){
 return `${sex}-${region}-${phase}-${reconstruction}`;
}

export function resolveCtSeries(sex:PatientSex,protocol:CtProtocol,phase:ContrastPhase,reconstruction='thin-axial'){
 return CT_SERIES.find(s=>s.sex===sex&&s.region===protocol.region&&s.phase===phase&&s.reconstruction===reconstruction&&s.availability==='ready')??null;
}

export function expectedCtSeries(sex:PatientSex,protocol:CtProtocol,phase:ContrastPhase):CtSeriesDescriptor{
 return{
  id:ctSeriesId(sex,protocol.region,phase),sex,region:protocol.region,phase,
  manifestUrl:`/cases/ct/${sex}/${protocol.region}/${phase}/manifest.json`,
  coverageLandmarks:protocol.coverageLandmarks,
  reconstruction:'thin-axial',detail:protocol.detailTarget,availability:'build-required'
 };
}
