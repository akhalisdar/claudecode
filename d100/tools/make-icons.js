// Usage: node tools/make-icons.js
// Draws the favicon, apple-touch-icon and Open Graph image from the D100 stamp (the seal on the licence card), with the app's own fonts.
// Never from a bank logo. Output goes to assets/icons; build.py copies it into dist/. Run again only if the stamp changes.
const pw = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
(async () => {
  const tmp = path.resolve('tests/out/icons-src.html'); fs.mkdirSync(path.dirname(tmp), { recursive: true });
  execFileSync('python3', ['build.py', tmp]);
  const out = path.resolve('assets/icons'); fs.mkdirSync(out, { recursive: true });
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + tmp + '#/landing?lang=en'); await p.waitForSelector('#app .lic-s svg'); await p.evaluate(() => document.fonts.ready);
  const seal = await p.evaluate(() => document.querySelector('#app .lic-s svg').outerHTML);
  const fonts = await p.evaluate(() => [...document.styleSheets[0].cssRules].filter(r => r.type === 5).map(r => r.cssText).join('\n'));
  const page = (w, h, body, css) => `<!doctype html><meta charset="utf-8"><style>${fonts}
    html,body{margin:0}body{width:${w}px;height:${h}px;background:#F4F4F1;color:#111318;font-family:'IBM Plex Sans',sans-serif;overflow:hidden;position:relative}${css}</style>${body}`;
  const shoot = async (w, h, html, file) => { await p.setViewportSize({ width: w, height: h }); await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250); await p.screenshot({ path: path.join(out, file) }); };
  // square icon: the seal on paper
  await shoot(512, 512, page(512, 512, `<div class="s">${seal}</div>`, '.s{position:absolute;inset:34px}.s svg{width:100%;height:100%}'), 'icon-512.png');
  // Open Graph, 1200x630
  await shoot(1200, 630, page(1200, 630, `<div class="proto">Hackathon prototype. Sample data.</div><div class="wm">D100</div><h1>You got the licence.<br>Now what?</h1><p>A 100-day plan for new Dubai businesses.</p><div class="s">${seal}</div>`,
    `.proto{position:absolute;top:0;left:0;right:0;background:#111318;color:#D9DAE0;font-size:22px;text-align:center;padding:12px}
     .wm{position:absolute;left:80px;top:112px;font:600 44px/1 'IBM Plex Serif',serif}
     h1{position:absolute;left:80px;top:212px;margin:0;font:600 76px/1.08 'IBM Plex Serif',serif;letter-spacing:-.018em}
     p{position:absolute;left:80px;top:420px;margin:0;font-size:32px;color:#555A66}
     .s{position:absolute;right:70px;top:150px;width:380px;transform:rotate(-11deg)}.s svg{width:100%;height:auto}`), 'og.png');
  await b.close();
  // sizes with Pillow: apple-touch-icon 180, favicon.ico 16/32/48
  execFileSync('python3', ['-c', `
from PIL import Image
im=Image.open('assets/icons/icon-512.png').convert('RGB')
im.resize((180,180),Image.LANCZOS).save('assets/icons/apple-touch-icon.png',optimize=True)
Image.open('assets/icons/og.png').convert('RGB').save('assets/icons/og.png',optimize=True)
`]);
  // the small favicon is the stamp reduced to what survives at 16px: the double ring and a D
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#F4F4F1"/><circle cx="16" cy="16" r="13.5" fill="none" stroke="#2845A6" stroke-width="2.4"/><circle cx="16" cy="16" r="10.4" fill="none" stroke="#2845A6" stroke-width=".8"/><text x="16" y="20.5" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="12" fill="#2845A6">D</text></svg>`;
  fs.writeFileSync(path.join(out, 'favicon.svg'), svg + '\n');
  const b2 = await pw.chromium.launch(); const q = await b2.newPage({ viewport: { width: 96, height: 96 } });
  await q.setContent(`<body style="margin:0">${svg.replace('<svg ', '<svg width="96" height="96" ')}</body>`); await q.screenshot({ path: path.join(out, 'favicon-96.png') }); await b2.close();
  execFileSync('python3', ['-c', `
from PIL import Image
im=Image.open('assets/icons/favicon-96.png').convert('RGBA')
im.save('assets/icons/favicon.ico',sizes=[(16,16),(32,32),(48,48)])
import os; os.remove('assets/icons/favicon-96.png'); os.remove('assets/icons/icon-512.png')
`]);
  console.log(fs.readdirSync(out).map(f => f + ' ' + Math.round(fs.statSync(path.join(out, f)).size / 1024) + 'KB').join(', '));
})();
