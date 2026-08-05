// ============================================================
// SCRIPT.JS — behavior only (all content now lives in index.html)
// ------------------------------------------------------------
// This file does NOT build or inject any page content. It only
// powers small interactive effects: smooth scrolling, the mobile
// menu, the typing effect, scroll-reveal animations, the skill
// bar fill-in, the scroll progress bar, and the active nav link.
// Edit index.html directly to change any text, links, or images.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Footer year ----------
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Smooth scroll for any [data-scroll] element ----------
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-scroll]');
    if (trigger) {
      e.preventDefault();
      scrollToId(trigger.dataset.scroll);
      // close mobile menu if open
      var mobile = document.getElementById('nav-mobile');
      var icon = document.getElementById('nav-icon');
      if (mobile) mobile.classList.remove('open');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  });

  // ---------- Mobile nav toggle ----------
  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('nav-mobile');
  var icon = document.getElementById('nav-icon');
  if (toggle && mobile && icon) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
  }

  // ---------- Typing effect (rotates through personal.roles) ----------
  (function () {
    var el = document.getElementById('typed-text');
    if (!el) return;

    var phrases = ['Cloud & DevOps Engineer', 'Cloud Enthusiast', 'DevOps Learner', 'CSE Student'];
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600); // pause at full word
          return;
        }
        setTimeout(tick, 90);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 45);
      }
    }
    tick();
  })();

  // ---------- Animated number counters (for elements with data-count) ----------
  (function () {
    var counters = document.querySelectorAll('.stat-num[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var duration = 1600;
        var start = performance.now();

        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { observer.observe(el); });
  })();

  // ---------- Scroll reveal ----------
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // ---------- Skill progress bars ----------
  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        bar.style.width = bar.dataset.level + '%';
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill').forEach(function (bar) { barObserver.observe(bar); });

  // ---------- Scroll progress bar + navbar shrink ----------
  var progressBar = document.getElementById('scroll-progress');
  var navbar = document.getElementById('navbar-el');
  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Active nav link ----------
  var navLinkIds = ['hero', 'about', 'skills', 'why', 'journey', 'project', 'certificates', 'internship', 'contact'];
  var navButtons = document.querySelectorAll('[data-nav]');

  var activeObserver = new IntersectionObserver(function (entries) {
    var visible = entries
      .filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
    if (visible[0]) {
      var activeId = visible[0].target.id;
      navButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.nav === activeId);
      });
    }
  }, { threshold: 0.3, rootMargin: '-20% 0px -50% 0px' });
  navLinkIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) activeObserver.observe(el);
  });

});
