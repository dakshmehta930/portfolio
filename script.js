/* =============================================
   DAKSH MEHTA — Portfolio Script
   ============================================= */

'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 1800);
});

/* ── NAVBAR SCROLL & ACTIVE ── */
const navbar = document.getElementById('navbar');
const setNavScrolled = () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', setNavScrolled, { passive: true });
setNavScrolled();

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── HAMBURGER MENU ── */
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve skill cards (bar animation needs repeat)
      if (!entry.target.classList.contains('skill-card')) {
        revealObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .skill-card').forEach(el => {
  revealObserver.observe(el);
});

// Staggered children
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const children = parent.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});

/* ── PORTFOLIO FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;

    portfolioItems.forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.classList.remove('hidden');
        item.style.animation = 'none';
        item.offsetHeight; // reflow
        item.style.animation = 'fadeInUp 0.4s ease';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ── PORTFOLIO MODAL ── */
const modalOverlay = document.getElementById('portfolioModal');
const modalClose = document.querySelector('.modal-close');

function openModal(data) {
  if (!modalOverlay) return;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-desc').textContent = data.desc;
  document.getElementById('modal-thumb-emoji').textContent = data.emoji;
  document.getElementById('modal-cat').textContent = data.cat;

  const tagsWrap = document.getElementById('modal-tags');
  tagsWrap.innerHTML = data.tags.map(t =>
    `<span class="project-tag">${t}</span>`
  ).join('');

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Attach click to portfolio items
document.querySelectorAll('.portfolio-item[data-modal]').forEach(item => {
  item.addEventListener('click', () => {
    const d = item.dataset;
    openModal({
      title: d.title,
      desc: d.desc,
      emoji: d.emoji,
      cat: d.cat,
      tags: d.tags.split(',')
    });
  });
});

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const success = document.querySelector('.form-success');

    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (success) success.classList.add('show');
    }, 1400);
  });
}

/* ── SMOOTH SCROLL FOR SAME-PAGE ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── CURSOR GLOW (subtle) ── */
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed; width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(200,169,126,0.04) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
  transform: translate(-50%, -50%);
  transition: left 0.4s ease, top 0.4s ease;
`;
document.body.appendChild(glow);
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = target / 50;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── TILT EFFECT ON CARDS (subtle) ── */
document.querySelectorAll('.skill-card, .service-card-main, .testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
