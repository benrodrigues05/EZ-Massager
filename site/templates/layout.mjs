import { brand, products, rand } from '../../src/data/products.js';
import { esc, icons, join, url } from '../lib.mjs';

const navLinks = [
  { label: 'How it works', href: '/#how' },
  { label: 'Formula', href: '/#formula' },
  { label: 'Packs', href: '/packs/' },
  { label: 'Our story', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

const logo = (cls = '') => `<img class="logo ${cls}" src="${url('/images/site/logo.png')}" alt="${esc(brand.name)}" width="1000" height="211">`;

export const nav = () => `
<a class="skip-link" href="#main">Skip to content</a>
<div class="header-sentinel" data-header-sentinel aria-hidden="true"></div>
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${url('/')}" aria-label="${esc(brand.name)} home">${logo()}</a>
    <nav class="site-nav" aria-label="Primary">
      <div class="site-nav__item" data-menu>
        <button class="site-nav__link site-nav__link--menu" type="button" aria-expanded="false" aria-controls="products-menu" data-menu-button>Products ${icons.arrowDown}</button>
        <div class="mega" id="products-menu" data-menu-panel>
          ${products
            .map(
              (p) => `<a class="mega__item" href="${url(`/products/${p.slug}/`)}" style="--pc:${p.colour.hex};--pc-tint:${p.colour.tint}">
              <img src="${url(p.image)}" alt="" width="120" height="120" loading="lazy">
              <span class="mega__name">${esc(p.fullName)}</span>
              <span class="mega__meta">${esc(p.kicker)} · ${rand(p.price)}</span>
            </a>`
            )
            .join('')}
          <a class="mega__all" href="${url('/packs/')}">Value and bulk packs ${icons.arrow}</a>
        </div>
      </div>
      ${navLinks.map((l) => `<a class="site-nav__link" href="${url(l.href)}">${esc(l.label)}</a>`).join('')}
    </nav>
    <div class="site-header__actions">
      <a class="btn btn--primary btn--sm" href="${url('/#range')}">Shop now</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-nav-toggle>
        <span class="nav-toggle__open">${icons.menu}</span><span class="nav-toggle__close">${icons.close}</span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" data-mobile-menu>
    <div class="mobile-menu__products">
      ${products
        .map(
          (p) => `<a href="${url(`/products/${p.slug}/`)}" style="--pc:${p.colour.hex};--pc-tint:${p.colour.tint}"><img src="${url(p.image)}" alt="" width="72" height="72" loading="lazy"><span><strong>${esc(p.fullName)}</strong><small>${rand(p.price)}</small></span></a>`
        )
        .join('')}
    </div>
    ${navLinks.map((l) => `<a class="mobile-menu__link" href="${url(l.href)}">${esc(l.label)}</a>`).join('')}
    <a class="btn btn--primary btn--lg" href="${url('/#range')}">Shop the range</a>
  </div>
</header>`;

export const newsletter = () => `
<section class="newsletter" aria-labelledby="newsletter-title">
  <div class="container newsletter__inner">
    <div class="newsletter__copy">
      <h2 id="newsletter-title" class="h3">EZ news, delivered to your inbox.</h2>
      <p class="muted">Launches, stockist updates and the occasional recovery tip. No spam.</p>
    </div>
    <form class="newsletter__form" action="${brand.storeUrl}/contact#contact_form" method="post" accept-charset="UTF-8">
      <input type="hidden" name="form_type" value="customer">
      <input type="hidden" name="utf8" value="✓">
      <input type="hidden" name="contact[tags]" value="newsletter">
      <label class="visually-hidden" for="newsletter-email">Email address</label>
      <input id="newsletter-email" class="input" type="email" name="contact[email]" placeholder="you@example.com" autocomplete="email" required>
      <button class="btn btn--dark" type="submit">Subscribe</button>
    </form>
  </div>
</section>`;

export const footer = () => `
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <a class="brand" href="${url('/')}" aria-label="${esc(brand.name)} home">${logo('logo--footer')}</a>
      <p class="muted">${esc(brand.tagline)}. Patented dual massage rollers with fast-acting Arnica, Menthol and essential oils.</p>
      <div class="social">
        <a href="${brand.social.instagram}" rel="noopener" target="_blank" aria-label="EZ Massager on Instagram">${icons.instagram}</a>
        <a href="${brand.social.facebook}" rel="noopener" target="_blank" aria-label="EZ Massager on Facebook">${icons.facebook}</a>
      </div>
    </div>
    <nav class="site-footer__col" aria-label="Shop">
      <h3>Shop</h3>
      ${products.map((p) => `<a href="${url(`/products/${p.slug}/`)}">${esc(p.fullName)}</a>`).join('')}
      <a href="${url('/packs/')}">Value packs</a>
      <a href="${url('/packs/#bulk')}">Bulk packs</a>
      <a href="${brand.stockistsUrl}" rel="noopener">Find a stockist</a>
    </nav>
    <nav class="site-footer__col" aria-label="Company">
      <h3>Company</h3>
      <a href="${url('/about/')}">Our story</a>
      <a href="${url('/about/#products')}">About our products</a>
      <a href="${url('/about/#giving-back')}">Giving back</a>
      <a href="${brand.blogUrl}" rel="noopener">EZ Blog</a>
      <a href="${url('/contact/')}">Contact us</a>
    </nav>
    <nav class="site-footer__col" aria-label="Help">
      <h3>Help</h3>
      <a href="${url('/policies/#delivery')}">Delivery policy</a>
      <a href="${url('/policies/#returns')}">Return policy</a>
      <a href="${url('/policies/#privacy')}">Privacy policy</a>
      <a href="${url('/policies/#terms')}">Terms of service</a>
    </nav>
    <div class="site-footer__col site-footer__contact">
      <h3>Contact</h3>
      <a href="mailto:${brand.email}">${icons.mail}<span>${esc(brand.email)}</span></a>
      <a href="tel:${brand.phone.replace(/\s/g, '')}">${icons.phone}<span>${esc(brand.phone)}</span></a>
      <p class="muted small">${esc(brand.address)}</p>
    </div>
  </div>
  <div class="container site-footer__bottom">
    <p>© ${new Date().getFullYear()} ${esc(brand.legalName)}. All rights reserved.</p>
    <p class="muted">Free delivery in South Africa. International shipping to the USA, Australia and the UK.</p>
  </div>
</footer>`;

/**
 * Wrap page content in the shared document shell.
 * @param {{title:string, description:string, path:string, body:string, script:string, bodyClass?:string, jsonLd?:object, image?:string}} opts
 */
export const layout = ({ title, description, path, body, script, bodyClass = '', jsonLd, image }) => {
  const canonical = `https://ezmassager.co.za${path}`;
  const og = `https://ezmassager.co.za${image || '/images/og-cover.jpg'}`;
  return `<!doctype html>
<html lang="en-ZA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f4f2ed">
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121110">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(brand.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${og}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${url('/favicon.png')}" type="image/png" sizes="96x96">
  <link rel="apple-touch-icon" href="${url('/apple-touch-icon.png')}">
  <link rel="preload" href="${url('/fonts/Outfit-var.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${url('/fonts/Geist-var.woff2')}" as="font" type="font/woff2" crossorigin>
  <script>document.documentElement.classList.add('js')</script>
  <link rel="stylesheet" href="/src/styles/main.css">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body class="${bodyClass}">
${nav()}
<main id="main">
${body}
</main>
${newsletter()}
${footer()}
<script type="module" src="${script}"></script>
</body>
</html>`;
};

export { join };
