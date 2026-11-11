# D100 glitch list

Found by `tests/audit.js` (55 screens x 2 languages x 5 devices = 550 screen checks, plus a 12-part judge journey per device and language) and by reading the source for things no current engine shows.

Devices: WebKit as iPhone SE (320x568), iPhone 13 (390x664), iPhone 15 Pro Max (430x739); Chromium as Pixel 7 (412x839) and desktop 1440x900.

What the audit can and cannot see. Playwright's WebKit is Safari's engine built for Linux, the current version. It has no collapsing address bar, no home indicator, no focus zoom and no old-iOS parser. Glitches that depend on those are marked **source** and were confirmed by reading the code, not by reproduction. Nothing here was run on a physical iPhone.

Clean results worth knowing: no console errors, no sideways scroll at any width from 320 to 1440, no clipped text, no image that failed to load, no Eastern Arabic numerals, no Arabic on a curved path, no layout shift on load, no third-party request. `#own` and `#biz` are already 16px, so iOS does not zoom on focus (suspect 5 is not a glitch).

Before screenshots are in `glitches/before/`, after screenshots in `glitches/after/` under the same file name.

## P0: blank or broken on iPhone Safari, or broken in Arabic

| id | device | lang | route | what happens | before |
|---|---|---|---|---|---|
| G01 | iPhone, iOS before 16.4 (source) | both | every route | `split(/(?<=[.!؟])\s/)` is used twice (plan card, step). Regex lookbehind is a syntax error on Safari before 16.4, so the whole script fails to parse and the page stays blank. | none possible: page is blank |
| G02 | iPhone, iOS before 15.4 (source) | both | every route | `#stage`, `#dock` and `#device` are sized with `100dvh` and nothing else. Older Safari drops the rule and falls back to the desktop frame, 864px tall, so the tab bar and the main button sit below the screen. | none possible |
| G03 | all WebKit devices | ar (and the Arabic lines on the licence card in en) | 37 of 55 screens, e.g. `#/step/s7`, `#/tiers`, `#/start`, `#/bank` | Any word written with alef then fathatan (اً: شهرياً، مزوّداً، مؤسساً، أولاً، مسبقاً، مجاناً) is lifted off the baseline and the mark turns into a stroke through the alef. Reproduced with IBM Plex Sans Arabic alone in WebKit; Chromium draws it correctly. Tanween before the alef (ًا) draws correctly in both. | `G03-arabic-tanween-step.png`, `G03-arabic-tanween-plans.png` |
| G04 | all | ar | `#/tiers`, every screen with a plan tag (cash, record, messages, day 100, skip warning) | Letter-spacing on Arabic text: the plan tag (`.up i`, "برو", "التنفيذية", 0.04em) and the price (`.tier .p`, "149 درهم", -0.01em). CLAUDE.md: letter-spacing breaks the joins on iOS. | `G04-arabic-letter-spacing.png` |
| G05 | all | both | every route | Nothing is saved. A refresh, or iOS reloading the tab after the judge visits an official site, drops progress back to Layla day 37 and the language back to English. The landing button also resets progress every time it is tapped. | journey J08 |

## P1: makes a judge hesitate

| id | device | lang | route | what happens | before |
|---|---|---|---|---|---|
| G06 | iPhone SE, iPhone 13 | both | `#/landing` | The main button is below the fold: it starts at 733 of 568px on iPhone SE and is cut in half at 621 to 671 of 664px on iPhone 13. At 320px the trade name on the licence card wraps to seven lines. | `G06-landing-iphone-se.png`, `G06-landing-iphone-13.png`, `G06-landing-iphone-se-ar.png` |
| G07 | all | both | any step after a stamp or a skip | The toast sits at a fixed 76px from the bottom, on top of "Skip for now", and ignores the home-indicator inset. When it expires it re-renders the screen, which drops focus and closes the keyboard if the judge has started typing. | `G07-toast-over-buttons.png` |
| G08 | all | both | `#/stars` after a stamp earns a star; any step after a stamp | Focus stays on `<body>` after a stamp, so a screen reader is left on nothing. On the star screen the "Next" button is 940px down, after 75 words. | `G08-star-earned-next-button.png` |
| G09 | all | both | `#/step/*`, `#/bank` to `#/roadmap` | The in-app Back link adds a history entry, so the phone's back button bounces to the step again (plan, step, plan, step). The plan always reopens at the top, losing the judge's place, with either back. | journey J09, J09b, J09c |
| G10 | all | both | skip warning, programme sheet | Sheets have no `role="dialog"`, do not take or trap focus, do not close on Escape, and the page behind still scrolls. The phone's back button leaves the step instead of closing the sheet. | `G10-skip-warning.png`, `G10-programme-sheet-ar.png` |
| G11 | iPhone (source) | both | steps with a live link, `#/bank` | "Done. Stamp it" appears on a 400ms timer, whether or not the judge left. iOS can suspend the tab before it fires. | journey J07b |
| G12 | all phones, landscape | both | `#/step/*`, `#/bank`, `#/start` | Rotated, the action bar is 129px of a 320px screen and 41px of content is left. With `viewport-fit=cover` there is no left or right safe-area padding, so the notch covers content. | `G12-landscape-step.png` |
| G13 | iPhone (source) | both | `#/step/*`, `#/bank`, `#/start` | The action bar is `position:sticky; bottom:-30px` inside the scroller, a hack against the scroller's padding, with no safe-area padding of its own. It measured correctly in both engines, but sticky inside a momentum scroller is the part of iOS most likely to misplace it. | `G15-words-step.png` (same bar) |
| G14 | all | both | `#/start` | The capital field accepts 5,000,000 and the slider stops at 1,000,000. The field shows 150000 with no separators and browser spin buttons. | `G14-capital-field.png`, `G14-capital-field-ar.png` |
| G15 | all | both | `#/step/*` with providers or a live link, `#/bank`, `#/stars` after a star, `#/programmes` (ar) | More than 40 words of prose before the main button: 46 to 53 on provider and link steps, 71 on the bank step, 75 on the star screen. | `G15-words-step.png`, `G15-words-bank.png`, `G15-words-link-step-ar.png` |
| G16 | any phone with Reduce Motion on | both | `#/building` | The three progress lines start at opacity 0 and only an animation reveals them. Reduce Motion turns animations off, so the judge watches a stamp and a blank screen for 2.6 seconds. | `G16-reduced-motion-building.png` |
| G17 | all | both | every route | No double-tap guard: no `touch-action`, so a quick second tap zooms the page on iOS, and a double tap on "Skip anyway" lands on the next step's "Skip for now" and opens its warning (seen on desktop Chromium). | journey J06e |
| G18 | all | both | `#/start` | A typed business name is lost when the language is switched. | journey J11b |

