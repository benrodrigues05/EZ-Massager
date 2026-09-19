// Composes the link-preview image (public/images/og-cover.jpg, 1200x630) from
// the site's own styles, fonts and product photography. Run after `npm run build`.
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '';
  if (!root || !existsSync(root)) return undefined;
  const dir = readdirSync(root).find((d) => /^chromium-\d+$/.test(d));
  if (!dir) return undefined;
  for (const c of ['chrome-linux/chrome', 'chrome-linux64/chrome']) {
    const p = path.join(root, dir, c);
    if (existsSync(p)) return p;
  }
  return undefined;
}

const BASE = 'http://localhost:4173';
if (!existsSync('dist/index.html')) throw new Error('Build the site first (npm run build).');

const style = `
  html, body { margin: 0; background: #f4f2ed; }
  .og { width: 1200px; height: 630px; display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; padding: 0 64px; box-sizing: border-box; overflow: hidden; }
  .og__copy { display: grid; gap: 22px; justify-items: start; }
  .og__copy .logo { height: 48px; width: auto; }
  .og__copy .display { font-size: 92px; line-height: 0.95; letter-spacing: -0.035em; max-width: 8ch; }
  .og__copy .lede { font-size: 22px; max-width: 26ch; }
  .og__stage { position: relative; height: 630px; }
  .og__stage img { position: absolute; mix-blend-mode: multiply; }
  .og__stage .a { width: 300px; left: -10px; top: 185px; }
  .og__stage .b { width: 300px; left: 240px; top: 185px; }
  .og__stage .c { width: 380px; left: 80px; top: 60px; }
`;
const body = `<div class="og">
  <div class="og__copy">
    <img class="logo" src="${BASE}/images/site/logo.png" alt="">
    <h1 class="display">Roll away the pain.</h1>
    <p class="lede">Patented dual rollers with fast-acting Arnica and Menthol gel. Free delivery across South Africa.</p>
  </div>
  <div class="og__stage">
    <img class="a" src="${BASE}/images/products/extra-strength-4-menthol.webp" alt="">
    <img class="b" src="${BASE}/images/products/arnica-natural-organic-plant-oil.webp" alt="">
    <img class="c" src="${BASE}/images/products/original-2-menthol.webp" alt="">
  </div>
</div>`;

const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  const executablePath = findChromium();
  if (!executablePath) throw err;
  browser = await chromium.launch({ executablePath });
}
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(({ style, body }) => {
    document.body.className = '';
    document.body.innerHTML = body;
    const el = document.createElement('style');
    el.textContent = style;
    document.head.appendChild(el);
  }, { style, body });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile('public/images/og-cover.jpg');
  console.log('wrote public/images/og-cover.jpg');
} finally {
  await browser.close();
  server.kill();
}
