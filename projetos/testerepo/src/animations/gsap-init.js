import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // --- SLIDE MODE CONTROLLER ---
  const slides = document.querySelectorAll('[data-slide]');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const currentNum = document.getElementById('nav-current');
  const totalNum = document.getElementById('nav-total');
  const bootBtn = document.getElementById('boot-system');
  
  let currentIndex = 0;
  let isAnimating = false;
  let isAutoplay = false;
  let autoplayTimer = null;
  let scanFromTop = true; // Flag for alternating scan direction

  if (totalNum) totalNum.innerText = String(slides.length).padStart(2, '0');

  function updateNavUI() {
    if (currentNum) currentNum.innerText = String(currentIndex + 1).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
    
    if (playPauseBtn) {
      playPauseBtn.querySelector('.hud-btn__icon').innerText = isAutoplay ? "PAUSE" : "PLAY";
      playPauseBtn.classList.toggle('is-playing', isAutoplay);
    }
  }

  function transitionTo(index) {
    if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) {
      if (isAutoplay && index >= slides.length) toggleAutoplay(false); // Stop at end
      return;
    }
    
    isAnimating = true;
    if (autoplayTimer) clearTimeout(autoplayTimer);

    const currentSection = slides[currentIndex];
    const nextSection = slides[index];
    const overlay = document.querySelector('.system-overlay');
    const scanner = document.querySelector('.system-overlay__scanner');

    const tl = gsap.timeline({
      onComplete: () => {
        currentSection.classList.remove('active');
        nextSection.classList.add('active');
        currentIndex = index;
        isAnimating = false;
        scanFromTop = !scanFromTop; 
        updateNavUI();
        
        // Trigger Matrix reveal on new section
        const reveals = nextSection.querySelectorAll('.matrix-reveal');
        reveals.forEach(el => {
          if (el._matrixReveal) el._matrixReveal.decode();
        });
        
        // Trigger Bugger boot on new section
        const buggers = nextSection.querySelectorAll('.hover-bug');
        buggers.forEach(el => {
          if (el._hoverBugger) el._hoverBugger.boot();
        });

        // REVEAL INTERNAL CONTENT
        revealSlideContent(nextSection);

        // Autoplay next after delay
        if (isAutoplay) {
          autoplayTimer = setTimeout(() => {
            transitionTo(currentIndex + 1);
          }, 4000); 
        }
      }
    });

    function revealSlideContent(section) {
      const type = section.getAttribute('data-slide');
      
      // Reveal all generic contents first
      gsap.to(section.querySelectorAll('.portfolio__item-content, .footer__big-text, .small-text, .promo-ticket'), {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });

      // ARSENAL TECNICO (Type 1) - SLIDE IN FROM CORNERS
      if (type === "1") {
        gsap.to(section.querySelectorAll('.bento-card'), {
          opacity: 1,
          x: 0,
          y: 0,
          stagger: 0.05,
          duration: 1.2,
          ease: "expo.out"
        });
      }

      // Special handling for Portfolio (Wireframe draw)
      if (type === "2") {
        gsap.to(section.querySelectorAll('.portfolio__spine, .portfolio__branch, .portfolio__item-border-top, .portfolio__item-border-right, .portfolio__item-border-bottom'), {
          scaleX: 1,
          scaleY: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    }

    // --- TRANSITION PARAMETERS ---
    const startScan = scanFromTop ? "0%" : "100%";
    const endScan = scanFromTop ? "100%" : "0%";
    
    // Initial States
    tl.set(overlay, { opacity: 1 });
    tl.set(scanner, { top: startScan });
    tl.set(nextSection, { 
      opacity: 1, 
      pointerEvents: "auto",
      filter: "blur(20px) brightness(2)",
      clipPath: scanFromTop ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)"
    });
    tl.set(currentSection, { clipPath: "inset(0% 0% 0% 0%)" });

    // SLOW FADE OUT HERO (If moving from Hero)
    if (currentIndex === 0) {
      tl.to(currentSection.querySelectorAll('.hero__title, .hero__copy'), {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "power2.in"
      }, 0);
    }

    // Parallel Animation
    tl.to(scanner, { top: endScan, duration: 1.5, ease: "power2.inOut" }, 0);
    
    if (scanFromTop) {
      // Top to Bottom
      tl.to(currentSection, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "power2.inOut" }, 0);
      tl.to(nextSection, { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px) brightness(1)", duration: 1.5, ease: "power2.inOut" }, 0);
    } else {
      // Bottom to Top
      tl.to(currentSection, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.5, ease: "power2.inOut" }, 0);
      tl.to(nextSection, { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px) brightness(1)", duration: 1.5, ease: "power2.inOut" }, 0);
    }

    tl.to(overlay, { opacity: 0, duration: 0.5 });
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
  if (bootBtn) bootBtn.addEventListener('click', () => { toggleAutoplay(false); transitionTo(1); });
  if (playPauseBtn) playPauseBtn.addEventListener('click', () => toggleAutoplay());

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') transitionTo(currentIndex + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') transitionTo(currentIndex - 1);
  });

  // Initialize first section
  if (slides.length) {
    slides[0].classList.add('active');
    gsap.set(slides[0], { opacity: 1, pointerEvents: "auto", clipPath: "inset(0% 0% 0% 0%)" });
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
