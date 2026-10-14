"""Extract the supplied English supplement and its original six raster panels."""
from pathlib import Path
from hashlib import sha256
from lxml import etree as E
from PIL import Image
import json, zipfile

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path('D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/msg/attach/62d2b5bca42c1049994e5d295315eb73/2026-10/Rec/1534b9ee4fa5b8a9/F/0/Hardware_6.3_中英文精简版_正文明确左右图(1).docx')
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

with zipfile.ZipFile(SOURCE) as archive:
    body = E.fromstring(archive.read('word/document.xml')).find('w:body', NS)
    text = lambda el: ''.join(el.xpath('.//w:t/text()', namespaces=NS)).strip()
    start = next(i for i, el in enumerate(body) if text(el) == '6.3 Detection Results for Five Pathogens')
    relationships = {el.get('Id'): el.get('Target') for el in E.fromstring(archive.read('word/_rels/document.xml.rels'))}
    panels = []
    for row in body[start + 3].findall('w:tr', NS):
        for cell in row.findall('w:tc', NS):
            embedded = cell.xpath('.//a:blip/@r:embed', namespaces=NS)
            assert len(embedded) == 1
            internal = 'word/' + relationships[embedded[0]]
            letter = chr(ord('A') + len(panels))
            target = ROOT / f'assets/hardware/images/pathogen-results-{letter.lower()}.jpg'
            target.write_bytes(archive.read(internal))
            panels.append({'panel': letter, 'label': text(cell), 'docx_media': internal,
                           'target': target.relative_to(ROOT).as_posix(),
                           'size': list(Image.open(target).size), 'sha256': sha256(target.read_bytes()).hexdigest()})
    assert len(panels) == 6
    comments = E.fromstring(archive.read('word/comments.xml'))
    record = {'source': SOURCE.as_posix(), 'source_sha256': sha256(SOURCE.read_bytes()).hexdigest(),
              'language': 'English', 'heading': text(body[start]),
              'paragraphs': [text(body[start + 1]), text(body[start + 2])],
              'caption': text(body[start + 4]), 'panels': panels,
              'source_comments': [text(c) for c in comments],
              'publication': 'English prose and caption verbatim; A–E preserve each original left/right pair; F preserves all three original views. No image editing.'}
(ROOT / 'assets/hardware/review/pathogen-results-source-20261014.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Imported the English supplement and six original JPEG panels.')
