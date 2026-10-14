"""Apply the user's Model typography edits without rewriting scientific content.

Run only in the S08 worktree. No source DOCX or shared files are edited.
"""
from pathlib import Path
from html import escape
from lxml import html
import re
import subprocess

ROOT = Path(__file__).resolve().parents[3]
assert Path.cwd().resolve() == ROOT
assert subprocess.check_output(['git', 'branch', '--show-current'], cwd=ROOT).decode().strip() == 'codex/08-instrument'
path = ROOT / 'Instrument/model.html'
source = path.read_text(encoding='utf-8')

def block_math(match):
    tag = match.group(0)
    return tag if 'display=' in tag else tag[:-1] + ' display="block">'

def equation_group(match):
    return re.sub(r'<math\b[^>]*>', block_math, match.group(0))

source = re.sub(r'<div class="model-equation"[^>]*>.*?</div>', equation_group, source, flags=re.S)

def reaction_paragraph(match):
    content = match.group(1)
    formulas = list(re.finditer(r'<math\b.*?</math>', content, re.S))
    if not formulas or not all(any(sign in html.fromstring(m.group()).text_content() for sign in ('⇌', '→')) for m in formulas):
        return match.group(0)
    rows, previous = [], 0
    for formula in formulas:
        label = re.sub(r'<br\s*/?>', '', content[previous:formula.start()]).strip()
        assert re.fullmatch(r'[a-d](?:\d+)?\.', label), label
        markup = re.sub(r'<math\b[^>]*>', block_math, formula.group())
        rows.append('<div class="model-equation-row"><span class="model-equation-label">' + label + '</span>' + markup + '</div>')
        previous = formula.end()
    assert not re.sub(r'<br\s*/?>', '', content[previous:]).strip()
    return '<div class="model-equation model-reaction-equations" role="region" aria-label="Scrollable reaction equations" tabindex="0">' + ''.join(rows) + '</div>'

source = re.sub(r'<p>(.*?)</p>', reaction_paragraph, source, flags=re.S)

# Move the entire bracketed reference group together, keeping the same links and order.
link = r'<a href="#reference-\d+" class="model-citation">\s*\d+\s*</a>'
pattern = r'(?<!<sup class="model-citation-mark">)\[' + link + r'(?:,\s*' + link + r')*\]'
source = re.sub(pattern, lambda m: '<sup class="model-citation-mark">' + m.group() + '</sup>', source)

page = html.fromstring(source)
for table in page.xpath('//main//table'):
    first = table.xpath('.//tr')[0]
    headers = first.xpath('./th|./td')
    for column, header in enumerate(headers):
        if header.text_content().strip().lower() != 'abbreviation':
            continue
        for row in table.xpath('.//tr')[1:]:
            cell = row.xpath('./th|./td')[column]
            text = cell.text_content()
            if '(' not in text or cell.get('data-source-abbreviation'):
                continue
            assert not len(cell), text
            markup = re.sub(r'(?:\([^()]+\))+', lambda m: '<sub>' + escape(''.join(re.findall(r'\(([^()]+)\)', m.group()))) + '</sub>', escape(text))
            original = html.tostring(cell, encoding='unicode', with_tail=False)
            opening = original[:original.index('>')]
            replacement = opening + ' data-source-abbreviation="' + escape(text, quote=True) + '">' + markup + '</' + cell.tag + '>'
            assert source.count(original) == 1, original
            source = source.replace(original, replacement)

def abbreviation_table(match):
    markup = match.group()
    table = html.fromstring(markup)
    headers = table.xpath('.//tr')[0].xpath('./th|./td')
    if any(cell.text_content().strip().lower() == 'abbreviation' for cell in headers):
        classes = 'drylab-table model-abbreviation-table' + (' model-rate-table' if len(headers) == 4 else '')
        return markup.replace('class="drylab-table"', 'class="' + classes + '"', 1)
    return markup

source = re.sub(r'<table class="drylab-table"[^>]*>.*?</table>', abbreviation_table, source, flags=re.S)

# Keep the original image markup byte for byte, including its self-closing syntax.
def result_figure(match):
    markup = match.group()
    figure = html.fromstring(markup)
    caption = ' '.join(figure.xpath('.//figcaption//text()'))
    return markup.replace('class="model-figure"', 'class="model-figure model-result-figure"', 1) if caption.startswith('Figure 7.') else markup

source = re.sub(r'<figure class="model-figure">.*?</figure>', result_figure, source, flags=re.S)

path.write_text(source, encoding='utf-8')
print('Centered complete equations, superscript reference groups, subscript abbreviations and Measurement-style result plot applied.')
