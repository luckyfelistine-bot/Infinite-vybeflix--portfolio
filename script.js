/* ============================================
   INFINITE VYBEFLIX — PORTFOLIO BOOK v2.0
   Ultra-Premium JavaScript Controller
   Particles · Confetti · 3D Tilt · Sound ·
   Typing · Counters · Magnetic Cursor
   ============================================ */

const sheets = document.querySelectorAll('.sheet');
const totalSheets = sheets.length;
let currentSheet = 0;
let isFlipping = false;

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoading() {
  const screen = document.getElementById('loadingScreen');
  const percentEl = document.getElementById('loadingPercent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        initWelcomeModal();
        initTypingEffect();
      }, 400);
    }
    percentEl.textContent = progress + '%';
  }, 80);
}

/* ============================================
   WELCOME MODAL
   ============================================ */
function initWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  const dismissed = localStorage.getItem('portfolio-welcome-dismissed');

  if (!dismissed) {
    setTimeout(() => modal.classList.add('active'), 300);
  }

  document.getElementById('modalCloseBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    localStorage.setItem('portfolio-welcome-dismissed', 'true');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      localStorage.setItem('portfolio-welcome-dismissed', 'true');
    }
  });
}

/* ============================================
   PARTICLE BACKGROUND
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '14,165,233' : '245,158,11';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x += dx * force * 0.02;
        this.y += dy * force * 0.02;
      }

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(14,165,233,${0.08 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
}

/* ============================================
   CONFETTI
   ============================================ */
function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confetti = [];
  let active = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.color = ['#0ea5e9','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899'][Math.floor(Math.random()*6)];
      this.opacity = 1;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.003;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  function burst() {
    for (let i = 0; i < 60; i++) {
      confetti.push(new ConfettiPiece());
    }
    active = true;
  }

  function animate() {
    if (!active) { requestAnimationFrame(animate); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti = confetti.filter(c => c.opacity > 0 && c.y < canvas.height + 20);
    confetti.forEach(c => { c.update(); c.draw(); });
    if (confetti.length === 0) active = false;
    requestAnimationFrame(animate);
  }
  animate();

  // Trigger confetti when reaching "Open to Work" page
  window.triggerConfetti = burst;
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let x = 0, y = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  document.addEventListener('mousedown', () => dot.classList.add('click'));
  document.addEventListener('mouseup', () => dot.classList.remove('click'));

  // Hover effects
  const hoverTargets = document.querySelectorAll('a, button, .magnetic, .corner, .corner-back, .control-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });

  function animate() {
    x += (targetX - x) * 0.15;
    y += (targetY - y) * 0.15;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================
   3D BOOK TILT
   ============================================ */
function initBookTilt() {
  const book = document.getElementById('book');
  const stage = document.querySelector('.book-stage');

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    book.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
    book.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagnetic() {
  const magnets = document.querySelectorAll('.magnetic');

  magnets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

/* ============================================
   TYPING EFFECT (Cover)
   ============================================ */
function initTypingEffect() {
  const text = "Building the future of AI infrastructure — from intelligent code editors to autonomous agents and unlimited API gateways.";
  const el = document.getElementById('typedContent');
  if (!el) return;

  let i = 0;
  el.textContent = '';

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 35);
    }
  }

  setTimeout(type, 800);
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const increment = target / 40;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + (target === 1 ? 'M+' : '+');
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================
   ANIMATED SKILL BARS
   ============================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        bar.style.setProperty('--target-width', width + '%');
        bar.classList.add('animated');
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* ============================================
   TIMELINE ANIMATIONS
   ============================================ */
function initTimelineAnimations() {
  const items = document.querySelectorAll('.timeline-item.observe');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}

/* ============================================
   SOUND EFFECTS
   ============================================ */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playFlipSound() {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
  } catch(e) {}
}

/* ============================================
   NAVIGATION
   ============================================ */
function updateControls() {
  document.getElementById('btnPrev').disabled = currentSheet === 0;
  document.getElementById('btnNext').disabled = currentSheet === totalSheets;
  document.getElementById('pageCounter').textContent = currentSheet + ' / ' + totalSheets;

  // Trigger confetti on "Open to Work" page (sheet 5, back face = page 11)
  if (currentSheet === 6 && window.triggerConfetti) {
    window.triggerConfetti();
  }

  // Animate skill bars when on skills page
  if (currentSheet === 3) {
    setTimeout(initSkillBars, 400);
  }

  // Animate counters when on CV page
  if (currentSheet === 7) {
    setTimeout(initCounters, 400);
  }

  // Animate timeline items
  setTimeout(initTimelineAnimations, 500);
}

function flipNext() {
  if (isFlipping || currentSheet >= totalSheets) return;
  isFlipping = true;
  playFlipSound();
  sheets[currentSheet].classList.add('flipped');
  currentSheet++;
  updateControls();
  setTimeout(() => isFlipping = false, 700);
}

function flipPrev() {
  if (isFlipping || currentSheet <= 0) return;
  isFlipping = true;
  playFlipSound();
  currentSheet--;
  sheets[currentSheet].classList.remove('flipped');
  updateControls();
  setTimeout(() => isFlipping = false, 700);
}

function goToPage(pageIndex) {
  if (pageIndex < 0 || pageIndex > totalSheets || isFlipping) return;
  if (pageIndex > currentSheet) {
    const diff = pageIndex - currentSheet;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= diff) { clearInterval(interval); return; }
      flipNext();
      i++;
    }, 250);
  } else if (pageIndex < currentSheet) {
    const diff = currentSheet - pageIndex;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= diff) { clearInterval(interval); return; }
      flipPrev();
      i++;
    }, 250);
  }
}

