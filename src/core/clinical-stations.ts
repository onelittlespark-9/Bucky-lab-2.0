export type StationId='request'|'positioning'|'exposure'|'critique'|'anatomy'|'drill';
export interface ClinicalStation{id:StationId;title:string;goal:string;steps:string[]}
export const CLINICAL_STATIONS:ClinicalStation[]=[
{id:'request',title:'Request & Vetting',goal:'Review the clinical question before imaging.',steps:['Confirm patient/examination/laterality','Review clinical history and indication','Identify contraindications or need to clarify','Accept, query or suggest an appropriate alternative']},
{id:'positioning',title:'Positioning Lab',goal:'Perform the examination geometry.',steps:['Position and articulate the patient','Place detector/Bucky','Set central ray and tube angle','Collimate to required anatomy','Place laterality marker','Set respiration/instructions where required']},
{id:'exposure',title:'Exposure & Technique',goal:'Choose an appropriate educational technique and understand image-quality consequences.',steps:['Start from examination preset','Adjust for simulated habitus','Set SID/kVp/mAs','Expose','Review penetration, noise, magnification and coverage']},
{id:'critique',title:'Image Critique',goal:'Evaluate the produced image systematically.',steps:['Projection and positioning','Laterality and markers','Anatomical coverage','Rotation/alignment','Exposure/penetration','Collimation and centring','Artefacts and motion','Accept or identify repeat correction']},
{id:'anatomy',title:'Anatomy & Pathology',goal:'Correlate normal anatomy and pathology across radiographs and CT.',steps:['Review unlabelled image','Identify anatomy','Identify abnormality','Reveal registered labels/highlights','Read pathology mechanism and imaging signs','Compare CT and radiographic appearance']},
{id:'drill',title:'Quick Drill',goal:'Practise recognition and technique decisions repeatedly.',steps:['Receive a random task','Commit an answer or setup','Reveal feedback','Repeat weak areas']}
];
export interface CritiqueFinding{key:string;label:string;prompt:string}
export const RADIOGRAPH_CRITIQUE:CritiqueFinding[]=[
{key:'projection',label:'Projection',prompt:'Is the requested projection demonstrated correctly?'},
{key:'laterality',label:'Laterality',prompt:'Is the correct side demonstrated and appropriately marked?'},
{key:'anatomy',label:'Anatomy',prompt:'Is all required anatomy included?'},
{key:'rotation',label:'Positioning',prompt:'Is rotation/alignment appropriate for this projection?'},
{key:'exposure',label:'Exposure',prompt:'Are penetration and noise appropriate for assessment?'},
{key:'collimation',label:'Collimation',prompt:'Is the field restricted without excluding required anatomy?'},
{key:'centring',label:'Central ray',prompt:'Is centring appropriate to the anatomical landmark?'},
{key:'artefact',label:'Artefact / motion',prompt:'Is motion or avoidable artefact affecting diagnostic value?'}
];