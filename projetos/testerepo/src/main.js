import './style.css';
import { initLenis } from './utils/lenis-init.js';
import { initGSAP } from './animations/gsap-init.js';
import { initCursor } from './animations/cursor.js';
import { initWebGLShader } from './three/image-shader.js';
import { initHackerText } from './animations/scramble.js';
import { initAccordion } from './animations/accordion.js';
import { initHeroBug } from './animations/hero-bug.js';
import { initHoverBugs } from './animations/hover-bug.js';
import { initScrollMatrix } from './animations/scroll-matrix.js';
import { initCards } from './animations/cards.js';
import { initMagneticGrids } from './animations/magnetic-grid.js';
import { initVideoScrub } from './animations/video-scrub.js';
import { gsap } from 'gsap';

async function initApp() {
  // Acessibilidade: respeita quem odeia muita animação
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // initLenis(); // Disabled for Slide Mode Test
  initGSAP();
  initCursor();
  initAccordion();
  initHackerText();
  initHeroBug();
  initHoverBugs();
  initScrollMatrix();
  initCards();
  initMagneticGrids();
  initVideoScrub();

  if (!prefersReducedMotion) {
    initWebGLShader();
  }

  // Preloader fake brutalista
  const loader = document.querySelector('.loader');
  const counter = document.querySelector('.loader__counter');
  let count = 0;

  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 20) + 10;
    if (count > 100) count = 100;
    counter.innerText = `${count}%`;

    if (count === 100) {
      clearInterval(interval);
      loader.classList.add('is-done');
      setTimeout(() => {
        document.body.classList.remove('loading');
      }, 1200);
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', initApp);
