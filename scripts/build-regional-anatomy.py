#!/usr/bin/env python3
"""Build modality-ready anatomy volumes from verified segmentation bounds.

All outputs retain source HU voxels and are shared by CT and radiographic DRR. Bounds are derived
from named segmentations/landmarks, never arbitrary whole-body percentages. Missing anatomy is
omitted rather than substituted.
"""
from __future__ import annotations
import argparse,gzip,json
from pathlib import Path
import numpy as np
REGIONS={
'head':['brain','skull'],'neck':['skull','vertebrae_C1','vertebrae_C2','vertebrae_C3','vertebrae_C4','vertebrae_C5','vertebrae_C6','vertebrae_C7','trachea'],'chest':['lung_upper_lobe_left','lung_lower_lobe_left','lung_upper_lobe_right','lung_middle_lobe_right','lung_lower_lobe_right','heart'],'cap':['lung_upper_lobe_left','lung_upper_lobe_right','liver','spleen','kidney_left','kidney_right','urinary_bladder','hip_left','hip_right'],'abdomen':['liver','spleen','kidney_left','kidney_right'],'abdomen-pelvis':['liver','spleen','kidney_left','kidney_right','urinary_bladder','hip_left','hip_right'],'kub':['kidney_left','kidney_right','urinary_bladder'],'pelvis':['hip_left','hip_right','sacrum'],'cervical-spine':['vertebrae_C1','vertebrae_C2','vertebrae_C3','vertebrae_C4','vertebrae_C5','vertebrae_C6','vertebrae_C7'],'thoracic-spine':[f'vertebrae_T{i}' for i in range(1,13)],'lumbar-spine':[f'vertebrae_L{i}' for i in range(1,6)],
'shoulder-left':['humerus_left','scapula_left','clavicula_left'],'shoulder-right':['humerus_right','scapula_right','clavicula_right'],'humerus-left':['humerus_left'],'humerus-right':['humerus_right'],'elbow-left':['humerus_left','radius_left','ulna_left'],'elbow-right':['humerus_right','radius_right','ulna_right'],'forearm-left':['radius_left','ulna_left'],'forearm-right':['radius_right','ulna_right'],'wrist-left':['radius_left','ulna_left','carpal_left'],'wrist-right':['radius_right','ulna_right','carpal_right'],'hand-left':['carpal_left','metacarpal_left','phalanges_hand_left'],'hand-right':['carpal_right','metacarpal_right','phalanges_hand_right'],'hip-left':['femur_left','hip_left'],'hip-right':['femur_right','hip_right'],'femur-left':['femur_left'],'femur-right':['femur_right'],'knee-left':['femur_left','patella_left','tibia_left','fibula_left'],'knee-right':['femur_right','patella_right','tibia_right','fibula_right'],'tibia-fibula-left':['tibia_left','fibula_left'],'tibia-fibula-right':['tibia_right','fibula_right'],'ankle-left':['tibia_left','fibula_left','talus_left'],'ankle-right':['tibia_right','fibula_right','talus_right'],'foot-left':['talus_left','calcaneus_left','tarsal_left','metatarsal_left','phalanges_foot_left'],'foot-right':['talus_right','calcaneus_right','tarsal_right','metatarsal_right','phalanges_foot_right']}
CT={'head','neck','chest','cap','abdomen-pelvis','kub'}
XRAY=set(REGIONS)-{'cap','kub'}
def union_bounds(index,names):
 found=[index['regions'][n]['bounds'] for n in names if n in index['regions']]
 if not found:return None,[]
 return({k:(min(b[k] for b in found)if k[-1]=='0'else max(b[k] for b in found))for k in('x0','x1','y0','y1','z0','z1')},[n for n in names if n in index['regions']])
def expand(b,dims,spacing,mm):
 o={}
 for axis,n in zip('xyz',dims):
  m=int(round(mm/spacing['xyz'.index(axis)]));o[axis+'0']=max(0,b[axis+'0']-m);o[axis+'1']=min(n-1,b[axis+'1']+m)
 return o
