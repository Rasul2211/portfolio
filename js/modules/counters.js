/* Счётчики: запускаются, когда блок появился, а не при загрузке страницы. */

import { env } from '../utils/env.js';

const DURATION = 900;

function run(el) {
  const to = Number(el.dataset.to);
  if (!Number.isFinite(to)) return;

  if (env.reducedMotion) { el.textContent = String(to); return; }

  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / DURATION);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initCounters() {
  const counters = [...document.querySelectorAll('[data-to]')];
  if (!counters.length) return;

  if (env.reducedMotion) { counters.forEach(run); return; }

  counters.forEach((el) => {
    const host = el.closest('.rv') ?? el;
    if (host.classList.contains('is-in')) { run(el); return; }
    host.addEventListener('reveal', () => run(el), { once: true });
  });
}
