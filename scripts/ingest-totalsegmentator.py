#!/usr/bin/env python3
"""Build a compact Bucky Lab HU case from PyVista TotalSegmentator s1397.

Regional bounds are computed from each segmentation's occupied labelled cells/points, not the
container dataset bounds. A build fails if segmentation extraction degenerates to whole-volume
bounds, preventing invalid regional CT/X-ray assets from being published.
"""
from __future__ import annotations
import argparse,gzip,json,math
from pathlib import Path
import numpy as np

def voxel_bounds(world_bounds,origin,spacing,dims,stride):
 out=[]
 for axis in range(3):
  lo=(world_bounds[axis*2]-origin[axis])/spacing[axis]/stride;hi=(world_bounds[axis*2+1]-origin[axis])/spacing[axis]/stride
  out.extend([max(0,min(dims[axis]-1,int(math.floor(lo)))),max(0,min(dims[axis]-1,int(math.ceil(hi))))])
 return {'x0':out[0],'x1':out[1],'y0':out[2],'y1':out[3],'z0':out[4],'z1':out[5]}
def occupied_bounds(obj):
 """Extract geometry carrying the segmentation instead of trusting a container's .bounds."""
 if obj is None:return None
 # MultiBlock entries may themselves contain blocks. Combine only non-empty geometry bounds.
 if hasattr(obj,'n_blocks'):
  bs=[occupied_bounds(b) for b in obj if b is not None];bs=[b for b in bs if b]
  if not bs:return None
  return tuple(v for axis in range(3) for v in (min(b[axis*2] for b in bs),max(b[axis*2+1] for b in bs)))
 if getattr(obj,'n_points',0)==0:return None
 # PyVista labelled image/unstructured data can retain the full CT extent while the label occupies
 # a subset. Prefer non-background labelled cells/points when scalar arrays are available.
 for assoc in ('cell_data','point_data'):
  data=getattr(obj,assoc,None)
  if not data:continue
  for key in data.keys():
   arr=np.asarray(data[key]).reshape(-1)
   if arr.size==0 or not np.issubdtype(arr.dtype,np.number):continue
   finite=arr[np.isfinite(arr)]
   if finite.size==0 or np.all(finite==finite[0]):continue
   # Segmentation labels/background: retain positive/non-zero values. Threshold through PyVista so
   # returned geometry bounds represent occupied anatomy.
   try:
    if assoc=='cell_data': sub=obj.threshold(value=0.5,scalars=key,preference='cell')
    else: sub=obj.threshold(value=0.5,scalars=key,preference='point')
    if getattr(sub,'n_points',0)>0:return tuple(map(float,sub.bounds))
   except Exception:pass
 return tuple(map(float,obj.bounds))
def is_full(b,dims):return b=={'x0':0,'x1':dims[0]-1,'y0':0,'y1':dims[1]-1,'z0':0,'z1':dims[2]-1}
def main():
 p=argparse.ArgumentParser();p.add_argument('--out',default='public/cases/totalseg-s1397');p.add_argument('--high-resolution',action='store_true');p.add_argument('--stride',type=int,default=1);a=p.parse_args()
 if a.stride<1:raise SystemExit('--stride must be >= 1')
 try:from pyvista import examples
 except ImportError as e:raise SystemExit('Install preprocessing dependency: pip install pyvista') from e
 ds=examples.download_whole_body_ct_male(high_resolution=a.high_resolution);ct=ds['ct'];source_dims=tuple(map(int,ct.dimensions));spacing=tuple(map(float,ct.spacing));origin=tuple(map(float,ct.origin));scalars=np.asarray(ct.active_scalars)
 if scalars.size!=np.prod(source_dims):raise RuntimeError('Unexpected CT scalar count')
 vol=scalars.reshape((source_dims[2],source_dims[1],source_dims[0]),order='C');output_spacing=spacing
 if a.stride>1:vol=vol[::a.stride,::a.stride,::a.stride];output_spacing=tuple(s*a.stride for s in spacing)
 hu=np.rint(np.clip(vol,-1024,3071)).astype('<i2',copy=False);nz,ny,nx=hu.shape;dims=(nx,ny,nz);out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 with gzip.open(out/'volume.i16.gz','wb',compresslevel=9)as f:f.write(hu.tobytes(order='C'))
 segmentations=ds['segmentations'];labels=list(segmentations.keys());regions={};full=[]
 for name in labels:
  wb=occupied_bounds(segmentations[name]);
  if not wb:continue
  b=voxel_bounds(wb,origin,spacing,dims,a.stride);regions[name]={'sourceLabel':name,'bounds':b,'source':'segmentation'}
  if is_full(b,dims):full.append(name)
 # Brain/skull/femur cannot legitimately all occupy the complete CT. Treat this as extraction failure.
 sentinel=[n for n in ('brain','skull','femur_left','femur_right','heart') if n in full]
 if len(sentinel)>=2:raise RuntimeError(f'Degenerate segmentation bounds detected for {sentinel}; refusing regional build')
 (out/'regions.json').write_text(json.dumps({'version':1,'caseId':'totalseg-s1397','coordinateSystem':'canonical-volume-voxels','regions':regions},indent=2))
 manifest={'version':1,'caseId':'totalseg-s1397','encoding':'int16-le','compression':'gzip','dimensions':[nx,ny,nz],'spacingMm':list(output_spacing),'volumeUrl':'/cases/totalseg-s1397/volume.i16.gz','huRange':[int(hu.min()),int(hu.max())],'source':{'name':'TotalSegmentator whole-body CT','record':'v2.0.1 subject s1397 via PyVista','doi':'10.5281/zenodo.6802614','case':'s1397','patientType':'living','licence':'CC BY 4.0'},'canonical':{'orientation':'PyVista/VTK source axes','voxelOrder':'x-fastest','sourceAffine':[[spacing[0],0,0,origin[0]],[0,spacing[1],0,origin[1]],[0,0,spacing[2],origin[2]],[0,0,0,1]],'affine':[[output_spacing[0],0,0,origin[0]],[0,output_spacing[1],0,origin[1]],[0,0,output_spacing[2],origin[2]],[0,0,0,1]]},'provenance':{'kind':'derived-from-real-source','method':'PyVista TotalSegmentator CT -> int16 HU teaching volume','clinicalSource':True,'qualityReferences':['TotalSegmentator s1397'],'notes':'Educational derived volume. CT voxels are source-derived; not synthetic anatomy.'},'segmentations':{'availableInSource':True,'count':len(labels),'labels':labels,'regionsUrl':'/cases/totalseg-s1397/regions.json','boundsSource':'occupied-segmentation-geometry'}}
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2));print(f'Wrote {nx}x{ny}x{nz}; {len(regions)} regional bounds; whole-volume labels={len(full)}')
if __name__=='__main__':main()
