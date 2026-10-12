from pathlib import Path
from zipfile import ZipFile
import hashlib,json,subprocess,re
from html.parser import HTMLParser
root=Path.cwd(); review=root/"assets/software/review"
sources=[]
for language,filename in [("en","Software_Wiki_Page_English.docx"),("zh","Software_Wiki页面.docx")]:
    doc=Path("C:/Users/UserTech/Desktop")/filename
    manifest=json.loads((review/f"software-{language}.json").read_text(encoding="utf-8-sig"))
    with ZipFile(doc) as z:
        for media in manifest["media"]:
            assert hashlib.sha256(z.read(media["path"])).hexdigest()==media["sha256"], media["path"]
    sources.append({"language":language,"document":filename,"sha256":hashlib.sha256(doc.read_bytes()).hexdigest(),"embedded_images_verified":len(manifest["media"])})
old=subprocess.check_output(["git","show","8444af2:Instrument/software.html"],cwd=root).decode("utf-8")
new=(root/"Instrument/software.html").read_text(encoding="utf-8-sig")
protected={}
for name,pattern in [
 ("navbar",r'<nav class="navbar"[\s\S]*?</nav>'),
 ("loading_markup",r'<div id="igem-loader"[\s\S]*?</div>\s*</div>'),
 ("footer",r'<footer class="site-footer"[\s\S]*?</footer>'),
 ("loading_fallback",r'<script data-loading-fallback>[\s\S]*?</script>'),
 ("cover_markup",r'<section class="image-page-hero"[\s\S]*?</section>')]:
    before=re.search(pattern,old).group(0).replace("\r\n","\n")
    after=re.search(pattern,new).group(0).replace("\r\n","\n")
    assert before==after, name
    protected[name]=hashlib.sha256(after.encode()).hexdigest()
assert '../样式/main.js' in new
assert 'Write your project background here.' not in new
assert all(new.count('id="'+s+'"')==1 for s in ["software-overview","software-architecture","software-validation","software-reusability","software-user-guide","software-open-source"])
assert not re.search(r'\b(MESA|Streamlit|FastAPI)\b',new)
changed=subprocess.check_output(["git","-c","core.quotepath=false","diff","8444af2","--name-only"],cwd=root).decode().splitlines()
assert all(p == "Instrument/software.html" or p in {"样式/software.css", "样式/software.js"} or p.startswith("assets/software/") or p.startswith("public/software-resources/") for p in changed),changed
pdf_path="public/software-resources/software-user-guide.pdf"
pdf_bytes=(root/pdf_path).read_bytes()
assert subprocess.check_output(["git","cat-file","blob",":"+pdf_path],cwd=root)==pdf_bytes, "Staged PDF bytes changed"
attrs=subprocess.check_output(["git","check-attr","text","diff","--",pdf_path],cwd=root).decode()
assert "text: unset" in attrs and "diff: unset" in attrs, attrs
class Parser(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.fragments=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if "id" in d:self.ids.append(d["id"])
        if tag=="a" and d.get("href","").startswith("#"):self.fragments.append(d["href"][1:])
parser=Parser();parser.feed(new)
assert len(parser.ids)==len(set(parser.ids))
assert all(x in parser.ids for x in parser.fragments)
result={"sources":sources,"protected_blocks_unchanged":protected,"anchors_valid":True,"reference_only_team_stack_excluded":True,"new_sections":6,"pdf_git_bytes_preserved":True,"source_commit":"b06ba6ae99be8757e911f468d2fd0670d99b2e48"}
(review/"source-verification.json").write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding="utf-8")
print("Both DOCX media sets verified; Navbar/Loading/Footer/cover/fallback unchanged; section IDs and anchors valid.")
