// The home page's scroll-driven product film: one fixed WebGL layer, three
// procedurally built massagers, and a cursor that moves between them as the
// pinned range section scrubs. The model follows whichever stage element is
// on screen (hero stage, then range stage) by reading their rectangles.
import * as THREE from 'three';
import { buildMassager, buildTextures, JAR_WIDTH, VISUAL_OFFSET } from './massager';
import { specs } from './specs';
import { createStage, damp, smoothstep, viewSize } from './stage';
import type { HomeScrollState } from '../home-state';

export async function mountHomeScene(canvas: HTMLCanvasElement, state: HomeScrollState, opts: { reducedMotion: boolean }) {
  const stage = createStage(canvas);
  const { renderer, scene, camera } = stage;
  const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]')!;
  const rangeStage = document.querySelector<HTMLElement>('[data-range-stage]')!;
  const layer = canvas.parentElement!;

  const textures = await Promise.all(specs.map((s) => buildTextures(s, renderer)));
  const models = specs.map((s, i) => buildMassager(s, textures[i]));
  const carousel = new THREE.Group();
  models.forEach((m) => carousel.add(m));
  scene.add(carousel);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!opts.reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  const size = { w: 0, h: 0 };
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === size.w && h === size.h) return;
    size.w = w;
    size.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const rectToWorld = (rect: DOMRect) => {
    const { w, h } = viewSize(camera);
    return {
      x: (rect.left + rect.width / 2) / size.w - 0.5,
      y: 0.5 - (rect.top + rect.height / 2) / size.h,
      wx: w,
      wy: h,
      width: (rect.width / size.w) * w,
      height: (rect.height / size.h) * h,
    };
  };

  const pos = new THREE.Vector3(0, 0, 0);
  let scale = 1;
  let spin = 0;
  let last = performance.now();
  let visible = true;
  const scissor = new THREE.Vector4();
  const n = models.length;
  const TWO_PI = Math.PI * 2;
  let first = true;

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    resize();

    // Where should the model be? Blend from the hero stage to the range stage as the hero scrolls out.
    const heroRect = heroStage.getBoundingClientRect();
    const rangeRect = rangeStage.getBoundingClientRect();
    const t = smoothstep(0.1, 0.9, state.heroProgress);
    const a = rectToWorld(heroRect);
    const b = rectToWorld(rangeRect);
    const cx = a.x + (b.x - a.x) * t;
    const cy = a.y + (b.y - a.y) * t;
    const width = a.width + (b.width - a.width) * t;
    const height = a.height + (b.height - a.height) * t;
    const targetX = cx * a.wx;
    const targetY = cy * a.wy;
    const targetScale = (Math.min(width, height) * 0.7) / JAR_WIDTH;

    if (first) {
      pos.set(targetX, targetY, 0);
      scale = targetScale;
      first = false;
    }
    pos.x = damp(pos.x, targetX, 10, dt);
    pos.y = damp(pos.y, targetY, 10, dt);
    scale = damp(scale, targetScale, 10, dt);
    pointer.x = damp(pointer.x, pointer.tx, 6, dt);
    pointer.y = damp(pointer.y, pointer.ty, 6, dt);
    // A gentle sway keeps the jar alive without hiding the label.
    if (!opts.reducedMotion) spin += dt;
    const sway = Math.sin(spin * 0.6) * 0.22;

    const spacing = height * 1.35;
    carousel.position.set(pos.x, pos.y, 0);
    carousel.scale.setScalar(scale);
    models.forEach((m, k) => {
      const offset = k - state.cursor;
      m.position.y = -offset * (spacing / scale) + VISUAL_OFFSET;
      m.visible = Math.abs(offset) < 1.2;
      // Each product spins into place, faces the camera as it settles, then completes a full turn during its hold.
      const slice = state.rangeProgress * n;
      const base = k === 0 ? -0.3 + TWO_PI * 0.6 * slice : (TWO_PI * 0.6 * (slice - k - 0.3)) / 0.7;
      m.rotation.y = base + sway + pointer.x * 0.35;
      m.rotation.x = 0.16 + pointer.y * 0.08;
      m.rotation.z = -0.04 + pointer.x * 0.03;
    });

    // Only draw inside the stage window so waiting products stay hidden.
    const rectLeft = heroRect.left + (rangeRect.left - heroRect.left) * t;
    const rectTop = heroRect.top + (rangeRect.top - heroRect.top) * t;
    const rectW = heroRect.width + (rangeRect.width - heroRect.width) * t;
    const rectH = heroRect.height + (rangeRect.height - heroRect.height) * t;
    const pad = rectH * 0.22;
    const px = renderer.getPixelRatio();
    scissor.set((rectLeft - pad) * px, (size.h - rectTop - rectH - pad) * px, (rectW + pad * 2) * px, (rectH + pad * 2) * px);
    renderer.setScissorTest(true);
    renderer.setScissor(scissor);
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop((now) => {
    if (visible) tick(now);
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(layer);

  layer.classList.add('is-ready');
  document.body.classList.add('has-3d');
  state.onRangeLeave = (left) => layer.classList.toggle('is-hidden', left);

  return () => {
    renderer.setAnimationLoop(null);
    stage.dispose();
  };
}
