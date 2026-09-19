import { brand } from '../../src/data/products.js';
import { esc, icons, url } from '../lib.mjs';
import { layout } from './layout.mjs';

export const contactPage = () =>
  layout({
    title: 'Contact us | EZ Massager',
    description: 'Stock EZ Massager, collaborate with us, or ask a shopping or product question. Email Mandy@ezmassager.co.za or call 079 513 7438.',
    path: '/contact/',
    bodyClass: 'page-contact',
    script: '/src/page.ts',
    body: `
<section class="page-hero">
  <div class="container">
    <p class="eyebrow" data-reveal>Contact us</p>
    <h1 class="h1" data-reveal>Let’s talk.</h1>
    <p class="lede" data-reveal>Get in touch if you would like to stock our product, collaborate with us, or ask us a shopping or product question.</p>
  </div>
</section>
<section class="section">
  <div class="container contact__grid">
    <div class="contact__details">
      <a class="contact__card" href="mailto:${brand.email}" data-reveal>${icons.mail}<span><small>Email us</small><strong>${esc(brand.email)}</strong></span></a>
      <a class="contact__card" href="tel:${brand.phone.replace(/\s/g, '')}" data-reveal>${icons.phone}<span><small>Call us</small><strong>${esc(brand.phone)}</strong></span></a>
      <a class="contact__card" href="${brand.stockistsUrl}" rel="noopener" data-reveal>${icons.pin}<span><small>Buy in store</small><strong>Find your nearest stockist</strong></span></a>
      <div class="contact__card contact__card--static" data-reveal>${icons.truck}<span><small>Buy online</small><strong>Free delivery nationwide</strong></span></div>
      <p class="muted small" data-reveal>${esc(brand.legalName)}<br>${esc(brand.address)}</p>
    </div>
    <form class="contact-form" action="${brand.storeUrl}/contact#contact_form" method="post" accept-charset="UTF-8" data-reveal>
      <input type="hidden" name="form_type" value="contact">
      <input type="hidden" name="utf8" value="✓">
      <div class="field"><label for="c-name">Name</label><input class="input" id="c-name" type="text" name="contact[name]" autocomplete="name" required></div>
      <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" type="email" name="contact[email]" autocomplete="email" required></div>
      <div class="field"><label for="c-reason">I would like to</label>
        <select class="input" id="c-reason" name="contact[reason]">
          <option>Stock your product</option>
          <option>Collaborate with you</option>
          <option>Ask a shopping question</option>
          <option>Ask a product question</option>
        </select>
      </div>
      <div class="field"><label for="c-body">Message</label><textarea class="input" id="c-body" name="contact[body]" rows="6" required></textarea></div>
      <button class="btn btn--primary btn--lg" type="submit">Send message ${icons.arrow}</button>
      <p class="small muted">Messages go straight to the EZ Massager team.</p>
    </form>
  </div>
</section>
`,
  });
