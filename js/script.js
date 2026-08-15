document.addEventListener('DOMContentLoaded', () => {
  // Page load transition
  document.body.classList.remove('is-loading');
  initPageTransitions();

  // Initialize all interactive features
  initMobileNav();
  initHeaderScroll();
  initCustomCursor();
  initRevealOnScroll();
  initStickyCTA();
  initLightbox();
  initGalleryFilters();
  initActiveLinks();
});

/* --- PAGE TRANSITIONS --- */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) return;

  // Animate in (fade in page, slide away overlay)
  setTimeout(() => {
    overlay.classList.add('animating-in');
    overlay.classList.remove('animating-out');
  }, 100);

  // Intercept local links
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not([href^="https://wa.me"])');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      e.preventDefault();
      
      // Slide cover up
      overlay.classList.remove('animating-in');
      overlay.classList.add('animating-out');
      
      // Delay navigation until animation finishes
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
}

/* --- MOBILE NAVIGATION --- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    overlay.classList.toggle('is-open');
    document.body.style.overflow = overlay.classList.contains('is-open') ? 'hidden' : '';
  });

  // Close nav on clicking links
  const overlayLinks = overlay.querySelectorAll('a');
  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* --- HEADER SCROLL CHANGE --- */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initially
}

/* --- CUSTOM CURSOR (DESKTOP) --- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  const glow = document.querySelector('.custom-cursor-glow');
  
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;
  let glowX = 0, glowY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate cursors smoothly
  const render = () => {
    // Quick dot
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    // Lagging circle
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

    // Ambient glow
    if (glow) {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // Add hover effect classes to links/buttons
  const hoverables = document.querySelectorAll('a, button, .btn, .service-preview-card, .service-card, .gallery-item, .filter-btn');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-link');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-link');
    });
  });
}

/* --- REVEAL ON SCROLL --- */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal, .clip-reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target); // Stop observing once triggered
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before entry
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --- STICKY CTA SHOW/HIDE ON SCROLL --- */
function initStickyCTA() {
  const stickyCta = document.querySelector('.mobile-sticky-cta');
  if (!stickyCta) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Hide when scrolling down, show when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      stickyCta.classList.add('hidden');
    } else {
      stickyCta.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  });
}

/* --- LIGHTBOX (GALLERY) --- */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item:not(.gallery-placeholder)');
  
  if (!lightbox || galleryItems.length === 0) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title');
      const category = item.querySelector('.gallery-category');
      
      if (!img) return;

      lightboxImg.src = img.src;
      lightboxCaption.textContent = title ? `${title.textContent} — ${category.textContent}` : '';
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- HIGHLIGHT ACTIVE NAV LINKS --- */
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- GALLERY CATEGORY FILTERING --- */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
