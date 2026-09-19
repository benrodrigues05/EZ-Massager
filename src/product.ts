// Product pages: shared runtime plus the lazy-loaded interactive viewer.
import { initSite, reducedMotion, saveData, supportsWebGL } from './site';

initSite();

const stage = document.querySelector<HTMLElement>('[data-viewer]');
if (stage && supportsWebGL() && !saveData()) {
  const productId = stage.dataset.product ?? 'original';
  const start = () =>
    import('./three/viewer')
      .then(({ mountViewer }) => mountViewer(stage, productId, { reducedMotion }))
      .catch((err) => console.warn('3D viewer unavailable, using the photo instead.', err));
  if ('requestIdleCallback' in window) (window as Window & { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 200);
}
