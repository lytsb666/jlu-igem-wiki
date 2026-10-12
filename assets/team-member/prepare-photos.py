"""Reproducible, local photo preparation. Originals are never modified.

Run from the 02-team worktree with Pillow. Mapping is based on supplied filenames,
not facial recognition. Crop boxes were reviewed individually in the contact sheet.
"""
from pathlib import Path
import hashlib
import json
import re
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parent
repo = root.parent.parent
photo_source = Path('C:/Users/UserTech/Desktop/分组/个人照分组')
doc_source = Path('C:/Users/UserTech/Desktop/分组/Team Member Contribution分组')
data_file = repo / 'Team/member-data.js'
mapping_file = root / 'photo-mapping.json'
if mapping_file.exists() and json.loads(mapping_file.read_text(encoding='utf-8')).get('userConfirmedAliases'):
    raise SystemExit('Photo aliases have been confirmed by the user. Keep approved mappings; this initial-import generator must not overwrite them.')
text = data_file.read_text(encoding='utf-8')
members = json.loads(re.search(r'export const teamMembers =\s*(\[.*?\])\s*(?=export const memberDataIssues)', text, re.S).group(1))
issues = json.loads(re.search(r'export const memberDataIssues =\s*(\[.*?\])\s*(?:export|$)', text, re.S).group(1))

