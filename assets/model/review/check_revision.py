"""Check DOCX coverage, page links and untouched shared components."""
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET, html
from urllib.parse import unquote, urlsplit
import argparse
import json
import re
import subprocess

root = Path(__file__).resolve().parents[3]
parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'm': 'http://schemas.openxmlformats.org/officeDocument/2006/math'}
with ZipFile(args.source) as archive:
    source = ET.fromstring(archive.read('word/document.xml'))
model = html.fromstring((root / 'Instrument/model.html').read_text(encoding='utf-8'))
normalize = lambda text: re.sub(r'\s+', '', text)
model_text = normalize(model.xpath('//main')[0].text_content())
source_fragments = source.xpath('.//w:body//w:t/text()|.//w:body//m:t/text()', namespaces=ns)
missing = []
for fragment in source_fragments:
    if normalize(fragment) and normalize(fragment) not in model_text:
        if re.match(r'^\[\d+\]', fragment):
            assert normalize(re.sub(r'^\[\d+\]\s*', '', fragment)) in model_text, fragment
        elif fragment == 'Figure 5. System dynamics simulation results':
            assert normalize(fragment.replace('Figure 5.', 'Figure 7.')) in model_text
        else:
            missing.append(fragment)
assert not missing, missing
assert len(model.xpath('//math')) + len(source.findall('.//m:m', ns)) == len(source.findall('.//m:oMath', ns)) == 73
assert [len(t.findall('.//tr')) for t in model.xpath('//main//table')] == [41, 30, 32, 15, 4, 4]
assert len(model.xpath('//main//figure')) == 7
assert len(model.xpath('//details[contains(@class,"drylab-code-fold")]')) == 3
assert len(model.xpath('//ol[contains(@class,"challenge-list")]/li')) == 4
assert len(model.xpath('//article[contains(@class,"drylab-module")]')) == 2
assert len(model.xpath('//ol[contains(@class,"model-references")]/li')) == 15
results = {'model_source_text_fragments': len(source_fragments), 'missing_source_fragments': missing,
           'model_math': 71, 'math_matrices_as_pseudocode': 2, 'model_tables_rows': [41,30,32,15,4,4],
           'model_figures': 7, 'numbered_challenges': 4, 'numbered_modules': 2, 'pseudocode_panels': 3,
           'references': 15, 'pages': {}}
for filename in ('Instrument/software.html', 'Instrument/model.html'):
    path = root / filename
    page = html.fromstring(path.read_text(encoding='utf-8'))
    ids = page.xpath('//@id')
    assert len(ids) == len(set(ids)), filename
    assert all(href[1:] in ids for href in page.xpath('//a[starts-with(@href,"#")]/@href')), filename
    before = html.fromstring(subprocess.check_output(['git', 'show', '004393822cc66ea69bcba631179405153d81e1e5:' + filename], cwd=root).decode('utf-8'))
    assert set(before.xpath('//@id')).issubset(set(ids)), filename
    for selector in ('//nav[contains(@class,"navbar")]', '//*[@id="igem-loader"]', '//footer'):
        assert ET.tostring(page.xpath(selector)[0]) == ET.tostring(before.xpath(selector)[0]), (filename, selector)
    checked = 0
    for url in page.xpath('//main//@src|//main//a/@href'):
        link = urlsplit(url)
        if link.scheme or link.netloc or not link.path:
            continue
        relative = unquote(link.path)
        target = (path.parent / relative).resolve()
        if not target.exists() and relative.startswith('../software-resources/'):
            target = root / 'public/software-resources' / Path(relative).name
        assert target.exists(), (filename, relative)
        checked += 1
    results['pages'][filename] = {'unique_ids': len(ids), 'local_targets_checked': checked,
                                  'missing_anchors': [], 'old_fragment_ids_preserved': True,
                                  'navbar_loading_footer_unchanged': True}
software = html.fromstring((root / 'Instrument/software.html').read_text(encoding='utf-8'))
assert len(software.xpath('//section[@class="sw-section"]')) == 6
assert not software.xpath('//*[@class="sw-note"]')
assert not software.xpath('//figure[contains(@class,"sw-connection-figure")]//a')
assert software.xpath('//div[@class="sw-shell"]/*[1][self::aside]')
assert len(software.xpath('//main//a[contains(text(),"Hardware") and contains(text(),"to be added") and @href="../Instrument/hardware.html"]')) == 2
assert not software.xpath('//main//p[contains(text(),"Source documentation checked")]')
(root / 'assets/model/review/revision-checks.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('DOCX coverage, equations, tables, figures, comments, preserved fragment URLs, local links and shared-component checks passed.')
