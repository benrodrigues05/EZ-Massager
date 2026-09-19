import { blogPosts, brand, features, ingredients, products, story } from '../../src/data/products.js';
import { esc, icons, url } from '../lib.mjs';
import { layout } from './layout.mjs';

export const aboutPage = () =>
  layout({
    title: 'Our story | EZ Massager',
    description: 'EZ Massager was born out of complete frustration. Read how the late John Taalman invented a better way to apply arnica creams, and how his stepson Dean Black revived it.',
    path: '/about/',
    bodyClass: 'page-about',
    script: '/src/page.ts',
    body: `
<section class="page-hero page-hero--split">
  <div class="container page-hero__grid">
    <div>
      <p class="eyebrow" data-reveal>Our story</p>
      <h1 class="h1" data-reveal>Born out of complete frustration.</h1>
      ${story.paragraphs.map((p) => `<p class="lede" data-reveal>${esc(p)}</p>`).join('')}
    </div>
    <figure class="page-hero__media" data-reveal><img src="${url('/images/site/slide-2.webp')}" alt="EZ Massager Original 2% Menthol among yellow flowers" width="1920" height="1448"></figure>
  </div>
</section>

<section class="section section--tint" id="products">
  <div class="container">
    <div class="section__head">
      <h2 class="h2" data-reveal>Designed to offer quick and lasting pain relief.</h2>
      <p class="lede" data-reveal>It is the only muscle and joint treatment that combines dual massaging rollers with fast-acting Arnica and essential oils. Massaging increases blood flow to specific parts of the body, allowing effective ingredients to penetrate and heal problem areas faster.</p>
    </div>
    <div class="features">
      ${features
        .slice(0, 2)
        .map(
          (f, i) => `
      <article class="feature ${i % 2 ? 'feature--flip' : ''}" data-reveal>
        <figure class="feature__media"><img src="${url(f.image)}" alt="" width="900" height="900" loading="lazy"></figure>
        <div class="feature__body"><h3 class="h3">${esc(f.title)}</h3><p>${esc(f.body)}</p></div>
      </article>`
        )
        .join('')}
    </div>
    <div class="callout" data-reveal>
      <h3 class="h3">${esc(features[2].title)}</h3>
      <p>${esc(features[2].body)}</p>
    </div>
  </div>
</section>

<section class="section" id="formula">
  <div class="container formula-grid">
    <div>
      <h2 class="h2" data-reveal>Arnica oil, plus the right active for you.</h2>
      <div class="formula-table" data-reveal>
        ${products
          .map(
            (p) => `<a class="formula-row" href="${url(`/products/${p.slug}/`)}" style="--pc:${p.colour.hex}"><i></i><strong>EZ Massager ${esc(p.name)}</strong><span>${esc(p.formula[0])} and ${esc(p.formula[1])}</span>${icons.arrow}</a>`
          )
          .join('')}
      </div>
    </div>
    <ul class="ingredient-list" data-reveal>
      ${ingredients.map((i) => `<li><strong>${esc(i.name)}</strong><span>${esc(i.body)}</span></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section--tint" id="giving-back">
  <div class="container two-col">
    <div data-reveal>
      <h2 class="h2">More than rolling away the pain.</h2>
      <p class="lede">${esc(story.givingBack)}</p>
    </div>
    <div data-reveal>
      <h2 class="h2">Staying pain-free while chasing dreams.</h2>
      <p class="lede">${esc(story.athletes)}</p>
      <a class="btn btn--dark" href="${brand.social.instagram}" rel="noopener" target="_blank">Follow on Instagram ${icons.external}</a>
    </div>
  </div>
</section>

<section class="section" id="blog">
  <div class="container">
    <div class="section__head section__head--row">
      <h2 class="h2" data-reveal>Recovery, explained.</h2>
      <a class="btn btn--ghost" href="${brand.blogUrl}" rel="noopener" data-reveal>Read the blog ${icons.external}</a>
    </div>
    <div class="post-grid" data-reveal>
      ${blogPosts.map((b) => `<a class="post" href="${brand.blogUrl}" rel="noopener"><h3 class="h3">${esc(b.title)}</h3><p class="muted">${esc(b.excerpt)}</p><span class="link">Read more ${icons.arrow}</span></a>`).join('')}
    </div>
  </div>
</section>
`,
  });
