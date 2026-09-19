import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const page = (p: string) => new URL(p, `file://${root}`).pathname;

export default defineConfig({
  // Set SITE_BASE=/sub-path/ (and regenerate pages) to host under a sub-directory.
  base: process.env.SITE_BASE || '/',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        home: page('index.html'),
        original: page('products/original-2-menthol/index.html'),
        extra: page('products/extra-strength-4-menthol/index.html'),
        plant: page('products/arnica-natural-organic-plant-oil/index.html'),
        packs: page('packs/index.html'),
        about: page('about/index.html'),
        contact: page('contact/index.html'),
        policies: page('policies/index.html'),
      },
    },
  },
});
