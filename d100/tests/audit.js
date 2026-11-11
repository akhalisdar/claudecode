// Usage: node tests/audit.js [dist/index.html] [--device="iPhone 13"] [--lang=ar] [--only=plan] [--shots] [--no-journey]
// Walks every route and state on every device in both languages, runs the judge journey,
// writes tests/out/audit.json and prints a summary. Exits 1 if anything is found that is not in tests/audit-allow.json.
const pw = require('playwright');
const fs = require('fs');
const path = require('path');
const { serveFile } = require('./serve');

const args = process.argv.slice(2);
const flag = n => { const a = args.find(x => x.startsWith('--' + n)); return a ? (a.includes('=') ? a.split('=').slice(1).join('=') : true) : null; };
const target = args.find(a => !a.startsWith('--')) || 'dist/index.html';
const OUT = path.resolve('tests/out/audit'); fs.mkdirSync(OUT, { recursive: true });

const DEVICES = [
  { id: 'iphone-se', label: 'iPhone SE', engine: 'webkit', ctx: pw.devices['iPhone SE'] },
  { id: 'iphone-13', label: 'iPhone 13', engine: 'webkit', ctx: pw.devices['iPhone 13'] },
  { id: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max', engine: 'webkit', ctx: pw.devices['iPhone 15 Pro Max'] },
  { id: 'pixel-7', label: 'Pixel 7', engine: 'chromium', ctx: pw.devices['Pixel 7'] },
  { id: 'desktop', label: 'Desktop 1440x900', engine: 'chromium', ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, wide: true },
];
const LANGS = ['en', 'ar'];

/* ---------- every route and state ---------- */
const click = sel => async p => { await p.click(sel); await p.waitForTimeout(120); };
const toShop = async p => { await p.click('[data-act="ob:activity:shop"]'); await p.fill('#biz', 'Noor Atelier Trading House'); await p.click('[data-act="build"]'); await p.waitForFunction(() => location.hash.includes('roadmap'), null, { timeout: 6000 }); await p.waitForTimeout(150); };
const SCREENS = [
  ['landing', 'landing'],
  ['start', 'start'],
  ['start-filled', 'start', async p => { await p.click('[data-act="ob:activity:shop"]'); await p.fill('#biz', 'Noor Atelier Trading House'); }],
  ['building', 'building'],
  ['plan-day37', 'roadmap'],
  ['plan-day1', 'roadmap?s=new'],
  ['plan-skipped', 'roadmap?s=skip'],
  ['plan-done-open', 'roadmap', click('details.donelist summary')],
  ...Array.from({ length: 15 }, (_, i) => ['step-s' + (i + 1), 'step/s' + (i + 1)]),
  ['step-s3-day1', 'step/s3?s=new'],
  ['step-s4-locked-day1', 'step/s4?s=new'],
  ['step-s7-skipped', 'step/s7?s=skip'],
  ['step-s7-skip-warning', 'step/s7?s=warn'],
  ['step-s12-skip-warning', 'step/s12', click('#app .skip')],
  ['step-s7-provider-picked', 'step/s7', click('#app button.opt >> nth=0')],
  ['step-s7-own-provider', 'step/s7', async p => { await p.click('#app button.opt >> nth=3'); await p.waitForTimeout(150); await p.fill('#own', 'Al Noor Payroll Services'); await p.waitForTimeout(100); }],
  ['step-s12-link-opened', 'step/s12', async p => { await p.click('#app a.btn[target=_blank]'); await p.waitForTimeout(900); }],
  ['step-s7-stamp', 'step/s7?s=slam'],
  ['step-s8-toast', 'step/s8', async p => { await p.click('#app [data-act^="done:"]'); await p.waitForFunction(() => !!document.querySelector('#app .toast'), null, { timeout: 5000 }).catch(() => {}); await p.waitForTimeout(150); }],
  ['bank-done', 'bank'],
  ['bank-day1', 'bank?s=new'],
  ['bank-picked', 'bank?s=new', click('#app .bk >> nth=4')],
  ['bank-skip-warning', 'bank?s=new', click('#app .skip')],
  ['cash', 'cash'],
  ['cash-after-payroll', 'cash?s=after'],
  ['cash-day1', 'cash?s=new'],
  ['record', 'stars'],
  ['record-star-earned', 'stars?s=after'],
  ['record-day1', 'stars?s=new'],
  ['providers', 'market'],
  ['providers-last-tab', 'market', click('#app .cats button >> nth=4')],
  ['programmes', 'programmes'],
  ['programme-sheet', 'programmes', click('#app .prog .btn >> nth=0')],
  ['messages', 'nudges'],
  ['plans', 'tiers'],
  ['day100', 'day100'],
  ['more', 'more'],
  ['more-day1', 'more?s=new'],
  ['shop-plan', 'start', toShop],
  ['shop-step-s5', 'start', async p => { await toShop(p); await p.evaluate(() => { location.hash = '#/step/s5'; }); await p.waitForTimeout(200); }],
  ['all-screens', 'shots'],
];

/* ---------- checks that run inside the page ---------- */
function inPage(o) {
  const out = [];
  const isShots = document.body.classList.contains('is-shots');
  const app = isShots ? document.querySelector('#shots') : document.querySelector('#app');
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const desc = el => { if (!el || !el.tagName) return ''; let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; const c = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.'); if (c) s += '.' + c; const t = txt(el).slice(0, 36); return s + (t ? ' "' + t + '"' : ''); };
  const add = (check, detail, el) => out.push({ check, detail: String(detail), el: desc(el) });
  const shut = el => { const d = el.closest('details:not([open])'); return !!d && !el.closest('summary'); };
  const vis = el => { if (shut(el)) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-ﻼ]/;
  const overlay = app.querySelector('.sheet-bg,.slam');
  const scroller = app.querySelector('.view,.land');
  const VW = innerWidth, VH = innerHeight, appR = app.getBoundingClientRect();
  const layerOf = el => { const l = el.closest('.sheet-bg,.slam,.toast,.sticky,.actions'); return l ? l.className.split(' ')[0] : 'base'; };
  const inScope = el => !overlay || overlay.contains(el) || !!el.closest('.toast');

  // text and bad strings
  const all = txt(app);
  if (/undefined|NaN|\{[a-z]+\}|\[object/.test(all)) add('bad-text', (all.match(/.{0,20}(undefined|NaN|\{[a-z]+\}|\[object).{0,20}/) || [''])[0], app);
  if (!isShots) { const pr = app.querySelector('.proto'); if (!pr || !vis(pr)) add('no-prototype-banner', 'the "Hackathon prototype" line is missing', app); }
  if (/\u0627\u064B/.test(all)) add('arabic-tanween-after-alef', 'alef + fathatan lifts the whole word off the baseline in WebKit with IBM Plex Sans Arabic: ' + (all.match(/\S*\u0627\u064B\S*/g) || []).slice(0, 4).join(' '), app);
  if (/[٠-٩۰-۹]/.test(all)) add('eastern-numerals', (all.match(/.{0,12}[٠-٩۰-۹]+.{0,12}/) || [''])[0], app);

  // horizontal overflow
  if (document.documentElement.scrollWidth > VW + 1) add('overflow-x', 'page scrolls sideways: ' + document.documentElement.scrollWidth + ' > ' + VW, document.documentElement);
  if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) add('overflow-x', 'view scrolls sideways: ' + scroller.scrollWidth + ' > ' + scroller.clientWidth, scroller);
  if (!isShots) app.querySelectorAll('*').forEach(el => {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return; if (el.closest('.cats') || el.closest('.slam')) return; if (!vis(el)) return;
    const r = el.getBoundingClientRect(); if (r.right > appR.right + 1.5 || r.left < appR.left - 1.5) add('overflow-x', 'element leaves the screen by ' + Math.round(Math.max(r.right - appR.right, appR.left - r.left)) + 'px', el);
  });

  // text lines: clipped, overlapping, contrast, Arabic joins
  const lines = []; const seenEl = new Set();
  const tw = document.createTreeWalker(app, NodeFilter.SHOW_TEXT);
  const parseC = s => { const m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgOf = el => { const stack = []; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = parseC(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; } } let bg = [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) bg = over(stack[i], bg); return bg; };
  const opacityOf = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity || 1); return o; };
  let n; while ((n = tw.nextNode())) {
    const s = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!s) continue; const el = n.parentElement; if (!el || !inScope(el)) continue;
    const svg = el.closest('svg'); if (svg && svg.getAttribute('aria-hidden') === 'true') continue;
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || shut(el)) continue;
    let rects;
    if (svg) { const r = el.getBoundingClientRect(); rects = el.tagName.toLowerCase() === 'textpath' ? [] : [r]; if (el.tagName.toLowerCase() === 'textpath' && AR.test(s)) add('arabic-on-curve', s, el); }
    else { const rg = document.createRange(); rg.selectNodeContents(n); rects = [...rg.getClientRects()].filter(r => r.width > 0.5 && r.height > 0.5); }
    if (!svg && !rects.length) continue; // inside a closed <details> or otherwise not rendered
    // Arabic joins: letter-spacing on Arabic text breaks them on iOS
    if (AR.test(s)) { const ls = svg ? (el.getAttribute('letter-spacing') || (el.parentElement && el.parentElement.getAttribute('letter-spacing')) || cs.letterSpacing) : cs.letterSpacing; if (ls && ls !== 'normal' && parseFloat(ls) !== 0) add('arabic-letter-spacing', 'letter-spacing ' + ls + ' on "' + s.slice(0, 30) + '"', el); }
    // contrast
    if (!seenEl.has(el)) { seenEl.add(el);
      const op = opacityOf(el);
      let fg = parseC(svg ? cs.fill : cs.color) || [0, 0, 0, 1]; fg = [fg[0], fg[1], fg[2], fg[3] * op * (svg ? parseFloat(cs.fillOpacity || 1) : 1)];
      if (fg[3] < 0.05) add('invisible-text', 'opacity ' + fg[3].toFixed(2) + ' on "' + s.slice(0, 30) + '"', el);
      else { const plq = svg && svg.classList.contains('plaque'); const bg = plq ? [194, 154, 66, 1] : bgOf(svg ? svg : (el.closest('.meter') ? el.closest('.meter').parentElement : el)); const c = over(fg, bg); const l1 = lum(c), l2 = lum(bg); const ratio = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
        const size = parseFloat(cs.fontSize) * (svg ? svg.getBoundingClientRect().width / (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width || 1) : 1), bold = parseInt(cs.fontWeight) >= 600, large = size >= 24 || (size >= 18.66 && bold);
        if (ratio < (large ? 3 : 4.5) && !el.closest('[disabled]')) add('contrast', ratio.toFixed(2) + ':1 (' + Math.round(size * 10) / 10 + 'px' + (bold ? ' bold' : '') + ') "' + s.slice(0, 30) + '"', el); } }
    // clipped by an ancestor, or outside the screen
    if (!isShots) for (const r of rects) {
      if ((r.right > appR.right + 1.5 || r.left < appR.left - 1.5) && !el.closest('.cats') && !el.closest('.slam')) add('text-off-screen', '"' + s.slice(0, 30) + '" leaves the screen by ' + Math.round(Math.max(r.right - appR.right, appR.left - r.left)) + 'px', el);
      for (let a = svg ? svg.parentElement : el; a && a !== app.parentElement; a = a.parentElement) { const as = getComputedStyle(a); if (a.classList.contains('cats') || a.classList.contains('shot-frame')) break;
        if (as.overflowX !== 'visible') { const ar = a.getBoundingClientRect(); const cut = Math.max(r.right - ar.right, ar.left - r.left); if (cut > 1.5) { add(as.textOverflow === 'ellipsis' ? 'ellipsis' : 'clipped-text', '"' + s.slice(0, 30) + '" cut by ' + Math.round(cut) + 'px', el); break; } }
        if (as.overflowY !== 'visible' && a !== scroller && !a.classList.contains('sheet') && !a.classList.contains('app')) { const ar = a.getBoundingClientRect(); const cut = Math.max(r.bottom - ar.bottom, ar.top - r.top); if (cut > 2.5) { add('clipped-text', '"' + s.slice(0, 30) + '" cut vertically by ' + Math.round(cut) + 'px', el); break; } } }
    }
    // keep visible line boxes for the overlap test
    const sc = el.closest('.view,.land,.sheet'); const sr = sc ? sc.getBoundingClientRect() : null;
    for (const r of rects) { if (sr && (r.bottom < sr.top + 1 || r.top > sr.bottom - 1)) continue; if (el.tagName.toLowerCase() === 'textpath') continue; lines.push({ el, s, r, layer: layerOf(el) + (svg ? ':svg' + [...document.querySelectorAll('svg')].indexOf(svg) : '') }); }
  }
  if (!isShots) { const seenPair = new Set();
    for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) { const a = lines[i], b = lines[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const la = a.layer.split(':')[0], lb = b.layer.split(':')[0]; if (la !== lb) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w > 3 && h > 0.45 * Math.min(a.r.height, b.r.height)) { const k = desc(a.el) + '|' + desc(b.el); if (!seenPair.has(k)) { seenPair.add(k); add('overlap', '"' + a.s.slice(0, 24) + '" over "' + b.s.slice(0, 24) + '" by ' + Math.round(w) + 'x' + Math.round(h) + 'px', a.el); } } } }

  // images
  app.querySelectorAll('img').forEach(im => { if (!(im.complete && im.naturalWidth > 0)) add('image-not-loaded', im.getAttribute('alt') || '', im);
    else if (vis(im)) { const r = im.getBoundingClientRect(), need = r.width * devicePixelRatio; if (im.naturalWidth < need * .95) add('image-soft', (im.getAttribute('alt') || '') + ': ' + im.naturalWidth + 'px wide, needs ' + Math.round(need) + 'px at ' + devicePixelRatio + 'x', im); }
    if (!im.getAttribute('alt')) add('image-no-alt', im.src.slice(0, 40), im); });

  // inputs that make iOS zoom
  app.querySelectorAll('input,select,textarea').forEach(i => { if (i.type === 'range' || !vis(i)) return; const fs = parseFloat(getComputedStyle(i).fontSize); if (fs < 16) add('input-zoom', 'font-size ' + fs + 'px (iOS zooms the page under 16px)', i); });

  // tab bar and action bar stay on screen
  if (!isShots && !o.wide) {
    const tabs = app.querySelector('.tabs'); if (tabs) { const r = tabs.getBoundingClientRect(); if (r.bottom > VH + .5 || r.top < 0) add('tab-bar-cut', 'tab bar bottom at ' + Math.round(r.bottom) + ' of ' + VH, tabs); }
    const bar = app.querySelector('.sticky,.actions');
    if (bar && scroller) { const max = scroller.scrollHeight - scroller.clientHeight;
      for (const pos of [0, max / 2, max]) { scroller.scrollTop = pos; const sr = scroller.getBoundingClientRect(), tb = app.querySelector('.tabs'), limit = Math.min(VH, tb ? tb.getBoundingClientRect().top : VH);
        bar.querySelectorAll('button,a').forEach(b => { const r = b.getBoundingClientRect(); if (r.bottom > limit + .5 || r.top < sr.top - .5) add('action-bar-cut', 'at scroll ' + Math.round(pos) + ' of ' + Math.round(max) + ': bottom ' + Math.round(r.bottom) + ' past ' + Math.round(limit), b); }); }
      scroller.scrollTop = max; if (bar.classList.contains('sticky')) { const prev = bar.previousElementSibling; if (prev && vis(prev)) { const d = prev.getBoundingClientRect().bottom - bar.getBoundingClientRect().top; if (d > 1.5) add('content-under-action-bar', Math.round(d) + 'px of the last block sits under the bar at the end of the scroll', prev); } }
      const share = bar.getBoundingClientRect().height / (scroller.getBoundingClientRect().height + (bar.classList.contains('actions') ? bar.getBoundingClientRect().height : 0)); if (share > .55) add('action-bar-too-tall', 'bar takes ' + Math.round(share * 100) + '% of the view', bar);
      scroller.scrollTop = 0; }
  }

  // interactive elements: reachable, not covered, big enough
  if (!isShots) { const act = [...app.querySelectorAll('a[href],button,input,summary,[role=link]')].filter(el => vis(el) && inScope(el) && !el.disabled);
    for (const el of act) {
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cy < 0 || cy > VH || cx < 0 || cx > VW) { add('unreachable', 'cannot be scrolled into view (centre at ' + Math.round(cx) + ',' + Math.round(cy) + ')', el); continue; }
      const pts = [[cx, cy], [r.left + Math.min(8, r.width / 4), cy], [r.right - Math.min(8, r.width / 4), cy], [cx, r.top + Math.min(6, r.height / 4)], [cx, r.bottom - Math.min(6, r.height / 4)]];
      for (const [x, y] of pts) { const hit = document.elementFromPoint(x, y); if (!hit) { add('covered', 'part of it is off screen', el); break; }
        if (!(el.contains(hit) || hit.contains(el))) { const inl = getComputedStyle(el).display === 'inline'; if (inl && (x !== cx || y !== cy)) continue; add('covered', 'covered by ' + desc(hit), el); break; } }
      if (!o.wide) { const w = Math.round(r.width * 10) / 10, h = Math.round(r.height * 10) / 10; if (w < 44 || h < 44) add('tap-target', w + 'x' + h + 'px', el); }
    }
    if (scroller) scroller.scrollTop = 0; const sh = app.querySelector('.sheet'); if (sh) sh.scrollTop = 0;
    if (app.scrollTop || app.scrollLeft) { add('shell-scrolled', 'the app shell itself scrolled to ' + app.scrollTop, app); app.scrollTop = 0; }
    if (document.documentElement.scrollTop || document.body.scrollTop) add('page-scrolled', 'the page behind the app scrolled', document.body);
  }

  // words before the main button, and whether it is on the first screen
  if (!isShots && scroller && !overlay) { const btn = app.querySelector('.sticky .btn,.actions .btn') || scroller.querySelector('.btn');
    if (btn) { const w2 = document.createTreeWalker(scroller, NodeFilter.SHOW_TEXT); let words = 0, m;
      while ((m = w2.nextNode())) { if (btn.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING || btn.contains(m)) break; const pe = m.parentElement; if (!pe || shut(pe) || pe.closest('svg,.lic,.opt,.bk,.step,.sticky,.actions,.skip,[role=radio],.dl,.dayhead')) continue; const rg = document.createRange(); rg.selectNodeContents(m); if (!rg.getClientRects().length) continue; words += (m.nodeValue.match(/\S+/g) || []).length; }
      if (words > 45) add('too-many-words', words + ' words of prose before "' + txt(btn).slice(0, 24) + '"', btn);
      const r = btn.getBoundingClientRect(); if (!o.wide && (r.bottom > VH || r.top < 0)) add('main-button-below-fold', '"' + txt(btn).slice(0, 24) + '" starts at ' + Math.round(r.top) + ' of ' + VH, btn); } }

  // sheets
  if (overlay && overlay.classList.contains('sheet-bg')) { const sh = overlay.querySelector('.sheet'); const dlg = overlay.closest('[role=dialog]') || overlay.querySelector('[role=dialog]') || (overlay.getAttribute('role') === 'dialog' ? overlay : null);
    if (!dlg) add('sheet-no-dialog-role', 'sheet has no role="dialog"', sh); if (!sh.contains(document.activeElement)) add('sheet-focus', 'focus stays behind the sheet (' + desc(document.activeElement) + ')', sh); }
  return out;
}

