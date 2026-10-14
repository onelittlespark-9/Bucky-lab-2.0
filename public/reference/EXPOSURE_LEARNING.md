# Projection exposure teaching library

Every one of the 38 configured radiographic projections has a dedicated exposure teaching entry in **Learning → Exposure factors**. Choose an anatomical area and its specific projection to see kVp, mAs, SID, grid, AEC flag, receptor orientation, tube angle, breathing instructions, centring, anatomical coverage and projection-specific image-quality checks. A button opens the matching positioning reference; another opens the corresponding X-ray workspace.

All numerical factors are drawn dynamically from `RADIOGRAPHIC_POSITIONS` — not a duplicated table. Projection notes are in `src/core/projection-exposures.ts`. The same `ProjectionExposureDetails` component is embedded under each selection in Examination Reference, so Learning and Reference remain consistent.

**Critical clinical limitation:** these are simulator teaching presets, not a validated UK NHS or other clinical exposure chart. They have not been verified against detector specifications, patient thickness, paediatric techniques, AEC chamber choices or departmental dose audits. AEC true is merely a stored simulation flag; displayed mAs must not be construed as the output of a physical AEC exposure. Actual UK clinical radiography requires locally authorised protocols and IR(ME)R optimisation. Do not transpose the presets into clinical practice.

Where a matching, licensed radiograph already exists, it appears as a visually informative example separate from the numerical simulator technique. No published radiograph is represented as having been acquired using those settings. For projections without real source imagery the interface says so and does not substitute an incorrect schematic as a clinical radiograph.

Browser regression visits all regions and all 38 projections at 1440px and 390px, checks all five exposure values in both Learning and Reference, and verifies selection/link navigation.
