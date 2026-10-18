// Optional migration check: same rendered document, old and new stylesheet engines.
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const [directory, baselineCss, article = '/en/posts/markdown-syntax/'] = process.argv.slice(2);
if (!directory || !baselineCss) throw new Error('Usage: node scripts/compare-styles.cjs OUTPUT BASELINE_CSS [ARTICLE]');
const root = path.resolve(directory);
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const snapshots = [];
      for (const old of [true, false]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.route('**/*', route => {
          const url = new URL(route.request().url());
          if (url.hostname !== '127.0.0.1') return route.abort();
          if (old && url.pathname === '/css/main.min.css') return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(baselineCss) });
          return route.continue();
        });
        await page.goto('http://127.0.0.1:4173' + article);
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
        const states = [];
        for (let i = 0; i < 5; i++) {
          await page.getByRole('button', { name: 'Select Theme Button', exact: true }).filter({ visible: true }).click();
          await page.locator('.select-theme:visible .select-theme__item').nth(i).click();
          states.push(await page.evaluate(() => ['body', '.wrapper', '.single__contents', '.single__contents h1', '.single__contents p', '.navbar'].map(selector => {
            const el = document.querySelector(selector);
            if (!el) return null;
            const s = getComputedStyle(el);
            return { selector, width: Math.round(el.getBoundingClientRect().width), color: s.color, background: s.backgroundColor, font: s.fontFamily, size: s.fontSize, display: s.display };
          })));
        }
        snapshots.push(states);
        await page.screenshot({ path: `.build/${old ? 'before' : 'after'}-${width}.png` });
        await page.close();
      }
      assert.deepEqual(snapshots[1], snapshots[0], `Style regression at ${width}px`);
      console.log(`Matched old/new computed styles: ${width}px, all five palettes`);
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
