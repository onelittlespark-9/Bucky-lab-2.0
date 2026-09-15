import type{PatientSex}from'./patients';
import type{CtAnatomyRegion,CtProtocol,ContrastPhase}from'./ct-protocols';

export interface CtSeriesDescriptor{
 id:string;sex:PatientSex;region:CtAnatomyRegion;phase:ContrastPhase;manifestUrl:string;
 coverageLandmarks:string[];reconstruction:string;detail:string;availability:'ready'|'build-required';
}

function regional(sex:PatientSex,region:CtAnatomyRegion,phase:ContrastPhase,path=region):CtSeriesDescriptor{
 return{id:ctSeriesId(sex,region,phase),sex,region,phase,manifestUrl:`/cases/regional/${sex}/${path}/manifest.json`,coverageLandmarks:[],reconstruction:'thin-axial',detail:'Segmentation-bounded source-derived regional CT.',availability:'ready'};
}

// These are source-derived regional acquisitions produced by build-regional-anatomy.py.
// Unenhanced source voxels are registered only as 'none': contrast phases require separate
// volumetric builds and are never simulated by changing window/brightness.
export const CT_SERIES:CtSeriesDescriptor[]=[
 regional('male','head','none'),
 regional('male','neck','none'),
 regional('male','chest','none'),
 regional('male','abdomen-pelvis','none'),
 regional('male','kub','none')
];

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
