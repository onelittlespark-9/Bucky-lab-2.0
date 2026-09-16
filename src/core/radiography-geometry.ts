export type PatientSide='left'|'right';
export type LimbRegion='shoulder'|'humerus'|'elbow'|'forearm'|'wrist'|'hand'|'femur'|'knee'|'tibia-fibula'|'ankle'|'foot';

const REGION_ALIASES:Record<string,LimbRegion>={
 shoulder:'shoulder',humerus:'humerus',elbow:'elbow',forearm:'forearm',wrist:'wrist',hand:'hand',femur:'femur',knee:'knee','tibia/fibula':'tibia-fibula','tibia-fibula':'tibia-fibula',ankle:'ankle',foot:'foot'
};

export function limbRegionForAnatomy(region:string):LimbRegion|null{
 return REGION_ALIASES[region.trim().toLowerCase()]??null;
}

export interface ArticulatedPatientPose{
 bodyYawDeg:number;
 bodyPitchDeg:number;
 bodyRollDeg:number;
 translationXPercent:number;
 translationYPercent:number;
 headRotationDeg:number;
 leftShoulderDeg:number;
 rightShoulderDeg:number;
 leftElbowDeg:number;
 rightElbowDeg:number;
 leftHipDeg:number;
 rightHipDeg:number;
 leftKneeDeg:number;
 rightKneeDeg:number;
}

export const neutralPatientPose=():ArticulatedPatientPose=>({
 bodyYawDeg:0,bodyPitchDeg:0,bodyRollDeg:0,translationXPercent:0,translationYPercent:0,headRotationDeg:0,
 leftShoulderDeg:0,rightShoulderDeg:0,leftElbowDeg:0,rightElbowDeg:0,leftHipDeg:0,rightHipDeg:0,leftKneeDeg:0,rightKneeDeg:0
});

export interface RadiographyGeometry{
 detector:{orientation:'portrait'|'landscape';sidCm:number};
 tube:{angleDeg:number;centreXPercent:number;centreYPercent:number};
 collimation:{left:number;right:number;top:number;bottom:number};
 patient:ArticulatedPatientPose;
}

export function geometryFromPreset(input:{sidCm:number;tubeAngleDeg:number;bodyYawDeg:number;centreXPercent:number;centreYPercent:number;detector:'portrait'|'landscape';collimation:{left:number;right:number;top:number;bottom:number}}):RadiographyGeometry{
 const patient=neutralPatientPose();patient.bodyYawDeg=input.bodyYawDeg;
 return{detector:{orientation:input.detector,sidCm:input.sidCm},tube:{angleDeg:input.tubeAngleDeg,centreXPercent:input.centreXPercent,centreYPercent:input.centreYPercent},collimation:{...input.collimation},patient};
}
