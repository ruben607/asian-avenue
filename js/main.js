/* ============================================
   ASIAN AVENUE v2 — JavaScript
   Scroll-triggered panels, nav, i18n
   Updated: 2026-03-29
   ============================================ */

(function () {
  'use strict';

  // ── Navbar scroll shadow ──
  var nav = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Mobile toggle ──
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var bars = toggle.querySelectorAll('span');
      var isOpen = links.classList.contains('open');
      bars[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
      bars[1].style.opacity = isOpen ? '0' : '';
      bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
  }

  // ── Language switcher ──
  var cache = {};
  var lang = localStorage.getItem('aa-lang') || 'en';

  function apply(data) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n;
      if (!data[k]) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = data[k];
      } else {
        el.innerHTML = data[k];
      }
    });
  }

  function load(code) {
    if (cache[code]) {
      apply(cache[code]);
      finish(code);
      return;
    }
    fetch('lang/' + code + '.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { cache[code] = d; apply(d); finish(code); })
      .catch(function () { console.warn('Lang file not found: ' + code); });
  }

  function finish(code) {
    lang = code;
    localStorage.setItem('aa-lang', code);
    document.documentElement.lang = code;
    document.querySelectorAll('.lang-switcher button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === code);
    });
  }

  document.querySelectorAll('.lang-switcher button').forEach(function (b) {
    b.addEventListener('click', function () { load(b.dataset.lang); });
  });

  document.addEventListener('DOMContentLoaded', function () { load(lang); });

  // ── Scroll-triggered panel fade-in ──
  var panels = document.querySelectorAll('.panel');
  var panelObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        panelObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  panels.forEach(function (p) { panelObs.observe(p); });

  // ── General reveal ──
  var reveals = document.querySelectorAll('.reveal');
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { revObs.observe(el); });

  // ── Active nav link ──
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

})();
