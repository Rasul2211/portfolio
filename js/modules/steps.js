/* Линия слева от шагов прочерчивается по мере прокрутки секции. */

import { env, onScroll, clamp } from '../utils/env.js';

export function initSteps() {
  const wrap = document.querySelector('[data-steps]');
  if (!wrap) return;

  const line = wrap.querySelector('.steps-line i');
  if (!line) return;

  if (env.reducedMotion) { line.style.height = '100%'; return; }

  onScroll(() => {
    const rect = wrap.getBoundingClientRect();
    /* линия догоняет середину экрана */
    const progress = clamp(
      (innerHeight * 0.62 - rect.top) / rect.height,
      0,
      1,
    );
    line.style.height = `${(progress * 100).toFixed(2)}%`;
  });
}