/* ===== KEYBOARD ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    flipNext();
  }
  if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
    e.preventDefault();
    flipPrev();
  }
});

/* ===== TOUCH / SWIPE ===== */
let touchStartX = 0, touchEndX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const diffX = touchStartX - touchEndX;
  const diffY = Math.abs(touchStartY - e.changedTouches[0].screenY);
  if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
    if (diffX > 0) flipNext();
    else flipPrev();
  }
}, { passive: true });

/* ============================================
   WHATSAPP CONTACT LOGIC
   ============================================ */
function initWhatsAppForm() {
  const waOptions = document.querySelectorAll('.whatsapp-opt');
  const waPreview = document.getElementById('waPreview');
  const waPreviewText = document.getElementById('waPreviewText');
  const waSubmit = document.getElementById('waSubmit');
  const waMessage = document.getElementById('waMessage');
  const waName = document.getElementById('waName');

  let waMode = 'prefill';
  const phone = '254116903500';

  waOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      waOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      waMode = opt.dataset.mode;
      updateWaPreview();
    });
  });

  function updateWaPreview() {
    const name = waName.value.trim();
    const msg = waMessage.value.trim();

    if (waMode === 'prefill') {
      if (msg) {
        const fullMsg = name ? `Hi, I'm ${name}. ${msg}` : msg;
        waPreviewText.textContent = fullMsg;
        waPreview.classList.add('show');
        waSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Open WhatsApp with Message';
      } else {
        waPreview.classList.remove('show');
        waSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Open WhatsApp';
      }
    } else {
      waPreview.classList.remove('show');
      waSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Open WhatsApp Chat';
    }
  }

  waName.addEventListener('input', updateWaPreview);
  waMessage.addEventListener('input', updateWaPreview);

  waSubmit.addEventListener('click', () => {
    const name = waName.value.trim();
    const msg = waMessage.value.trim();

    if (waMode === 'prefill' && msg) {
      const fullMsg = name ? `Hi, I'm ${name}. ${msg}` : msg;
      const encoded = encodeURIComponent(fullMsg);
      window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/${phone}`, '_blank');
    }
  });
}

/* ============================================
   EMAIL FORM
   ============================================ */
function initEmailForm() {
  const form = document.getElementById('emailForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('emailName').value;
    const email = document.getElementById('emailEmail').value;
    const message = document.getElementById('emailMessage').value;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:aevibron@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ============================================
   INITIALIZE EVERYTHING
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initParticles();
  initConfetti();
  initCursor();
  initBookTilt();
  initMagnetic();
  initWhatsAppForm();
  initEmailForm();
  initTimelineAnimations();
  updateControls();
});
