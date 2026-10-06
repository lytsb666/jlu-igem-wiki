"""Publish the supplied Model DOCX; preserve source wording, tables and OMML.

Run from the S08 worktree. The original document is read-only. The five comments
control the four numbered challenges, two modules and three pseudocode panels.
"""
from pathlib import Path
from zipfile import ZipFile
from html import escape
from hashlib import sha256
from lxml import etree as ET, html
from PIL import Image
import argparse
import json
import re

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'm': 'http://schemas.openxmlformats.org/officeDocument/2006/math',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
ROOT = Path(__file__).resolve().parents[3]
parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
with ZipFile(args.source) as archive:
    doc = ET.fromstring(archive.read('word/document.xml'))
    rels = ET.fromstring(archive.read('word/_rels/document.xml.rels'))
    targets = {x.get('Id'): x.get('Target') for x in rels}
    media = {k: archive.read('word/' + v) for k, v in targets.items() if v.startswith('media/')}
    comments = ET.fromstring(archive.read('word/comments.xml'))
body = doc.find('w:body', NS)
paragraphs = body.findall('.//w:p', NS)
indices = {p: i for i, p in enumerate(paragraphs)}

def raw(node):
    return ''.join(node.xpath('.//w:t/text()|.//m:t/text()', namespaces=NS))

def local(node):
    return ET.QName(node).localname

def math_children(node):
    return ''.join(math_node(x) for x in node if not local(x).endswith('Pr'))

def math_node(node):
    tag = local(node)
    def part(name):
        x = node.find('m:' + name, NS)
        return math_children(x) if x is not None else '<mrow/>'
    if tag == 'r':
        text = ''.join(node.xpath('./m:t/text()', namespaces=NS))
        kind = 'mi' if len(text) == 1 and text.isalpha() else 'mn' if text.isdigit() else 'mtext'
        return f'<{kind}>{escape(text)}</{kind}>'
    if tag == 'f':
        return f'<mfrac><mrow>{part("num")}</mrow><mrow>{part("den")}</mrow></mfrac>'
    if tag in ('sSub', 'sSup'):
        op, operand = ('msub', 'sub') if tag == 'sSub' else ('msup', 'sup')
        return f'<{op}><mrow>{part("e")}</mrow><mrow>{part(operand)}</mrow></{op}>'
    if tag == 'd':
        props = node.find('m:dPr', NS)
        def delimiter(name, default):
            x = props.find('m:' + name, NS) if props is not None else None
            return x.get('{' + NS['m'] + '}val', default) if x is not None else default
        start, end = delimiter('begChr', '('), delimiter('endChr', ')')
        return f'<mrow><mo stretchy="true">{escape(start)}</mo>{part("e")}<mo stretchy="true">{escape(end)}</mo></mrow>'
    if tag == 'nary':
        char = node.find('m:naryPr/m:chr', NS)
        symbol = char.get('{' + NS['m'] + '}val') if char is not None else '∫'
        operator = f'<mo>{escape(symbol)}</mo>'
        sub, sup = node.find('m:sub', NS), node.find('m:sup', NS)
        if sub is not None and raw(sub):
            operator = f'<munder>{operator}<mrow>{part("sub")}</mrow></munder>'
        if sup is not None and raw(sup):
            operator = f'<mover>{operator}<mrow>{part("sup")}</mrow></mover>'
        return f'<mrow>{operator}{part("e")}</mrow>'
    if tag == 'limUpp':
        return f'<mover><mrow>{part("e")}</mrow><mrow>{part("lim")}</mrow></mover>'
    if tag == 'func':
        return f'<mrow>{part("fName")}<mo>⁡</mo>{part("e")}</mrow>'
    if tag == 'm':
        rows = ''.join('<mtr>' + ''.join('<mtd><mrow>' + math_children(x) + '</mrow></mtd>'
                       for x in row.findall('m:e', NS)) + '</mtr>' for row in node.findall('m:mr', NS))
        return '<mtable columnalign="left" rowspacing="0.4em">' + rows + '</mtable>'
    if tag == 'phant':
        return '<mphantom>' + part('e') + '</mphantom>'
    if tag.endswith('Pr'):
        return ''
    return math_children(node)

