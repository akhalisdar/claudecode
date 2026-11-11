// Usage: node tests/flow.js [dist/index.html]   BROWSER=webkit to run on Safari's engine
// Part 1 is the original click-through. Part 2 has one check per glitch id in GLITCHES.md.
// Prints "no errors" when the console stayed clean and every check passed. Exits 1 otherwise.
const pw = require('playwright'); const path = require('path'); const fs = require('fs'); const { serveFile } = require('./serve');
fs.mkdirSync('tests/out', { recursive: true });
(async () => {
const engine = process.env.BROWSER === 'webkit' ? 'webkit' : 'chromium';
const target = process.argv[2] || 'dist/index.html';
const b = await pw[engine].launch(); const base = await serveFile(target); const f = base.url, o = [], errs = [], G = [];
const mkctx = async (opt) => { const c = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', ...(opt || {}) }); await c.route(u => !u.href.startsWith(base.origin), r => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' })); return c; };
const watch = pg => { pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); return pg; };
const c = await mkctx(); let p = watch(await c.newPage());
const one = s => s.replace(/\s+/g, ' ').trim(), hash = () => p.evaluate(() => location.hash), n = s => p.locator(s).count(), w = ms => p.waitForTimeout(ms);
const ok = (id, pass, msg) => G.push((pass ? 'ok    ' : 'FAIL  ') + id + '  ' + msg);
const src = () => { let s = fs.readFileSync(target, 'utf8'); const a = path.join(path.dirname(path.resolve(target)), 'assets'); if (fs.existsSync(a)) for (const x of fs.readdirSync(a)) if (/\.(js|css)$/.test(x)) s += '\n' + fs.readFileSync(path.join(a, x), 'utf8'); return s.replace(/data:[a-z/+0-9-]+;base64,[A-Za-z0-9+/=]+/g, 'data:'); };

/* ---------- part 1: the click-through ---------- */
await p.goto(f); await p.click('#app [data-act=begin], #app .cta .btn'); await w(150); await p.click('#app .next .btn'); await w(100);
await p.click('#app .skip'); await w(100); o.push('sheet: ' + one(await p.locator('#app .sheet').innerText()));
await p.click('#app .sheet >> text=Go back'); await w(120); o.push('go back closes: ' + (await n('#app .sheet') === 0));
await p.click('#app .skip'); await w(80); await p.click('#app .sheet >> text=Skip anyway'); await w(600); o.push('after skip -> ' + await hash());
await p.goto(f + '#/roadmap'); await w(100); o.push('plan skipped group: ' + await n('#app h2.sk') + ' | ' + one(await p.locator('#app h2.sk + a').innerText()));
await p.goto(f + '#/step/s7'); await w(100); o.push('s7 revisit: skip btn=' + await n('#app .skip') + ' note=' + (await p.locator('#app').innerText()).includes('Skipped on day'));
await p.click('#app button.opt >> nth=0'); await w(100); await p.click('#confirm .btn'); await w(900); o.push('s7 done -> ' + await hash());
await p.goto(f + '#/roadmap'); await w(100); o.push('skipped group after doing it: ' + await n('#app h2.sk'));
await p.goto(f + '#/step/s11'); await w(100); o.push('s11 lock before: ' + await n('#app .lock') + ' skip btn on locked: ' + await n('#app .skip'));
await p.goto(f + '#/step/s8'); await w(100); await p.click('#app .skip'); await w(80); o.push('s8 sheet: ' + one(await p.locator('#app .sheet').innerText()).slice(0, 140)); await p.click('#app .sheet >> text=Skip anyway'); await w(600);
await p.goto(f + '#/step/s11'); await w(100); o.push('s11 lock after skipping s8: ' + await n('#app .lock'));
for (const r of ['cash', 'stars', 'nudges', 'day100', 'tiers']) o.push(r + ' upsells: ' + await (async () => { await p.goto(f + '#/' + r); await w(80); return (await n('#app .up')) + ' ' + (await n('#app .up') ? one(await p.locator('#app .up >> nth=0').innerText()) : ''); })());
await p.goto(f + '#/step/s9'); await w(80); o.push('member rate tags: ' + await n('#app .opt .mr'));
await p.goto(f + '#/bank?s=new'); await w(300); o.push('bank tiles: ' + await n('#app .bk') + ' logos loaded: ' + await p.evaluate(() => [...document.querySelectorAll('#app .bk img')].filter(i => i.complete && i.naturalWidth > 0).length));
await p.click('#app .bk >> nth=6'); await w(80); o.push('pick 7th -> ' + await p.locator('#app a.btn[target=_blank]').getAttribute('href'));
await p.click('#app .skip'); await w(80); await p.click('#app .sheet >> text=Skip anyway'); await w(600); o.push('bank skipped -> ' + await hash());
await p.goto(f + '#/step/s9'); await w(80); o.push('s9 lock after bank skip: ' + await n('#app .lock'));
await p.goto(f + '#/landing'); await w(80); o.push('cbd line: ' + await p.evaluate(() => { const i = document.querySelector('#app .byc img'); return !!i && i.naturalWidth > 0; }));
const over = []; const ROUTES = ['landing', 'start', 'roadmap', 'roadmap?s=skip', 'step/s7?s=warn', 'cash', 'stars', 'market', 'programmes', 'nudges', 'tiers', 'day100', 'more', ...Array.from({ length: 15 }, (_, i) => 'step/s' + (i + 1)), 'bank?s=new'];
const arText = [];
for (const l of ['en', 'ar']) for (const r of ROUTES) { await p.goto(`${f}#/${r}${r.includes('?') ? '&' : '?'}lang=${l}`); await w(50); const t = await p.locator('#app').innerText(); if (/undefined|NaN|\{[a-z]+\}/.test(t)) o.push('BAD ' + l + ' ' + r); if (l === 'ar') arText.push(t);
  const ov = await p.evaluate(() => { const bad = []; document.querySelectorAll('#app *').forEach(el => { const r = el.getBoundingClientRect(); if ((r.right > 391 || r.left < -1) && !el.closest('.cats') && !el.closest('svg') && !el.closest('.lic-s') && !el.closest('.slam')) bad.push(el.className || el.tagName); }); return [...new Set(bad)].slice(0, 3); }); if (ov.length) over.push(l + ' ' + r + ': ' + ov.join(',')); }
