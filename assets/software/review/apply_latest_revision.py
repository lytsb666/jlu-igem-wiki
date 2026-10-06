"""Apply the latest supplied Software revision without altering shared files."""
from pathlib import Path
from hashlib import sha256
from PIL import Image
from lxml import html
import json
import re

root = Path(__file__).resolve().parents[3]
page = root / 'Instrument/software.html'
source = page.read_text(encoding='utf-8')
crop_records = []
for number, name in ((2, 'reaction-display'), (8, 'result-display'), (6, 'acquisition-a'), (7, 'acquisition-b')):
    original = root / f'assets/software/originals/doc1-image{number}.jpeg'
    target = root / f'assets/software/images/{name}.jpg'
    image = Image.open(original)
    box = (0, 80, image.width, image.height)
    image.crop(box).save(target, quality=95, subsampling=0)
    source = source.replace(f'../assets/software/originals/doc1-image{number}.jpeg', f'../assets/software/images/{name}.jpg')
    # The four app captures share their original dimensions.
    source = source.replace('width="1600" height="2560"', 'width="1600" height="2480"')
    crop_records.append({'source': str(original.relative_to(root)), 'source_sha256': sha256(original.read_bytes()).hexdigest(),
                         'target': str(target.relative_to(root)), 'box': box,
                         'sha256': sha256(target.read_bytes()).hexdigest()})
diagram = root / 'assets/software/images/app-operation-flow.png'
diagram_box = (150, 195, 1115, 907)  # Remove only the PDF page's empty margins.
diagram_render = root / '.sites-work/software-review-20261006/app-diagram-1.png'
if diagram_render.exists():
    Image.open(diagram_render).crop(diagram_box).save(diagram)
else:
    # The prepared crop is tracked so another checkout can reapply the HTML.
    assert diagram.exists() and Image.open(diagram).size == (965, 712)
source = source.replace('width="1273" height="1800"', 'width="965" height="712"')

source = re.sub(r'\s*<(p|div) class="sw-note">.*?</\1>', '', source, flags=re.S)
source = source.replace('<p>These supplied records show the app connection and display workflow. They document visible interface behavior; they do not establish thermal accuracy, model accuracy, analytical sensitivity, or clinical performance.</p>', '')
source = source.replace('The recorded connection screen uses <code>10.42.0.1</code> and TCP port <code>8080</code>, and shows “Service connected”. Use the address and port of the actual device configuration.', 'The connection screen uses the AI Box address <code>10.42.0.1</code> and port <code>8080</code>. After the connection is established, the app displays the service status and can enter the data-acquisition workflow.')
source = source.replace('Two supplied screens show temperature readings of <strong>43.1 °C</strong> and <strong>43.0 °C</strong> with TUBE1 and TUBE2 traces. The plots retain their original values and axes. These readings are observations on the interface, not a temperature-calibration test.', 'The data screen displays the current temperature and updates two fluorescence curves over elapsed time. The two recorded screens show temperatures of <strong>43.1 °C</strong> and <strong>43.0 °C</strong>. TUBE1 and TUBE2 values update during acquisition.')
source = source.replace('The supplied result screen labels Tube2 as <code>tube_green</code>, Tube3 as <code>tube_blue</code>, and Tube4 as <code>tube_red</code>; Tube1 and Tube5 are <code>tube_null</code>. It also shows 43.0 °C. The five labels remain separate from the two-series plotting interface.', 'The result screen receives an image from the AI Box and displays five tube labels. In the example shown, Tube2 is labelled <code>tube_green</code>, Tube3 <code>tube_blue</code>, Tube4 <code>tube_red</code>, and Tube1 and Tube5 <code>tube_null</code>. The screen also shows a temperature of 43.0 °C.')
source = source.replace(' Select an image to inspect it at full size.', '')
source = source.replace(' The archived timestamp remains visible in the original screenshot.', '')
architecture = '''
            <figure class="sw-figure sw-app-diagram"><a data-sw-fullimage href="../assets/software/images/app-operation-flow.png"><img src="../assets/software/images/app-operation-flow.png" width="965" height="712" alt="Supplied APP operation diagram linking device connection, controls, temperature and fluorescence display, image acquisition and results" loading="lazy" decoding="async"/></a><figcaption>APP operation flow.</figcaption></figure>
            <p>The mobile app and AI Box communicate over a local Wi-Fi network. The connection screen shown uses 10.42.0.1 and port 8080. The Android app acts as a TCP client and sends UTF-8 JSON control commands. Each message contains an eight-byte header followed by its payload. Two big-endian 32-bit integers in the header specify the payload length and message type, where 0 denotes text and 1 denotes an image.</p>
            <h3>Mobile app</h3>
            <p>Written in Java, the app handles connection, countdown timing, temperature and servo commands, and image and curve display. NetworkService processes TCP messages, while MainActivity manages interaction and display. Other teams may adapt the communication parser and MPAndroidChart plotting logic by changing the device protocol and interface bindings.</p>
            <h3>AI Box</h3>
            <p>The device integrates temperature control, optical acquisition, mechanical control, and image analysis. It receives commands from the app and returns status data, images, and results.</p>
            <h3>Wireless communication</h3>
            <p>Both app generations use <code>get_image</code>, <code>get_tem</code>, and <code>set_tem</code>. The second generation also supports <code>set_tem43</code>, <code>set_tem90</code>, and <code>set_servo</code>. Text responses contain <code>type</code>, <code>content</code>, and an optional <code>timestamp</code>; the app displays the returned temperature, fluorescence values, images, and tube labels.</p>
            <h3>Image analysis and results</h3>
            <p>The AI Box processes fluorescence images, and the app displays the returned image and tube labels. The second-generation app maps codes <code>0</code>, <code>1</code>, <code>2</code>, and <code>3</code> to green, red, blue, and empty labels. Their biological interpretation follows the assay.</p>
'''
source = re.sub(r'(<section class="sw-section" id="software-architecture"[^>]*>\s*<div class="sw-section-heading">.*?</div>).*?(\s*</section>)', lambda m: m[1] + architecture + m[2], source, count=1, flags=re.S)
source = source.replace('<p>The display region has been cropped from a supplied video-player screenshot. Its original frame is preserved.</p><a data-sw-connection-original href="../assets/software/originals/doc1-image5.jpeg" target="_blank" rel="noopener">View original frame</a>', '')
source = source.replace('<a data-sw-fullimage href="../assets/software/images/connection.jpg">', '')
source = re.sub(r'(<img src="../assets/software/images/connection.jpg"[^>]+/>)</a>', r'\1', source)
source = source.replace('Figure 1. Connection record from the English Word source; crop only.', 'Figure 1. Device connection screen.')
reuse = '''
            <p>We integrated device control, reaction parameters, and detection status into the mobile interface. Users can connect the device, configure parameters, monitor the reaction, and view results without switching between separate programs.</p>
            <p>The operating screen groups the heating time, temperature-control switches, and image requests. Connection status, temperature, and two-channel fluorescence curves update with data returned by the device. Other teams may reuse the communication parser, curve display, and result-display modules by adapting the commands and field mappings to their device protocol.</p>
'''
source = re.sub(r'(<section class="sw-section" id="software-reusability"[^>]*>\s*<div class="sw-section-heading">.*?</div>).*?(<details class="sw-detail">)', lambda m: m[1] + reuse + '            ' + m[2], source, count=1, flags=re.S)
source = re.sub(r'\s*<p class="sw-source-line">Source documentation checked.*?</p>', '', source, flags=re.S)
if 'class="sw-toc page-toc"' not in source:
    source = source.replace('class="sw-toc"', 'class="sw-toc page-toc"')
