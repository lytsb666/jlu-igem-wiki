"""Complete the original-frame sequence with lossless AV1 animated AVIF files."""
from pathlib import Path
import concurrent.futures
import hashlib
import json
import subprocess
import threading

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets/hardware/animations-20261020'
SCRATCH = ROOT / '.local/hardware-animations-20261020/avif'
SCRATCH.mkdir(parents=True, exist_ok=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
manifest = json.loads((OUTPUT / 'source-manifest.json').read_text(encoding='utf-8'))
lock = threading.Lock()


def run(args):
    process = subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', *args], capture_output=True, text=True)
    if process.returncode:
        raise RuntimeError(process.stderr)
    return process.stdout


def frame_hashes(args):
    output = run([*args, '-an', '-vf', 'format=bgra', '-fps_mode', 'passthrough', '-f', 'framehash', '-hash', 'sha256', '-'])
    return [line.split(',')[-1].strip() for line in output.splitlines() if line and not line.startswith('#')]


def save():
    temporary = OUTPUT / 'source-manifest.json.tmp'
    temporary.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    temporary.replace(OUTPUT / 'source-manifest.json')


def complete(number):
    source = ROOT / f'public/hardware-resources/video-{number}.mp4'
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    cache = OUTPUT / f'video-{number}-source-frame-hashes.json'
    if cache.exists():
        hashes = json.loads(cache.read_text(encoding='utf-8'))
    else:
        hashes = frame_hashes(['-i', str(source), '-map', '0:v:0'])
        cache.write_text(json.dumps(hashes) + '\n', encoding='utf-8')
    with lock:
        video = next((v for v in manifest['videos'] if v['id'] == number), None)
        if video is None:
            video = {'id': number, 'source': str(source.relative_to(ROOT)).replace('\\', '/'),
                     'sourceSHA256': source_hash, 'sourceBytes': source.stat().st_size,
                     'sourceFrames': len(hashes), 'durationSeconds': len(hashes) / 30, 'segments': []}
            manifest['videos'].append(video)
            manifest['videos'].sort(key=lambda v: v['id'])
        if video['sourceSHA256'] != source_hash:
            raise RuntimeError('Original source changed')
        resumed = sum(s['sourceFrames'] for s in video['segments'])
        save()

    def encode(start, count):
        temporary = SCRATCH / f'video-{number}-{start}-{count}.avif'
        if not temporary.exists():
            run(['-y', '-ss', f'{start / 30:.12f}', '-i', str(source), '-t', f'{count / 30:.12f}',
                 '-an', '-c:v', 'libaom-av1', '-crf', '0', '-b:v', '0', '-cpu-used', '8',
                 '-threads', '8', '-row-mt', '1', '-usage', 'realtime', '-lag-in-frames', '0',
                 '-pix_fmt', 'yuv420p', '-f', 'avif', str(temporary)])
        if temporary.stat().st_size > 8_000_000:
            if count < 2:
                raise RuntimeError('One source frame exceeds the upload budget')
            first = count // 2
            encode(start, first)
            encode(start + first, count - first)
            return
        actual = frame_hashes(['-i', str(temporary), '-map', '0:v:1' if count > 1 else '0:v:0'])
        if actual != hashes[start:start + count]:
            raise RuntimeError(f'Lossless pixel verification failed for video {number}, frame {start}')
        content = temporary.read_bytes()
        digest = hashlib.sha256(content).hexdigest()
        with lock:
            name = f'video-{number}-part-{len(video["segments"]) + 1:03d}-{digest[:12]}.avif'
            (OUTPUT / name).write_bytes(content)
            video['segments'].append({'file': name, 'sha256': digest, 'bytes': len(content),
                                      'firstSourceFrame': start, 'sourceFrames': count, 'durationMs': count / 30 * 1000,
                                      'animationFrames': count, 'verifiedSourceFrames': count,
                                      'pixelMismatchCount': 0, 'mimeType': 'image/avif'})
            save()
        print(json.dumps({'video': number, 'part': len(video['segments']), 'sourceFrames': f'{start + count}/{len(hashes)}',
                          'bytes': len(content), 'pixelMismatchCount': 0}), flush=True)

    for start in range(resumed, len(hashes), 90):
        encode(start, min(90, len(hashes) - start))
    with lock:
        video['animationBytes'] = sum(s['bytes'] for s in video['segments'])
        video['allFramesVerified'] = sum(s['verifiedSourceFrames'] for s in video['segments']) == len(hashes)
        save()
    print(json.dumps({'videoComplete': number, 'bytes': video['animationBytes'], 'parts': len(video['segments'])}), flush=True)


with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
    list(executor.map(complete, [2, 3]))
print('All original frames are preserved and verified.', flush=True)