## P2: polish and speed

| id | device | lang | route | what happens | before |
|---|---|---|---|---|---|
| G19 | all phones | both | every route | Tap targets under 44px: language switch 24x45, D100 wordmark 55x22, text links 44px short by a fraction (inline message links 35), plan upsell row 43, short category tabs 40 wide in Arabic, capital slider 30 high. | `G19-tap-targets-header.png` |
| G20 | all | both | `#/stars`, `#/day100`, provider lists | Contrast under 4.5:1: plaque captions at 80% opacity, 4.36:1. Brass on paper (graduate tag, star labels under the meter) is 4.49:1. | `G20-contrast-record.png` |
| G21 | all | both | `#/bank`, `#/landing` | Bank logos are at uneven optical sizes (Wio fills its tile, ADIB and DIB are a third of that). The CBD logo on the landing page is 300px wide and needs 366px to be sharp at 3x. Alt text is present on every tile. | `G21-bank-logos.png`, `G21-bank-logos-ar.png` |
| G22 | all | both | steps s3, s12, s13, `#/bank` | Links go to home pages where a confirmed official service page exists (corporate tax registration, Ejari, e-invoicing). The Mashreq link redirects to a personal-banking page over plain http. See "Links" below. | none |
| G23 | all | ar | steps with a live link, plan header, provider lists | Arabic polish: the external-link arrow is not mirrored; Latin names inside Arabic sentences (bank names, provider names, a typed business name, the domain in "يفتح tax.gov.ae") are not isolated with `<bdi>`. Chevrons, back arrows, the ruler, the chart and the slider are already mirrored correctly; numerals are Western throughout. | `G23-arabic-link-step.png` |

Found while fixing:

| id | device | lang | route | what happens | before |
|---|---|---|---|---|---|
| G24 | all | both | `#/stars` after a stamp earns a star | The star screen always says "Setting up payroll on time moved your record to 54", whichever step earned the star. A judge who stamps the food inspection first is told about payroll. | `G08-star-earned-next-button.png` (same box) |

## Not a glitch

- Suspect 5, inputs under 16px: `#own` and `#biz` compute to 16px, `#capn` to 26px.
- "Day" label and the big day number overlap by 9px in their line boxes (line-height 0.86). The glyphs do not touch.
- The last button on Day 100 ("List my business as a provider") is below the fold. It is a closing action after the content, not the next step.

## Links

Checked with `node tests/links.js` (plain `curl`, redirects followed).

| link | result |
|---|---|
| tax.gov.ae | 200. Service page confirmed: `tax.gov.ae/en/services/corporate.tax.registration.aspx` (and `/ar/`) |
| dubailand.gov.ae | 200. Service page confirmed: `dubailand.gov.ae/en/eservices/register-renew-ejari-contract` (and `/ar/`) |
| mof.gov.ae | 200. E-invoicing page confirmed: `mof.gov.ae/en/about-us/initiatives/einvoicing/` |
| www.dm.gov.ae | 200. No food-permit service page could be confirmed, so the home page stays |
| www.emiratesnbd.com, www.adib.ae, www.rakbank.ae, www.dib.ae, www.bankfab.com | 200 |
| www.mashreq.com | redirects to `http://mashreq.com/en/uae/neo/` (personal banking). `www.mashreq.com/en/uae/business/` returns 200 |
| www.cbd.ae, www.adcb.com, www.investindubai.gov.ae, sme.ae | 403 "Access Denied" to automated requests (the sites' own bot protection). Not confirmed from here; open by hand |
| www.wio.io | redirects to `wio.io`, which this environment cannot reach. Not confirmed |
| SME in a Box | No official page found on a DET domain. `sme.ae` stays |
