// ─────────────────────────────────────────────
//  main.js — Tanvir Hossain Portfolio
// ─────────────────────────────────────────────

// ── Section → URL mapping ───────────────────
const sectionRoutes = {
  'hero':       '/',
  'projects':   '/case-studies',
  'about':      '/about',
  'experience': '/experience',
  'skills':     '/skills',
  'services':   '/services',
  'process':    '/process',
  'faq':        '/faq',
  'contact':    '/contact',
};

// Reverse map: URL path → section id
const routeSections = Object.fromEntries(
  Object.entries(sectionRoutes).map(([id, path]) => [path, id])
);

// ── Update URL without reload ─────────────────
function updateURL(sectionId) {
  const path = sectionRoutes[sectionId] || '/';
  if (window.location.pathname !== path) {
    window.history.pushState({ sectionId }, '', path);
  }
}

// ── IntersectionObserver — watch sections ────
function initScrollURLUpdate() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateURL(entry.target.id);
          updateActiveNavLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.35, // section must be 35% visible
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ── Active nav link highlight ─────────────────
function updateActiveNavLink(sectionId) {
  const path = sectionRoutes[sectionId] || '/';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.classList.remove('nav-active');
    const href = link.getAttribute('href');
    // match both #id style and /path style hrefs
    if (
      href === '#' + sectionId ||
      href === path ||
      (sectionId === 'hero' && (href === '#hero' || href === '/'))
    ) {
      link.classList.add('nav-active');
    }
  });
}

// ── Nav link click → scroll + URL update ─────
function initNavClicks() {
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateURL(targetId);
        updateActiveNavLink(targetId);
        // close mobile menu if open
        const navLinks = document.getElementById('nav-links');
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });
}

// ── Handle direct URL visit ───────────────────
// e.g. user visits /about directly → scroll to #about
function handleDirectURLVisit() {
  const path = window.location.pathname;
  if (path === '/' || path === '') return;

  const sectionId = routeSections[path];
  if (sectionId) {
    // Wait for DOM to fully render, then scroll
    setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveNavLink(sectionId);
      }
    }, 100);
  }
}

// ── Handle browser back/forward buttons ───────
window.addEventListener('popstate', (e) => {
  const path = window.location.pathname;
  const sectionId = routeSections[path] || 'hero';
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateActiveNavLink(sectionId);
  }
});

// ── Mobile menu toggle ────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
}

// ── Modal (Case Studies) ──────────────────────
function initModal() {
  const modal   = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.modal-close');
  if (!modal) return;

  document.querySelectorAll('.featured-project').forEach((card) => {
    card.addEventListener('click', () => {
      const title   = card.dataset.title  || '';
      const imgSrc  = card.dataset.image  || '';
      const stat1   = card.dataset.stat1  || '';
      const stat2   = card.dataset.stat2  || '';
      const stat3   = card.dataset.stat3  || '';

      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-image').src = imgSrc;

      // Pull rich content from hidden div inside card
      const richContent = card.querySelector('.modal-source-content');
      const descEl = document.getElementById('modal-desc');
      if (richContent) {
        descEl.innerHTML = richContent.innerHTML;
      } else {
        descEl.textContent = card.dataset.desc || '';
      }

      // Stats
      const statsEl = document.getElementById('modal-stats');
      statsEl.innerHTML = [stat1, stat2, stat3]
        .filter(Boolean)
        .map((s) => {
          const [val, ...lblParts] = s.split(' ');
          return `<div class="p-stat"><span class="val">${val}</span><span class="lbl">${lblParts.join(' ')}</span></div>`;
        })
        .join('');

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ── Testimonials auto-scroll ──────────────────
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  // Duplicate cards for infinite loop
  const cards = track.querySelectorAll('.testimonial-card');
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
}

// ── Scroll-reveal animation ───────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.card, .timeline-item, .step-card, .skill-category, .faq-item'
  );
  if (!revealEls.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    revealObserver.observe(el);
  });
}

// ── Init everything on DOM ready ──────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavClicks();
  initScrollURLUpdate();
  handleDirectURLVisit();
  initMobileMenu();
  initModal();
  initTestimonials();
  initScrollReveal();
});
