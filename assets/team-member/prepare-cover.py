"""Preserve the supplied group photo and prepare responsive, uncropped web copies."""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent
repo = root.parent.parent
assert repo.name == '02-team'
design = {
    'groupPhoto': {
        'source': 'C:/Users/UserTech/Documents/Tencent Files/1043105282/nt_qq/nt_data/Pic/2026-10/Ori/d7bb2edbb14a664e944ec63a92d55710.jpg',
        'sha256': 'c48690824c6f071295f8cb015ea1fa29886c16e76b12a244e335c36ff6a21e88',
    },
    'leaderList': {
        'source': 'D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/temp/RWTemp/2026-10/b101f6cb78252293104820af9d06fdc5/dbbeea7bbbcc2d92fa836950ab2f7375.png',
        'sha256': '7ec6a66cfdba289c4531f0735fceaef52ef5eb6aaac99b500c9c558cce1087fd',
    },
}
sources = root / 'sources'
cover = root / 'cover'
sources.mkdir(exist_ok=True)
cover.mkdir(exist_ok=True)
for key, name in [('groupPhoto', 'group-photo.jpg'), ('leaderList', 'leader-list.png')]:
    source = Path(design[key]['source'])
    assert hashlib.sha256(source.read_bytes()).hexdigest() == design[key]['sha256']
    target = sources / name
    if target.exists():
        assert target.read_bytes() == source.read_bytes(), 'Do not overwrite a different original'
    else:
        shutil.copyfile(source, target)

records = []
with Image.open(sources / 'group-photo.jpg') as original:
    image = ImageOps.exif_transpose(original).convert('RGB')
    for width in [960, 1920, 2880]:
        height = round(image.height * width / image.width)
        target = cover / f'group-{width}.webp'
        image.resize((width, height), Image.Resampling.LANCZOS).save(target, 'WEBP', quality=84, method=6)
        records.append({'file': target.relative_to(repo).as_posix(), 'size': [width, height],
                        'bytes': target.stat().st_size, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})
manifest = {'date': '2026-10-13', 'sources': {key: design[key] for key in ['groupPhoto', 'leaderList']},
            'originalGroupSize': [6000, 4000], 'crop': 'none; object-fit: contain retains every person',
            'webCopies': records}
(cover / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(records))
