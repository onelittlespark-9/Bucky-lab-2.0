import React from 'react';
export function PatientPositioner({rotation,x,y,onRotation}:{rotation:number;x:number;y:number;onRotation:(v:number)=>void}){
 return <div className="patient-positioner">
  <div className="room-rail"><span>Tube</span></div><div className="detector-stand"><span>Detector</span></div>
  <div className="patient-model" style={{transform:`translate(${x*.7}%,${-y*.7}%) rotateY(${rotation}deg)`}} aria-label="Patient positioning model">
   <div className="model-head"/><div className="model-neck"/><div className="model-torso"/><div className="model-arm model-left"><i/><b/></div><div className="model-arm model-right"><i/><b/></div><div className="model-pelvis"/><div className="model-leg model-left"><i/><b/></div><div className="model-leg model-right"><i/><b/></div>
  </div>
  <label>Patient rotation <b>{rotation}°</b><input type="range" min="-180" max="180" value={rotation} onChange={e=>onRotation(+e.target.value)}/></label>
  <small>Position the patient before exposure. Volumetric anatomy remains the projection source.</small>
 </div>
}
