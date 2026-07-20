/* ═══════════════════════════════════════════
   INFINITE VYBEFLIX PORTFOLIO — SCRIPT
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2200);
});

/* ═══════════════════════════════════════════
   CUSTOM CURSOR + TRAIL
   ═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let cx = 0, cy = 0, ctxTrail = 0, ctyTrail = 0;
let tx = 0, ty = 0;
let trailActive = false;

if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!trailActive) {
      trailActive = true;
      cursorTrail.style.opacity = '0.4';
    }
  });

  function updateCursor() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';

    ctxTrail += (tx - ctxTrail) * 0.08;
    ctyTrail += (ty - ctyTrail) * 0.08;
    cursorTrail.style.left = ctxTrail + 'px';
    cursorTrail.style.top = ctyTrail + 'px';

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const hoverTargets = 'a, button, .nav-toggle, .bento-card, .project-card, .skill-tag, .plink-api, .plink-visit, .project-expand, .social-btn, .footer-social-link, .modal-close, .lightbox-close, .projects-nav-btn, .projects-dot';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 150);
  });
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS
   ═══════════════════════════════════════════ */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = progress + '%';
});

/* ═══════════════════════════════════════════
   NAV SCROLL EFFECT
   ═══════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ═══════════════════════════════════════════
   MOBILE NAV TOGGLE
   ═══════════════════════════════════════════ */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ═══════════════════════════════════════════
   PARTICLE NETWORK CANVAS
   ═══════════════════════════════════════════ */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;
let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.baseAlpha = this.alpha;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
    // Mouse repulsion
    const mdx = this.x - mouseX;
    const mdy = this.y - mouseY;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 150) {
      const force = (150 - mdist) / 150;
      this.x += (mdx / mdist) * force * 2;
      this.y += (mdy / mdist) * force * 2;
      this.alpha = Math.min(1, this.baseAlpha + force * 0.5);
    } else {
      this.alpha += (this.baseAlpha - this.alpha) * 0.05;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212,175,55,${0.06 * (1 - dist / 180)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    // Mouse connection
    const mdx = particles[i].x - mouseX;
    const mdy = particles[i].y - mouseY;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 250) {
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - mdist / 250)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

/* ═══════════════════════════════════════════
   HERO TYPEWRITER
   ═══════════════════════════════════════════ */
const subtitle = document.getElementById('hero-subtitle');
const phrases = [
  'Founder & Lead AI Architect',
  'Builder of Nuvuja, Maureonix & Gateway',
  '100+ Projects. 1M+ Requests/Min.',
  'Nothing is impossible.'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 80;

function typeWriter() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    subtitle.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typeDelay = 40;
  } else {
    subtitle.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typeDelay = 80;
  }

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    typeDelay = 2500;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeDelay = 500;
  }

  setTimeout(typeWriter, typeDelay);
}
if (subtitle) setTimeout(typeWriter, 1500);

/* ═══════════════════════════════════════════
   HERO STATS COUNTER
   ═══════════════════════════════════════════ */
const heroStats = document.querySelectorAll('.hero-stat');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  heroStats.forEach(stat => {
    const target = parseInt(stat.dataset.count);
    const numEl = stat.querySelector('.num');
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      numEl.textContent = Math.floor(current) + (target === 1 ? '' : '+');
    }, 30);
  });
}

/* ═══════════════════════════════════════════
   MULTI-DIRECTIONAL SCROLL REVEAL
   ═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars if this is a skill category
      if (entry.target.classList.contains('skill-category')) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
          const level = entry.target.querySelectorAll('.skill-item')[i]?.dataset.level || 0;
          setTimeout(() => { fill.style.width = level + '%'; }, i * 150);
        });
      }
      // Animate stats when hero is visible
      if (entry.target.closest('.hero-stats')) {
        animateStats();
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .hero-stat').forEach(el => {
  revealObserver.observe(el);
});

/* ═══════════════════════════════════════════
   3D TILT EFFECT
   ═══════════════════════════════════════════ */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════
   BENTO CARD SPOTLIGHT
   ═══════════════════════════════════════════ */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ═══════════════════════════════════════════
   PROJECTS CAROUSEL
   ═══════════════════════════════════════════ */
const projectsTrack = document.getElementById('projects-track');
const projectsPrev = document.getElementById('projects-prev');
const projectsNext = document.getElementById('projects-next');
const projectsDots = document.getElementById('projects-dots');
let currentSlide = 0;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateCarousel() {
  if (!projectsTrack) return;
  const cards = projectsTrack.querySelectorAll('.project-card');
  const totalSlides = Math.ceil(cards.length / getSlidesPerView());
  const slideWidth = cards[0]?.offsetWidth + 28 || 0;
  projectsTrack.style.transform = `translateX(-${currentSlide * slideWidth * getSlidesPerView()}px)`;

  if (projectsPrev) projectsPrev.disabled = currentSlide === 0;
  if (projectsNext) projectsNext.disabled = currentSlide >= totalSlides - 1;

  // Update dots
  if (projectsDots) {
    projectsDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'projects-dot' + (i === currentSlide ? ' active' : '');
      dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); });
      projectsDots.appendChild(dot);
    }
  }
}

