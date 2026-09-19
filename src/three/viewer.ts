// Product page viewer: one massager you can drag to spin, with gentle
// auto-rotation while idle.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { buildMassager, buildTextures, JAR_WIDTH, VISUAL_OFFSET } from './massager';
import { specById } from './specs';
import { createStage, damp, viewSize } from './stage';

export async function mountViewer(container: HTMLElement, productId: string, opts: { reducedMotion: boolean }) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Interactive 3D view of the massager. Drag to rotate.');
  canvas.setAttribute('role', 'img');
  container.appendChild(canvas);
  const stage = createStage(canvas);
  const { renderer, scene, camera } = stage;
  const spec = specById(productId);
  const glb = container.dataset.glb;
  const model = new THREE.Group();
  if (glb) {
    // A scanned/generated GLB: normalise it to the procedural jar's footprint.
    const gltf = await new GLTFLoader().loadAsync(glb);
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(centre);
    const wrapper = new THREE.Group();
    wrapper.add(gltf.scene);
    wrapper.scale.setScalar(JAR_WIDTH / Math.max(size.x, size.z));
    model.add(wrapper);
  } else {
    const jar = buildMassager(spec, await buildTextures(spec, renderer));
    jar.position.y = VISUAL_OFFSET;
    model.add(jar);
  }
  scene.add(model);
  model.rotation.x = 0.18;

  const size = { w: 0, h: 0 };
  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h || (w === size.w && h === size.h)) return;
    size.w = w;
    size.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const view = viewSize(camera);
    model.scale.setScalar((Math.min(view.w, view.h) * 0.62) / JAR_WIDTH);
  };
  new ResizeObserver(resize).observe(container);
  resize();

  // Drag to rotate with a little inertia.
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocity = 0;
  let idle = 0;
  let targetTilt = 0.18;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
    container.querySelector('[data-viewer-hint]')?.classList.add('is-hidden');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    model.rotation.y += dx * 0.012;
    targetTilt = THREE.MathUtils.clamp(targetTilt + dy * 0.004, -0.4, 0.7);
    velocity = dx * 0.012;
    idle = 0;
  });
  const release = () => {
    dragging = false;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  let last = performance.now();
  let visible = true;
  renderer.setAnimationLoop((now) => {
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!dragging) {
      model.rotation.y += velocity;
      velocity *= 0.92;
      idle += dt;
      if (!opts.reducedMotion && idle > 1.2) model.rotation.y += dt * 0.35;
    }
    model.rotation.x = damp(model.rotation.x, targetTilt, 8, dt);
    renderer.render(scene, camera);
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(container);

  document.body.classList.add('has-3d');
  return () => {
    renderer.setAnimationLoop(null);
    stage.dispose();
    canvas.remove();
  };
}
