// Small helpers shared by the page templates.

/** Root path the site is served from ("/" or e.g. "/EZ-Massager/"). */
export const BASE = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');

let depth = 0;
/** Directory depth of the page being rendered (used for relative bases). */
export const setPageDepth = (d) => {
  depth = d;
};

/**
 * Prefix an absolute site path with the configured base. With SITE_BASE=./ the
 * links become relative to the current page and directory links point at
 * index.html, so the build can be opened from a plain file host.
 */
export const url = (path = '/') => {
  if (!path.startsWith('/')) return path;
  if (BASE === './') {
    const prefix = depth ? '../'.repeat(depth) : './';
    const [pathname, hash = ''] = path.split('#');
    const file = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    return `${prefix}${file.slice(1)}${hash ? `#${hash}` : ''}`;
  }
  return BASE + path.slice(1);
};

/** Escape text for safe insertion into HTML. */
export const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Join template fragments, dropping empties. */
export const join = (parts) => parts.filter(Boolean).join('\n');

/** Render a list of paragraphs where "- item" lines become <ul> lists. */
export const richText = (lines) => {
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) out.push(`<ul>${list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>`);
    list = [];
  };
  for (const line of lines) {
    if (line.startsWith('- ')) list.push(line.slice(2));
    else {
      flush();
      out.push(`<p>${linkify(esc(line))}</p>`);
    }
  }
  flush();
  return out.join('\n');
};

/** Turn bare URLs and e-mail addresses into links. */
export const linkify = (text) =>
  text
    .replace(/(https?:\/\/[^\s<]+[^\s<.,;:])/g, '<a href="$1" rel="noopener" target="_blank">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, '<a href="mailto:$1">$1</a>');

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { siFacebook, siInstagram } from 'simple-icons';

const require = createRequire(import.meta.url);
const iconCache = new Map();

/** Inline a Lucide icon (https://lucide.dev) by name, sized by CSS. */
export const icon = (name) => {
  if (!iconCache.has(name)) {
    const file = require.resolve(`lucide-static/icons/${name}.svg`);
    const svg = readFileSync(file, 'utf8')
      .replace(/\s(width|height)="[^"]*"/g, '')
      .replace('<svg', '<svg aria-hidden="true" focusable="false"');
    iconCache.set(name, svg);
  }
  return iconCache.get(name);
};

/** Brand marks come from simple-icons (Lucide no longer ships brand icons). */
const brandIcon = (si) => si.svg.replace('<svg', '<svg aria-hidden="true" focusable="false" class="si" fill="currentColor"');

export const icons = new Proxy(
  {},
  {
    get: (_, key) =>
      key === 'instagram' ? brandIcon(siInstagram) : key === 'facebook' ? brandIcon(siFacebook) :
      icon(
        {
          arrow: 'arrow-right',
          arrowDown: 'arrow-down',
          check: 'check',
          truck: 'truck',
          tag: 'tag',
          globe: 'globe',
          pin: 'map-pin',
          mail: 'mail',
          phone: 'phone',
          hand: 'hand',
          rollers: 'circle-dot',
          drop: 'droplets',
          leaf: 'leaf',
          shield: 'shield-check',
          menu: 'menu',
          close: 'x',
          star: 'star',
          quote: 'quote',
          sparkles: 'sparkles',
          flame: 'flame',
          heart: 'heart-pulse',
          external: 'arrow-up-right',
        }[key] || key
      ),
  }
);
