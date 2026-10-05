/* Движение первого экрана.

   Три источника:
   — появление имени по буквам при загрузке;
   — слои, реагирующие на мышь;
   — те же слои, уезжающие при прокрутке.

   Мышь и прокрутка пишут CSS-переменные, а складывает их уже CSS через
   свойство translate. Это важно: transform занят анимацией появления,
   и если писать в него же, одно будет затирать другое. */

import { env, onFrame, onScroll, clamp, lerp } from '../utils/env.js';

const CHAR_STEP = 0.035;

/* ─── Имя по буквам ─── */
function splitChars(node, baseDelay) {
  const text = node.textContent.trim();
  node.textContent = '';
  node.setAttribute('aria-label', text);

  [...text].forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = char;
    span.style.setProperty('--cd', `${baseDelay + index * CHAR_STEP}s`);
    node.append(span);
  });
}

/* Сшиваем градиент обратно: каждой букве даём фон во всю ширину строки и
   сдвигаем его на смещение буквы. Иначе каждая буква красится отдельно и
   видно стыки. */
function stitchGradient(node) {
  const chars = [...node.querySelectorAll('.ch')];
  if (!chars.length) return;

  const base = node.getBoundingClientRect();
  if (!base.width) return;

  chars.forEach((ch) => {
    const r = ch.getBoundingClientRect();
    ch.style.backgroundSize = `${base.width}px 100%`;
    ch.style.backgroundPosition = `${-(r.left - base.left)}px 0`;
  });
}

export function initHeroMotion() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  /* буквы режем всегда: без анимации они просто стоят на месте */
  hero.querySelectorAll('[data-chars]').forEach((node) => {
    splitChars(node, Number(node.dataset.chars) || 0);
  });

  const tinted = [...hero.querySelectorAll('.hero-name .tint')];
  const restitch = () => tinted.forEach(stitchGradient);

  if (tinted.length) {
    restitch();
    /* шрифт меняет ширины — пересчитываем, когда он доехал */
    document.fonts?.ready.then(restitch).catch(() => {});

    let resizeTimer = 0;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(restitch, 150);
    }, { passive: true });
  }

  if (env.reducedMotion) return;

  /* ─── Прокрутка ─── */
  onScroll(() => {
    const past = clamp(scrollY / innerHeight, 0, 1.4);
    hero.style.setProperty('--sy', past.toFixed(4));
  });

  if (!env.finePointer) return;

  /* ─── Мышь ─── */
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    targetX = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 2;
    targetY = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 2;
  }, { passive: true });

  hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });

  onFrame(() => {
    /* догоняем медленно — резкое следование за курсором выглядит дёшево */
    x = lerp(x, targetX, 0.06);
    y = lerp(y, targetY, 0.06);
    if (Math.abs(x - targetX) < 0.0005 && Math.abs(y - targetY) < 0.0005) return;
    hero.style.setProperty('--mx', x.toFixed(4));
    hero.style.setProperty('--my', y.toFixed(4));
  });
}
