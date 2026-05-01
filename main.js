const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── NAV: HERO DARK / LIGHT SWITCH ────────────────────────────────────── */
const nav  = document.getElementById('main-nav');
const hero = document.getElementById('hero');

const heroObs = new IntersectionObserver(([entry]) => {
  nav.classList.toggle('on-hero', entry.isIntersecting);
}, { threshold: 0 });
heroObs.observe(hero);

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

/* ─── NAV: MOBILE TOGGLE ────────────────────────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const menu   = document.getElementById('nav-menu');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('open', !open);
});
menu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
  });
});

/* ─── NAV: ACTIVE SECTION HIGHLIGHTING ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: `-${nav.offsetHeight + 1}px 0px -55% 0px`, threshold: 0 });

sections.forEach(s => sectionObs.observe(s));

/* ─── HERO VIDEO MOUSE PARALLAX ─────────────────────────────────────────── */
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
  // Explicitly call play() — required for autoplay on iOS Safari
  heroVideo.play().catch(() => {
    // Autoplay blocked; retry on first touch
    document.addEventListener('touchstart', () => heroVideo.play(), { once: true, passive: true });
  });

  if (!prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      if (!nav.classList.contains('on-hero')) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroVideo.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    }, { passive: true });
  }
}

/* ─── HERO CONTENT SCROLL PARALLAX ─────────────────────────────────────── */
const heroInner = document.querySelector('.hero-inner');

if (heroInner && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < hero.offsetHeight) {
      heroInner.style.transform = `translateY(${y * 0.22}px)`;
    }
  }, { passive: true });
}

/* ─── HERO TYPING ANIMATION ─────────────────────────────────────────────── */
const descriptor = document.querySelector('.hero-descriptor');

if (descriptor && !prefersReducedMotion) {
  const fullText = descriptor.textContent.trim();
  descriptor.textContent = '';

  setTimeout(() => {
    let i = 0;
    const tick = setInterval(() => {
      descriptor.textContent += fullText[i++];
      if (i >= fullText.length) clearInterval(tick);
    }, 32);
  }, 1050); // starts just after hero fade-in animations settle
}

/* ─── SCROLL REVEALS ────────────────────────────────────────────────────── */
function addReveal(selector, cls = 'reveal') {
  document.querySelectorAll(selector).forEach(el => el.classList.add(cls));
}

// Apply reveal classes (JS-only so content is visible without JS)
addReveal('.section-title');
addReveal('.about-grid');
addReveal('.project-card');
addReveal('.skill-group');
addReveal('.education-item');
addReveal('.award-item');
addReveal('.contact-inner > *');
addReveal('.personal-grid');
addReveal('.timeline-item', 'reveal-left');

// Stagger project cards
document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.07}s`;
});

// Stagger skill groups
document.querySelectorAll('.skills-grid .skill-group').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});

// Stagger timeline items
document.querySelectorAll('.timeline-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

// Stagger award items
document.querySelectorAll('.award-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.12}s`;
});

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObs.observe(el));

/* ─── SEQUENCE RAIN STRIP ───────────────────────────────────────────────── */
const bioCanvas = document.getElementById('bio-canvas');

