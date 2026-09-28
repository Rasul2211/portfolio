/* Среда выполнения: одно место, где решается, что можно анимировать */

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const pointerQuery = matchMedia('(hover: hover) and (pointer: fine)');

export const env = {
  get reducedMotion() { return motionQuery.matches; },
  get finePointer() { return pointerQuery.matches; },
  get canAnimate() { return !motionQuery.matches; },
  /* эффекты для мыши: курсор, магнит, наклон */
  get canPoint() { return !motionQuery.matches && pointerQuery.matches; },
};

/* Один rAF-цикл на всё приложение вместо цикла в каждом модуле */
const frameTasks = new Set();
let running = false;

function tick(time) {
  for (const task of frameTasks) task(time);
  if (frameTasks.size) requestAnimationFrame(tick);
  else running = false;
}

export function onFrame(task) {
  frameTasks.add(task);
  if (!running) { running = true; requestAnimationFrame(tick); }
  return () => frameTasks.delete(task);
}

/* Обработчик прокрутки, сжатый до одного кадра */
export function onScroll(handler) {
  let queued = false;
  const run = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; handler(); });
  };
  addEventListener('scroll', run, { passive: true });
  addEventListener('resize', run, { passive: true });
  handler();
  return run;
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
