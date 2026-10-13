"""Build an isolated design preview. Production Member files are read-only."""
from pathlib import Path
from io import BytesIO
import base64
import hashlib
import json
import re
import subprocess
from PIL import Image, ImageOps

folder = Path(__file__).resolve().parent
repo = folder.parents[2]
assert subprocess.check_output(['git', 'branch', '--show-current'], cwd=repo, text=True).strip() == 'codex/02-team'
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip()
source_path = repo / 'Team/member-data.js'
source = source_path.read_text(encoding='utf-8')
decoder = json.JSONDecoder()
def read_export(name):
    position = re.search(r'export const ' + name + r'\s*=\s*', source).end()
    return decoder.raw_decode(source[position:])[0]
members = read_export('teamMembers')
faculty = read_export('teamFaculty')
leaders = [
    ('mo-jin', 'Team Leader'),
    ('jingyi-kang', 'Team Leader'),
    ('zhiyuan-jin', 'Wet Lab Leader'),
    ('ziyan-qin', 'Dry Lab Leader'),
    ('yujia-yang', 'iHP Leader'),
    ('wenxian-gao', 'Education Leader'),
    ('tonghui-yin', 'Hardware Leader'),
    ('xiaojie-meng', 'Part Leader'),
    ('chen-xing', 'Visual Design Leader'),
]
by_id = {p['id']: p for p in members}
directory = [p for p in members if 'Team Leaders' not in p['groups'] and 'Advisors' not in p['groups']]
existing_page_order = [p for p in members if 'Team Leaders' in p['groups']] + [p for p in directory if 'Visual Design' not in p['groups']] + [p for p in directory if 'Visual Design' in p['groups']]
leader_ids = {row[0] for row in leaders}
ordered_members = [by_id[member_id] for member_id, role in leaders] + [p for p in existing_page_order if p['id'] not in leader_ids]
assert len(ordered_members) == 28 and len({p['id'] for p in ordered_members}) == 28
assert len(members) == 37 and len(faculty) == 6
group_path = Path('C:/Users/UserTech/Documents/Tencent Files/1043105282/nt_qq/nt_data/Pic/2026-10/Ori/d7bb2edbb14a664e944ec63a92d55710.jpg')
leader_path = Path('D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/temp/RWTemp/2026-10/b101f6cb78252293104820af9d06fdc5/dbbeea7bbbcc2d92fa836950ab2f7375.png')

def as_data_uri(image, width, height, quality):
    image = image.copy()
    image.thumbnail((width, height), Image.Resampling.LANCZOS)
    buffer = BytesIO()
    image.save(buffer, 'WEBP', quality=quality, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')

def portrait(person, quality=70):
    path = (repo / 'Team' / (person.get('framingPhoto') or person['photo'])).resolve()
    path.relative_to(repo)
    image = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    image = ImageOps.fit(image, (480, 600), Image.Resampling.LANCZOS, centering=(.5, .5))
    framing = {'pi-song-xiuling': (2, .34), 'secondary-pi-zhao-chao': (1.7, .18)}
    if person['id'] in framing:
        zoom, origin_y = framing[person['id']]
        # Reproduce the current page's object-fit + transform-origin framing.
        w, h = image.size
        crop_w, crop_h = w / zoom, h / zoom
        left, top = .5 * (w - crop_w), origin_y * (h - crop_h)
        image = image.crop((round(left), round(top), round(left + crop_w), round(top + crop_h)))
    return as_data_uri(image, 280, 350, quality)

display = {}
for person in members + faculty:
    p = {k: person[k] for k in ['id', 'name', 'role', 'groups', 'introduction', 'quote', 'generalTasks', 'contributionCategories', 'tasks']}
    p['image'] = portrait(person)
    if person['id'] in leader_ids:
        p['previewRole'] = dict(leaders)[person['id']]
    display[person['id']] = p
group_image = ImageOps.exif_transpose(Image.open(group_path)).convert('RGB')
data = {
    'groupPhoto': as_data_uri(group_image, 1280, 900, 64),
    'members': [display[p['id']] for p in ordered_members],
    'pi': [display[p['id']] for p in faculty if 'PI' in p['groups']],
    'secondary': [display[p['id']] for p in faculty if 'Secondary PI' in p['groups']],
    'advisors': [display[p['id']] for p in members if 'Advisors' in p['groups']],
}
template = (folder / 'team-concept.template.html').read_text(encoding='utf-8')
serialized = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
fragment = template.replace('__JLU_TEAM_DATA__', serialized)
assert '__JLU_TEAM_DATA__' not in fragment
assert len(fragment.encode('utf-8')) < 1_000_000
(folder / 'team-concept-v1.html').write_text(fragment, encoding='utf-8')
manifest = {
    'kind': 'Design only; no production Member or member-data edits',
    'date': '2026-10-13', 'branch': 'codex/02-team', 'baseline': head,
    'groupPhoto': {'source': str(group_path), 'sha256': hashlib.sha256(group_path.read_bytes()).hexdigest()},
    'leaderList': {'source': str(leader_path), 'sha256': hashlib.sha256(leader_path.read_bytes()).hexdigest()},
    'firstNine': [{'id': member_id, 'name': by_id[member_id]['name'], 'displayRoleInPreview': role, 'originalRoleUnchanged': by_id[member_id]['role'], 'originalGroupsUnchanged': by_id[member_id]['groups']} for member_id, role in leaders],
    'membersInPreview': [{'id': p['id'], 'name': p['name']} for p in ordered_members],
    'sectionOrder': ['Members', 'PI', 'Secondary PI', 'Advisors'],
    'uniquePeople': 43, 'membersIncludingLeaders': 28, 'faculty': 6, 'advisors': 9,
    'originalSpecificTasks': sum(len(p['tasks']) for p in members),
    'productionHashes': {str(p.relative_to(repo)): hashlib.sha256(p.read_bytes()).hexdigest() for p in [repo / 'Team/member.html', source_path, repo / 'Team/member-data-report.md', repo / '样式/member.js', repo / '样式/member.css']},
    'fragmentBytes': len(fragment.encode('utf-8')),
    'typography': {'family': 'Times New Roman', 'body': '12pt / 16px', 'sectionHeading': '22pt / 29.333px', 'personName': '16pt / 21.333px'},
}
(folder / 'design-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Design preview: {manifest["fragmentBytes"]} bytes; 43 people; first nine leader positions verified. Production files untouched.')
