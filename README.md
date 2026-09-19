# EZ Massager website

A fast, static marketing site for [EZ Massager](https://ezmassager.co.za), South Africa's
best muscle recovery product. It showcases the three variants (Original 2% Menthol,
Extra Strength 4% Menthol and Arnica + Natural Organic Plant Oil) with scroll-driven
3D models, keeps every price, formula, ingredient and contact detail from the existing
store, and sends shoppers straight to the store's checkout.

## Quick start

```bash
npm install
npm run dev        # regenerates the pages and starts Vite on http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/ locally
npm run screenshots  # visual QA of dist/ at desktop and mobile widths (needs Playwright's Chromium)
```

Requires Node 20 or newer.

## How it is put together

| Piece | Where | Notes |
| --- | --- | --- |
| Content | `src/data/products.js`, `src/data/policies.js` | Single source of truth for products, prices, packs, ingredients, copy, contact details and policies. Edit here, then `npm run pages` (the dev and build scripts do this automatically). |
| Pages | `site/templates/*.mjs` → `index.html`, `products/*/index.html`, `packs/`, `about/`, `contact/`, `policies/` | Static HTML is generated from small template functions so the header, footer and product pages never drift apart. The generated files are committed. |
| Styles | `src/styles/main.css` | Design tokens (light and dark), typography, components. Fonts are self-hosted in `public/fonts`. |
| Runtime | `src/site.ts` | Header, menus, reveal-on-scroll, smooth scrolling (Lenis + GSAP ScrollTrigger). Honours `prefers-reduced-motion`. |
| 3D | `src/three/*.ts` | Three.js models built procedurally from the jar's dimensions; the real label artwork is unwrapped from the product photographs onto the cylinders at runtime. The home page pins the range section and scrubs between the three jars; product pages have a drag-to-rotate viewer. The 3D bundle is lazy-loaded after first paint and falls back to photography without WebGL. |
| Images | `public/images` | Optimised copies of the store's imagery, fetched by `scripts/fetch-assets.mjs` (`npm run fetch-assets` re-downloads and re-optimises everything). |

### Buying and forms

The site does not process payments itself. Every "Buy now" button is a Shopify cart
permalink (`https://ezmassager.co.za/cart/<variant-id>:1`) that lands on the existing
store's checkout, and "View on store" links open the matching store listing. The
newsletter and contact forms post to the store's own contact endpoint, so subscriptions
and messages arrive exactly as they do today. Variant ids live next to each product and
pack in `src/data/products.js`.

### Colours and copy rules

The brand red (`--accent`) is the only interface accent; the yellow, red and green of the
jars appear only where the products do (`--pc*` custom properties). Headings use Outfit,
body text uses Geist. Prices are shown in Rand exactly as on the store.

## Deployment

The build is plain static files, so it runs on any host (Cloudflare Pages, Netlify,
Vercel, an nginx box, or the existing domain).

- **GitHub Pages**: `.github/workflows/deploy-pages.yml` builds and publishes on every
  push. Enable Pages for the repository (Settings → Pages → Source: GitHub Actions).
  The workflow sets `SITE_BASE=/<repo-name>/` so the site works under the project
  sub-path; for a custom domain set `SITE_BASE` to `/`.
- **Anywhere else**: `npm run build` and upload `dist/`. Set `SITE_BASE` if the site is
  served from a sub-directory (it is used by both the page generator and Vite).

## Replacing the 3D models

The procedural jars are generated in `src/three/massager.ts`. If a photogrammetry scan or
CAD export becomes available, drop the `.glb` in `public/models/` and add
`data-glb="/models/your-file.glb"` to the viewer stage in `site/templates/product.mjs`;
the viewer will load it in place of the procedural model. Keep files under a few
megabytes (run them through `@gltf-transform/cli optimize`).
