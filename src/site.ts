// Shared runtime for every page: header state, menus, reveal animations and
// smooth scrolling. Motion is skipped when the visitor prefers reduced motion.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export let lenis: Lenis | null = null;

const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector('[data-header-sentinel]');
  if (!header || !sentinel) return;
  new IntersectionObserver(([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting), { rootMargin: '-8px 0px 0px 0px' }).observe(sentinel);

  const toggle = header.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  });
  header.querySelectorAll<HTMLAnchorElement>('[data-mobile-menu] a').forEach((a) =>
    a.addEventListener('click', () => {
      header.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
    })
  );

  const menu = header.querySelector<HTMLElement>('[data-menu]');
  const button = menu?.querySelector<HTMLButtonElement>('[data-menu-button]');
  if (menu && button) {
    const setOpen = (open: boolean) => {
      menu.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    };
    button.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target as Node)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }
}

function initReveals() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!items.length) return;
  // Stagger siblings that share a parent.
  const groups = new Map<Element, number>();
  for (const el of items) {
    const parent = el.parentElement ?? document.body;
    const i = groups.get(parent) ?? 0;
    el.style.setProperty('--i', String(Math.min(i, 8)));
    groups.set(parent, i + 1);
  }
  if (reducedMotion) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
  );
  items.forEach((el) => io.observe(el));
}

function initSmoothScroll() {
  if (reducedMotion) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToTarget(target: Element | number, immediate = false) {
  const offset = -headerHeight();
  if (lenis) lenis.scrollTo(target as HTMLElement | number, { offset, immediate, duration: 1.1 });
  else if (typeof target === 'number') window.scrollTo({ top: target + offset, behavior: immediate ? 'auto' : 'smooth' });
  else window.scrollTo({ top: (target as HTMLElement).getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? 'auto' : 'smooth' });
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || url.origin !== location.origin || !url.hash) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    scrollToTarget(target);
  });
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) requestAnimationFrame(() => scrollToTarget(target, true));
  }
}

export function initSite() {
  initHeader();
  initReveals();
  initSmoothScroll();
  initAnchors();
}

export const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

export const saveData = (): boolean => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !!c?.saveData;
};
