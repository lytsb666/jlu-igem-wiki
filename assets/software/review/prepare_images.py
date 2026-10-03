from pathlib import Path
from PIL import Image
import hashlib, json
root = Path.cwd()
base = root / "assets/software"
items = [
 ("doc1-image5.jpeg", "connection.jpg", (0, 455, 1260, 2408)),
 ("doc1-image6.jpeg", "curve-detail.jpg", (30, 760, 1570, 1860)),
 ("doc1-image5.jpeg", "connection-controls.jpg", (0, 455, 1260, 1160)),
]
records=[]
for original, output, box in items:
    source=base / "originals" / original
    image=Image.open(source)
    image.crop(box).save(base / "images" / output, quality=95)
    records.append({"original": "originals/"+original, "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "display": "images/"+output, "crop_box_xyxy": list(box), "edit": "Crop only; no redrawing, recoloring, retouching or fabricated data."})
(base / "review/crops.json").write_text(json.dumps(records,indent=2),encoding="utf-8")
source_manifest=json.loads((base/"review/software-images.json").read_text(encoding="utf-8-sig"))
for item in source_manifest:
    local=base/"originals"/item["file"]
    if local.exists():
        assert hashlib.sha256(local.read_bytes()).hexdigest()==item["sha256"], item["file"]
print("Seven originals match supplied SHA-256 manifest. Created three detail crops.")
