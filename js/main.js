/* Точка входа. Каждый модуль сам решает, работать ему или молчать
   (тач-устройство, prefers-reduced-motion). */

import { initSmoothScroll, bindAnchors } from './modules/smooth.js';
import { initReveal } from './modules/reveal.js';
import { initNav } from './modules/nav.js';
import { initCursor } from './modules/cursor.js';
import { initMagnetic } from './modules/magnetic.js';
import { initProgress } from './modules/progress.js';
import { initCounters } from './modules/counters.js';

initNav();
initReveal();
initCounters();
initProgress();
initCursor();
initMagnetic();
bindAnchors();

/* Lenis грузится с CDN — не блокируем им отрисовку */
initSmoothScroll();
