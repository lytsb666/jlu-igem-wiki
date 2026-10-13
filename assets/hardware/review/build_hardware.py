"""Publish supplied Hardware prose and comment requirements without invented results."""
from pathlib import Path
from html import escape
from lxml import html, etree as E
import json, re

ROOT=Path(__file__).resolve().parents[3]
records=json.loads((ROOT/'assets/hardware/review/source-docs.json').read_text(encoding='utf-8'))
doc=next(x for x in records if x['source'].endswith('Hardware页面.docx'))
blocks=doc['blocks']
materials=json.loads((ROOT/'assets/hardware/review/materials.json').read_text(encoding='utf-8'))
pdfs=materials['pdfs']
top={2:('hw-introduction','Introducing ByeGerm'),16:('hw-requirements','Hardware Requirements'),
     22:('hw-first-generation','ByeGerm 1.0'),84:('hw-design-evolution','From 1.0 to 2.0'),
     88:('hw-second-generation','ByeGerm 2.0'),127:('hw-validation','Functional Validation'),
     138:('hw-reproduction','Assembly and Reproduction'),140:('hw-costs','Cost Estimation'),
     171:('hw-outlook','The ByeGerm Story Continues'),176:('hw-references','References')}
sub={5:('hw-specifications','Specifications'),8:('hw-development','Development Timeline'),
     23:('hw-gen1-architecture','Overall Architecture'),28:('hw-gen1-modules','Structure and Modules'),
     58:('hw-gen1-analysis','Image Analysis'),65:('hw-gen1-app','Mobile App'),73:('hw-gen1-operation','Operation Workflow'),
     89:('hw-gen2-architecture','Architecture and Modules'),110:('hw-gen2-analysis','Multicolor Analysis'),
     115:('hw-gen2-program','Program Upgrades'),120:('hw-gen2-operation','Operation Workflow'),
     128:('hw-mobile-compatibility','Mobile Compatibility'),135:('hw-pathogen-results','Pathogen Results'),
     141:('hw-cost-scope','Scope and Method'),145:('hw-gen1-costs','1.0 Cost Estimate'),
     155:('hw-gen2-costs','2.0 Cost Estimate'),164:('hw-qpcr-comparison','qPCR Comparison')}
changes=[]
image_aliases={
 'image7.jpeg':'fluorescence-interface-high-resolution.jpg',
 'image8.jpeg':'imaging-distances-high-resolution.jpg',
 'workflow-1.png':'workflow-1-clean.svg',
 'workflow-2.png':'workflow-2-clean.svg',
}
def cited(text):
    text=escape(text)
    return re.sub(r'\[(\d+)\]',lambda m:f'<a href="#hw-reference-{m[1]}">[{m[1]}]</a>',text)
def para(text):return '<p>'+cited(text)+'</p>'
def table(rows,caption):
    rendered=[]
    for n,row in enumerate(rows):
        cells=[]
        for c,text in enumerate(row):
            tag='th' if n==0 or c==0 else 'td'
            scope=' scope="col"' if n==0 else ' scope="row"' if c==0 else ''
            cells.append(f'<{tag}{scope}>{cited(text)}</{tag}>')
        rendered.append('<tr>'+''.join(cells)+'</tr>')
    return '<div class="hw-table-wrap" role="region" tabindex="0" aria-label="Scrollable table: '+escape(caption)+'"><table><caption>'+escape(caption)+'</caption><thead>'+rendered[0]+'</thead><tbody>'+''.join(rendered[1:])+'</tbody></table></div>'
def image(path,alt):
    if path.endswith(('.tif','.tiff')):path=str(Path(path).with_suffix('.png'))
    path=image_aliases.get(Path(path).name,path)
    source='../assets/hardware/images/'+Path(path).name
    record=next((x for x in materials['images'] if x['target'].endswith(Path(path).name)),None)
    size=record['size'] if record else [1280,720]
    return f'<a data-hw-fullimage href="{source}" target="_blank" rel="noopener" aria-label="Open figure at full size"><img src="{source}" width="{size[0]}" height="{size[1]}" alt="{escape(alt)}" loading="lazy" decoding="async"/></a>'
def asset_figure(filename,caption):
    w,h=(1280,720) if filename=='development-timeline.svg' else (960,547)
    return f'<figure class="hw-figure"><a data-hw-fullimage href="../assets/hardware/images/{filename}" target="_blank" rel="noopener"><img src="../assets/hardware/images/{filename}" width="{w}" height="{h}" alt="{escape(caption)}" loading="lazy" decoding="async"/></a><figcaption>{escape(caption)}</figcaption></figure>'
