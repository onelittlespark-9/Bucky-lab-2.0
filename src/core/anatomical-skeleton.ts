/**
 * Adult anatomical bone-count contract.
 *
 * Animation rig joints are deformation controls and are never interchangeable
 * with anatomical bones. A future labelled skeletal asset is complete only when
 * it accounts for all 80 axial and 126 appendicular bones.
 */
export const ADULT_SKELETON = {
  axial: {
    skull: 22,
    auditoryOssicles: 6,
    hyoid: 1,
    vertebralColumn: 26,
    thoracicCage: 25,
  },
  appendicular: {
    pectoralGirdles: 4,
    upperLimbs: 60,
    pelvicGirdle: 2,
    lowerLimbs: 60,
  },
} as const;

export function anatomicalBoneCount() {
  const groups = [
    ...Object.values(ADULT_SKELETON.axial),
    ...Object.values(ADULT_SKELETON.appendicular),
  ];
  return groups.reduce((total, count) => total + count, 0);
}

export const ADULT_ANATOMICAL_BONE_COUNT = 206 as const;

if (anatomicalBoneCount() !== ADULT_ANATOMICAL_BONE_COUNT) {
  throw new Error("Adult anatomical skeleton inventory must total 206 bones");
}
