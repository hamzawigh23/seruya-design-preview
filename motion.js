(() => {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-scroll');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.motion-toggle');
  const label = toggle.querySelector('.motion-label');
  const icon = toggle.querySelector('.motion-icon');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let enabled = !preference.matches;
  let overridden = false;
  let frame = 0;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let intro = [];
  let ambient = [];
  let ready = false;

  function updateScroll() {
    frame = 0;
    header.classList.toggle('scrolled', window.scrollY > 40);
    const travel = Math.max(1, stage.offsetHeight - hero.offsetHeight);
    const progress = enabled ? Math.max(0, Math.min(1, -stage.getBoundingClientRect().top / travel)) : 0;
    const ease = progress * progress * (3 - 2 * progress);
    const isSmall = window.innerWidth <= 760;
    hero.style.setProperty('--hero-pull', `${ease * (isSmall ? 24 : 70)}px`);
    hero.style.setProperty('--hero-scale', String(1.04 + ease * .13));
    hero.style.setProperty('--hero-title-y', `${-ease * (isSmall ? 24 : 64)}px`);
    hero.style.setProperty('--hero-title-scale', String(1 - ease * .07));
    hero.style.setProperty('--hero-seam-width', `${2 + ease * (isSmall ? 8 : 22)}px`);
    hero.style.setProperty('--hero-copy-opacity', String(1 - ease * .75));
  }
  function requestScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }

  function cancelIntro() {
    intro.forEach(animation => animation.cancel());
    intro = [];
  }
  function playIntro() {
    cancelIntro();
    if (!enabled || !ready || !hero.animate || stage.getBoundingClientRect().bottom < 0) return;
    const timing = { duration: 1800, easing: 'cubic-bezier(.76,0,.16,1)', fill: 'backwards' };
    intro.push(document.querySelector('.hero-dark').animate([
      { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }
    ], timing));
    intro.push(document.querySelector('.hero-light').animate([
      { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }
    ], { ...timing, delay: 100 }));
    document.querySelectorAll('.hero-letter-inner').forEach((letter, index) => {
      intro.push(letter.animate([
        { opacity: 0, transform: 'translateY(75%) rotateX(-25deg)', filter: 'blur(12px)' },
        { opacity: 1, transform: 'translateY(0) rotateX(0)', filter: 'blur(0)' }
      ], { duration: 1400, delay: 650 + index * 110, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
    });
    document.querySelectorAll('.hero-eyebrow,.hero-bottom-left,.hero-invitation').forEach((item, index) => {
      intro.push(item.animate([
        { opacity: 0, translate: '0 18px' }, { opacity: 1, translate: '0 0' }
      ], { duration: 1000, delay: 1300 + index * 180, easing: 'ease-out', fill: 'backwards' }));
    });
  }
  function createAmbient() {
    if (ambient.length || !hero.animate) return;
    document.querySelectorAll('.hero-half img').forEach((image, index) => {
      const direction = index ? -1 : 1;
      ambient.push(image.animate([
        { transform: `scale(1.04) translate(${direction * -1}%,0%)` },
        { transform: `scale(1.11) translate(${direction * 1}%,1%)` },
        { transform: `scale(1.04) translate(${direction * -1}%,0%)` }
      ], { duration: index ? 19000 : 16000, iterations: Infinity, easing: 'ease-in-out' }));
    });
    ambient.push(document.querySelector('.scroll-note span').animate([
      { transform: 'scaleX(.35)', opacity: .35 },
      { transform: 'scaleX(1)', opacity: 1 },
      { transform: 'scaleX(.35)', opacity: .35 }
    ], { duration: 2400, iterations: Infinity, easing: 'ease-in-out' }));
  }
  function syncAmbient() {
    const bounds = stage.getBoundingClientRect();
    const active = enabled && ready && !document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight;
    ambient.forEach(animation => active ? animation.play() : animation.pause());
  }
  function setMotion(value, replay = false) {
    enabled = value;
    document.documentElement.classList.toggle('motion-enabled', value);
    toggle.setAttribute('aria-pressed', String(value));
    toggle.setAttribute('aria-label', value ? 'Pause animation' : 'Enable animation');
    label.textContent = value ? 'Pause motion' : 'Play motion';
    icon.textContent = value ? 'Ⅱ' : '▷';
    if (value && ready) createAmbient();
    if (!value) {
      cancelIntro();
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      pointerX = pointerY = targetX = targetY = 0;
      hero.style.setProperty('--pointer-x', '0px');
      hero.style.setProperty('--pointer-y', '0px');
    } else if (replay) playIntro();
    syncAmbient();
    updateScroll();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => { overridden = true; setMotion(!enabled, true); });
  preference.addEventListener('change', () => { if (!overridden) setMotion(!preference.matches, true); });
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  document.addEventListener('visibilitychange', syncAmbient);
  const visibility = new IntersectionObserver(syncAmbient, { threshold: [0, .1] });
  visibility.observe(stage);

  function movePointer() {
    pointerX += (targetX - pointerX) * .065;
    pointerY += (targetY - pointerY) * .065;
    hero.style.setProperty('--pointer-x', `${pointerX.toFixed(2)}px`);
    hero.style.setProperty('--pointer-y', `${pointerY.toFixed(2)}px`);
    if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > .08 && enabled) pointerFrame = requestAnimationFrame(movePointer);
    else pointerFrame = 0;
  }
  hero.addEventListener('pointermove', event => {
    if (!enabled || !finePointer.matches || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 20;
    targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 14;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(movePointer);
  });
  hero.addEventListener('pointerleave', () => { targetX = targetY = 0; if (enabled && !pointerFrame) pointerFrame = requestAnimationFrame(movePointer); });
  const beauty = document.querySelector('.beauty-scene');
  beauty.addEventListener('pointermove', event => {
    if (!enabled || event.pointerType !== 'mouse') return;
    const bounds = beauty.getBoundingClientRect();
    beauty.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    beauty.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  });
  setMotion(enabled);
  const imagesReady = [...hero.querySelectorAll('img')].map(image => image.decode ? image.decode().catch(() => {}) : Promise.resolve());
  Promise.race([
    Promise.allSettled([...imagesReady, document.fonts?.ready || Promise.resolve()]),
    new Promise(resolve => setTimeout(resolve, 3000))
  ]).then(() => { ready = true; setMotion(enabled, true); });
})();
