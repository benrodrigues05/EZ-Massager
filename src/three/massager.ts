// Procedural EZ Massager jar: a wide puck with two roller domes on top. The
// label artwork is unwrapped straight off the product photograph so each
// variant carries its real print, and the brand logo wraps around the back.
import * as THREE from 'three';
import type { MassagerSpec } from './specs';
import { logoUrl } from './specs';

export const JAR = {
  R: 1.0,
  base: 0.08,
  label: 0.93,
  seam: 0.07,
  cap: 0.52,
  rollerR: 0.29,
  rollerX: 0.52,
};
export const JAR_HEIGHT = JAR.base + JAR.label + JAR.seam + JAR.cap;
export const JAR_WIDTH = 2 * JAR.R * 1.02;

const imageCache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string): Promise<HTMLImageElement> {
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Could not load ${src}`));
        img.src = src;
      })
    );
  }
  return imageCache.get(src)!;
}

/**
 * Copy a band of the photographed cylinder onto a flat strip. Each output
 * column samples the photo at x = cx + r * sin(angle), which undoes the
 * cylindrical foreshortening of a straight-on product shot.
 */
function unwrapBand(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  src: { cx: number; r: number; y0: number; y1: number },
  dest: { x0: number; x1: number; y0: number; y1: number },
  maxAngle = 84
) {
  const cols = dest.x1 - dest.x0;
  const scale = img.naturalWidth / 900;
  for (let i = 0; i < cols; i++) {
    const a = ((-maxAngle + (2 * maxAngle * i) / (cols - 1)) * Math.PI) / 180;
    const sx = (src.cx + src.r * Math.sin(a)) * scale;
    ctx.drawImage(img, sx, src.y0 * scale, 1.5, (src.y1 - src.y0) * scale, dest.x0 + i, dest.y0, 1, dest.y1 - dest.y0);
  }
}

function feather(ctx: CanvasRenderingContext2D, colour: string, x0: number, x1: number, width: number, height: number) {
  const left = ctx.createLinearGradient(x0, 0, x0 + width, 0);
  left.addColorStop(0, colour);
  left.addColorStop(1, colour.replace(')', ', 0)').replace('rgb(', 'rgba('));
  ctx.fillStyle = left;
  ctx.fillRect(x0, 0, width, height);
  const right = ctx.createLinearGradient(x1 - width, 0, x1, 0);
  right.addColorStop(0, colour.replace(')', ', 0)').replace('rgb(', 'rgba('));
  right.addColorStop(1, colour);
  ctx.fillStyle = right;
  ctx.fillRect(x1 - width, 0, width, height);
}

const toRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

function makeTexture(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  tex.wrapS = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function bandCanvas(width: number, height: number, bg: string) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  return { canvas, ctx };
}

export interface MassagerTextures {
  label: THREE.Texture;
  cap: THREE.Texture;
}

export async function buildTextures(spec: MassagerSpec, renderer: THREE.WebGLRenderer): Promise<MassagerTextures> {
  const [photo, logo] = await Promise.all([loadImage(spec.photo), loadImage(logoUrl)]);
  const L = spec.layout;
  const W = 2048;

  // Main label band: circumference / height ratio drives the canvas aspect.
  const labelH = Math.round((W * JAR.label) / (2 * Math.PI * JAR.R));
  const label = bandCanvas(W, labelH, spec.labelBg);
  const span = Math.round((W * 170) / 360);
  unwrapBand(label.ctx, photo, { cx: L.cx, r: L.r, y0: L.labelY0, y1: L.labelY1 }, { x0: W / 2 - span / 2, x1: W / 2 + span / 2, y0: 0, y1: labelH }, 85);
  feather(label.ctx, toRgb(spec.labelBg), W / 2 - span / 2, W / 2 + span / 2, Math.round(span * 0.12), labelH);
  // Brand logo wraps around the back (u = 0 / 1).
  const logoW = 560;
  const logoH = (logoW * logo.naturalHeight) / logo.naturalWidth;
  const logoY = (labelH - logoH) / 2;
  label.ctx.drawImage(logo, -logoW / 2, logoY, logoW, logoH);
  label.ctx.drawImage(logo, W - logoW / 2, logoY, logoW, logoH);

  // Cap band.
  const capH = Math.round((W * JAR.cap) / (2 * Math.PI * JAR.R));
  const cap = bandCanvas(W, capH, spec.capBg);
  unwrapBand(cap.ctx, photo, { cx: L.cx, r: L.r, y0: L.capY0, y1: L.capY1 }, { x0: W / 2 - span / 2, x1: W / 2 + span / 2, y0: 0, y1: capH }, 85);
  feather(cap.ctx, toRgb(spec.capBg), W / 2 - span / 2, W / 2 + span / 2, Math.round(span * 0.12), capH);
  const capLogoW = 300;
  const capLogoH = (capLogoW * logo.naturalHeight) / logo.naturalWidth;
  cap.ctx.drawImage(logo, -capLogoW / 2, (capH - capLogoH) / 2, capLogoW, capLogoH);
  cap.ctx.drawImage(logo, W - capLogoW / 2, (capH - capLogoH) / 2, capLogoW, capLogoH);

  return { label: makeTexture(label.canvas, renderer), cap: makeTexture(cap.canvas, renderer) };
}

function contactShadowTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.45, 'rgba(0,0,0,0.28)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
let shadowTex: THREE.Texture | null = null;

/** Vertical offset that centres the whole silhouette (jar plus rollers) on the group origin. */
export const VISUAL_OFFSET = -0.14;

/** Build one massager. The group is centred on the jar, bottom at -JAR_HEIGHT/2. */
export function buildMassager(spec: MassagerSpec, textures: MassagerTextures): THREE.Group {
  const g = new THREE.Group();
  g.name = spec.id;
  const { R, base, label, seam, cap, rollerR, rollerX } = JAR;
  const bottom = -JAR_HEIGHT / 2;
  const segments = 128;

  const metal = new THREE.MeshStandardMaterial({ color: 0xcfcfcc, metalness: 0.9, roughness: 0.28 });
  const plastic = new THREE.MeshStandardMaterial({ color: new THREE.Color(spec.capBg), roughness: 0.45, metalness: 0.05 });
  const labelMat = new THREE.MeshStandardMaterial({ map: textures.label, roughness: 0.5, metalness: 0.02 });
  const capMat = new THREE.MeshStandardMaterial({ map: textures.cap, roughness: 0.5, metalness: 0.02 });
  const roller = new THREE.MeshPhysicalMaterial({ color: 0xd6d5d2, roughness: 0.32, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.2 });

  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, y: number, x = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    g.add(mesh);
    return mesh;
  };

  // Base ring, label band, seam ring and cap band stack from the bottom up.
  add(new THREE.CylinderGeometry(R * 1.02, R * 1.0, base, segments), metal, bottom + base / 2);
  const bottomDisc = add(new THREE.CircleGeometry(R * 1.0, segments), plastic, bottom + 0.001);
  bottomDisc.rotation.x = Math.PI / 2;
  const labelMesh = add(new THREE.CylinderGeometry(R, R, label, segments, 1, true), labelMat, bottom + base + label / 2);
  labelMesh.rotation.y = Math.PI;
  add(new THREE.CylinderGeometry(R * 1.025, R * 1.025, seam, segments), metal, bottom + base + label + seam / 2);
  const capMesh = add(new THREE.CylinderGeometry(R * 0.995, R * 0.995, cap, segments, 1, true), capMat, bottom + base + label + seam + cap / 2);
  capMesh.rotation.y = Math.PI;

  // Gently domed cap top with a thin bright rim.
  const capTop = bottom + base + label + seam + cap;
  const dome = new THREE.LatheGeometry(
    [new THREE.Vector2(0, 0.06), new THREE.Vector2(R * 0.45, 0.052), new THREE.Vector2(R * 0.85, 0.03), new THREE.Vector2(R * 0.995, 0)],
    segments
  );
  add(dome, plastic, capTop);
  add(new THREE.TorusGeometry(R * 0.985, 0.012, 12, segments), metal, capTop).rotation.x = Math.PI / 2;

  // Twin roller domes.
  const sphere = new THREE.SphereGeometry(rollerR, 64, 40);
  add(sphere, roller, capTop + 0.01, -rollerX);
  add(sphere, roller, capTop + 0.01, rollerX);

  // Soft contact shadow.
  shadowTex ??= contactShadowTexture();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = bottom - 0.01;
  shadow.name = 'shadow';
  g.add(shadow);

  return g;
}
