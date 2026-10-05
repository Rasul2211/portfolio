/* Вопросы и ответы: раскрывается один пункт за раз.
   Высота анимируется через grid-template-rows 0fr → 1fr, поэтому работает
   с любым объёмом текста и не требует измерять высоту в коде. */

export function initFaq() {
  const list = document.querySelector('[data-faq]');
  if (!list) return;

  const items = [...list.querySelectorAll('.faq-item')];
  if (!items.length) return;

  items.forEach((item, index) => {
    const button = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!button || !answer) return;

    const id = `faq-a-${index + 1}`;
    answer.id = id;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-expanded', 'false');
    item.dataset.open = 'false';

    button.addEventListener('click', () => {
      const willOpen = item.dataset.open !== 'true';

      items.forEach((other) => {
        other.dataset.open = 'false';
        other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.dataset.open = 'true';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
