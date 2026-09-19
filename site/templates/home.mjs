import { brand, checkoutUrl, features, idealFor, ingredients, packs, products, rand, story, testimonials } from '../../src/data/products.js';
import { esc, icons, url } from '../lib.mjs';
import { layout } from './layout.mjs';

const steps = [
  { title: 'Pop the top', body: 'Flip the cap and press the twin rollers against the spot that hurts. Your hands never touch the gel.' },
  { title: 'Roll it on', body: 'The patented dual rollers work the pressure points while the EZ Grip lays down an even coat of Arnica and Menthol gel.' },
  { title: 'Keep massaging', body: 'Once the skin is coated the rollers stop dispensing, so you keep working the muscle for as long as you need.' },
];

const pc = (p) => `--pc:${p.colour.hex};--pc-deep:${p.colour.deep};--pc-tint:${p.colour.tint};--pc-glow:${p.colour.glow};--pc-button:${p.colour.button};--pc-on-button:${p.colour.onButton}`;

const rangePanel = (p, i) => `
<article class="range__panel" data-range-panel="${i}" style="${pc(p)}" ${i === 0 ? 'data-active' : ''}>
  <h3 class="range__title"><span class="range__name">${esc(p.name)}</span><span class="range__strength">${esc(p.strength)}</span></h3>
  <p class="range__kicker">${esc(p.kicker)}</p>
  <p class="range__summary">${esc(p.summary)}</p>
  <ul class="range__formula" aria-label="Formula">${p.formula.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <div class="range__buy">
    <p class="price"><span class="price__amount">${rand(p.price)}</span><span class="price__meta">${esc(p.size)} · free SA delivery</span></p>
    <div class="btn-row">
      <a class="btn btn--product" href="${checkoutUrl(p.variantId)}" rel="noopener">Buy now ${icons.arrow}</a>
      <a class="btn btn--ghost" href="${url(`/products/${p.slug}/`)}">Details</a>
    </div>
  </div>
</article>`;

const packCard = (pack) => {
  const saving = pack.compareAt ? pack.compareAt - pack.price : 0;
  return `
<article class="pack-card">
  <a class="pack-card__media" href="${url('/packs/')}#${pack.id}" tabindex="-1" aria-hidden="true"><img src="${url(pack.image)}" alt="" width="600" height="600" loading="lazy"></a>
  <div class="pack-card__body">
    <h3><a href="${url('/packs/')}#${pack.id}">${esc(pack.name)}</a></h3>
    <p class="muted">${esc(pack.contents)}</p>
    <p class="pack-card__price">
      <span class="price__amount">${rand(pack.price)}</span>
      ${saving > 0 ? `<s>${rand(pack.compareAt)}</s><span class="badge">Save ${rand(saving)}</span>` : ''}
    </p>
    <a class="btn btn--dark btn--sm" href="${checkoutUrl(pack.variantId)}" rel="noopener">Buy now</a>
  </div>
</article>`;
};

const ingredientCell = (ing, cls) => `
<article class="bento__cell ${cls}" data-reveal>
  ${ing.image ? `<img class="bento__img" src="${url(ing.image)}" alt="" width="500" height="300" loading="lazy">` : ''}
  <div class="bento__body">
    <h3>${esc(ing.name)}</h3>
    <p class="bento__role">${esc(ing.role)}</p>
    <p>${esc(ing.body)}</p>
  </div>
</article>`;

