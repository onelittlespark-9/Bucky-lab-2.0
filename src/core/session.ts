import type{PatientVolume}from'./volume';
import{createTeachingVolume,type TeachingVolume}from'./teaching-volume';
import{pathologyBuild,type PathologyId,type PatientProfile}from'./patients';
import type{CaseProvenance}from'./cases';
export interface TeachingSession{patient:PatientProfile;pathology:PathologyId;volume:TeachingVolume;warning?:string}
export function createTeachingSession(source:PatientVolume,provenance:CaseProvenance,patient:PatientProfile,pathology:PathologyId):TeachingSession{
 const build=pathologyBuild(pathology),active=pathology==='none'?[]:[build.metadata];
 const volume=createTeachingVolume(source,pathology==='none'?provenance:'bucky-lab-simulated-pathology',build.transforms,active);
 const warning=pathology!=='none'&&!build.transforms.length?'Pathology reference selected; anatomy-constrained voxel transform is not yet available for this case. Source anatomy is shown unchanged.':undefined;
 return{patient,pathology,volume,warning};
}
