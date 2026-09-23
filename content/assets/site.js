/* Replace only these two files when the finished materials are ready:
   assets/invitasjon-plassholder.mp4 and assets/kort-forside.jpg.
   Update the src attributes in index.html if the new filenames differ. */
(() => {
  const STORAGE_KEY = 'kaja-lars-halvor-invitasjon-seen-v1';
  const intro = document.querySelector('#intro');
  const layout = document.querySelector('.layout');
  const video = document.querySelector('#intro-video');
  const progress = document.querySelector('#video-progress');
  const videoStage = document.querySelector('#video-stage');
  const readyStage = document.querySelector('#ready-stage');
  const cardStage = document.querySelector('#card-stage');
  const card = document.querySelector('#opening-card');
  const openButton = document.querySelector('#open-invite');
  const skipButton = document.querySelector('#skip-intro');
  let stage = 'closed';
  let fallbackTimer, animationTimer, finishTimer;
  let previousFocus = null;

  const wasSeen = () => {
    try { return localStorage.getItem(STORAGE_KEY) === 'yes'; }
    catch { return false; }
  };
  const markSeen = () => {
    try { localStorage.setItem(STORAGE_KEY, 'yes'); }
    catch { /* Guest can still use the page when storage is disabled. */ }
  };
  const clearTimers = () => {
    clearTimeout(fallbackTimer);
    clearTimeout(animationTimer);
    clearTimeout(finishTimer);
  };
  const show = (which) => {
    videoStage.hidden = which !== 'video';
    readyStage.hidden = which !== 'ready';
    cardStage.hidden = which !== 'card';
    stage = which;
  };
  const finish = () => {
    if (stage === 'closed') return;
    clearTimers();
    video.pause();
    markSeen();
    intro.hidden = true;
    layout.inert = false;
    document.body.classList.remove('intro-active');
    stage = 'closed';
    (previousFocus?.isConnected ? previousFocus : document.querySelector('#hjem')).focus?.();
  };
  const ready = () => {
    if (stage !== 'video') return;
    clearTimeout(fallbackTimer);
    video.pause();
    show('ready');
    openButton.focus();
  };
  const start = () => {
    if (stage !== 'closed') return;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    clearTimers();
    card.classList.remove('is-open');
    intro.hidden = false;
    layout.inert = true;
    document.body.classList.add('intro-active');
    show('video');
    progress.style.width = '0%';
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => { /* Five-second timer still advances to the invite. */ });
    fallbackTimer = setTimeout(ready, 5500);
    skipButton.focus();
  };

  video.addEventListener('timeupdate', () => {
    if (stage === 'video') progress.style.width = `${Math.min(100, (video.currentTime / 5) * 100)}%`;
  });
  video.addEventListener('ended', ready);
  video.addEventListener('error', () => { if (stage === 'video') fallbackTimer = setTimeout(ready, 5000); });
  openButton.addEventListener('click', () => {
    if (stage !== 'ready') return;
    show('card');
    animationTimer = setTimeout(() => card.classList.add('is-open'), 80);
    finishTimer = setTimeout(finish, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1650 : 2800);
  });
  skipButton.addEventListener('click', finish);
  document.querySelectorAll('[data-replay]').forEach(button => button.addEventListener('click', start));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && stage !== 'closed') finish();
    if (event.key === 'Tab' && stage !== 'closed') {
      const tabbables = [...intro.querySelectorAll('button:not([hidden])')].filter(element => element.getClientRects().length);
      const first = tabbables[0], last = tabbables[tabbables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  if (!wasSeen()) start();

  const nav = document.querySelector('.site-nav');
  if ('IntersectionObserver' in window) {
    const links = [...nav.querySelectorAll('.nav-links a')];
    const byId = new Map(links.map(link => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          links.forEach(link => link.removeAttribute('aria-current'));
          byId.get(entry.target.id)?.setAttribute('aria-current', 'location');
        }
      }
    }, {rootMargin: '-20% 0px -60% 0px'});
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
  }
})();
