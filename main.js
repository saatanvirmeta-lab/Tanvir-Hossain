// Import Vercel Analytics
import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject();

// Comprehensive interactivity for MD. Tanvir Hossain Portfolio
document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Logic ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Premium Reveal Animations ---
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply basic reveal styles via JS to avoid flicker
  const revealElements = document.querySelectorAll('.card, .section-title, .hero-text, .hero-actions, .stats-grid, .about-visual, .about-content, .skill-category, .stat-item, .contact-card, .step-card, .faq-item');

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    revealObserver.observe(el);
  });

  // Staggering logic for grids
  const staggeredGrids = ['.services-grid', '.stats-grid', '.skills-grid', '.contact-methods', '.sub-projects-grid', '.process-steps', '.testimonials-grid', '.faq-list'];
  staggeredGrids.forEach(gridSelector => {
    const grid = document.querySelector(gridSelector);
    if (grid) {
      const items = grid.children;
      Array.from(items).forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
      });
    }
  });

  // Add global styles for the revealed state
  const style = document.createElement('style');
  style.innerHTML = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .nav-links a.active {
      color: var(--text-primary);
    }
  `;
  document.head.appendChild(style);

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // --- Animated Stats Counter ---
  const statsSection = document.querySelector('.stats');
  const statValues = document.querySelectorAll('.stat-value');
  let started = false;

  function startCount(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;
    const duration = 2000;
    const step = 20;
    const steps = duration / step;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      if (isFloat) {
        el.innerText = current.toFixed(2);
      } else {
        el.innerText = Math.floor(current);
      }
    }, step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        statValues.forEach(el => startCount(el));
        started = true;
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // --- Hero Parallax Effect ---
  const heroSection = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-image-container');

  if (heroSection && heroVisual) {
    heroSection.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 50;
      const y = (window.innerHeight - e.pageY * 2) / 50;

      heroVisual.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroVisual.style.transform = `translateX(0) translateY(0)`;
    });
  }

  // --- Project Modal Logic ---
  const modal = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalImage = document.getElementById('modal-image');
  const modalStats = document.getElementById('modal-stats');
  const projectCards = document.querySelectorAll('.card[data-title]');

  function openModal(card) {
    if (!modal) return;

    // Get the hidden detailed content from the card
    const detailedContent = card.querySelector('.modal-source-content');

    // Populate Data
    modalTitle.textContent = card.dataset.title;
    modalImage.src = card.dataset.image;

    // If detailed content exists, use it; otherwise fall back to basic description
    if (detailedContent) {
      modalDesc.innerHTML = detailedContent.innerHTML;
    } else {
      modalDesc.textContent = card.dataset.desc;
    }

    // Stats HTML builder
    let statsHtml = '';
    if (card.dataset.stat1) statsHtml += `<div class="p-stat"><span class="val">${card.dataset.stat1.split(' ')[0]}</span><span class="lbl">${card.dataset.stat1.split(' ').slice(1).join(' ')}</span></div>`;
    if (card.dataset.stat2) statsHtml += `<div class="p-stat"><span class="val">${card.dataset.stat2.split(' ')[0]}</span><span class="lbl">${card.dataset.stat2.split(' ').slice(1).join(' ')}</span></div>`;
    if (card.dataset.stat3) statsHtml += `<div class="p-stat"><span class="val">${card.dataset.stat3.split(' ')[0]}</span><span class="lbl">${card.dataset.stat3.split(' ').slice(1).join(' ')}</span></div>`;

    modalStats.innerHTML = statsHtml;

    // Show
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on outside click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- Infinite Testimonial Scroll Clone ---
  const testimonialTrack = document.querySelector('.testimonials-track');
  if (testimonialTrack) {
    const testimonialCards = Array.from(testimonialTrack.children);
    testimonialCards.forEach(card => {
      const clone = card.cloneNode(true);
      testimonialTrack.appendChild(clone);
    });
  }

});