o.push('overflow: ' + (over.join(' | ') || 'none'));
const s = await mkctx({ deviceScaleFactor: 1 }); const q = await s.newPage();
const sh = async (u, name, bottom) => { await q.goto(f + u); await q.waitForTimeout(250); if (bottom) await q.evaluate(() => { const v = document.querySelector('#app .view') || document.querySelector('#app .land'); v.scrollTop = 1e5; }); await q.waitForTimeout(80); await q.screenshot({ path: path.join('tests/out', name) }); };
await sh('#/step/s7?s=warn', 'd1.png'); await sh('#/roadmap?s=skip', 'd3.png'); await sh('#/landing', 'd4.png', 1); await sh('#/bank?s=new', 'd2.png'); await sh('#/cash?lang=en', 'd5.png'); await s.close();

/* ---------- part 2: one check per glitch ---------- */
const code = src();
const fresh = async (opt, route) => { const cx = await mkctx(opt); const pg = watch(await cx.newPage()); await pg.goto(f + (route || '')); await pg.waitForSelector('#app > *'); await pg.waitForTimeout(200); return pg; };
// G01 no regex lookbehind, and the plan card still shows one sentence
await p.goto(f + '#/roadmap?s=new&lang=en'); await w(150);
{ const one1 = one(await p.locator('#app .next p').innerText()); ok('G01', !/\(\?<[=!]/.test(code) && /^[^.]+\.$/.test(one1), 'no regex lookbehind; plan card shows one sentence: "' + one1 + '"');
  await p.goto(f + '#/step/s12?lang=ar'); await w(120); const ar1 = one(await p.locator('#app .view p.body').innerText()); ok('G01', /التأسيس ولو لم تبدأ نشاطها\.$/.test(ar1), 'Arabic first sentence splits at the full stop'); }
// G02 screen height has a fallback for browsers without dvh, and the shell fills the screen exactly
{ const h = await p.evaluate(() => { const d = document.querySelector('#device').getBoundingClientRect(), t = document.querySelector('#app .tabs').getBoundingClientRect(); return { d: d.height, tb: t.bottom, vh: innerHeight }; });
  const css = code.match(/#device\{[^}]*height:100%;height:100dvh[^}]*\}/); ok('G02', !!css && !/height:100dvh/.test(code.replace(/height:100%;height:100dvh/g, '')) && Math.abs(h.d - h.vh) < 1 && h.tb <= h.vh + .5, 'every 100dvh has a 100% fallback; shell is ' + h.d + ' of ' + h.vh + 'px, tab bar ends at ' + h.tb); }
// G03 no alef followed by fathatan anywhere in the Arabic screens (WebKit lifts the word off the baseline)
{ const hit = arText.join(' ').match(/\S*\u0627\u064B\S*/g) || []; await p.goto(f + '#/landing?lang=en'); await w(80); const lic = (await p.locator('#app .lic').innerText()).match(/\S*\u0627\u064B\S*/g) || [];
  ok('G03', hit.length + lic.length === 0 && /\u064B\u0627/.test(arText.join(' ')), 'tanween sits before the alef in all ' + arText.length + ' Arabic screens and on the licence card' + (hit.length ? ': ' + hit.slice(0, 3).join(' ') : '')); }
// G04 no letter-spacing on any element that holds Arabic text
{ const bad = []; for (const r of ['tiers', 'cash', 'stars', 'step/s7?s=warn', 'roadmap', 'day100', 'nudges']) { await p.goto(`${f}#/${r}${r.includes('?') ? '&' : '?'}lang=ar`); await w(60);
    bad.push(...await p.evaluate(() => { const o = []; const tw = document.createTreeWalker(document.querySelector('#app'), NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { if (!/[\u0600-\u06FF]/.test(n.nodeValue)) continue; const e = n.parentElement, ls = e.closest('svg') ? (e.getAttribute('letter-spacing') || '0') : getComputedStyle(e).letterSpacing; if (ls !== 'normal' && parseFloat(ls) !== 0) o.push(n.nodeValue.trim().slice(0, 16) + ' ' + ls); } return o; })); }
  ok('G04', bad.length === 0, 'no letter-spacing on Arabic text' + (bad.length ? ': ' + bad.slice(0, 3).join(', ') : '')); }
// G05 progress and language survive a refresh; the landing button does not wipe them; Reset in More does
{ const pg = await fresh(); const cnt = () => pg.evaluate(() => (document.querySelector('#app .dayhead .m b') || {}).textContent || ''); const ww = ms => pg.waitForTimeout(ms);
  await pg.click('#app [data-act=begin]'); await ww(150); await pg.click('#app .next .btn'); await ww(150); await pg.click('#app button.opt >> nth=0'); await ww(100); await pg.click('#confirm .btn'); await pg.waitForFunction(() => location.hash.includes('stars')); await ww(100);
  await pg.goto(f + '#/roadmap'); await ww(400); const a = await cnt(); await pg.click('#app .lang'); await ww(150); await pg.reload(); await pg.waitForSelector('#app .dayhead'); await ww(150);
  const st = await pg.evaluate(() => ({ dir: document.documentElement.dir, lang: document.documentElement.lang, key: Object.keys(localStorage).join(',') })); const bAr = await cnt(); await pg.click('#app .lang'); await ww(150); const bb = await cnt();
  await pg.goto(f + '#/landing'); await ww(150); await pg.click('#app [data-act=begin]'); await ww(250); const c2 = await cnt();
  await pg.goto(f + '#/more'); await ww(150); await pg.click('#app [data-act=reset]'); await ww(250); const d2 = await cnt(); await pg.reload(); await pg.waitForSelector('#app .dayhead'); await ww(150); const e2 = await cnt();
  ok('G05', /^7 /.test(a) && bb === a && st.dir === 'rtl' && st.key === 'd100:v1' && /7/.test(bAr), 'refresh keeps progress ("' + a + '" -> "' + bb + '") and language (' + st.lang + ') under key ' + st.key);
  ok('G05', c2 === a, 'the landing button keeps progress: "' + c2 + '"'); ok('G05', /^6 /.test(d2) && e2 === d2, 'Reset in More goes back to Layla day 37 and stays there after a refresh: "' + e2 + '"'); await pg.context().close(); }
// G13 the action bar is a row of the shell (no sticky hack) and its buttons are fully on screen at any scroll position
{ const pg = await fresh({ viewport: { width: 320, height: 568 } }, '#/step/s9'); const r = await pg.evaluate(() => { const v = document.querySelector('#app .view'), bar = document.querySelector('#confirm'), tabs = document.querySelector('#app .tabs'); const res = [];
    for (const pos of [0, 1e5]) { v.scrollTop = pos; for (const b2 of bar.querySelectorAll('button')) { const q = b2.getBoundingClientRect(), h = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); res.push(q.top >= v.getBoundingClientRect().bottom - 1 && q.bottom <= tabs.getBoundingClientRect().top + 1 && b2.contains(h)); } } return { inView: v.contains(bar), all: res.every(Boolean), n: res.length }; });
  ok('G13', !/\.sticky\{/.test(code) && !r.inView && r.all && r.n === 4 && /\.actions\.end\{[^}]*safe-area-inset-bottom/.test(code), 'action bar sits outside the scroller; main button and Skip fully visible at top and bottom of the scroll at 320x568'); await pg.context().close(); }
// G06 landing: the main button is on the first screen on the smallest phones, in both languages; the licence card stays compact at 320px
{ const res = []; for (const [vw, vh] of [[320, 568], [390, 664]]) for (const l of ['en', 'ar']) { const pg = await fresh({ viewport: { width: vw, height: vh } }, '#/landing?lang=' + l);
    res.push(vw + ' ' + l + ' ' + await pg.evaluate(() => { const b2 = document.querySelector('#app [data-act=begin]'), q = b2.getBoundingClientRect(), h = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); const lv = document.querySelectorAll('#app .lic-r .lv')[1].getBoundingClientRect().height; return (q.top >= 0 && q.bottom <= innerHeight && b2.contains(h) ? 'ok' : 'cut at ' + Math.round(q.top) + '..' + Math.round(q.bottom) + ' of ' + innerHeight) + (lv > 76 ? ' trade name ' + Math.round(lv) + 'px tall' : ''); })); await pg.context().close(); }
  ok('G06', res.every(x => x.endsWith(' ok')), 'landing main button fully on the first screen: ' + res.join(', ')); }
// G07 the toast never covers a button, and when it goes it does not take focus or the typed text with it
{ const pg = await fresh(null, '#/step/s8?s=after'); await pg.click('#confirm [data-act^="done:"]'); await pg.waitForSelector('#app .toast', { timeout: 6000 }); await pg.waitForTimeout(100);
  const hit = await pg.evaluate(() => { const t = document.querySelector('#app .toast').getBoundingClientRect(), vb = document.querySelector('#app .view').getBoundingClientRect().bottom; return [...document.querySelectorAll('#app button,#app a')].filter(e => { const r = e.getBoundingClientRect(), bot = e.closest('.view') ? Math.min(r.bottom, vb) : r.bottom; return r.width && r.left < t.right && r.right > t.left && r.top < t.bottom && bot > t.top; }).map(e => e.textContent.trim().slice(0, 20)); });
  await pg.waitForTimeout(450); await pg.click('#app button.opt >> nth=3'); await pg.waitForTimeout(100); await pg.type('#own', 'Al Noor'); await pg.waitForFunction(() => !document.querySelector('#app .toast'), null, { timeout: 6000 }); await pg.waitForTimeout(100);
  const af = await pg.evaluate(() => ({ id: document.activeElement.id, v: (document.querySelector('#own') || {}).value }));
  ok('G07', hit.length === 0 && af.id === 'own' && af.v === 'Al Noor', 'toast covers nothing' + (hit.length ? ' (covers ' + hit.join(', ') + ')' : '') + '; after it goes, focus is still on #' + af.id + ' with "' + af.v + '"'); await pg.context().close(); }
// G08 after a stamp: next screen opens at the top with focus on its heading; on the star screen the Next button is on the first screen
{ const pg = await fresh({ viewport: { width: 390, height: 664 } }, '#/step/s7'); await pg.click('#app button.opt >> nth=0'); await pg.waitForTimeout(100); await pg.click('#confirm .btn'); await pg.waitForFunction(() => location.hash.includes('stars')); await pg.waitForTimeout(150);
  const a = await pg.evaluate(() => { const b2 = document.querySelector('#app .unlock a.btn'), q = b2 ? b2.getBoundingClientRect() : null; return { f: document.activeElement.className, on: !!q && q.top >= 0 && q.bottom <= innerHeight, top: document.querySelector('#app .view').scrollTop }; });
  await pg.waitForTimeout(300); await pg.click('#app .unlock a.btn'); await pg.waitForTimeout(200); const b3 = await pg.evaluate(() => ({ f: document.activeElement.tagName, top: document.querySelector('#app .view').scrollTop, h: location.hash }));
  ok('G08', a.f === 'unlock' && a.on && a.top === 0 && b3.f === 'H1' && b3.top === 0, 'star screen: focus on .' + a.f + ', Next button on the first screen: ' + a.on + '; next step ' + b3.h + ': focus on ' + b3.f + ', scroll ' + b3.top); await pg.context().close(); }
// G09 back from a step returns to the plan at the same scroll position, with the in-app Back link and with the phone's back button, and never loops
{ const pg = await fresh({ viewport: { width: 390, height: 664 } }, '#/landing'); const ww = ms => pg.waitForTimeout(ms), y = () => pg.evaluate(() => Math.round(document.querySelector('#app .view').scrollTop)), hh = () => pg.evaluate(() => location.hash);
  await pg.click('#app [data-act=begin]'); await ww(200); await pg.evaluate(() => { document.querySelector('#app .view').scrollTop = 240; }); const y0 = await y();
  await pg.click('#app a.step >> nth=3'); await ww(200); const hs = await hh(), ys = await y(); await pg.click('#app .bar .back'); await ww(250); const y1 = await y(), h1 = await hh();
  await pg.goBack(); await ww(250); const h2 = await hh(); await pg.goForward(); await ww(250);
  await pg.evaluate(() => { document.querySelector('#app .view').scrollTop = 240; }); await pg.click('#app a.step >> nth=3'); await ww(200); await pg.goBack(); await ww(250); const y3 = await y(), h3 = await hh();
  await pg.goto(f + '#/step/s9'); await pg.reload(); await pg.waitForSelector('#app .bar .back'); await ww(150); await pg.click('#app .bar .back'); await ww(250); const h4 = await hh(); await pg.goBack(); await ww(250); const h5 = await hh();
  ok('G09', ys === 0 && h1 === '#/roadmap' && Math.abs(y1 - y0) < 3 && h2 !== hs, 'in-app Back: plan reopens at ' + y1 + ' (was ' + y0 + '); phone back then goes to ' + h2 + ', not ' + hs);
  ok('G09', h3 === '#/roadmap' && Math.abs(y3 - y0) < 3, 'phone back: plan reopens at ' + y3 + ' (was ' + y0 + ')'); ok('G09', h4 === '#/roadmap' && !h5.includes('step/s9'), 'Back after a refresh on a step goes to the plan and does not leave the step behind it in history (' + h5 + ')'); await pg.context().close(); }
// G10 sheets are dialogs: role, focus in and trapped, Escape and the phone's back button close them, the page behind does not scroll
for (const [nm, route, openSel] of [['skip warning', '#/step/s8', '#app .skip'], ['programme sheet', '#/programmes', '#app .prog .btn >> nth=0']]) { const pg = await fresh({ viewport: { width: 320, height: 568 } }, '#/roadmap'); const ww = ms => pg.waitForTimeout(ms);
  await pg.goto(f + route); await ww(150); const h0 = await pg.evaluate(() => location.hash); await pg.click(openSel); await ww(200);
  const a = await pg.evaluate(() => { const sh = document.querySelector('#app .sheet'), v = document.querySelector('#app .view'); const moved = getComputedStyle(v).overflowY !== 'hidden'; return { role: sh.getAttribute('role'), modal: sh.getAttribute('aria-modal'), named: !!document.getElementById(sh.getAttribute('aria-labelledby')), focus: sh.contains(document.activeElement), moved, inert: v.hasAttribute('inert') }; });
  for (let i = 0; i < 7; i++) await pg.keyboard.press('Tab'); const trapped = await pg.evaluate(() => document.querySelector('#app .sheet').contains(document.activeElement));
  await pg.keyboard.press('Escape'); await ww(250); const esc = await pg.evaluate(() => ({ open: !!document.querySelector('#app .sheet'), h: location.hash, f: (document.activeElement.textContent || '').trim().slice(0, 12) }));
  await pg.click(openSel); await ww(200); await pg.goBack(); await ww(250); const bk = await pg.evaluate(() => ({ open: !!document.querySelector('#app .sheet'), h: location.hash }));
  await pg.goBack(); await ww(250); const bk2 = await pg.evaluate(() => location.hash);
  ok('G10', a.role === 'dialog' && a.modal === 'true' && a.named && a.focus && trapped && !a.moved && a.inert, nm + ': role=dialog, labelled, focus inside and trapped, page behind inert and not scrolling');
  ok('G10', !esc.open && esc.h === h0 && !bk.open && bk.h === h0 && bk2 === '#/roadmap', nm + ': Escape closes it (focus back on "' + esc.f + '"); phone back closes it and stays on ' + bk.h + '; one more back leaves to ' + bk2); await pg.context().close(); }
// G11 live link: the button changes when the judge comes back (visibilitychange), not on a timer, and the visit survives a reload
{ const pg = await fresh(null, '#/step/s12'); const lbl = () => pg.locator('#confirm .btn').innerText(), ww = ms => pg.waitForTimeout(ms); const l0 = await lbl();
  await pg.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => window.__hid }); document.querySelector('#app a.btn[target=_blank]').addEventListener('click', e => e.preventDefault()); });
  await pg.click('#app a.btn[target=_blank]'); await pg.evaluate(() => { window.__hid = true; document.dispatchEvent(new Event('visibilitychange')); }); await ww(2200); const lAway = await lbl();
  await pg.evaluate(() => { window.__hid = false; document.dispatchEvent(new Event('visibilitychange')); }); await ww(120); const lBack = await lbl();
  await pg.reload(); await pg.waitForSelector('#confirm .btn'); await ww(150); const lReload = await lbl();
  ok('G11', l0 === 'I have already done this' && lAway === l0 && lBack === 'Done. Stamp it' && lReload === 'Done. Stamp it' && !/setTimeout\(render,\s*400\)/.test(code) && /pageshow/.test(code), 'button stays "' + lAway + '" while away, reads "' + lBack + '" on return and after a reload'); await pg.context().close(); }
