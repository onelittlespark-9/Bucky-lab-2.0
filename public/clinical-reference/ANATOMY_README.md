# Anatomical images in Bucky Lab 2.0 Learning

The two previous simplistic SVG examples shown in **Learning → Radiographic anatomy** have been replaced by locally bundled, authentic clinical images:

- PA chest: Mikael Häggström, [normal posteroanterior chest radiograph](https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg), CC0 1.0. Original dimensions 1929×2207.
- Axial abdomen: Mikael Häggström, MD, [normal contrast-enhanced axial abdominal CT example, slice 71](https://commons.wikimedia.org/wiki/File:CT_of_a_normal_abdomen_and_pelvis,_axial_plane_71.png), CC0 1.0. Original 786×346, showing source multi-window content.

Download and integrity checking are performed by `scripts/prepare-learning-anatomy.mjs`, which rejects any file that does not exactly match the publicly recorded SHA-1 checksum. Assets are persisted to `public/clinical-reference` by GitHub Actions. The normal production build validates their existence and Playwright checks that both anatomical examples load on desktop and mobile.

Teaching overlay pointers on PA chest are approximate and are **not** clinically validated segmentation boundaries or radiological measurements. The toggle hides these overlays. A single selected CT slice does not display every organ, so the section teaches CT orientation and directs learners to the CT lab for slice-by-slice anatomy.

These authentic published teaching cases are *not* the same patient as the Bucky Lab simulation. The pathology and physics Learning examples have their own provenance and are not altered by this batch.
