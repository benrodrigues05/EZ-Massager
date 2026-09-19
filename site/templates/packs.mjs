import { checkoutUrl, packs, products, rand, storeProductUrl } from '../../src/data/products.js';
import { esc, icons, url } from '../lib.mjs';
import { layout } from './layout.mjs';

const card = (pack) => {
  const saving = pack.compareAt ? pack.compareAt - pack.price : 0;
  const pct = saving > 0 ? Math.round((saving / pack.compareAt) * 100) : 0;
  return `
<article class="pack" id="${pack.id}" data-reveal>
  <figure class="pack__media"><img src="${url(pack.image)}" alt="${esc(pack.name)}" width="900" height="900" loading="lazy"></figure>
  <div class="pack__body">
    <h3 class="h3">${esc(pack.name)}</h3>
    <p class="muted">${esc(pack.contents)}</p>
    <p class="pack__price">
      <span class="price__amount">${rand(pack.price)}</span>
      ${saving > 0 ? `<s>${rand(pack.compareAt)}</s><span class="badge">Save ${pct}%</span>` : ''}
    </p>
    <p class="small muted">${rand(pack.price / pack.colours.length)} per massager, free SA delivery</p>
    <div class="btn-row">
      <a class="btn btn--dark" href="${checkoutUrl(pack.variantId)}" rel="noopener">Buy now ${icons.arrow}</a>
      <a class="btn btn--ghost" href="${storeProductUrl(pack.handle)}" rel="noopener">View on store</a>
    </div>
  </div>
</article>`;
};

export const packsPage = () =>
  layout({
    title: 'Value packs and bulk packs | EZ Massager',
    description: 'Save on EZ Massager with 3-packs from R420 and 6-packs from R620. Mix and match Original 2% Menthol, Extra Strength 4% Menthol and Arnica + Natural Organic Plant Oil.',
    path: '/packs/',
    bodyClass: 'page-packs',
    script: '/src/page.ts',
    body: `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow" data-reveal>Shop and save</p>
    <h1 class="h1" data-reveal>Buy more, pay less per roll.</h1>
    <p class="lede" data-reveal>Every pack ships free anywhere in South Africa. Keep one in the gym bag, one in the car and one next to the bed.</p>
  </div>
</section>
<section class="section" id="value">
  <div class="container">
    <h2 class="h2" data-reveal>Value packs</h2>
    <div class="pack-list">${packs.filter((p) => p.kind === 'value').map(card).join('')}</div>
  </div>
</section>
<section class="section section--tint" id="bulk">
  <div class="container">
    <h2 class="h2" data-reveal>Bulk packs</h2>
    <div class="pack-list">${packs.filter((p) => p.kind === 'bulk').map(card).join('')}</div>
  </div>
</section>
<section class="section others">
  <div class="container">
    <h2 class="h2" data-reveal>Or start with one.</h2>
    <div class="product-grid product-grid--3" data-reveal>
      ${products
        .map(
          (o) => `
      <a class="product-card" href="${url(`/products/${o.slug}/`)}" style="--pc:${o.colour.hex};--pc-tint:${o.colour.tint}">
        <span class="product-card__media"><img src="${url(o.image)}" alt="" width="600" height="600" loading="lazy"></span>
        <span class="product-card__body"><strong>${esc(o.fullName)}</strong><span class="muted">${esc(o.kicker)}</span><span class="product-card__price">${rand(o.price)}</span></span>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>
`,
  });
