export interface ImagingCase{id:string;name:string;manifestUrl:string;source:string;patientType:'postmortem'|'living';status:'prepared'|'preparation-required'}
export const CASES:ImagingCase[]=[{id:'vsd-z053',name:'VSD z053 — Whole-body CT',manifestUrl:'/cases/vsd-z053/manifest.json',source:'VSDFullBody, Zenodo 8270365',patientType:'postmortem',status:'preparation-required'}]
