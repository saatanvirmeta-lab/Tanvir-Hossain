// ── Supabase Configuration ──────────────────────
const SUPABASE_URL = 'https://afobfufufrlurmmsutyd.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_xLFi3s67N54mUYgZoC3qSQ_ZPJ74lku';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ── Section → URL mapping ──────────────────────
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


// ── Reverse map: URL path → section id ─────────
const routeSections = Object.fromEntries(
  Object.entries(sectionRoutes).map(([id, path]) => [path, id])
);


// ── Update URL without reload ───────────────────
function updateURL(sectionId) {
  const path = sectionRoutes[sectionId] || '/';

  if (window.location.pathname !== path) {
    window.history.pushState({ sectionId }, '', path);
  }
}


// ── IntersectionObserver — watch sections ──────
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
      threshold: 0.35,
    }
  );

  sections.forEach((section) => observer.observe(section));
}


// ── Active nav link highlight ───────────────────
function updateActiveNavLink(sectionId) {
  const path = sectionRoutes[sectionId] || '/';

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.classList.remove('nav-active');

    const href = link.getAttribute('href');

    if (
      href === '#' + sectionId ||
      href === path ||
      (sectionId === 'hero' && (href === '#hero' || href === '/'))
    ) {
      link.classList.add('nav-active');
    }
  });
}


// ── Nav link click → scroll + URL update ───────
function initNavClicks() {
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        updateURL(targetId);
        updateActiveNavLink(targetId);

        const navLinks = document.getElementById('nav-links');

        if (navLinks) {
          navLinks.classList.remove('open');
        }
      }
    });
  });
}


// ── Handle direct URL visit ────────────────────
function handleDirectURLVisit() {
  const path = window.location.pathname;

  if (path === '/' || path === '') return;

  const sectionId = routeSections[path];

  if (sectionId) {
    setTimeout(() => {
      const target = document.getElementById(sectionId);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        updateActiveNavLink(sectionId);
      }
    }, 100);
  }
}


// ── Handle browser back/forward buttons ─────────
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  const sectionId = routeSections[path] || 'hero';
  const target = document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    updateActiveNavLink(sectionId);
  }
});


// ── Mobile menu toggle ─────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
}


// ── Modal (Case Studies) ────────────────────────
function initModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.modal-close');

  if (!modal) return;

  let savedScrollY = 0;

  document.querySelectorAll('.featured-project').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.dataset.title || '';
      const imgSrc = card.dataset.image || '';
      const stat1 = card.dataset.stat1 || '';
      const stat2 = card.dataset.stat2 || '';
      const stat3 = card.dataset.stat3 || '';

      const titleEl = document.getElementById('modal-title');
      const imageEl = document.getElementById('modal-image');
      const descEl = document.getElementById('modal-desc');
      const statsEl = document.getElementById('modal-stats');

      if (titleEl) {
        titleEl.textContent = title;
      }

      if (imageEl) {
        imageEl.src = imgSrc;
      }

      const richContent =
        card.querySelector('.modal-source-content');

      if (descEl) {
        if (richContent) {
          descEl.innerHTML = richContent.innerHTML;
        } else {
          descEl.textContent = card.dataset.desc || '';
        }
      }

      // Skip auto stat-bar if this case study already
      // has its own "Key Metrics" section
      const hasCustomKeyMetrics =
        richContent &&
        /key metrics/i.test(richContent.textContent);

      if (statsEl) {
        if (hasCustomKeyMetrics) {
          statsEl.innerHTML = '';
        } else {
          statsEl.innerHTML = [stat1, stat2, stat3]
            .filter(Boolean)
            .map((s) => {
              const [val, ...lblParts] = s.split(' ');

              return `
                <div class="p-stat">
                  <span class="val">${val}</span>
                  <span class="lbl">${lblParts.join(' ')}</span>
                </div>
              `;
            })
            .join('');
        }
      }

      savedScrollY =
        window.pageYOffset ||
        document.documentElement.scrollTop;

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

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}


