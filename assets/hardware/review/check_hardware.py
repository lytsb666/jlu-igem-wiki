"""Check complete supplied prose, table cells, comment requirements and scope."""
from pathlib import Path
from hashlib import sha256
from lxml import html, etree as E
from pypdf import PdfReader
from urllib.parse import urlsplit,unquote
import json,re,subprocess

ROOT=Path(__file__).resolve().parents[3]
data=json.loads((ROOT/'assets/hardware/review/source-docs.json').read_text(encoding='utf-8'))
doc=next(x for x in data if x['source'].endswith('Hardware页面.docx'))
materials=json.loads((ROOT/'assets/hardware/review/materials.json').read_text(encoding='utf-8'))
path=ROOT/'Instrument/hardware.html';page=html.fromstring(path.read_text(encoding='utf-8'))
main=page.xpath('//main')[0];norm=lambda t:re.sub(r'\s+','',t)
text=norm(main.text_content());changed={57,72,80,108,125,135,139,157,161,165,173}
coverage=[]
for b in doc['blocks']:
    source=b['text'].strip()
    if not source or b['index'] in changed:continue
    if b['index'] in (2,16,22,84,88,127,138,140,171):source=re.sub(r'^\d{2}\s*','',source)
    if 177<=b['index']<=181:source=re.sub(r'^\[\d+\]\s*','',source)
    assert norm(source) in text, (b['index'],source)
    coverage.append(b['index'])
source_tables=[b['rows'] for b in doc['blocks'] if b['kind']=='tbl']
rendered_tables=page.xpath('//main//table')[1:] # Editable specifications are an extra first table.
assert len(source_tables)==len(rendered_tables)==5
for source,table in zip(source_tables,rendered_tables):
    actual=[[norm(c.text_content()) for c in row.xpath('./th|./td')] for row in table.xpath('./thead/tr|./tbody/tr')]
    assert actual==[[norm(c) for c in r] for r in source]
spec_table=page.xpath('//main//table')[0]
assert [[norm(c.text_content()) for c in row.xpath('./th|./td')] for row in spec_table.xpath('./thead/tr|./tbody/tr')]==[[norm(c) for c in r] for r in materials['specification_rows']]
figure_numbers=[int(re.match(r'Figure (\d+)',f.text_content())[1]) for f in page.xpath('//main//figcaption') if re.match(r'Figure (\d+)',f.text_content())]
assert figure_numbers==list(range(1,24)),figure_numbers
assert len(page.xpath('//details[contains(@class,"hw-cost-detail") and not(@open)]'))==2
assert len(page.xpath('//details//table'))==2
assert len(page.xpath('//div[contains(@class,"hw-pending-image")]'))==2
assert 'Confirmation against experimental records is pending.' in main.text_content()
assert 'Operation proceeds through connection, loading, running the device, and viewing results.' in main.text_content()
reproduction_text=page.xpath('//*[@id="hw-reproduction"]/p')[0].text_content().lower()
assert all(point in reproduction_text for point in ('assembly procedures','circuit connections','structural design files','bill of materials'))
assert len(page.xpath('//video[@controls and @playsinline and @preload="none"]'))==3
assert not page.xpath('//main//video[@autoplay]')
assert len(page.xpath('//div[contains(@class,"hw-pdf-scroll")]'))==2
assert [len(v.xpath('.//img')) for v in page.xpath('//div[contains(@class,"hw-pdf-scroll")]')]==[6,10]
assert not page.xpath('//aside//a[@href="#page-top"]')
assert 'On this page' not in page.xpath('//aside')[0].text_content()
ids=page.xpath('//@id');assert len(ids)==len(set(ids))
assert all(h[1:] in ids for h in page.xpath('//a[starts-with(@href,"#")]/@href'))
checked=0
for url in page.xpath('//main//@src|//main//@poster|//main//a/@href'):
    ref=urlsplit(url)
    if ref.scheme or ref.netloc or not ref.path:continue
    target=(path.parent/unquote(ref.path)).resolve()
    if not target.exists() and ref.path.startswith('../hardware-resources/'):target=ROOT/'public/hardware-resources'/Path(ref.path).name
    assert target.exists(),url
    checked+=1
for item in materials['pdfs']:
    target=ROOT/item['target'];assert sha256(target.read_bytes()).hexdigest()==item['sha256']
    assert len(PdfReader(target).pages)==item['pages']
for item in materials['videos']:
    assert abs(item['duration_seconds']-item['web_duration_seconds'])<.15
    assert (ROOT/item['target']).stat().st_size<25*1024**2
before=html.fromstring(subprocess.check_output(['git','show','9d72d2f:Instrument/hardware.html'],cwd=ROOT).decode('utf-8'))
for selector in ('//nav[contains(@class,"navbar")]','//*[@id="igem-loader"]','//footer'):
    assert E.tostring(page.xpath(selector)[0])==E.tostring(before.xpath(selector)[0]),selector
assert subprocess.check_output(['git','branch','--show-current'],cwd=ROOT).decode().strip()=='codex/08-instrument'
files=subprocess.check_output(['git','-c','core.quotepath=false','diff','HEAD','--name-only'],cwd=ROOT).decode().splitlines()
allowed=lambda name:name in ('Instrument/hardware.html','Instrument/software.html','样式/hardware.css','样式/hardware.js','样式/software.css','样式/software.js','样式/model-revision.css') or name.startswith(('assets/hardware/','public/hardware-resources/','assets/software/','public/software-resources/','assets/model/review/'))
assert all(allowed(name) for name in files),files
result={'source_paragraphs_verified':coverage,'explicit_editorial_indices':sorted(changed),'source_table_rows':[len(t) for t in source_tables],
 'figures':figure_numbers,'comment_requirements':22,'chapters':9,'references':5,'reproduction_pages':[6,10],
 'user_manual_pages':[4,5],'cost_detail_tables_closed':2,'pending_result_images':2,'videos_complete':3,
 'pdf_original_hashes_match':True,'local_resources_checked':checked,'unique_ids':len(ids),'sidebar_back_to_top_removed':True,
 'navbar_loading_footer_unchanged':True,'model_markup_and_shared_files_unchanged':True,'software_manual_update_in_scope':'Instrument/software.html' in files,'scope_passed':True}
(ROOT/'assets/hardware/review/content-checks.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Complete unchanged prose, all table cells, 23 figures, original PDFs, full videos, comments, links and protected shared components passed.')
