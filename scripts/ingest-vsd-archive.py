#!/usr/bin/env python3
"""Download/ingest a VSDFullBody ZIP and build a compact Bucky Lab HU case."""
from __future__ import annotations
import argparse,gzip,hashlib,json,shutil,tempfile,urllib.request,zipfile
from pathlib import Path
import numpy as np
import pydicom
from scipy.ndimage import zoom

DEFAULT_URL='https://zenodo.org/records/8270365/files/001.zip?download=1'
DEFAULT_MD5='481c0b8e422ff4f8f907a974ffaf6094'

def md5(path:Path):
 h=hashlib.md5()
 with path.open('rb') as f:
  for chunk in iter(lambda:f.read(8*1024*1024),b''):h.update(chunk)
 return h.hexdigest()

def extract_nested(src:Path,dst:Path):
 queue=[src]; seen=set()
 while queue:
  z=queue.pop(0)
  key=str(z.resolve())
  if key in seen:continue
  seen.add(key)
  target=dst/z.stem if z!=src else dst
  target.mkdir(parents=True,exist_ok=True)
  try:
   with zipfile.ZipFile(z) as f:f.extractall(target)
  except zipfile.BadZipFile:continue
  queue.extend(p for p in target.rglob('*.zip') if str(p.resolve()) not in seen)

def dicom_series(root:Path):
 groups={}
 for p in root.rglob('*'):
  if not p.is_file() or p.suffix.lower()=='.zip':continue
  try:d=pydicom.dcmread(str(p),stop_before_pixels=True,force=True)
  except Exception:continue
  if getattr(d,'Modality',None)!='CT' or not hasattr(d,'SeriesInstanceUID'):continue
  groups.setdefault(str(d.SeriesInstanceUID),[]).append((p,d))
 if not groups:raise RuntimeError('No CT DICOM series found in archive')
 # Whole-body diagnostic CT should be the largest coherent CT series.
 return max(groups.values(),key=len)

def load_ct(items):
 def pos(item):
  d=item[1]
  if hasattr(d,'ImagePositionPatient'):return float(d.ImagePositionPatient[2])
  return float(getattr(d,'InstanceNumber',0))
 items=sorted(items,key=pos)
 first=items[0][1]
 px=[float(x) for x in first.PixelSpacing]
 zs=np.array([pos(i) for i in items],dtype=float)
 dz=float(np.median(np.abs(np.diff(zs)))) if len(zs)>1 else float(getattr(first,'SliceThickness',1.0))
 slices=[]
 for p,_ in items:
  d=pydicom.dcmread(str(p),force=True)
  a=d.pixel_array.astype(np.float32)
  a=a*float(getattr(d,'RescaleSlope',1.0))+float(getattr(d,'RescaleIntercept',0.0))
  slices.append(a)
 return np.stack(slices,axis=0),(px[1],px[0],dz),first

def crop_air(vol,margin=12):
 mask=vol>-700
 idx=np.argwhere(mask)
 if not len(idx):return vol,(0,0,0)
 lo=np.maximum(idx.min(0)-margin,0);hi=np.minimum(idx.max(0)+margin+1,vol.shape)
 return vol[lo[0]:hi[0],lo[1]:hi[1],lo[2]:hi[2]],tuple(map(int,lo))

def main():
 p=argparse.ArgumentParser();p.add_argument('--url',default=DEFAULT_URL);p.add_argument('--md5',default=DEFAULT_MD5);p.add_argument('--archive');p.add_argument('--out',default='build/vsd-001');p.add_argument('--voxel-mm',type=float,default=2.0);a=p.parse_args()
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as td:
  work=Path(td);archive=Path(a.archive) if a.archive else work/'001.zip'
  if not a.archive:
   print('Downloading VSD 001.zip...');urllib.request.urlretrieve(a.url,archive)
  got=md5(archive)
  if a.md5 and got.lower()!=a.md5.lower():raise SystemExit(f'MD5 mismatch: {got} != {a.md5}')
  unpack=work/'unpacked';unpack.mkdir();extract_nested(archive,unpack)
  items=dicom_series(unpack);vol,spacing,first=load_ct(items)
  vol,crop=crop_air(vol)
  # array is z,y,x; resample each physical axis to isotropic target spacing
  factors=(spacing[2]/a.voxel_mm,spacing[1]/a.voxel_mm,spacing[0]/a.voxel_mm)
  vol=zoom(vol,factors,order=1,prefilter=False)
  hu=np.clip(np.rint(np.nan_to_num(vol,nan=-1000,posinf=3071,neginf=-1024)),-1024,3071).astype('<i2')
  nz,ny,nx=hu.shape;raw=hu.tobytes(order='C')
  with gzip.open(out/'volume.i16.gz','wb',compresslevel=9) as f:f.write(raw)
  manifest={'version':1,'caseId':'vsd-001','encoding':'int16-le','compression':'gzip','dimensions':[nx,ny,nz],'spacingMm':[a.voxel_mm]*3,'volumeUrl':'/cases/vsd-001/volume.i16.gz','huRange':[int(hu.min()),int(hu.max())],'source':{'name':'VSDFullBody','record':'Zenodo 8270365','doi':'10.5281/zenodo.8270365','case':'001','patientType':'postmortem','licence':'CC BY-NC-SA'},'canonical':{'orientation':'DICOM patient geometry; axial stack','voxelOrder':'x-fastest','sourceAffine':[[spacing[0],0,0,0],[0,spacing[1],0,0],[0,0,spacing[2],0],[0,0,0,1]],'affine':[[a.voxel_mm,0,0,0],[0,a.voxel_mm,0,0],[0,0,a.voxel_mm,0],[0,0,0,1]]},'provenance':{'kind':'derived-from-real-source','method':'VSD DICOM CT -> HU -> exterior-air crop -> isotropic resample -> int16 gzip','clinicalSource':True,'qualityReferences':['VSDFullBody 001'],'notes':'Educational source-derived postmortem CT; not a diagnostic viewer.'},'processing':{'sourceArchiveMd5':got,'sourceSlices':len(items),'sourceSpacingMm':list(spacing),'cropStartZYX':list(crop),'targetVoxelMm':a.voxel_mm}}
  (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
  print(json.dumps({'dimensions':[nx,ny,nz],'huRange':manifest['huRange'],'compressedMiB':round((out/'volume.i16.gz').stat().st_size/1048576,1)},indent=2))
if __name__=='__main__':main()
