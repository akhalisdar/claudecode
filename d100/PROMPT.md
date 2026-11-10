# Task: make D100 glitch-free on phones and ship a static build for Cloudflare Pages

Read CLAUDE.md first. It holds the product, the architecture, the design system and the lines you must not cross.

## Situation
Judges open d100.ae on their own phones, mostly iPhone Safari, in English or Arabic, and tap around for under two minutes. They are not invested. Anything broken, confusing or slow loses them. The current build passes a click-through in headless Chrome only. It has never run on Safari.

## Priorities
- P0: broken or blank on iPhone Safari, or broken in Arabic.
- P1: anything that makes a judge hesitate: dead ends, unclear next action, layout jumps, hidden or covered buttons, walls of text.
- P2: polish and speed.
Finish P0 and P1 before P2. Do not redesign, do not add features, do not add dependencies to the shipped site.

## Phase 0. Baseline
1. `npm i -D playwright && npx playwright install chromium webkit`
2. `python3 build.py && node tests/flow.js dist/index.html`. It must print "no errors". If not, stop and tell me.
3. `git init` and commit as "baseline".

## Phase 1. Find every glitch before fixing any
Write `tests/audit.js`. Run it on WebKit (iPhone SE, iPhone 13, iPhone 15 Pro Max) and Chromium (Pixel 7, desktop 1440x900), in English and Arabic, over every route and every state: fresh day 1, demo day 37, step done, step skipped, step locked, skip warning open, programme sheet open, own provider typed, bank picked.
Record per screen: console errors, horizontal overflow, clipped or overlapping text, anything hidden behind the tab bar or the sticky button bar, tap targets under 44px, contrast under 4.5:1, images not loaded, broken Arabic letter joins, layout shift on load.
Then act like a judge: land, start the demo, do a step, skip a step, open a live link and come back, switch language mid-flow, press back, refresh, rotate the phone.
Write `GLITCHES.md`: id, severity, device, language, route, what happens, screenshot. Take a "before" screenshot for each.

### Glitches I saw on my phone (treat as P0)
<!-- Ahmed: one per line. Put screenshots in /glitches. -->
-

### Suspected from code review (confirm, then fix)
1. `split(/(?<=[.!؟])\s/)` uses regex lookbehind. Safari before iOS 16.4 fails to parse it, which blanks the whole app. Replace with a split that needs no lookbehind.
2. Nothing is saved. A refresh or a returning tab drops the judge back to the start. Persist `S` and the language in localStorage (try/catch, versioned key) and keep "Reset demo" in More.
3. Live links: after opening an official site in a new tab the button should read "Done. Stamp it" when the judge returns. It runs on a 400 ms timer now. Use `visibilitychange`/`pageshow` so it survives iOS suspending the tab.
4. iOS viewport: check `100vh` against the collapsing address bar (use `dvh` with a fallback), `env(safe-area-inset-bottom)` under the tab bar and sticky bar, and the `.sticky{bottom:-30px}` hack. The main button and "Skip for now" must always be fully visible.
5. Inputs under 16px font size make iOS zoom the page on focus (`#own`, `#biz`).
6. Sheets (skip warning, programme): add `role="dialog"`, focus trap, Escape and back-button close, background scroll lock.
7. After a stamp: scroll to top of the next step, move focus to its heading, make sure the toast never covers the button, guard against double taps.
8. Back button: from a step it should return to the plan at the same scroll position, never loop.
9. Capital input: slider stops at 1,000,000 while the field accepts 5,000,000. Make them agree and show thousands separators.
10. Arabic: mirrored chevrons and back arrows, slider direction, mixed strings such as "UP by CBD" and AED amounts wrapped in `<bdi>`, Western numerals throughout, no Arabic on curves.
11. Bank tiles: logos at even optical size and sharp at 3x, alt text on each.
12. Links: confirm every external URL returns 200 on the official domain. Where an official service page exists (corporate tax registration, food permit, tenancy registration, trade licence, SME in a Box), link to it. If you cannot confirm it, keep the home page and list it in the report.
13. Words: no screen should show more than about 40 words before the main button. Move the rest into "Learn more".

## Phase 2. Fix
- One commit per glitch id. Rebuild and rerun `tests/flow.js` on both engines after each batch.
- Extend `tests/flow.js` so every fixed glitch has a check.
- Keep both languages in step. Put any Arabic you write or change in `AR-REVIEW.md` for me to proofread.
- If a fix needs a product decision, pick the option that removes a step for the judge and note it.

## Phase 3. Static output for Cloudflare Pages
Produce `dist/`, deployable by direct upload with no build command:
- `index.html` as the app shell with critical CSS inline; JS, CSS, fonts and logos as hashed files in `dist/assets/` instead of base64. Preload the fonts used above the fold. Target: first screen usable in under 1.5 s on throttled 4G.
- Static stub pages so clean URLs work without server rules: `/plan/`, `/bank/`, `/cash/`, `/record/`, `/providers/`, `/plans/`, `/day100/`, `/ar/`. Each is a real HTML file that forwards to the matching hash route and has a plain link as fallback.
- `404.html` that returns to the app.
- `_headers`: long immutable cache on `/assets/*`, no-cache on HTML, `X-Robots-Tag: noindex`, and a CSP that allows only self (plus `data:` for images).
- Favicon, apple-touch-icon and an Open Graph image built from the D100 stamp. Never from a bank logo.
- Keep `python3 build.py offline/d100-offline.html` working as the single-file fallback for a venue with no wifi.
- Do not deploy. Give me the exact command and stop.

## Phase 4. Prove it
- `tests/flow.js` and `tests/audit.js` green on WebKit and Chromium, both languages, zero console errors, no overflow from 320 to 430 px wide.
- Lighthouse mobile: performance 90+, accessibility 95+.
- Rerun `node tests/shoot.js dist/index.html screens` for the pitch deck.
- Final report, short: glitches fixed (id, one line, before/after screenshot), what you could not fix and why, links you could not confirm, Arabic lines waiting for my review, the deploy command.

## Working rules
- Show me `GLITCHES.md` before fixing if it has more than 25 items. Otherwise keep going without asking.
- If something in this prompt conflicts with CLAUDE.md, CLAUDE.md wins.
