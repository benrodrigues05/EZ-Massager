// Visual QA: screenshots of every page at desktop and mobile widths in both
// colour schemes, plus the home page at several scroll depths so the pinned
// 3D range section can be reviewed. Run `npm run build` first, then
// `npm run screenshots` (serves dist/ on port 4173 while it runs).
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = process.env.SHOTS_DIR || 'screenshots';
const BASE = process.env.SHOTS_BASE || 'http://localhost:4173';
const only = process.argv.slice(2);

const pages = [
  { name: 'home', path: '/', scrolls: [0, 0.55, 1, 1.35, 1.7, 2.35, 2.7, 3.35, 3.7], walk: true },
  { name: 'product-original', path: '/products/original-2-menthol/', scrolls: [0, 1, 2] },
  { name: 'product-plant', path: '/products/arnica-natural-organic-plant-oil/', scrolls: [0] },
  { name: 'packs', path: '/packs/', scrolls: [0, 1] },
  { name: 'about', path: '/about/', scrolls: [0, 1] },
  { name: 'contact', path: '/contact/', scrolls: [0] },
  { name: 'policies', path: '/policies/', scrolls: [0] },
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const schemes = ['light', 'dark'];

function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '';
  if (!root || !existsSync(root)) return undefined;
  const dir = readdirSync(root).find((d) => /^chromium-\d+$/.test(d));
  if (!dir) return undefined;
  for (const candidate of ['chrome-linux/chrome', 'chrome-linux64/chrome']) {
    const p = path.join(root, dir, candidate);
    if (existsSync(p)) return p;
  }
  return undefined;
}

const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
await mkdir(OUT, { recursive: true });

const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-gpu-sandbox'];
let browser;
try {
  browser = await chromium.launch({ args });
} catch (err) {
  const executablePath = findChromium();
  if (!executablePath) throw err;
  browser = await chromium.launch({ args, executablePath });
}

try {
  for (const vp of viewports) {
    for (const scheme of schemes) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: scheme, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
      for (const p of pages) {
        if (only.length && !only.includes(p.name)) continue;
        await page.goto(BASE + p.path, { waitUntil: 'networkidle' });
        await page.waitForSelector('body.has-3d', { timeout: 12000 }).catch(() => {});
        await page.waitForTimeout(900);
        for (const s of p.scrolls) {
          await page.evaluate((y) => window.scrollTo(0, y), Math.round(s * vp.height));
          await page.waitForTimeout(1100);
          const file = `${p.name}-${vp.name}-${scheme}-${String(s).replace('.', '_')}vh.png`;
          await page.screenshot({ path: path.join(OUT, file) });
        }
        if (p.walk) {
          const total = await page.evaluate(() => document.documentElement.scrollHeight);
          for (let y = 4 * vp.height, i = 0; y < total; y += Math.round(vp.height * 0.85), i++) {
            await page.evaluate((y) => window.scrollTo(0, y), y);
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(OUT, `${p.name}-${vp.name}-${scheme}-walk-${String(i).padStart(2, '0')}.png`) });
          }
        }
        if (!p.walk) {
          await page.evaluate(() => {
            document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
            document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
          });
          await page.waitForLoadState('networkidle');
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(OUT, `${p.name}-${vp.name}-${scheme}-full.png`), fullPage: true });
        }
      }
      if (errors.length) console.log(`[${vp.name}/${scheme}] console:`, [...new Set(errors)].slice(0, 8).join('\n  '));
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}
console.log('screenshots written to', OUT);
