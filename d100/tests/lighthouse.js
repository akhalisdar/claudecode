// Usage: node tests/lighthouse.js [dist/index.html]
// Lighthouse, mobile preset (simulated slow 4G, 4x CPU slowdown), on the English and the Arabic landing page.
// Prints the scores and the main timings. Exits 1 if performance is under 90 or accessibility under 95.
const path = require('path');
const fs = require('fs');
const { serveFile } = require('./serve');
(async () => {
  const { default: lighthouse } = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');
  const base = await serveFile(process.argv[2] || 'dist/index.html');
  const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH || require('playwright').chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
  let bad = 0; fs.mkdirSync('tests/out', { recursive: true });
  for (const [name, url] of [['en', base.url], ['ar', base.url + '#/landing?lang=ar']]) {
    const r = await lighthouse(url, { port: chrome.port, onlyCategories: ['performance', 'accessibility', 'best-practices'], output: 'json', logLevel: 'error' });
    const c = r.lhr.categories, a = r.lhr.audits, ms = k => Math.round(a[k].numericValue) + 'ms';
    const perf = Math.round(c.performance.score * 100), acc = Math.round(c.accessibility.score * 100), bp = Math.round(c['best-practices'].score * 100);
    if (perf < 90 || acc < 95) bad++;
    console.log(`${name}: performance ${perf}, accessibility ${acc}, best practices ${bp} | FCP ${ms('first-contentful-paint')}, LCP ${ms('largest-contentful-paint')}, TBT ${ms('total-blocking-time')}, CLS ${a['cumulative-layout-shift'].numericValue.toFixed(3)}, Speed Index ${ms('speed-index')}, interactive ${ms('interactive')}, transfer ${Math.round(a['total-byte-weight'].numericValue / 1024)}KB`);
    const fails = Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'manual' && x.scoreDisplayMode !== 'notApplicable').map(x => x.id + (x.displayValue ? ' (' + x.displayValue + ')' : ''));
    if (fails.length) console.log('   not passing: ' + fails.join(', '));
    fs.writeFileSync(path.join('tests/out', 'lighthouse-' + name + '.json'), r.report);
  }
  await chrome.kill(); base.close(); process.exit(bad ? 1 : 0);
})();
