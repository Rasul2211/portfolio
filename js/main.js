/* Точка входа. Каждый модуль сам решает, работать ему или молчать
   (тач-устройство, prefers-reduced-motion, отсутствие своей разметки). */

import { initSmoothScroll, bindAnchors } from './modules/smooth.js';
import { initReveal } from './modules/reveal.js';
import { initNav } from './modules/nav.js';
import { initCursor } from './modules/cursor.js';
import { initMagnetic } from './modules/magnetic.js';
import { initProgress } from './modules/progress.js';
import { initCounters } from './modules/counters.js';
import { initDecor } from './modules/decor.js';
import { initStatement } from './modules/statement.js';
import { initWorkPreview } from './modules/workPreview.js';
import { initTransitions } from './modules/transitions.js';
import { initSteps } from './modules/steps.js';
import { initFaq } from './modules/faq.js';

initNav();
initReveal();
initDecor();
initStatement();
initCounters();
initProgress();
initCursor();
initMagnetic();
initWorkPreview();
initSteps();
initFaq();
initTransitions();
bindAnchors();

/* Lenis грузится с CDN — не блокируем им отрисовку */
initSmoothScroll();
