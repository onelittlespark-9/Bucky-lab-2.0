import type{RadiographicPosition,StartingField}from'./radiographic-positions';
export interface AoiReviewGeometry{ideal:StartingField;actual:StartingField;centreError:{x:number;y:number;distance:number};coverageError:{left:number;right:number;top:number;bottom:number};note:string}
const clamp=(v:number)=>Math.max(0,Math.min(100,v));
/** Descriptive comparison only. Acceptance must be based on projection-specific image criteria,
 * not an invented percentage tolerance around the preset field. */
export function reviewAoi(p:RadiographicPosition,actual:StartingField):AoiReviewGeometry{
 const ideal=p.startingField,dx=actual.centreX-ideal.centreX,dy=actual.centreY-ideal.centreY,distance=Math.hypot(dx,dy);
 const coverageError={left:actual.left-ideal.left,right:actual.right-ideal.right,top:actual.top-ideal.top,bottom:actual.bottom-ideal.bottom};
 return{ideal,actual,centreError:{x:dx,y:dy,distance},coverageError,note:'Educational 2-D comparison with the projection preset. Values describe deviation only; they are not pass/fail tolerances and are not segmentation-registered anatomy.'};
}
export function fieldRect(f:StartingField){const width=clamp(100-f.left-f.right),height=clamp(100-f.top-f.bottom);return{left:clamp(f.centreX+50-width/2),top:clamp(f.centreY+50-height/2),width,height}}
