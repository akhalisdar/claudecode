// Usage: node tests/glitch-shots.js dist/index.html glitches/before   (or glitches/after)
// One screenshot per glitch id in GLITCHES.md, on WebKit, so before and after can be compared side by side.
const pw = require('playwright');
const fs = require('fs');
const path = require('path');
const { serveFile } = require('./serve');

(async () => {
  const base = await serveFile(process.argv[2] || 'dist/index.html');
  const out = path.resolve(process.argv[3] || 'glitches/after'); fs.mkdirSync(out, { recursive: true });
  const b = await pw.webkit.launch();
  const mk = async (dev, extra) => { const c = await b.newContext({ ...pw.devices[dev], ...(extra || {}) }); await c.route(u => !u.href.startsWith(base.origin), r => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' })); return c; };
  const shot = async (ctx, name, route, act, clip) => {
    const p = await ctx.newPage();
    try {
      await p.goto(base.url + '#/' + route); await p.waitForSelector('#app > *'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(350);
      if (act) await act(p);
      await p.screenshot({ path: path.join(out, name + '.png'), scale: 'css', ...(clip ? { clip } : {}) });
    } catch (e) { console.log('skip ' + name + ': ' + e.message.split('\n')[0]); }
    await p.close();
  };
  const calm = { reducedMotion: 'reduce' };
  const se = await mk('iPhone SE', calm), i13 = await mk('iPhone 13', calm), i13m = await mk('iPhone 13');
  const land = await mk('iPhone 13', { ...calm, viewport: { width: 750, height: 342 } });
  const bottom = async p => { await p.evaluate(() => { const v = document.querySelector('#app .view'); v.scrollTop = 1e5; }); await p.waitForTimeout(150); };

  await shot(i13, 'G03-arabic-tanween-step', 'step/s7?lang=ar');
  await shot(i13, 'G03-arabic-tanween-plans', 'tiers?lang=ar');
  await shot(i13, 'G04-arabic-letter-spacing', 'tiers?lang=ar', null, { x: 0, y: 180, width: 390, height: 230 });
  await shot(se, 'G06-landing-iphone-se', 'landing');
  await shot(i13, 'G06-landing-iphone-13', 'landing');
  await shot(se, 'G06-landing-iphone-se-ar', 'landing?lang=ar');
  await shot(i13m, 'G07-toast-over-buttons', 'step/s8?s=after', async p => { await p.click('#app [data-act^="done:"]'); await p.waitForSelector('#app .toast', { timeout: 6000 }); await p.waitForTimeout(350); });
  await shot(i13, 'G08-star-earned-next-button', 'stars?s=after');
  await shot(i13, 'G10-skip-warning', 'step/s7', async p => { await p.click('#app .skip'); await p.waitForTimeout(300); });
  await shot(i13, 'G10-programme-sheet-ar', 'programmes?lang=ar', async p => { await p.click('#app .prog .btn >> nth=0'); await p.waitForTimeout(300); });
  await shot(land, 'G12-landscape-step', 'step/s9');
  await shot(i13, 'G14-capital-field', 'start', async p => { await p.evaluate(() => document.querySelector('#capn').scrollIntoView({ block: 'center' })); await p.waitForTimeout(150); });
  await shot(i13, 'G14-capital-field-ar', 'start?lang=ar', async p => { await p.evaluate(() => document.querySelector('#capn').scrollIntoView({ block: 'center' })); await p.waitForTimeout(150); });
  await shot(i13, 'G15-words-step', 'step/s7');
  await shot(i13, 'G15-words-bank', 'bank?s=new');
  await shot(i13, 'G15-words-link-step-ar', 'step/s12?lang=ar');
  await shot(i13, 'G16-reduced-motion-building', 'building');
  await shot(i13, 'G19-tap-targets-header', 'roadmap', null, { x: 0, y: 0, width: 390, height: 110 });
  await shot(i13, 'G20-contrast-record', 'stars');
  await shot(i13, 'G21-bank-logos', 'bank?s=new', null, { x: 0, y: 190, width: 390, height: 290 });
  await shot(i13, 'G21-bank-logos-ar', 'bank?s=new&lang=ar', null, { x: 0, y: 190, width: 390, height: 290 });
  await shot(i13, 'G23-arabic-link-step', 'step/s3?s=new&lang=ar');
  await b.close(); base.close(); console.log('shots in ' + out);
})();
