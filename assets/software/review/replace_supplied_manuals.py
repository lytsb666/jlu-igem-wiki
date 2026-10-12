"""Publish supplied manuals unchanged and replace the intro workflow animation."""
from pathlib import Path
from hashlib import sha256
from pypdf import PdfReader
from PIL import Image
import json
import re
import shutil

root = Path(__file__).resolve().parents[3]
source_folder = Path('D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/msg/file/2026-10')
image_source = Path('D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/temp/RWTemp/2026-10/9970455b67d62b112185bf0bd2bccd2a/68e673a85dc00f6dc861715f0be056cc.jpg')
records = []
for source_name, target_name, generation in [
    ('1.0.pdf', 'software-user-guide-first-generation.pdf', 'first'),
    ('2.0.pdf', 'software-user-guide-second-generation.pdf', 'second')]:
    source = source_folder / source_name
    target = root / 'public/software-resources' / target_name
    shutil.copyfile(source, target)
    digest = sha256(source.read_bytes()).hexdigest()
    assert digest == sha256(target.read_bytes()).hexdigest()
    records.append({'generation': generation, 'source': str(source), 'target': str(target.relative_to(root)),
                    'pages': len(PdfReader(target).pages), 'bytes': target.stat().st_size, 'sha256': digest,
                    'original_bytes_preserved': True})
image_target = root / 'assets/software/images/device-phone-mascot.jpg'
shutil.copyfile(image_source, image_target)
width, height = Image.open(image_target).size
assert sha256(image_source.read_bytes()).digest() == sha256(image_target.read_bytes()).digest()

page = root / 'Instrument/software.html'
source = page.read_text(encoding='utf-8')
figure = f'''        <figure class="sw-floating-illustration" data-sw-float>
          <img src="../assets/software/images/device-phone-mascot.jpg" width="{width}" height="{height}" alt="ByeGerm mascot holding the detector and a phone" decoding="async" />
          <button class="sw-float-toggle" type="button" data-sw-float-pause aria-label="Pause floating illustration" aria-pressed="false" hidden>Pause</button>
        </figure>'''
source, count = re.subn(r'        <div class="sw-animation".*?\n        </div>(?=\n      </header>)', figure, source, count=1, flags=re.S)
assert count == 1 or 'class="sw-floating-illustration"' in source
source = source.replace('Both guides cover the available installation, connection, monitoring, image and recovery instructions, and identify information still to be supplied.', 'Both eight-page guides cover instrument preparation, app operation, monitoring, result recording, and troubleshooting.')
source = source.replace('<h3>First-generation app</h3><p>A two-page English PDF covers the first-generation connection, two-series data display, image requests, saving and reconnection workflow. Missing device details are marked in the guide.</p>', '<h3>ByeGerm 1.0 User Manual</h3><p>An eight-page illustrated manual covering preparation, sample handling, app setup, reaction monitoring, result recording, and troubleshooting.</p>')
source = source.replace('<h3>Second-generation app</h3><p>A two-page English PDF covers connection, monitoring, five tube labels, image saving and the Servo screen. Missing device details and the chart-version difference are marked in the guide.</p>', '<h3>ByeGerm 2.0 User Manual</h3><p>An eight-page illustrated manual for the second generation, including two loading areas, batch loading, rotation controls, image acquisition, and troubleshooting.</p>')
page.write_text(source, encoding='utf-8', newline='\n')

css_path = root / '样式/software.css'
css = css_path.read_text(encoding='utf-8')
floating_css = '''.software-page .sw-floating-illustration {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0;
  padding: 14px 0;
  justify-self: center;
}
.software-page .sw-floating-illustration img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 24px 42px -20px rgba(65, 48, 30, .4);
  animation: sw-float 6s ease-in-out infinite;
}
.software-page .sw-floating-illustration.is-paused img { animation-play-state: paused; }
.software-page .sw-float-toggle {
  position: absolute;
  right: 16px;
  bottom: 28px;
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 8px;
  background: #171a13;
  color: #fff;
  cursor: pointer;
  font: inherit;
}
'''
css = re.sub(r'\.software-page \.sw-animation \{.*?(?=\.software-page \.sw-shell \{)', floating_css, css, count=1, flags=re.S)
css = re.sub(r'@keyframes sw-(signal|parameter|trace|result) \{[^\n]+\}\n', '', css)
if '@keyframes sw-float' not in css:
    css = css.replace('@media (min-width: 901px)', '@keyframes sw-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }\n@media (min-width: 901px)', 1)
css = css.replace('.software-page .sw-animation { width: 100%; max-width: 620px; justify-self: center; }', '.software-page .sw-floating-illustration { max-width: 420px; }')
css = css.replace('  .software-page .sw-animation { padding: 18px 14px; }\n', '')
css = re.sub(r'@media \(prefers-reduced-motion: reduce\) \{.*?\n\}', '''@media (prefers-reduced-motion: reduce) {
  .software-page .sw-floating-illustration img { animation: none; transform: none; }
  .software-page .sw-float-toggle { display: none; }
}''', css, count=1, flags=re.S)
css = css.replace('.software-page .sw-animation-controls { display: none; }', '.software-page .sw-float-toggle { display: none; }')
css = re.sub(r'^.*\.sw-animation.*\n', '', css, flags=re.M)
print_block = css[css.index('@media print'):]
if '.sw-floating-illustration img { animation: none; transform: none; }' not in print_block:
    css = css.replace('  .software-page .sw-detail > div { display: block; }', '  .software-page .sw-detail > div { display: block; }\n  .software-page .sw-floating-illustration img { animation: none; transform: none; }')
css_path.write_text(css, encoding='utf-8', newline='\n')

manifest = {'date': '2026-10-08', 'manuals': records,
            'illustration': {'source': str(image_source), 'target': str(image_target.relative_to(root)),
                             'sha256': sha256(image_target.read_bytes()).hexdigest(), 'width': width, 'height': height,
                             'original_bytes_preserved': True, 'motion': 'CSS 6-second loop, 10px vertical travel; pause/reduced-motion supported'},
            'unchanged_scope': ['Model', 'Hardware', 'Judging', 'public styles and scripts', 'Navbar, Loading and Footer'],
            'manual_entry_urls_preserved': True, 'hardware_placeholders_preserved': True}
(root / 'assets/software/review/supplied-manuals-20261008.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print('Published both original 8-page manuals and the unchanged mascot image.')
