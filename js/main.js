/**
 * Index page — scroll-driven video curtain + hero with orbs
 * Fully fixed for iOS/mobile compatibility
 */

(function () {
  'use strict';

  var curtain = document.getElementById('curtain');
  var video = document.querySelector('.curtain__video');
  var heroSection = document.getElementById('hero');
  var bgMusic = document.getElementById('bgMusic');
  var musicBtn = document.getElementById('musicToggle');
  var iconOff = musicBtn.querySelector('.music-icon-off');
  var iconOn = musicBtn.querySelector('.music-icon-on');
  var curtainOpen = false;
  var musicPlaying = false;
  var accumulatedScroll = 0;
  var scrollSensitivity = 3000;

  var videoReady = false;
  var videoUnlocked = false;

  bgMusic.volume = 0.4;

  /* =============================================
     MUSIC CONTROLS
     ============================================= */
  var userStoppedMusic = false;

  function updateMusicButtonState(playing) {
    if (playing) {
      musicBtn.classList.add('playing');
      musicBtn.title = 'Pause Music';
      musicBtn.setAttribute('aria-label', 'Pause background music');
      iconOff.style.display = 'none';
      iconOn.style.display = '';
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.title = 'Play Music';
      musicBtn.setAttribute('aria-label', 'Play background music');
      iconOff.style.display = '';
      iconOn.style.display = 'none';
    }
  }

  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      userStoppedMusic = true; // User chose to stop — don't auto-restart
      updateMusicButtonState(false);
    } else {
      userStoppedMusic = false;
      bgMusic.play().then(function () {
        musicPlaying = true;
        updateMusicButtonState(true);
      }).catch(function () {});
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  function startMusic() {
    if (musicPlaying || userStoppedMusic) return;
    bgMusic.play().then(function () {
      musicPlaying = true;
      updateMusicButtonState(true);
    }).catch(function () {});
  }

  /* =============================================
     LOCK SCROLL DURING CURTAIN
     ============================================= */
  document.body.classList.add('curtain-active');

  /* =============================================
     iOS VIDEO FIX
     iOS blocks programmatic video.currentTime
     unless the video has been "unlocked" by a
     user gesture (play). We:
     1. Call video.load() to force buffering
     2. Wait for loadedmetadata for duration
     3. Briefly play() on first touch to unlock
     4. Then pause and control via currentTime
     ============================================= */

  function initVideo() {
    videoReady = true;
    video.pause();
    try {
      video.currentTime = 0.001;
    } catch (e) {}
  }

  if (video.readyState >= 1) {
    initVideo();
  } else {
    video.addEventListener('loadedmetadata', initVideo);
  }

  // Force iOS to start buffering
  video.load();

  // Safety fallback: if video never loads, skip curtain after 8 seconds
  var safetyTimeout = setTimeout(function () {
    if (!videoReady) {
      openCurtain();
    }
  }, 8000);

  // Reduced motion: skip the scroll-driven intro entirely, cross-fade to hero
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(function () { openCurtain(); }, 100);
  }

  // Unlock video on first user interaction
  function unlockVideo() {
    if (videoUnlocked) return;
    videoUnlocked = true;

    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        video.pause();
        video.currentTime = 0.001;
      }).catch(function () {
        // Fallback — try direct seek even if play failed
        try { video.currentTime = 0.001; } catch (e) {}
      });
    }
  }

  /* =============================================
     CURTAIN OPEN
     ============================================= */
  function openCurtain() {
    if (curtainOpen) return;
    curtainOpen = true;

    // Clear safety timeout
    clearTimeout(safetyTimeout);

    // Immediately remove scroll blocker
    document.removeEventListener('touchmove', preventScroll);

    curtain.classList.add('curtain--open');

    // Remove curtain-active and restore scroll position
    document.body.classList.remove('curtain-active');
    document.body.classList.add('hero-locked');
    window.scrollTo(0, 0);

    setTimeout(function () {
      heroSection.classList.add('hero--revealed');
    }, 400);

    setTimeout(function () {
      curtain.style.display = 'none';
    }, 1500);
  }

  /* =============================================
     VIDEO SEEKING
     ============================================= */
  var pendingSeek = null;

  function seekVideo(time) {
    if (pendingSeek !== null) {
      cancelAnimationFrame(pendingSeek);
    }
    pendingSeek = requestAnimationFrame(function () {
      try {
        video.currentTime = time;
      } catch (e) {}
      pendingSeek = null;
    });
  }

  function updateVideo(delta) {
    if (curtainOpen) return;
    if (!videoReady || !video.duration || isNaN(video.duration)) return;

    // Allow forward and backward
    accumulatedScroll += delta;
    if (accumulatedScroll < 0) accumulatedScroll = 0;

    var progress = Math.min(accumulatedScroll / scrollSensitivity, 1);
    seekVideo(progress * video.duration);

    if (progress >= 1) {
      openCurtain();
    }
  }

  /* =============================================
     SCROLL BLOCKING
     Prevents iOS from natively scrolling or
     triggering video gestures during curtain
     ============================================= */

  function preventScroll(e) {
    if (!curtainOpen) {
      e.preventDefault();
    }
  }

  // passive: false required for preventDefault
  document.addEventListener('touchmove', preventScroll, { passive: false });

  // Mouse wheel — block native scroll + drive video
  // Clamp delta so fast scrolling does not jump the video past frames.
  // On desktop, scrolling UP (wheel up / negative deltaY) advances forward
  // to match the mobile swipe-up gesture.
  window.addEventListener('wheel', function (e) {
    if (!curtainOpen) {
      e.preventDefault();
      unlockVideo();
      var maxDelta = 80;
      var delta = e.deltaY < 0
        ? Math.min(Math.abs(e.deltaY), maxDelta)
        : -Math.min(Math.abs(e.deltaY), maxDelta);
      updateVideo(delta);
    }
    startMusic();
  }, { passive: false });

  /* =============================================
     TOUCH HANDLING
     ============================================= */
  var lastTouchY = 0;
  var touchStarted = false;

  window.addEventListener('touchstart', function (e) {
    unlockVideo();
    startMusic();
    if (curtainOpen) return;
    lastTouchY = e.touches[0].clientY;
    touchStarted = true;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (curtainOpen || !touchStarted) return;
    var currentY = e.touches[0].clientY;
    var delta = lastTouchY - currentY; // positive = swipe up = forward
    lastTouchY = currentY;
    var scaled = delta * 3;
    var maxDelta = 80;
    if (scaled > maxDelta) scaled = maxDelta;
    if (scaled < -maxDelta) scaled = -maxDelta;
    updateVideo(scaled);
  }, { passive: true });

  window.addEventListener('touchend', function () {
    touchStarted = false;
  }, { passive: true });

  /* =============================================
     KEYBOARD
     ============================================= */
  window.addEventListener('keydown', function (e) {
    if (!curtainOpen && ['ArrowDown', 'ArrowUp', 'Space', 'Enter'].includes(e.code)) {
      e.preventDefault();
      unlockVideo();
      if (e.code === 'ArrowDown') {
        updateVideo(-80);
      } else {
        updateVideo(80);
      }
    }
  });

  /* =============================================
     PREVENT iOS FROM OPENING VIDEO FULLSCREEN
     ============================================= */
  video.addEventListener('click', function (e) {
    e.preventDefault();
  });

  video.addEventListener('touchend', function (e) {
    e.preventDefault();
  });

})();
