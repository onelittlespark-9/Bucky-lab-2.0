export type HeadLandmarkCategory='bone'|'ventricle-csf'|'deep-grey'|'white-matter'|'cortex'|'vascular'|'posterior-fossa'|'orbit-sinus'|'brainstem';
export interface CtHeadLandmark{id:string;label:string;category:HeadLandmarkCategory;paired?:boolean;teachingNote:string}

// Separate anatomical targets for axial CT teaching. These labels are intentionally stored as
// independent targets rather than painted onto an image; future masks/coordinates bind each target
// to the patient's 3-D volume and determine which slices can legitimately ask the question.
export const CT_HEAD_LANDMARKS:CtHeadLandmark[]=[
 {id:'frontal-lobe',label:'Frontal lobe',category:'cortex',paired:true,teachingNote:'Identify frontal cortex and underlying white matter.'},
 {id:'parietal-lobe',label:'Parietal lobe',category:'cortex',paired:true,teachingNote:'Identify parietal cortex on higher axial sections.'},
 {id:'temporal-lobe',label:'Temporal lobe',category:'cortex',paired:true,teachingNote:'Identify temporal lobes at skull-base and ventricular levels.'},
 {id:'occipital-lobe',label:'Occipital lobe',category:'cortex',paired:true,teachingNote:'Identify posterior cerebral hemispheres.'},
 {id:'cerebellum',label:'Cerebellum',category:'posterior-fossa',paired:true,teachingNote:'Identify cerebellar hemispheres in the posterior fossa.'},
 {id:'pons',label:'Pons',category:'brainstem',teachingNote:'Identify the pons anterior to the fourth ventricle.'},
 {id:'medulla',label:'Medulla',category:'brainstem',teachingNote:'Identify the inferior brainstem near the foramen magnum.'},
 {id:'fourth-ventricle',label:'Fourth ventricle',category:'ventricle-csf',teachingNote:'Identify midline CSF space posterior to the pons.'},
 {id:'third-ventricle',label:'Third ventricle',category:'ventricle-csf',teachingNote:'Identify the narrow midline ventricular CSF space.'},
 {id:'lateral-ventricle-frontal-horn',label:'Frontal horn of lateral ventricle',category:'ventricle-csf',paired:true,teachingNote:'Identify paired frontal horns.'},
 {id:'lateral-ventricle-occipital-horn',label:'Occipital horn of lateral ventricle',category:'ventricle-csf',paired:true,teachingNote:'Identify paired posterior horns.'},
 {id:'caudate-head',label:'Head of caudate nucleus',category:'deep-grey',paired:true,teachingNote:'Identify caudate heads beside the frontal horns.'},
 {id:'lentiform-nucleus',label:'Lentiform nucleus',category:'deep-grey',paired:true,teachingNote:'Identify putamen/globus pallidus region.'},
 {id:'thalamus',label:'Thalamus',category:'deep-grey',paired:true,teachingNote:'Identify paired thalami bordering the third ventricle.'},
 {id:'internal-capsule',label:'Internal capsule',category:'white-matter',paired:true,teachingNote:'Identify white-matter tract between deep grey nuclei.'},
 {id:'corpus-callosum',label:'Corpus callosum',category:'white-matter',teachingNote:'Identify midline commissural white matter.'},
 {id:'falx',label:'Falx cerebri',category:'bone',teachingNote:'Identify the midline dural partition/calcification when visible.'},
 {id:'sylvian-fissure',label:'Sylvian fissure',category:'ventricle-csf',paired:true,teachingNote:'Identify lateral sulcus/CSF space.'},
 {id:'basal-cisterns',label:'Basal cisterns',category:'ventricle-csf',teachingNote:'Identify basal CSF spaces at the skull base.'},
 {id:'orbit',label:'Orbit',category:'orbit-sinus',paired:true,teachingNote:'Identify the bony orbit and orbital contents.'},
 {id:'sphenoid-sinus',label:'Sphenoid sinus',category:'orbit-sinus',teachingNote:'Identify sphenoid sinus at skull-base levels.'},
 {id:'skull',label:'Calvarium / skull',category:'bone',teachingNote:'Identify the cranial vault and skull base.'}
];

export interface CtHeadLandmarkBinding{landmarkId:string;maskId?:string;worldMm?:[number,number,number];sliceRange?:[number,number];confidence:'verified'|'derived'|'pending'}
export const CT_HEAD_LANDMARK_BINDINGS:Record<'male'|'female',CtHeadLandmarkBinding[]>={male:[],female:[]};
