# One anatomical source for positioning and radiography

Status: source audit completed, replacement renderer NOT implemented or clinically validated.

## Reproduced source problems — 15 October 2026

The current positioner uses the MakeHuman surface and skeleton in `ArticulatedPatient.tsx`.
The exposure path in `main.tsx` passes a separate TotalSegmentator s1397 CT to `projectVolume`.
Only relative yaw and translation reach that volume. The displayed shoulder, elbow, hip and
knee articulation does not deform its anatomy. A coronal projection of the source confirms
arms raised above the head, unlike the displayed PA chest patient.

The source is 160 × 160 × 273 voxels at approximately 3 mm. `projectionOptions` requests
three-voxel steps (approximately 9 mm); the tracer uses nearest-neighbour sampling.
The receptor is rendered at approximately 233 × 287 pixels for a 35 × 43 cm detector.
These are material resolution limitations. Upscaling cannot restore absent anatomy.
The screen-to-CT registration relates landmarks of different bodies; it is not a common
physical coordinate system. Existing geometric tests do not validate clinical image quality.

## Previous Human Reference Atlas source

URL: https://cdn.humanatlas.io/digital-objects/ref-organ/united-male/v1.5/assets/3d-vh-m-united.glb

Downloaded GLB: 153,596,592 bytes; 849 meshes; zero glTF skinning rigs.
`scripts/audit-anatomy-atlas.mjs` finds lung, heart, skin and thoracic vertebral names,
but no rib, sternum, clavicle or scapula names. Name matching is a screening test;
mesh inspection and anatomical review are still required. Mesh count is not bone count.
Restoring this unrigged asset alone cannot produce a complete PA chest or articulated limbs.
The asset is not bundled in the production app as part of this investigation.

## Required acquisition contract

1. **Anatomy:** one licensed, anatomically registered model with a reviewed 206-bone inventory,
   both lungs, mediastinal structures, skin and appropriate soft-tissue volumes. Supplementary
   atlas structures must be registered, not merely combined from different people.
2. **Materials:** closed tissue volumes or a labelled voxel field; material identity and density;
   cortical shell versus trabecular bone where resolution permits; lung air fraction. Surface
   colour is not an attenuation coefficient. Nested/overlapping structures must not double-count
   tissue path lengths. Source metadata, units, orientation and coverage must be explicit.
3. **Pose:** a single transform/deformation graph must drive the visible patient AND the tissue
   field intersected by rays. Rigid bone motion with surrounding soft-tissue deformation; no
   independently posed cosmetic mannequin. Disallow unsupported poses rather than imply fidelity.
4. **Geometry:** a shared millimetre coordinate frame for source, patient, receptor and collimator.
   Ray integration follows source-to-detector paths. Use physical step lengths, correct patient
   orientation, source–object–detector distances and receptor sampling; measure magnification once.
5. **Physics:** energy-dependent material attenuation and a documented filtered X-ray spectrum.
   Per pixel, integrate material path lengths, apply Beer–Lambert transmission at each energy,
   then detector response. Add separately documented quantum noise, scatter/grid behaviour and
   display processing. Calibrate against reference phantoms before claiming quantitative dose.
6. **Dose:** DRLs are optimisation benchmarks for groups of examinations, not material properties,
   per-patient dose limits or image targets. Show KAP/DAP comparisons only after tube output,
   beam area, filtration and geometry have a calibrated dose model. kVp/mAs alone do not provide
   a validated KAP. Keep the DRL reference date, projection and units with each benchmark.

## Acceptance gates before replacement release

- Inventory: actual bones/structures and coverage verified, not a numerical placeholder.
- Shared pose: rotating or flexing a limb moves the same bone in the visible view and radiograph.
- Chest: both apices and costophrenic angles, ribs, clavicles, scapulae, thoracic spine,
  cardiac/mediastinal outline and diaphragms are visible with plausible relationships.
- PA/AP/lateral: verify laterality, orientation, magnification, centring and complete field coverage.
- Technique: compare kVp, mAs, SID, collimation and grid changes with expected physical effects;
  automatic display processing must not conceal underexposure/noise or fabricate anatomy.
- Across regions: projection-specific reference cases, not a chest-only occupancy test.
- Performance: review actual output and interaction on mobile as well as desktop.
- Independent radiology educator review of paired reference/simulated images before describing
  the model as anatomically accurate or clinically validated.

## Sources

- HRA reference library: https://humanatlas.io/3d-reference-library
- NIST XCOM: https://physics.nist.gov/PhysRefData/Xcom/html/xcom1.html
- NIST tissue data: https://physics.nist.gov/PhysRefData/XrayMassCoef/tab4.html
- UK NDRLs: https://www.gov.uk/government/publications/diagnostic-radiology-national-diagnostic-reference-levels-ndrls/ndrl
- ICRP Publication 135: https://www.icrp.org/publication.asp?id=icrp+publication+135

The pathology library is independent of this pipeline. Commit ecd29bf adds 20 published
radiographs to its three existing examples; its successful deployment does not validate the DRR.
