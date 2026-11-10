// Usage: node tests/shoot.js dist/index.html screens [quick]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const file = 'file://' + path.resolve(process.argv[2]);
  const out = path.resolve(process.argv[3]);
  const quick = process.argv[4] === 'quick';
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const errors = [];
  const screens = [
    ['01-landing', 'landing'], ['02-your-licence', 'start'], ['03-plan', 'roadmap'], ['04-step-payroll', 'step/s7'],
    ['05-bank-step', 'bank?s=new'], ['05b-skip-warning', 'step/s7?s=warn'], ['03b-plan-skipped', 'roadmap?s=skip'], ['06-cash-view', 'cash'], ['07-record', 'stars'], ['08-providers', 'market'],
    ['09-programmes', 'programmes'], ['10-messages', 'nudges'], ['11-plans', 'tiers'], ['12-day-100', 'day100'],
    ['04b-step-corporate-tax', 'step/s12'], ['04c-step-stamped', 'step/s4'], ['04d-stamp-moment', 'step/s7?s=slam'],
    ['07b-star-earned', 'stars?s=after'], ['06b-cash-after-payroll', 'cash?s=after'],
  ];
  const langs = ['en', 'ar'];
  for (const lang of langs) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: quick ? 1 : 3, reducedMotion: 'reduce' });
    for (const [name, route] of screens) {
      const page = await ctx.newPage();
      page.on('console', m => { if (m.type() === 'error') errors.push(`${route}: ${m.text()}`); });
      page.on('pageerror', e => errors.push(`${route}: ${e.message}`));
      const sep = route.includes('?') ? '&' : '?';
      await page.goto(`${file}#/${route}${sep}lang=${lang}`);
      await page.waitForTimeout(250);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, `${lang}-${name}.png`) });
      if (name === '01-landing') await page.screenshot({ path: path.join(out, `${lang}-01-landing-full.png`), fullPage: false }).catch(() => {});
      await page.close();
    }
    await ctx.close();
  }
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: quick ? 1 : 2, reducedMotion: 'reduce' });
  for (const lang of langs) {
    const p = await desk.newPage();
    p.on('pageerror', e => errors.push(`desktop: ${e.message}`));
    await p.goto(`${file}#/roadmap?lang=${lang}`);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `${lang}-00-desktop.png`) });
    await p.goto(`${file}#/shots?lang=${lang}`);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `${lang}-00-all-screens.png`), fullPage: true });
    await p.close();
  }
  await desk.close();

  await browser.close(); console.log(errors.length ? errors.join('\n') : 'shots ok'); return;
})();