def video(n,title):
    return f'<figure class="hw-video"><video controls playsinline preload="none" poster="../assets/hardware/images/video-{n}-poster.jpg" aria-label="{escape(title)}"><source src="../hardware-resources/video-{n}.mp4" type="video/mp4"/><a href="../hardware-resources/video-{n}.mp4">Open video</a></video><figcaption>{escape(title)} · <a href="../hardware-resources/video-{n}.mp4" target="_blank" rel="noopener">Open video ↗</a></figcaption></figure>'
def pdf_href(n):return '../hardware-resources/'+Path(pdfs[n]['target']).name
def pdf_link(n,label):return f'<a href="{pdf_href(n)}" target="_blank" rel="noopener">{escape(label)} ↗</a>'
def reader(n,label):
    item=pdfs[n]
    pages=''.join(f'<img src="../{entry["target"].replace(chr(92),"/")}" width="{entry["size"][0]}" height="{entry["size"][1]}" alt="{escape(label)}, page {entry["page"]} of {item["pages"]}" loading="lazy" decoding="async"/>' for entry in item['previews'])
    return f'<article class="hw-guide"><h3>{escape(label)}</h3><p>{item["pages"]} pages · {pdf_link(n,"Open PDF")} · <a href="{pdf_href(n)}" download>Download</a></p><div class="hw-pdf-scroll" role="region" tabindex="0" aria-label="Scrollable {escape(label)}">{pages}</div></article>'

toc=[]
for start,(anchor,label) in top.items():
    end=next((i for i in top if i>start),len(blocks))
    children=[f'<li><a href="#{a}">{escape(t)}</a></li>' for i,(a,t) in sub.items() if start<i<end]
    toc.append(f'<div><a href="#{anchor}">{escape(label)}</a>'+('<ul>'+''.join(children)+'</ul>' if children else '')+'</div>')
markup=['<header class="hw-intro"><p class="hw-eyebrow">'+escape(blocks[0]['text'])+'</p><h2>'+escape(blocks[1]['text'])+'</h2></header>',
        '<div class="hw-layout"><aside class="page-toc hw-directory" aria-label="Hardware sections"><nav aria-label="Hardware chapters">'+''.join(toc)+'</nav></aside><article class="hw-article">']
skip={0,1,173,174,175,182}
open_section=False
table_titles={149:'Table 1. Hardware Requirements of the Detection System',153:'Table 3. ByeGerm 1.0 Total Device Cost Summary',
              158:'Table 4. ByeGerm 2.0 Component and Fabrication Cost Breakdown',162:'Table 5. ByeGerm 2.0 Total Device Cost Summary',
              19:'Table 1. Hardware Requirements of the Detection System'}
