from pathlib import Path
import json
import sys

root = Path(__file__).resolve().parents[1]
directory = root / 'assets/hardware/animations-20261020'
manifest = json.loads((directory / 'source-manifest.json').read_text(encoding='utf-8'))
labels = {1: 'ByeGerm instrument introduction', 2: 'ByeGerm 1.0 operation demonstration', 3: 'ByeGerm 2.0 operation demonstration'}
official = '--official' in sys.argv
urls = {}
if official:
    uploads = json.loads((root / 'docs/IGEM_OFFICIAL_MEDIA_UPLOAD_20261020.json').read_text(encoding='utf-8'))
    urls = {a['sha256']: a['url'] for a in uploads['assets'] if a.get('officialUpload', {}).get('unchangedBytesVerified')}
    expected = {s['sha256'] for v in manifest['videos'] for s in v['segments']}
    if not expected.issubset(urls):
        raise RuntimeError('All animations need captured, verified official URLs before publication')
clips = []
for video in manifest['videos']:
    if not video.get('allFramesVerified'):
        continue
    parts = []
    for segment in video['segments']:
        record = {'start': segment['firstSourceFrame'], 'count': segment['sourceFrames'],
                  'type': 'image/avif' if segment['file'].endswith('.avif') else 'image/webp'}
        if record['type'] == 'image/webp':
            data = (directory / segment['file']).read_bytes()
            position, elapsed, mapping, coded = 12, 0, [], 0
            while position + 8 <= len(data):
                size = int.from_bytes(data[position + 4:position + 8], 'little')
                if data[position:position + 4] == b'ANMF':
                    duration = int.from_bytes(data[position + 20:position + 23], 'little')
                    count = round((elapsed + duration) * 30 / 1000) - round(elapsed * 30 / 1000)
                    mapping.extend([coded] * count)
                    elapsed += duration
                    coded += 1
                position += 8 + size + size % 2
            if len(mapping) != record['count']:
                raise RuntimeError('Animation frame mapping changed')
            record['map'] = mapping
        text = json.dumps(record, separators=(',', ':'))[:-1]
        if official:
            text += ',"src":' + json.dumps(urls[segment['sha256']]) + '}'
        else:
            text += ',"src":new URL(' + json.dumps('./' + segment['file']) + ',import.meta.url).href}'
        parts.append(text)
    clip = {'id': video['id'], 'label': labels[video['id']], 'frames': video['sourceFrames']}
    clips.append(json.dumps(clip)[:-1] + ',"parts":[' + ','.join(parts) + ']}')
if len(clips) != 3:
    raise RuntimeError('All three original demonstrations must be complete')
(directory / 'clips.js').write_text('export default [' + ',\n'.join(clips) + ']\n', encoding='utf-8')
print('Prepared complete demonstration sequences:', len(clips))
