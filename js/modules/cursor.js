/* Курсор: точка следует мгновенно, кольцо догоняет.
   Над ссылками кольцо растёт, над карточками показывает VIEW.
   На тач-устройствах и при reduced-motion не создаётся вовсе. */

import { env, onFrame, lerp } from '../utils/env.js';

const LINK_SELECTOR = 'a, button, .skill, .contacts li';
const VIEW_SELECTOR = '.card, .case, .review, .hero-figure, .about-figure, .member';
const DARK_SELECTOR = '.hero, .cta, .footer, .marquee';

export function initCursor() {
  if (!env.canPoint) return;

  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = '<span class="cursor-label">VIEW</span>';

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  document.body.append(ring, dot);

  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let visible = false;

  addEventListener('pointermove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;

    if (!visible) {
      visible = true;
      ringX = pointerX;
      ringY = pointerY;
    }

    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const overView = Boolean(target.closest(VIEW_SELECTOR));
    const overLink = !overView && Boolean(target.closest(LINK_SELECTOR));
    const overDark = Boolean(target.closest(DARK_SELECTOR));

    ring.classList.toggle('is-view', overView);
    ring.classList.toggle('is-link', overLink);
    ring.classList.toggle('on-dark', overDark && !overView);
    dot.classList.toggle('on-dark', overDark);
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity = '0';
  });
  document.addEventListener('pointerenter', () => {
    ring.style.opacity = '';
    dot.style.opacity = '';
  });

  onFrame(() => {
    ringX = lerp(ringX, pointerX, 0.18);
    ringY = lerp(ringY, pointerY, 0.18);
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
  });
}
