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

  function openLightbox(index) {
    if (index < 0 || index >= photos.length) return;
    currentIndex = index;
    lightboxImage.src = photos[currentIndex];
    lightbox.removeAttribute('hidden');
    // force reflow
    void lightbox.offsetWidth;
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightbox.setAttribute('hidden', '');
      lightboxImage.src = '';
      currentIndex = -1;
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

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('is-active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
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
