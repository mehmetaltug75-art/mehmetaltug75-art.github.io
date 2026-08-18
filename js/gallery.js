/**
 * Photography gallery — scatter layout + lightbox
 */

(function () {
  'use strict';

  // Lightbox navigation order (album numbers)
  var photoOrder = ['05', '06', '04', '03', '09', '15', '16', '14', '17', '18', '20', '11', '12', '01', '08', '22'];

  var photos = photoOrder.map(function (num) {
    return 'fotooo/' + num + '.jpg';
  });

  var gallery = document.getElementById('scatterGallery');
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var stage = document.getElementById('lightboxStage');

  var currentIndex = -1;
  var touchStartX = 0;
  var lastFocusedElement = null;

  var focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function photoAlt(index) {
    return 'Photo ' + photoOrder[index];
  }

  function openLightbox(index) {
    if (index < 0 || index >= photos.length) return;
    lastFocusedElement = document.activeElement;
    currentIndex = index;
    lightboxImage.src = photos[currentIndex];
    lightboxImage.alt = photoAlt(currentIndex);
    lightbox.removeAttribute('hidden');
    // force reflow
    void lightbox.offsetWidth;
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightbox.setAttribute('hidden', '');
      lightboxImage.src = '';
      lightboxImage.alt = '';
      currentIndex = -1;
      if (lastFocusedElement && lastFocusedElement.focus) {
        lastFocusedElement.focus();
      }
    }, 300);
  }

  function showPrev() {
    if (currentIndex <= 0) {
      openLightbox(photos.length - 1);
    } else {
      openLightbox(currentIndex - 1);
    }
  }

  function showNext() {
    if (currentIndex >= photos.length - 1) {
      openLightbox(0);
    } else {
      openLightbox(currentIndex + 1);
    }
  }

  // Open on photo click
  gallery.querySelectorAll('.scatter-gallery__photo').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var index = parseInt(btn.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  // Controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    showPrev();
  });
  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    showNext();
  });

  // Close on backdrop click (stage area outside image)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === stage) {
      closeLightbox();
    }
  });

  // Keyboard navigation + focus trap
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();

    // Focus trap (Tab / Shift+Tab)
    if (e.key === 'Tab') {
      var focusables = Array.prototype.slice.call(lightbox.querySelectorAll(focusableSelectors));
      if (focusables.length === 0) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Swipe support for mobile lightbox
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    var touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });
})();