def inline(node):
    tag = local(node)
    if tag == 'oMath':
        return '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>' + math_children(node) + '</mrow></math>'
    if tag == 't':
        return escape(node.text or '')
    if tag in ('br', 'cr'):
        return '<br/>'
    if tag == 'tab':
        return '    '
    if tag in ('pPr', 'rPr', 'drawing', 'commentReference'):
        return ''
    return ''.join(inline(x) for x in node)

def cited(text):
    def match(m):
        values = m.group(1).split(',')
        return '[' + ','.join(f'<a href="#reference-{v.strip()}" class="model-citation">{v}</a>' for v in values) + ']'
    return re.sub(r'\[(\d+(?:,\s*\d+)*)\]', match, text)

head_ids = {
    0: 'introduction', 11: 'method', 18: 'screening', 19: 'dataset-curation',
    24: 'candidate-generation', 30: 'dataset-preprocessing', 37: 'model-architecture',
    46: 'model-training', 59: 'model-evaluation', 65: 'ablation-experiments',
    71: 'model-performance', 74: 'ablation-results', 78: 'rsv-screening',
    186: 'dynamics-model', 187: 'reaction-mechanism', 190: 'reaction-steps',
    193: 'step-1-recombinase-primer-complex-synthesis', 201: 'step-2-reverse-transcription',
    208: 'step-3-primer-invasion-and-dna-amplification', 218: 'step-4-cas12a-assembly-and-cleavage',
    224: 'model-assumptions', 225: 'reaction-pathway', 228: 'parameter-values',
    230: 'kinetic-conditions', 233: 'system-state-and-mass-transfer',
    235: 'reaction-diffusion-equations', 263: 'nomenclature', 325: 'rate-constants',
    483: 'initial-conditions', 520: 'simulation-results',
    522: 'initiation-phase-0-5-min', 524: 'amplification-phase-5-25-min',
    526: 'quasi-steady-phase-25-30-min', 532: 'condition-optimization',
    533: 'optimization-approach', 535: 'key-components-analysis', 540: 'optimization-results',
    561: 'references'}
top_ids = {0, 11, 18, 186, 561}
sub_ids = {19, 24, 30, 37, 46, 59, 65, 71, 74, 78, 187, 190, 224, 235, 263, 325, 520, 532}
image_names = ['overall-workflow.jpeg', 'model-architecture.jpeg',
               'mechanism-01-complex-synthesis.jpeg', 'mechanism-02-reverse-transcription.jpeg',
               'mechanism-03-amplification.jpeg', 'mechanism-04-cas12a.jpeg', 'simulation-results.jpeg']
existing_images = html.fromstring((ROOT / 'Instrument/model.html').read_text(encoding='utf-8')).xpath('//main//figure//img/@src')[:6]
rendered, skip, figure_records, table_records = [], set(), [], []
top_open = sub_open = False
top_count = table_count = 0
current_heading = 'Model'