const snap = () => { const app = document.querySelector('#app'); const o = {}; let i = 0; app.querySelectorAll('h1,h2,h3,p,a,button,.lic,.cta,svg,li,.dates>div').forEach(el => { const r = el.getBoundingClientRect(); if (r.width && r.height) o[(i++) + el.tagName] = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; }); return o; };

async function auditDevice(browser, dev, base, results) {
  const only = flag('only');
  for (const lang of LANGS) {
    if (flag('lang') && flag('lang') !== lang) continue;
    const ctx = await browser.newContext({ ...dev.ctx, reducedMotion: 'reduce', locale: lang === 'ar' ? 'ar-AE' : 'en-GB' });
    await ctx.addInitScript(() => { try { if (!window.name) { localStorage.clear(); window.name = 'audit'; } } catch (e) {} });
    await ctx.route(u => !u.href.startsWith(base.origin), r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>external</title>' }));
    ctx.on('page', async pg => { const op = await pg.opener().catch(() => null); if (op) { await pg.waitForTimeout(250).catch(() => {}); await pg.close().catch(() => {}); } });
    for (const [name, route, action] of SCREENS) {
      if (only && !name.includes(only)) continue;
      const page = await ctx.newPage();
      const errs = [], ext = [];
      page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('request', r => { const u = r.url(); if (!u.startsWith(base.origin) && !u.startsWith('data:') && !u.startsWith('blob:') && r.frame() === page.mainFrame()) ext.push(u); });
      const rec = { device: dev.id, engine: dev.engine, lang, screen: name, route, findings: [] };
      try {
        await page.goto(`${base.url}#/${route}${route.includes('?') ? '&' : '?'}lang=${lang}`, { waitUntil: 'commit' });
        await page.waitForSelector(route === 'shots' ? '#shots .shot' : '#app > *', { timeout: 8000 });
        const first = name === 'building' ? null : await page.evaluate(snap);
        if (dev.engine === 'chromium') await page.evaluate(() => { window.__cls = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {} });
        await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(name === 'building' ? 60 : 320);
        if (first) { const second = await page.evaluate(snap); let moved = 0, max = 0; for (const k in first) { if (!second[k]) continue; const d = Math.max(...first[k].map((v, i) => Math.abs(v - second[k][i]))); if (d > 1) { moved++; max = Math.max(max, d); } }
          if (moved) rec.findings.push({ check: 'layout-shift', detail: moved + ' blocks moved after first paint, up to ' + max + 'px (web fonts swapping in)', el: '' }); }
        if (dev.engine === 'chromium') { const cls = await page.evaluate(() => window.__cls || 0); if (cls > 0.02) rec.findings.push({ check: 'layout-shift', detail: 'CLS ' + cls.toFixed(3), el: '' }); }
        if (action) await action(page);
        if (lang === 'ar') { const ok = await page.evaluate(() => document.fonts.check('600 16px "IBM Plex Sans Arabic"', 'عربي')); if (!ok) rec.findings.push({ check: 'arabic-font', detail: 'IBM Plex Sans Arabic not loaded', el: '' }); }
        if (flag('shots')) { fs.mkdirSync(path.join(OUT, dev.id), { recursive: true }); await page.screenshot({ path: path.join(OUT, dev.id, `${lang}-${name}.png`), scale: 'css' }); }
        rec.findings.push(...await page.evaluate(inPage, { wide: !!dev.wide }));
      } catch (e) { rec.findings.push({ check: 'audit-crash', detail: e.message.split('\n')[0], el: '' }); }
      for (const e of [...new Set(errs)]) rec.findings.push({ check: 'console-error', detail: e, el: '' });
      for (const u of [...new Set(ext)]) if (!/link-opened|step-s8-toast/.test(name)) rec.findings.push({ check: 'third-party-request', detail: u, el: '' });
      results.push(rec);
      await page.close();
    }
    await ctx.close();
  }
}

/* ---------- the judge journey ---------- */
async function journey(browser, dev, base, lang, out) {
  const ctx = await browser.newContext({ ...dev.ctx, locale: lang === 'ar' ? 'ar-AE' : 'en-GB' });
  await ctx.route(u => !u.href.startsWith(base.origin), r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>external</title>ok' }));
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const w = ms => page.waitForTimeout(ms), hash = () => page.evaluate(() => location.hash), ev = (f, a) => page.evaluate(f, a);
  const note = (id, pass, what, detail) => out.push({ device: dev.id, engine: dev.engine, lang, id, pass: !!pass, what, detail: detail || '' });
  const top = () => ev(() => { const v = document.querySelector('#app .view,#app .land'); return v ? Math.round(v.scrollTop) : -1; });
  const visibleBtn = sel => ev(sel => { const b = document.querySelector(sel); if (!b) return 'missing'; const r = b.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) return 'off screen (' + Math.round(r.top) + '..' + Math.round(r.bottom) + ' of ' + innerHeight + ')'; const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return h && (b.contains(h) || h.contains(b)) ? '' : 'covered by ' + (h ? h.className || h.tagName : 'nothing'); }, sel);
  const run = async (id, what, fn) => { try { await fn(); } catch (e) { note(id, false, what, 'crashed: ' + e.message.split('\n')[0]); } };
  const doneCount = () => ev(() => { const m = document.querySelector('#app .dayhead .m b'); return m ? m.textContent.trim() : ''; });
  const start = lang === 'ar' ? `${base.url}#/landing?lang=ar` : base.url;

  await run('J01', 'Landing: the main button is on the first screen', async () => { await page.goto(start); await page.waitForSelector('#app .cta .btn'); await w(350); const v = await visibleBtn('#app .cta .btn'); note('J01', !v, 'Landing: the main button is visible without scrolling', v); });
  await run('J02', 'Start the demo and open the next step', async () => { await page.click('#app .cta .btn'); await w(250); const h1 = await hash(); await page.click('#app .next .btn'); await w(250); const h2 = await hash(); note('J02', h1.includes('roadmap') && h2.includes('step/s7'), 'Start the demo, open the next step', h1 + ' -> ' + h2); });
  await run('J03', 'On a step the main button and Skip are fully visible', async () => { const a = await visibleBtn('#confirm .btn'), b = await visibleBtn('#app .skip'); note('J03', !a && !b, 'On a step, the main button and "Skip for now" are fully visible', [a, b].filter(Boolean).join('; ')); });
  await run('J04', 'Pick a provider, then switch language: choice and place are kept', async () => {
    await page.click('#app button.opt >> nth=3'); await w(250); await page.fill('#own', 'Al Noor Payroll'); await w(80);
    const fs = await ev(() => parseFloat(getComputedStyle(document.querySelector('#own')).fontSize));
    note('J04a', fs >= 16, 'Own-provider field does not make iOS zoom (16px or more)', fs + 'px');
    await ev(() => { document.querySelector('#app .view').scrollTop = 120; }); const before = await top();
    await page.click('#app .lang'); await w(250);
    const st = await ev(() => ({ dir: document.documentElement.dir, h: location.hash, own: (document.querySelector('#own') || {}).value || '', top: Math.round(document.querySelector('#app .view').scrollTop) }));
    note('J04', st.h.includes('step/s7') && st.own === 'Al Noor Payroll' && Math.abs(st.top - before) < 30, 'Switching language mid-step keeps the step, the typed provider and the scroll position', JSON.stringify(st));
    await page.click('#app .lang'); await w(200); });
  await run('J05', 'Stamp a step', async () => {
    await page.click('#app button.opt >> nth=0'); await w(200); await page.click('#confirm .btn'); await page.click('#confirm .btn', { timeout: 500, force: true }).catch(() => {});
    await page.waitForFunction(() => !document.querySelector('#app .slam'), null, { timeout: 5000 }); await w(350);
    const st = await ev(() => { const a = document.activeElement; return { h: location.hash, top: Math.round((document.querySelector('#app .view') || {}).scrollTop || 0), focus: a ? a.tagName + (a.className ? '.' + a.className : '') : '' }; });
    note('J05', /stars|step/.test(st.h) && st.top === 0, 'After a stamp the next screen opens at the top', JSON.stringify(st));
    note('J05f', /^H1|unlock/i.test(st.focus), 'After a stamp, focus moves to the heading of the next screen', 'focus is on ' + st.focus); });
  await run('J06', 'Continue to the next step and skip it', async () => {
    await page.click('#app a.btn[href*="step"]'); await w(300); const h0 = await hash();
    await page.click('#app .skip'); await w(250);
    const sh = await ev(() => { const s = document.querySelector('#app .sheet'), bg = document.querySelector('#app .sheet-bg'); const d = (s && s.closest('[role=dialog]')) || (bg && bg.querySelector('[role=dialog]')); return { open: !!s, role: !!d, focusIn: !!(s && s.contains(document.activeElement)) }; });
    note('J06a', sh.open && sh.role && sh.focusIn, 'Skip warning opens as a dialog and takes focus', JSON.stringify(sh));
    await page.keyboard.press('Escape'); await w(200); const closedEsc = await ev(() => !document.querySelector('#app .sheet')); note('J06b', closedEsc, 'Escape closes the skip warning', '');
    if (!closedEsc) { await page.click('#app .sheet .btn >> nth=0'); await w(150); }
    await page.click('#app .skip'); await w(250); await page.goBack(); await w(350);
    const afterBack = await ev(() => ({ open: !!document.querySelector('#app .sheet'), h: location.hash })); note('J06c', !afterBack.open && afterBack.h === h0, 'The phone back button closes the skip warning and stays on the step', JSON.stringify(afterBack) + ' expected ' + h0);
    if (afterBack.h !== h0) { await ev(h => { location.hash = h; }, h0); await w(250); }
    if (!(await ev(() => !!document.querySelector('#app .sheet')))) { await page.click('#app .skip'); await w(250); }
    const lock = await ev(() => { const v = document.querySelector('#app .view'); const a = v.scrollTop; v.scrollTop = a + 80; const moved = v.scrollTop !== a; v.scrollTop = a; return { moved, ov: getComputedStyle(v).overflowY }; });
    note('J06d', lock.ov === 'hidden' || !lock.moved, 'The page behind an open sheet does not scroll', JSON.stringify(lock));
    await page.click('#app .sheet [data-act^="skip:"]'); await page.click('#app .skip', { timeout: 400 }).catch(() => {}); await w(500);
    const st = await ev(() => ({ h: location.hash, sheet: !!document.querySelector('#app .sheet'), toast: !!document.querySelector('#app .toast') })); note('J06e', !st.sheet && st.h !== h0, 'A double tap on "Skip anyway" does not open the next warning', JSON.stringify(st));
    if (st.sheet) { await page.click('#app .sheet .btn >> nth=0'); await w(150); }
    const tv = await ev(() => { const t = document.querySelector('#app .toast'); if (!t) return 'no toast'; const tr = t.getBoundingClientRect(); const hit = [...document.querySelectorAll('#app .sticky button,#app .actions button,#app .actions a,#app .view a.btn,#app .tabs a,#app .lock a')].filter(b => { const r = b.getBoundingClientRect(); return r.width && r.left < tr.right && r.right > tr.left && r.top < tr.bottom && r.bottom > tr.top; }); return hit.length ? 'toast covers ' + hit.map(b => (b.innerText || '').trim().slice(0, 20)).join(', ') : ''; });
    note('J06f', !tv, 'The toast never covers a button', tv); });
  await run('J07', 'Open a live link and come back', async () => {
    await ev(() => { location.hash = '#/step/s12'; }); await w(300);
    const lbl0 = await page.locator('#confirm .btn').innerText();
    const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null), page.click('#app a.btn[target=_blank]')]);
    await w(1200); if (pop) await pop.close().catch(() => {}); await page.bringToFront(); await w(700);
    const lbl1 = await page.locator('#confirm .btn').innerText(); const ok = lbl0 !== lbl1 && /Stamp|اختم/.test(lbl1);
    note('J07', ok, 'After opening the official site and coming back, the button reads "Done. Stamp it"', lbl0 + ' -> ' + lbl1 + (pop ? '' : ' (no new tab)'));
    const viaEvents = await ev(() => { const src = [...document.scripts].map(s => s.textContent).join(''); return /visibilitychange|pageshow/.test(src) || !!window.__d100Visibility; });
    note('J07b', viaEvents, 'The return is detected with visibilitychange/pageshow, not a timer', viaEvents ? '' : 'only setTimeout(render,400) in the source'); });
  await run('J08', 'Refresh keeps the plan', async () => {
    await ev(() => { location.hash = '#/roadmap'; }); await w(300); const before = await doneCount(); const lg = await ev(() => document.documentElement.lang);
    await page.reload(); await page.waitForSelector('#app > *'); await w(350); const after = await doneCount(); const h = await hash(); const lg2 = await ev(() => document.documentElement.lang);
    note('J08', before && before === after && lg === lg2, 'A refresh keeps progress and language', `"${before}" -> "${after}" at ${h}, lang ${lg} -> ${lg2}`); });
  await run('J09', 'Back from a step returns to the plan at the same place', async () => {
    await ev(() => { location.hash = '#/roadmap'; }); await w(250); await ev(() => { const v = document.querySelector('#app .view'); v.scrollTop = 260; }); const y0 = await top();
    await page.click('#app a.step >> nth=3'); await w(300); const hs = await hash();
    await page.click('#app .bar .back'); await w(350); const y1 = await top(), h1 = await hash();
    note('J09', h1.includes('roadmap') && Math.abs(y1 - y0) < 12, 'The in-app Back link returns to the plan at the same scroll position', `scroll ${y0} -> ${y1} at ${h1}`);
    await page.goBack(); await w(350); const h2 = await hash();
    note('J09b', !h2.includes('step/'), 'Phone back after the in-app Back does not bounce to the step again (no loop)', `${hs} -> Back -> ${h1} -> phone back -> ${h2}`);
    await ev(() => { location.hash = '#/roadmap'; }); await w(250); await ev(() => { document.querySelector('#app .view').scrollTop = 260; }); const y2 = await top();
    await page.click('#app a.step >> nth=3'); await w(300); await page.goBack(); await w(350); const y3 = await top(), h3 = await hash();
    note('J09c', h3.includes('roadmap') && Math.abs(y3 - y2) < 12, 'The phone back button returns to the plan at the same scroll position', `scroll ${y2} -> ${y3} at ${h3}`); });
  await run('J10', 'Rotate the phone', async () => {
    if (dev.wide) return; await ev(() => { location.hash = '#/step/s9'; }); await w(300); const vp = dev.ctx.viewport, land = { width: Math.max(vp.width, vp.height) + (vp.height < 600 ? 100 : 180), height: Math.min(vp.width, vp.height) };
    await page.setViewportSize(land); await w(350);
    const r = await ev(() => { const v = document.querySelector('#app .view'), bar = document.querySelector('#app .sticky,#app .actions'), tabs = document.querySelector('#app .tabs'); const vr = v.getBoundingClientRect(), br = bar ? bar.getBoundingClientRect() : { height: 0 }; const free = vr.height - (bar && bar.classList.contains('sticky') ? br.height : 0);
      return { free: Math.round(free), bar: Math.round(br.height), tabsBottom: Math.round(tabs.getBoundingClientRect().bottom), vh: innerHeight, sw: document.documentElement.scrollWidth, vw: innerWidth, wide: matchMedia('(min-width:900px)').matches }; });
    const a = await visibleBtn('#confirm .btn');
    note('J10', !a && r.tabsBottom <= r.vh && r.sw <= r.vw && (r.wide || r.free >= 110), 'In landscape the main button stays visible and at least 110px of content shows above it', JSON.stringify(r) + ' ' + a);
    await page.setViewportSize(vp); await w(250); const b = await visibleBtn('#confirm .btn'); note('J10b', !b, 'Back in portrait the layout recovers', b); });
  await run('J11', 'Capital field and slider agree', async () => {
    await ev(() => { location.hash = '#/start'; }); await w(300);
    const r = await ev(() => { const n = document.querySelector('#capn'), s = document.querySelector('#cap'); return { nmax: n.max || n.dataset.max || '', smax: s.max, val: n.value, type: n.type, dirS: getComputedStyle(s).direction }; });
    note('J11', String(r.nmax) === String(r.smax) && /,/.test(r.val), 'Capital field and slider share one maximum and the field shows thousands separators', JSON.stringify(r));
    await page.fill('#biz', 'Test Name'); await page.click('#app .lang'); await w(250); const kept = await ev(() => document.querySelector('#biz').value); note('J11b', kept === 'Test Name', 'A typed business name survives a language switch', '"' + kept + '"'); await page.click('#app .lang'); await w(150); });
  await run('J12', 'Landing after progress', async () => {
    await ev(() => { location.hash = '#/roadmap'; }); await w(250); const before = await doneCount(); await ev(() => { location.hash = '#/landing'; }); await w(250); await page.click('#app .cta .btn'); await w(350); const after = await doneCount();
    note('J12', before === after, 'Going back to the landing page and tapping the main button does not wipe progress', `"${before}" -> "${after}"`); });
  note('J00', errs.length === 0, 'No console errors during the journey', [...new Set(errs)].join(' | '));
  await ctx.close();
}