export const homePage = () =>
  layout({
    title: 'EZ Massager | Roll away the pain',
    description:
      'EZ Massager combines patented dual massage rollers with fast-acting Arnica and Menthol gel for one-handed, mess-free relief from muscle and joint pain. Three variants from R160, free delivery in South Africa.',
    path: '/',
    bodyClass: 'page-home',
    script: '/src/main.ts',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brand.name,
      legalName: brand.legalName,
      url: 'https://ezmassager.co.za',
      email: brand.email,
      telephone: brand.phone,
      sameAs: [brand.social.instagram, brand.social.facebook],
    },
    body: `
<div class="webgl" data-webgl aria-hidden="true">
  ${products.map((p, i) => `<div class="webgl__tint" data-tint="${i}" style="--pc-tint:${p.colour.tint}"></div>`).join('')}
  <canvas class="webgl__canvas" data-canvas></canvas>
</div>

<section class="hero" data-hero>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow" data-reveal>${esc(brand.tagline)}</p>
      <h1 class="display" data-reveal>Roll away the pain.</h1>
      <p class="lede" data-reveal>Patented dual rollers with fast-acting Arnica and Menthol gel. One-handed, mess-free relief from ${rand(160)}, delivered free across South Africa.</p>
      <div class="btn-row" data-reveal>
        <a class="btn btn--primary btn--lg" href="#range">Shop the range</a>
        <a class="btn btn--ghost btn--lg" href="#how">How it works</a>
      </div>
    </div>
    <div class="hero__stage" data-hero-stage>
      <img class="stage-fallback" src="${url(products[0].image)}" alt="EZ Massager Original 2% Menthol roller massager" width="900" height="900" fetchpriority="high" data-hero-fallback>
    </div>
  </div>
</section>

<section class="range" id="range" data-range aria-label="The EZ Massager range">
  <div class="range__pin" data-range-pin>
    <div class="container range__layout">
      <h2 class="h2 range__heading">Three formulas. One iconic roller.</h2>
      <div class="range__stage" data-range-stage>
        ${products.map((p, i) => `<img class="stage-fallback range__fallback" src="${url(p.image)}" alt="${esc(p.fullName)}" width="900" height="900" loading="lazy" data-range-fallback="${i}">`).join('')}
      </div>
      <div class="range__panels">${products.map(rangePanel).join('')}</div>
      <div class="range__tabs" role="tablist" aria-label="Choose a variant">
        ${products.map((p, i) => `<button class="range__tab" type="button" role="tab" aria-selected="${i === 0}" data-range-tab="${i}" style="--pc:${p.colour.hex}"><i></i>${esc(p.name)}</button>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="how section" id="how">
  <div class="container">
    <div class="section__head">
      <h2 class="h2" data-reveal>Pop the top. Roll it on.<br>Keep massaging.</h2>
      <p class="lede" data-reveal>The only muscle and joint treatment that combines dual massaging rollers with fast-acting Arnica and essential oils. Rolling increases blood flow, so the actives penetrate deeper, faster.</p>
    </div>
    <ol class="steps">
      ${steps.map((s, i) => `<li class="step" data-reveal><span class="step__num">${i + 1}</span><h3 class="h4">${esc(s.title)}</h3><p>${esc(s.body)}</p></li>`).join('')}
    </ol>
    <div class="features">
      ${features
        .slice(0, 2)
        .map(
          (f, i) => `
      <article class="feature ${i % 2 ? 'feature--flip' : ''}" data-reveal>
        <figure class="feature__media"><img src="${url(f.image)}" alt="" width="900" height="900" loading="lazy"></figure>
        <div class="feature__body">
          <h3 class="h3">${esc(f.title)}</h3>
          <p>${esc(f.body)}</p>
        </div>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="formula section section--tint" id="formula">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow" data-reveal>The winning formula</p>
      <h2 class="h2" data-reveal>Five ingredients, one quick-drying gel.</h2>
      <p class="lede" data-reveal>Arnica oil is the base of every EZ Massager. Menthol or Natural Organic Plant Oil sets the strength, while Gingko, Thymus and Ginseng Root support circulation, ease spasms and care for your skin.</p>
    </div>
    <div class="bento">
      ${ingredientCell(ingredients[0], 'bento__cell--feature')}
      ${ingredientCell(ingredients[1], '')}
      ${ingredientCell(ingredients[2], '')}
      ${ingredientCell(ingredients[3], '')}
      ${ingredientCell(ingredients[4], 'bento__cell--text')}
      ${ingredientCell(ingredients[5], 'bento__cell--wide')}
    </div>
    <div class="formula__variants" data-reveal>
      ${products
        .map(
          (p) => `<a class="variant-chip" href="${url(`/products/${p.slug}/`)}" style="--pc:${p.colour.hex}"><i></i><span><strong>${esc(p.fullName)}</strong>${esc(p.formula.slice(0, 2).join(' and '))}</span>${icons.arrow}</a>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="ideal section">
  <div class="container ideal__grid">
    <div class="ideal__head">
      <h2 class="h2" data-reveal>Relief for real life.</h2>
      <p class="lede" data-reveal>From marathon training to labour pains and long-haul flights, EZ Massager is ideal for:</p>
    </div>
    <ul class="chips" data-reveal>${idealFor.map((item) => `<li>${icons.check}${esc(item)}</li>`).join('')}</ul>
  </div>
</section>

<section class="packs section section--tint" id="packs">
  <div class="container">
    <div class="section__head section__head--row">
      <div>
        <h2 class="h2" data-reveal>Buy more, pay less per roll.</h2>
        <p class="lede" data-reveal>Three-packs and six-packs of your favourite formula, or mix and match. Every pack ships free in South Africa.</p>
      </div>
      <a class="btn btn--ghost" href="${url('/packs/')}" data-reveal>See all packs ${icons.arrow}</a>
    </div>
  </div>
  <div class="pack-scroller" data-reveal>
    <div class="container pack-scroller__track">
      ${packs.filter((p) => p.kind === 'value').map(packCard).join('')}
    </div>
  </div>
</section>

<section class="voices section">
  <div class="container voices__grid">
    <h2 class="h2 voices__heading" data-reveal>What customers say.</h2>
    <blockquote class="voice voice--feature" data-reveal>
      <p>“${esc(testimonials[0].quote)}”</p>
      <footer><cite>${esc(testimonials[0].name)}</cite><span class="muted">Customer review</span></footer>
    </blockquote>
    <div class="voices__stack">
      <blockquote class="voice" data-reveal>
        <p>“${esc(testimonials[1].quote)}”</p>
        <footer><cite>${esc(testimonials[1].name)}</cite><span class="muted">Triathlete</span></footer>
      </blockquote>
      <blockquote class="voice" data-reveal>
        <p>“${esc(testimonials[2].quote)}”</p>
        <footer><cite>${esc(testimonials[2].name)}</cite><span class="muted">Recovering from achilles tendonitis</span></footer>
      </blockquote>
    </div>
  </div>
</section>

<section class="trust section section--tint">
  <div class="container trust__grid">
    <div class="trust__item" data-reveal>${icons.truck}<h3 class="h4">Free delivery in South Africa</h3><p>Shop online or in store. Orders arrive within 2 to 5 business days.</p><a class="link" href="${url('/policies/#delivery')}">Delivery policy ${icons.arrow}</a></div>
    <div class="trust__item" data-reveal>${icons.pin}<h3 class="h4">Find a stockist</h3><p>Prefer to buy in person? Use the store locator to find your nearest stockist.</p><a class="link" href="${brand.stockistsUrl}" rel="noopener">Store locator ${icons.arrow}</a></div>
    <div class="trust__item" data-reveal>${icons.globe}<h3 class="h4">International shipping</h3><p>We ship to the USA, Australia and the United Kingdom.</p><a class="link" href="${url('/contact/')}">Ask about shipping ${icons.arrow}</a></div>
  </div>
</section>

<section class="story-teaser section">
  <div class="container story-teaser__grid">
    <figure class="story-teaser__media" data-reveal><img src="${url('/images/site/ez-story.webp')}" alt="The three EZ Massager variants stacked together" width="900" height="737" loading="lazy"></figure>
    <div class="story-teaser__body">
      <p class="eyebrow" data-reveal>Our story</p>
      <h2 class="h2" data-reveal>Born out of complete frustration.</h2>
      <p class="lede" data-reveal>${esc(story.short)} So he built a better way to apply them.</p>
      <a class="btn btn--dark" href="${url('/about/')}" data-reveal>Read our story ${icons.arrow}</a>
    </div>
  </div>
</section>
`,
  });
