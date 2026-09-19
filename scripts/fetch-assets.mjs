// One-off asset pipeline: downloads the brand imagery from the existing
// ezmassager.co.za store, optimises it with sharp and writes it to public/images.
// Run with: node scripts/fetch-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SHOP = 'https://cdn.shopify.com/s/files/1/0074/5865/2242/products';
const FILES = 'https://ezmassager.co.za/cdn/shop/files';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

/** @type {{src:string,out:string,max?:number,q?:number,png?:boolean,alsoPng?:boolean}[]} */
const jobs = [
  // --- single products (front renders, 900x900 on white) ---
  { src: `${SHOP}/yello1_7683ed53-961c-4172-b670-8ea96aad8752.png`, out: 'products/original-2-menthol.webp', q: 92, alsoPng: true },
  { src: `${SHOP}/red_48b86f8b-a60a-447a-bd8e-897ab2b95454.png`, out: 'products/extra-strength-4-menthol.webp', q: 92, alsoPng: true },
  { src: `${SHOP}/green_b98e22db-f11b-45cf-9d84-5e998b56908e.png`, out: 'products/arnica-natural-organic-plant-oil.webp', q: 92, alsoPng: true },
  // --- alternate product shots ---
  { src: `${SHOP}/2_fff12b4c-3416-4aec-9eef-fe85cf758094.png`, out: 'products/original-2-menthol-alt-1.webp', q: 86 },
  { src: `${SHOP}/2_.2_018e2f8b-636e-4993-a044-0286a4876011.png`, out: 'products/original-2-menthol-alt-2.webp', q: 86 },
  { src: `${SHOP}/4.jpg`, out: 'products/extra-strength-4-menthol-alt-1.webp', q: 86 },
  { src: `${SHOP}/4_.2.jpg`, out: 'products/extra-strength-4-menthol-alt-2.webp', q: 86 },
  // --- value & bulk packs ---
  { src: `${SHOP}/yellow-pack.png`, out: 'products/pack-3x-original-2-menthol.webp', q: 88 },
  { src: `${SHOP}/red-pack.png`, out: 'products/pack-3x-extra-strength-4-menthol.webp', q: 88 },
  { src: `${SHOP}/3cbd.png`, out: 'products/pack-3x-arnica-natural-organic-plant-oil.webp', q: 88 },
  { src: `${SHOP}/3pack.png`, out: 'products/pack-3x-variety.webp', q: 88 },
  { src: `${SHOP}/bulk.png`, out: 'products/pack-6x-variety-2-each.webp', q: 88 },
  { src: `${SHOP}/3X43X2.png`, out: 'products/pack-6x-variety-2-and-4.webp', q: 88 },
  { src: `${SHOP}/3X43XCBD_86b2bfec-ed06-445b-8f39-d7c46dc7d27b.png`, out: 'products/pack-6x-variety-4-and-plant-oil.webp', q: 88 },
  { src: `${SHOP}/6Xcbd.png`, out: 'products/pack-6x-arnica-natural-organic-plant-oil.webp', q: 88 },
  // --- brand / site imagery ---
  { src: `${FILES}/logo_ccc29d9d-91b9-40da-8f09-f43d96f0d7ee.png`, out: 'site/logo.png', png: true },
  { src: `${FILES}/fav.png`, out: 'site/favicon-source.png', png: true },
  { src: `${FILES}/arnica.png`, out: 'site/ingredient-arnica.webp', max: 800, q: 88 },
  { src: `${FILES}/menthol_1f419bb1-8bf7-4908-8da5-d700670b43df.png`, out: 'site/ingredient-menthol.webp', max: 800, q: 88 },
  { src: `${FILES}/ginko_${''}.png`.replace('ginko_.png', 'ginko.png'), out: 'site/ingredient-ginkgo.webp', max: 800, q: 88 },
  { src: `${FILES}/root.png`, out: 'site/ingredient-ginseng-root.webp', max: 800, q: 88 },
  { src: `${FILES}/ez_0ea423a6-ee7d-44b1-a275-504c1a082827.png`, out: 'site/ez-story.webp', max: 1200, q: 85 },
  { src: `${FILES}/cbd.png`, out: 'site/plant-oil-lifestyle.webp', max: 1200, q: 85 },
  { src: `${FILES}/CBD2.png`, out: 'site/plant-oil-square.webp', max: 1400, q: 82 },
  { src: `${FILES}/cbd1_f129bc7f-5c52-49fb-a39c-311cfc008cbf.png`, out: 'site/banner-plant-oil.webp', max: 1920, q: 82 },
  { src: `${FILES}/banner4.png`, out: 'site/banner-grip.webp', max: 1920, q: 82 },
  { src: `${FILES}/banner4.2.png`, out: 'site/banner-grip-square.webp', max: 1400, q: 82 },
  { src: `${FILES}/banner5_512d490b-e93c-4413-8fc5-6fb405b7e7fd.png`, out: 'site/banner-affordable.webp', max: 1920, q: 82 },
  { src: `${FILES}/banner5.2.png`, out: 'site/banner-affordable-square.webp', max: 1400, q: 82 },
  { src: `${FILES}/1_ce0b013a-e6bc-4938-8f0f-50b729479fb9.png`, out: 'site/slide-1.webp', max: 1920, q: 82 },
  { src: `${FILES}/2_3de34e3b-e7bb-46e8-aca2-0297179a49ce.png`, out: 'site/slide-2.webp', max: 1920, q: 82 },
  { src: `${FILES}/1.png`, out: 'site/badge-1.webp', q: 90 },
  { src: `${FILES}/2.png`, out: 'site/badge-2.webp', q: 90 },
  { src: `${FILES}/3.png`, out: 'site/badge-3.webp', q: 90 },
  { src: `${FILES}/4.png`, out: 'site/badge-4.webp', q: 90 },
];

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (asset pipeline)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const manifest = [];
const thumbs = [];
const imageJobs = process.env.SKIP_IMAGES === 'true' ? [] : jobs;
for (const job of imageJobs) {
  const dest = path.join(OUT, job.out);
  await mkdir(path.dirname(dest), { recursive: true });
  try {
    const input = await fetchBuffer(job.src);
    const meta = await sharp(input).metadata();
    let pipeline = sharp(input).rotate();
    if (job.max) pipeline = pipeline.resize({ width: job.max, height: job.max, fit: 'inside', withoutEnlargement: true });
    const outBuf = job.png
      ? await pipeline.png({ compressionLevel: 9, palette: false }).toBuffer()
      : await pipeline.webp({ quality: job.q ?? 85, effort: 6 }).toBuffer();
    await writeFile(dest, outBuf);
    const outMeta = await sharp(outBuf).metadata();
    manifest.push({ file: job.out, width: outMeta.width, height: outMeta.height, bytes: outBuf.length, source: job.src, sourceWidth: meta.width, sourceHeight: meta.height, sourceFormat: meta.format });
    if (job.alsoPng) {
      const pngBuf = await sharp(input).png({ compressionLevel: 9 }).toBuffer();
      const pngDest = dest.replace(/\.webp$/, '.png');
      await writeFile(pngDest, pngBuf);
      manifest.push({ file: path.relative(OUT, pngDest), width: meta.width, height: meta.height, bytes: pngBuf.length, source: job.src });
    }
    thumbs.push({ name: job.out, buf: await sharp(input).resize(180, 180, { fit: 'contain', background: '#ffffff' }).jpeg({ quality: 70 }).toBuffer() });
    console.log(`ok   ${job.out} ${outMeta.width}x${outMeta.height} ${(outBuf.length / 1024).toFixed(0)}KB`);
  } catch (err) {
    console.error(`FAIL ${job.out}: ${err.message}`);
    manifest.push({ file: job.out, error: String(err.message) });
  }
}

