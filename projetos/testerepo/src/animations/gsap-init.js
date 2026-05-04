import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // --- 1. FLOATING NAV AUTO-HIDE (Global Event) ---
  const nav = document.getElementById('pill-nav');
  let lastScroll = 0;
  
  if(nav) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100 && currentScroll > lastScroll) {
        nav.classList.add('is-hidden'); // Rola pra baixo -> Some
      } else {
        nav.classList.remove('is-hidden'); // Rola pra cima -> Aparece
      }
      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });
  }

  // --- 2. LIQUID FOOTER EFFECT (Global Event) ---
  const liquidText = document.getElementById('liquid-text');
  const feTurbulence = document.getElementById('feTurbulence');
  
  if(liquidText && feTurbulence) {
    liquidText.style.filter = 'url(#liquid-filter)';
    
    liquidText.addEventListener('mouseenter', () => {
      gsap.to(feTurbulence, {
        attr: { baseFrequency: 0.04 },
        duration: 0.5,
        ease: "power2.out"
      });
    });
    
    liquidText.addEventListener('mouseleave', () => {
      gsap.to(feTurbulence, {
        attr: { baseFrequency: 0 },
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    });
  }

  // --- 3. CINEMATIC BENTO ASSEMBLY (SEQUENCIAL & UNPINNED) ---
  // DOM Order: Comes after Hero, before Portfolio
  const bentoSection = document.querySelector('.bento-section');
  const bentoCards = document.querySelectorAll('.bento-card');
  const bentoHeader = document.querySelector('.bento-header');
  const bentoHeaderTitle = bentoHeader ? bentoHeader.querySelector('h2') : null;
  
  if (bentoSection && bentoCards.length) {
    // Animação e Pin unificados
    // A seção trava no topo e toda a montagem/desmontagem ocorre enquanto ela está travada.
    const bentoTL = gsap.timeline({
      scrollTrigger: {
        trigger: bentoSection,
        start: "top top", // Trava exatamente ao bater no topo
        end: "+=120%", // Duração curta para não ficar travado por muito tempo
        pin: true,
        scrub: 1 // Amarra totalmente ao scroll (descer monta, subir desmonta)
      }
    });

    // 1. Aparece o Header primeiro
    bentoTL.from(bentoHeader, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onStart: () => {
        // Dispara a decodificação Matrix do título principal "ARSENAL TÉCNICO"
        if (bentoHeaderTitle && bentoHeaderTitle._matrixReveal) {
          bentoHeaderTitle._matrixReveal.decode();
        }
      }
    });

    // 2. Montagem Orquestrada dos Cards (Sequencialmente)
    bentoCards.forEach((card, i) => {
      const contents = card.querySelectorAll('.bento-card__content');
      
      // Esconde o conteúdo interno inicialmente
      gsap.set(contents, { opacity: 0, y: 20 });

      const offscreen = [
        { x: -window.innerWidth, y: -100 }, // 0: Web Elite
        { x: 0, y: -window.innerHeight },  // 1: Exp 3D
        { x: window.innerWidth, y: -100 },  // 2: Integração LLM
        { x: 0, y: window.innerHeight }     // 3: Landing Pages
      ][i] || { x: 0, y: -200 };

      // Card voa para dentro
      bentoTL.fromTo(card, 
        { ...offscreen, opacity: 0, scale: 0.8 },
        { 
          x: 0, y: 0, opacity: 1, scale: 1,
          duration: 1.2,
          ease: "power3.out",
          onStart: () => {
            card.style.opacity = 1;
          }
        }, 
        "-=0.6" // Sobreposição agressiva para parecer veloz
      );

      // Conteúdo interno aparece + Efeito Matrix
      bentoTL.to(contents, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onStart: () => {
          // Dispara Matrix nas descrições
          const reveals = card.querySelectorAll('.matrix-reveal');
          reveals.forEach(el => {
            if (el._matrixReveal) el._matrixReveal.decode();
          });
          // Dispara o Boot Bugger no título (H3)
          const buggers = card.querySelectorAll('.hover-bug');
          buggers.forEach(el => {
            if (el._hoverBugger) el._hoverBugger.boot();
          });
        }
      }, "-=0.3"); // Começa a revelar o texto pouco antes do card parar totalmente
    });
  }

  // --- 4. PARALLAX MARQUEE ---
  // DOM Order: Comes after Bento, before Portfolio
  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach(marquee => {
    const speed = parseFloat(marquee.getAttribute('data-speed')) || 1;
    const inner = marquee.querySelector('.marquee__inner');
    
    // Duplica o conteúdo pra loop contínuo
    inner.innerHTML += inner.innerHTML;

    gsap.to(inner, {
      xPercent: -50,
      ease: "none",
      duration: 10 / Math.abs(speed),
      repeat: -1
    });

    // Acelera no Scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.to(inner, {
          x: () => -self.getVelocity() * 0.1 * speed,
          duration: 0.5,
          ease: "power3.out"
        });
      }
    });
  });

  // --- 5. WIREFRAME REVEAL (PORTFOLIO) ---
  // DOM Order: Comes after Marquee, before About
  const portfolioSection = document.querySelector('.portfolio');
  const portfolioSpine = document.querySelector('.portfolio__spine');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  if (portfolioSection && portfolioSpine && portfolioItems.length) {
    const tlPort = gsap.timeline({
      scrollTrigger: {
        trigger: portfolioSection,
        start: "top 60%", // Inicia quando a seção chega a 60% da tela
      }
    });

    // A espinha dorsal desce
    tlPort.to(portfolioSpine, { scaleY: 1, duration: 1.5, ease: "power3.inOut" });

    // Construção progressiva de cada item
    portfolioItems.forEach((item, i) => {
      const branch = item.querySelector('.portfolio__branch');
      const topBorder = item.querySelector('.portfolio__item-border-top');
      const rightBorder = item.querySelector('.portfolio__item-border-right');
      const bottomBorder = item.querySelector('.portfolio__item-border-bottom');
      const content = item.querySelector('.portfolio__item-content');

      const startTime = (i + 1) * (1.5 / (portfolioItems.length + 1));
      
      // Sequência de desenho do wireframe (efeito cobra)
      tlPort.to(branch, { scaleX: 1, duration: 0.3, ease: "power2.out" }, startTime);
      tlPort.to(topBorder, { scaleX: 1, duration: 0.3, ease: "power2.out" }, startTime + 0.15);
      tlPort.to(rightBorder, { scaleY: 1, duration: 0.2, ease: "power2.out" }, startTime + 0.3);
      tlPort.to(bottomBorder, { scaleX: 1, duration: 0.3, ease: "power2.out" }, startTime + 0.45);
      
      // Conteúdo aparece
      tlPort.to(content, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, startTime + 0.6);
      
      tlPort.add(() => {
        const titleBug = item.querySelector('.hover-bug');
        if (titleBug && titleBug._hoverBugger) titleBug._hoverBugger.boot();
      }, startTime + 0.8);
    });
  }

  // --- 6. REVEALS NA SEÇÃO ABOUT (SPLIT SCREEN) ---
  const aboutSection = document.querySelector('.about');
  const promoStack = document.querySelector('.promo-stack');
  const aboutBio = document.querySelector('.about__bio');
  
  if (aboutSection) {
    // Animação da Pilha de Tickets entrando
    if (promoStack) {
      gsap.from(promoStack.querySelectorAll('.promo-ticket'), {
        y: 100,
        opacity: 0,
        rotate: 15,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutSection, // Trigger on section entry
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }

    // Animação da Bio (fade in por parágrafo)
    if (aboutBio) {
      gsap.from(aboutBio.querySelectorAll('.small-text'), {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: aboutSection, // Trigger on section entry
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }
  }

  // --- 7. FOOTER REVEAL IMERSIVO ---
  // DOM Order: Last element
  gsap.fromTo('.footer__big-text', 
    { scale: 0.8, opacity: 0 },
    { 
      scale: 1, opacity: 1, 
      scrollTrigger: {
        trigger: ".footer",
        start: "top bottom",
        end: "center center",
        scrub: 1
      }
    }
  );

  // Força uma atualização final para garantir que todas as geometrias estejam calculadas
  ScrollTrigger.refresh();
}
