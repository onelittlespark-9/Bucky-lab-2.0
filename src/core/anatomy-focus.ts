export type AnatomyFocusId='whole-body'|'shoulder'|'humerus'|'elbow'|'forearm'|'wrist'|'hand'|'hip'|'femur'|'knee'|'tibia-fibula'|'ankle'|'foot';
export interface AnatomyFocus{id:AnatomyFocusId;label:string;zoom:number;patientX:number;patientY:number;field:{left:number;right:number;top:number;bottom:number}}
export const ANATOMY_FOCUS:AnatomyFocus[]=[
{id:'whole-body',label:'Whole patient',zoom:1,patientX:0,patientY:0,field:{left:8,right:8,top:8,bottom:8}},
{id:'shoulder',label:'Shoulder',zoom:1.9,patientX:-18,patientY:27,field:{left:25,right:25,top:26,bottom:26}},
{id:'humerus',label:'Humerus',zoom:1.8,patientX:-22,patientY:16,field:{left:29,right:29,top:18,bottom:18}},
{id:'elbow',label:'Elbow',zoom:2.7,patientX:-26,patientY:5,field:{left:34,right:34,top:34,bottom:34}},
{id:'forearm',label:'Forearm',zoom:2.1,patientX:-27,patientY:-4,field:{left:31,right:31,top:24,bottom:24}},
{id:'wrist',label:'Wrist',zoom:3.2,patientX:-28,patientY:-14,field:{left:38,right:38,top:38,bottom:38}},
{id:'hand',label:'Hand',zoom:2.8,patientX:-29,patientY:-20,field:{left:35,right:35,top:35,bottom:35}},
{id:'hip',label:'Hip',zoom:2.2,patientX:-10,patientY:-7,field:{left:32,right:32,top:30,bottom:30}},
{id:'femur',label:'Femur',zoom:1.8,patientX:-10,patientY:-20,field:{left:29,right:29,top:18,bottom:18}},
{id:'knee',label:'Knee',zoom:2.7,patientX:-10,patientY:-31,field:{left:35,right:35,top:35,bottom:35}},
{id:'tibia-fibula',label:'Tibia / fibula',zoom:1.9,patientX:-10,patientY:-38,field:{left:30,right:30,top:20,bottom:20}},
{id:'ankle',label:'Ankle',zoom:3,patientX:-10,patientY:-43,field:{left:37,right:37,top:37,bottom:37}},
{id:'foot',label:'Foot',zoom:2.6,patientX:-10,patientY:-45,field:{left:34,right:34,top:34,bottom:34}}
];
export function anatomyFocus(id:AnatomyFocusId){return ANATOMY_FOCUS.find(x=>x.id===id)??ANATOMY_FOCUS[0]}