// G12 landscape: buttons on screen, content keeps at least 110px, nothing scrolls sideways; sides padded for the notch
{ const res = []; for (const [vw, vh] of [[668, 320], [844, 390]]) { const pg = await fresh({ viewport: { width: vw, height: vh } }, '#/step/s9');
    res.push(await pg.evaluate(() => { const v = document.querySelector('#app .view').getBoundingClientRect(), t = document.querySelector('#app .tabs').getBoundingClientRect(); const cut = [...document.querySelectorAll('#confirm button')].filter(b2 => { const q = b2.getBoundingClientRect(); return q.top < v.bottom - 1 || q.bottom > t.top + 1 || q.height < 44; }).length; return { free: Math.round(v.height), cut, tabs: t.bottom <= innerHeight + .5, side: document.documentElement.scrollWidth <= innerWidth }; })); await pg.context().close(); }
  ok('G12', res.every(r => r.free >= 110 && !r.cut && r.tabs && r.side) && /\.app\{[^}]*safe-area-inset-left/.test(code), 'landscape: ' + res.map(r => r.free + 'px of content, buttons whole: ' + !r.cut).join(' | ') + '; left and right safe-area padding present'); }
// G14 capital: field and slider share one range, the field shows thousands separators and reads Arabic-Indic digits
{ const pg = await fresh(null, '#/start'); const val = () => pg.evaluate(() => document.querySelector('#capn').value + ' / ' + document.querySelector('#cap').value);
  const lim = await pg.evaluate(() => { const n = document.querySelector('#capn'), s2 = document.querySelector('#cap'); return n.dataset.min === s2.min && n.dataset.max === s2.max && n.type === 'text' && n.inputMode === 'numeric'; }); const v0 = await val();
  await pg.fill('#capn', '5000000'); const v1 = await val(); await pg.fill('#capn', '\u0662\u0665\u0660\u0660\u0660\u0660'); const v2 = await val(); await pg.fill('#capn', '500'); await pg.locator('#biz').focus(); const v3 = await val();
  await pg.evaluate(() => { const s2 = document.querySelector('#cap'); s2.value = 300000; s2.dispatchEvent(new Event('input', { bubbles: true })); }); const v4 = await val(); await pg.click('[data-act=build]'); await pg.waitForFunction(() => location.hash.includes('roadmap'), null, { timeout: 6000 }); await pg.goto(f + '#/cash'); await pg.waitForTimeout(150); const bal = one(await pg.locator('#app .figs div >> nth=0').innerText());
  ok('G14', lim && v0 === '150,000 / 150000' && v1 === '1,000,000 / 1000000' && v2 === '250,000 / 250000' && v3 === '10,000 / 10000' && v4 === '300,000 / 300000' && /298,950/.test(bal), 'capital field and slider agree: ' + [v0, v1, v2, v3, v4].join(' | ') + ' -> ' + bal); await pg.context().close(); }
