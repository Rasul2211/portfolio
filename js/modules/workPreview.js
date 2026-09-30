/* Превью работы, летящее за курсором по списку.
   Только для мыши: на тач-устройстве курсора нет, показывать нечего. */

import { env, onFrame, lerp } from '../utils/env.js';

export function initWorkPreview() {
  const list = document.querySelector('[data-work]');
  if (!list || !env.canPoint) return;

  const items = [...list.querySelectorAll('[data-preview]')];
  if (!items.length) return;

  const box = document.createElement('div');
  box.className = 'work-preview';
  box.setAttribute('aria-hidden', 'true');
  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  box.append(img);
  document.body.append(box);

  /* заранее подгружаем, чтобы превью не мигало пустотой */
  items.forEach((item) => { new Image().src = item.dataset.preview; });

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let active = false;

  items.forEach((item) => {
    item.addEventListener('pointerenter', (e) => {
      img.src = item.dataset.preview;
      if (!active) { x = e.clientX; y = e.clientY; }
      active = true;
      box.classList.add('is-on');
    });
    item.addEventListener('pointerleave', () => {
      active = false;
      box.classList.remove('is-on');
    });
  });

  addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  onFrame(() => {
    if (!active) return;
    x = lerp(x, targetX, 0.14);
    y = lerp(y, targetY, 0.14);
    /* небольшой наклон по скорости — превью «ведёт» за движением */
    const tilt = Math.max(-9, Math.min(9, (targetX - x) * 0.14));
    box.style.transform =
      `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;
  });
}
