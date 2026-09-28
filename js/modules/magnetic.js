/* Магнитные элементы: смещение не больше 8px, возврат пружиной.
   Больше двигать нельзя — кнопка начнёт убегать из-под курсора. */

import { env } from '../utils/env.js';

const MAX_SHIFT = 8;

export function initMagnetic(selector = '[data-magnetic]') {
  if (!env.canPoint) return;

  document.querySelectorAll(selector).forEach((el) => {
    let frame = 0;

    el.addEventListener('pointermove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.transition = 'transform .1s linear';
        el.style.transform =
          `translate(${(dx * MAX_SHIFT).toFixed(2)}px, ${(dy * MAX_SHIFT).toFixed(2)}px)`;
      });
    });

    el.addEventListener('pointerleave', () => {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      el.style.transition = 'transform .45s cubic-bezier(.34, 1.4, .64, 1)';
      el.style.transform = '';
    });
  });
}
