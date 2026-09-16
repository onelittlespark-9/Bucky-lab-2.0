import type{LearningAnnotation,ImagePoint}from'./imaging-learning-model';
export interface ProjectionGeometry{rotationDeg:number;centreXPercent:number;centreYPercent:number;left:number;right:number;top:number;bottom:number}
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
function rotate(p:ImagePoint,deg:number){const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=p.x-.5,y=p.y-.5;return{x:.5+x*c-y*s,y:.5+x*s+y*c}}
/** Educational 2-D registration for image-space labels. Segmentation-derived 3-D landmarks should replace base points as regional masks mature. */
export function projectLearningPoint(p:ImagePoint,g:ProjectionGeometry):ImagePoint{const r=rotate(p,g.rotationDeg),w=Math.max(.08,1-(g.left+g.right)/100),h=Math.max(.08,1-(g.top+g.bottom)/100),cx=.5+g.centreXPercent/100,cy=.5+g.centreYPercent/100;return{x:clamp((r.x-(cx-w/2))/w),y:clamp((r.y-(cy-h/2))/h)}}
export function projectLearningAnnotations(a:LearningAnnotation[],g:ProjectionGeometry):LearningAnnotation[]{return a.map(v=>({...v,points:v.points.map(p=>projectLearningPoint(p,g))}))}
