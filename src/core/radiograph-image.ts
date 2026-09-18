export interface RadiographImage{width:number;height:number;pixels:Uint8ClampedArray;createdAt:number}
let latest:RadiographImage|null=null;
export function radiographImage(width:number,height:number,pixels:Uint8ClampedArray):RadiographImage{latest={width,height,pixels:new Uint8ClampedArray(pixels),createdAt:Date.now()};return latest}
export function latestRadiograph(){return latest}
function bitmap(image:RadiographImage){const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');if(!ctx)return null;const rgba=new Uint8ClampedArray(image.width*image.height*4);for(let i=0;i<image.pixels.length;i++){const v=image.pixels[i];rgba[i*4]=rgba[i*4+1]=rgba[i*4+2]=v;rgba[i*4+3]=255}ctx.putImageData(new ImageData(rgba,image.width,image.height),0,0);return c}
/** Paint into the actual CSS-sized detector surface. This avoids mobile browsers displaying only
 * the small intrinsic DRR bitmap in the middle of a much larger responsive canvas. */
function paint(canvas:HTMLCanvasElement,image:RadiographImage){
 const source=bitmap(image);if(!source)return;
 const rect=canvas.getBoundingClientRect(),cssW=Math.max(1,Math.round(rect.width||image.width)),cssH=Math.max(1,Math.round(rect.height||image.height)),dpr=Math.min(2,Math.max(1,window.devicePixelRatio||1));
 canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
 const ctx=canvas.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#010407';ctx.fillRect(0,0,cssW,cssH);
 const scale=Math.min(cssW/image.width,cssH/image.height),dw=image.width*scale,dh=image.height*scale,dx=(cssW-dw)/2,dy=(cssH-dh)/2;
 ctx.imageSmoothingEnabled=true;ctx.drawImage(source,dx,dy,dw,dh);
 canvas.dataset.rendered='true';
}
/** React mounts the result canvas after exposure. Observe its final responsive size and repaint
 * when orientation/layout changes so Android and desktop use the same detector presentation. */
export function renderRadiographWhenMounted(image:RadiographImage,attempt=0){
 if(typeof document==='undefined')return;const canvas=document.querySelector<HTMLCanvasElement>('.radiograph-stage canvas.image-canvas');
 if(canvas){requestAnimationFrame(()=>paint(canvas,image));if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>paint(canvas,image));observer.observe(canvas);setTimeout(()=>observer.disconnect(),3000)}return}
 if(attempt<40)setTimeout(()=>renderRadiographWhenMounted(image,attempt+1),25)
}