def strict_head(regions,dims,spacing):
 skull=regions['regions'].get('skull',{}).get('bounds');brain=regions['regions'].get('brain',{}).get('bounds')
 if not skull:raise RuntimeError('Head requires skull segmentation')
 b=dict(skull)
 if brain:
  for k in b:b[k]=min(b[k],brain[k]) if k[-1]=='0' else max(b[k],brain[k])
 for axis in('x','y'):
  i='xyz'.index(axis);m=max(1,round(12/spacing[i]));b[axis+'0']=max(0,b[axis+'0']-m);b[axis+'1']=min(dims[i]-1,b[axis+'1']+m)
 m=max(1,round(3/spacing[2]));b['z0']=max(0,skull['z0']-m);b['z1']=min(dims[2]-1,skull['z1']+m);return b
def main():
 p=argparse.ArgumentParser();p.add_argument('--case',required=True);p.add_argument('--sex',required=True,choices=['male','female']);p.add_argument('--out',default='public/cases');p.add_argument('--margin-mm',type=float,default=20);a=p.parse_args();root=Path(a.case);m=json.loads((root/'manifest.json').read_text());r=json.loads((root/'regions.json').read_text());dims=m['dimensions'];sp=m['spacingMm'];vol=np.frombuffer(gzip.decompress((root/'volume.i16.gz').read_bytes()),dtype='<i2').reshape((dims[2],dims[1],dims[0]));built={};missing={}
 for region,names in REGIONS.items():
  if region=='head':b,labels=strict_head(r,dims,sp),[n for n in names if n in r['regions']]
  else:b,labels=union_bounds(r,names)
  # Multi-bone limb regions require at least two verified source structures. This prevents a femur-only
  # crop being presented as a knee/ankle/etc when the source lacks distal appendicular segmentations.
  limb='-' in region and region.split('-')[0] in {'shoulder','elbow','forearm','wrist','hand','hip','knee','tibia','ankle','foot'}
  if not b or (limb and len(labels)<min(2,len(names))):missing[region]=[n for n in names if n not in r['regions']];continue
  if region!='head':b=expand(b,dims,sp,a.margin_mm)
  crop=vol[b['z0']:b['z1']+1,b['y0']:b['y1']+1,b['x0']:b['x1']+1];dest=Path(a.out)/'regional'/a.sex/region;dest.mkdir(parents=True,exist_ok=True)
  with gzip.open(dest/'volume.i16.gz','wb',compresslevel=9)as f:f.write(crop.astype('<i2',copy=False).tobytes())
  cm=dict(m);cm['caseId']=f"{m['caseId']}-{region}";cm['dimensions']=[crop.shape[2],crop.shape[1],crop.shape[0]];cm['volumeUrl']=f"/cases/regional/{a.sex}/{region}/volume.i16.gz";cm['coverage']={'region':region,'sourceBounds':b,'sourcePatient':{'dimensions':dims,'spacingMm':sp,'originMm':[m['canonical']['sourceAffine'][0][3],m['canonical']['sourceAffine'][1][3],m['canonical']['sourceAffine'][2][3]]},'structures':labels,'method':'strict-skull-segmentation'if region=='head'else'verified-segmentation-bounds','modalities':(['ct']if region in CT else[])+(['xray-drr']if region in XRAY else[])};cm.pop('segmentations',None);(dest/'manifest.json').write_text(json.dumps(cm,indent=2));built[region]=cm['coverage']['modalities']
 out=Path(a.out)/'regional'/a.sex;out.mkdir(parents=True,exist_ok=True);(out/'catalogue.json').write_text(json.dumps({'version':2,'sex':a.sex,'sourceCase':m['caseId'],'regions':built,'missing':missing,'rule':'No missing anatomy is substituted from whole-body data.'},indent=2));print('Built',len(built),'regions; missing',len(missing))
if __name__=='__main__':main()
