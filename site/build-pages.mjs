// Generates the static HTML pages from the templates in site/templates and the
// content in src/data. Run with `node site/build-pages.mjs` (the npm scripts do
// this automatically before `vite` and `vite build`).
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products.js';
import { setPageDepth } from './lib.mjs';
import { homePage } from './templates/home.mjs';
import { productPage } from './templates/product.mjs';
import { packsPage } from './templates/packs.mjs';
import { aboutPage } from './templates/about.mjs';
import { contactPage } from './templates/contact.mjs';
import { policiesPage } from './templates/policies.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const pages = [
  ['index.html', () => homePage()],
  ...products.map((p) => [`products/${p.slug}/index.html`, () => productPage(p)]),
  ['packs/index.html', () => packsPage()],
  ['about/index.html', () => aboutPage()],
  ['contact/index.html', () => contactPage()],
  ['policies/index.html', () => policiesPage()],
];

for (const [file, render] of pages) {
  setPageDepth(file.split('/').length - 1);
  const html = render();
  const dest = path.join(ROOT, file);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, html);
  console.log(`wrote ${file} (${(html.length / 1024).toFixed(1)} KB)`);
}