// G15 no more than about 40 words of prose before the main button (choices, buttons and closed "Learn more" sections are not prose)
{ const count = () => { const app = document.querySelector('#app'), btn = app.querySelector('.actions .btn,.next .btn,.unlock .btn'); if (!btn) return -1; const sc = app.querySelector('.view,.land'); const tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n = 0, m;
    const stop = sc.contains(btn) ? btn : sc.querySelector('.cta'); // landing: the button is pinned; count what comes before the place it belongs to, the pitch below is optional reading
    while ((m = tw.nextNode())) { if (stop && (stop.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING || stop.contains(m))) break; const e = m.parentElement; if (e.closest('svg,.lic,.opt,.bk,.step,.skip,.btn,.up,summary,[role=radio],.dl,.dayhead') || e.closest('details:not([open])')) continue; n += (m.nodeValue.match(/\S+/g) || []).length; } return n; };
  const res = []; for (const l of ['en', 'ar']) { const pg = await fresh(null, '#/roadmap?lang=' + l);
    for (const r of ['landing', 'roadmap', 'step/s7', 'step/s9', 'step/s10', 'step/s12', 'step/s7?s=skip', 'stars?s=after', 'step/s3?s=new', 'bank?s=new']) { await pg.goto(`${f}#/${r}${r.includes('?') ? '&' : '?'}lang=${l}`); await pg.waitForTimeout(80); res.push([l + ' ' + r, await pg.evaluate(count)]); } await pg.context().close(); }
  const worst = res.slice().sort((a, b2) => b2[1] - a[1])[0]; ok('G15', res.every(x => x[1] >= 0 && x[1] <= 45), 'most words before a main button: ' + worst[1] + ' (' + worst[0] + '), over ' + res.length + ' screens'); }
