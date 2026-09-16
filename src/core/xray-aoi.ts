import type{RadiographicPosition}from'./radiographic-positions';
export type XrayAoi='head'|'cervical'|'thorax'|'abdomen'|'pelvis'|'shoulder'|'upper-arm'|'elbow'|'forearm'|'wrist'|'hand'|'femur'|'knee'|'lower-leg'|'ankle'|'foot'|'whole';
export interface XrayAoiGeometry{aoi:XrayAoi;detectorWidthCm:number;detectorHeightCm:number;defaultZoom:number;landmark:string}
function norm(v:string){return v.toLowerCase().replace(/[^a-z0-9]+/g,' ')}
export function xrayAoiFor(p:RadiographicPosition):XrayAoiGeometry{const s=norm(`${p.region} ${p.projection}`);let aoi:XrayAoi='whole',w=35,h=43,z=1,landmark=p.region;
 if(/facial|skull|sinus|odontoid/.test(s)){aoi='head';w=24;h=30;z=1.65;landmark='Skull and facial bones'}
 else if(/cervical|c spine/.test(s)){aoi='cervical';w=24;h=30;z=1.55;landmark='Cervical spine'}
 else if(/chest|thorax/.test(s)){aoi='thorax';w=35;h=43;z=1.05;landmark='Thorax'}
 else if(/thoracic|t spine/.test(s)){aoi='thorax';w=24;h=43;z=1.25;landmark='Thoracic spine'}
 else if(/lumbar|l spine|abdomen/.test(s)){aoi='abdomen';w=35;h=43;z=1.15;landmark=/lumbar|l spine/.test(s)?'Lumbar spine':'Abdomen'}
 else if(/pelvis|hip/.test(s)){aoi='pelvis';w=35;h=43;z=1.2;landmark='Pelvis and hip'}
 else if(/shoulder/.test(s)){aoi='shoulder';w=24;h=30;z=1.7;landmark='Shoulder girdle'}
 else if(/humerus/.test(s)){aoi='upper-arm';w=24;h=30;z=1.7;landmark='Humerus'}
 else if(/elbow/.test(s)){aoi='elbow';w=18;h=24;z=2.1;landmark='Elbow joint'}
 else if(/forearm/.test(s)){aoi='forearm';w=24;h=30;z=1.8;landmark='Radius and ulna'}
 else if(/wrist/.test(s)){aoi='wrist';w=18;h=24;z=2.35;landmark='Wrist'}
 else if(/hand/.test(s)){aoi='hand';w=24;h=30;z=2.0;landmark='Hand'}
 else if(/femur/.test(s)){aoi='femur';w=24;h=43;z=1.55;landmark='Femur'}
 else if(/knee/.test(s)){aoi='knee';w=24;h=30;z=1.85;landmark='Knee joint'}
 else if(/tibia|fibula|lower leg/.test(s)){aoi='lower-leg';w=24;h=43;z=1.55;landmark='Tibia and fibula'}
 else if(/ankle/.test(s)){aoi='ankle';w=18;h=24;z=2.25;landmark='Ankle joint'}
 else if(/foot|calcane/.test(s)){aoi='foot';w=24;h=30;z=2.0;landmark='Foot'}
 return{aoi,detectorWidthCm:w,detectorHeightCm:h,defaultZoom:z,landmark}}