// Contact sheet for quick visual review of everything that was fetched.
if (thumbs.length) try {
  const cols = 6, cell = 180, label = 22;
  const rows = Math.ceil(thumbs.length / cols);
  const composites = thumbs.map((t, i) => ({ input: t.buf, left: (i % cols) * cell, top: Math.floor(i / cols) * (cell + label) }));
  const svgLabels = thumbs.map((t, i) => {
    const x = (i % cols) * cell + 4, y = Math.floor(i / cols) * (cell + label) + cell + 15;
    const name = t.name.replace(/^.*\//, '').replace(/\.(webp|png)$/, '').slice(0, 30);
    return `<text x="${x}" y="${y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="11" fill="#111">${name}</text>`;
  }).join('');
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell}" height="${rows * (cell + label)}">${svgLabels}</svg>`);
  const sheet = await sharp({ create: { width: cols * cell, height: rows * (cell + label), channels: 3, background: '#ffffff' } })
    .composite([...composites, { input: svg, left: 0, top: 0 }])
    .jpeg({ quality: 78 }).toBuffer();
  await writeFile(path.join(OUT, 'contact-sheet.jpg'), sheet);
  console.log('ok   contact-sheet.jpg');
} catch (err) {
  console.error('contact sheet failed:', err.message);
}

// Optional verbatim downloads (e.g. generated 3D models) passed as JSON via EXTRA_FILES:
// [{"url":"https://...","out":"models/original.glb"}] — written under public/ untouched.
if (process.env.EXTRA_FILES && process.env.EXTRA_FILES.trim()) {
  const extra = JSON.parse(process.env.EXTRA_FILES);
  for (const item of extra) {
    const dest = path.join(OUT, '..', item.out);
    await mkdir(path.dirname(dest), { recursive: true });
    try {
      const buf = await fetchBuffer(item.url);
      await writeFile(dest, buf);
      manifest.push({ file: item.out, bytes: buf.length, source: item.url });
      console.log(`ok   ${item.out} ${(buf.length / 1024).toFixed(0)}KB`);
    } catch (err) {
      console.error(`FAIL ${item.out}: ${err.message}`);
      manifest.push({ file: item.out, error: String(err.message) });
    }
  }
}

await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`done: ${manifest.filter((m) => !m.error).length} ok, ${manifest.filter((m) => m.error).length} failed`);
