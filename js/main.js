/* ══════════════════════════════════════════════════════
   Happy Birthday Корина — main.js
   ══════════════════════════════════════════════════════ */

// ── Loading Screen ──────────────────────────────────────
const loadingScreen = document.getElementById('loading-screen');
let loadingDone = false;

function hideLoading() {
  if (loadingDone) return;
  loadingDone = true;
  loadingScreen.classList.add('fade-out');
  setTimeout(() => loadingScreen.remove(), 900);
  // Start intro video (already muted via HTML attr) after loader fade
  setTimeout(() => {
    introVideo.play().catch((e) => { console.log(e); });
  }, 950);
}

const imgPromises = [];
document.querySelectorAll('img:not(#loading-screen img)').forEach(img => {
  imgPromises.push(new Promise(resolve => {
    if (img.complete && img.naturalWidth > 0) { resolve(); return; }
    img.addEventListener('load',  resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  }));
});

const vidPromises = [];
document.querySelectorAll('video').forEach(video => {
  vidPromises.push(new Promise(resolve => {
    if (video.readyState >= 2) { resolve(); return; }
    video.addEventListener('loadeddata', resolve, { once: true });
    video.addEventListener('error',      resolve, { once: true });
    setTimeout(resolve, 10000);
  }));
});

const MIN_LOADING_MS = 5000;
const loadingStart = Date.now();

Promise.all([...imgPromises, ...vidPromises]).then(() => {
  const elapsed = Date.now() - loadingStart;
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
  setTimeout(hideLoading, remaining + 250);
});

setTimeout(hideLoading, 18000);


// ── Screen 1: replay overlay + sound toggle ─────────────
const introVideo     = document.getElementById('intro-video');
const replayOverlay  = document.getElementById('replay-overlay');
const replayBtn      = document.getElementById('replay-btn');

let autoScrollDone = false;

introVideo.addEventListener('ended', () => {
  replayOverlay.classList.add('show');
  if (!autoScrollDone) {
    autoScrollDone = true;
    setTimeout(() => {
      document.getElementById('screen-2').scrollIntoView({ behavior: 'smooth' });
    }, 800);
  }
});

replayBtn.addEventListener('click', () => {
  replayOverlay.classList.remove('show');
  document.getElementById('screen-1').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    introVideo.currentTime = 0;
    introVideo.play().catch(() => {});
  }, 600);
});


// ── Sound toggles (screens 1 & 4) ──────────────────────
const mainVideo = document.getElementById('main-video');

function setMuted(video, btnId, muted) {
  const btn = document.getElementById(btnId);
  video.muted = muted;
  btn.textContent = muted ? '🔇' : '🔊';
}

function makeSoundToggle(btnId, video) {
  const btn = document.getElementById(btnId);
  btn.addEventListener('click', e => {
    e.stopPropagation();
    setMuted(video, btnId, !video.muted);
  });
}

makeSoundToggle('sound1', introVideo);
makeSoundToggle('sound4', mainVideo);

// Unmute intro video on first user gesture (tap/click anywhere)
function unmuteOnFirstGesture() {
  if (!introVideo.muted) return;
  // Only unmute if we're still on screen 1 (video playing or not ended)
  if (!introVideo.ended) {
    setMuted(introVideo, 'sound1', false);
  }
  var loadingText = document.querySelector("#loading-text"); // Ищет первый элемент с этим классом
  if (loadingText) {
    loadingText.textContent = "Подождите...";
  } else {
    console.log(document.querySelector("#loading-text"))
  }
  document.removeEventListener('touchstart', unmuteOnFirstGesture);
  document.removeEventListener('click', unmuteOnFirstGesture);
}
document.addEventListener('touchstart', unmuteOnFirstGesture, { once: true });
document.addEventListener('click', unmuteOnFirstGesture, { once: true });


// ── Screen 2: play cat video + confetti on enter ────────
const catVideo    = document.getElementById('cat-video');
let confettiFired = false;

const obs2 = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;

  catVideo.play().catch((e) => {console.log(e)});

  if (!confettiFired) {
    confettiFired = true;
    setTimeout(() => {
      confetti({ particleCount: 90, angle: 60,  spread: 55, origin: { x: 0, y: 0.55 } });
      confetti({ particleCount: 90, angle: 120, spread: 55, origin: { x: 1, y: 0.55 } });
    }, 400);
  }
}, { threshold: 0.45 });
obs2.observe(document.getElementById('screen-2'));


// ── Screen 3: slide-up photo + acrostic ────────────────
// Photo has its own CSS classes (not using .slide-up)
const karinaPhoto = document.getElementById('karina-photo');
const obsPhoto = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    karinaPhoto.classList.add('visible');
    obsPhoto.disconnect();
  }
}, { threshold: 0.15 });
obsPhoto.observe(karinaPhoto);

// Each acrostic line individually
document.querySelectorAll('#screen-3 .slide-up').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      el.classList.add('visible');
      obs.disconnect();
    }
  }, { threshold: 0.1 });
  obs.observe(el);
});


// ── Screen 4: slide-up video + play + auto-scroll ───────
const vid4Wrap        = document.querySelector('.vid4-wrap');
let screen4Triggered  = false;

const obs4 = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || screen4Triggered) return;
  screen4Triggered = true;

  vid4Wrap.classList.add('visible');

  mainVideo.play().catch(() => {});
  setMuted(mainVideo, 'sound4', false);

  obs4.disconnect();
}, { threshold: 0.35 });
obs4.observe(document.getElementById('screen-4'));

mainVideo.addEventListener('ended', () => {
  document.getElementById('screen-5').scrollIntoView({ behavior: 'smooth' });
});


// ── Modal helpers ───────────────────────────────────────
const modal     = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalImg  = document.getElementById('modal-img');
const modalX    = document.getElementById('modal-x');

function openModal() {
  modal.classList.remove('is-closing');
  modal.classList.add('is-open');
}

function closeModal() {
  modal.classList.add('is-closing');
  modal.classList.remove('is-open');
  setTimeout(() => modal.classList.remove('is-closing'), 260);
}

modalX.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});


// ── Scroll-down arrows ──────────────────────────────────
document.querySelectorAll('.scroll-down').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


// ── Screen 5: gift modal ────────────────────────────────
const giftImg = document.getElementById('gift-img');

const MESSAGES = [
  'Я же сказала сделать хлопок',
  'Повтори.',
  'Ладно',
  'Ты че реально думаешь получишь подарок без хлопка? Давай хлопай',
  'Ну ладно прощаю, открывай',
  null, // 6th — image + promo text
];

let giftClicks = 0;

giftImg.addEventListener('click', () => {
  giftClicks = Math.min(giftClicks + 1, 6);

  if (giftClicks < 6) {
    modalImg.classList.add('hidden');
    modalText.innerHTML = MESSAGES[giftClicks - 1];
  } else {
    modalImg.classList.remove('hidden');
    modalText.innerHTML =
      'ДЕНЬГИ — лучший подарок.' +
      '<br><br>' +
      'Чтобы получить подарок пиши в нашем чате промокод<br>' +
      '<span class="promo">АЙСЫЛУ ЭТО ОЧЕНЬ КРУТОЙ ПОДАРОК</span>';
  }

  openModal();
});
