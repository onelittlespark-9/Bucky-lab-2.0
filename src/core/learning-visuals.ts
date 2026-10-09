// Images must be bundled locally; clinically sourced examples have per-item attribution.
// Other Learning areas still have explicitly labelled generated educational schematics.
export interface LearningVisual {
  src: string;
  title: string;
  alt: string;
  caption: string;
  kind?: 'clinical' | 'schematic' | 'photograph' | 'derived';
  source?: {url:string; author:string; licence:string};
  markers?: {x:number;y:number;label:string}[];
}
export const LEARNING_VISUALS: Record<string, LearningVisual[]> = {
  anatomy: [
    {src:'/clinical-reference/chest-pa-normal.jpg',title:'PA chest: recognise normal landmarks',alt:'Genuine normal posteroanterior chest radiograph, with visible clavicles, ribs, lungs, hila, heart and diaphragms.',caption:'Actual normal PA chest radiograph. Inspect the trachea, lung fields, hila, heart borders and costophrenic angles. Overlay pointers are teaching aids, not measurements.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',author:'Mikael Häggström',licence:'CC0 1.0'},markers:[{x:50,y:17,label:'Trachea'},{x:43,y:49,label:'Right hilum'},{x:58,y:47,label:'Left hilum'},{x:22,y:84,label:'Right costophrenic angle'},{x:81,y:84,label:'Left costophrenic angle'}]},
    {src:'/clinical-reference/abdomen-axial-normal.png',title:'Axial CT: orientation and structures',alt:'Real normal contrast-enhanced axial CT of the abdomen and pelvis, showing transverse anatomical sections in the source image format.',caption:'Real contrast-enhanced CT from a normal abdominal/pelvic series. Conventionally viewed from the feet: image left represents patient right. Structures depend on the selected slice; use the CT lab to scroll.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:CT_of_a_normal_abdomen_and_pelvis,_axial_plane_71.png',author:'Mikael Häggström, MD',licence:'CC0 1.0'}},
  ],
  pathology: [
    {src:'/pathology/pneumothorax.jpg',title:'Pneumothorax: pleural line',alt:'Published frontal chest radiograph demonstrating a large left pneumothorax and absent peripheral lung markings.',caption:'Genuine clinical case: identify the visceral pleural boundary and the region beyond it without vascular markings.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Pneumothorax_CXR.jpg',author:'Clinical Cases; source crop by Doc James',licence:'CC BY-SA 2.5'}},
    {src:'/pathology/pleural-effusion.png',title:'Pleural effusion: meniscus',alt:'Published erect chest radiograph showing left pleural fluid with a pre-existing annotation.',caption:'Genuine clinical case: note the curved meniscus and obscured left costophrenic angle. The black circle belongs to the source image.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Effusionhalf.PNG',author:'James Heilman, MD',licence:'CC BY-SA 3.0'}},
    {src:'/pathology/intracranial-haemorrhage.jpg',title:'Intracranial haemorrhage: acute blood',alt:'Published non-contrast axial head CT showing intracerebral and intraventricular haemorrhage.',caption:'Genuine clinical CT slice: inspect hyperattenuating blood and intraventricular extension. This is not a complete series.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Intracerebral_hemorrage_(CT_scan).jpg',author:'Glitzy queen00',licence:'Public domain'}},
  ],
  physics: [
    {src:'/clinical-reference/components-radiography.jpg',title:'Real X-ray equipment: tube, patient and detector',alt:'Real radiography room photograph annotated with the components of projectional radiography.',caption:'Photographic reference identifying the generator and detector. The collimator limits the useful X-ray field; tissues attenuate the beam and produce scatter.',kind:'photograph',source:{url:'https://commons.wikimedia.org/wiki/File:Components_of_projectional_radiography.jpg',author:'U.S. Navy photo by Marcus Suorez; annotations by Mikael Häggström',licence:'CC0 1.0'}},
    {src:'/clinical-reference/xray-room-philips.jpg',title:'Source-to-image distance in a real X-ray room',alt:'Photograph of a patient with digital radiography equipment in a hospital X-ray room.',caption:'Find the tube focal spot, patient and image detector. The inverse-square principle is I₂/I₁ = (d₁/d₂)²; doubling distance at fixed output gives one-quarter fluence. Distances cannot be measured from this photo.',kind:'photograph',source:{url:'https://commons.wikimedia.org/wiki/File:Hospital_Radiology_Room_Philips_DigitalDiagnost_Digital_Radiography_System.jpg',author:'Ptrump16',licence:'CC BY-SA 4.0'}},
  ],
  positioning: [
    {src:'/clinical-reference/elbow-ap.jpg',title:'AP elbow: expected real radiograph',alt:'Real AP elbow radiograph showing distal humerus, radius and ulna.',caption:'Study real elbow anatomy; patient positioning steps are in Examination reference.'},
    {src:'/clinical-reference/elbow-lateral.jpg',title:'Lateral elbow: expected real radiograph',alt:'Real lateral elbow radiograph showing distal humerus, proximal radius and ulna.',caption:'Compare the AP and lateral radiographic appearances; for patient setup refer to projection guidance.'},
  ],
  exposure: [
    {src:'/clinical-reference/exposure-quantum-comparison.png',title:'Photon statistics: original versus simulated noise',alt:'A side-by-side image made from one real PA chest radiograph; the left panel has digitally added grain and the right retains its original image appearance.',caption:'Digitally generated teaching comparison based on a genuine PA chest radiograph. Artificial noise is exaggerated to illustrate the appearance of quantum mottle; this is NOT a second clinical exposure or calibrated dose simulation.',kind:'derived',source:{url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',author:'Mikael Häggström; digital noise variation by Bucky Lab',licence:'CC0 1.0'}},
    {src:'/clinical-reference/chest-pa-normal.jpg',title:'Assessing penetration and exposure',alt:'Genuine normal PA chest radiograph showing lung fields, mediastinum, heart and thoracic spine.',caption:'Use a real reference image to review visibility of vertebrae behind the heart and lung detail. kVp affects beam energy; mAs affects photon number. Actual exposure settings cannot be inferred from the appearance alone.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',author:'Mikael Häggström',licence:'CC0 1.0'}},
  ],
  room: [
    {src:'/clinical-reference/xray-room-philips.jpg',title:'Radiography equipment and patient positioning space',alt:'Real photograph of a hospital radiography room showing an X-ray examination and digital imaging equipment.',caption:'Identify the equipment, imaging detector and patient access space. Check mobility needs, equipment clearance, patient stability and local radiation safety measures before exposure.',kind:'photograph',source:{url:'https://commons.wikimedia.org/wiki/File:Hospital_Radiology_Room_Philips_DigitalDiagnost_Digital_Radiography_System.jpg',author:'Ptrump16',licence:'CC BY-SA 4.0'}},
    {src:'/clinical-reference/xray-room-college.jpg',title:'Real examination-room equipment arrangement',alt:'Photograph of an educational radiography X-ray room with diagnostic imaging equipment.',caption:'Use the genuine training-room photograph to identify tube supports, table and receptor arrangements. Layouts vary: this photo is an example, not a required departmental configuration.',kind:'photograph',source:{url:'https://commons.wikimedia.org/wiki/File:X-ray_Room.jpg',author:'Rtstudents',licence:'CC BY-SA 3.0'}},
  ],
  reference: [
    {src:'/clinical-reference/elbow-ap.jpg',title:'Expected AP elbow appearance',alt:'Real AP elbow clinical reference radiograph, with anatomical labels in Examination reference.',caption:'The examination reference has a corresponding positioning image for every configured projection.'},
    {src:'/clinical-reference/elbow-lateral.jpg',title:'Expected lateral elbow appearance',alt:'Real lateral elbow clinical reference radiograph.',caption:'Select a projection to see its area of interest and image evaluation guidance.'},
  ],
  reporting: [
    {src:'/clinical-reference/chest-pa-normal.jpg',title:'Systematic review of an actual PA chest radiograph',alt:'Genuine normal PA chest radiograph for systematic inspection of airway, lungs, hila, cardiac silhouette and diaphragms.',caption:'Trace a structured review: airway and mediastinum, lungs and pleura, heart, diaphragm and visible bones. Use the toggled landmarks as an introductory aid, not a formal diagnostic overlay.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',author:'Mikael Häggström',licence:'CC0 1.0'},markers:[{x:50,y:17,label:'Trachea'},{x:43,y:49,label:'Right hilum'},{x:58,y:47,label:'Left hilum'}]},
    {src:'/clinical-reference/chest-pa-normal.jpg',title:'Technical critique: real PA chest',alt:'Genuine normal PA chest radiograph showing clavicles, lungs, cardiac shadow and both costophrenic angles.',caption:'Check whether lung apices and costophrenic angles are visible, compare medial clavicles for rotation, assess inspiration, exposure and motion. The displayed pointers are approximate and not automated image measurements.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',author:'Mikael Häggström',licence:'CC0 1.0'},markers:[{x:22,y:84,label:'Right costophrenic angle'},{x:81,y:84,label:'Left costophrenic angle'}]},
  ],
};
export const PATHOLOGY_VISUAL: Record<string, LearningVisual> = {
 'pneumothorax':LEARNING_VISUALS.pathology[0],
 'pleural-effusion':LEARNING_VISUALS.pathology[1],
 'intracranial-haemorrhage':LEARNING_VISUALS.pathology[2],
};
