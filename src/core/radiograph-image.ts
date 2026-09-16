export interface RadiographImage{width:number;height:number;pixels:Uint8ClampedArray;createdAt:number}
export function radiographImage(width:number,height:number,pixels:Uint8ClampedArray):RadiographImage{return{width,height,pixels:new Uint8ClampedArray(pixels),createdAt:Date.now()}}
