import{detectorGeometry}from'../src/core/drr';
import type{TeachingVolume}from'../src/core/teaching-volume';
const manifest={dimensions:[117,91,105],spacingMm:[3,3,3.0054945055]} as any;
const volume={source:{manifest}} as TeachingVolume;
const near=detectorGeometry(volume,{view:'PA',kVp:125,mAs:2,sidCm:100}),far=detectorGeometry(volume,{view:'PA',kVp:125,mAs:2,sidCm:180});
if(!(near.magnification>far.magnification&&near.inverseSquare>far.inverseSquare))throw new Error('DRR SID geometry regression: shorter SID must increase magnification and detector fluence');
if(!(far.magnification>1&&Number.isFinite(far.magnification)))throw new Error('DRR magnification must be finite and > 1');
console.log('Validated DRR geometry invariants.');
