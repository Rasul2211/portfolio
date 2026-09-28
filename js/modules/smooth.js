/* Плавная прокрутка на Lenis.
   Библиотека грузится с CDN; если не загрузилась — сайт работает на нативной
   прокрутке, ничего не ломается. На тач-устройствах не включаем вовсе:
   нативный скролл на телефоне лучше любой эмуляции. */

import { env } from '../utils/env.js';

const LENIS_URL = 'https://cdn.jsdelivr.net/npm/lenis@1.1.20/+esm';

let instance = null;

export async function initSmoothScroll() {
  if (!env.canAnimate || !env.finePointer) return null;

  try {
    const { default: Lenis } = await import(LENIS_URL);

    instance = new Lenis({
      duration: 1,
      // короткий «хвост»: плавно, но без вязкости
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    const raf = (time) => {
      instance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return instance;
  } catch {
    // CDN недоступен — молча остаёмся на нативной прокрутке
    return null;
  }
}

/* Переход к якорю с поправкой на высоту шапки */
export function scrollToTarget(target, offset = -70) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1 });
    return;
  }
  const top = target.getBoundingClientRect().top + scrollY + offset;
  scrollTo({ top, behavior: env.canAnimate ? 'smooth' : 'auto' });
}

export function bindAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
    });
  });
}
