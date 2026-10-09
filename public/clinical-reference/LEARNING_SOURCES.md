# Source authenticity and scope

Bucky Lab 2.0 uses real published radiographs and CT images for anatomy, pathology and image critique. Real equipment photography shows the X-ray room for physics and room-layout learning. No fake anatomy is presented as an acquired X-ray.

- Components of projectional radiography: public-domain U.S. Navy photograph annotated by Mikael Häggström (CC0); the source photograph describes the projectional imaging components, not a controlled experiment.
- Hospital Radiology Room Philips DigitalDiagnost Digital Radiography System: Ptrump16 (CC BY-SA 4.0). Unmodified.
- X-ray Room: Rtstudents (CC BY-SA 3.0). Unmodified.
- Original PA chest for exposure and image critique: Mikael Häggström (CC0).
- Pathology cases retain their original file and original credit in `public/pathology/README.md`.

Source pages, SHA-1s and filenames for the three real equipment photographs are in `src/core/learning-photo-sources.json`. Checksummed downloads are handled by `scripts/prepare-learning-photos.mjs`.

**Exposure comparison**: the illustrative paired image is derived from the real PA chest using deterministic digitally added Gaussian noise in `scripts/create-exposure-demonstrations.py`. Its purpose is qualitative: it does not recreate acquisition mAs, tube current, radiation dose, realistic detector MTF/NNPS or the effect of changing kVp. Both panels come from one source radiograph; no patient re-exposure occurred.

**Quality of learning overlays**: annotations on chest radiographs are approximate educational pointers. They are not radiologist-reviewed segmentation contours or a diagnostic result. Pathology reference case images themselves are shown unchanged.

**Projections outstanding**: radiographic positioning photographs for most of the 38 defined projections are still not available. Some older simplified vector figures in Examination Reference remain explicitly marked unverified and should not be treated as correct positioning instruction. All eight top-level Learning areas have more realistic visual examples after this update.