figure_records=[]
for i,b in enumerate(blocks):
    if i in skip:continue
    text=b['text'].strip()
    if i in top:
        if open_section:markup.append('</section>')
        anchor,label=top[i];heading=re.sub(r'^\d{2}\s*','',text)
        markup.append(f'<section class="hw-section" id="{anchor}"><h2>{escape(heading)}</h2>');open_section=True
        if i==2:markup.append(video(1,'ByeGerm instrument introduction'))
        continue
    if i in sub:
        anchor,label=sub[i];heading=text
        if i==135:heading=heading.replace('6.3','6.2');changes.append('Renumbered pathogen results 6.3 to 6.2; no missing section fabricated.')
        markup.append(f'<h3 id="{anchor}">{escape(heading)}</h3>')
        if i==135:
            markup.append('<div class="hw-pending-results" aria-label="Two result panels awaiting experimental records"><figure><div class="hw-pending-image">Result image pending</div><figcaption>Detection results · panel 1</figcaption></figure><figure><div class="hw-pending-image">Result image pending</div><figcaption>Detection results · panel 2</figcaption></figure></div>')
        continue
    if b['kind']=='tbl':
        caption=blocks[i-1]['text'].strip()
        if i==158:caption='Table 4. ByeGerm 2.0 Component and Fabrication Cost Breakdown'
        if i==162:caption='Table 5. ByeGerm 2.0 Total Device Cost Summary'
        markup.append(table(b['rows'],caption))
        if i in (149,158):markup.append('</details>')
        continue
    if i in (18,148,152,157,161):
        if i in (148,157):markup.append('<details class="hw-cost-detail"><summary>'+escape('ByeGerm '+('1.0' if i==148 else '2.0')+' component and fabrication breakdown')+'</summary>')
        continue
    if i==6:
        markup.append('<figure class="hw-figure">'+table(materials['specification_rows'],'Technical specifications')+'<figcaption>'+escape(blocks[7]['text'])+'</figcaption></figure>');skip.add(7)
        figure_records.append({'number':1,'source':'Fig1.Technical_Specifications.pptx','rendering':'Native HTML table; all editable-source rows retained.'});continue
    if i==9:
        markup.append(asset_figure('development-timeline.svg',blocks[10]['text']));skip.add(10)
        figure_records.append({'number':2,'source':'Fig2.Development_Timeline.pptx','rendering':'SVG conversion of editable shapes and text.'});continue
    if i==74:
        markup.append(video(2,'ByeGerm 1.0 operation demonstration'))
        markup.append('<figure class="hw-figure">'+image('workflow-1.png','Supplied ByeGerm 1.0 operation workflow')+'</figure>')
        markup.append('<ol class="hw-workflow">'+''.join('<li>'+cited(blocks[j]['text'])+'</li>' for j in range(75,79))+'</ol>');skip.update(range(75,79));continue
    if i==166:
        markup.append(asset_figure('cost-comparison.svg',blocks[167]['text']));skip.add(167)
        figure_records.append({'number':23,'source':'Fig23.Equipment_Cost.pptx','rendering':'SVG chart with original editable-source cached values.'});continue
    if b['images']:
        images=list(b['images']);caption=text if text.startswith('Figure ') else ''
        j=i+1
        while j<len(blocks) and not caption:
            nxt=blocks[j]
            if nxt['images']:images.extend(nxt['images']);skip.add(j)
            if nxt['text'].strip().startswith('Figure '):caption=nxt['text'].strip();skip.add(j);break
            if nxt['text'].strip() and not nxt['images']:break
            j+=1
        if i==121:
            markup.append(video(3,'ByeGerm 2.0 operation demonstration'))
            markup.append('<figure class="hw-figure">'+image('workflow-2.png','Supplied ByeGerm 2.0 operation workflow')+'</figure>')
            images=images[1:]  # The commented first picture is the video title placeholder.
        picture_html=''.join(image(path,caption or 'ByeGerm hardware photograph') for path in images)
        markup.append('<figure class="hw-figure"><div class="hw-figure-images">'+picture_html+'</div>'+('<figcaption>'+escape(caption)+'</figcaption>' if caption else '')+'</figure>')
        if caption:
            number=re.match(r'Figure (\d+)',caption);figure_records.append({'number':int(number[1]) if number else None,'source':images})
        continue
    if i in (57,108):
        n=0 if i==57 else 1;markup.append('<p>Further details are provided in the '+pdf_link(n,'first-generation reproduction guide' if n==0 else 'second-generation reproduction guide')+'.</p>');continue
    if i in (64,111,119):
        linked=cited(text).replace('Software and Model pages','<a href="../Instrument/software.html">Software</a> and <a href="../Instrument/model.html">Model</a> pages').replace('Model page','<a href="../Instrument/model.html">Model page</a>')
        markup.append('<p>'+linked+'</p>');continue
    if i==72:
        text=text.replace('Section 6.2','Section 6.1');markup.append('<p>'+cited(text).replace('Software page','<a href="../Instrument/software.html">Software page</a>')+'</p>');changes.append('Corrected compatibility cross-reference to the existing 6.1 section.');continue
    if i in (80,125):
        n=2 if i==80 else 3
        overview='Operation proceeds through connection, loading, running the device, and viewing results. ' if i==125 else ''
        if i==125:changes.append('Restored the second-generation connection/loading/run/result overview with user confirmation; existing manual link retained.')
        markup.append('<p>'+overview+'Detailed operating instructions are provided in the '+pdf_link(n,'ByeGerm 1.0 user manual' if n==2 else 'ByeGerm 2.0 user manual')+'.</p>');continue
    if i==139:
        markup.append('<p>The reproduction documentation is intended to compile assembly procedures, circuit connections, structural design files, and the bill of materials. Read either supplied reproduction guide directly below or open its original PDF.</p>')
        changes.append('Restored all four reproduction-documentation points with user confirmation; supplied guide links retained without claiming source-design files have been released.')
        markup.append('<div class="hw-guides">'+reader(0,'ByeGerm 1.0 Reproduction Guide')+reader(1,'ByeGerm 2.0 Reproduction Guide')+'</div>')
        markup.append('<h3 id="hw-user-manuals">User Manuals</h3><div class="hw-manuals">'+''.join(f'<article><h4>ByeGerm {gen}.0 User Manual</h4><p>{pdfs[n]["pages"]} pages</p><p>'+pdf_link(n,'Open user manual')+f' · <a href="{pdf_href(n)}" download>Download PDF</a></p></article>' for gen,n in [(1,2),(2,3)])+'</div>')
        continue
    if i==165:
        sentence='The production budget for the ByeGerm 2.0 prototype is CNY 3,980, and the production budget for the ByeGerm 2.0 prototype is CNY 3,980.'
        text=text.replace(sentence,'The production budget for the ByeGerm 2.0 prototype is CNY 3,980.');changes.append('Removed verbatim duplicated ByeGerm 2.0 budget clause; no comparison value changed.')
    if i==172:
        markup.append(para(text));markup.append('<div class="hw-crosslinks"><a href="../Instrument/software.html">Software ↗</a><a href="../Instrument/model.html">Model ↗</a>'+pdf_link(2,'1.0 User Manual')+pdf_link(3,'2.0 User Manual')+pdf_link(0,'1.0 Reproduction Guide')+pdf_link(1,'2.0 Reproduction Guide')+'</div>');continue
    if 177<=i<=181:
        if i==177:markup.append('<ol class="hw-references">')
        number=i-176;text=re.sub(r'^\[\d+\]\s*','',text)
        markup.append(f'<li id="hw-reference-{number}">'+escape(text)+'</li>')
        if i==181:markup.append('</ol>')
        continue
    if not text:continue
    if b['style']=='4':markup.append('<h4>'+escape(text)+'</h4>')
    else:markup.append(para(text))
