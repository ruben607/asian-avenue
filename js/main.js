/* ============================================
   ASIAN AVENUE v3 — Sticky Scroll Hero
   Logo fades out, panels fade in, pinned to viewport
   ============================================ */
(function () {
  'use strict';

  /* ── Navbar scroll shadow ── */
  var nav = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Mobile toggle ── */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var bars = toggle.querySelectorAll('span');
      var open = links.classList.contains('open');
      bars[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
      bars[1].style.opacity = open ? '0' : '';
      bars[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
  }

  /* ── Language switcher ── */
  var langCache = {};
  var currentLang = localStorage.getItem('aa-lang') || 'en';

  function applyLang(data) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (!data[key]) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = data[key];
      } else {
        el.innerHTML = data[key];
      }
    });
  }

  function loadLang(code) {
    if (langCache[code]) { applyLang(langCache[code]); setLang(code); return; }
    fetch('lang/' + code + '.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { langCache[code] = d; applyLang(d); setLang(code); })
      .catch(function () { console.warn('Missing lang: ' + code); });
  }

  function setLang(code) {
    currentLang = code;
    localStorage.setItem('aa-lang', code);
    document.documentElement.lang = code;
    document.querySelectorAll('.lang-switcher button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === code);
    });
  }

  document.querySelectorAll('.lang-switcher button').forEach(function (b) {
    b.addEventListener('click', function () { loadLang(b.dataset.lang); });
  });

  document.addEventListener('DOMContentLoaded', function () { loadLang(currentLang); });

  /* ══════════════════════════════════════════
     STICKY SCROLL HERO — Crossfade Logic
     As user scrolls through .scroll-track,
     the logo layer fades out + scales down
     and the panels layer fades in.
     ══════════════════════════════════════════ */
  var scrollTrack = document.querySelector('.scroll-track');
  var logoLayer = document.getElementById('logoLayer');
  var panelsLayer = document.getElementById('panelsLayer');

  if (scrollTrack && logoLayer && panelsLayer) {
    function onScroll() {
      var rect = scrollTrack.getBoundingClientRect();
      var trackHeight = scrollTrack.offsetHeight;
      var viewH = window.innerHeight;

      // How far we've scrolled into the track (0 = top, 1 = bottom)
      var scrolled = -rect.top / (trackHeight - viewH);
      var progress = Math.max(0, Math.min(1, scrolled));

      // Logo: visible at progress 0, gone by progress 0.5
      var logoProgress = Math.min(1, progress * 2);
      logoLayer.style.opacity = 1 - logoProgress;
      logoLayer.style.transform = 'scale(' + (1 - logoProgress * 0.15) + ')';

      // Panels: hidden at progress 0, fully visible by progress 0.6
      var panelStart = 0.3;
      var panelProgress = Math.max(0, Math.min(1, (progress - panelStart) / 0.5));
      panelsLayer.style.opacity = panelProgress;

      // Hide pointer events when not visible
      logoLayer.style.pointerEvents = logoProgress > 0.95 ? 'none' : 'auto';
      panelsLayer.style.pointerEvents = panelProgress > 0.5 ? 'auto' : 'none';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call
  }

  /* ── General section reveal ── */
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

  /* ── Active nav link ── */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

})();
