"""Builds D100.

  python3 build.py                              -> dist/   static site for Cloudflare Pages (direct upload, no build command)
  python3 build.py offline/d100-offline.html    -> one file with everything inline, for a venue with no wifi

Sources: src/head.html (HTML shell), src/critical.css + src/app.css, src/data.js + src/app.js, assets/fonts, assets/logos, assets/icons.
The site build writes JS, CSS, fonts and logos as content-hashed files in dist/assets, puts critical.css inline, and writes the
clean-URL stubs, 404.html and _headers (with the hash of the inline style in the Content-Security-Policy).
"""
import base64, hashlib, json, pathlib, shutil, sys

here = pathlib.Path(__file__).parent
SITE = "https://d100.ae"
LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
ARABIC = "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC"
# family, weight range, file, unicode-range, preload on the first screen
FACES = [("IBM Plex Sans", "100 700", "ibm-plex-sans-latin-wght-normal.woff2", LATIN, True),
         ("IBM Plex Sans Arabic", "400", "ibm-plex-sans-arabic-arabic-400-normal.woff2", ARABIC, False),
         ("IBM Plex Sans Arabic", "500 700", "ibm-plex-sans-arabic-arabic-600-normal.woff2", ARABIC, False),
         ("IBM Plex Serif", "500 700", "ibm-plex-serif-latin-600-normal.woff2", LATIN, True),
         ("IBM Plex Mono", "400 600", "ibm-plex-mono-latin-500-normal.woff2", LATIN, True)]
# clean URL -> hash route, label for the fallback link
STUBS = [("plan", "#/roadmap", "Open the plan"), ("bank", "#/bank", "Open the bank step"), ("cash", "#/cash", "Open the cash view"),
         ("record", "#/stars", "Open the record"), ("providers", "#/market", "Open the providers"), ("plans", "#/tiers", "Open the plans"),
         ("day100", "#/day100", "Open day 100"), ("ar", "#/landing?lang=ar", "افتح D100 بالعربية")]
PRE = "(()=>{\n'use strict';\nconst $=(s,r=document)=>r.querySelector(s);\nconst esc=s=>String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\n"

read = lambda p: (here / p).read_text(encoding="utf-8")
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
digest = lambda data: hashlib.sha256(data).hexdigest()[:10]
logo_files = sorted((here / "assets/logos").glob("*.webp"))
ICON = "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F4F4F1'/%3E%3Ccircle cx='16' cy='16' r='13.5' fill='none' stroke='%232845A6' stroke-width='2.4'/%3E%3Ccircle cx='16' cy='16' r='10.4' fill='none' stroke='%232845A6' stroke-width='.8'/%3E%3Ctext x='16' y='20.5' text-anchor='middle' font-family='Georgia,serif' font-weight='700' font-size='12' fill='%232845A6'%3ED%3C/text%3E%3C/svg%3E"


def font_css(url_of):
    return "".join("@font-face{font-family:'%s';font-style:normal;font-weight:%s;font-display:swap;src:url(%s) format('woff2');unicode-range:%s}\n"
                   % (fam, w, url_of(f), rng) for fam, w, f, rng, _ in FACES)


def script(logos):
    return PRE + read("src/data.js") + read("src/app.js").replace("/*LOGOS*/{}", json.dumps(logos))


def single(out):
    """Everything in one file. Fonts and logos as base64, CSS and JS inline. No requests at all."""
    fonts = font_css(lambda f: "data:font/woff2;base64," + b64(here / "assets/fonts" / f))
    logos = {p.stem: "data:image/webp;base64," + b64(p) for p in logo_files}
    head = '<link rel="icon" href="data:image/svg+xml,%s">\n<style>\n%s%s%s</style>' % (ICON, fonts, read("src/critical.css"), read("src/app.css"))
    html = read("src/head.html").replace("<!--HEAD-->", head).replace("<!--SCRIPT-->", "<script>\n" + script(logos) + "</script>")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(out, round(out.stat().st_size / 1024), "KB (single file)")


