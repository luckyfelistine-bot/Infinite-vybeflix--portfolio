/* ============================================
   INFINITE VYBEFLIX — PORTFOLIO BOOK v3.0
   Complete 3D Flip-Book Engine
   ============================================ */

const sheets = document.querySelectorAll('.sheet');
const totalSheets = sheets.length;
let currentSheet = 0;
let isFlipping = false;

/* ─── LOADING ─── */
function initLoad() {
  const screen = document.getElementById('loading');
  const pct = document.getElementById('loadpct');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.floor(Math.random() * 8) + 2;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        screen.classList.add('hidden');
        initType();
      }, 400);
    }
    pct.textContent = p + '%';
  }, 80);
}

/* ─── TYPING EFFECT ─── */
function initType() {
  const text = "Building the future of AI infrastructure — from intelligent code editors to autonomous agents and unlimited API gateways.";
  const el = document.getElementById('typeText');
  if (!el) return;
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent = text.substring(0, i + 1);
      i++;
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 600);
}

/* ─── PARTICLES ─── */
function initParticles() {
  const c = document.getElementById('pCanvas');
  const ctx = c.getContext('2d');
  let pts = [];

  function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      s: Math.random() * 2 + .5,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      o: Math.random() * .4 + .1,
      col: Math.random() > .5 ? '56,189,248' : '212,175,55'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > c.width || p.y < 0 || p.y > c.height) {
        p.x = Math.random() * c.width;
        p.y = Math.random() * c.height;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.col + ',' + p.o + ')';
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(56,189,248,' + (0.06 * (1 - d / 120)) + ')';
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── CUSTOM CURSOR ─── */
function initCursor() {
  const dot = document.getElementById('cursor');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let x = 0, y = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });
  document.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(0.8)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  function anim() {
    x += (tx - x) * .15;
    y += (ty - y) * .15;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    requestAnimationFrame(anim);
  }
  anim();

  const hoverTargets = document.querySelectorAll('a, button, .corner, .corner-back, .ctrl-btn, .zoom-img, .srv-btn, .wa-opt');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });
}

/* ─── LIGHTBOX ─── */
function initLightbox() {
  document.querySelectorAll('.zoom-img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      const lb = document.getElementById('lightbox');
      const lbimg = document.getElementById('lbimg');
      lbimg.src = img.src;
      lb.classList.add('on');
    });
  });
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('on');
}

/* ─── Z-INDEX MANAGEMENT ───
   This is the critical fix. Each sheet gets a calculated z-index
   so flipped sheets stack properly on the left and unflipped on the right.
*/
function updateZ() {
  sheets.forEach((sheet, i) => {
    if (i < currentSheet) {
      // Flipped sheets: stack from bottom (z = 1) to top
      sheet.style.zIndex = i + 1;
    } else {
      // Unflipped sheets: stack from top (z = total) to bottom
      sheet.style.zIndex = totalSheets - i;
    }
  });
}

/* ─── BOOK POSITION ───
   When closed (sheet 0), shift book left by half page so cover centers.
   When opened, remove shift so full book is centered.
*/
function updateBookPos() {
  const book = document.getElementById('book');
  if (currentSheet === 0) {
    book.classList.add('closed');
  } else {
    book.classList.remove('closed');
  }
}

/* ─── CONTROLS ─── */
function updateControls() {
  document.getElementById('btnPrev').disabled = currentSheet === 0;
  document.getElementById('btnNext').disabled = currentSheet >= totalSheets;
  document.getElementById('pageCounter').textContent = currentSheet + ' / ' + totalSheets;

  // Animate skill bars when on skills page (sheet 2 back = after 3 flips)
  if (currentSheet === 3) {
    setTimeout(() => {
      document.querySelectorAll('.sk-bar div').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
    }, 400);
  }
}

/* ─── FLIP NEXT ─── */
function flipNext() {
  if (isFlipping || currentSheet >= totalSheets) return;
  isFlipping = true;

  const sheet = sheets[currentSheet];
  // Boost z-index during animation so it passes over everything
  sheet.style.zIndex = 1000;
  sheet.classList.add('flipped');

  currentSheet++;
  updateControls();

  setTimeout(() => {
    updateZ();
    updateBookPos();
    isFlipping = false;
  }, 750);
}

/* ─── FLIP PREV ─── */
function flipPrev() {
  if (isFlipping || currentSheet <= 0) return;
  isFlipping = true;

  currentSheet--;
  const sheet = sheets[currentSheet];
  // Boost z-index during animation
  sheet.style.zIndex = 1000;
  sheet.classList.remove('flipped');

  updateControls();

  setTimeout(() => {
    updateZ();
    updateBookPos();
    isFlipping = false;
  }, 750);
}

/* ─── GO TO PAGE ─── */
function goToPage(idx) {
  if (idx < 0 || idx > totalSheets || isFlipping) return;
  if (idx > currentSheet) {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= idx - currentSheet) { clearInterval(iv); return; }
      flipNext();
      i++;
    }, 280);
  } else if (idx < currentSheet) {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= currentSheet - idx) { clearInterval(iv); return; }
      flipPrev();
      i++;
    }, 280);
  }
}

/* ─── KEYBOARD NAVIGATION ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    flipNext();
  }
  if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
    e.preventDefault();
    flipPrev();
  }
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

/* ─── SWIPE GESTURES ─── */
let sx = 0, sy = 0;
document.addEventListener('touchstart', e => {
  sx = e.changedTouches[0].screenX;
  sy = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const ex = e.changedTouches[0].screenX;
  const dx = sx - ex;
  const dy = Math.abs(sy - e.changedTouches[0].screenY);
  if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
    if (dx > 0) flipNext();
    else flipPrev();
  }
}, { passive: true });

/* ─── WHATSAPP ─── */
let waMode = 'prefill';

function setWaMode(el) {
  document.querySelectorAll('.wa-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  waMode = el.dataset.mode;
  const prefill = document.getElementById('waPrefill');
  if (prefill) {
    prefill.style.display = waMode === 'prefill' ? 'flex' : 'none';
  }
  const btnText = document.getElementById('waBtnText');
  if (btnText) {
    btnText.textContent = waMode === 'prefill' ? 'Open WhatsApp with Message' : 'Open WhatsApp Chat';
  }
}

function openWhatsApp() {
  const phone = '254116903500';
  if (waMode === 'prefill') {
    const name = document.getElementById('waName').value.trim();
    const msg = document.getElementById('waMsg').value.trim();
    if (msg) {
      const full = name ? "Hi, I'm " + name + ". " + msg : msg;
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(full), '_blank');
    } else {
      window.open('https://wa.me/' + phone, '_blank');
    }
  } else {
    window.open('https://wa.me/' + phone, '_blank');
  }
}

/* ─── EMAIL FORM ─── */
function sendEmail(e) {
  e.preventDefault();
  const name = document.getElementById('eName').value;
  const email = document.getElementById('eEmail').value;
  const msg = document.getElementById('eMsg').value;
  const sub = encodeURIComponent('Portfolio Contact from ' + name);
  const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + msg);
  window.location.href = 'mailto:aevibron@gmail.com?subject=' + sub + '&body=' + body;
}

/* ─── INITIALIZATION ─── */
document.addEventListener('DOMContentLoaded', () => {
  initLoad();
  initParticles();
  initCursor();
  initLightbox();
  updateZ();
  updateBookPos();
  updateControls();
});
