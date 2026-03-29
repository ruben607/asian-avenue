/* ============================================
   ASIAN AVENUE — Main JavaScript
   ============================================ */

// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// --- Mobile Nav Toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

// --- Language Switcher ---
const translations = {};
let currentLang = localStorage.getItem('aa-lang') || 'en';

async function loadLanguage(lang) {
  if (!translations[lang]) {
    try {
      const res = await fetch(`lang/${lang}.json`);
      translations[lang] = await res.json();
    } catch (e) {
      console.warn(`Could not load language: ${lang}`);
      return;
    }
  }
  applyTranslations(translations[lang]);
  currentLang = lang;
  localStorage.setItem('aa-lang', lang);
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
}

function applyTranslations(data) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (data[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = data[key];
      } else {
        el.innerHTML = data[key];
      }
    }
  });
}

document.querySelectorAll('.lang-switcher button').forEach(btn => {
  btn.addEventListener('click', () => loadLanguage(btn.dataset.lang));
});

// Init language
document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(currentLang);
});

// --- Scroll Reveal for Category Panels ---
const catPanels = document.querySelectorAll('.cat-panel');
const panelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      panelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

catPanels.forEach(panel => panelObserver.observe(panel));

// --- Scroll Reveal for General Sections ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// --- Active Nav Link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
