#!/usr/bin/env python3
"""Build anatomy-specific CT/X-ray volumes from verified segmentation bounds."""
from __future__ import annotations
import argparse,gzip,json
from pathlib import Path
import numpy as np
REGIONS={'head':['brain','skull'],'neck':['vertebrae_C1','vertebrae_C2','vertebrae_C3','vertebrae_C4','vertebrae_C5','vertebrae_C6','vertebrae_C7','trachea'],'chest':['lung_upper_lobe_left','lung_lower_lobe_left','lung_upper_lobe_right','lung_middle_lobe_right','lung_lower_lobe_right','heart'],'abdomen-pelvis':['liver','spleen','kidney_left','kidney_right','urinary_bladder'],'kub':['kidney_left','kidney_right','urinary_bladder'],'pelvis':['hip_left','hip_right','sacrum'],'cervical-spine':['vertebrae_C1','vertebrae_C2','vertebrae_C3','vertebrae_C4','vertebrae_C5','vertebrae_C6','vertebrae_C7'],'shoulder-left':['humerus_left','scapula_left','clavicula_left'],'shoulder-right':['humerus_right','scapula_right','clavicula_right'],'humerus-left':['humerus_left'],'humerus-right':['humerus_right'],'hip-left':['femur_left','hip_left'],'hip-right':['femur_right','hip_right'],'femur-left':['femur_left'],'femur-right':['femur_right']}
def union_bounds(index,names):
 found=[index['regions'][n]['bounds'] for n in names if n in index['regions']]
 if not found:return None
 return{k:(min(b[k] for b in found)if k[-1]=='0'else max(b[k] for b in found))for k in('x0','x1','y0','y1','z0','z1')}
def expand(b,dims,spacing,margin_mm):
 out={}
 for axis,n in zip('xyz',dims):
  m=int(round(margin_mm/spacing['xyz'.index(axis)]));out[axis+'0']=max(0,b[axis+'0']-m);out[axis+'1']=min(n-1,b[axis+'1']+m)
 return out
def strict_head_bounds(regions,dims,spacing):
 """Return vertex-to-skull-base coverage only. C2 is a landmark for orientation, not included anatomy."""
 skull=regions['regions'].get('skull',{}).get('bounds');brain=regions['regions'].get('brain',{}).get('bounds');c2=regions['regions'].get('vertebrae_C2',{}).get('bounds')
 if not skull:raise RuntimeError('Head build requires verified skull segmentation')
 # Small x/y skin margin is allowed. Inferior z is clamped to the skull itself so neck/shoulders
 # cannot enter the head acquisition. C2 identifies which skull end is inferior if orientation flips.
 b=union_bounds(regions,['skull','brain']) or dict(skull);xy_mm=12
 for axis in ('x','y'):
  i='xyz'.index(axis);m=max(1,int(round(xy_mm/spacing[i])));b[axis+'0']=max(0,b[axis+'0']-m);b[axis+'1']=min(dims[i]-1,b[axis+'1']+m)
 z0,z1=skull['z0'],skull['z1'];c=(c2['z0']+c2['z1'])/2 if c2 else z0-1
 inferior='z0' if abs(c-z0)<abs(c-z1) else 'z1';m=max(1,int(round(3/spacing[2])))
 if inferior=='z0':b['z0']=max(0,z0-m);b['z1']=min(dims[2]-1,z1+m)
 else:b['z0']=max(0,z0-m);b['z1']=min(dims[2]-1,z1+m)
 return b

def main():
 p=argparse.ArgumentParser();p.add_argument('--case',required=True);p.add_argument('--sex',required=True,choices=['male','female']);p.add_argument('--out',default='public/cases');p.add_argument('--margin-mm',type=float,default=25);a=p.parse_args();root=Path(a.case);manifest=json.loads((root/'manifest.json').read_text());regions=json.loads((root/'regions.json').read_text());dims=manifest['dimensions'];spacing=manifest['spacingMm'];raw=gzip.decompress((root/'volume.i16.gz').read_bytes());vol=np.frombuffer(raw,dtype='<i2').reshape((dims[2],dims[1],dims[0]));built=[]
 for region,names in REGIONS.items():
  b=strict_head_bounds(regions,dims,spacing) if region=='head' else union_bounds(regions,names)
  if not b:continue
  if region!='head':b=expand(b,dims,spacing,a.margin_mm)
  crop=vol[b['z0']:b['z1']+1,b['y0']:b['y1']+1,b['x0']:b['x1']+1];anatomy,_,side=region.partition('-');dest=Path(a.out)/'regional'/a.sex/region;dest.mkdir(parents=True,exist_ok=True)
  with gzip.open(dest/'volume.i16.gz','wb',compresslevel=9)as f:f.write(crop.astype('<i2',copy=False).tobytes())
  cm=dict(manifest);cm['caseId']=f"{manifest['caseId']}-{region}";cm['dimensions']=[crop.shape[2],crop.shape[1],crop.shape[0]];cm['volumeUrl']=f"/cases/regional/{a.sex}/{region}/volume.i16.gz";cm['coverage']={'region':anatomy,'side':side or None,'sourceBounds':b,'structures':[n for n in names if n in regions['regions']],'method':'strict-skull-segmentation'if region=='head'else'verified-segmentation-bounds','marginMm':3 if region=='head'else a.margin_mm,'landmarks':['vertex','skull_base']if region=='head'else []};cm.pop('segmentations',None);(dest/'manifest.json').write_text(json.dumps(cm,indent=2));built.append(region)
 (Path(a.out)/'regional'/a.sex/'catalogue.json').write_text(json.dumps({'version':1,'sex':a.sex,'sourceCase':manifest['caseId'],'regions':built},indent=2));print('Built:',', '.join(built))
if __name__=='__main__':main()