// G16 with Reduce Motion on, the three lines on the building screen are visible
{ const pg = await fresh({ reducedMotion: 'reduce' }, '#/building'); const op = await pg.evaluate(() => [...document.querySelectorAll('#app .building p')].map(e => getComputedStyle(e).opacity).join(','));
  ok('G16', op === '1,1,1', 'building screen lines have opacity ' + op + ' with reduced motion'); await pg.context().close(); }
// G17 a double tap on "Skip anyway" or on the stamp button does not act on the next screen; double-tap zoom is off
{ const pg = await fresh({ reducedMotion: 'no-preference' }, '#/step/s8'); const ww = ms => pg.waitForTimeout(ms);
  await pg.click('#app .skip'); await ww(250); const box = await pg.locator('#app .sheet [data-act^="skip:"]').boundingBox(); const x = box.x + box.width / 2, y = box.y + box.height / 2; await pg.mouse.click(x, y); await ww(120); await pg.mouse.click(x, y); await pg.mouse.click(x, y + 20); await ww(500);
  const a = await pg.evaluate(() => ({ h: location.hash, sheet: !!document.querySelector('#app .sheet') }));
  await pg.goto(f + '#/step/s12'); await ww(200); const bb = await pg.locator('#confirm .btn').boundingBox(); await pg.mouse.click(bb.x + 40, bb.y + 20); await pg.mouse.click(bb.x + 40, bb.y + 20); await pg.waitForFunction(() => !document.querySelector('#app .slam') && !location.hash.includes('s12'), null, { timeout: 6000 }); await pg.mouse.click(bb.x + 40, bb.y + 20); await ww(300); await pg.goto(f + '#/roadmap'); await ww(200);
  const cnt = await pg.evaluate(() => document.querySelector('#app .dayhead .m b').textContent), ta = await pg.evaluate(() => getComputedStyle(document.querySelector('#app .btn')).touchAction);
  ok('G17', a.h === '#/step/s7' && !a.sheet && /^7 /.test(cnt) && ta === 'manipulation', 'double tap on Skip anyway lands on ' + a.h + ' with no new warning; triple tap on the stamp button stamps one step ("' + cnt + '"); touch-action: ' + ta); await pg.context().close(); }
/*CHECKS*/

console.log(o.join('\n')); console.log(G.join('\n'));
const failed = G.filter(x => x.startsWith('FAIL')).length;
console.log(errs.length ? 'ERRORS: ' + [...new Set(errs)].join(' | ') : failed ? failed + ' glitch checks failed' : 'no errors');
await b.close(); base.close(); process.exit(errs.length || failed ? 1 : 0);
})();