if open_section:markup.append('</section>')
markup.append('</article></div>')
path=ROOT/'Instrument/hardware.html';original=path.read_text(encoding='utf-8')
original=original.replace('<html lang="en">','<html id="page-top" lang="en">')
original=original.replace('<body class="loading-lock">','<body class="loading-lock hardware-page">')
if '../样式/hardware.css' not in original:original=original.replace('</head>','  <link rel="stylesheet" href="../样式/hardware.css">\n</head>')
if 'rel="icon"' not in original:original=original.replace('</head>','  <link rel="icon" href="../a  图片/page-covers/hardware.webp" type="image/webp">\n</head>')
start=original.index('    <main');end=original.index('    </main>',start)+len('    </main>')
original=original[:start]+'    <main class="hw-main" id="hardware-content">\n'+ '\n'.join(markup)+'\n    </main>'+original[end:]
if '../样式/hardware.js' not in original:original=original.replace('<script type="module" src="../样式/main.js"></script>','<script type="module" src="../样式/main.js"></script>\n    <script type="module" src="../样式/hardware.js"></script>')
path.write_text(original,encoding='utf-8',newline='\n')
issues=[
 'Primary prose / editable specifications identify Raspberry Pi in generation 1; reproduction guide system table identifies Orange Pi 5 Max / RK3588 and later repeats Raspberry Pi. No silent substitution.',
 'Generation-2 Figure 20 caption describes STM32 AI vision control; reproduction guide and BOM separate RK3588 image processing from STM32F407ZGT6 peripheral control.',
 'The provided generation-2 user manual cover repeats 7.5 x 14 x 11 cm, while the hardware draft and reproduction guide give 15 x 30 x 20 cm. Original PDF is unchanged.',
 'Primary paragraph describes 802.11ac and later Wi-Fi 6E; no exact installed wireless variant or raw latency/thermal test records supplied.',
 'Hardware draft refers fluorescence CNN training to Model; current Model page covers primer-crRNA ranking and reaction kinetics. Cross-module clarification belongs to 00.',
 'Two pathogen-performance result images explicitly pending in comment 15; no results or accuracy were fabricated.',
 'Raw CAD, Gerber, firmware, model weights and itemized procurement evidence are not present; reproduction guides describe fabrication but are not source-design downloads.',
 'qPCR procurement example has no procurement URL in the supplied materials; retained as a source comparison, not an independently verified current market price.',
 'Protocol and Software resource placement and final cross-module manual versions are for 00; Hardware opens its supplied PDFs directly.',
]
audit={'source':doc['source'],'source_sha256':doc['sha256'],'baseline':'9d72d2f','chapters':9,'references':5,
 'figures':figure_records,'source_comments':doc['comments'],'editorial_changes':changes+['Duplicate source cost table labels renumbered 1..5.','Supplied manuals and reproduction guides replace stale future-tense availability text.'],
 'source_issues':issues,'cost_table_row_counts':[len(b['rows']) for b in blocks if b['kind']=='tbl'],
 'scope':['Instrument/hardware.html','Dedicated Hardware CSS/JS/assets/resources/review files only'],
 'crosslinks':['../Instrument/software.html','../Instrument/model.html','Direct generation-specific user manual and reproduction guide PDFs'],
 'judging_mapping':'Existing Judging/hardware.html redirects to Instrument/hardware.html?nav=judging; redirect unchanged.'}
(ROOT/'assets/hardware/review/page-source-manifest.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Published nine supplied chapters, 23 numbered figures, five source tables, inline guides and three videos.')
