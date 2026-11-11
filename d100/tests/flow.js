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
/*CHECKS*/

console.log(o.join('\n')); console.log(G.join('\n'));
const failed = G.filter(x => x.startsWith('FAIL')).length;
console.log(errs.length ? 'ERRORS: ' + [...new Set(errs)].join(' | ') : failed ? failed + ' glitch checks failed' : 'no errors');
await b.close(); base.close(); process.exit(errs.length || failed ? 1 : 0);
})();
