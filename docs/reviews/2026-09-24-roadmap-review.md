# Issue #1 review after the elbow-reference commits

Baseline: https://github.com/onelittlespark-9/Bucky-lab-2.0/issues/1

Inspected main at `251fec00b67240d36af0ec14b2cacdf8c211eab0`.

## Deployment evidence

- Elbow reference assets, integration, styling and instructions landed in the September 24 sequence ending `765967f`.
- [Actions run #260](https://github.com/onelittlespark-9/Bucky-lab-2.0/actions/runs/35974814712) succeeded for that final elbow commit. Intermediate runs were cancelled under the workflow's cancel-in-progress policy.
- The newer `251fec0` rejects non-dedicated CT substitutions and labels simulated contrast. [Run #261](https://github.com/onelittlespark-9/Bucky-lab-2.0/actions/runs/36018592927) succeeded, as did the Cloudflare Workers check (version `88f84ad2-b5c4-4c1e-b45b-3af6cde5e3d3`).
- The legacy combined status endpoint has no statuses and reports pending; the two completed successful check runs are the relevant evidence. The roadmap's deployment-restoration checkbox is stale at this baseline. Passing deployment does not validate anatomical correctness.

## Roadmap assessment

| Item | Implemented evidence | Remaining gap |
| --- | --- | --- |
| Verified limb rendering | Fourteen male regional X-ray entries, including bilateral shoulder/humerus/hip/femur; regional asset integrity checks | Elbow, forearm, wrist, hand, knee, tibia/fibula, ankle and foot have no registered male sources. No female X-ray models are registered. `extractLimbVolume` is not used by the live rendering path. Existing regional registration does not establish complete limb coverage or articulated projection correctness. |
| Projection-specific anatomy | 38 presets, region/projection teaching text, two dedicated elbow positioning/collimation SVG pairs | SVGs are teaching references, not segmented volumes. Other visual references use the generic articulated patient. `AcquisitionState` carries the pose, but `projectionOptions` does not pass joint articulation to the DRR engine. The loaded source CT is not deformed to match the displayed joint pose. |
| Anatomy Learning foundation | Learning hub, teaching taxonomy, reveal/tap overlay component and pathology prose | `anatomyLabelsFor` is unused. Live markers come from fixed normalised screen coordinates in `imaging-learning-model.ts`; CT markers are not registered to structure masks or slice location. They are not a completed registered X-ray/CT anatomy learning workflow. |
| Higher-priority CT work | Latest commit rejects invalid substitutes and identifies simulated contrast | Rejection is not delivery of missing female dedicated CT datasets. This and coverage/contrast validation remain open under the roadmap's implementation order. |

All three anatomy items remain genuinely incomplete. No functional roadmap checkbox was changed in this batch.

## Recommendation and bounded implementation

The highest-impact anatomy gap is verified anatomy coupled to the visible pose and actual projection. A subsequent rendering batch should cover one region and two projections end to end: source/licence/coverage evidence, joint-to-volume mapping, and pixel plus visual validation. It must not enable elbow exposure merely because elbow SVG references exist. This does not supersede the roadmap's earlier CT-data priorities.

The immediate, small batch fixes misleading reference-image reuse: selecting an unavailable elbow after a generated chest image previously left the chest canvas visible under the elbow heading. The component now remounts by patient/projection, clears and hides the canvas until successful rendering, checks source availability, ignores obsolete asynchronous loads, and presents explicit failure/unavailability states. Generated images are described as simulations rather than verified ideal radiographs.

Validation: the full production build passes (patient assets, six regional CT assets, fourteen X-ray assets, CT-series matching, DRR geometry, TypeScript and Vite). `scripts/validate-reference-library.mjs` exercises successful rendering, unavailable anatomy, failed loading, pending loading, late completion and recovery against a browser preview. Local browser launch was blocked by the execution environment (socket operation not permitted). The focused browser regression is now a required workflow step before deployment; its remote result is reported in the delivery response.

To run the focused regression after `npm run build`, start `npm exec vite -- preview --host 127.0.0.1`, then run `node scripts/validate-reference-library.mjs` after `npx playwright install chromium`. `PLAYWRIGHT_MODULE` can point to an existing Playwright installation; `BASE_URL` defaults to `http://127.0.0.1:4173`.
