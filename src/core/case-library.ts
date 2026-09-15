import type{PatientSex,PathologyId}from'./patients';
export type CaseAvailability='ready'|'source-required'|'pathology-build-required';
export interface TeachingCase{id:string;title:string;patientId:string;sex:PatientSex;pathology:PathologyId;region:string;ageBand:'adult';sourceCaseId:string;availability:CaseAvailability;variant:string}
export const TEACHING_CASES:TeachingCase[]=[
{id:'normal-m-01',title:'Normal adult male 01',patientId:'m01',sex:'male',pathology:'none',region:'whole-body',ageBand:'adult',sourceCaseId:'totalseg-s1397',availability:'ready',variant:'normal reference'},
{id:'normal-f-01',title:'Normal adult female 01',patientId:'f01',sex:'female',pathology:'none',region:'whole-body',ageBand:'adult',sourceCaseId:'female-reference-01',availability:'source-required',variant:'normal reference'},
{id:'ptx-m-01',title:'Pneumothorax male case 01',patientId:'m02',sex:'male',pathology:'pneumothorax',region:'chest',ageBand:'adult',sourceCaseId:'male-chest-02',availability:'source-required',variant:'small apical'},
{id:'ptx-f-01',title:'Pneumothorax female case 01',patientId:'f02',sex:'female',pathology:'pneumothorax',region:'chest',ageBand:'adult',sourceCaseId:'female-chest-02',availability:'source-required',variant:'moderate unilateral'},
{id:'effusion-m-01',title:'Pleural effusion male case 01',patientId:'m03',sex:'male',pathology:'pleural-effusion',region:'chest',ageBand:'adult',sourceCaseId:'male-chest-03',availability:'source-required',variant:'small dependent'},
{id:'effusion-f-01',title:'Pleural effusion female case 01',patientId:'f03',sex:'female',pathology:'pleural-effusion',region:'chest',ageBand:'adult',sourceCaseId:'female-chest-03',availability:'source-required',variant:'large unilateral'},
{id:'consolidation-m-01',title:'Consolidation male case 01',patientId:'m04',sex:'male',pathology:'consolidation',region:'chest',ageBand:'adult',sourceCaseId:'male-chest-04',availability:'source-required',variant:'lower-lobe'},
{id:'consolidation-f-01',title:'Consolidation female case 01',patientId:'f04',sex:'female',pathology:'consolidation',region:'chest',ageBand:'adult',sourceCaseId:'female-chest-04',availability:'source-required',variant:'upper-lobe'},
{id:'nodule-m-01',title:'Pulmonary nodule male case 01',patientId:'m05',sex:'male',pathology:'pulmonary-nodule',region:'chest',ageBand:'adult',sourceCaseId:'male-chest-05',availability:'source-required',variant:'peripheral'},
{id:'nodule-f-01',title:'Pulmonary nodule female case 01',patientId:'f05',sex:'female',pathology:'pulmonary-nodule',region:'chest',ageBand:'adult',sourceCaseId:'female-chest-05',availability:'source-required',variant:'central'},
{id:'ribfx-m-01',title:'Rib fracture male case 01',patientId:'m06',sex:'male',pathology:'rib-fracture',region:'trauma',ageBand:'adult',sourceCaseId:'male-trauma-06',availability:'source-required',variant:'single rib'},
{id:'ribfx-f-01',title:'Rib fracture female case 01',patientId:'f06',sex:'female',pathology:'rib-fracture',region:'trauma',ageBand:'adult',sourceCaseId:'female-trauma-06',availability:'source-required',variant:'multiple ribs'},
{id:'stone-m-01',title:'Urinary calculus male case 01',patientId:'m07',sex:'male',pathology:'renal-calculus',region:'KUB',ageBand:'adult',sourceCaseId:'male-kub-07',availability:'source-required',variant:'renal calculus'},
{id:'stone-f-01',title:'Urinary calculus female case 01',patientId:'f07',sex:'female',pathology:'renal-calculus',region:'KUB',ageBand:'adult',sourceCaseId:'female-kub-07',availability:'source-required',variant:'ureteric calculus'},
{id:'aaa-m-01',title:'Aortic aneurysm male case 01',patientId:'m08',sex:'male',pathology:'aortic-aneurysm',region:'aorta',ageBand:'adult',sourceCaseId:'male-aorta-08',availability:'source-required',variant:'infrarenal'},
{id:'aaa-f-01',title:'Aortic aneurysm female case 01',patientId:'f08',sex:'female',pathology:'aortic-aneurysm',region:'aorta',ageBand:'adult',sourceCaseId:'female-aorta-08',availability:'source-required',variant:'thoracoabdominal'},
{id:'ich-m-01',title:'Intracranial haemorrhage male case 01',patientId:'m09',sex:'male',pathology:'intracranial-haemorrhage',region:'head',ageBand:'adult',sourceCaseId:'male-head-09',availability:'source-required',variant:'intraparenchymal'},
{id:'ich-f-01',title:'Intracranial haemorrhage female case 01',patientId:'f09',sex:'female',pathology:'intracranial-haemorrhage',region:'head',ageBand:'adult',sourceCaseId:'female-head-09',availability:'source-required',variant:'subdural'}
];
export function casesFor(pathology?:PathologyId,sex?:PatientSex){return TEACHING_CASES.filter(c=>(!pathology||c.pathology===pathology)&&(!sex||c.sex===sex))}
