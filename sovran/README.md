# SOVRAN — Cloudflare Pages site

Static site, no build step. `public/` is served as-is; `functions/` holds the one Pages Function (`/api/contact`).

## Deploy
Cloudflare dashboard → Workers & Pages → Create → Pages → connect this repo:
- Root directory: `sovran`
- Build command: *(none)*
- Build output directory: `public`

Or from this folder: `npx wrangler pages deploy`.

## Local preview
`npx wrangler pages dev` (serves clean URLs, `_redirects` and the function).

## Notes
- Dials are drawn as SVG in `public/assets/site.js` (`DIALS`); swap in product photography when ready.
- `/watch?d=black|green|red|pearl` is the product page.
- The contact form validates and logs; connect real delivery at the `TODO` in `functions/api/contact.js`.
- Pricing, movement and policy copy are marked "Announced at launch" / `[Placeholder]`.
