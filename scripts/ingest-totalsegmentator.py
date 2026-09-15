#!/usr/bin/env python3
"""Build a compact Bucky Lab HU case from PyVista's TotalSegmentator s1397 CT.

Source: TotalSegmentator v2.0.1 subject s1397, distributed by PyVista under CC BY 4.0.
This script is preprocessing-only: PyVista/VTK are not browser dependencies.
"""
from __future__ import annotations
import argparse, gzip, json, math
from pathlib import Path
import numpy as np


def voxel_bounds(world_bounds,origin,spacing,dims,stride):
    # Convert the segmentation mesh's verified world-space bounds into the canonical CT voxel grid.
    out=[]
    for axis in range(3):
        lo=(world_bounds[axis*2]-origin[axis])/spacing[axis]/stride
        hi=(world_bounds[axis*2+1]-origin[axis])/spacing[axis]/stride
        out.extend([max(0,min(dims[axis]-1,int(math.floor(lo)))),max(0,min(dims[axis]-1,int(math.ceil(hi))))])
    return {'x0':out[0],'x1':out[1],'y0':out[2],'y1':out[3],'z0':out[4],'z1':out[5]}


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
    source_dims=tuple(map(int,ct.dimensions)); spacing=tuple(map(float,ct.spacing)); origin=tuple(map(float,ct.origin))
    scalars=np.asarray(ct.active_scalars)
    if scalars.size != np.prod(source_dims): raise RuntimeError(f'Unexpected scalar count {scalars.size} for {source_dims}')
    vol=scalars.reshape((source_dims[2],source_dims[1],source_dims[0]),order='C')
    if a.stride>1:
        vol=vol[::a.stride,::a.stride,::a.stride]
        output_spacing=tuple(s*a.stride for s in spacing)
    else: output_spacing=spacing
    hu=np.rint(np.clip(vol,-1024,3071)).astype('<i2',copy=False)
    nz,ny,nx=hu.shape; output_dims=(nx,ny,nz)
    out=Path(a.out); out.mkdir(parents=True,exist_ok=True)
    raw=hu.tobytes(order='C')
    with gzip.open(out/'volume.i16.gz','wb',compresslevel=9) as f:f.write(raw)

    segmentations=ds['segmentations']; label_names=list(segmentations.keys()); regions={}
    for name in label_names:
        mesh=segmentations[name]
        if mesh is None or getattr(mesh,'n_points',0)==0: continue
        regions[name]={'sourceLabel':name,'bounds':voxel_bounds(mesh.bounds,origin,spacing,output_dims,a.stride),'source':'segmentation'}
    (out/'regions.json').write_text(json.dumps({'version':1,'caseId':'totalseg-s1397','coordinateSystem':'canonical-volume-voxels','regions':regions},indent=2))

    manifest={
      'version':1,'caseId':'totalseg-s1397','encoding':'int16-le','compression':'gzip',
      'dimensions':[nx,ny,nz],'spacingMm':list(output_spacing),'volumeUrl':'/cases/totalseg-s1397/volume.i16.gz',
      'huRange':[int(hu.min()),int(hu.max())],
      'source':{'name':'TotalSegmentator whole-body CT','record':'v2.0.1 subject s1397 via PyVista','doi':'10.5281/zenodo.6802614','case':'s1397','patientType':'living','licence':'CC BY 4.0'},
      'canonical':{'orientation':'PyVista/VTK source axes','voxelOrder':'x-fastest','sourceAffine':[[spacing[0],0,0,origin[0]],[0,spacing[1],0,origin[1]],[0,0,spacing[2],origin[2]],[0,0,0,1]],'affine':[[output_spacing[0],0,0,origin[0]],[0,output_spacing[1],0,origin[1]],[0,0,output_spacing[2],origin[2]],[0,0,0,1]]},
      'provenance':{'kind':'derived-from-real-source','method':'PyVista TotalSegmentator CT -> int16 HU teaching volume','clinicalSource':True,'qualityReferences':['TotalSegmentator s1397'],'notes':'Educational derived volume. CT voxels are source-derived; not synthetic anatomy.'},
      'segmentations':{'availableInSource':True,'count':len(label_names),'labels':label_names,'regionsUrl':'/cases/totalseg-s1397/regions.json','boundsSource':'segmentation-mesh'}
    }
    (out/'manifest.json').write_text(json.dumps(manifest,indent=2))
    print(f'Wrote {nx}x{ny}x{nz}, HU {manifest["huRange"]}, {len(regions)} verified segmentation bounds to {out}')

if __name__=='__main__':main()
