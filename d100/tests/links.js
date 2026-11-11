// Usage: node tests/links.js [extra urls...]
// Reads every external URL from src/app.js and asks each one for its status with curl (redirects followed).
// Prints one line per link. Exits 1 if any link is not 200. Sites that refuse automated requests show as 403:
// those have to be opened by hand.
const { execFileSync } = require('child_process');
const fs = require('fs');
const src = fs.readFileSync('src/app.js', 'utf8');
const urls = [...new Set([...(src.match(/https:\/\/[^'"`\s)<]+/g) || []), ...process.argv.slice(2)])];
let bad = 0;
for (const u of urls) {
  let line;
  try {
    line = execFileSync('curl', ['-sS', '-L', '--max-redirs', '6', '-m', '30', '-o', '/dev/null', '-A', 'd100-link-check/1.0', '-H', 'Accept: text/html', '-w', '%{http_code} %{url_effective}', u], { encoding: 'utf8' }).trim();
  } catch (e) { line = '000 ' + String(e.stderr || e.message).trim().split('\n').pop(); }
  const code = line.slice(0, 3); if (code !== '200') bad++;
  const fin = line.slice(4);
  console.log(`${code}  ${u}${fin && fin !== u && fin !== u + '/' ? '  ->  ' + fin : ''}`);
}
console.log(bad ? `${bad} of ${urls.length} not confirmed` : `all ${urls.length} links return 200`);
process.exit(bad ? 1 : 0);
