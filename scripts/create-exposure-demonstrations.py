"""Create illustrative photon-noise comparison from a genuine PA chest.
Noise levels are simulated digital effects, NOT different clinical X-ray exposures.
Deterministic random seed ensures repeatable artwork for the application.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import random, sys
root=Path(__file__).resolve().parent.parent
src=root/'public/clinical-reference/chest-pa-normal.jpg'
target=root/'public/clinical-reference/exposure-quantum-comparison.png'
if not src.exists():
    raise SystemExit('Missing authentic source radiograph: '+str(src))
im=Image.open(src).convert('L')
im.thumbnail((440,660),Image.Resampling.LANCZOS)
w,h=im.size
random_source=random.Random(240715)
noisy=Image.new('L',(w,h))
original=im.load()
out=noisy.load()
for y in range(h):
    for x in range(w):
        value=original[x,y]
        # Gaussian approximation: exaggerated qualitative photon-statistics effect.
        noise=random_source.gauss(0,27+(255-value)*0.018)
        out[x,y]=max(0,min(255,round(value+noise)))
margin,gutter,header,footer=22,22,120,58
canvas=Image.new('RGB',(w*2+margin*2+gutter,h+header+footer),(7,21,34))
draw=ImageDraw.Draw(canvas)
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold_path='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font=ImageFont.truetype(font_path,17)
bold=ImageFont.truetype(bold_path,22)
draw.text((margin,13),'PHOTON NOISE — QUALITATIVE DIGITAL DEMONSTRATION',font=bold,fill='#f0f5fa')
draw.text((margin,48),'Both panels use the SAME acquired chest radiograph',font=font,fill='#afcede')
left=margin; right=margin+w+gutter
canvas.paste(noisy.convert('RGB'),(left,header))
canvas.paste(im.convert('RGB'),(right,header))
for x,text in ((left,'Simulated noisier image'),(right,'Original reference image')):
    draw.rounded_rectangle((x,header-41,x+w,header-4),radius=9,fill=(17,53,76),outline=(70,127,157),width=2)
    draw.text((x+12,header-34),text,font=font,fill='#e8f3fa')
draw.text((margin,header+h+14),'No patient re-exposure; not a calibrated kVp, mAs or dose simulation.',font=font,fill='#d4c486')
canvas.save(target,optimize=True)
if target.stat().st_size<100000:
    raise SystemExit('Generated image is unexpectedly small.')
print('Generated derived comparative image',target.name,canvas.size,target.stat().st_size)
