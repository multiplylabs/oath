"""Pack the site into one self-contained HTML file, for sending to someone without the repo.

CSS and JS are inlined and every image and video is embedded as a data URI, so the output opens
with a double-click and needs no server (the Lato font still loads from Google Fonts when online).

    python3 tools/bundle.py                 # writes oath-website.html in the repo root
    python3 tools/bundle.py -o ~/Desktop/oath.html
"""

import argparse
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIME = {".mp4": "video/mp4", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}


def data_uri(rel: str) -> str:
    path = ROOT / rel
    return f"data:{MIME[path.suffix.lower()]};base64," + base64.b64encode(path.read_bytes()).decode()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("-o", "--output", type=Path, default=ROOT / "oath-website.html")
    args = parser.parse_args()

    html = (ROOT / "index.html").read_text()
    html = html.replace(
        '<link rel="stylesheet" href="assets/css/site.css">',
        "<style>\n" + (ROOT / "assets/css/site.css").read_text() + "</style>",
    )
    html = html.replace('<script src="assets/js/site.js" defer></script>', "")
    html = html.replace("</body>", "<script>\n" + (ROOT / "assets/js/site.js").read_text() + "</script>\n</body>")
    html = re.sub(r'(src|poster)="(assets/[^"]+)"', lambda m: f'{m.group(1)}="{data_uri(m.group(2))}"', html)
    # A relative social-preview image means nothing outside the published site.
    html = re.sub(r'<meta property="og:image" content="assets/[^"]+">\n?', "", html)

    left = re.findall(r'"assets/[^"]+"', html)
    if left:
        raise SystemExit(f"Unbundled asset references remain: {left}")
    args.output.write_text(html)
    print(f"Wrote {args.output} ({args.output.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
