/* ============================================================
   NEXUS — Landing Page Script
   Features: Loader, Sticky Nav, Hamburger, Scroll Reveal,
             Active Link Highlight, Form Validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal after loader
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 1700);


  /* ---------- STICKY NAVBAR ---------- */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ---------- ACTIVE NAV LINK (SCROLL SPY) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.id;
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }


  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Exclude hero reveals (handled post-loader)
  document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => {
    revealObserver.observe(el);
  });


  /* ---------- CONTACT FORM VALIDATION ---------- */
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Reset state
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
      form.querySelectorAll('input, textarea').forEach(f => f.classList.remove('invalid'));
      successMsg.classList.remove('show');

      // Validate name
      const name = document.getElementById('name');
      if (!name.value.trim()) {
        markInvalid(name);
        valid = false;
      }

      // Validate email
      const email = document.getElementById('email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        markInvalid(email);
        valid = false;
      }

      // Validate message
      const message = document.getElementById('message');
      if (!message.value.trim()) {
        markInvalid(message);
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('.btn-submit');
        const btnText = btn.querySelector('span');
        btnText.textContent = 'Sending…';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
          form.reset();
          btnText.textContent = 'Send Message';
          btn.disabled = false;
          successMsg.classList.add('show');

          setTimeout(() => successMsg.classList.remove('show'), 5000);
        }, 1200);
      }
    });

    // Live validation on blur
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.value.trim()) {
          field.classList.remove('invalid');
          field.closest('.form-group').classList.remove('has-error');
        }
      });
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid') && field.value.trim()) {
          field.classList.remove('invalid');
          field.closest('.form-group').classList.remove('has-error');
        }
      });
    });
  }

  function markInvalid(field) {
    field.classList.add('invalid');
    field.closest('.form-group').classList.add('has-error');
  }


  /* ---------- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ---------- NAVBAR BAR HIGHLIGHT PULSE on scroll to section ---------- */
  // Small visual delight: flash the logo mark when scrolling through major sections
  const logoMark = document.querySelector('.logo-mark');
  let lastSection = '';

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    let current = '';
    sections.forEach(s => { if (scrollPos >= s.offsetTop) current = s.id; });
    if (current !== lastSection) {
      lastSection = current;
      if (logoMark) {
        logoMark.style.transform = 'scale(1.15)';
        setTimeout(() => { logoMark.style.transform = ''; }, 300);
        logoMark.style.transition = 'transform 0.3s ease';
      }
    }
  }, { passive: true });

});
