from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader
from PIL import Image

ROOT=Path.cwd()
BASE=ROOT/"assets/software"
OUT=ROOT/"public/software-resources/software-user-guide.pdf"
INK=HexColor("#6f4e37"); TEAL=HexColor("#166c66"); PAPER=HexColor("#fbf7f0"); LINE=HexColor("#d9cdbc")
PAGE_W,PAGE_H=595.2756,841.8898
c=canvas.Canvas(str(OUT),pagesize=(PAGE_W,PAGE_H))
c.setTitle("JLU-SPH Software - Illustrated User Guide")
c.setAuthor("JLU-SPH iGEM 2026")
c.setSubject("Second-generation Android client; supplied screenshots and documented workflow")
style=ParagraphStyle("body",fontName="Times-Roman",fontSize=11,leading=14,textColor=INK)
small=ParagraphStyle("small",parent=style,fontSize=8.5,leading=11)
repo="https://gitlab.igem.org/2026/software/jlu-sph/sph-software"
def paragraph(text,x,top,width,chosen=style):
    p=Paragraph(text,chosen); _,height=p.wrap(width,800)
    p.drawOn(c,x,top-height); return top-height
def box(x,top,w,h):
    c.setFillColor(PAPER);c.setStrokeColor(LINE);c.roundRect(x,top-h,w,h,8,stroke=1,fill=1)
def step(n,title,text,x,top,width):
    c.setFillColor(TEAL);c.circle(x+10,top-10,10,stroke=0,fill=1)
    c.setFillColor(white);c.setFont("Times-Bold",11);c.drawCentredString(x+10,top-14,str(n))
    c.setFillColor(INK);c.setFont("Times-Bold",13);c.drawString(x+29,top-14,title)
    return paragraph(text,x+29,top-27,width-29)
def picture(path,x,top,w):
    im=Image.open(path);h=w*im.height/im.width
    c.drawImage(ImageReader(im),x,top-h,width=w,height=h)
    return top-h
def header(title,subtitle):
    c.setFillColor(TEAL);c.rect(0,PAGE_H-12,PAGE_W,12,fill=1,stroke=0)
    c.setFillColor(INK);c.setFont("Times-Bold",27);c.drawString(40,793,title)
    c.setFont("Times-Roman",12);c.drawString(40,771,subtitle)
    c.setStrokeColor(LINE);c.line(40,754,555,754)
def footer(page):
    c.setStrokeColor(LINE);c.line(40,65,555,65)
    paragraph("Sources: supplied Software Word briefs; repository README and docs/PROTOCOL.md.",40,54,450,small)
    c.setFillColor(TEAL);c.setFont("Times-Roman",8.5);c.drawString(40,29,"JLU-SPH | 3 October 2026 | Read source documentation")
    c.linkURL(repo,(40,25,375,40),relative=0)
    c.setFillColor(INK);c.drawRightString(555,29,f"{page} / 2")

# A readable detail from the real connection screen; full original is retained.
original=Image.open(BASE/"originals/doc1-image5.jpeg")
original.crop((0,455,1260,1160)).save(BASE/"images/connection-controls.jpg",quality=95)
header("Connect and monitor","Second-generation Android app - illustrated quick start")
c.bookmarkPage("connect");c.addOutlineEntry("Connect and monitor","connect")
box(40,738,515,51)
paragraph("<b>Before starting:</b> Android 7.0 / API 24 or later, the matching app, and a running AI Box server reachable from the phone. Live control and acquisition require that server.",52,728,490)
step(1,"Install the matching APK","Download the second-generation APK from the repository. Version 1.0; package <b>com.chuangxin.socket</b>. Follow Android's prompt for the chosen download source.",40,670,245)
step(2,"Connect to the AI Box","Join a network that can reach the server. Enter its actual IP address and TCP port, then select <b>CONNECT TO SERVER</b>. The recorded setup is <b>10.42.0.1:8080</b>.",310,670,245)
bottom=picture(BASE/"images/connection-controls.jpg",40,554,245)
paragraph("Connection controls: a detail crop of the supplied player frame. Full frame retained on the Software page.",40,bottom-8,245,small)
step(3,"Review the app controls","Use the result view for images and tube labels, DATA for curves, and the supported settings and servo controls for this device generation.",310,554,245)
step(4,"Configure and start","Set heating time and the temperature controls supported by the connected device and assay. Start the configured operation and confirm the returned status; no universal assay settings are specified here.",310,461,245)
bottom=picture(BASE/"images/curve-detail.jpg",40,347,275)
paragraph("Real data-view detail: temperature, acquisition control, TUBE1 and TUBE2. Original axes and values are retained.",40,bottom-8,275,small)
step(5,"Monitor the reaction","Watch the countdown and returned temperature. In DATA, start automatic requests as needed and inspect the two received curve series. Stop automatic requests using the displayed control.",337,347,218)
paragraph("<b>Two curves, five labels.</b><br/>The two chart series come from data1 and data2. Five tube labels are a separate result message.",337,220,218)
footer(1);c.showPage()

header("Inspect results and recover","Device-side analysis, displayed in the Android client")
c.bookmarkPage("results");c.addOutlineEntry("Inspect results and recover","results")
box(40,738,515,46)
paragraph("The AI Box processes images; the app displays returned images and labels. Interpret colors with the assay design and server implementation.",52,727,490)
step(6,"Request an image","Use the image request control (<b>R-IMAGE</b> on the supplied result screen). Check the returned image and update status.",40,674,263)
step(7,"Read the tube labels","The second-generation client displays five labels. They do not add three more fluorescence curves.",325,674,230)
bottom=picture(BASE/"originals/doc1-image8.jpeg",40,597,255)
paragraph("Supplied result screen. Its archived 2025 timestamp is retained; this is not a new 2026 experiment.",40,bottom-8,255,small)
photo_bottom=picture(BASE/"originals/doc2-image3.jpeg",325,597,230)
paragraph("Five-tube fluorescence photo with original ROI annotations. Percentages shown are not validated model accuracy.",325,photo_bottom-8,230,small)
box(325,415,230,106)
paragraph("<b>Code to display-label mapping</b><br/>0 = tube_green<br/>1 = tube_red<br/>2 = tube_blue<br/>3 = tube_null",337,402,205)
step(8,"Inspect and save","Use the app's image viewing and saving functions to retain the acquired image. Keep app generation and acquisition context with the record.",325,289,230)
step(9,"If data stops updating","Check the server, network, IP and port. Reconnect and request an update. Empty or unchanged plots alone do not establish a negative assay result.",325,192,230)
paragraph("<b>Verification scope.</b> This guide follows supplied screenshots and source documentation. APKs were not rebuilt or installed for this Wiki task. Device server, firmware, model weights and raw measurement data are not included in the Android repository.",40,105,515,small)
footer(2);c.save()
reader=PdfReader(OUT)
assert len(reader.pages)==2
for p in reader.pages:
    assert len(p.extract_text())>100
print(f"Created {OUT.name}; two pages, selectable English text and source link.")
