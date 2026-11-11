// Small helper for the theme buttons and scroll animations (HTML/CSS can't remember choices alone).
(function () {
  var html = document.documentElement;
  var storageAvailable = true;
  var savedMode = 'dark';
  var savedHue = '290';
  var savedLightModeTone = '18';
  try {
    savedMode = localStorage.getItem('mw-mode') || savedMode;
    savedHue = localStorage.getItem('mw-hue') || savedHue;
    savedLightModeTone = localStorage.getItem('mw-light-background-shade') || savedLightModeTone;
  } catch (error) {
    storageAvailable = false;
    console.warn('Could not access localStorage; preferences will not persist.', error);
  }

  var mode = savedMode === 'light' ? 'light' : 'dark';
  var parsedHue = Number(savedHue);
  var hue = Number.isFinite(parsedHue) && parsedHue >= 0 && parsedHue <= 360 ? parsedHue : 290;
  var parsedLightModeTone = Number(savedLightModeTone);
  var lightModeTone = Number.isFinite(parsedLightModeTone)
    ? Math.min(40, Math.max(0, parsedLightModeTone))
    : 18;
  html.classList.remove('dark', 'light');
  html.classList.add(mode);
  html.style.setProperty('--hue', hue);
  html.style.setProperty('--light-mode-tone', lightModeTone + '%');

  function savePreference(key, value) {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      storageAvailable = false;
      console.warn('Could not save preferences to localStorage.', error);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-achievement-flip]').forEach(function (card) {
      var pointerStartX = 0;
      var pointerStartTime = 0;
      var startingAngle = 0;
      var dragging = false;
      var suppressClick = false;

      function setFlipped(flipped) {
        card.classList.toggle('is-flipped', flipped);
        card.setAttribute('aria-pressed', String(flipped));
        card.setAttribute('aria-label', flipped ? card.dataset.flipBackLabel : card.dataset.flipFrontLabel);
        card.style.setProperty('--flip-angle', flipped ? '180deg' : '0deg');
      }

      card.addEventListener('pointerdown', function (event) {
        if (event.button !== 0) return;
        pointerStartX = event.clientX;
        pointerStartTime = performance.now();
        startingAngle = card.classList.contains('is-flipped') ? 180 : 0;
        dragging = true;
        card.classList.add('is-dragging');
        card.setPointerCapture(event.pointerId);
      });

      card.addEventListener('pointermove', function (event) {
        if (!dragging) return;
        var dragAngle = Math.max(0, Math.min(180, startingAngle + event.clientX - pointerStartX));
        card.style.setProperty('--flip-angle', dragAngle + 'deg');
      });

      card.addEventListener('pointerup', function (event) {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');
        var distance = event.clientX - pointerStartX;
        var elapsed = performance.now() - pointerStartTime;
        var flicked = Math.abs(distance) > 20 && elapsed < 220;
        var moved = Math.abs(distance) > 8;
        var currentlyFlipped = startingAngle === 180;
        var shouldFlip = Math.abs(distance) > 48 || flicked
          ? (currentlyFlipped ? distance < 0 : distance > 0)
          : currentlyFlipped;
        setFlipped(shouldFlip);
        if (moved) {
          suppressClick = true;
          window.setTimeout(function () { suppressClick = false; }, 0);
        }
      });

      card.addEventListener('pointercancel', function () {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');
        setFlipped(startingAngle === 180);
      });

      card.addEventListener('click', function (event) {
        if (suppressClick) {
          event.preventDefault();
          suppressClick = false;
          return;
        }
        setFlipped(!card.classList.contains('is-flipped'));
      });
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-profile-effect]').forEach(function (card) {
        card.addEventListener('pointermove', function (event) {
          if (event.pointerType === 'touch') return;
          var bounds = card.getBoundingClientRect();
          var x = (event.clientX - bounds.left) / bounds.width;
          var y = (event.clientY - bounds.top) / bounds.height;
          card.style.setProperty('--profile-pointer-x', (x * 100) + '%');
          card.style.setProperty('--profile-pointer-y', (y * 100) + '%');
          card.style.setProperty('--profile-tilt-x', ((0.5 - y) * 8) + 'deg');
          card.style.setProperty('--profile-tilt-y', ((x - 0.5) * 10) + 'deg');
          card.classList.add('is-profile-active');
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--profile-pointer-x', '50%');
          card.style.setProperty('--profile-pointer-y', '50%');
          card.style.setProperty('--profile-tilt-x', '0deg');
          card.style.setProperty('--profile-tilt-y', '0deg');
          card.classList.remove('is-profile-active');
        });
      });
    }

    var carousel = document.querySelector('[data-personal-carousel]');
    if (carousel) {
      var slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
      var slideTitles = slides.map(function (slide) { return slide.getAttribute('aria-label'); });
      var status = carousel.querySelector('.personal-carousel-status');
      var previousButton = carousel.querySelector('[data-carousel-previous]');
      var nextButton = carousel.querySelector('[data-carousel-next]');
      var achievementsLink = carousel.querySelector('[data-carousel-achievements]');
      var currentSlide = 0;

      function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        previousButton.hidden = currentSlide === 0;
        var isLastSlide = currentSlide === slides.length - 1;
        nextButton.hidden = isLastSlide;
        achievementsLink.hidden = !isLastSlide;
        slides.forEach(function (slide, slideIndex) {
          slide.hidden = slideIndex !== currentSlide;
          slide.setAttribute('aria-roledescription', 'slide');
          slide.setAttribute('aria-label', (slideIndex + 1) + ' of ' + slides.length + ': ' + slideTitles[slideIndex]);
        });
        status.textContent = (currentSlide + 1) + ' of ' + slides.length + ' · ' + slideTitles[currentSlide];
      }

      previousButton.addEventListener('click', function () {
        showSlide(currentSlide - 1);
      });
      nextButton.addEventListener('click', function () {
        showSlide(currentSlide + 1);
      });
      showSlide(currentSlide);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var cursorGlow = document.createElement('div');
      var cursorBurstTimer;
      cursorGlow.className = 'cursor-glow';
      cursorGlow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cursorGlow);

      document.addEventListener('pointermove', function (e) {
        cursorGlow.style.setProperty('--cursor-x', e.clientX + 'px');
        cursorGlow.style.setProperty('--cursor-y', e.clientY + 'px');
        cursorGlow.classList.add('is-visible');
        var target = e.target;
        cursorGlow.classList.toggle(
          'is-hovering',
          target instanceof Element && Boolean(target.closest('a, button, input, select, textarea, summary, [role="button"]'))
        );
      });
      document.addEventListener('pointerdown', function (e) {
        cursorGlow.style.setProperty('--cursor-x', e.clientX + 'px');
        cursorGlow.style.setProperty('--cursor-y', e.clientY + 'px');
        cursorGlow.classList.add('is-visible');
        cursorGlow.classList.remove('is-burst');
        window.requestAnimationFrame(function () { cursorGlow.classList.add('is-burst'); });
        window.clearTimeout(cursorBurstTimer);
        cursorBurstTimer = window.setTimeout(function () { cursorGlow.classList.remove('is-burst'); }, 500);
      });
      document.addEventListener('pointerleave', function () {
        cursorGlow.classList.remove('is-visible', 'is-hovering');
      });
      window.addEventListener('blur', function () {
        cursorGlow.classList.remove('is-visible', 'is-hovering', 'is-burst');
      });
    }

    var modeBtn = document.getElementById('modeBtn');
    var paletteBtn = document.getElementById('paletteBtn');
    var menu = document.getElementById('paletteMenu');
    var slider = document.getElementById('hueSlider');
    var lightModeToneSlider = document.getElementById('lightModeToneSlider');
    var lightModeToneValue = document.getElementById('lightModeToneValue');
    modeBtn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    slider.value = hue;
    lightModeToneSlider.value = lightModeTone;
    lightModeToneValue.value = lightModeTone + '%';

    modeBtn.onclick = function () {
      mode = mode === 'dark' ? 'light' : 'dark';
      html.classList.remove('dark', 'light');
      html.classList.add(mode);
      modeBtn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      savePreference('mw-mode', mode);
    };
    function setHue(h) {
      html.style.setProperty('--hue', h);
      slider.value = h;
      savePreference('mw-hue', h);
    }
    paletteBtn.onclick = function (e) { e.stopPropagation(); menu.classList.toggle('open'); };
    menu.onclick = function (e) { e.stopPropagation(); };
    document.onclick = function () { menu.classList.remove('open'); };
    slider.oninput = function () { setHue(slider.value); };
    lightModeToneSlider.oninput = function () {
      lightModeTone = Number(lightModeToneSlider.value);
      html.style.setProperty('--light-mode-tone', lightModeTone + '%');
      lightModeToneValue.value = lightModeTone + '%';
      savePreference('mw-light-background-shade', lightModeTone);
    };
    menu.querySelectorAll('[data-hue]').forEach(function (b) {
      b.onclick = function () { setHue(b.dataset.hue); };
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
      html.classList.add('js');
    }
  });
})();