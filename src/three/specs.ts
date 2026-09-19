// Everything the 3D model builder needs per product, derived from the shared
// content module so colours and photos stay in one place.
import { products } from '../data/products.js';

export interface PhotoLayout {
  /** Horizontal centre and radius of the jar in the 900px product photo. */
  cx: number;
  r: number;
  /** Pixel rows of the cap band and the main label band. */
  capY0: number;
  capY1: number;
  labelY0: number;
  labelY1: number;
}

export interface MassagerSpec {
  id: string;
  name: string;
  labelBg: string;
  capBg: string;
  accent: string;
  photo: string;
  layout: PhotoLayout;
}

const LAYOUT: PhotoLayout = { cx: 455, r: 280, capY0: 346, capY1: 478, labelY0: 503, labelY1: 757 };

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const asset = (path: string) => `${base}${path}`;

const colours: Record<string, { labelBg: string; capBg: string }> = {
  original: { labelBg: '#f1c400', capBg: '#f1c400' },
  extra: { labelBg: '#e11b22', capBg: '#e11b22' },
  plant: { labelBg: '#161616', capBg: '#161616' },
};

export const specs: MassagerSpec[] = products.map((p) => ({
  id: p.id,
  name: p.fullName,
  labelBg: colours[p.id]?.labelBg ?? p.colour.hex,
  capBg: colours[p.id]?.capBg ?? p.colour.hex,
  accent: p.colour.hex,
  photo: asset(p.imagePng),
  layout: LAYOUT,
}));

export const logoUrl = asset('/images/site/logo.png');
export const specById = (id: string) => specs.find((s) => s.id === id) ?? specs[0];
