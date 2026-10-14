"""Render the local Markdown documentation and reconstruction gallery as HTML."""
from pathlib import Path
import re
from urllib.parse import urlsplit, unquote
from html import unescape
import xml.etree.ElementTree as ET

from PIL import Image

import markdown

ROOT = Path(__file__).resolve().parent
CSS = """
body{margin:0;background:#f4f6f8;color:#202d40;font:16px/1.65 system-ui,-apple-system,sans-serif}
main{max-width:1060px;margin:auto;padding:56px 42px;background:white}
h1{font-size:36px;line-height:1.18;max-width:850px;margin:0 0 26px}
h2{font-size:26px;line-height:1.3;margin-top:56px;border-top:1px solid #dce2e8;padding-top:30px}
h3{font-size:19px;margin-top:32px}p,li{max-width:900px}a{color:#365b93}
figure{margin:26px 0;border:1px solid #dce2e8;border-radius:8px;padding:12px;background:#fafbfd}
img{display:block;max-width:100%;height:auto;margin:auto}
td img{max-height:42px;width:auto}
figcaption{font-size:13px;color:#59687a;padding:12px 4px 0}
table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.5}
th,td{padding:12px;text-align:left;border:1px solid #dce2e8;vertical-align:top}th{background:#edf2f8}
code{font-size:13px;background:#edf2f8;padding:2px 5px}.meta{font-size:13px;color:#59687a;margin-bottom:22px}
@media(max-width:700px){main{padding:30px 18px}h1{font-size:28px}table{display:block;overflow:auto}}
@media print{main{padding:0}body{background:white}h2{break-after:avoid}figure{break-inside:avoid}a{color:inherit}}
"""


def dimensions(match):
    alt, src = match.groups()
    if src.startswith("https://"):
        return f'<img alt="{alt}" src="{src}" loading="lazy">'
    asset_path = unquote(urlsplit(unescape(src)).path)
    path = (ROOT.parents[1] / "central/public" / asset_path.lstrip("/")) if asset_path.startswith("/") else ROOT / asset_path
    assert path.exists(), path
    if path.suffix == ".svg":
        node = ET.parse(path).getroot()
        width, height = node.attrib["width"], node.attrib["height"]
    else:
        with Image.open(path) as image:
            width, height = image.size
    return f'<img alt="{alt}" src="{src}" width="{width}" height="{height}" loading="lazy">'


for source, target in [("README.md", "index.html"), ("reconstrucoes.md", "reconstrucoes.html")]:
    body = markdown.markdown((ROOT / source).read_text(), extensions=["tables", "toc"])
    body = re.sub(
        r'<p><img alt="([^"]*)" src="([^"]*)" /></p>',
        r'<figure><a href="\2" target="_blank"><img alt="\1" src="\2" /></a><figcaption>\1 · Click to open image</figcaption></figure>',
        body,
    )
    body = re.sub(r'<img alt="([^"]*)" src="([^"]*)" />', dimensions, body)
    html = (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Clara current flow analysis</title><style>' + CSS + '</style></head>'
        '<body><main><div class="meta">CLARA · PRODUCT FINANCE · OCT 13, 2026</div>'
        + body + '</main></body></html>'
    )
    (ROOT / target).write_text(html)
    print(f"Rendered {target}")