if (projectsPrev) {
  projectsPrev.addEventListener('click', () => {
    if (currentSlide > 0) { currentSlide--; updateCarousel(); }
  });
}
if (projectsNext) {
  projectsNext.addEventListener('click', () => {
    const cards = projectsTrack.querySelectorAll('.project-card');
    const totalSlides = Math.ceil(cards.length / getSlidesPerView());
    if (currentSlide < totalSlides - 1) { currentSlide++; updateCarousel(); }
  });
}
window.addEventListener('resize', () => { currentSlide = 0; updateCarousel(); });
setTimeout(updateCarousel, 500);

/* ═══════════════════════════════════════════
   TIMELINE SCROLL PROGRESS
   ═══════════════════════════════════════════ */
const timelineLine = document.getElementById('timeline-line');
const timelineSection = document.getElementById('experience');

function updateTimelineProgress() {
  if (!timelineLine || !timelineSection) return;
  const rect = timelineSection.getBoundingClientRect();
  const sectionTop = rect.top;
  const sectionHeight = rect.height;
  const viewportHeight = window.innerHeight;
  let progress = ((viewportHeight - sectionTop) / (sectionHeight + viewportHeight)) * 100;
  progress = Math.max(0, Math.min(100, progress));
  timelineLine.style.setProperty('--progress', progress + '%');
}
window.addEventListener('scroll', updateTimelineProgress);
updateTimelineProgress();

/* ═══════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = caption || '';
  if (lightboxCaption) lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ═══════════════════════════════════════════
   API MODAL
   ═══════════════════════════════════════════ */
const apiModal = document.getElementById('api-modal');
const apiUseCase = document.getElementById('api-usecase');

function openApiModal() {
  if (apiModal) apiModal.classList.add('active');
  if (apiUseCase) apiUseCase.value = '';
}

function closeApiModal() {
  if (apiModal) apiModal.classList.remove('active');
}

function requestApiKey() {
  const useCase = apiUseCase ? apiUseCase.value.trim() : '';
  const msg = `Hello Aevibron, I would like to request API access for the Aevibron Gateway.${useCase ? ' Use case: ' + useCase : ''}`;
  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(msg), '_blank');
  closeApiModal();
  showToast('Request opened in WhatsApp');
}

if (apiModal) {
  apiModal.addEventListener('click', (e) => {
    if (e.target === apiModal) closeApiModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeApiModal();
  });
}

/* ═══════════════════════════════════════════
   CONTACT FORM → WHATSAPP
   ═══════════════════════════════════════════ */
function sendMessage() {
  const name = document.getElementById('form-name')?.value.trim() || '';
  const email = document.getElementById('form-email')?.value.trim() || '';
  const message = document.getElementById('form-message')?.value.trim() || '';

  let text = 'Hello Aevibron,';
  if (name) text += ` My name is ${name}.`;
  if (email) text += ` Email: ${email}.`;
  if (message) text += ` ${message}`;
  if (!name && !email && !message) text += ' I would like to discuss a project with you.';

  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(text), '_blank');
  showToast('Message opened in WhatsApp');
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATION
   ═══════════════════════════════════════════ */
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimeout;

function showToast(msg) {
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
   ═══════════════════════════════════════════ */
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
   ═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   PARALLAX EFFECTS
   ═══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  // Hero parallax
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.transform = `translateY(${scrollY * 0.15}px)`;
    hero.style.opacity = Math.max(0, 1 - scrollY / 600);
  }
  // About photo parallax
  const aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto) {
    const aboutRect = aboutPhoto.getBoundingClientRect();
    if (aboutRect.top < window.innerHeight && aboutRect.bottom > 0) {
      aboutPhoto.style.transform = `translateY(${scrollY * 0.03}px)`;
    }
  }
});

/* ═══════════════════════════════════════════
   GLITCH TEXT EFFECT ON SCROLL
   ═══════════════════════════════════════════ */
const glitchTexts = document.querySelectorAll('.glitch-text');
const glitchObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('glitching');
      setTimeout(() => entry.target.classList.remove('glitching'), 1000);
    }
  });
}, { threshold: 0.5 });
glitchTexts.forEach(el => glitchObserver.observe(el));

/* ═══════════════════════════════════════════
   PHOTO FRAME SCAN ON HOVER
   ═══════════════════════════════════════════ */
document.querySelectorAll('.photo-frame').forEach(frame => {
  frame.addEventListener('mouseenter', () => {
    const scan = frame.querySelector('.photo-scan');
    if (scan) scan.style.animationDuration = '1s';
  });
  frame.addEventListener('mouseleave', () => {
    const scan = frame.querySelector('.photo-scan');
    if (scan) scan.style.animationDuration = '4s';
  });
});

/* ═══════════════════════════════════════════
   RANDOM GLITCH ON PROJECT CARDS
   ═══════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const glitch = card.querySelector('.project-image-glitch');
    if (glitch) {
      glitch.style.opacity = '1';
      let count = 0;
      const interval = setInterval(() => {
        glitch.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
        count++;
        if (count > 10) {
          clearInterval(interval);
          glitch.style.transform = '';
        }
      }, 50);
    }
  });
});

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero stats animation if already in view
  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    const rect = heroStatsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight) animateStats();
  }

  // Add visible class to hero elements immediately
  document.querySelectorAll('.hero .reveal-up, .hero-stat').forEach(el => {
    el.classList.add('visible');
  });
});
