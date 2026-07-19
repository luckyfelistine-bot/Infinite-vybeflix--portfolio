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
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

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
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212,175,55,${0.08 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    // Mouse connection
    const mdx = particles[i].x - mouseX;
    const mdy = particles[i].y - mouseY;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 200) {
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = `rgba(56,189,248,${0.1 * (1 - mdist / 200)})`;
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
   CUSTOM CURSOR
   ═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
let cx = 0, cy = 0;
let tx = 0, ty = 0;

if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function updateCursor() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.querySelectorAll('a, button, .nav-toggle, .bento-card, .project-card, .skill-tag, .plink-api').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 150);
  });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   NAV SCROLL EFFECT
   ═══════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
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
    typeDelay = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeDelay = 500;
  }

  setTimeout(typeWriter, typeDelay);
}
setTimeout(typeWriter, 1000);

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
   API MODAL
   ═══════════════════════════════════════════ */
const apiModal = document.getElementById('api-modal');
const apiUseCase = document.getElementById('api-usecase');

function openApiModal() {
  apiModal.classList.add('active');
  if (apiUseCase) apiUseCase.value = '';
}

function closeApiModal() {
  apiModal.classList.remove('active');
}

function requestApiKey() {
  const useCase = apiUseCase ? apiUseCase.value.trim() : '';
  const msg = `Hello Aevibron, I would like to request API access for the Aevibron Gateway.${useCase ? ' Use case: ' + useCase : ''}`;
  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(msg), '_blank');
  closeApiModal();
}

apiModal.addEventListener('click', (e) => {
  if (e.target === apiModal) closeApiModal();
});

/* ═══════════════════════════════════════════
   CONTACT FORM → WHATSAPP
   ═══════════════════════════════════════════ */
function sendMessage() {
  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  let text = 'Hello Aevibron,';
  if (name) text += ` My name is ${name}.`;
  if (email) text += ` Email: ${email}.`;
  if (message) text += ` ${message}`;
  if (!name && !email && !message) text += ' I would like to discuss a project with you.';

  window.open('https://wa.me/254116903500?text=' + encodeURIComponent(text), '_blank');
}

/* ═══════════════════════════════════════════
   MOBILE NAV TOGGLE
   ═══════════════════════════════════════════ */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'rgba(2,2,5,0.95)';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.padding = '20px 40px';
    navLinks.style.borderBottom = '1px solid var(--border)';
    navLinks.style.gap = '16px';
  });
}
