import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { exitHeroTitle, resetHeroTitle, initHeroBug } from './hero-bug.js';
import {
  decodeMatrixReveals,
  eraseMatrixReveals,
  hideArsenalContent,
  resetArsenalContent,
  revealArsenalContent,
} from './arsenal-sequence.js';

const HERO_INITIAL_TEXT = 'NÃO CONSTRUÍMOS APENAS SITES.';
const HERO_FINAL_TEXT = 'PROJETAMOS ATIVOS DIGITAIS IMERSIVOS DE ALTA PERFORMANCE PARA MARCAS QUE NÃO ACEITAM O PADRÃO';

function wait(ms) {
  return ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}

export function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // --- SLIDE MODE CONTROLLER ---
  const slides = document.querySelectorAll('[data-slide]');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const currentNum = document.getElementById('nav-current');
  const totalNum = document.getElementById('nav-total');
  
  let currentIndex = 0;
  let isAnimating = false;
  let isAutoplay = false;
  let autoplayTimer = null;

  if (totalNum) totalNum.innerText = String(slides.length).padStart(2, '0');

  const continueBtn = document.getElementById('continue-to-arsenal');
  window.addEventListener('app:loader-complete', () => {
    if (slides[0]) revealSlideContent(slides[0]);
  }, { once: true });

  function updateNavUI() {
    if (currentNum) currentNum.innerText = String(currentIndex + 1).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
    
    if (playPauseBtn) {
      playPauseBtn.querySelector('.hud-btn__icon').innerText = isAutoplay ? "PAUSE" : "PLAY";
      playPauseBtn.classList.toggle('is-playing', isAutoplay);
    }
  }

  async function transitionTo(index) {
    if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) {
      if (isAutoplay && index >= slides.length) toggleAutoplay(false); // Stop at end
      return;
    }
    
    isAnimating = true;
    if (autoplayTimer) clearTimeout(autoplayTimer);

    const currentSection = slides[currentIndex];
    const nextSection = slides[index];

    try {
      await cleanupSlideContent(currentSection);
      await wait(220);
      prepareSlideContent(nextSection);

      currentSection.classList.remove('active');
      nextSection.classList.add('active');

      gsap.set(currentSection, {
        opacity: 0,
        pointerEvents: 'none',
        scale: 1,
        filter: 'none',
        clearProps: 'clipPath',
      });
      gsap.set(nextSection, {
        opacity: 1,
        pointerEvents: 'auto',
        scale: 1,
        filter: 'none',
        clearProps: 'clipPath',
      });

      currentIndex = index;
      updateNavUI();

      await revealSlideContent(nextSection);
    } finally {
      isAnimating = false;
      updateNavUI();

      if (isAutoplay) {
        autoplayTimer = setTimeout(() => {
          transitionTo(currentIndex + 1);
        }, 4000);
      }
    }
  }

  function prepareSlideContent(section) {
    if (section.getAttribute('data-slide') === '1') {
      resetArsenalContent(section, gsap);
    }
  }

  async function revealSlideContent(section) {
    const type = section.getAttribute('data-slide');
    
    if (type === '0') {
      await revealHeroContent(section);
      return;
    }

    const revealTargets = section.querySelectorAll('.portfolio__item-content, .footer__big-text, .small-text, .promo-ticket, .hero__title, .hero__copy, .hero__actions, .hero__tags');
    if (revealTargets.length) {
      gsap.to(revealTargets, {
        opacity: 1,
        y: 0,
        filter: 'none',
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    const buggers = section.querySelectorAll('.hover-bug');
    buggers.forEach(el => {
      if (el._hoverBugger) el._hoverBugger.boot();
    });

    if (type === '1') {
      await revealArsenalContent(section, gsap);
      return;
    }

    await decodeMatrixReveals(section);
  }

  async function cleanupSlideContent(section) {
    const type = section.getAttribute('data-slide');

    if (type === '0') {
      await hideHeroContent(section);
    }

    if (type === '1') {
      await hideArsenalContent(section, gsap);
    }
  }

  async function revealHeroContent(section) {
    resetHeroTitle();

    const copy = section.querySelector('.hero__copy');
    const actions = section.querySelector('.hero__actions');
    const text = section.querySelector('#hero-dynamic-text');

    if (copy) gsap.set(copy, { opacity: 1, y: 0, filter: 'none' });
    if (actions) gsap.set(actions, { opacity: 0, pointerEvents: 'none', y: 0 });

    initHeroBug({ initialDelay: 250 });

    if (text?._matrixReveal) {
      text._matrixReveal.setText(HERO_INITIAL_TEXT, true);
      text.setAttribute('data-text', HERO_INITIAL_TEXT);
      await text._matrixReveal.decode();
      await wait(650);
      await text._matrixReveal.erase();
      text._matrixReveal.setText(HERO_FINAL_TEXT, true);
      text.setAttribute('data-text', HERO_FINAL_TEXT);
      await text._matrixReveal.decode();
    } else if (text) {
      text.innerText = HERO_FINAL_TEXT;
    }

    if (actions) {
      gsap.to(actions, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }

  async function hideHeroContent(section) {
    const exitTargets = section.querySelectorAll('.hero__actions');
    if (exitTargets.length) {
      gsap.to(exitTargets, {
        opacity: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.in',
      });
    }

    await Promise.all([
      exitHeroTitle(),
      eraseMatrixReveals(section),
    ]);

    const copy = section.querySelector('.hero__copy');
    if (copy) gsap.set(copy, { opacity: 0 });
  }

  function toggleAutoplay(val) {
    isAutoplay = (val !== undefined) ? val : !isAutoplay;
    updateNavUI();
    if (isAutoplay && !isAnimating) {
      transitionTo(currentIndex + 1);
    } else if (!isAutoplay && autoplayTimer) {
      clearTimeout(autoplayTimer);
    }
  }

  // Bind Controls
  if (nextBtn) nextBtn.addEventListener('click', () => { toggleAutoplay(false); transitionTo(currentIndex + 1); });
  if (prevBtn) prevBtn.addEventListener('click', () => { toggleAutoplay(false); transitionTo(currentIndex - 1); });
  if (continueBtn) continueBtn.addEventListener('click', () => { toggleAutoplay(false); transitionTo(1); });
  if (playPauseBtn) playPauseBtn.addEventListener('click', () => toggleAutoplay());

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') transitionTo(currentIndex + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') transitionTo(currentIndex - 1);
  });

  // Initialize first section
  if (slides.length) {
    slides[0].classList.add('active');
    gsap.set(slides[0], { opacity: 1, pointerEvents: "auto", scale: 1, filter: "none" });
    updateNavUI();
  }

  // --- GLOBAL EFFECTS ---
  const liquidText = document.getElementById('liquid-text');
  const feTurbulence = document.getElementById('feTurbulence');
  
  if(liquidText && feTurbulence) {
    liquidText.style.filter = 'url(#liquid-filter)';
    liquidText.addEventListener('mouseenter', () => {
      gsap.to(feTurbulence, { attr: { baseFrequency: 0.04 }, duration: 0.5, ease: "power2.out" });
    });
    liquidText.addEventListener('mouseleave', () => {
      gsap.to(feTurbulence, { attr: { baseFrequency: 0 }, duration: 1, ease: "elastic.out(1, 0.3)" });
    });
  }

  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach(marquee => {
    const speed = parseFloat(marquee.getAttribute('data-speed')) || 1;
    const inner = marquee.querySelector('.marquee__inner');
    inner.innerHTML += inner.innerHTML;
    gsap.to(inner, { xPercent: -50, ease: "none", duration: 15 / Math.abs(speed), repeat: -1 });
  });

  ScrollTrigger.refresh();
}