# Place the left-hand TOC before the article in keyboard and document order.
aside = re.search(r'        <aside class="sw-toc page-toc".*?</aside>', source, re.S)
if aside and source.index(aside[0]) > source.index('<article class="sw-article">'):
    source = source.replace(aside[0], '')
    source = source.replace('      <div class="sw-shell">', '      <div class="sw-shell">\n' + aside[0])
source = source.replace('            \n', '\n')
page.write_text(source, encoding='utf-8', newline='\n')
manifest = {'priority_document': 'software最新修改.docx',
            'priority_document_sha256': '0ab391130a4cc331851b6a38a2e1231e4dfaf303da46b7e4df41ccfe691f77d6',
            'architecture_reuse_text_source': 'Software_Wiki_Page_English(1).docx',
            'architecture_reuse_text_source_sha256': '51495d085cc61aab1db538e1fe4e8d2c09893a83314b7830a2cef3f7b6ec0b39',
            'crops': crop_records,
            'diagram_source': '手机APP2.pdf', 'diagram_empty_margin_crop': diagram_box, 'diagram_sha256': sha256(diagram.read_bytes()).hexdigest(),
            'preserved': ['Six chapters and existing section fragments', 'Original screenshots, numerical values, plot axes and in-app result timestamp', 'Both generation manuals and APK links', 'Hardware manual/video placeholders'],
            'changes': ['Left scroll TOC', 'Data-flow arrows', 'Remove three green notes', 'Remove requested final caption sentences', 'Use supplied APP operation diagram and original prose', 'Connection screenshot has no clickable player/original link', 'Remove footer audit date/commit sentence']}
(root / 'assets/software/review/latest-revision-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
parsed = html.fromstring(source)
assert len(parsed.xpath('//*[@class="sw-section"]')) == 6
assert not parsed.xpath('//*[@class="sw-note"]')
assert not parsed.xpath('//figure[contains(@class,"sw-connection-figure")]//a')
print('Software latest document changes applied; 6 chapters preserved.')