/* ---------- source checks that no current engine can show ---------- */
function staticChecks(file) {
  const dir = path.dirname(path.resolve(file)); let src = fs.readFileSync(file, 'utf8'); const out = [];
  const assets = path.join(dir, 'assets'); if (fs.existsSync(assets)) for (const f of fs.readdirSync(assets)) if (/\.(js|css)$/.test(f)) src += '\n' + fs.readFileSync(path.join(assets, f), 'utf8');
  const code = src.replace(/url\(data:[^)]+\)/g, 'url(data:)').replace(/"data:image[^"]+"/g, '""');
  const add = (check, detail) => out.push({ check, detail });
  const lb = code.match(/\(\?<[=!][^)]*\)/g); if (lb) add('regex-lookbehind', lb.length + ' regex lookbehind(s) ' + [...new Set(lb)].join(' ') + ': a syntax error on Safari before iOS 16.4, so the whole script fails and the page is blank');
  const css = code;
  for (const m of css.matchAll(/([#.\w-]+)\{[^}]*?height:100dvh[^}]*\}/g)) { if (!/height:100(%|vh)[^}]*height:100dvh/.test(m[0]) && !/@supports/.test(css.slice(Math.max(0, m.index - 80), m.index))) add('dvh-no-fallback', m[1] + ' uses 100dvh with no fallback: iOS before 15.4 drops the rule and the app is not screen height'); }
  if (/bottom:-\d+px/.test((css.match(/\.sticky\{[^}]*\}/) || [''])[0])) add('sticky-hack', '.sticky uses a negative bottom offset to fight the scroll padding');
  if (!/safe-area-inset-(left|right)/.test(css) && /viewport-fit=cover/.test(src)) add('safe-area-sides', 'viewport-fit=cover without left/right safe-area padding: in landscape the notch covers content');
  const toast = (css.match(/\.toast\{[^}]*\}/) || [''])[0]; if (/bottom:\d+px/.test(toast) && !/safe-area/.test(toast)) add('toast-fixed-offset', 'toast sits at a fixed ' + (toast.match(/bottom:\d+px/) || [''])[0] + ' and ignores the home-indicator inset and the action bar');
  if (/setTimeout\(render,\s*400\)/.test(code)) add('visit-timer', 'the live-link return runs on setTimeout(render,400)');
  if (!/localStorage/.test(code)) add('no-persistence', 'nothing is saved: no localStorage use');
  if (!/touch-action/.test(css)) add('no-touch-action', 'no touch-action:manipulation: a quick double tap zooms the page on iOS');
  if (/@media \(prefers-reduced-motion:reduce\)\{\*\{animation:none!important/.test(css) && /\.building p\{opacity:0/.test(css) && !/reduce[^}]*\}[^@]*\.building p\{[^}]*opacity:1/.test(css) && !/reduce\)\{[^@]*\.building p\{opacity:1/.test(css)) add('reduced-motion-hides-text', '.building p starts at opacity 0 and only an animation shows it: with Reduce Motion on the three lines never appear');
  return out;
}

(async () => {
  const base = await serveFile(target); const results = [], jr = [];
  const want = flag('device');
  const devs = DEVICES.filter(d => !want || d.id === want || d.label === want);
  const launched = {};
  for (const dev of devs) {
    const browser = launched[dev.engine] || (launched[dev.engine] = await pw[dev.engine].launch());
    if (!flag('journey-only')) await auditDevice(browser, dev, base, results);
    if (!flag('no-journey') && !flag('only')) for (const lang of LANGS) { if (flag('lang') && flag('lang') !== lang) continue; await journey(browser, dev, base, lang, jr); }
    process.stderr.write(dev.label + ' done\n');
  }
  for (const b of Object.values(launched)) await b.close();
  base.close();
  const stat = staticChecks(target);
  const allow = fs.existsSync('tests/audit-allow.json') ? JSON.parse(fs.readFileSync('tests/audit-allow.json', 'utf8')) : [];
  const allowed = f => allow.some(a => a.check === f.check && (!a.el || (f.el || '').includes(a.el)) && (!a.detail || (f.detail || '').includes(a.detail)) && (!a.screen || (f.screen || '').includes(a.screen)));
  const flat = []; for (const r of results) for (const f of r.findings) flat.push({ ...f, device: r.device, engine: r.engine, lang: r.lang, screen: r.screen });
  const open = flat.filter(f => !allowed(f));
  const tag = want ? '-' + devs.map(d => d.id).join('-') : '';
  fs.writeFileSync(path.resolve('tests/out/audit' + tag + '.json'), JSON.stringify({ screens: results.length, findings: flat, journey: jr, static: stat }, null, 1));
  // summary: one line per check + element, with where it shows
  const groups = {}; for (const f of open) { const k = f.check + ' | ' + f.el.replace(/"[^"]*"/, '').trim(); (groups[k] = groups[k] || []).push(f); }
  const lines = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => { const devs2 = [...new Set(v.map(x => x.device))], langs = [...new Set(v.map(x => x.lang))], scr = [...new Set(v.map(x => x.screen))];
    return `${k}\n    ${v.length}x  [${devs2.join(', ')}] [${langs.join(', ')}] ${scr.slice(0, 6).join(', ')}${scr.length > 6 ? ' +' + (scr.length - 6) : ''}\n    e.g. ${v[0].detail}`; });
  console.log(`screens audited: ${results.length}`);
  console.log(lines.join('\n') || 'no findings');
  const jf = jr.filter(j => !j.pass);
  console.log('\njourney: ' + (jr.length - jf.length) + ' passed, ' + jf.length + ' failed');
  const jg = {}; for (const j of jf) (jg[j.id + ' ' + j.what] = jg[j.id + ' ' + j.what] || []).push(j);
  for (const [k, v] of Object.entries(jg)) console.log('  FAIL ' + k + '\n       [' + [...new Set(v.map(x => x.device + '/' + x.lang))].join(', ') + '] ' + v[0].detail);
  console.log('\nsource checks: ' + (stat.length ? '\n  ' + stat.map(s => s.check + ': ' + s.detail).join('\n  ') : 'clean'));
  const bad = open.length + jf.length + stat.length;
  console.log(bad ? `\nAUDIT: ${open.length} findings, ${jf.length} journey failures, ${stat.length} source checks` : '\nAUDIT GREEN');
  process.exit(bad ? 1 : 0);
})();