// ── Fullscreen Image Lightbox ──────────────────
function initImageLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!lightbox || !lightboxImg || !modalImg) return;

  function openLightbox() {
    if (!modalImg.src) return;

    lightboxImg.src = modalImg.src;
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  modalImg.addEventListener('click', openLightbox);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}


// ── Testimonials auto-scroll ────────────────────
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');

  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
}


// ── Scroll-reveal animation ─────────────────────
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
    {
      threshold: 0.1
    }
  );

  revealEls.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    revealObserver.observe(el);
  });
}


// ── Book Now buttons → scroll to booking form ──
function initBookNowTriggers() {
  const target = document.getElementById('book-now-form');

  if (!target) return;

  document.querySelectorAll('.book-now-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const modal = document.getElementById('project-modal');

      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');

        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
      }

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setTimeout(() => {
        const nameField = document.getElementById('f-name');

        if (nameField) {
          nameField.focus({
            preventScroll: true
          });
        }
      }, 500);
    });
  });
}


// ── Booking form: phone rules per country ──────
const PHONE_RULES = {
  bd: {
    min: 10,
    max: 13,
    hint: 'e.g. 01XXXXXXXXX or +8801XXXXXXXXX'
  },

  us: {
    min: 10,
    max: 11,
    hint: 'e.g. (XXX) XXX-XXXX or +1XXXXXXXXXX'
  },

  ca: {
    min: 10,
    max: 11,
    hint: 'e.g. (XXX) XXX-XXXX or +1XXXXXXXXXX'
  },

  uk: {
    min: 10,
    max: 12,
    hint: 'e.g. 07XXX XXXXXX or +44XXXXXXXXXX'
  },

  au: {
    min: 9,
    max: 11,
    hint: 'e.g. 04XX XXX XXX or +61XXXXXXXXX'
  },

  other: {
    min: 7,
    max: 15,
    hint: 'Include your country code'
  }
};


// ── Fake/test email protection ─────────────────
const FAKE_EMAIL_LOCAL_PARTS =
  /^(test|testmail|test123|testing|demo|sample|fake|dummy|asdf|xxx+|abc123?|noone|nobody|none|na)\d*$/i;

const DISPOSABLE_EMAIL_DOMAINS = [
  'example.com',
  'test.com',
  'mailinator.com',
  'yopmail.com',
  'tempmail.com',
  'fake.com'
];


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


