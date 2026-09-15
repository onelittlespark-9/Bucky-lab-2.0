export type CaseProvenance='real-source'|'derived-from-real-source'|'bucky-lab-synthetic'|'bucky-lab-simulated-pathology';
export type CaseStatus='prepared'|'preparation-required'|'candidate-source';
export type PatientType='postmortem'|'living'|'synthetic';

export interface ImagingCase{
 id:string;name:string;manifestUrl?:string;source:string;patientType:PatientType;
 status:CaseStatus;provenance:CaseProvenance;licence:string;region:'whole-body'|'chest'|'abdomen'|'head';
 modalities:('CT'|'XR')[];teachingUses:string[];caveats?:string[]
}

export const CASES:ImagingCase[]=[
 {id:'vsd-z053',name:'VSD z053 — Whole-body CT',manifestUrl:'/cases/vsd-z053/manifest.json',source:'VSDFullBody, Zenodo 8270365',patientType:'postmortem',status:'preparation-required',provenance:'real-source',licence:'CC BY-NC-SA',region:'whole-body',modalities:['CT','XR'],teachingUses:['skeletal anatomy','projection geometry','collimation','CT windowing'],caveats:['Postmortem source; do not present as normal living-patient physiology.']},
 {id:'ct-org-source',name:'CT-ORG — Anatomy source',source:'TCIA CT-ORG',patientType:'living',status:'candidate-source',provenance:'real-source',licence:'CC BY 3.0',region:'whole-body',modalities:['CT','XR'],teachingUses:['organ localisation','whole-body anatomy','synthetic validation'],caveats:['Orientation must be validated per selected volume before ingestion.']},
 {id:'cptac-luad-source',name:'CPTAC-LUAD — Thoracic source',source:'TCIA CPTAC-LUAD',patientType:'living',status:'candidate-source',provenance:'real-source',licence:'CC BY 4.0',region:'chest',modalities:['CT','XR'],teachingUses:['thoracic anatomy','lung pathology','pathology validation']},
 {id:'nsclc-radiogenomics-source',name:'NSCLC-Radiogenomics — Thoracic pathology',source:'TCIA NSCLC-Radiogenomics',patientType:'living',status:'candidate-source',provenance:'real-source',licence:'CC BY 3.0',region:'chest',modalities:['CT','XR'],teachingUses:['lung lesion localisation','thoracic pathology','projection validation']},
 {id:'bucky-adult-normal-01',name:'Bucky Adult Normal 01',source:'Bucky Lab high-fidelity synthetic volume',patientType:'synthetic',status:'preparation-required',provenance:'bucky-lab-synthetic',licence:'Bucky Lab generated asset',region:'whole-body',modalities:['CT','XR'],teachingUses:['positioning','collimation','exposure','normal CT anatomy'],caveats:['Synthetic teaching anatomy; must not be represented as a clinical patient scan.']}
];

export const selectableCases=(modality:'CT'|'XR')=>CASES.filter(c=>c.modalities.includes(modality));
export const preparedCases=(modality:'CT'|'XR')=>selectableCases(modality).filter(c=>c.status==='prepared');
export const caseById=(id:string)=>CASES.find(c=>c.id===id);
