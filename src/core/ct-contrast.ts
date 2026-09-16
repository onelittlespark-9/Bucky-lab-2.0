import type{AnatomyRegion,PatientVolume}from'./volume';
import type{ContrastPhase}from'./ct-protocols';
import type{VoxelTransform}from'./teaching-volume';

type Target={terms:string[];delta:number};
const PHASE_TARGETS:Partial<Record<ContrastPhase,Target[]>>={
 arterial:[{terms:['aorta','artery','arterial'],delta:180},{terms:['heart'],delta:70},{terms:['kidney'],delta:45},{terms:['liver'],delta:25},{terms:['spleen'],delta:30}],
 'portal-venous':[{terms:['portal','vein','venous'],delta:120},{terms:['liver'],delta:65},{terms:['spleen'],delta:60},{terms:['kidney'],delta:70},{terms:['heart'],delta:45},{terms:['aorta','artery'],delta:55}],
 delayed:[{terms:['kidney','renal'],delta:45},{terms:['ureter','bladder'],delta:90},{terms:['liver'],delta:35},{terms:['vein','venous'],delta:35}],
 'split-bolus':[{terms:['aorta','artery'],delta:100},{terms:['vein','venous','portal'],delta:85},{terms:['kidney'],delta:65},{terms:['liver'],delta:50}],
 enteric:[{terms:['colon','bowel','rectum'],delta:130}]
};
function contains(r:AnatomyRegion,x:number,y:number,z:number){const b=r.bounds;return x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1&&z>=b.z0&&z<=b.z1}
function names(r:AnatomyRegion){return[r.region,...(r.structures??[])].join(' ').toLowerCase()}
export function simulatedContrastTransform(v:PatientVolume,phase:ContrastPhase):VoxelTransform|null{
 if(phase==='none')return null;const targets=PHASE_TARGETS[phase];if(!targets?.length)return null;
 const regions=v.regions.map(r=>({r,name:names(r)}));
 return(hu,x,y,z)=>{let delta=0;for(const {r,name} of regions){if(!contains(r,x,y,z))continue;for(const t of targets)if(t.terms.some(term=>name.includes(term)))delta=Math.max(delta,t.delta)}if(delta===0)return hu;
 // Preserve air, cortical bone and other very dense material; enhancement is a soft-tissue teaching model.
 if(hu<-100||hu>300)return hu;return Math.round(Math.min(500,hu+delta));};
}