# Each row: Chinese filename name, existing member id, horizontal center,
# top edge (fraction of source height), fraction of source width retained.
rows = [
    ('何梓侨', 'ziqiao-he', .50, .08, 1),
    ('孙兰超', 'lanchao-sun', .50, .07, 1),
    ('梁森', 'sen-liang', .50, .09, 1),
    ('王晗宇', 'hanyu-wang', .50, .08, 1),
    ('王洛钊', 'luozhao-wang', .50, .11, 1),
    ('王飞跃', 'feiyue-wang', .50, .10, 1),
    ('王鹏涛', 'wang-pengtao', .50, .09, 1),
    ('陈博远', 'chen-boyuan', .50, .10, 1),
    ('马子云', 'ziyun-ma', .50, .12, 1),
    ('刘皓阳', 'haoyang-liu', .50, .10, 1),
    ('尹冠博', 'guanbo-yin', .50, .08, 1),
    ('张博韬', 'botao-zhang', .50, .10, 1),
    ('秦梓严', 'ziyan-qin', .50, .12, 1),
    ('肖博文', 'bowen-xiao', .53, .00, 1),
    ('金墨', 'mo-jin', .50, .11, 1),
    ('鲁怡蕊', 'yirui-lu', .50, .11, 1),
    ('夏宇', 'yu-xia', .50, .06, 1),
    ('姚文松', 'wensong-yao', .50, .08, 1),
    ('尹桐辉', 'tonghui-yin', .50, .07, 1),
    ('张瞬尧', 'shunyao-zhang', .50, .07, 1),
    ('杨雨佳', 'yujia-yang', .50, .08, 1),
    ('郭睿垚', 'ruiyao-guo', .50, .08, 1),
    ('韦佳乐', 'jiale-wei', .50, .06, 1),
    ('高文娴', 'wenxian-gao', .50, .09, 1),
    ('康靖宜', 'jingyi-kang', .50, .08, 1),
    ('孟小杰', 'xiaojie-meng', .50, .07, 1),
    ('张朵', 'duo-zhang', .50, .10, 1),
    ('李彤', 'tong-li', .50, .09, 1),
    ('金智媛', 'zhiyuan-jin', .50, .09, 1),
    ('邓恒奇', 'hengqi-deng', .50, .10, 1),
    ('董梓伊', 'ziyi-dong', .50, .07, 1),
    ('张家乐', 'jiale-zhang', .50, .09, 1),
    ('杨liu玉', 'liuyu-yang', .50, .10, 1),
    ('王芊雯', 'qianwen-wang', .50, .07, 1),
    ('艾文琦', 'wenqi-ai', .50, .07, 1),
    ('邢辰', 'chen-xing', .50, .07, 1),
    ('骆茜雯', 'qianwen-luo', .50, .08, 1),
    ('宋秀玲', 'pi-song-xiuling', .51, .24, .76),
    ('庞博', 'pi-pang-bo', .50, .15, 1),
    ('李金华', 'pi-li-jinhua', .54, .00, 1),
    ('王娟', 'secondary-pi-wang-juan', .52, .00, 1),
    ('苏国范', 'secondary-pi-su-guofan', .53, .00, 1),
    ('赵超', 'secondary-pi-zhao-chao', .50, .21, .76),
]
files = [p for p in photo_source.rglob('*') if p.is_file()]
docs = [p for p in doc_source.rglob('*') if p.is_file()]
assert len(files) == 43 and len(docs) == 37
assert {m['source']['file'] for m in members} == {p.name for p in docs}
by_id = {m['id']: m for m in members}
faculty = []
mapping = []
pending = {'liuyu-yang', 'ziyun-ma'}
for name, member_id, cx, top, fraction in rows:
    matches = [p for p in files if name in p.stem]
    assert len(matches) == 1, (name, matches)
    path = matches[0]
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    w, h = im.size
    cw = min(w * fraction, h * .8)
    ch = cw / .8
    left = max(0, min(w - cw, cx * w - cw / 2))
    y = max(0, min(h - ch, top * h))
    box = tuple(round(v) for v in (left, y, left + cw, y + ch))
    destination = root / ('pending' if member_id in pending else 'portraits') / (member_id + '.webp')
    destination.parent.mkdir(exist_ok=True)
    im.crop(box).resize((800, 1000), Image.Resampling.LANCZOS).save(destination, 'WEBP', quality=82, method=6)
    if member_id in by_id:
        member = by_id[member_id]
        member['photo'] = None if member_id in pending else '../assets/team-member/portraits/' + destination.name
        doc = next(p for p in docs if p.name == member['source']['file'])
        member['photoSource'] = {
            'file': str(path.relative_to(photo_source)).replace('\\', '/'),
            'status': 'pending-00-alias' if member_id in pending else 'filename-match',
            'cropPixels': list(box),
            'originalSha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        }
        if member_id in {'mo-jin', 'liuyu-yang'}:
            member['photoSource']['groupReview'] = 'Pending 00: supplied folder differs from existing role; existing groups retained.'
        display_name = member['name']
        groups = member['groups']
    else:
        display_name = name
        groups = [path.parent.name]
        doc = None
        faculty.append({
            'id': member_id, 'name': name, 'role': path.parent.name,
            'groups': groups, 'photo': '../assets/team-member/portraits/' + destination.name,
            'source': {'file': str(path.relative_to(photo_source)).replace('\\', '/'), 'rawName': name, 'rawRole': path.parent.name},
            'introduction': '', 'quote': '', 'generalTasks': [], 'contributionCategories': [], 'tasks': [],
            'dataIssues': [], 'profileStatus': 'basic-information-only',
            'missingFields': ['Verified English name', 'Institution and title', 'Introduction', 'Quote', 'Contributions'],
        })
    mapping.append({
        'id': member_id, 'name': display_name, 'photoFile': str(path.relative_to(photo_source)).replace('\\', '/'),
        'photoFolder': path.parent.name,
        'contributionFile': str(doc.relative_to(doc_source)).replace('\\', '/') if doc else None,
        'currentGroups': groups,
        'status': 'pending-00-alias' if member_id in pending else ('pending-00-group; photo filename matched' if member_id == 'mo-jin' else 'filename-match' if doc else 'photo-filename-basic-information'),
        'cropPixels': list(box), 'originalSize': [w, h],
        'originalSha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'webFile': str(destination.relative_to(repo)).replace('\\', '/'), 'webBytes': destination.stat().st_size,
    })
assert len({r['id'] for r in mapping}) == 43
data_file.write_text('// Original contribution records preserved; photos mapped from supplied filenames.\n'
    + 'export const teamMembers = ' + json.dumps(members, ensure_ascii=False, indent=2) + '\n\n'
    + 'export const memberDataIssues = ' + json.dumps(issues, ensure_ascii=False, indent=2) + '\n\n'
    + '// Faculty: only names and roles evidenced by the supplied photo filenames/folders.\n'
    + 'export const teamFaculty = ' + json.dumps(faculty, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(root / 'photo-mapping.json').write_text(json.dumps({'photoSource': str(photo_source), 'contributionSource': str(doc_source), 'records': mapping}, ensure_ascii=False, indent=2), encoding='utf-8')
report = repo / 'Team/member-data-report.md'
report_text = report.read_text(encoding='utf-8').split('\n## 2026-10-03 photo and interaction update')[0]
table = ['| Person / id | Contribution source | Photo source | Current groups | Status |', '|---|---|---|---|---|']
for r in mapping:
    table.append('| ' + ' | '.join([r['name'] + ' / ' + r['id'], r['contributionFile'] or 'None supplied', r['photoFile'], ', '.join(r['currentGroups']), r['status']]) + ' |')
report.write_text(report_text + '''
## 2026-10-03 photo and interaction update

Baseline: `8444af2`, branch `codex/02-team`, clean at start. This section supersedes the earlier photo audit only; original identity resolutions above remain authoritative.

### Personnel, photo and folder mapping (before UI implementation)

37 contribution filenames match the existing 37 source filenames exactly. No re-import was performed. All introductions, quotes, roles, groups, 186 specific task records and six original issue records are retained.

43 photo files: 37 existing-member candidates plus six PI/Secondary PI entries. 35 existing-member portraits and six faculty portraits are connected. Two candidate portraits are withheld until 00 resolves aliases. Originals remain unchanged in the supplied desktop directory; SHA-256, original size, individually reviewed 4:5 crop rectangles and web file sizes are preserved in `assets/team-member/photo-mapping.json`. Web versions are 800×1000 WebP, quality 82, EXIF orientation corrected, without source metadata.

''' + '\n'.join(table) + '''

### Decisions required from 00

- Mo Jin / 金墨: both supplied photo and contribution folders say Hardware; existing role/group is Dry Lab. Photo identity matches the source filename, so the portrait is connected, while role/groups stay unchanged pending 00.
- Liuyu Yang / 杨鏐玉: supplied contribution and photo folders say 美工; existing role is Team Leader. Candidate photo is `美工/杨liu玉.jpg`. Keep original name-resolution record and Team Leader role; photo alias and group await 00. Use the existing initials placeholder meanwhile.
- Ziyun Ma: contribution source is `马梓云.docx`; candidate photo is `ad/马子云ad.jpg`. Alias awaits 00; retain original identity and initials placeholder.
- Tonghui Yin remains in Human Practices AND Hardware & Wiki. No duplicate person is created.

### Faculty data still needed

PI: 李金华、庞博、宋秀玲. Secondary PI: 苏国范、王娟、赵超. Only Chinese names and roles from photo filenames/folders are displayed. Verified English names, institution/title, biography, quote and contributions are missing and registered in `teamFaculty[].missingFields`. No Instructor is added. No collective team photo was supplied.

### Page relationship

Member retains the original 37 contribution profiles, now read inside the card back. Attribution remains the existing placeholder page and is untouched; it does not yet consume or duplicate these records.
''', encoding='utf-8')

sheet = Image.new('RGB', (1200, 8 * 280), '#fffaf5')
draw = ImageDraw.Draw(sheet)
for i, r in enumerate(mapping):
    im = Image.open(repo / r['webFile'])
    im.thumbnail((180, 225))
    x, y = (i % 6) * 200 + 10, (i // 6) * 280
    sheet.paste(im, (x, y))
    draw.text((x, y + 230), r['id'], fill='#6f4e37')
sheet.save(root / 'crop-review.jpg', quality=90)
print(f'Mapped {len(mapping)} photo files; connected 41; pending aliases 2.')