def site(dist):
    if dist.exists():
        shutil.rmtree(dist)
    assets = dist / "assets"
    assets.mkdir(parents=True)

    def put(name, ext, data):
        """Write data as assets/<name>.<hash>.<ext> and return the file name."""
        fn = "%s.%s.%s" % (name, digest(data), ext)
        (assets / fn).write_bytes(data)
        return fn

    font_names = {f: put(f.replace("-normal.woff2", "").replace("ibm-", ""), "woff2", (here / "assets/fonts" / f).read_bytes()) for _, _, f, _, _ in FACES}
    logos = {p.stem: "assets/" + put("logo-" + p.stem, "webp", p.read_bytes()) for p in logo_files}
    js = put("app", "js", script(logos).encode("utf-8"))
    css = put("app", "css", read("src/app.css").encode("utf-8"))
    stub_css = put("stub", "css", b"body{margin:0;min-height:100vh;display:grid;place-content:center;gap:12px;padding:24px;text-align:center;background:#F4F4F1;color:#111318;font:400 17px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}\na{color:inherit;font-weight:600;text-underline-offset:3px;display:inline-block;padding:12px 4px}\nsmall{color:#555A66}\n")

    # the inline style: @font-face (pointing at the hashed files) + critical.css. Its hash goes into the CSP.
    inline = "\n" + font_css(lambda f: "assets/" + font_names[f]) + read("src/critical.css")
    style_hash = "sha256-" + base64.b64encode(hashlib.sha256(inline.encode("utf-8")).digest()).decode()
    head = "\n".join(
        ['<meta property="og:type" content="website">', '<meta property="og:url" content="%s/">' % SITE,
         '<meta property="og:image" content="%s/og.png">' % SITE, '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
         '<meta name="twitter:card" content="summary_large_image">',
         '<link rel="icon" href="/favicon.ico" sizes="32x32">', '<link rel="icon" href="/favicon.svg" type="image/svg+xml">', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">']
        # the script first and at high priority: nothing shows without it. Deferred scripts are low priority by default and would queue behind the fonts.
        + ['<script defer src="assets/%s" fetchpriority="high"></script>' % js]
        + ['<link rel="preload" href="assets/%s" as="font" type="font/woff2" crossorigin>' % font_names[f] for _, _, f, _, pre in FACES if pre]
        + ["<style>%s</style>" % inline])
    # app.css is not needed for the shell or the landing screen, so it sits at the end of <body>: it does not hold up the first paint,
    # and the deferred script still waits for it before it runs.
    (dist / "index.html").write_text(read("src/head.html").replace("<!--HEAD-->", head).replace("<!--SCRIPT-->", '<link rel="stylesheet" href="assets/%s">' % css), encoding="utf-8")

    # icons and the Open Graph image, made from the D100 stamp by tools/make-icons.js
    for f in ["favicon.ico", "favicon.svg", "apple-touch-icon.png", "og.png"]:
        shutil.copy(here / "assets/icons" / f, dist / f)

    # clean URLs without server rules: each is a real page that forwards to the hash route, with a plain link as fallback
    page = ('<!doctype html>\n<html lang="%s" dir="%s">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<meta name="robots" content="noindex">\n<title>%s</title>\n%s<link rel="icon" href="/favicon.ico" sizes="32x32">\n<link rel="stylesheet" href="/assets/%s">\n</head>\n'
            '<body>\n%s\n</body>\n</html>\n')
    for name, route, label in STUBS:
        ar = name == "ar"
        (dist / name).mkdir()
        (dist / name / "index.html").write_text(page % ("ar" if ar else "en", "rtl" if ar else "ltr", "D100", '<meta http-equiv="refresh" content="0; url=/%s">\n' % route, stub_css,
            '<a href="/%s">%s</a>\n<small>%s</small>' % (route, label, "نموذج تجريبي لهاكاثون. البيانات افتراضية." if ar else "Hackathon prototype. Sample data.")), encoding="utf-8")
    (dist / "404.html").write_text(page % ("en", "ltr", "D100: page not found", '<meta http-equiv="refresh" content="2; url=/">\n', stub_css,
        '<p>That page does not exist.</p>\n<a href="/">Back to D100</a>\n<small>Hackathon prototype. Sample data.</small>'), encoding="utf-8")

    csp = "; ".join(["default-src 'self'", "script-src 'self'", "style-src 'self' '%s'" % style_hash, "img-src 'self' data:", "font-src 'self'",
                     "connect-src 'none'", "object-src 'none'", "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'"])
    (dist / "_headers").write_text(
        "# Every response: no indexing, strict CSP (self only, data: for images, plus the hash of the one inline style), HTML never cached.\n"
        "/*\n  X-Robots-Tag: noindex\n  Content-Security-Policy: %s\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: no-cache\n\n"
        "# Hashed files never change: cache them for a year.\n"
        "/assets/*\n  ! Cache-Control\n  Cache-Control: public, max-age=31536000, immutable\n" % csp, encoding="utf-8")

    total = sum(f.stat().st_size for f in dist.rglob("*") if f.is_file())
    print(dist, "%d files, %d KB. index.html %d KB, %s %d KB, %s %d KB" % (
        sum(1 for f in dist.rglob("*") if f.is_file()), total // 1024, (dist / "index.html").stat().st_size // 1024,
        js, (assets / js).stat().st_size // 1024, css, (assets / css).stat().st_size // 1024))


if len(sys.argv) > 1:
    single(pathlib.Path(sys.argv[1]))
else:
    site(here / "dist")
