"""Publish supplied photographs and clean workflow presentation with native SVG.

The original photograph/PNG bytes remain intact. SVG viewport and a small vector
mask remove the black letterbox and panel identifiers without redrawing the art.
"""
from pathlib import Path
from hashlib import sha256
from base64 import b64encode
from PIL import Image
import json
import shutil
import subprocess

ROOT=Path(__file__).resolve().parents[3]
assert Path.cwd().resolve()==ROOT
assert subprocess.check_output(['git','branch','--show-current'],cwd=ROOT).decode().strip()=='codex/08-instrument'
IMAGES=ROOT/'assets/hardware/images'
REVIEW=ROOT/'assets/hardware/review'
folder=Path('D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/temp/RWTemp/2026-10/62d2b5bca42c1049994e5d295315eb73')
records=[]
for filename,target_name,figure in [
 ('90f9f8308cd53dda01e04af269c274f8.jpg','fluorescence-interface-high-resolution.jpg',6),
 ('d3d64dc7892e954c72cd8ad4b81af86e.jpg','imaging-distances-high-resolution.jpg',7),
]:
    source=folder/filename;target=IMAGES/target_name
    shutil.copyfile(source,target)
    digest=sha256(source.read_bytes()).hexdigest()
    assert sha256(target.read_bytes()).hexdigest()==digest
    records.append({'source':str(source),'source_sha256':digest,'target':target.relative_to(ROOT).as_posix(),
      'sha256':digest,'size':list(Image.open(source).size),'figure':figure,'original_bytes_preserved':True})

for n,viewbox,mask in [(1,(0,83,2172,553),(0,83,74,61)),(2,(0,0,2172,724),(0,0,76,76))]:
    original=IMAGES/f'workflow-{n}.png'
    assert Image.open(original).size==(2172,724)
    payload=original.read_bytes()
    x,y,w,h=viewbox;mx,my,mw,mh=mask
    markup=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" width="{w}" height="{h}" role="img" aria-labelledby="title">\n'
      f'<title id="title">ByeGerm {n}.0 operation workflow</title>\n'
      f'<image x="0" y="0" width="2172" height="724" href="data:image/png;base64,{b64encode(payload).decode()}"/>\n'
      f'<rect x="{mx}" y="{my}" width="{mw}" height="{mh}" fill="#fff"/>\n</svg>\n')
    target=IMAGES/f'workflow-{n}-clean.svg';target.write_text(markup,encoding='utf-8')
    records.append({'source':original.relative_to(ROOT).as_posix(),'source_sha256':sha256(payload).hexdigest(),
      'target':target.relative_to(ROOT).as_posix(),'sha256':sha256(target.read_bytes()).hexdigest(),'size':[w,h],
      'original_bytes_embedded':True,'viewbox':list(viewbox),'label_mask':list(mask),'method':'Native SVG viewport crop and vector mask; raster artwork is unchanged.'})

manifest_path=REVIEW/'materials.json';materials=json.loads(manifest_path.read_text(encoding='utf-8'))
targets={item['target'] for item in records}
materials['images']=[item for item in materials['images'] if item['target'].replace('\\','/') not in targets]+records
manifest_path.write_text(json.dumps(materials,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
audit={'date':'2026-10-13','images':records,'source_document':'C:/Users/UserTech/Desktop/Hardware 1012/Hardware/Hardware页面.docx',
 'document_sha256':'3f4280599dda26dc6f4a8aba426fadc88d26fadc2ff7a57cd4c76f6ff31bd0b2',
 'document_same_as_previous':True,'user_decision':'Restore second-generation operation overview and four reproduction-documentation points, while preserving available resource links and prior numbering/duplicate corrections.',
 'image_display':'Hardware body figures keep aspect ratio, centered, max height min(360px,42svh). Hero, manuals and loading media retain their existing presentation.',
 'model_change':'Only formula scrollbar visuals are hidden; complete MathML and keyboard/touch scrolling remain.'}
(REVIEW/'image-revision-20261013.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Published two byte-identical high-resolution photos and two SVG workflow views; recorded the approved document alignment.')
