// Home page: shared runtime, the pinned range section, and the lazy-loaded 3D film.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cursorFromProgress, type HomeScrollState } from './home-state';
import { initSite, lenis, reducedMotion, saveData, scrollToTarget, supportsWebGL } from './site';

initSite();

const state: HomeScrollState = { heroProgress: 0, rangeProgress: 0, cursor: 0 };
const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-range-panel]'));
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-range-tab]'));
const tints = Array.from(document.querySelectorAll<HTMLElement>('[data-tint]'));
const fallbacks = Array.from(document.querySelectorAll<HTMLElement>('[data-range-fallback]'));
const hero = document.querySelector<HTMLElement>('[data-hero]');
const pin = document.querySelector<HTMLElement>('[data-range-pin]');
const n = panels.length;

function applyCursor() {
  const c = state.cursor;
  const active = Math.round(c);
  panels.forEach((panel, k) => {
    const d = Math.abs(k - c);
    const opacity = Math.max(0, 1 - d / 0.5);
    panel.style.opacity = opacity.toFixed(3);
    panel.style.transform = `translateY(${((k - c) * 32).toFixed(1)}px)`;
    panel.toggleAttribute('data-active', k === active);
  });
  tints.forEach((tint, k) => {
    tint.style.opacity = Math.max(0, 1 - Math.abs(k - c) / 0.6).toFixed(3);
  });
  fallbacks.forEach((img, k) => img.classList.toggle('is-active', k === active));
  tabs.forEach((tab, k) => tab.setAttribute('aria-selected', String(k === active)));
}

let rangeTrigger: ScrollTrigger | null = null;
if (hero && pin) {
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
      state.heroProgress = self.progress;
    },
  });
  rangeTrigger = ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: `+=${n * 100}%`,
    pin: true,
    scrub: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      state.rangeProgress = self.progress;
      state.cursor = cursorFromProgress(self.progress, n);
      applyCursor();
    },
    onLeave: () => state.onRangeLeave?.(true),
    onEnterBack: () => state.onRangeLeave?.(false),
  });
  applyCursor();
  // A resize after fonts and images settle keeps the pin measurements honest.
  window.addEventListener('load', () => ScrollTrigger.refresh());

  tabs.forEach((tab, k) => {
    tab.addEventListener('click', () => {
      if (!rangeTrigger) return;
      const length = rangeTrigger.end - rangeTrigger.start;
      const slice = length / n;
      const target = rangeTrigger.start + slice * k + (k === 0 ? 0 : slice * 0.35) + 2;
      if (lenis) lenis.scrollTo(target, { duration: 1 });
      else scrollToTarget(target);
    });
  });
}

// The 3D film is heavy, so it loads after first paint and only where it can run.
const canvas = document.querySelector<HTMLCanvasElement>('[data-canvas]');
if (canvas && supportsWebGL() && !saveData()) {
  const start = () => {
    import('./three/home-scene')
      .then(({ mountHomeScene }) => mountHomeScene(canvas, state, { reducedMotion }))
      .catch((err) => console.warn('3D scene unavailable, using photos instead.', err));
  };
  if ('requestIdleCallback' in window) (window as Window & { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 300);
}

gsap.ticker.lagSmoothing(0);
