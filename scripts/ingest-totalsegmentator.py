#!/usr/bin/env python3
"""Build a compact Bucky Lab HU case from PyVista's TotalSegmentator s1397 CT.

Source: TotalSegmentator v2.0.1 subject s1397, distributed by PyVista under CC BY 4.0.
This script is preprocessing-only: PyVista/VTK are not browser dependencies.
"""
from __future__ import annotations
import argparse, gzip, json
from pathlib import Path
import numpy as np


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--out',default='public/cases/totalseg-s1397')
    p.add_argument('--high-resolution',action='store_true',help='Use 320x320x547 source instead of PyVista 160x160x273 resample')
    p.add_argument('--stride',type=int,default=1,help='Additional integer downsample after loading')
    a=p.parse_args()
    if a.stride<1: raise SystemExit('--stride must be >= 1')
    try:
        from pyvista import examples
    except ImportError as e:
        raise SystemExit('Install preprocessing dependency: pip install pyvista') from e

    ds=examples.download_whole_body_ct_male(high_resolution=a.high_resolution)
    ct=ds['ct']
    dims=tuple(map(int,ct.dimensions)); spacing=tuple(map(float,ct.spacing)); origin=tuple(map(float,ct.origin))
    scalars=np.asarray(ct.active_scalars)
    if scalars.size != np.prod(dims): raise RuntimeError(f'Unexpected scalar count {scalars.size} for {dims}')
    # VTK point ordering is x-fastest, matching Bucky Lab's canonical voxel order.
    vol=scalars.reshape((dims[2],dims[1],dims[0]),order='C')
    if a.stride>1:
        vol=vol[::a.stride,::a.stride,::a.stride]
        spacing=tuple(s*a.stride for s in spacing)
    hu=np.rint(np.clip(vol,-1024,3071)).astype('<i2',copy=False)
    nz,ny,nx=hu.shape
    out=Path(a.out); out.mkdir(parents=True,exist_ok=True)
    raw=hu.tobytes(order='C')
    with gzip.open(out/'volume.i16.gz','wb',compresslevel=9) as f:f.write(raw)
    label_names=list(ds['segmentations'].keys())
    manifest={
      'version':1,'caseId':'totalseg-s1397','encoding':'int16-le','compression':'gzip',
      'dimensions':[nx,ny,nz],'spacingMm':list(spacing),'volumeUrl':'/cases/totalseg-s1397/volume.i16.gz',
      'huRange':[int(hu.min()),int(hu.max())],
      'source':{'name':'TotalSegmentator whole-body CT','record':'v2.0.1 subject s1397 via PyVista','doi':'10.5281/zenodo.6802614','case':'s1397','patientType':'living','licence':'CC BY 4.0'},
      'canonical':{'orientation':'PyVista/VTK source axes','voxelOrder':'x-fastest','sourceAffine':[[spacing[0],0,0,origin[0]],[0,spacing[1],0,origin[1]],[0,0,spacing[2],origin[2]],[0,0,0,1]],'affine':[[spacing[0],0,0,origin[0]],[0,spacing[1],0,origin[1]],[0,0,spacing[2],origin[2]],[0,0,0,1]]},
      'provenance':{'kind':'derived-from-real-source','method':'PyVista TotalSegmentator CT -> int16 HU teaching volume','clinicalSource':True,'qualityReferences':['TotalSegmentator s1397'],'notes':'Educational derived volume. CT voxels are source-derived; not synthetic anatomy.'},
      'segmentations':{'availableInSource':True,'count':len(label_names),'labels':label_names}
    }
    (out/'manifest.json').write_text(json.dumps(manifest,indent=2))
    print(f'Wrote {nx}x{ny}x{nz}, {len(raw)/1048576:.1f} MiB raw, HU {manifest["huRange"]}, {len(label_names)} source labels to {out}')

if __name__=='__main__':main()
