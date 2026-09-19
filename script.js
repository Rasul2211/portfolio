/* ═══════════════════════════════════════════
   Портфолио · Исраилов Мухаммадрасул
   ═══════════════════════════════════════════ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───── Разбивка текста на буквы / слова ───── */
function splitLetters() {
  document.querySelectorAll('[data-split]').forEach((el, rowIndex) => {
    const text = el.textContent.trim();
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = `${0.25 + rowIndex * 0.12 + i * 0.035}s`;
      el.appendChild(s);
    });
  });
}

function splitWords() {
  document.querySelectorAll('[data-split-words]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'wd';
      s.textContent = w;
      s.style.animationDelay = `${i * 0.09}s`;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
}

splitLetters();
splitWords();

/* ───── Прелоадер со счётчиком ───── */
(function preloader() {
  const box = document.getElementById('preloader');
  const bar = document.getElementById('preBar');
  const num = document.getElementById('preCount');
  let value = 0;
  let pageLoaded = false;

  window.addEventListener('load', () => { pageLoaded = true; });

  const tick = setInterval(() => {
    // до 90% идём сами, дальше ждём реальной загрузки
    const ceiling = pageLoaded ? 100 : 90;
    value = Math.min(ceiling, value + Math.random() * 9 + 3);
    bar.style.width = value + '%';
    num.textContent = Math.floor(value);

    if (value >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        box.classList.add('hide');
        document.body.classList.add('loaded');
      }, 320);
    }
  }, 110);

  // страховка: не держим экран дольше 4 секунд
  setTimeout(() => {
    pageLoaded = true;
    if (!box.classList.contains('hide')) {
      clearInterval(tick);
      bar.style.width = '100%';
      num.textContent = '100';
      box.classList.add('hide');
      document.body.classList.add('loaded');
    }
  }, 4000);
})();

/* ───── Шапка: фон при скролле + бургер ───── */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('locked', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.classList.remove('locked');
  });
});

/* ───── Прогресс скролла, активный пункт меню, линия истории ───── */
const progress = document.getElementById('scrollProgress');
const storyLine = document.getElementById('storyLine');
const storySection = document.getElementById('story');
const sections = [...document.querySelectorAll('section[id]')];
const menuLinks = [...navLinks.querySelectorAll('a[href^="#"]')];

let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;

  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  navbar.classList.toggle('scrolled', y > 60);

  // подсветка активного раздела
  let current = '';
  for (const s of sections) {
    if (y >= s.offsetTop - window.innerHeight * 0.35) current = s.id;
  }
  menuLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  // вертикальная линия в разделе «История»
  if (storyLine && storySection) {
    const rect = storySection.getBoundingClientRect();
    const passed = (window.innerHeight * 0.6 - rect.top) / rect.height;
    storyLine.style.height = Math.max(0, Math.min(1, passed)) * 100 + '%';
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ───── Появление блоков при скролле ───── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('in');
    revealObserver.unobserve(el);

    // счётчики
    el.querySelectorAll('[data-target]').forEach(runCounter);
    // полосы навыков
    el.querySelectorAll('.bar i').forEach(bar => {
      bar.style.width = bar.dataset.val + '%';
    });
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

// лёгкая «лесенка» для карточек внутри одной сетки
document.querySelectorAll('.skill-cards, .team-grid, .values-grid, .gallery-grid').forEach(grid => {
  [...grid.children].forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ───── Счётчики ───── */
function runCounter(el) {
  const target = +el.dataset.target;
  if (reduced) { el.textContent = target; return; }
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
// счётчики первого экрана запускаем сразу
document.querySelectorAll('.hero-quick [data-target]').forEach(el => {
  setTimeout(() => runCounter(el), 1400);
});

/* ───── Ротатор ролей ───── */
(function roleRotator() {
  const host = document.querySelector('#roleRotator b');
  if (!host) return;
  const roles = ['разработчик', 'бывший футболист', 'фронтендер', 'часть команды из трёх', 'упрямый человек'];
  let idx = 0, pos = 0, deleting = false;

  if (reduced) { host.textContent = roles[0]; return; }

  function loop() {
    const word = roles[idx];
    pos += deleting ? -1 : 1;
    host.textContent = word.slice(0, pos);

    let delay = deleting ? 45 : 85;
    if (!deleting && pos === word.length) { delay = 1700; deleting = true; }
    else if (deleting && pos === 0) { deleting = false; idx = (idx + 1) % roles.length; delay = 320; }

    setTimeout(loop, delay);
  }
  setTimeout(loop, 2000);
})();

/* ───── Курсор, свечение и магнитные элементы ───── */
(function pointerFx() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('glowFollow');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my, gx = mx, gy = my;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function render() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    gx += (mx - gx) * 0.045;
    gy += (my - gy) * 0.045;

    if (fine) {
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  if (!reduced) render();

  if (!fine) return;

  document.querySelectorAll('a, button, .gitem, .tcard, .scard, .fact, .vcard').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });

  // магнитное притяжение кнопок
  document.querySelectorAll('[data-magnet]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ───── 3D-наклон карточек и фото ───── */
if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${-py * 9}deg) rotateY(${px * 11}deg) translateZ(6px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
}

/* ───── Параллакс первого экрана ───── */
if (!reduced) {
  const portrait = document.querySelector('.portrait-frame');
  const aura = document.querySelector('.hero-aura');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    if (portrait) portrait.style.translate = `0 ${y * 0.12}px`;
    if (aura) aura.style.translate = `0 ${y * 0.18}px`;
  }, { passive: true });
}

/* ───── Мягкий скролл к якорям ───── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 70,
      behavior: reduced ? 'auto' : 'smooth'
    });
  });
});

/* ───── Пасхалка: клавиша G ───── */
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() !== 'g' || e.target.matches('input, textarea')) return;
  const ball = document.createElement('div');
  ball.textContent = '⚽';
  ball.style.cssText = `position:fixed;left:${Math.random() * 90}vw;top:-60px;font-size:2rem;
    z-index:9400;pointer-events:none;transition:transform 2.2s cubic-bezier(.4,0,1,1),opacity .4s 1.8s`;
  document.body.appendChild(ball);
  requestAnimationFrame(() => {
    ball.style.transform = `translateY(${window.innerHeight + 120}px) rotate(720deg)`;
    ball.style.opacity = '0';
  });
  setTimeout(() => ball.remove(), 2600);
});
