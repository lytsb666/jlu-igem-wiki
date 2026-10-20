"""Lossless, original-resolution WebP segments verified against every decoded video frame."""
from pathlib import Path
import hashlib
import json
import math
import subprocess
import time

import cv2
import imageio_ffmpeg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets/hardware/animations-20261020'
SCRATCH = ROOT / '.local/hardware-animations-20261020/encode'
OUTPUT.mkdir(parents=True, exist_ok=True)
SCRATCH.mkdir(parents=True, exist_ok=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
MAX_BYTES = 8_000_000
FPS = 30
manifest = {'format': 'lossless animated WebP', 'width': 1280, 'height': 720,
            'sourceFPS': FPS, 'maxFileBytes': MAX_BYTES, 'videos': []}
if (OUTPUT / 'source-manifest.json').exists():
    manifest = json.loads((OUTPUT / 'source-manifest.json').read_text(encoding='utf-8'))


def run(args):
    result = subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', *args],
                            capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr)
    return result.stdout


def save():
    (OUTPUT / 'source-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')


def verify(file, expected):
    image = Image.open(file)
    if image.size != (1280, 720):
        raise RuntimeError('The original resolution changed')
    elapsed, checked = 0, 0
    for frame in range(image.n_frames):
        image.seek(frame)
        pixels = image.convert('RGBA').tobytes('raw', 'BGRA')
        duration = image.info['duration']
        digest = hashlib.sha256(pixels).hexdigest()
        start = round(elapsed * FPS / 1000)
        end = min(round((elapsed + duration) * FPS / 1000), len(expected))
        if start != checked:
            raise RuntimeError('The animation timeline has a gap')
        for original in range(start, end):
            if expected[original] != digest:
                raise RuntimeError(f'Pixel mismatch at original frame {original} in {file.name}')
            checked += 1
        elapsed += duration
    if checked != len(expected):
        raise RuntimeError(f'Unverified frames: {checked}/{len(expected)}')
    return {'animationFrames': image.n_frames, 'verifiedSourceFrames': checked,
            'encodedDurationMs': elapsed, 'pixelMismatchCount': 0}


for number in (1, 2, 3):
    source = ROOT / f'public/hardware-resources/video-{number}.mp4'
    capture = cv2.VideoCapture(str(source))
    size = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH)), int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = capture.get(cv2.CAP_PROP_FPS)
    capture.release()
    if size != (1280, 720) or abs(fps - FPS) > .0001:
        raise RuntimeError('Unexpected source geometry or timing')
    hash_file = OUTPUT / f'video-{number}-source-frame-hashes.json'
    if hash_file.exists():
        hashes = json.loads(hash_file.read_text(encoding='utf-8'))
    else:
        hashes = [line.split(',')[-1].strip() for line in run([
            '-i', str(source), '-an', '-vf', 'format=bgra', '-fps_mode', 'passthrough',
            '-f', 'framehash', '-hash', 'sha256', '-']).splitlines() if line and not line.startswith('#')]
        hash_file.write_text(json.dumps(hashes) + '\n', encoding='utf-8')
    video = next((v for v in manifest['videos'] if v['id'] == number), None)
    if video and video['sourceSHA256'] != hashlib.sha256(source.read_bytes()).hexdigest():
        raise RuntimeError('The original source file changed since the last conversion')
    if video and video.get('allFramesVerified'):
        continue
    if video is None:
        video = {'id': number, 'source': str(source.relative_to(ROOT)).replace('\\', '/'),
             'sourceSHA256': hashlib.sha256(source.read_bytes()).hexdigest(),
             'sourceBytes': source.stat().st_size, 'sourceFrames': len(hashes),
             'durationSeconds': len(hashes) / FPS, 'segments': []}
        manifest['videos'].append(video)
    save()

    def encode(start, count):
        temporary = SCRATCH / f'fast-video-{number}-{start}-{count}.webp'
        started = time.monotonic()
        if not temporary.exists():
            run(['-y', '-ss', f'{start / FPS:.12f}', '-i', str(source),
                 '-t', f'{count / FPS:.12f}', '-an', '-c:v', 'libwebp_anim',
                 '-pix_fmt', 'bgra', '-lossless', '1', '-compression_level', '0',
                 '-quality', '0', '-loop', '0', str(temporary)])
        if temporary.stat().st_size > MAX_BYTES:
            if count < 2:
                raise RuntimeError('A single original frame exceeds the upload budget')
            first = count // 2
            encode(start, first)
            encode(start + first, count - first)
            return
        verification = verify(temporary, hashes[start:start + count])
        content = temporary.read_bytes()
        digest = hashlib.sha256(content).hexdigest()
        name = f'video-{number}-part-{len(video["segments"]) + 1:03d}-{digest[:12]}.webp'
        (OUTPUT / name).write_bytes(content)
        segment = {'file': name, 'sha256': digest, 'bytes': len(content),
                   'firstSourceFrame': start, 'sourceFrames': count,
                   'durationMs': count / FPS * 1000, **verification}
        video['segments'].append(segment)
        save()
        print(json.dumps({'video': number, 'part': len(video['segments']),
                          'sourceFrames': f'{start + count}/{len(hashes)}',
                          'bytes': len(content), 'pixelMismatchCount': 0,
                          'elapsed': round(time.monotonic() - started, 1)}), flush=True)

    resumed = sum(s['sourceFrames'] for s in video['segments'])
    if resumed and video['segments'][-1]['firstSourceFrame'] + video['segments'][-1]['sourceFrames'] != resumed:
        raise RuntimeError('Saved segments do not form a contiguous original sequence')
    for start in range(resumed, len(hashes), 45):
        encode(start, min(45, len(hashes) - start))
    video['animationBytes'] = sum(segment['bytes'] for segment in video['segments'])
    video['allFramesVerified'] = sum(segment['verifiedSourceFrames'] for segment in video['segments']) == len(hashes)
    save()
    print(json.dumps({'videoComplete': number, 'parts': len(video['segments']),
                      'bytes': video['animationBytes'], 'allFramesVerified': video['allFramesVerified']}), flush=True)

print('All three original videos converted and every decoded source frame verified.', flush=True)
