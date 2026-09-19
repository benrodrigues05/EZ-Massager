import { brand, checkoutUrl, idealFor, packById, productDetails, products, rand, storeProductUrl } from '../../src/data/products.js';
import { esc, icons, url } from '../lib.mjs';
import { layout } from './layout.mjs';

const pc = (p) => `--pc:${p.colour.hex};--pc-deep:${p.colour.deep};--pc-tint:${p.colour.tint};--pc-glow:${p.colour.glow};--pc-button:${p.colour.button};--pc-on-button:${p.colour.onButton}`;

export const productPage = (p) => {
  const pack = packById(p.packId);
  const others = products.filter((o) => o.id !== p.id);
  const packSaving = pack && pack.compareAt ? pack.compareAt - pack.price : 0;
  return layout({
    title: `${p.fullName} | EZ Massager`,
    description: `${p.summary} ${p.size}, ${rand(p.price)} with free delivery in South Africa.`,
    path: `/products/${p.slug}/`,
    bodyClass: `page-product product--${p.id}`,
    script: '/src/product.ts',
    image: p.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `EZ Massager ${p.fullName}`,
      image: [`https://ezmassager.co.za${p.image}`],
      description: p.description.join(' '),
      sku: p.sku,
      brand: { '@type': 'Brand', name: brand.name },
      offers: { '@type': 'Offer', url: storeProductUrl(p.handle), priceCurrency: 'ZAR', price: p.price, availability: 'https://schema.org/InStock' },
    },
    body: `
<section class="pdp" style="${pc(p)}">
  <div class="container pdp__grid">
    <div class="pdp__stage" data-viewer data-product="${p.id}" data-model="${url(p.model)}">
      <img class="stage-fallback" src="${url(p.image)}" alt="${esc(p.fullName)}" width="900" height="900" fetchpriority="high" data-viewer-fallback>
      <p class="pdp__hint" data-viewer-hint>Drag to rotate</p>
    </div>
    <div class="pdp__copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${url('/')}">Home</a><span>/</span><a href="${url('/#range')}">Range</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <p class="eyebrow" data-reveal>${esc(p.kicker)}</p>
      <h1 class="h1" data-reveal>${esc(p.fullName)}</h1>
      <p class="lede" data-reveal>${esc(p.tagline)}</p>
      <div class="pdp__buy" data-reveal>
        <p class="price"><span class="price__amount">${rand(p.price)}</span><span class="price__meta">${esc(p.size)} · free SA delivery</span></p>
        <div class="btn-row">
          <a class="btn btn--product btn--lg" href="${checkoutUrl(p.variantId)}" rel="noopener">Buy now ${icons.arrow}</a>
          <a class="btn btn--ghost btn--lg" href="${storeProductUrl(p.handle)}" rel="noopener">View on store</a>
        </div>
        ${
          pack
            ? `<a class="upsell" href="${checkoutUrl(pack.variantId)}" rel="noopener"><span class="upsell__tag">3 pack</span><span>Stock up: three for <strong>${rand(pack.price)}</strong>${packSaving > 0 ? `, save ${rand(packSaving)}` : ''}</span>${icons.arrow}</a>`
            : ''
        }
      </div>
      <ul class="pdp__formula" data-reveal aria-label="What is inside">${p.formula.map((f) => `<li>${icons.check}${esc(f)}</li>`).join('')}</ul>
      <div class="pdp__desc" data-reveal>${p.description.map((d) => `<p>${esc(d)}</p>`).join('')}${p.note ? `<p class="note">${icons.shield}<span>${esc(p.note)}</span></p>` : ''}</div>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="container details__grid">
    <h2 class="h2" data-reveal>Everything that makes it EZ.</h2>
    <dl class="details" data-reveal>
      ${productDetails
        .map(
          (d) => `<div class="details__item"><dt>${esc(d.title)}</dt><dd>${esc(
            d.title === 'Unique Formulation' ? `${p.formula[0]} and ${p.formula[1]} are complemented with further healing ingredients: Gingko, Thymus and Ginseng Root.` : d.body
          )}</dd></div>`
        )
        .join('')}
    </dl>
  </div>
</section>

<section class="section">
  <div class="container ideal__grid">
    <div class="ideal__head">
      <h2 class="h2" data-reveal>Made for the moments that hurt.</h2>
      <p class="lede" data-reveal>Ideal for:</p>
    </div>
    <ul class="chips" data-reveal>${idealFor.map((item) => `<li>${icons.check}${esc(item)}</li>`).join('')}</ul>
  </div>
</section>

<section class="section section--tint gallery">
  <div class="container gallery__grid" data-reveal>
    ${p.gallery.map((g, i) => `<figure class="gallery__item"><img src="${url(g)}" alt="${esc(p.fullName)} ${i === 0 ? 'with the cap off' : 'close up'}" width="900" height="900" loading="lazy"></figure>`).join('')}
  </div>
</section>

<section class="section others">
  <div class="container">
    <div class="section__head section__head--row">
      <h2 class="h2" data-reveal>Pick your strength.</h2>
      <a class="btn btn--ghost" href="${url('/packs/')}" data-reveal>See the packs ${icons.arrow}</a>
    </div>
    <div class="product-grid" data-reveal>
      ${others
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
};
