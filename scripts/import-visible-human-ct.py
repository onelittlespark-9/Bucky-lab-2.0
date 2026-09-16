#!/usr/bin/env python3
"""Import NLM Visible Human CT into Bucky Lab's HU-volume format.

Input is an ordered directory of 16-bit grayscale CT PNG slices from NLM.
The importer preserves the 512x512 source matrix and 1 mm z sampling, converts
stored 12-bit CT values to signed HU using calibration supplied from the source
header, and emits the same manifest schema consumed by the live viewer.

It deliberately refuses to guess HU calibration, pixel spacing or anatomical
crop bounds. Verify these against the NLM CT header accompanying the selected
series before importing.
"""
from __future__ import annotations
import argparse,gzip,json,re
from pathlib import Path
import numpy as np
try:
 from PIL import Image
except ImportError as e:
 raise SystemExit('Pillow is required: pip install Pillow') from e

NLM_SOURCE='https://www.nlm.nih.gov/research/visible/getting_data.html'
NLM_TERMS='https://www.nlm.nih.gov/databases/download/terms_and_conditions.html'

def natural_key(p:Path):
 return [int(x) if x.isdigit() else x.lower() for x in re.split(r'(\d+)',p.name)]

def main():
 ap=argparse.ArgumentParser()
 ap.add_argument('--png-dir',required=True)
 ap.add_argument('--out',required=True)
 ap.add_argument('--hu-offset',type=int,required=True,help='Verified stored-value offset from NLM CT header; HU=stored-offset')
 ap.add_argument('--spacing-xy',type=float,required=True,help='Verified in-plane pixel spacing in mm from NLM CT header')
 ap.add_argument('--spacing-z',type=float,default=1.0,help='Slice interval in mm; NLM whole-body CT is documented at 1 mm')
 ap.add_argument('--sex',choices=['male','female'],required=True)
 ap.add_argument('--series-label',default='Visible Human whole-body CT')
 ap.add_argument('--source-header',required=True,help='Identifier/path of the NLM CT header used to verify calibration and spacing')
 a=ap.parse_args()
 if a.spacing_xy<=0 or a.spacing_z<=0:raise SystemExit('Spacing must be positive')
 files=sorted(Path(a.png_dir).glob('*.png'),key=natural_key)
 if not files:raise SystemExit('No PNG slices found')
 slices=[]
 for p in files:
  im=np.asarray(Image.open(p))
  if im.ndim==3:raise SystemExit(f'{p}: expected grayscale CT PNG, got RGB/RGBA')
  if im.shape!=(512,512):raise SystemExit(f'{p}: expected 512x512, got {im.shape}')
  slices.append(im.astype(np.int32)-a.hu_offset)
 vol=np.stack(slices).clip(-32768,32767).astype('<i2')
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 with gzip.open(out/'volume.i16.gz','wb',compresslevel=9) as f:f.write(vol.tobytes(order='C'))
 manifest={
  'caseId':f'nlm-visible-human-{a.sex}',
  'dimensions':[512,512,len(files)],
  'spacing':[a.spacing_xy,a.spacing_xy,a.spacing_z],
  'volumeUrl':'volume.i16.gz',
  'huRange':[int(vol.min()),int(vol.max())],
  'source':{
   'name':'NLM Visible Human Project',
   'record':'Visible Human Project whole-body CT',
   'url':NLM_SOURCE,
   'termsUrl':NLM_TERMS,
   'acknowledgement':'Courtesy of the U.S. National Library of Medicine',
   'patientType':'postmortem cadaver',
   'sex':a.sex,
   'licence':'Public-domain library; redistribution remains subject to current NLM Terms and Conditions',
   'sourceHeader':a.source_header
  },
  'provenance':{
   'kind':'derived-from-real-source','clinicalSource':True,
   'notes':'Source-derived postmortem CT voxels converted from NLM lossless PNG; not a living-patient examination. HU calibration and spacing were supplied from the identified NLM source CT header. NLM does not endorse Bucky Lab.'
  },
  'import':{'sliceCount':len(files),'huOffset':a.hu_offset,'sourceStoredBits':12,'seriesLabel':a.series_label}
 }
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2))
 print(f'Imported {len(files)} slices -> {out}; dimensions 512x512x{len(files)}, HU {manifest["huRange"]}')

if __name__=='__main__':main()
