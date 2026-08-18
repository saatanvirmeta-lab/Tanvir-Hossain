// ── Supabase Configuration ──────────────────────
const SUPABASE_URL = 'https://afobfufufrlurmmsutyd.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_xLFi3s67N54mUYgZoC3qSQ_ZPJ74lku';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// তোমার আগের main.js code এখান থেকে শুরু হবে
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

  // Remembers where the user was scrolled to before opening the modal,
  // so we can safely lock background scroll and restore position on close.
  // (Fixes the "page freezes / won't scroll" bug on mobile Safari & Chrome)
  let savedScrollY = 0;

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

      // Open modal + safe scroll-lock (prevents iOS/Android freeze bug)
      savedScrollY = window.pageYOffset || document.documentElement.scrollTop;
      modal.classList.add('open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
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

// ── Book Now buttons → scroll to booking form ─
function initBookNowTriggers() {
  const target = document.getElementById('book-now-form');
  if (!target) return;

  document.querySelectorAll('.book-now-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // If a case-study modal is open, close it first
      const modal = document.getElementById('project-modal');
      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        const nameField = document.getElementById('f-name');
        if (nameField) nameField.focus({ preventScroll: true });
      }, 500);
    });
  });
}

// ── Booking form: phone rules per country ─────
const PHONE_RULES = {
  bd: { min: 10, max: 13, hint: 'e.g. 01XXXXXXXXX or +8801XXXXXXXXX' },
  us: { min: 10, max: 11, hint: 'e.g. (XXX) XXX-XXXX or +1XXXXXXXXXX' },
  ca: { min: 10, max: 11, hint: 'e.g. (XXX) XXX-XXXX or +1XXXXXXXXXX' },
  uk: { min: 10, max: 12, hint: 'e.g. 07XXX XXXXXX or +44XXXXXXXXXX' },
  au: { min: 9, max: 11, hint: 'e.g. 04XX XXX XXX or +61XXXXXXXXX' },
  other: { min: 7, max: 15, hint: 'Include your country code' },
};

// Email patterns that indicate a fake/test entry
const FAKE_EMAIL_LOCAL_PARTS = /^(test|testmail|test123|testing|demo|sample|fake|dummy|asdf|xxx+|abc123?|noone|nobody|none|na)\d*$/i;
const DISPOSABLE_EMAIL_DOMAINS = ['example.com', 'test.com', 'mailinator.com', 'yopmail.com', 'tempmail.com', 'fake.com'];

function showFieldError(fieldEl, errorEl, message) {
  fieldEl.classList.add('invalid');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearFieldError(fieldEl, errorEl) {
  fieldEl.classList.remove('invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const countryField = document.getElementById('f-country');
  const phoneField = document.getElementById('f-phone');
  const phoneHint = document.getElementById('hint-phone');
  const submitNote = document.getElementById('form-submit-note');
  const submitBtn = document.getElementById('booking-submit-btn');

  // Update phone hint + placeholder whenever country changes
  countryField.addEventListener('change', () => {
    const rule = PHONE_RULES[countryField.value];
    if (rule) {
      phoneHint.textContent = rule.hint;
      phoneField.placeholder = rule.hint;
    }
    clearFieldError(countryField, document.getElementById('err-country'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitNote.classList.remove('show');

    let isValid = true;

    // Name
    const nameField = document.getElementById('f-name');
    const nameVal = nameField.value.trim();
    if (nameVal.length < 2) {
      showFieldError(nameField, document.getElementById('err-name'), 'Please enter your full name.');
      isValid = false;
    } else {
      clearFieldError(nameField, document.getElementById('err-name'));
    }

    // Country
    if (!countryField.value) {
      showFieldError(countryField, document.getElementById('err-country'), 'Please select your country.');
      isValid = false;
    } else {
      clearFieldError(countryField, document.getElementById('err-country'));
    }

    // Phone — digit count must match the normal length for the selected country
    const digitsOnly = phoneField.value.replace(/\D/g, '');
    const rule = PHONE_RULES[countryField.value] || PHONE_RULES.other;
    if (digitsOnly.length < rule.min || digitsOnly.length > rule.max) {
      showFieldError(
        phoneField,
        document.getElementById('err-phone'),
        `Please enter a valid phone number (${rule.hint}).`
      );
      isValid = false;
    } else {
      clearFieldError(phoneField, document.getElementById('err-phone'));
    }

    // Email — format + block obvious test/fake addresses
    const emailField = document.getElementById('f-email');
    const emailVal = emailField.value.trim();
    const emailErrorEl = document.getElementById('err-email');
    const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmailPattern.test(emailVal)) {
      showFieldError(emailField, emailErrorEl, 'Please enter a valid email address.');
      isValid = false;
    } else {
      const [localPart, domainPart] = emailVal.split('@');
      if (
        FAKE_EMAIL_LOCAL_PARTS.test(localPart) ||
        DISPOSABLE_EMAIL_DOMAINS.includes(domainPart.toLowerCase())
      ) {
        showFieldError(emailField, emailErrorEl, 'Please enter a real email address we can reach you on.');
        isValid = false;
      } else {
        clearFieldError(emailField, emailErrorEl);
      }
    }

    // Ad spend
    const spendField = document.getElementById('f-spend');
    if (!spendField.value) {
      showFieldError(spendField, document.getElementById('err-spend'), 'Please select your current ad spend.');
      isValid = false;
    } else {
      clearFieldError(spendField, document.getElementById('err-spend'));
    }

    // Creatives
    const creativesField = document.getElementById('f-creatives');
    if (!creativesField.value) {
      showFieldError(creativesField, document.getElementById('err-creatives'), 'Please select an option.');
      isValid = false;
    } else {
      clearFieldError(creativesField, document.getElementById('err-creatives'));
    }

    // Best time
    const timeField = document.getElementById('f-time');
    if (timeField.value.trim().length < 3) {
      showFieldError(timeField, document.getElementById('err-time'), 'Please let us know the best time to reach you.');
      isValid = false;
    } else {
      clearFieldError(timeField, document.getElementById('err-time'));
    }

  if (!isValid) return;

    // Submit lead to Supabase
    const payload = {
      name: nameVal,
      country: countryField.value,
      phone: phoneField.value.trim(),
      email: emailVal,
      website: document.getElementById('f-website').value.trim(),
      ad_spend: spendField.value,
      creatives: creativesField.value,
      best_time: timeField.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const { error } = await supabaseClient
        .from("Tanvir's Site")
        .insert([payload]);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Submission failed');
      }

      document.getElementById('booking-heading').style.display = 'none';
      form.style.display = 'none';
      document.getElementById('thank-you-box').style.display = 'block';
    } catch (err) {
      submitNote.textContent = "Something went wrong sending this — please WhatsApp us directly at +880 1943-609396 and we'll get you booked in.";
      submitNote.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book My Free Strategy Call';
    }
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
  initBookNowTriggers();
  initBookingForm();
});
