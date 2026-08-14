/**
 * Inner pages (about, projects) — scroll reveal, nav, smooth scroll
 */

(function () {
  'use strict';

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── Mobile nav toggle ───
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav__toggle--active');
    navLinks.classList.toggle('nav__links--open');
    document.body.style.overflow = navLinks.classList.contains('nav__links--open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav__toggle--active');
      navLinks.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    });
  });

  // ─── Smooth scroll for in-page anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const nav = document.getElementById('nav');
      const offset = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();
