/* Декоративный слой: уголки у секций и координаты сбоку.
   Уголки ставятся из кода — в разметке им делать нечего. */

import { env, onScroll } from '../utils/env.js';

const CORNERS = ['tl', 'tr', 'bl', 'br'];

export function initDecor() {
  /* ─ уголки ─ */
  const framed = [...document.querySelectorAll('[data-brackets]')];

  framed.forEach((section) => {
    section.classList.add('has-brackets');
    CORNERS.forEach((corner) => {
      const mark = document.createElement('span');
      mark.className = `bracket bracket--${corner}`;
      mark.setAttribute('aria-hidden', 'true');
      section.append(mark);
    });
  });

  if (framed.length) {
    if (env.reducedMotion) {
      framed.forEach((s) => s.classList.add('is-seen'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-seen');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      framed.forEach((s) => observer.observe(s));
    }
  }

  /* ─ координаты: перекрашиваются над тёмными блоками ─ */
  const coords = document.querySelector('.coords');
  if (!coords) return;

  const darkZones = [...document.querySelectorAll('.hero, .cta, .footer, .page-hero')];
  if (!darkZones.length) return;

  onScroll(() => {
    const probe = innerHeight / 2;
    const overDark = darkZones.some((zone) => {
      const r = zone.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    coords.classList.toggle('on-dark', overDark);
  });
}
