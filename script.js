/* Исраилов Мухаммадрасул — портфолио */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ─── Мобильное меню ─── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('locked');
}

burger.addEventListener('click', () => {
  const open = !navLinks.classList.contains('open');
  burger.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('locked', open);
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ─── Шапка: тёмная на первом экране, светлая дальше ─── */
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');
const sections = [...document.querySelectorAll('section[id]')];
const menuLinks = [...navLinks.querySelectorAll('a')];

let ticking = false;
function onScroll() {
  const heroBottom = hero.offsetHeight - 70;
  nav.classList.toggle('light', scrollY > heroBottom);

  let current = '';
  for (const s of sections) {
    if (scrollY >= s.offsetTop - innerHeight * 0.4) current = s.id;
  }
  menuLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ─── Появление блоков при скролле ─── */
const revealItems = document.querySelectorAll('.reveal');

if (reduced) {
  revealItems.forEach(el => el.classList.add('in'));
} else {
  // лёгкая «лесенка» для соседей в одной сетке
  document.querySelectorAll('.projects-grid, .cases, .team-grid, .skills-grid, .reviews-grid, .contacts, .sec-head')
    .forEach(group => {
      [...group.children].forEach((child, i) => {
        child.style.transitionDelay = `${Math.min(i, 5) * 0.08}s`;
      });
    });

  const pending = new Set(revealItems);

  function show(el) {
    el.classList.add('in');
    pending.delete(el);
    io.unobserve(el);
    el.querySelectorAll('.count').forEach(runCount);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealItems.forEach(el => io.observe(el));

  // Страховка: наблюдатель молчит о блоках, через которые прыгнули — при
  // переходе по якорю, восстановлении позиции или резком скролле. Всё, что
  // уже выше нижней границы экрана, показываем принудительно.
  function sweep() {
    if (!pending.size) return;
    for (const el of [...pending]) {
      if (el.getBoundingClientRect().top < innerHeight) show(el);
    }
  }
  addEventListener('scroll', sweep, { passive: true });
  addEventListener('load', sweep);
  sweep();
}

/* ─── Счётчики ─── */
function runCount(el) {
  const to = +el.dataset.to;
  if (reduced) { el.textContent = to; return; }
  const dur = 900, start = performance.now();
  (function step(now) {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
if (reduced) document.querySelectorAll('.count').forEach(runCount);

/* ─── Наклон карточек за курсором ─── */
if (!reduced && finePointer) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const max = 7;

    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('tilting');
      el.style.transform =
        `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateZ(4px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.classList.remove('tilting');
      el.style.transform = '';
    });
  });
}

/* ─── Параллакс портрета на первом экране ─── */
if (!reduced) {
  const photo = document.querySelector('.hero-photo');
  const orbs = document.querySelectorAll('.hero-orb');
  addEventListener('scroll', () => {
    const y = scrollY;
    if (y > innerHeight * 1.3) return;
    if (photo) photo.style.translate = `0 ${y * 0.1}px`;
    orbs.forEach((o, i) => { o.style.translate = `0 ${y * (i ? 0.16 : 0.07)}px`; });
  }, { passive: true });
}

/* ─── Якоря с учётом высоты шапки ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollTo({
      top: target.getBoundingClientRect().top + scrollY - 64,
      behavior: reduced ? 'auto' : 'smooth'
    });
  });
});