// ── Booking Form ────────────────────────────────
function initBookingForm() {
  const form = document.getElementById('booking-form');

  if (!form) return;

  const countryField =
    document.getElementById('f-country');

  const phoneField =
    document.getElementById('f-phone');

  const phoneHint =
    document.getElementById('hint-phone');

  const submitNote =
    document.getElementById('form-submit-note');

  const submitBtn =
    document.getElementById('booking-submit-btn');

  // Update phone hint + placeholder whenever country changes
  if (countryField) {
    countryField.addEventListener('change', () => {
      const rule = PHONE_RULES[countryField.value];

      if (rule) {
        if (phoneHint) {
          phoneHint.textContent = rule.hint;
        }

        if (phoneField) {
          phoneField.placeholder = rule.hint;
        }
      }

      clearFieldError(
        countryField,
        document.getElementById('err-country')
      );
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitNote) {
      submitNote.classList.remove('show');
    }

    let isValid = true;


    // ── Name ────────────────────────────────────
    const nameField =
      document.getElementById('f-name');

    const nameVal =
      nameField.value.trim();

    if (nameVal.length < 2) {
      showFieldError(
        nameField,
        document.getElementById('err-name'),
        'Please enter your full name.'
      );

      isValid = false;
    } else {
      clearFieldError(
        nameField,
        document.getElementById('err-name')
      );
    }


    // ── Country ─────────────────────────────────
    if (!countryField.value) {
      showFieldError(
        countryField,
        document.getElementById('err-country'),
        'Please select your country.'
      );

      isValid = false;
    } else {
      clearFieldError(
        countryField,
        document.getElementById('err-country')
      );
    }


    // ── Phone ───────────────────────────────────
    const digitsOnly =
      phoneField.value.replace(/\D/g, '');

    const rule =
      PHONE_RULES[countryField.value] ||
      PHONE_RULES.other;

    if (
      digitsOnly.length < rule.min ||
      digitsOnly.length > rule.max
    ) {
      showFieldError(
        phoneField,
        document.getElementById('err-phone'),
        `Please enter a valid phone number (${rule.hint}).`
      );

      isValid = false;
    } else {
      clearFieldError(
        phoneField,
        document.getElementById('err-phone')
      );
    }


    // ── Email ───────────────────────────────────
    const emailField =
      document.getElementById('f-email');

    const emailVal =
      emailField.value.trim();

    const emailErrorEl =
      document.getElementById('err-email');

    const basicEmailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!basicEmailPattern.test(emailVal)) {
      showFieldError(
        emailField,
        emailErrorEl,
        'Please enter a valid email address.'
      );

      isValid = false;
    } else {
      const [localPart, domainPart] =
        emailVal.split('@');

      if (
        FAKE_EMAIL_LOCAL_PARTS.test(localPart) ||
        DISPOSABLE_EMAIL_DOMAINS.includes(
          domainPart.toLowerCase()
        )
      ) {
        showFieldError(
          emailField,
          emailErrorEl,
          'Please enter a real email address we can reach you on.'
        );

        isValid = false;
      } else {
        clearFieldError(
          emailField,
          emailErrorEl
        );
      }
    }


    // ── Ad spend ────────────────────────────────
    const spendField =
      document.getElementById('f-spend');

    if (!spendField.value) {
      showFieldError(
        spendField,
        document.getElementById('err-spend'),
        'Please select your current ad spend.'
      );

      isValid = false;
    } else {
      clearFieldError(
        spendField,
        document.getElementById('err-spend')
      );
    }


    // ── Creatives ───────────────────────────────
    const creativesField =
      document.getElementById('f-creatives');

    if (!creativesField.value) {
      showFieldError(
        creativesField,
        document.getElementById('err-creatives'),
        'Please select an option.'
      );

      isValid = false;
    } else {
      clearFieldError(
        creativesField,
        document.getElementById('err-creatives')
      );
    }


    // ── Best time ───────────────────────────────
    const timeField =
      document.getElementById('f-time');

    if (timeField.value.trim().length < 3) {
      showFieldError(
        timeField,
        document.getElementById('err-time'),
        'Please let us know the best time to reach you.'
      );

      isValid = false;
    } else {
      clearFieldError(
        timeField,
        document.getElementById('err-time')
      );
    }


    // ── Stop if validation fails ────────────────
    if (!isValid) return;


    // ── Show confirmation ───────────────────────
    const bookingHeading =
      document.getElementById('booking-heading');

    if (bookingHeading) {
      bookingHeading.style.display = 'none';
    }

    form.style.display = 'none';

    const thankYouBox =
      document.getElementById('thank-you-box');

    if (thankYouBox) {
      thankYouBox.style.display = 'block';
    }


    // ── Submit lead to Supabase ─────────────────
    const websiteField =
      document.getElementById('f-website');

    const payload = {
      name: nameVal,
      country: countryField.value,
      phone: phoneField.value.trim(),
      email: emailVal,
      website: websiteField
        ? websiteField.value.trim()
        : '',
      ad_spend: spendField.value,
      creatives: creativesField.value,
      best_time: timeField.value.trim()
    };


    try {
      const { error } =
        await supabaseClient
          .from("Tanvir's Site")
          .insert([payload]);

      if (error) {
        console.error(
          'Supabase error:',
          error
        );
      }
    } catch (err) {
      console.error(
        'Supabase submission failed:',
        err
      );
    }
  });
}


// ── Init everything on DOM ready ────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavClicks();
  initScrollURLUpdate();
  handleDirectURLVisit();
  initMobileMenu();
  initModal();
  initImageLightbox();
  initTestimonials();
  initScrollReveal();
  initBookNowTriggers();
  initBookingForm();
});
