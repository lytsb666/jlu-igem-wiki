"""Verify captured iGEM upload URLs against the source animation bytes."""
import concurrent.futures
import datetime
import hashlib
import json
import os
import time
from pathlib import Path
from urllib.parse import urlparse

import requests

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/hardware/animations-20261020'
PROOF = ROOT / 'docs/verification/hardware-animation-20261020/animation-cdn-verification.json'
MAPPING = ROOT / 'docs/IGEM_OFFICIAL_MEDIA_UPLOAD_20261020.json'
segments = {s['sha256']: s for v in json.loads((SOURCE / 'source-manifest.json').read_text(encoding='utf-8'))['videos'] for s in v['segments']}
downloads = Path(os.environ.get('USERPROFILE', str(Path.home()))) / 'Downloads'
captures = list(downloads.glob('igem-animations-20261020*.json'))
extra = os.environ.get('IGEM_ANIMATION_FIRST_CAPTURE')
if extra:
    captures.append(Path(extra))
known = {}
for capture in captures:
    for record in json.loads(capture.read_text(encoding='utf-8-sig')).get('files', []):
        sha = record.get('name', '').split('.')[0]
        url = record.get('url', '')
        parsed = urlparse(url)
        if sha in segments and parsed.scheme == 'https' and parsed.hostname == 'static.igem.wiki' and parsed.path.startswith('/teams/6074/'):
            known[sha] = url
prior = json.loads(PROOF.read_text(encoding='utf-8')) if PROOF.exists() else {'files': []}
verified = {r['sha256']: r for r in prior['files'] if r['sha256'] in segments and r['url'] == known.get(r['sha256'])}

def check(item):
    sha, url = item
    session = requests.Session()
    session.trust_env = False
    for attempt in range(3):
        try:
            response = session.get(url, timeout=(30, 120), headers={'Origin': 'https://2026.igem.wiki'})
            response.raise_for_status()
            actual = hashlib.sha256(response.content).hexdigest()
            if actual != sha or len(response.content) != segments[sha]['bytes']:
                raise ValueError('Official animation bytes changed: ' + sha)
            return {'sha256': sha, 'url': url, 'bytes': len(response.content), 'contentType': response.headers.get('content-type'),
                    'accessControlAllowOrigin': response.headers.get('access-control-allow-origin'),
                    'verifiedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}
        except requests.RequestException:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)

pending = [(sha, url) for sha, url in known.items() if sha not in verified]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for record in pool.map(check, pending):
        verified[record['sha256']] = record
        print(json.dumps({'verified': len(verified), 'captured': len(known), 'total': len(segments)}), flush=True)
PROOF.parent.mkdir(parents=True, exist_ok=True)
report = {'teamID': 6074, 'files': list(verified.values()), 'expected': len(segments), 'verified': len(verified),
          'verifiedBytes': sum(r['bytes'] for r in verified.values()), 'allFilesMatch': len(verified) == len(segments)}
PROOF.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
mapping = json.loads(MAPPING.read_text(encoding='utf-8')) if MAPPING.exists() else {'teamID': 6074, 'date': '2026-10-20', 'assets': []}
assets = {r['sha256']: r for r in mapping['assets']}
for sha, record in verified.items():
    s = segments[sha]
    assets[sha] = {'sha256': sha, 'filename': sha + Path(s['file']).suffix, 'bytes': s['bytes'], 'kind': 'image',
                   'originals': ['assets/hardware/animations-20261020/' + s['file']], 'url': record['url'],
                   'officialUpload': {'unchangedBytesVerified': True, 'verifiedAt': record['verifiedAt']}}
mapping['assets'] = list(assets.values())
MAPPING.write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: v for k, v in report.items() if k != 'files'}), flush=True)
