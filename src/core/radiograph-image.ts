export interface RadiographImage{width:number;height:number;pixels:Uint8ClampedArray;createdAt:number}
let latest:RadiographImage|null=null;
export function radiographImage(width:number,height:number,pixels:Uint8ClampedArray):RadiographImage{latest={width,height,pixels:new Uint8ClampedArray(pixels),createdAt:Date.now()};return latest}
export function latestRadiograph(){return latest}
function paint(canvas:HTMLCanvasElement,image:RadiographImage){canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');if(!ctx)return;const rgba=new Uint8ClampedArray(image.width*image.height*4);for(let i=0;i<image.pixels.length;i++){const v=image.pixels[i];rgba[i*4]=rgba[i*4+1]=rgba[i*4+2]=v;rgba[i*4+3]=255}ctx.putImageData(new ImageData(rgba,image.width,image.height),0,0)}
/** React mounts the result canvas after exposure. Retry briefly so the acquired image is never lost during that view transition. */
export function renderRadiographWhenMounted(image:RadiographImage,attempt=0){if(typeof document==='undefined')return;const canvas=document.querySelector<HTMLCanvasElement>('.radiograph-stage canvas.image-canvas');if(canvas){paint(canvas,image);return}if(attempt<20)setTimeout(()=>renderRadiographWhenMounted(image,attempt+1),25)}
