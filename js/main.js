/* Herman Mah — District of North Vancouver
   Small, dependency-free front-end. Everything degrades if JS is off. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- page entrance */
  requestAnimationFrame(function () {
    document.body.classList.add('loaded');
  });

  /* --------------------------------------------------- header + scroll rail */
  var head = document.getElementById('siteHead');
  var rail = document.getElementById('scrollbarFill');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    head.classList.toggle('is-stuck', y > 24);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    rail.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------ mobile menu */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');

  function closeDrawer() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeDrawer();
    } else {
      drawer.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
    }
  });

  drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeDrawer();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeDrawer();
      burger.focus();
    }
  });

  /* --------------------------------------------- active section in the menu */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var marker = document.getElementById('navMarker');
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function moveMarker(link) {
    if (!link) { marker.style.opacity = '0'; return; }
    marker.style.opacity = '1';
    marker.style.width = link.offsetWidth + 'px';
    marker.style.transform = 'translateX(' + link.offsetLeft + 'px)';
  }

  function setActive(id) {
    var current = null;
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) current = a;
    });
    moveMarker(current);
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  window.addEventListener('resize', function () {
    var active = document.querySelector('.nav a.is-active');
    moveMarker(active);
  });

  /* -------------------------------------------------------- reveal on entry */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
  } else {
    var seen = new WeakMap();
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;

        // Stagger siblings that enter together, so groups cascade gently.
        var parent = en.target.parentNode;
        var n = seen.get(parent) || 0;
        seen.set(parent, n + 1);

        en.target.style.transitionDelay = Math.min(n * 70, 350) + 'ms';
        en.target.classList.add('in');
        ro.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    Array.prototype.forEach.call(revealables, function (el) { ro.observe(el); });
  }

  /* ------------------------------------------------------ days until voting */
  var away = document.getElementById('kdAway');

  if (away) {
    // General voting day: Saturday, October 17, 2026, polls open at 8:00 (PDT).
    var electionDay = new Date('2026-10-17T08:00:00-07:00');
    var oneDay = 86400000;
    var days = Math.ceil((electionDay - Date.now()) / oneDay);

    if (days > 1) {
      away.textContent = days + ' days away';
    } else if (days === 1) {
      away.textContent = 'Tomorrow';
    } else if (days === 0) {
      away.textContent = 'Today';
    }
  }

  /* ----------------------------------------------------- counting the stats */
  var numbers = document.querySelectorAll('[data-count]');

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);

    if (reduced || el.hasAttribute('data-plain')) {
      el.textContent = target;
      return;
    }

    var start = performance.now();
    var dur = 1100;

    function step(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target);
        co.unobserve(en.target);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(numbers, function (el) {
      if (!el.hasAttribute('data-plain')) el.textContent = '0';
      co.observe(el);
    });
  }

  /* ---------------------------------------- smooth anchors + focus handling */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;

    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;

    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });

})();
