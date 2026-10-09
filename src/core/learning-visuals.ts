// Only diagrams with a local, bundled image file are registered here.
// Pathology SVGs illustrate general image signs; clinical images remain separate.
export interface LearningVisual {
  src: string;
  title: string;
  alt: string;
  caption: string;
}
export const LEARNING_VISUALS: Record<string, LearningVisual[]> = {
  anatomy: [
    {src:'/learning/anatomy-chest-landmarks.svg',title:'PA chest: recognise normal landmarks',alt:'Generated PA chest anatomical schematic labelled with trachea, lung fields, hila, mediastinum and costophrenic angle.',caption:'Identify each structure on the teaching diagram, then compare its expected position with a real radiograph. This is not a radiograph.'},
    {src:'/learning/anatomy-ct-axial.svg',title:'Axial CT: orientation and structures',alt:'Diagram of an axial abdominal CT, with patient right on image left, liver, spleen, aorta and vertebra.',caption:'Remember that axial CT is conventionally viewed from the patient’s feet, so their right is displayed on your left.'},
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
    {src:'/reference/elbow-ap-position.svg',title:'AP elbow: position the arm and receptor',alt:'Generated AP elbow teaching schematic showing an extended supinated arm aligned with the image receptor.',caption:'Observe the relationship between the posterior arm, elbow, forearm and receptor before considering centring.'},
    {src:'/reference/elbow-lateral-position.svg',title:'Lateral elbow: flexion and alignment',alt:'Generated lateral elbow positioning schematic showing a flexed elbow, thumb orientation and detector relationship.',caption:'Compare the 90-degree flexion and limb alignment with the AP position. Refer to the examination-specific guidance for precise landmarks.'},
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
    {src:'/reference/elbow-ap-position.svg',title:'Projection-specific positioning',alt:'AP elbow positioning illustration from the examination reference library.',caption:'The examination reference has a corresponding positioning image for every configured projection.'},
    {src:'/reference/elbow-ap-collimation.svg',title:'Projection-specific field',alt:'AP elbow centring and collimation illustration.',caption:'Select a projection to see its area of interest and image evaluation guidance.'},
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
