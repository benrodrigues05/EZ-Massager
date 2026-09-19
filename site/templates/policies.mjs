import { policies } from '../../src/data/policies.js';
import { esc, richText } from '../lib.mjs';
import { layout } from './layout.mjs';

export const policiesPage = () =>
  layout({
    title: 'Delivery, returns, privacy & terms | EZ Massager',
    description: 'EZ Massager delivery policy, return policy, privacy policy and terms of service.',
    path: '/policies/',
    bodyClass: 'page-policies',
    script: '/src/page.ts',
    body: `
<section class="page-hero">
  <div class="container">
    <h1 class="h1" data-reveal>Policies.</h1>
    <nav class="policy-nav" aria-label="Policies" data-reveal>${policies.map((p) => `<a href="#${p.id}">${esc(p.title)}</a>`).join('')}</nav>
  </div>
</section>
<section class="section section--paper">
  <div class="container policy-layout">
    ${policies
      .map(
        (p) => `
    <article class="policy" id="${p.id}">
      <header><h2 class="h2">${esc(p.title)}</h2><p class="lede">${esc(p.summary)}</p></header>
      ${p.sections.map((s) => `<section>${s.heading ? `<h3 class="h4">${esc(s.heading)}</h3>` : ''}${richText(s.body)}</section>`).join('')}
    </article>`
      )
      .join('')}
  </div>
</section>
`,
  });
