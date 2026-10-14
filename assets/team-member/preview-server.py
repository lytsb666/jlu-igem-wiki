"""Local preview of the real Vite build; root opens Team without editing Homepage."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

repo = Path(__file__).resolve().parents[2]
assert repo.name == '02-team', 'Run only in the assigned Team worktree'
build = (repo / 'dist/client').resolve()
assert build.is_relative_to(repo) and (build / 'Team/member.html').is_file(), 'Build the site first'

class TeamPreview(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(build), **kwargs)

    def do_GET(self):
        if self.path.split('?')[0] == '/':
            self.send_response(302)
            self.send_header('Location', '/Team/member.html')
            self.end_headers()
        else:
            super().do_GET()

    def log_message(self, format, *args):
        if len(args) > 1 and str(args[1]) not in ['200', '302', '304']:
            super().log_message(format, *args)

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=5202)
args = parser.parse_args()
print(f'Team build preview: http://127.0.0.1:{args.port}/Team/member.html', flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), TeamPreview).serve_forever()
