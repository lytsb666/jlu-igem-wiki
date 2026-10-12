"""Prepare supplied Hardware assets; keep originals read-only and record provenance."""
from pathlib import Path
from zipfile import ZipFile
from io import BytesIO
from hashlib import sha256
from html import escape
from lxml import etree as E
from PIL import Image, ImageDraw
from pypdf import PdfReader
import argparse, json, re, shutil, subprocess, sys, textwrap

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path('C:/Users/UserTech/Desktop/Hardware/Hardware 1012 全 2')
SCRATCH = ROOT / '.sites-work/hardware-review-20261012'
sys.path.insert(0,str(SCRATCH/'tool-deps'))
IMAGES = ROOT / 'assets/hardware/images'
RESOURCES = ROOT / 'public/hardware-resources'
REVIEW = ROOT / 'assets/hardware/review'
NS = {'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
parser = argparse.ArgumentParser(); parser.add_argument('stage', choices=['assets', 'videos'])
stage = parser.parse_args().stage
for folder in (SCRATCH, IMAGES, RESOURCES, REVIEW): folder.mkdir(parents=True, exist_ok=True)
manifest_path = REVIEW / 'materials.json'
digest = lambda p: sha256(p.read_bytes()).hexdigest()

if stage == 'assets':
    records = {'source_directory':str(SOURCE), 'images':[], 'pdfs':[], 'editable_figures':[]}
    doc = SOURCE / 'Hardware/Hardware页面.docx'
    records['primary_document'] = {'source':str(doc), 'sha256':digest(doc)}
    for n in (1,2):
        source=SOURCE/f'Hardware/图表/{n} 流程.png';target=IMAGES/f'workflow-{n}.png'
        shutil.copyfile(source,target)
        records['images'].append({'source':str(source),'source_sha256':digest(source),'target':str(target.relative_to(ROOT)),
            'sha256':digest(target),'size':list(Image.open(source).size),'original_bytes_preserved':True})
    with ZipFile(doc) as z:
        for name in z.namelist():
            if not name.startswith('word/media/') or name.endswith('/'): continue
            image = Image.open(BytesIO(z.read(name)))
            target_name = Path(name).name
            if image.format == 'TIFF':
                target_name = Path(target_name).stem + '.png'
                image.save(IMAGES / target_name, 'PNG', optimize=True)
            else: (IMAGES / target_name).write_bytes(z.read(name))
            target = IMAGES / target_name
            records['images'].append({'source':str(doc)+'!'+name, 'source_sha256':sha256(z.read(name)).hexdigest(),
                'target':str(target.relative_to(ROOT)), 'sha256':digest(target), 'size':list(image.size),
                'original_bytes_preserved':image.format!='TIFF'})

    pdf_inputs = [('Reproduction Guide/Byegerm1.0 Reproduction Guide.pdf','reproduction-first-generation.pdf','reproduction-1'),
                  ('Reproduction Guide/Byegerm2.0 Reproduction Guide.pdf','reproduction-second-generation.pdf','reproduction-2'),
                  ('User manual/1.0 说明书.pdf','user-manual-first-generation.pdf','manual-1'),
                  ('User manual/2.0说明书.pdf','user-manual-second-generation.pdf','manual-2')]
    poppler = Path('C:/Users/UserTech/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
    for source_name, filename, prefix in pdf_inputs:
        source = SOURCE / source_name; target = RESOURCES / filename
        shutil.copyfile(source, target)
        assert digest(source) == digest(target)
        preview_folder = IMAGES / prefix; preview_folder.mkdir(exist_ok=True)
        if len(list(SCRATCH.glob(prefix+'-*.png'))) != len(PdfReader(source).pages):
            subprocess.run([str(poppler),'-scale-to','1300','-png',str(source),str(SCRATCH / prefix)],check=True,capture_output=True)
        previews = []
        for png in sorted(SCRATCH.glob(prefix+'-*.png'), key=lambda p:int(p.stem.rsplit('-',1)[1])):
            n=int(png.stem.rsplit('-',1)[1]); out=preview_folder / f'page-{n:02}.webp'
            with Image.open(png) as image: image.save(out, 'WEBP', quality=92, method=6)
            previews.append({'page':n,'target':str(out.relative_to(ROOT)), 'size':list(Image.open(out).size)})
        records['pdfs'].append({'source':str(source),'target':str(target.relative_to(ROOT)), 'sha256':digest(source),
            'bytes':source.stat().st_size,'pages':len(PdfReader(source).pages), 'previews':previews,'original_bytes_preserved':True})
        # Internal review sheet; source pages remain available at full render size.
        thumbs=[]
        for entry in previews:
            im=Image.open(ROOT/entry['target']).convert('RGB'); im.thumbnail((360,500))
            tile=Image.new('RGB',(390,540),'#ffffff');tile.paste(im,((390-im.width)//2,22));ImageDraw.Draw(tile).text((12,515),f'{prefix} / {entry["page"]}',fill='black');thumbs.append(tile)
        sheet=Image.new('RGB',(390*min(4,len(thumbs)),540*((len(thumbs)+3)//4)),'#eee8e0')
        for n,tile in enumerate(thumbs):sheet.paste(tile,((n%4)*390,(n//4)*540))
        sheet.save(SCRATCH/(prefix+'-review.jpg'),quality=92)

    # Read editable sources, rather than enlarging the low-resolution TIFFs.
    for name in ['Fig1.Technical_Specifications.pptx','Fig2.Development_Timeline.pptx','Fig23.Equipment_Cost.pptx']:
        p=SOURCE/'Hardware/图表'/name
        records['editable_figures'].append({'source':str(p),'sha256':digest(p)})
    with ZipFile(SOURCE/'Hardware/图表/Fig1.Technical_Specifications.pptx') as z:
        slide=E.fromstring(z.read('ppt/slides/slide1.xml'))
        tables=slide.findall('.//a:tbl',NS)
        assert tables
        records['specification_rows']=[[''.join(c.xpath('.//a:t/text()',namespaces=NS)) for c in row.findall('a:tc',NS)] for table in tables for row in table.findall('a:tr',NS)]

    with ZipFile(SOURCE/'Hardware/图表/Fig2.Development_Timeline.pptx') as z:
        slide=E.fromstring(z.read('ppt/slides/slide1.xml'))
        size=E.fromstring(z.read('ppt/presentation.xml')).find('p:sldSz',NS)
        scale=1/9525; width=int(size.get('cx'))*scale; height=int(size.get('cy'))*scale
        svg=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:g} {height:g}" role="img" aria-labelledby="title"><title id="title">ByeGerm instrument development timeline</title><rect width="100%" height="100%" fill="white"/>']
        def color(node, default):
            if node is None:return default
            if node.find('a:noFill',NS) is not None:return 'none'
            rgb=node.find('a:solidFill/a:srgbClr',NS)
            return '#'+rgb.get('val') if rgb is not None else default
        for sp in slide.findall('.//p:sp',NS):
            props=sp.find('p:spPr',NS); xf=props.find('a:xfrm',NS)
            if xf is None:continue
            off=xf.find('a:off',NS); ext=xf.find('a:ext',NS)
            x,y,w,h=[int(v)*scale for v in (off.get('x'),off.get('y'),ext.get('cx'),ext.get('cy'))]
            geom=props.find('a:prstGeom',NS); kind=geom.get('prst') if geom is not None else 'rect'
            fill=color(props,'none'); line=props.find('a:ln',NS); stroke=color(line,'none')
            if kind=='line':svg.append(f'<line x1="{x:g}" y1="{y:g}" x2="{x+w:g}" y2="{y+h:g}" stroke="{stroke}" stroke-width="1"/>')
            else:svg.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{6 if kind=="roundRect" else 0}" fill="{fill}" stroke="{stroke}"/>')
            texts=sp.xpath('.//a:t/text()',namespaces=NS)
            if not texts:continue
            rpr=sp.find('.//a:rPr',NS); font=float(rpr.get('sz','1400'))/100*96/72 if rpr is not None else 18
            weight='bold' if rpr is not None and rpr.get('b')=='1' else 'normal'
            ink=color(rpr,'#6f4e37'); paras=sp.findall('p:txBody/a:p',NS)
            lines=[]
            for p in paras:
                text=''.join(p.xpath('.//a:t/text()',namespaces=NS))
                lines.extend(textwrap.wrap(text,width=max(6,int((w-12)/(font*.48))),break_long_words=False) or [''])
            first_y=y+(h-len(lines)*font*1.12)/2+font*.9
            ppr=paras[0].find('a:pPr',NS) if paras else None
            centered=ppr is not None and ppr.get('algn')=='ctr'
            for n,text in enumerate(lines):svg.append(f'<text x="{x+w/2 if centered else x+6:g}" y="{first_y+n*font*1.12:g}" font-family="Times New Roman,serif" font-size="{font:g}" font-weight="{weight}" text-anchor="{"middle" if centered else "start"}" fill="{ink}">{escape(text)}</text>')
        svg.append('</svg>');(IMAGES/'development-timeline.svg').write_text('\n'.join(svg),encoding='utf-8')

    # Keep the editable chart's values and budget/price distinction.
    with ZipFile(SOURCE/'Hardware/图表/Fig23.Equipment_Cost.pptx') as z:
        chart=E.fromstring(z.read('ppt/charts/chart1.xml'))
        cns={'c':'http://schemas.openxmlformats.org/drawingml/2006/chart'}
        values=[float(v) for v in chart.xpath('//c:ser/c:val/c:numRef/c:numCache/c:pt/c:v/text()',namespaces=cns)]
        records['cost_chart_values_cny']=values
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.rcParams.update({'svg.fonttype':'none','font.family':'serif','font.size':12})
    fig,ax=plt.subplots(figsize=(10,5.7)); fig.patch.set_facecolor('white')
    bars=ax.bar(range(3),values,width=.48,color=['#b78453','#77513a','#a39485'])
    ax.set_ylim(0,180000);ax.set_ylabel('Cost (CNY)');ax.set_xticks(range(3),['ByeGerm 1.0\nPrototype production budget','ByeGerm 2.0\nPrototype production budget','qPCR (FQD-96C)\nReference procurement price per unit'])
    ax.set_yticks([0,40000,80000,120000,160000],['0','40,000','80,000','120,000','160,000']);ax.spines[['top','right']].set_visible(False)
    for bar,value in zip(bars,values):ax.annotate(f'CNY {value:,.2f}'.rstrip('0').rstrip('.'),(bar.get_x()+bar.get_width()/2,value),xytext=(0,8),textcoords='offset points',ha='center',color='#6f4e37')
    fig.tight_layout();fig.savefig(IMAGES/'cost-comparison.svg');plt.close(fig)
    chart_path=IMAGES/'cost-comparison.svg'
    chart_path.write_text('\n'.join(line.rstrip() for line in chart_path.read_text(encoding='utf-8').splitlines())+'\n',encoding='utf-8')
    records['video_duplicate']={'source':str(SOURCE/'Hardware/视频3 (2).mp4'),'same_bytes_as':'视频3.mp4', 'sha256':digest(SOURCE/'Hardware/视频3.mp4')}
    assert digest(SOURCE/'Hardware/视频3 (2).mp4')==records['video_duplicate']['sha256']
    manifest_path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Prepared original PDFs, all PDF page previews, document images and editable-source figures.')

else:
    sys.path.insert(0,str(SCRATCH/'tool-deps'))
    import imageio_ffmpeg
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    records=json.loads(manifest_path.read_text(encoding='utf-8'));records['videos']=[]
    for n,name in enumerate(['视频1.mp4','视频2.mp4','视频3.mp4'],1):
        source=SOURCE/'Hardware'/name
        result=subprocess.run([ffmpeg,'-hide_banner','-i',str(source)],capture_output=True,text=True,errors='replace')
        match=re.search(r'Duration: (\d+):(\d+):([\d.]+)',result.stderr)
        duration=int(match[1])*3600+int(match[2])*60+float(match[3])
        bitrate=min(2300,int(22*1024**2*8/duration/1000)-156)
        target=RESOURCES/f'video-{n}.mp4';poster=IMAGES/f'video-{n}-poster.jpg'
        subprocess.run([ffmpeg,'-y','-loglevel','error','-ss','1','-i',str(source),'-frames:v','1','-vf','scale=1280:-2',str(poster)],check=True)
        common=[ffmpeg,'-y','-loglevel','error','-i',str(source),'-map','0:v:0','-vf','scale=min(1280\\,iw):-2','-c:v','libx264','-preset','fast','-b:v',f'{bitrate}k','-pix_fmt','yuv420p','-threads','2','-passlogfile',str(SCRATCH/f'pass-{n}')]
        subprocess.run(common+['-pass','1','-an','-f','null','NUL'],check=True)
        subprocess.run(common+['-pass','2','-map','0:a?','-c:a','aac','-b:a','96k','-movflags','+faststart',str(target)],check=True)
        assert target.stat().st_size<25*1024**2
        check=subprocess.run([ffmpeg,'-hide_banner','-i',str(target)],capture_output=True,text=True,errors='replace')
        out_time=re.search(r'Duration: (\d+):(\d+):([\d.]+)',check.stderr)
        new_duration=int(out_time[1])*3600+int(out_time[2])*60+float(out_time[3])
        assert abs(duration-new_duration)<.15
        records['videos'].append({'source':str(source),'source_sha256':digest(source),'original_bytes':source.stat().st_size,
            'target':str(target.relative_to(ROOT)),'sha256':digest(target),'bytes':target.stat().st_size,'duration_seconds':duration,
            'web_duration_seconds':new_duration,'bitrate_kbps':bitrate,'poster':str(poster.relative_to(ROOT)),
            'transformation':'Complete video and audio; H.264/AAC, max 1280px width, faststart, below 25 MiB. No cuts.'})
        print(f'Video {n}: {duration:.2f}s, {target.stat().st_size/1024**2:.2f} MiB; full duration verified.',flush=True)
    manifest_path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
