// Tiny static server for tests. Serves a folder the way Cloudflare Pages would:
// directory indexes, 404.html on a miss, and the rules in _headers (if the folder has one).
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };

function parseHeaders(file) {
  if (!fs.existsSync(file)) return [];
  const rules = []; let cur = null;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) { cur = { pattern: raw.trim(), headers: [] }; rules.push(cur); continue; }
    if (cur && raw.trim().startsWith('!')) { cur.headers.push([raw.trim(), '']); continue; }
    const i = raw.indexOf(':'); if (cur && i > 0) cur.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
  }
  for (const r of rules) r.re = new RegExp('^' + r.pattern.split('*').map(s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return rules;
}

function serve(root, single) {
  root = path.resolve(root);
  const rules = parseHeaders(path.join(root, '_headers'));
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (single && p === '/') p = '/' + single;
    let file = path.join(root, p);
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(308, { Location: p + '/' }); res.end(); return; }
      file = path.join(file, 'index.html');
    }
    let status = 200;
    if (!fs.existsSync(file)) { status = 404; file = path.join(root, '404.html'); if (!fs.existsSync(file)) { res.writeHead(404); res.end('not found'); return; } }
    const headers = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' };
    // Cloudflare's rules: every matching block applies; "! Name" removes a header set by an earlier block; a repeated header is joined with a comma
    for (const r of rules) if (r.re.test(p)) for (const [k, v] of r.headers) { if (k.startsWith('!')) delete headers[k.slice(1).trim()]; else headers[k] = headers[k] && k !== 'Content-Type' ? headers[k] + ', ' + v : v; }
    // compress text the way Cloudflare does, so measured transfer sizes are realistic
    let body = fs.readFileSync(file);
    if (/\.(html|js|css|svg)$/.test(file) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) { body = zlib.gzipSync(body); headers['Content-Encoding'] = 'gzip'; }
    res.writeHead(status, headers); res.end(body);
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok({ url: 'http://127.0.0.1:' + server.address().port, close: () => server.close() })));
}

// target: path to an .html file. Serves its folder; returns the URL of that file ("/" when it is index.html).
async function serveFile(target) {
  const abs = path.resolve(target || 'dist/index.html');
  const base = path.basename(abs);
  const s = await serve(path.dirname(abs), base === 'index.html' ? null : base);
  return { url: s.url + '/', origin: s.url, close: s.close };
}

module.exports = { serve, serveFile };
if (require.main === module) serve(process.argv[2] || 'dist').then(s => console.log(s.url));
