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
  await pg.goto(f + '#/roadmap'); await ww(150); const a = await cnt(); await pg.click('#app .lang'); await ww(150); await pg.reload(); await pg.waitForSelector('#app .dayhead'); await ww(150);
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
  await pg.click('#app button.opt >> nth=3'); await pg.waitForTimeout(100); await pg.type('#own', 'Al Noor'); await pg.waitForFunction(() => !document.querySelector('#app .toast'), null, { timeout: 6000 }); await pg.waitForTimeout(100);
  const af = await pg.evaluate(() => ({ id: document.activeElement.id, v: (document.querySelector('#own') || {}).value }));
  ok('G07', hit.length === 0 && af.id === 'own' && af.v === 'Al Noor', 'toast covers nothing' + (hit.length ? ' (covers ' + hit.join(', ') + ')' : '') + '; after it goes, focus is still on #' + af.id + ' with "' + af.v + '"'); await pg.context().close(); }
/*CHECKS*/

console.log(o.join('\n')); console.log(G.join('\n'));
const failed = G.filter(x => x.startsWith('FAIL')).length;
console.log(errs.length ? 'ERRORS: ' + [...new Set(errs)].join(' | ') : failed ? failed + ' glitch checks failed' : 'no errors');
await b.close(); base.close(); process.exit(errs.length || failed ? 1 : 0);
})();