for node in body:
    tag = local(node)
    if tag == 'tbl':
        table_count += 1
        rows = node.findall('w:tr', NS)
        table = []
        for rownum, row in enumerate(rows):
            cells = []
            for cellnum, cell in enumerate(row.findall('w:tc', NS)):
                cell_tag = 'th' if rownum == 0 or cellnum == 0 else 'td'
                scope = ' scope="col"' if rownum == 0 else ' scope="row"' if cellnum == 0 else ''
                content = '<br/>'.join(cited(inline(p)) for p in cell.findall('w:p', NS) if raw(p).strip())
                cells.append(f'<{cell_tag}{scope}>{content}</{cell_tag}>')
            table.append('<tr>' + ''.join(cells) + '</tr>')
        label = ['RSV top 10 candidate combinations', 'Nomenclature', 'Rate constants',
                 'Initial conditions', 'Global coarse search', 'Fine local search'][table_count - 1]
        rendered.append(f'<div class="table-wrap drylab-table-wrap" role="region" aria-label="Scrollable table: {label}" tabindex="0"><table class="data-table drylab-table"><caption class="visually-hidden">{label}</caption><thead>{table[0]}</thead><tbody>{"".join(table[1:])}</tbody></table></div>')
        table_records.append({'title': label, 'rows': len(rows), 'source_text': raw(node)})
        continue
    if tag != 'p':
        continue
    i = indices[node]
    if i in skip:
        continue
    text = raw(node).strip()
    drawings = node.findall('.//a:blip', NS)
    if drawings:
        number = len(figure_records) + 1
        data = media[drawings[0].get('{' + NS['r'] + '}embed')]
        if number <= 6:
            url = existing_images[number - 1]
            path = ROOT / url.removeprefix('../')
            assert sha256(path.read_bytes()).digest() == sha256(data).digest(), path
        else:
            path = ROOT / 'assets/model/images' / image_names[number - 1]
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
            url = '../assets/model/images/' + path.name
        width, height = Image.open(path).size
        caption_i = next(j for j in range(i + 1, len(paragraphs)) if raw(paragraphs[j]).strip())
        caption = raw(paragraphs[caption_i]).strip()
        # Only the duplicated figure number is corrected; graph values stay intact.
        caption = re.sub(r'^Figure \d+\.', f'Figure {number}.', caption)
        skip.add(caption_i)
        alt = re.sub(r'^Figure \d+\.\s*', '', caption)
        rendered.append(f'<figure class="model-figure"><a class="model-figure__link" href="{url}" target="_blank" rel="noopener" aria-label="Open figure at full size"><img src="{url}" width="{width}" height="{height}" alt="{escape(alt)}" loading="lazy" decoding="async"/></a><figcaption>{escape(caption)}</figcaption></figure>')
        figure_records.append({'number': number, 'source_paragraph': i, 'url': url, 'sha256': sha256(data).hexdigest()})
        continue
    if not text:
        continue
    if i == 3:
        rendered.append('<ol class="challenge-list">' + ''.join(f'<li><span aria-hidden="true">{j-2}</span><p>{cited(inline(paragraphs[j]))}</p></li>' for j in range(3, 7)) + '</ol>')
        skip.update(range(4, 7))
        continue
    if i == 8:
        rendered.append('<div class="drylab-module-grid"><article class="drylab-module drylab-module--sequence"><span>1</span><p>' + cited(inline(node)) + '</p></article><article class="drylab-module drylab-module--kinetics"><span>2</span><p>' + cited(inline(paragraphs[9])) + '</p><p>' + cited(inline(paragraphs[10])) + '</p></article></div>')
        skip.update((9, 10))
        continue
    if i in (29, 32, 34):
        title = {29: 'Candidate-generation constraints', 32: 'Sequence input definitions', 34: 'Numerical feature definitions'}[i]
        if i == 29:
            code = inline(node).replace('<br/>', '\n')
        else:
            # Word encodes these pseudocode lines as rows in an OMML matrix.
            code = escape('\n'.join(raw(row) for row in node.findall('.//m:mr', NS)))
        rendered.append(f'<details class="drylab-fold drylab-code-fold" open><summary><span>{title}</span><small>Click to collapse or expand</small></summary><div class="code-window"><pre><code>{code}</code></pre></div></details>')
        continue
    if i in head_ids:
        current_heading = text
        anchor = head_ids[i]
        if i in top_ids:
            if sub_open:
                rendered.append('</section>'); sub_open = False
            if top_open:
                rendered.append('</section>')
            top_count += 1
            rendered.append(f'<section class="lab-section drylab-section" id="{anchor}" data-observe-section><div class="section-heading"><span class="section-number">{top_count:02}</span><div><h2>{escape(text)}</h2></div></div>')
            top_open = True
        elif i in sub_ids:
            if sub_open:
                rendered.append('</section>')
            rendered.append(f'<section class="drylab-subsection" id="{anchor}"><div class="subsection-heading"><h3>{escape(text)}</h3></div>')
            if i == 235:
                # Redirect old bookmarks for sections removed from the new DOCX.
                rendered.append('<span id="effectiveness-factor" class="model-anchor-alias" aria-hidden="true"></span><span id="enzyme-activity" class="model-anchor-alias" aria-hidden="true"></span><span id="mass-transfer-processes" class="model-anchor-alias" aria-hidden="true"></span>')
            sub_open = True
        else:
            rendered.append(f'<h4 id="{anchor}" class="drylab-step-heading">{escape(text)}</h4>')
        continue
    if i >= 562:
        if i == 562:
            rendered.append('<ol class="references-list model-references">')
        number = i - 561
        reference = re.sub(r'^\[\d+\]\s*', '', text)
        reference = escape(reference)
        reference = re.sub(r'(10\.\d{4,9}/[^\s]+?)(\.?)(?=\s|$)', lambda m: f'<a href="https://doi.org/{m[1]}" target="_blank" rel="noopener">{m[1]}</a>{m[2]}', reference)
        rendered.append(f'<li id="reference-{number}">{reference}</li>')
        continue
    content = cited(inline(node))
    display_math = node.findall('.//m:oMath', NS) and not node.findall('.//w:t', NS)
    rendered.append('<div class="model-equation" role="region" aria-label="Scrollable equation" tabindex="0">' + content + '</div>' if display_math else '<p>' + content + '</p>')

