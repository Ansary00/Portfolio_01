/* =========================================================
   REDWAN ANSARY — PORTFOLIO  |  Interactions
   ========================================================= */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header shadow on scroll ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuToggle = $('#menuToggle');
  const navMenu = $('#navMenu');

  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navMenu.classList.toggle('open', open);
  };

  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', navMenu).forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- Scroll reveal ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.nav-menu a');
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$('.count');
  const runCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    if (reducedMotion) { el.textContent = target; return; }
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* ---------- Rotating hero word ---------- */
  const rotator = $('#rotatorWord');
  if (rotator && !reducedMotion) {
    const words = ['digital experiences', 'clean interfaces', 'smart networks', 'useful software'];
    let index = 0;
    setInterval(() => {
      rotator.classList.add('out');
      setTimeout(() => {
        index = (index + 1) % words.length;
        rotator.textContent = words[index];
        rotator.classList.remove('out');
      }, 350);
    }, 2800);
  }

  /* ---------- Cursor glow ---------- */
  const glow = $('.cursor-glow');
  if (glow && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const move = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(move);
    };
    requestAnimationFrame(move);
  }

  /* ---------- Photography lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbImage = $('#lightboxImage');
  const lbCaption = $('#lightboxCaption');
  const galleryItems = $$('.gallery-item');
  let currentPhoto = 0;
  let lastFocused = null;

  const showPhoto = (index) => {
    currentPhoto = (index + galleryItems.length) % galleryItems.length;
    const img = $('img', galleryItems[currentPhoto]);
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = `Moment ${String(currentPhoto + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  };

  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    requestAnimationFrame(() => lightbox.classList.add('open'));
    $('#lightboxClose').focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    setTimeout(() => {
      lightbox.hidden = true;
      lbImage.src = '';
      if (lastFocused) lastFocused.focus();
    }, reducedMotion ? 0 : 300);
  };

  galleryItems.forEach((item) => item.addEventListener('click', () => openLightbox(Number(item.dataset.index))));
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxPrev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  $('#lightboxNext').addEventListener('click', () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (e.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  };

  /* ---------- Contact form -> email draft ---------- */
  const form = $('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    ['name', 'email', 'message'].forEach((id) => {
      const field = $('#' + id);
      const ok = field.checkValidity() && field.value.trim() !== '';
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      showToast('Please fill in all fields with a valid email.');
      $('.invalid', form).focus();
      return;
    }

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:232311238@vu.edu.bd?subject=${subject}&body=${body}`;
    showToast('Opening your email app with the message ready to send.');
    form.reset();
  });
  $$('input, textarea', form).forEach((field) => field.addEventListener('input', () => field.classList.remove('invalid')));

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
