"""Build generation-specific guides from supplied screens and archived app source.

Run from the 08-instrument worktree with the bundled Python runtime. Originals
and the earlier reference PDF are read-only; screenshot cropping is in memory.
"""

import hashlib
import json
from pathlib import Path

from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT / "assets/software"
OUTPUT = ROOT / "public/software-resources"
REPO = "https://gitlab.igem.org/2026/software/jlu-sph/sph-software"
SOURCE_COMMIT = "b06ba6ae99be8757e911f468d2fd0670d99b2e48"
HARDWARE = "../Instrument/hardware.html"
W, H = 595.2756, 841.8898
INK = HexColor("#483b32")
TEAL = HexColor("#166c66")
LINE = HexColor("#d9cdbc")
BODY = ParagraphStyle("body", fontName="Times-Roman", fontSize=11,
                      leading=14.5, textColor=INK)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=8.5, leading=11)
TITLE = ParagraphStyle("step", parent=BODY, fontName="Times-Bold",
                       fontSize=13, leading=16)


class Guide:
    def __init__(self, generation):
        self.generation = generation
        self.is_second = generation == "second"
        self.package = "com.chuangxin.socket" if self.is_second else "com.chuangxin.socket_test"
        filename = "fluorescent-detection.apk" if self.is_second else "first-generation-fluorescent-detection.apk"
        self.apk = f"{REPO}/-/raw/main/downloads/{filename}?inline=false"
        self.source = f"{REPO}/-/tree/{SOURCE_COMMIT}/{generation}-generation-app-source-code"
        self.path = OUTPUT / f"software-user-guide-{generation}-generation.pdf"
        self.c = canvas.Canvas(str(self.path), pagesize=(W, H), invariant=1)
        self.c.setTitle(f"JLU-SPH {generation.capitalize()} generation app manual")
        self.c.setAuthor("JLU-SPH iGEM 2026")
        self.c.setSubject("Installation, connection, monitoring, images and recovery; missing device information identified")

    def paragraph(self, text, x, top, width, style=BODY):
        p = Paragraph(text, style)
        _, height = p.wrap(width, H)
        bottom = top - height
        if bottom < 78:
            raise ValueError(f"Body text overlaps footer: {text[:60]}")
        p.drawOn(self.c, x, bottom)
        return bottom

    def step(self, number, title, text, x, top, width):
        self.c.setFillColor(TEAL)
        self.c.circle(x + 10, top - 10, 10, stroke=0, fill=1)
        self.c.setFillColor(white)
        self.c.setFont("Times-Bold", 11)
        self.c.drawCentredString(x + 10, top - 14, str(number))
        self.paragraph(title, x + 29, top, width - 29, TITLE)
        return self.paragraph(text, x + 29, top - 26, width - 29)

    def picture(self, relative, x, top, width, crop=None):
        with Image.open(BASE / relative) as original:
            im = original.crop(crop) if crop else original.copy()
        height = width * im.height / im.width
        self.c.drawImage(ImageReader(im), x, top - height, width=width, height=height)
        return top - height

    def header(self, subtitle, bookmark):
        self.c.setFillColor(TEAL)
        self.c.rect(0, H - 12, W, 12, stroke=0, fill=1)
        self.c.setFillColor(INK)
        self.c.setFont("Times-Bold", 25)
        self.c.drawString(42, 788, f"{self.generation.capitalize()} generation app manual")
        self.c.setFont("Times-Roman", 12)
        self.c.drawString(42, 764, subtitle)
        self.c.setStrokeColor(LINE)
        self.c.line(42, 748, 553, 748)
        self.c.bookmarkPage(bookmark)
        self.c.addOutlineEntry(subtitle, bookmark)

    def footer(self, page):
        self.c.setStrokeColor(LINE)
        self.c.line(42, 66, 553, 66)
        p = Paragraph("Sources: supplied Software Word materials, earlier illustrated guide, and "
                      "generation-matched Android source at b06ba6a. Prepared 6 October 2026.", SMALL)
        p.wrap(462, 40)
        p.drawOn(self.c, 42, 39)
        self.c.setFillColor(TEAL)
        self.c.setFont("Times-Roman", 8.5)
        for text, url, x, width in [
            ("App source", self.source, 42, 65),
            ("Hardware manual (to be added)", HARDWARE, 138, 161),
            ("Hardware video (to be added)", HARDWARE, 325, 158),
        ]:
            self.c.drawString(x, 23, text)
            self.c.linkURL(url, (x, 20, x + width, 33), relative=0)
        self.c.setFillColor(INK)
        self.c.drawRightString(553, 45, f"{page} / 2")

    def setup_page(self):
        self.header("Install, connect and prepare", "setup")
        self.paragraph("<b>Before starting:</b> use the matching app on Android 7.0 / API 24 or later, "
                       "with a compatible device server reachable from the phone. Have the device "
                       "network details and your team's approved assay instructions ready.", 42, 730, 511)
        self.step(1, "Install the matching app",
                  f'<link href="{self.apk}" color="#166c66">Download the {self.generation}-generation APK</link>. '
                  f"The supplied package is <b>{self.package}</b>, version 1.0. Follow Android's installation prompt. "
                  "Keep the app generation with your experiment record.", 42, 654, 243)
        self.step(2, "Connect to the device",
                  "Join a network that can reach the device server. Enter its IP address and TCP port, "
                  "select <b>Connect to Server</b>, and check the returned status. "
                  "<b>10.42.0.1:8080</b> is the recorded example; use your device's actual address.", 310, 654, 243)
        bottom = self.picture("images/connection-controls.jpg", 42, 516, 243)
        self.paragraph("Connection controls from a supplied screen. This is a shared interface reference; "
                       "the exact screenshot build has not been identified.", 42, bottom - 8, 243, SMALL)
        tabs = "Ded., Data and Setting" if not self.is_second else "Ded., Data, Servo and Setting"
        self.step(3, "Find the app screens",
                  f"Use <b>{tabs}</b> to move between supported screens. Ded. displays returned images "
                  "and tube labels; Data shows received curves and temperature. Setting contains "
                  "timing and device controls.", 310, 504, 243)
        self.step(4, "Set timing and device controls",
                  "In Setting, adjust the heating-time control or use <b>Manually enter the time</b>; "
                  "the +10s and -10s buttons adjust the app timer. <b>Heating countdown</b> controls that timer. "
                  "Use the temperature controls only according to the matching device and assay instructions. "
                  "Check returned temperature and status when monitoring the device.", 42, 345, 511)
        self.paragraph("<b>Device information to be added</b><br/>"
                       "Network name/password, confirmed app-device compatibility, the device start/shutdown "
                       "sequence, and assay-specific temperatures and durations are not supplied here. "
                       "A running app countdown alone does not confirm that the device has started.", 42, 211, 511)
        self.paragraph("The Hardware manual and operation video currently lead to the common Hardware page. "
                       "Their final sections and links will be added by the team.", 42, 120, 511, SMALL)
        self.footer(1)
        self.c.showPage()

    def first_results_page(self):
        self.header("Monitor, inspect and reconnect", "results")
        bottom = self.picture("images/curve-detail.jpg", 42, 721, 243)
        self.paragraph("Supplied data-view detail with TUBE1 and TUBE2. The original values and axes are retained; "
                       "screenshot build attribution is still to be confirmed.", 42, bottom - 8, 243, SMALL)
        self.step(5, "Monitor the returned data",
                  "Open Data and check temperature and the received curve updates. The first-generation source "
                  "plots two series, TUBE1 and TUBE2. The automatic-request control starts or stops repeated "
                  "image requests; curve and temperature updates depend on the connected server.", 310, 730, 243)
        self.step(6, "Request and inspect an image",
                  "Open Ded. and select <b>R-Image</b>. Inspect the returned image and the two tube-result fields. "
                  "Read result labels according to the approved assay instructions. Tap the image for "
                  "a larger view where that control is available.", 310, 566, 243)
        self.step(7, "Reconnect if updates stop",
                  "Check that the server is running, the phone can reach its network, and the IP and port "
                  "match the device. Select <b>Reconnect</b> after disconnection, then request an image again "
                  "and check the returned status. If the problem remains, record the app generation, "
                  "Android version, connection status and affected screen for the team.", 42, 416, 511)
        self.step(8, "Keep the acquired image",
                  "After an image arrives, check for the save confirmation and the Android gallery. "
                  "The client attempts to save the image when storage permission is available. "
                  "If saving fails, review the app's storage permission and request the image again. "
                  "Confirm that the file exists before leaving the session.", 42, 296, 511)
        self.paragraph("<b>Information to be added</b><br/>"
                       "An exact first-generation screenshot set, confirmed temperature-control labels for the "
                       "released APK, assay result thresholds, and a complete measurement-export/history "
                       "procedure have not been supplied. Hardware manual and video details remain to be added.",
                       42, 173, 511)
        self.footer(2)

    def second_results_page(self):
        self.header("Monitor, inspect and use device controls", "results")
        bottom = self.picture("originals/doc1-image8.jpeg", 42, 719, 205,
                              crop=(0, 80, 1600, 2560))
        self.paragraph("Supplied result screen with five tube labels. Only the phone's top status bar is cropped; "
                       "the historical message date is preserved.", 42, bottom - 8, 205, SMALL)
        self.step(5, "Monitor the returned data",
                  "In Data, check temperature and the received chart updates. The published second-generation "
                  "source supports five chart series, while supplied screenshots show two. Use the labels in "
                  "your installed build; the exact APK/screenshot match remains to be confirmed.", 277, 730, 276)
        self.step(6, "Inspect the five tube labels",
                  "Open Ded. and use <b>R-Image</b> for an image request. Read the five returned tube-label fields "
                  "together with that image. The automatic-request control starts or stops repeated image "
                  "requests. Interpret result colors using the matching assay instructions.", 277, 566, 276)
        self.step(7, "Use Servo with device instructions",
                  "The Servo screen provides <b>Reset Position</b>, <b>Position 1</b> and <b>Position 2</b>. "
                  "The physical positions and operating sequence have not been supplied; use these controls "
                  "only with the corresponding Hardware instructions.", 277, 407, 276)
        self.step(8, "Reconnect and keep the image",
                  "If updates stop, check the server, network, IP and port; select <b>Reconnect</b> after "
                  "disconnection and request an image again. Check the save confirmation and Android gallery "
                  "after receiving an image. If saving fails, review storage permission and confirm the file "
                  "exists before leaving the session.", 42, 254, 511)
        self.paragraph("<b>Information to be added:</b> exact released-build/chart correspondence, device "
                       "position meanings and temperature-control sequence, assay result thresholds, and a "
                       "complete measurement-export/history procedure. Final Hardware manual/video links "
                       "remain to be added.", 42, 140, 511, SMALL)
        self.footer(2)

    def build(self):
        self.setup_page()
        self.second_results_page() if self.is_second else self.first_results_page()
        self.c.save()
        pdf = PdfReader(self.path)
        assert len(pdf.pages) == 2
        assert all(len(page.extract_text()) > 800 for page in pdf.pages)
        return {"file": self.path.relative_to(ROOT).as_posix(), "pages": 2,
                "bytes": self.path.stat().st_size,
                "sha256": hashlib.sha256(self.path.read_bytes()).hexdigest(),
                "package": self.package, "apk": self.apk, "source": self.source,
                "hardware_placeholder": HARDWARE}


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    guides = [Guide(generation).build() for generation in ("first", "second")]
    manifest = {
        "prepared": "2026-10-06",
        "scope": "Two generation-specific app manuals and pending Hardware links only",
        "reference_pdf": "public/software-resources/software-user-guide.pdf",
        "source_commit": SOURCE_COMMIT,
        "guides": guides,
        "images": [{"file": f"assets/software/{name}",
                    "sha256": hashlib.sha256((BASE / name).read_bytes()).hexdigest()}
                   for name in ("images/connection-controls.jpg", "images/curve-detail.jpg",
                                "originals/doc1-image8.jpeg")],
        "gaps": ["Final Hardware manual/video sections and links", "Device network credentials and compatibility",
                 "Device start/shutdown sequence and approved assay parameters", "Exact screenshot/APK correspondence",
                 "Second-generation chart count differs between source and screenshots",
                 "First-generation released temperature-control labels", "Servo physical position meanings",
                 "Result thresholds and complete measurement-export/history instructions"],
        "validation_limit": "Document layout and Wiki resources only; no APK installation or device operation test",
    }
    (BASE / "review/generation-manuals.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(guides, ensure_ascii=False, indent=2))
