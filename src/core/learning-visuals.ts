// Images must be bundled locally; clinically sourced examples have per-item attribution.
// Other Learning areas still have explicitly labelled generated educational schematics.
export interface LearningVisual {
  src: string;
  title: string;
  alt: string;
  caption: string;
  kind?: 'clinical' | 'schematic';
  source?: {url:string; author:string; licence:string};
  markers?: {x:number;y:number;label:string}[];
}
export const LEARNING_VISUALS: Record<string, LearningVisual[]> = {
  anatomy: [
    {src:'/clinical-reference/chest-pa-normal.jpg',title:'PA chest: recognise normal landmarks',alt:'Genuine normal posteroanterior chest radiograph, with visible clavicles, ribs, lungs, hila, heart and diaphragms.',caption:'Actual normal PA chest radiograph. Inspect the trachea, lung fields, hila, heart borders and costophrenic angles. Overlay pointers are teaching aids, not measurements.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg',author:'Mikael Häggström',licence:'CC0 1.0'},markers:[{x:50,y:17,label:'Trachea'},{x:43,y:49,label:'Right hilum'},{x:58,y:47,label:'Left hilum'},{x:22,y:84,label:'Right costophrenic angle'},{x:81,y:84,label:'Left costophrenic angle'}]},
    {src:'/clinical-reference/abdomen-axial-normal.png',title:'Axial CT: orientation and structures',alt:'Real normal contrast-enhanced axial CT of the abdomen and pelvis, showing transverse anatomical sections in the source image format.',caption:'Real contrast-enhanced CT from a normal abdominal/pelvic series. Conventionally viewed from the feet: image left represents patient right. Structures depend on the selected slice; use the CT lab to scroll.',kind:'clinical',source:{url:'https://commons.wikimedia.org/wiki/File:CT_of_a_normal_abdomen_and_pelvis,_axial_plane_71.png',author:'Mikael Häggström, MD',licence:'CC0 1.0'}},
  ],
  pathology: [
    {src:'/learning/pathology-pneumothorax.svg',title:'Pneumothorax: pleural line',alt:'Schematic of pneumothorax showing a pleural line and absent peripheral lung markings.',caption:'The visceral pleural line and absent peripheral vascular markings are key signs. Compare the schematic with the published clinical reference.'},
    {src:'/learning/pathology-pleural-effusion.svg',title:'Pleural effusion: fluid meniscus',alt:'Schematic showing dependent pleural fluid, meniscus and blunting of the costophrenic angle.',caption:'A typical erect chest appearance is dependent opacity with a meniscus; supine images may look different.'},
    {src:'/learning/pathology-intracranial-haemorrhage.svg',title:'Intracranial haemorrhage: hyperattenuation',alt:'Axial head schematic showing an area of hyperattenuating intracerebral haemorrhage with ventricular extension.',caption:'Acute blood is often hyperattenuating on non-contrast CT. Review the complete scan and clinical circumstances.'},
  ],
  physics: [
    {src:'/learning/physics-beam.svg',title:'X-ray production, attenuation and scatter',alt:'X-ray tube, collimator, patient, scattered photons and detector connected by illustrative beam paths.',caption:'Trace the primary beam through the patient to the detector and distinguish scatter from transmitted photons.'},
    {src:'/learning/physics-sid.svg',title:'Source-to-image distance and inverse square',alt:'Two detectors shown at 100 cm and 200 cm with relative fluence one and one quarter respectively.',caption:'At constant output, doubling the distance reduces fluence to approximately one-quarter at the further plane.'},
  ],
  positioning: [
    {src:'/clinical-reference/elbow-ap.jpg',title:'AP elbow: expected real radiograph',alt:'Real AP elbow radiograph showing distal humerus, radius and ulna.',caption:'Study real elbow anatomy; patient positioning steps are in Examination reference.'},
    {src:'/clinical-reference/elbow-lateral.jpg',title:'Lateral elbow: expected real radiograph',alt:'Real lateral elbow radiograph showing distal humerus, proximal radius and ulna.',caption:'Compare the AP and lateral radiographic appearances; for patient setup refer to projection guidance.'},
  ],
  exposure: [
    {src:'/learning/exposure-noise.svg',title:'Photon fluence and quantum mottle',alt:'Two stylised detector images showing a noisier low-photon example and a less noisy higher-photon example.',caption:'Conceptual illustration only: fewer detected photons can increase quantum mottle. Do not infer exposure values from these graphics.'},
    {src:'/learning/exposure-technique.svg',title:'kVp and mAs: different controls',alt:'Diagram of X-ray tube, attenuating patient and detector with kVp and mAs teaching notes.',caption:'kVp influences beam energy and penetration; mAs chiefly controls photon quantity. Use examination-specific presets.'},
  ],
  room: [
    {src:'/learning/room-layout.svg',title:'Prepare the examination room',alt:'Top-down radiography room schematic showing X-ray tube, detector, patient and clear working access.',caption:'Plan the equipment, detector and patient route before positioning; adapt the room to mobility and safety requirements.'},
    {src:'/learning/room-alignment.svg',title:'Align the X-ray tube, patient and detector',alt:'Side-view alignment diagram showing central ray, image receptor, patient, light field and source-to-image distance.',caption:'Check tube and detector alignment, central-ray entry, collimation and the selected SID before exposure.'},
  ],
  reference: [
    {src:'/clinical-reference/elbow-ap.jpg',title:'Expected AP elbow appearance',alt:'Real AP elbow clinical reference radiograph, with anatomical labels in Examination reference.',caption:'The examination reference has a corresponding positioning image for every configured projection.'},
    {src:'/clinical-reference/elbow-lateral.jpg',title:'Expected lateral elbow appearance',alt:'Real lateral elbow clinical reference radiograph.',caption:'Select a projection to see its area of interest and image evaluation guidance.'},
  ],
  reporting: [
    {src:'/learning/reporting-search.svg',title:'Systematic chest-image review',alt:'Chest diagram indicating an airway, lung, cardiac, diaphragm and other-structures inspection sequence.',caption:'Practise a consistent review route. This ABCDE-style example is a learning aid, not a complete diagnostic reporting protocol.'},
    {src:'/learning/reporting-quality.svg',title:'Radiographic quality and critique',alt:'Chest schematic marking image coverage, clavicular symmetry and inspiration checkpoints.',caption:'Before interpreting findings, check coverage, rotation, inspiration, penetration, motion and possible artefacts.'},
  ],
};
export const PATHOLOGY_VISUAL: Record<string, LearningVisual> = {
 'pneumothorax':LEARNING_VISUALS.pathology[0],
 'pleural-effusion':LEARNING_VISUALS.pathology[1],
 'intracranial-haemorrhage':LEARNING_VISUALS.pathology[2],
};
