/* Шапка: мобильное меню, сжатие при прокрутке, перекраска над тёмными
   секциями и подсветка текущего раздела. */

import { onScroll } from '../utils/env.js';

const DARK_ZONES = '.hero, .cta, .footer, .marquee';

export function initNav() {
  const nav = document.getElementById('nav');
  const links = document.getElementById('navLinks');
  const burger = document.getElementById('burger');
  if (!nav || !links || !burger) return;

  /* ─ мобильное меню ─ */
  const setMenu = (open) => {
    links.dataset.open = String(open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  };

  burger.addEventListener('click', () => {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ─ состояние при прокрутке ─ */
  const sections = [...document.querySelectorAll('section[id]')];
  const menuLinks = [...links.querySelectorAll('a[href^="#"]')];
  const darkZones = [...document.querySelectorAll(DARK_ZONES)];

  onScroll(() => {
    nav.classList.toggle('is-compact', scrollY > 90);

    /* шапка светлеет, как только уходит с тёмного блока */
    const probe = nav.offsetHeight / 2;
    const overDark = darkZones.some((zone) => {
      const r = zone.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    nav.classList.toggle('on-light', !overDark);

    /* текущий раздел */
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= innerHeight * 0.4) current = section.id;
    }
    menuLinks.forEach((a) => {
      const active = a.getAttribute('href') === `#${current}`;
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}
