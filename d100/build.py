"""Builds the single-file app. Usage: python3 build.py [out.html]  (default dist/index.html)"""
import base64, json, pathlib, sys
here = pathlib.Path(__file__).parent
LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
ARABIC = "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC"
faces = [("IBM Plex Sans", "100 700", "ibm-plex-sans-latin-wght-normal.woff2", LATIN),
         ("IBM Plex Sans Arabic", "400", "ibm-plex-sans-arabic-arabic-400-normal.woff2", ARABIC),
         ("IBM Plex Sans Arabic", "500 700", "ibm-plex-sans-arabic-arabic-600-normal.woff2", ARABIC),
         ("IBM Plex Serif", "500 700", "ibm-plex-serif-latin-600-normal.woff2", LATIN),
         ("IBM Plex Mono", "400 600", "ibm-plex-mono-latin-500-normal.woff2", LATIN)]
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
css = "".join("@font-face{font-family:'%s';font-style:normal;font-weight:%s;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2');unicode-range:%s}\n"
              % (fam, w, b64(here / "assets/fonts" / f), rng) for fam, w, f, rng in faces)
logos = {p.stem: "data:image/webp;base64," + b64(p) for p in sorted((here / "assets/logos").glob("*.webp"))}
pre = "(()=>{\n'use strict';\nconst $=(s,r=document)=>r.querySelector(s);\nconst esc=s=>String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\n"
head = (here / "src/head.html").read_text(encoding="utf-8")
data = (here / "src/data.js").read_text(encoding="utf-8")
app = (here / "src/app.js").read_text(encoding="utf-8").replace("/*LOGOS*/{}", json.dumps(logos))
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here / "dist/index.html"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(head.replace("/*FONTS*/", css) + pre + data + app, encoding="utf-8")
print(out, round(out.stat().st_size / 1024), "KB")
