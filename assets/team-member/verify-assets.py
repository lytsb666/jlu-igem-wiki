"""Verify source preservation, WebP sizes and built portrait URLs."""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import json
import sys
from PIL import Image

root = Path(__file__).resolve().parent
repo = root.parent.parent
manifest = json.loads((root / 'photo-mapping.json').read_text(encoding='utf-8'))
hashes = {hashlib.sha256(p.read_bytes()).hexdigest(): p for p in (repo / 'dist/client/assets').glob('*.webp')}
results = []
for row in manifest['records']:
    original = Path(manifest['photoSource']) / row['photoFile']
    assert hashlib.sha256(original.read_bytes()).hexdigest() == row['originalSha256'], row['id']
    web = repo / row['webFile']
    with Image.open(web) as im:
        assert im.size == (800, 1000) and not im.getexif()
    if row['status'] == 'pending-00-alias':
        continue
    built = hashes[hashlib.sha256(web.read_bytes()).hexdigest()]
    base_url = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:5203'
    url = base_url.rstrip('/') + '/' + built.relative_to(repo / 'dist/client').as_posix()
    with urlopen(url) as response:
        content = response.read()
        assert response.status == 200 and content == web.read_bytes()
        results.append({'id': row['id'], 'url': url, 'status': response.status, 'bytes': len(content)})
assert len(results) == 43
out = root / 'verification'
out.mkdir(exist_ok=True)
(out / 'built-portrait-urls.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
original_bytes = sum((Path(manifest['photoSource']) / r['photoFile']).stat().st_size for r in manifest['records'])
web_bytes = sum((repo / r['webFile']).stat().st_size for r in manifest['records'])
print(f'PASS: 43 originals unchanged; 43 connected WebP files 800x1000 without EXIF; 43 built portrait URLs HTTP 200. Original {original_bytes} bytes -> web {web_bytes} bytes.')
