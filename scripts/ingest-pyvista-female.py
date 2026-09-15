#!/usr/bin/env python3
import gzip,json,sys
from pathlib import Path
import numpy as np
import pyvista as pv
src=Path(sys.argv[1]);out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
data=pv.read(src)
# PyVista female example is a labelled/CT MultiBlock. Select the CT image block by scalar range.
blocks=[]
if isinstance(data,pv.MultiBlock):
    for b in data:
        if b is not None and getattr(b,'n_points',0): blocks.append(b)
else: blocks=[data]
ct=None
for b in blocks:
    names=list(b.point_data.keys())+list(b.cell_data.keys())
    for name in names:
        a=np.asarray(b[name])
        if np.issubdtype(a.dtype,np.number) and a.size>1000 and float(np.nanmin(a))< -500 and float(np.nanmax(a))>500:
            ct=(b,a);break
    if ct:break
if ct is None: raise RuntimeError('Could not identify CT HU scalar array in female PyVista dataset')
b,a=ct
dims=tuple(int(x) for x in b.dimensions)
if a.size==np.prod(dims): arr=a.reshape(dims,order='F')
elif a.size==np.prod(np.array(dims)-1):
    dims=tuple(int(x-1) for x in dims);arr=a.reshape(dims,order='F')
else: raise RuntimeError(f'Unexpected CT scalar size {a.size} for dimensions {b.dimensions}')
# Browser volume order is z,y,x.
arr=np.transpose(arr,(2,1,0));arr=np.clip(np.rint(arr),-1024,3071).astype('<i2')
raw=arr.tobytes(order='C')
with gzip.open(out/'volume.i16.gz','wb',compresslevel=9) as f:f.write(raw)
spacing=[float(x) for x in b.spacing]
manifest={'id':'totalseg-female','label':'Adult female · TotalSegmentator/PyVista','dimensions':[int(arr.shape[2]),int(arr.shape[1]),int(arr.shape[0])],'spacing':spacing,'dtype':'int16','endianness':'little','volume':'volume.i16.gz','huRange':[-1024,3071],'patientSex':'female','patientType':'living','provenance':'derived-from-real-source','source':{'dataset':'TotalSegmentator whole-body CT female example distributed by PyVista','upstream':'pyvista.examples.download_whole_body_ct_female','anatomy':'real CT voxel intensities','note':'Educational source-derived anatomy; not for diagnostic use.'}}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest,indent=2))
