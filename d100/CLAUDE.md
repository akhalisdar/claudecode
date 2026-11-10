# D100: project context

## What it is
D100 (d100.ae) is a hackathon prototype for a challenge run with Commercial Bank of Dubai (CBD), Dubai's Department of Economy and Tourism and Dubai SME: make the first 100 days of a new business simpler. It is a guided step-by-step plan from trade licence to day 100. Each step has one action, a vetted provider or a live link to the official site, and a stamp when done. Verified activity earns stars (never bought), stars unlock staged credit, and graduates become providers. Tiers: Free, Pro (AED 149/month), Executive (AED 999/month), plus an Emirati tier.

Audience for this build: judges on their own phones, English or Arabic, under two minutes of attention.

## Lines you must not cross
- Every screen shows "Hackathon prototype. Sample data." Partners are "proposed". CBD's logo sits next to "Not an official CBD product."
- No field may collect real personal, banking or login details. No analytics, trackers or third-party requests.
- Provider names are invented and labelled sample. Do not use real company names as providers.
- Logos: use only the files in assets/logos. Never redraw, recolour or recreate a logo. Other banks are "options, not partners".
- Numbers in the copy are sourced (list at the bottom). Do not change or invent statistics, fees, penalties or dates.
- External links go only to official domains. If you cannot confirm a deeper URL, keep the home page.

## Architecture
- Vanilla JS, no framework. `build.py` joins `src/head.html` (HTML shell + all CSS), `src/data.js` (copy `TX` in en/ar, steps `CAFE`/`SHOP`, providers `P`, programmes `PROG`, cash model, scoring) and `src/app.js` (v2 copy overlay, drawn SVG objects, screens `SC`, router, handlers), and inlines fonts and logos as base64. Output: `dist/index.html`, one file, zero requests.
- Hash routes: `#/landing #/start #/building #/roadmap #/step/s1..s15 #/bank #/cash #/stars #/market #/programmes #/nudges #/tiers #/day100 #/more #/shots`. Query in the hash: `?lang=en|ar`, `?s=after|slam|new|skip|warn` (demo states for screenshots).
- State is one object `S` in memory (biz, activity, emirati, capital, day, done{}, skip{}, picks{}, extra[], bankPick, warn, sheet, unlock). Nothing is persisted. Demo persona: Layla, Sidr Specialty Coffee, day 37, AED 150,000, steps s1 to s6 done.
- Scoring: 6 points per stamped step, 1 per 5 days, 5 for two months of runway. Stars at 10/30/50/70/90. Credit by star: 0, 0, 10k, 25k, 50k, 100k.
- Prerequisites live in `PRE`. A step is blocked until each prerequisite is done or skipped. `nextOpen()` picks the next actionable step.
- Arabic: full RTL via `dir` on `<html>`. Drawn SVGs are forced `direction:ltr` and mirrored by hand. Arabic text must never sit on an SVG textPath or have letter-spacing (it breaks the joins on iOS).

## Design system (do not drift)
Paper #F4F4F1, ink #111318, ink2 #555A66, rule #D6D6CF, off #B4B6BE. Colour carries meaning: blue #2845A6 = done or cleared, red #C2311D = money at risk, brass #8F6A1B = earned. IBM Plex Sans, Sans Arabic, Serif (headings), Mono. Signature objects: round stamp, 100-day ruler, brass plaque, licence card. No gradients, no emoji, no drop-shadow cards, no purple. It should look like an official document, not a SaaS template.

## Commands
- `python3 build.py` builds `dist/index.html`
- `node tests/flow.js dist/index.html` runs the click-through (set `BROWSER=webkit` for Safari's engine). Must print "no errors".
- `node tests/shoot.js dist/index.html screens` captures every screen at 390x844 @3x in en and ar for the pitch deck.

## Sourced facts used in the copy
Dubai Chamber: 71,830 new member companies in 2025. Corporate tax registration within 3 months of incorporation, AED 10,000 penalty. VAT mandatory at AED 375,000 turnover, voluntary at AED 187,500. SME in a Box (DET and Dubai SME, June 2026). UP by CBD (July 2026): onboarding from the Dubai Unified Licence, zero-balance account on subscription plans, business credit card.
