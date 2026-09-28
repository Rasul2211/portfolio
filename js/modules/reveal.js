/* Появление блоков при прокрутке.

   Наблюдатель сообщает только о тех элементах, чья видимость меняется, пока он
   смотрит. Если по странице прыгнуть — открыть якорь, вернуться с
   восстановлением позиции, — всё, что осталось выше экрана, застрянет
   невидимым. Поэтому рядом с наблюдателем живёт подметание. */

import { env, onScroll } from '../utils/env.js';

const STAGGER_GROUPS = '.cards, .cases, .team, .reviews, .contacts, .skills, .sec-head';
const STAGGER_STEP = 0.07;
const STAGGER_MAX = 5;

/* Заголовок → слова в масках, каждое выезжает снизу со сдвигом */
function splitIntoMaskedWords(node) {
  const words = node.textContent.trim().split(/\s+/);
  node.textContent = '';

  words.forEach((word, index) => {
    const mask = document.createElement('span');
    mask.className = 'rv-mask';
    const inner = document.createElement('span');
    inner.textContent = word;
    inner.style.setProperty('--rd', `${index * 0.06}s`);
    mask.append(inner);
    node.append(mask);
    if (index < words.length - 1) node.append(document.createTextNode(' '));
  });
}

export function initReveal() {
  document.querySelectorAll('[data-mask-words]').forEach(splitIntoMaskedWords);

  const items = [...document.querySelectorAll('.rv')];
  if (!items.length) return;

  if (env.reducedMotion) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  document.querySelectorAll(STAGGER_GROUPS).forEach((group) => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty('--rd', `${Math.min(index, STAGGER_MAX) * STAGGER_STEP}s`);
    });
  });

  const pending = new Set(items);

  const show = (el) => {
    el.classList.add('is-in');
    pending.delete(el);
    observer.unobserve(el);
    el.dispatchEvent(new CustomEvent('reveal', { bubbles: true }));
  };

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && show(entry.target)),
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  );

  items.forEach((el) => observer.observe(el));

  onScroll(() => {
    if (!pending.size) return;
    for (const el of [...pending]) {
      if (el.getBoundingClientRect().top < innerHeight) show(el);
    }
  });
}
