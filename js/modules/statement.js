/* Крупное заявление: слова загораются по мере прокрутки.
   Редакционный приём — текст читается в темпе движения страницы. */

import { env, onScroll, clamp } from '../utils/env.js';

export function initStatement() {
  const node = document.querySelector('[data-statement]');
  if (!node) return;

  const accent = (node.dataset.accent ?? '')
    .split(',')
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);

  const words = node.textContent.trim().split(/\s+/);
  node.textContent = '';

  const spans = words.map((word, index) => {
    const span = document.createElement('span');
    span.className = 'w';
    const bare = word.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
    if (accent.includes(bare)) span.classList.add('accent');
    span.textContent = word;
    node.append(span);
    if (index < words.length - 1) node.append(document.createTextNode(' '));
    return span;
  });

  if (env.reducedMotion) {
    spans.forEach((s) => s.classList.add('lit'));
    return;
  }

  onScroll(() => {
    const rect = node.getBoundingClientRect();
    /* 0 — блок только показался снизу, 1 — дошёл до верхней трети экрана */
    const progress = clamp(
      (innerHeight * 0.82 - rect.top) / (rect.height + innerHeight * 0.34),
      0,
      1,
    );
    const lit = Math.round(progress * spans.length);
    spans.forEach((span, index) => span.classList.toggle('lit', index < lit));
  });
}
