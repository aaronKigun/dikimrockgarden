/* ============================================================
   NAVIGATION TOGGLE
   ============================================================ */
const menuBtn = document.querySelector('#menu-btn');
const navbar  = document.querySelector('.header .navbar');

if (menuBtn && navbar) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('fa-times');
    navbar.classList.toggle('active');
  });

  // Close nav on scroll
  window.addEventListener('scroll', () => {
    menuBtn.classList.remove('fa-times');
    navbar.classList.remove('active');
  }, { passive: true });

  // Close nav on link click (mobile)
  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('fa-times');
      navbar.classList.remove('active');
    });
  });
}

/* ============================================================
   HEADER SCROLL CLASS
   ============================================================ */
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
(function markActiveLink() {
  const links = document.querySelectorAll('.header .navbar a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').replace(/^\//, '');
    if (href === current || (current === '' && href === 'index.html') || href === '/') {
      a.classList.add('active');
    }
  });
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
if ('IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   HOME SLIDER
   ============================================================ */
if (document.querySelector('.home-slider')) {
  new Swiper('.home-slider', {
    loop: true,
    grabCursor: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    autoplay: { delay: 6000, disableOnInteraction: false },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: { el: '.swiper-pagination', clickable: true },
  });
}

/* ============================================================
   ROOM SLIDER
   ============================================================ */
if (document.querySelector('.room-slider')) {
  new Swiper('.room-slider', {
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    autoplay: { delay: 6000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      0:   { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      991: { slidesPerView: 3 },
    },
  });
}

/* ============================================================
   GALLERY SLIDER
   ============================================================ */
if (document.querySelector('.gallery-slider')) {
  new Swiper('.gallery-slider', {
    spaceBetween: 16,
    grabCursor: true,
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    breakpoints: {
      0:   { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      991: { slidesPerView: 4 },
    },
  });
}

/* ============================================================
   REVIEW SLIDER
   ============================================================ */
if (document.querySelector('.review-slider')) {
  new Swiper('.review-slider', {
    grabCursor: true,
    loop: true,
    autoplay: { delay: 7000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faqs .box').forEach(box => {
  box.addEventListener('click', () => {
    const isActive = box.classList.contains('active');
    document.querySelectorAll('.faqs .box').forEach(b => b.classList.remove('active'));
    if (!isActive) box.classList.add('active');
  });
});
