/* Переход между страницами.

   Там, где браузер умеет View Transitions, всё делает CSS — правило
   @view-transition в page.css. Здесь только запасной вариант для остальных:
   короткое затухание перед уходом, чтобы страница не «моргала». */

import { env } from '../utils/env.js';

const SUPPORTED = 'startViewTransition' in document;

/* Известная особенность: при межстраничном переходе Chrome роняет в консоль
   «Uncaught (in promise) AbortError: Transition was skipped». Промис создаёт
   сам браузер и наружу не отдаёт, а отклоняется тот уже в уходящем документе,
   поэтому обработчик unhandledrejection до него не достаёт — проверено.
   На посетителя это не влияет: переход отрабатывает, видно только в консоли. */

export function initTransitions() {
  if (SUPPORTED || env.reducedMotion) return;

  document.querySelectorAll('a[href]').forEach((link) => {
    const url = link.getAttribute('href');
    if (!url || url.startsWith('#') || url.startsWith('mailto:')) return;
    if (link.target === '_blank' || link.hostname !== location.hostname) return;

    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { location.href = link.href; }, 260);
    });
  });

  /* возврат «назад» не должен оставлять страницу затемнённой */
  addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));
}
