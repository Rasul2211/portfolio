/* Исраилов Мухаммадрасул — портфолио */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ─── Фон шапки + активный пункт ─── */
const nav = document.getElementById('nav');
const sections = [...document.querySelectorAll('section[id]')];
const menuLinks = [...navLinks.querySelectorAll('a')];

let ticking = false;
function onScroll() {
  nav.classList.toggle('scrolled', scrollY > 40);

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
const items = document.querySelectorAll('.reveal');

if (reduced) {
  items.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // небольшая задержка для соседних карточек в одной сетке
  document.querySelectorAll('.projects-grid, .team-grid, .skills-grid, .contacts').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i, 4) * 0.07}s`;
    });
  });

  items.forEach(el => io.observe(el));
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