if (bioCanvas && !prefersReducedMotion) {
  const ctx = bioCanvas.getContext('2d');
  let W, H;

  function resizeBio() {
    W = bioCanvas.width  = bioCanvas.offsetWidth;
    H = bioCanvas.height = bioCanvas.offsetHeight;
  }
  resizeBio();

  const SEQ     = 'ATCGATCGATCGACGTACGTMRWSYKVHDBNATCGATCGACDEFGHIKLMNPQRSTVWY';
  const FONT_H  = 13;
  const COL_W   = 18;
  let cols, drops, speeds, colChars;

  function initRain() {
    cols     = Math.ceil(W / COL_W) + 2;
    drops    = Array.from({ length: cols }, () => Math.random() * -(H / FONT_H + 5));
    speeds   = Array.from({ length: cols }, () => 0.15 + Math.random() * 0.45);
    colChars = Array.from({ length: cols }, () =>
      Array.from({ length: Math.ceil(H / FONT_H) + 20 },
        () => SEQ[Math.floor(Math.random() * SEQ.length)])
    );
  }
  initRain();
  window.addEventListener('resize', () => { resizeBio(); initRain(); }, { passive: true });

  function rainFrame() {
    requestAnimationFrame(rainFrame);

    ctx.fillStyle = 'rgba(14,13,11,0.18)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${FONT_H}px 'JetBrains Mono', monospace`;
    for (let c = 0; c < cols; c++) {
      const x = c * COL_W + 2;
      for (let r = 0; r < 28; r++) {
        const row  = Math.floor(drops[c]) - r;
        const y    = row * FONT_H;
        if (y < 0 || y > H + FONT_H) continue;
        const alpha = r === 0 ? 0.6 : Math.max(0, 0.09 - r * 0.004);
        if (alpha < 0.005) break;
        const len = colChars[c].length;
        const idx = ((row % len) + len) % len;
        ctx.fillStyle = `rgba(237,233,227,${alpha.toFixed(3)})`;
        ctx.fillText(colChars[c][idx], x, y);
      }
      drops[c] += speeds[c];
      if (drops[c] * FONT_H > H + FONT_H * 10) {
        drops[c]  = -Math.random() * 20;
        speeds[c] = 0.15 + Math.random() * 0.45;
      }
    }
  }
  rainFrame();
}

/* ─── PARTICLE FLOW STRIP ───────────────────────────────────────────────── */
const particleCanvas = document.getElementById('particle-canvas');

if (particleCanvas && !prefersReducedMotion) {
  const ctx = particleCanvas.getContext('2d');
  let W, H;

  function resizeParticle() {
    W = particleCanvas.width  = particleCanvas.offsetWidth;
    H = particleCanvas.height = particleCanvas.offsetHeight;
  }
  resizeParticle();
  window.addEventListener('resize', resizeParticle, { passive: true });

  const NUM_P = 130;
  const pts   = [];

  function spawnParticle(scatter) {
    return {
      x:  scatter ? Math.random() * W : -4,
      y:  Math.random() * H,
      vx: 0.6 + Math.random() * 1.6,
      vy: (Math.random() - 0.5) * 1.2,
      r:  1.5 + Math.random() * 2.8,
      a:  0.45 + Math.random() * 0.5,
    };
  }
  for (let i = 0; i < NUM_P; i++) pts.push(spawnParticle(true));

  let tick = 0;

  function particleFrame() {
    requestAnimationFrame(particleFrame);
    tick++;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < NUM_P; i++) {
      const p = pts[i];

      const angle = Math.sin(p.x * 0.004 + tick * 0.005) * 0.7
                  + Math.cos(p.y * 0.007 + tick * 0.003) * 0.3;
      p.vx += Math.cos(angle) * 0.02;
      p.vy += Math.sin(angle) * 0.02;
      p.vx  = Math.min(Math.max(p.vx * 0.99, 0.4), 4);
      p.vy *= 0.98;
      p.x  += p.vx;
      p.y  += p.vy;

      // Bounce off top/bottom so particles wave freely without escaping
      if (p.y < 0)  { p.y = 0;  p.vy =  Math.abs(p.vy); }
      if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }

      if (p.x > W + 12) {
        pts[i] = spawnParticle(false);
        continue;
      }

      const fadeIn  = Math.min(1, p.x / 60);
      const fadeOut = Math.min(1, (W - p.x) / 60);
      const a = p.a * Math.min(fadeIn, fadeOut);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237,233,227,${a.toFixed(3)})`;
      ctx.fill();
    }
  }
  particleFrame();
}

/* ─── COURSE LIST TOGGLE ────────────────────────────────────────────────── */
const MAX_COURSES = 8;

document.querySelectorAll('.course-tags[data-collapsible]').forEach(container => {
  const tags = Array.from(container.querySelectorAll('.tag'));
  if (tags.length <= MAX_COURSES) return;

  const extra = tags.slice(MAX_COURSES);
  extra.forEach(t => { t.hidden = true; });

  const btn = document.createElement('button');
  btn.className = 'courses-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = `Show all ${tags.length} courses`;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    extra.forEach(t => { t.hidden = open; });
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? `Show all ${tags.length} courses` : 'Show fewer courses';
  });

  container.after(btn);
});