rendered.append('</ol>')
if sub_open:
    rendered.append('</section>')
if top_open:
    rendered.append('</section>')
page = ROOT / 'Instrument/model.html'
source = page.read_text(encoding='utf-8')
start = source.index('    <div class="article-flow">') + len('    <div class="article-flow">')
end = source.index('\n    </div>\n  </div>\n</main>', start)
source = source[:start] + '\n' + '\n'.join(rendered) + source[end:]
source = source.replace('drylab-page loading-lock', 'drylab-page model-revision-page loading-lock')
source = source.replace('data-section-link ', '')
source = source.replace('>PDE system</a>', '>Kinetic equations</a>')
if '../样式/model-revision.css' not in source:
    source = source.replace('</head>', '  <link rel="stylesheet" href="../样式/model-revision.css">\n</head>')
if '../样式/model-revision.js' not in source:
    source = source.replace('<script type="module" src="../样式/wetlab-pages.js"></script>', '<script type="module" src="../样式/wetlab-pages.js"></script>\n<script type="module" src="../样式/model-revision.js"></script>')
page.write_text(source, encoding='utf-8', newline='\n')
audit = {'source': str(args.source), 'source_sha256': sha256(args.source.read_bytes()).hexdigest(),
         'paragraphs': len(paragraphs), 'math_objects': len(doc.findall('.//m:oMath', NS)),
         'comments': [{'id': c.get('{' + NS['w'] + '}id'), 'text': raw(c)} for c in comments],
         'figures': figure_records, 'tables': table_records,
         'editorial_changes': ['Duplicate simulation Figure 5 renumbered Figure 7.', 'TOC wording Kinetic equations; existing fragment retained.'],
         'source_issues': ['Intro/method still describe PDE; System State and simulation specify homogeneous ODE/LSODA.',
                           'Intro lists five optimization components, detailed optimization and tables list three.',
                           'Simulation prose describes four curves and an early DNA peak; supplied graph contains DNA and X with no DNA peak.',
                           'Some formulas are plain linear text in the supplied DOCX. No missing operators or denominators were invented.',
                           'RT initial/optimization units differ substantially; retained exactly as supplied.']}
(ROOT / 'assets/model/review/model-source-manifest.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Published {top_count} chapters, {table_count} tables, {len(figure_records)} figures and 3 pseudocode panels.')
