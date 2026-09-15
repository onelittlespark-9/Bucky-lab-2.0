export type ContrastPhase='none'|'arterial'|'portal-venous'|'delayed'|'split-bolus'|'enteric';
export interface CtProtocol{ id:string;label:string;anatomy:string;coverage:string;contrast:ContrastPhase[];defaultPhase:ContrastPhase;windowKeys:string[];notes:string }
// Educational NHS-style protocol families. Exact acquisition/injection parameters remain local-Trust,
// scanner, patient and indication dependent; do not present these presets as a clinical protocol.
export const CT_PROTOCOLS:CtProtocol[]=[
{id:'head-nc',label:'Head — non-contrast',anatomy:'Brain / skull',coverage:'Vertex to skull base',contrast:['none'],defaultPhase:'none',windowKeys:['brain','bone'],notes:'Acute head/brain reference; unenhanced dataset.'},
{id:'head-contrast',label:'Head — post contrast',anatomy:'Brain / intracranial structures',coverage:'Vertex to skull base',contrast:['portal-venous'],defaultPhase:'portal-venous',windowKeys:['brain'],notes:'Contrast-enhanced teaching variant where clinically indicated.'},
{id:'neck',label:'Neck',anatomy:'Soft tissues of neck',coverage:'Skull base through thoracic inlet',contrast:['none','portal-venous'],defaultPhase:'portal-venous',windowKeys:['soft'],notes:'Contrast phase depends on indication.'},
{id:'chest',label:'Chest',anatomy:'Thorax / lungs / mediastinum',coverage:'Lung apices through lung bases',contrast:['none','portal-venous'],defaultPhase:'portal-venous',windowKeys:['lung','soft'],notes:'Includes lung and mediastinal review.'},
{id:'ctpa',label:'CTPA',anatomy:'Pulmonary arteries / thorax',coverage:'Thoracic inlet through lung bases',contrast:['arterial'],defaultPhase:'arterial',windowKeys:['soft','lung'],notes:'Pulmonary arterial contrast timing.'},
{id:'aorta',label:'CT Aorta',anatomy:'Thoracic and abdominal aorta',coverage:'Indication-dependent aortic coverage',contrast:['none','arterial','delayed'],defaultPhase:'arterial',windowKeys:['soft'],notes:'Phase set selected by aortic indication.'},
{id:'cap',label:'Chest, abdomen & pelvis',anatomy:'Thorax / abdomen / pelvis',coverage:'Lung apices to lesser trochanters',contrast:['none','arterial','portal-venous'],defaultPhase:'portal-venous',windowKeys:['soft','lung','bone'],notes:'Staging/follow-up style CAP family; local timing varies.'},
{id:'abdomen-pelvis',label:'Abdomen & pelvis',anatomy:'Abdominal and pelvic viscera',coverage:'Diaphragm through lesser trochanters',contrast:['none','arterial','portal-venous','delayed'],defaultPhase:'portal-venous',windowKeys:['soft','bone'],notes:'Phase selected by indication.'},
{id:'kub',label:'CT KUB',anatomy:'Kidneys / ureters / bladder',coverage:'Kidneys through bladder',contrast:['none'],defaultPhase:'none',windowKeys:['soft','bone'],notes:'Non-contrast urinary tract / calculus reference.'},
{id:'colonography',label:'CT Colonography',anatomy:'Colon / abdomen / pelvis',coverage:'Colon and abdomen/pelvis',contrast:['enteric','portal-venous'],defaultPhase:'enteric',windowKeys:['soft'],notes:'Bowel preparation, faecal tagging and colonic distension are part of the examination; IV contrast varies by indication/local protocol.'},
{id:'major-trauma',label:'Major Trauma',anatomy:'Head / spine / thorax / abdomen / pelvis',coverage:'Protocol-dependent whole-body trauma coverage',contrast:['none','split-bolus','arterial','portal-venous','delayed'],defaultPhase:'split-bolus',windowKeys:['brain','lung','soft','bone'],notes:'Supports non-contrast head plus contrast-enhanced body phases; exact trauma strategy varies by NHS network/Trust.'}
];
export const protocolById=(id:string)=>CT_PROTOCOLS.find(p=>p.id===id)??CT_PROTOCOLS[0];
