/* Тонкая вертикальная линия справа: где мы на странице.
   Почти невидима, над тёмными блоками перекрашивается в золото. */

import { onScroll, clamp } from '../utils/env.js';

export function initProgress() {
  const bar = document.querySelector('.progress');
  if (!bar) return;

  const fill = bar.querySelector('i');
  const darkZones = [...document.querySelectorAll('.hero, .cta, .footer')];

  onScroll(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.height = `${clamp(max > 0 ? (scrollY / max) * 100 : 0, 0, 100)}%`;

    const probe = innerHeight / 2;
    const overDark = darkZones.some((zone) => {
      const r = zone.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    bar.classList.toggle('on-dark', overDark);
  });
}
