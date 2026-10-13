"""Export the reviewed preview as a standalone, browser-local website."""
from pathlib import Path
import importlib.util
import re

folder = Path(__file__).resolve().parent
fragment_path = folder / 'team-concept-v1.html'
renderer_path = Path('C:/Users/UserTech/.codex/plugins/cache/openai-bundled/visualize/1.0.37/skills/visualize/scripts/render.py')
spec = importlib.util.spec_from_file_location('team_preview_renderer', renderer_path)
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)
fragment = renderer._read_fragment(fragment_path)
# Keep the reviewed fragment intact. Host-provided Tweak is optional and guarded;
# this browser-local version contains no window.openai dependency.
assert not re.search(r'\b(?:window|globalThis)\.openai\b', fragment)
site = folder / 'site'
site.mkdir(exist_ok=True)
head = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="JLU-SPH Team design preview: group photograph, scrolling members and personal profiles.">
  <title>Team | JLU-SPH · Design Preview</title>
  <style>
    html, body { margin:0; padding:0; height:100%; background:#e0c1a6; }
    html body #jlu-team-concept-v1 .jlu-scroll { height:100dvh; }
  </style>
</head>
<body>
'''
(site / 'index.html').write_text(head + fragment + '\n</body>\n</html>\n', encoding='utf-8')
print('Standalone preview exported; no production Member or hosting configuration changes.')
