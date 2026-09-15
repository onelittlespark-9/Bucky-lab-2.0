#!/usr/bin/env python3
import argparse,json
from pathlib import Path
import numpy as np
import nibabel as nib
from scipy.ndimage import zoom

p=argparse.ArgumentParser()
p.add_argument('source')
p.add_argument('output')
p.add_argument('--case-id',default='vsd-z053')
p.add_argument('--voxel-mm',type=float,default=2.5)
a=p.parse_args()
out=Path(a.output); out.mkdir(parents=True,exist_ok=True)
image=nib.as_closest_canonical(nib.load(a.source))
hu=np.asarray(image.dataobj,dtype=np.float32)
if hu.ndim!=3: raise SystemExit('CT must be a 3D volume')
spacing=np.asarray(image.header.get_zooms()[:3],dtype=float)
factors=spacing/a.voxel_mm
if np.any(np.abs(factors-1)>1e-3): hu=zoom(hu,factors,order=1,prefilter=False)
hu=np.nan_to_num(hu,nan=-1000,posinf=3071,neginf=-1024)
hu=np.clip(np.rint(hu),-1024,3071).astype('<i2')
nx,ny,nz=map(int,hu.shape)
packed=np.transpose(hu,(2,1,0)).copy(order='C')
volume=out/'volume.i16'; packed.tofile(volume)
raw=np.fromfile(volume,dtype='<i2').reshape((nz,ny,nx))
for x,y,z in [(0,0,0),(nx//2,ny//2,nz//2),(nx-1,ny-1,nz-1)]:
    if int(raw[z,y,x])!=int(hu[x,y,z]): raise SystemExit('Voxel ordering validation failed')
manifest={'version':1,'caseId':a.case_id,'encoding':'int16-le','dimensions':[nx,ny,nz],
'spacingMm':[a.voxel_mm]*3,'volumeUrl':f'/cases/{a.case_id}/volume.i16','huRange':[int(hu.min()),int(hu.max())],
'source':{'name':'VSDFullBody','record':'Zenodo 8270365','doi':'10.5281/zenodo.8270365','case':'z053','patientType':'postmortem','licence':'CC BY-NC-SA'},
'canonical':{'orientation':'RAS+','voxelOrder':'x-fastest','sourceAffine':image.affine.tolist()}}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'dimensions':[nx,ny,nz],'huRange':manifest['huRange']},indent=2))
