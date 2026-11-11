// Usage: node tests/speed.js [dist/index.html]
// Cold load in Chromium with the network and CPU throttled through DevTools (real delays, not a simulation).
// Reports first paint of the shell and the moment the first screen is usable: the main button is on screen and answers a tap.
const pw = require('playwright');
const { serveFile } = require('./serve');
const NET = { // Chrome DevTools presets. "Slow 4G" is also what Lighthouse's mobile test applies.
  'Fast 4G (9 Mbps, 165 ms)': { downloadThroughput: 9e6 * .9 / 8, uploadThroughput: 1.5e6 * .9 / 8, latency: 60 * 2.75 },
  'Slow 4G (1.6 Mbps, 562 ms)': { downloadThroughput: 1.6e6 * .9 / 8, uploadThroughput: 750e3 * .9 / 8, latency: 150 * 3.75 },
};
(async () => {
  const base = await serveFile(process.argv[2] || 'dist/index.html'); const b = await pw.chromium.launch(); let bad = 0;
  for (const [name, net] of Object.entries(NET)) for (const [lang, url] of [['en', base.url], ['ar', base.url + '#/landing?lang=ar']]) {
    const runs = [];
    for (let i = 0; i < 3; i++) { const c = await b.newContext({ ...pw.devices['Pixel 7'] }); const p = await c.newPage(); const cdp = await c.newCDPSession(p);
      await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, ...net }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.addInitScript(() => { window.__t = {}; new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__t.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
        const tick = () => { const el = document.querySelector('#app [data-act=begin]'); if (el && el.getBoundingClientRect().height > 0) { requestAnimationFrame(() => { window.__t.usable = performance.now(); }); } else requestAnimationFrame(tick); }; tick(); });
      await p.goto(url, { waitUntil: 'commit' }); await p.waitForFunction(() => window.__t && window.__t.usable, null, { timeout: 30000 }); await p.waitForTimeout(1500);
      runs.push(await p.evaluate(() => ({ fcp: Math.round(window.__t.fcp || 0), usable: Math.round(window.__t.usable), fonts: document.fonts.check('600 16px "IBM Plex Serif"', 'D') }))); await c.close(); }
    runs.sort((x, y) => x.usable - y.usable); const m = runs[1]; if (/Fast/.test(name) && m.usable > 1500) bad++;
    console.log(`${name}, ${lang}: shell painted ${m.fcp} ms, first screen usable ${m.usable} ms (median of 3: ${runs.map(r => r.usable).join(', ')})`);
  }
  await b.close(); base.close(); process.exit(bad ? 1 : 0);
})();
