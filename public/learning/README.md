# Bucky Lab 2.0: Learning visual library

Each of the eight Learning sections has at least one **generated visual example**. There are 13 original SVGs under `public/learning`; positioning and examination reference reuse the existing projection-specific SVGs. The area thumbnails and detail views are linked via `src/core/learning-visuals.ts`.

| Learning section | Visual learning examples |
| --- | --- |
| Radiographic anatomy | PA chest landmarks and axial CT orientation |
| Pathology | Pneumothorax, pleural effusion and intracranial haemorrhage schematics, matched to the selected published clinical example after findings are revealed |
| X-ray physics | Beam production/attenuation/scatter and inverse-square SID |
| Positioning | Existing AP and lateral elbow positioning diagrams plus 38 selectable projection entries |
| Exposure factors | Illustrative quantum mottle and kVp/mAs relationships |
| Room setup | Schematic room layout and beam–patient–detector alignment |
| Examination reference | Existing 76 projection-specific paired diagrams |
| Image critique and reporting | Structured chest search and image quality criteria |

**Provenance:** all new SVGs are original generated educational vector drawings and do not depict acquired patient images. They are schematic and not to scale. Do not treat them as accurate CT series, radiographs, dose calculations, or clinical positioning photographs. The separate pathology clinical reference images are identified and credited at `public/pathology/README.md`.

**Visual staging:** the pathology diagram is shown only when the learner reveals findings; this preserves the unlabelled first review of the original case image. All other Learning areas offer example images beside detailed text. The cards preview the relevant subject.

**Validation:** desktop/mobile browser regression checks ensure all card previews, area images and selected pathology diagrams load and correspond to their topic.
